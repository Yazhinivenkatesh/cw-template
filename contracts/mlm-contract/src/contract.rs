#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    to_binary, Addr, Binary, Deps, DepsMut, Env, MessageInfo, Order, Response, StdResult, Uint128,
};
pub use cw20::{Cw20ExecuteMsg, Cw20QueryMsg};

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, PlanResponse, QueryMsg, ReferralResponse};
use crate::state::{
    AdminInfo, Levels, PlanDetail, PlanRecord, Referral, ReferralDatas, ADMIN_INFO, PLAN_INFO,
    REFERRAL,
};

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let admin = AdminInfo { admin: msg.admin };
    ADMIN_INFO.save(deps.storage, &admin)?;

    Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::AddPlan { name, price } => add_plan(deps, _env, info, name, price),
        ExecuteMsg::AddReferral { referrer } => add_referral(deps, _env, info, referrer),
        ExecuteMsg::PayReferral { plan_name } => pay_referral(deps, _env, info, plan_name),
    }
}

pub fn add_plan(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    name: String,
    price: Uint128,
) -> Result<Response, ContractError> {
    if price == Uint128::zero() {
        return Err(ContractError::InvalidZeroAmount {});
    }

    let config = ADMIN_INFO.load(deps.storage)?;
    if config.admin != info.sender {
        return Err(ContractError::Unauthorized {});
    }
    let plan_name = name.to_lowercase();

    if PLAN_INFO.may_load(deps.storage)?.is_some() {
        let mut plan_record = PLAN_INFO.load(deps.storage)?;
        if plan_record
            .plans
            .iter()
            .any(|p| p.name == plan_name)
        {
            return Err(ContractError::CustomError {
                val: "Plan already exists".to_string(),
            });
        }

        plan_record.plans.push(PlanDetail {
            name: String::from(&plan_name),
            price: price,
        });
        PLAN_INFO.save(deps.storage, &plan_record)?;
    } else {
        let record = PlanRecord {
            plans: vec![PlanDetail {
                name: String::from(&plan_name),
                price: price,
            }],
        };
        PLAN_INFO.save(deps.storage, &record)?;
    };

    Ok(Response::new().add_attribute("status", "success".to_string()))
}

pub fn add_referral(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    referrer: Addr,
) -> Result<Response, ContractError> {
    let referrer = deps.api.addr_validate(&referrer.to_string())?;
    if referrer.to_string().is_empty() == true {
        return Err(ContractError::InvalidAddress {});
    }
    if referrer == info.sender {
        return Err(ContractError::InvalidReferrer {});
    }

    if REFERRAL.has(deps.storage, info.sender.clone()) {
        let user_info = REFERRAL.load(deps.storage, info.sender.clone())?;
        if user_info.referrer_address.to_string() != "" {
            return Err(ContractError::CustomError {
                val: "Referral cannot be one of referrer uplines".to_uppercase(),
            });
        }
    }

    let mut depth = 1;

    let mut parent_account = referrer.clone();

    if REFERRAL.has(deps.storage, referrer.clone()) {
        let ref_info = REFERRAL.load(deps.storage, referrer.clone())?;
        depth = ref_info.referral_depth + 1;

        REFERRAL.update(deps.storage, referrer.clone(), |op| match op {
            None => Err(ContractError::CustomError {
                val: "Referrer does not exist 0".to_uppercase(),
            }),
            Some(mut ref_data) => {
                ref_data.referral_width += Uint128::from(1u128);
                Ok(ref_data)
            }
        })?;

        let temp_referral_detail = Referral {
            referral: info.sender.clone(),
            referrer: parent_account.clone(),
            amount_paid: Uint128::from(0u128),
        };

        for index in 0..depth {
            REFERRAL.update(deps.storage, parent_account.clone(), |op| match op {
                None => Err(ContractError::CustomError {
                    val: "Referrer does not exist".to_uppercase(),
                }),
                Some(mut parent_info) => {
                    let level_count = index + 1;

                    if level_count as usize <= parent_info.user_referrals.len() {
                        parent_info.user_referrals.iter_mut().for_each(|level| {
                            if level.level_count == Uint128::from(level_count) {
                                level.referrals.push(temp_referral_detail.clone());
                            }
                        });
                    } else {
                        let refs = Levels {
                            level_count: Uint128::from(level_count),
                            referrals: vec![temp_referral_detail.clone()],
                        };
                        parent_info.user_referrals.push(refs);
                    }
                    Ok(parent_info)
                }
            })?;
            let parent_detail = REFERRAL.load(deps.storage, parent_account.clone())?;
            parent_account = parent_detail.referrer_address.clone();
        }
    } else {
        let config = ADMIN_INFO.load(deps.storage)?;
        let admin = config.admin;

        let records = ReferralDatas {
            address: referrer.clone(),
            referrer_address: admin.clone(),
            referral_depth: 0,
            referral_width: Uint128::from(1u128),
            commission_paid: Uint128::from(0u128),
            is_paid: false,
            plan_name: String::from(""),
            user_referrals: vec![Levels {
                level_count: Uint128::from(1u128),
                referrals: vec![Referral {
                    referral: info.sender.clone(),
                    referrer: referrer.clone(),
                    amount_paid: Uint128::from(0u128),
                }],
            }],
        };
        REFERRAL.save(deps.storage, referrer.clone(), &records)?;
    }

    let records = ReferralDatas {
        address: info.sender.clone(),
        referrer_address: referrer.clone(),
        referral_depth: depth,
        referral_width: Uint128::from(0u128),
        commission_paid: Uint128::from(0u128),
        is_paid: false,
        plan_name: String::from(""),
        user_referrals: vec![],
    };

    REFERRAL.save(deps.storage, info.sender.clone(), &records)?;
    Ok(Response::new().add_attribute("status", "success".to_string()))
}

pub fn pay_referral(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    plan_name: String,
) -> Result<Response, ContractError> {
    let plan_name = plan_name.to_lowercase();
    let plan_record = PLAN_INFO.load(deps.storage)?;
    if plan_record.plans.iter().any(|p| p.name == plan_name) == false {
        return Err(ContractError::CustomError {
            val: "Plan does not exist".to_string(),
        });
    }

    let user_info = REFERRAL.load(deps.storage, info.sender.clone())?;
    if user_info.is_paid == true {
        return Err(ContractError::CustomError {
            val: "User already paid".to_string(),
        });
    }

    let plan_detail = plan_record
        .plans
        .iter()
        .find(|p| p.name == plan_name)
        .unwrap();
    let plan_price = plan_detail.price;

    let mut parent_account = user_info.referrer_address.clone();
    let admin_account = ADMIN_INFO.load(deps.storage)?.admin;

    let token_address = "juno1xt4ahzz2x8hpkc0tk6ekte9x6crw4w6u0r67cyt3kz9syh24pd7sdhvvr0";
    let user = info.sender().to_string();

    let msg = Cw20QueryMsg::Balance { address: user };

    let request = WasmQuery::Smart {
        contract_addr: token_address.to_string(),
        msg: to_binary(&msg)?,
    };
    let response: cw20::BalanceResponse =
    deps.querier.query(&QueryRequest::Wasm(request))?;

    let balance = Ok(Response::new()
        .add_attribute("balance", response.balance))

    Ok(Response::new().add_attribute("status", "success".to_string()))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetAllPlans {} => to_binary(&query_all_plans(deps)?),
        QueryMsg::PlanDetail { name } => to_binary(&query_plan_info(deps, name)?),
        QueryMsg::GetReferralInfo { address } => to_binary(&query_referral_info(deps, address)?),
        QueryMsg::GetAllReferralDatas {} => to_binary(&query_all_referrals(deps)?),
    }
}

fn query_all_plans(deps: Deps) -> StdResult<PlanResponse> {
    Ok(PlanResponse {
        plans: PLAN_INFO.load(deps.storage)?.plans,
    })
}

fn query_plan_info(deps: Deps, name: String) -> StdResult<PlanResponse> {
    PLAN_INFO
        .may_load(deps.storage)?
        .map(|plan_record| {
            let mut plans = plan_record.plans;
            plans.retain(|plan| plan.name == name);
            Ok(PlanResponse { plans })
        })
        .unwrap_or_else(|| Ok(PlanResponse { plans: vec![] }))
}

fn query_referral_info(deps: Deps, addr: Addr) -> StdResult<ReferralDatas> {
    REFERRAL.load(deps.storage, addr.into())
}

fn query_all_referrals(deps: Deps) -> StdResult<ReferralResponse> {
    let all: StdResult<Vec<(Vec<u8>, ReferralDatas)>> = REFERRAL
        .range(deps.storage, None, None, Order::Ascending)
        .collect();
    all.map(|p| {
        let res = p.into_iter().map(|x| x.1).collect();

        ReferralResponse {
            referral_datas: res,
        }
    })
}

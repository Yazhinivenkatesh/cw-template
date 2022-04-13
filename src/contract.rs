#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Uint128,
};
pub use cw20::{Cw20ExecuteMsg, Cw20QueryMsg};

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, PlanResponse, QueryMsg};
use crate::state::{AdminInfo, PlanDetail, PlanRecord, ADMIN_INFO, PLAN_INFO};
// version info for migration info
// const CONTRACT_NAME: &str = "crates.io:mlm-contract";
// const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

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
    
    if PLAN_INFO.may_load(deps.storage)?.is_some() {
        
        let mut plan_record = PLAN_INFO.load(deps.storage)?;
        if plan_record.plans.iter().any(|p| p.name == name) {
            return Err(ContractError::CustomError { val: "Plan already exists".to_string() });
        }

        plan_record.plans.push(PlanDetail {
            name: String::from(&name),
            price: price,
        });
        PLAN_INFO.save(deps.storage, &plan_record)?;
    } else {
        let record = PlanRecord {
            plans: vec![PlanDetail {
                name: String::from(&name),
                price: price,
            }],
        };
        PLAN_INFO.save(deps.storage, &record)?;
    };

    Ok(Response::new().add_attribute("status", "success".to_string()))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetAllPlans {} => to_binary(&query_all_plans(deps)?),
        QueryMsg::PlanDetail { name } => to_binary(&query_plan_info(deps, name)?),
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

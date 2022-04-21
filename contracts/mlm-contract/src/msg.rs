use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use cosmwasm_std::{Uint128, Addr};
use crate::state::{PlanDetail, ReferralDatas};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub admin: Addr,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    AddPlan { name: String, price: Uint128 },
    AddReferral { referrer: Addr },
    PayReferral { plan_name: String },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    PlanDetail { name: String},
    GetAllPlans {},
    GetReferralInfo { address: Addr },
    GetAllReferralDatas {},

}

// We define a custom struct for each query response
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct PlanResponse {
    pub plans: Vec<PlanDetail>
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct ReferralResponse {
    pub referral_datas: Vec<ReferralDatas>
}


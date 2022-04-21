use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

// use cw_storage_plus::Item; 
// import string key from storage plus
use cw_storage_plus::{Item, Map};
use cosmwasm_std::{Uint128, Addr, Storage};
use cosmwasm_storage::{
    bucket, bucket_read, Bucket, ReadonlyBucket,
};



pub static CONFIG_KEY: &[u8] = b"config";
pub static ADMIN_RESOLVER_KEY: &[u8] = b"adminresolver";
pub static ADDRESS_RESOLVER_KEY: &[u8] = b"addressresolver";

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct PlanDetail {
    pub name: String,
    pub price: Uint128,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct AdminInfo {
    pub admin: Addr,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct PlanRecord {
    pub plans: Vec<PlanDetail>
}

pub fn resolver(storage: &mut dyn Storage) -> Bucket<PlanRecord> {
    bucket(storage, ADMIN_RESOLVER_KEY)
}

pub fn resolver_read(storage: &dyn Storage) -> ReadonlyBucket<PlanRecord> {
    bucket_read(storage, ADMIN_RESOLVER_KEY)
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct ReferralDatas {
    pub address: Addr,
    pub referrer_address: Addr,
    pub referral_width: Uint128,
    pub referral_depth: u64,
    pub plan_name: String,
    pub commission_paid: Uint128,
    pub is_paid: bool,
    pub user_referrals: Vec<Levels>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Levels {
    pub level_count: Uint128,
    pub referrals: Vec<Referral>,
    // pub exist: bool,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Referral {
    pub referral: Addr,
    pub referrer: Addr,
    pub amount_paid: Uint128,
}

pub fn referral(storage: &mut dyn Storage) -> Bucket<ReferralDatas> {
    bucket(storage, ADDRESS_RESOLVER_KEY)
}

pub fn referral_read(storage: &dyn Storage) -> ReadonlyBucket<ReferralDatas> {
    bucket_read(storage, ADDRESS_RESOLVER_KEY)
}

pub const REFERRAL: Map<Addr, ReferralDatas> = Map::new("referral");
pub const PLAN_INFO: &Item<PlanRecord> = &Item::new("plan_info");
pub const ADMIN_INFO: &Item<AdminInfo> = &Item::new("admin_info");

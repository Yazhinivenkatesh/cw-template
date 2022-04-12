use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cw_storage_plus::Item;
use cosmwasm_std::{Uint128, Addr, Coin, Storage};
use cosmwasm_storage::{
    bucket, bucket_read, singleton, singleton_read, Bucket, ReadonlyBucket, ReadonlySingleton,
    Singleton,
};



pub static CONFIG_KEY: &[u8] = b"config";
pub static ADMIN_RESOLVER_KEY: &[u8] = b"planresolver";

// #[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
// pub struct PlanInfo {
//     pub plans: Vec<PlanDetail>,
// }

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

// pub fn resolver(storage: &mut dyn Storage) -> Bucket<AdminInfo> {
//     bucket(storage, ADMIN_RESOLVER_KEY)
// }

pub const PLAN_INFO: &Item<PlanRecord> = &Item::new("plan_info");
pub const ADMIN_INFO: &Item<AdminInfo> = &Item::new("admin_info");

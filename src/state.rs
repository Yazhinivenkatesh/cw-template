use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::Addr;
use cw_storage_plus::Item;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct NameInfo {
    pub name: String,
    pub admin: Addr,
}

pub const NAME_INFO: Item<NameInfo> = Item::new("name_info");

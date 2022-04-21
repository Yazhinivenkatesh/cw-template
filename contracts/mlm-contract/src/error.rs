use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("Custom Error val: {val:?}")]
    CustomError{val: String},

    #[error("Name Already Exist (name {name})")]
    NameExist { name: String },

    #[error("Invalid zero amount")]
    InvalidZeroAmount {},

    #[error("Invalid Address")]
    InvalidAddress {},

    #[error("REFERRAL CANNOT BE HIS OWN REFERRER")]
    InvalidReferrer {},

    // Add any other custom errors you like here.
    // Look at https://docs.rs/thiserror/1.0.21/thiserror/ for details.
}

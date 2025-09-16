#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, Map, String, panic_with_error};
use soroban_sdk::token::Interface as TokenInterface;

#[contract]
pub struct RealEstateTokenContract;

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum Error {
    Unauthorized,
    InsufficientBalance,
    PropertyExists,
    InvalidProperty,
    InvalidAmount,
}

impl From<Error> for soroban_sdk::Error {
    fn from(e: Error) -> Self {
        match e {
            Error::Unauthorized => soroban_sdk::Error::from_contract_error(1001),
            Error::InsufficientBalance => soroban_sdk::Error::from_contract_error(1002),
            Error::PropertyExists => soroban_sdk::Error::from_contract_error(1003),
            Error::InvalidProperty => soroban_sdk::Error::from_contract_error(1004),
            Error::InvalidAmount => soroban_sdk::Error::from_contract_error(1005),
        }
    }
}

#[contractimpl]
impl RealEstateTokenContract {
    /// Initialize the contract with admin and token details
    pub fn initialize(e: Env, admin: Address, name: String, symbol: String, decimal: u32, total_supply: i128) {
        e.storage().instance().set(&"admin", &admin);
        e.storage().instance().set(&"name", &name);
        e.storage().instance().set(&"symbol", &symbol);
        e.storage().instance().set(&"decimal", &decimal);
        e.storage().instance().set(&"total_supply", &total_supply);
        
        // Initialize admin balance with total supply
        let mut balances: Map<Address, i128> = Map::new(&e);
        balances.set(admin.clone(), total_supply);
        e.storage().instance().set(&"balances", &balances);
        
        // Initialize protocol fee settings (default 0%)
        e.storage().instance().set(&"protocol_fee_bps", &0u32);
        e.storage().instance().set(&"fee_wallet", &admin);
    }

    /// Transfer tokens with protocol fee
    pub fn transfer_with_fee(
        e: Env,
        from: Address,
        to: Address,
        amount: i128,
    ) {
        from.require_auth();
        
        if amount <= 0 {
            panic_with_error!(&e, Error::InvalidAmount);
        }

        let protocol_fee_bps: u32 = e.storage().instance().get(&"protocol_fee_bps").unwrap_or(0);
        let fee_wallet: Address = e.storage().instance().get(&"fee_wallet").unwrap();
        
        // Calculate protocol fee
        let fee_amount = (amount * protocol_fee_bps as i128) / 10000;
        let net_amount = amount - fee_amount;

        let mut balances: Map<Address, i128> = e.storage().instance().get(&"balances").unwrap();

        // Check and update sender balance
        let from_balance = balances.get(from.clone()).unwrap_or(0);
        if from_balance < amount {
            panic_with_error!(&e, Error::InsufficientBalance);
        }
        balances.set(from.clone(), from_balance - amount);

        // Apply protocol fee
        if fee_amount > 0 {
            let fee_balance = balances.get(fee_wallet.clone()).unwrap_or(0);
            balances.set(fee_wallet.clone(), fee_balance + fee_amount);
        }

        // Update receiver balance
        let to_balance = balances.get(to.clone()).unwrap_or(0);
        balances.set(to.clone(), to_balance + net_amount);

        e.storage().instance().set(&"balances", &balances);

        e.events().publish(
            ("transfer",),
            (from, to, amount, fee_amount),
        );
    }

    /// Get balance of an address
    pub fn get_balance(e: Env, owner: Address) -> i128 {
        let balances: Map<Address, i128> = e.storage().instance().get(&"balances").unwrap();
        balances.get(owner).unwrap_or(0)
    }

    /// Get total supply
    pub fn get_total_supply(e: Env) -> i128 {
        e.storage().instance().get(&"total_supply").unwrap()
    }

    /// Get token metadata
    pub fn get_metadata(e: Env) -> (String, String, u32) {
        let name: String = e.storage().instance().get(&"name").unwrap();
        let symbol: String = e.storage().instance().get(&"symbol").unwrap();
        let decimal: u32 = e.storage().instance().get(&"decimal").unwrap();
        (name, symbol, decimal)
    }

    /// Set protocol fee (admin only)
    pub fn set_protocol_fee(e: Env, admin: Address, fee_bps: u32, fee_wallet: Address) {
        admin.require_auth();
        
        let stored_admin: Address = e.storage().instance().get(&"admin").unwrap();
        if admin != stored_admin {
            panic_with_error!(&e, Error::Unauthorized);
        }

        if fee_bps > 1000 { // Max 10% fee
            panic_with_error!(&e, Error::InvalidAmount);
        }

        e.storage().instance().set(&"protocol_fee_bps", &fee_bps);
        e.storage().instance().set(&"fee_wallet", &fee_wallet);

        e.events().publish(
            ("protocol_fee_updated",),
            (fee_bps, fee_wallet),
        );
    }
}

// Implementação CORRETA da interface de token padrão
#[contractimpl]
impl TokenInterface for RealEstateTokenContract {
    fn allowance(_e: Env, _from: Address, _spender: Address) -> i128 {
        // Não implementado - retorna 0 (sem allowance)
        0
    }

    fn approve(_e: Env, _from: Address, _spender: Address, _amount: i128, _expiration_ledger: u32) {
        // Não implementado neste contrato
        panic_with_error!(&_e, Error::Unauthorized);
    }

    fn balance(e: Env, id: Address) -> i128 {
        RealEstateTokenContract::get_balance(e, id)
    }

    fn transfer(e: Env, from: Address, to: Address, amount: i128) {
        RealEstateTokenContract::transfer_with_fee(e, from, to, amount);
    }

    fn transfer_from(_e: Env, _spender: Address, _from: Address, _to: Address, _amount: i128) {
        // Não implementado
        panic_with_error!(&_e, Error::Unauthorized);
    }

    fn burn(_e: Env, _from: Address, _amount: i128) {
        // Não implementado
        panic_with_error!(&_e, Error::Unauthorized);
    }

    fn burn_from(_e: Env, _spender: Address, _from: Address, _amount: i128) {
        // Não implementado
        panic_with_error!(&_e, Error::Unauthorized);
    }

    fn decimals(e: Env) -> u32 {
        let decimal: u32 = e.storage().instance().get(&"decimal").unwrap();
        decimal
    }

    fn name(e: Env) -> String {
        let name: String = e.storage().instance().get(&"name").unwrap();
        name
    }

    fn symbol(e: Env) -> String {
        let symbol: String = e.storage().instance().get(&"symbol").unwrap();
        symbol
    }
}
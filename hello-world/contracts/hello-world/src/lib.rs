#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Bytes, Env, Map, String, panic_with_error};

#[contract]
pub struct RealEstateTokenContract;

// Defina um enum de erro apropriado em vez de usar ()
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum Error {
    Unauthorized,
    InsufficientBalance,
    PropertyExists,
    InvalidProperty,
}

// Implemente a conversão para soroban_sdk::Error
impl From<Error> for soroban_sdk::Error {
    fn from(e: Error) -> Self {
        match e {
            Error::Unauthorized => soroban_sdk::Error::from_contract_error(1001),
            Error::InsufficientBalance => soroban_sdk::Error::from_contract_error(1002),
            Error::PropertyExists => soroban_sdk::Error::from_contract_error(1003),
            Error::InvalidProperty => soroban_sdk::Error::from_contract_error(1004),
        }
    }
}

#[contractimpl]
impl RealEstateTokenContract {
    /// Initialize the contract with admin and protocol fee settings
    pub fn initialize(e: Env, admin: Address) {
        e.storage().instance().set(&"admin", &admin);
        e.storage().instance().set(&"next_property_id", &1u128);
    }

    /// Register a new property (only by authorized builders)
    pub fn register_property(
        e: Env,
        builder: Address,
        property_name: String, //ID
        total_supply: i128,
        property_data: Bytes, // JSON with property details
    ) -> u128 {
        builder.require_auth();
        
        // Verify builder is authorized (could add builder whitelist)
        Self::_verify_builder(&e, &builder);

        let next_id: u128 = e.storage().instance().get(&"next_property_id").unwrap();
        
        // Store property metadata
        let mut properties: Map<u128, Bytes> = e.storage().instance().get(&"properties").unwrap_or(Map::new(&e));
        properties.set(next_id, property_data);
        e.storage().instance().set(&"properties", &properties);

        // Store property info
        let mut property_info: Map<u128, (String, i128, Address)> = e.storage().instance().get(&"property_info").unwrap_or(Map::new(&e));
        property_info.set(next_id, (property_name.clone(), total_supply, builder.clone()));
        e.storage().instance().set(&"property_info", &property_info);

        // Initialize balances for the builder
        let mut balances: Map<(Address, u128), i128> = e.storage().instance().get(&"balances").unwrap_or(Map::new(&e));
        balances.set((builder.clone(), next_id), total_supply);
        e.storage().instance().set(&"balances", &balances);
        

        // Update next property ID
        e.storage().instance().set(&"next_property_id", &(next_id + 1));

        e.events().publish(
            ("property_registered", next_id),
            (builder, property_name, total_supply),
        );

        next_id
    }

    /// Get property details
    pub fn get_property(e: Env, property_id: u128) -> (String, i128, Address, Bytes) {
        let property_info: Map<u128, (String, i128, Address)> = e.storage().instance().get(&"property_info").unwrap_or(Map::new(&e));
        let properties: Map<u128, Bytes> = e.storage().instance().get(&"properties").unwrap_or(Map::new(&e));
        
        let (name, supply, builder) = property_info.get(property_id).unwrap_or_else(|| panic_with_error!(&e, Error::InvalidProperty));
        let metadata = properties.get(property_id).unwrap_or_else(|| panic_with_error!(&e, Error::InvalidProperty));
        
        (name, supply, builder, metadata)
    }

    /// Transfer property tokens with protocol fee
    pub fn transfer_property(
        e: Env,
        from: Address,
        to: Address,
        property_id: u128,
        amount: i128,
    ) {
        from.require_auth();
        
        let protocol_fee_bps: u32 = e.storage().instance().get(&"protocol_fee_bps").unwrap_or(0);
        let fee_wallet: Address = e.storage().instance().get(&"fee_wallet").unwrap_or_else(|| panic_with_error!(&e, Error::InvalidProperty));
        
        // Calculate protocol fee
        let fee_amount = (amount * protocol_fee_bps as i128) / 10000;
        let net_amount = amount - fee_amount;

        let mut balances: Map<(Address, u128), i128> = e.storage().instance().get(&"balances").unwrap_or(Map::new(&e));

        // Check and update sender balance
        let from_balance = balances.get((from.clone(), property_id)).unwrap_or(0);
        if from_balance < amount {
            panic_with_error!(&e, Error::InsufficientBalance);
        }
        balances.set((from.clone(), property_id), from_balance - amount);

        // Apply protocol fee
        if fee_amount > 0 {
            let fee_balance = balances.get((fee_wallet.clone(), property_id)).unwrap_or(0);
            balances.set((fee_wallet.clone(), property_id), fee_balance + fee_amount);
        }

        // Update receiver balance
        let to_balance = balances.get((to.clone(), property_id)).unwrap_or(0);
        balances.set((to.clone(), property_id), to_balance + net_amount);

        e.storage().instance().set(&"balances", &balances);

        e.events().publish(
            ("property_transfer", property_id),
            (from, to, amount, fee_amount),
        );
    }

    /// Verify builder authorization (internal function)
    fn _verify_builder(e: &Env, builder: &Address) {
        // Implement builder whitelist logic here
        let admin: Address = e.storage().instance().get(&"admin").unwrap_or_else(|| panic_with_error!(e, Error::InvalidProperty));
        // For now, only admin can register properties
        if *builder != admin {
            panic_with_error!(e, Error::Unauthorized);
        }
    }
}
#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, panic_with_error, Address, Env, Map, String,
};

#[contract]
pub struct RealEstateTokenContract;

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum Error {
    Unauthorized,
    InsufficientBalance,
    PropertyExists,
    InvalidProperty,
}

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

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Property {
    pub id: u128,
    pub builder: Address,
    pub name_property: String,
    pub ele_quer: i128,
    pub ele_tem: i128,
    pub total_supply: i128,
    pub nome_construtora: String,
    pub ipfs: String, 
    pub sigla: String,
}

#[contractimpl]
impl RealEstateTokenContract {
    pub fn initialize(env: Env, admin: Address) {
        env.storage().instance().set(&"admin", &admin);
        env.storage().instance().set(&"next_property_id", &1u128);
    }

    fn get_properties_storage(env: &Env) -> Map<u128, Property> {
        env.storage()
            .instance()
            .get(&"properties")
            .unwrap_or(Map::new(env))
    }


    pub fn register_property(
        env: Env,
        builder: Address,
        property_name: String,
        ele_quer: i128,
        ele_tem: i128,
        total_supply: i128,
        nome_construtora: String,
        ipfs: String,
        sigla: String

    ) -> u128 {
        builder.require_auth();
        Self::_verify_builder(&env, &builder);

        let next_id: u128 = env
            .storage()
            .instance()
            .get(&"next_property_id")
            .unwrap();

        let property = Property {
            id: next_id,
            builder: builder.clone(),
            name: property_name.clone(),
            ele_quer,
            ele_tem,
            total_supply,
            nome_construtora,
            ipfs,
            sigla
        };

        let mut properties = Self::get_properties_storage(&env);
        properties.set(next_id, property);
        env.storage().instance().set(&"properties", &properties);

        let mut balances: Map<(Address, u128), i128> = env
            .storage()
            .instance()
            .get(&"balances")
            .unwrap_or(Map::new(&env));
        balances.set((builder.clone(), next_id), total_supply);
        env.storage().instance().set(&"balances", &balances);

        env.storage()
            .instance()
            .set(&"next_property_id", &(next_id + 1));

        env.events().publish(
            ("property_registered", next_id),
            (builder, property_name, total_supply),
        );

        next_id
    }

    pub fn get_property(env: Env, property_id: u128) -> Property {
        let properties: Map<u128, Property> = Self::get_properties_storage(&env);
        let property = properties
            .get(property_id)
            .unwrap_or_else(|| panic_with_error!(&env, Error::InvalidProperty));
        property
    }


    pub fn transfer_property(
        env: Env,
        from: Address,
        to: Address,
        property_id: u128,
        amount: i128,
    ) {
        from.require_auth();

        if amount <= 0 {
            panic_with_error!(&env, Error::InsufficientBalance);
        }

        // Verificar se a propriedade existe
        let properties = Self::get_properties_storage(&env);
        if !properties.contains_key(property_id) {
            panic_with_error!(&env, Error::InvalidProperty);
        }

        let mut balances: Map<(Address, u128), i128> = env
            .storage()
            .instance()
            .get(&"balances")
            .unwrap_or(Map::new(&env));

        // Obter saldo atual do remetente
        let from_balance = balances.get((from.clone(), property_id)).unwrap_or(0);
        if from_balance < amount {
            panic_with_error!(&env, Error::InsufficientBalance);
        }

        // Atualizar saldo do remetente
        let new_from_balance = from_balance - amount;
        if new_from_balance > 0 {
            balances.set((from.clone(), property_id), new_from_balance);
        } else {
            balances.remove((from.clone(), property_id));
        }

        // Atualizar saldo do destinatário
        let to_balance = balances.get((to.clone(), property_id)).unwrap_or(0);
        balances.set((to.clone(), property_id), to_balance + amount);

        // Salvar balanços atualizados
        env.storage().instance().set(&"balances", &balances);

        // Emitir evento de transferência
        env.events().publish(
            ("property_transferred", property_id),
            (from, to, amount),
        );
    }

    pub fn balance(investment: i128, property: Property) -> i128{
        let price = Self::price(property: Property)
        investment/price
    }

    pub fn price(property: Property) -> i128{
        property.ele_quer/property.total_supply
    }

    pub fn percentual(property: Property) -> u128{
        property.ele_tem/property.ele_quer
    }

    fn _verify_builder(env: &Env, builder: &Address) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&"admin")
            .unwrap_or_else(|| panic_with_error!(env, Error::InvalidProperty));
        if *builder != admin {
            panic_with_error!(env, Error::Unauthorized);
        }
    }
}

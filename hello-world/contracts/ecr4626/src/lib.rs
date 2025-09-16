#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, String};
use chrono::{Datelike, Duration, Local, NaiveDate};
use crate::ecr1155::Property;

mod ecr1155 {
    soroban_sdk::contractimport!(file = "../../target/wasm32v1-none/release/ecr1155.wasm");
}

#[contract]
pub struct LoanContract;

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum Error {
    Unauthorized,
    InsufficientBalance,
    LoanNotFound,
    InvalidTerms,
    LoanNotActive,
    LoanAlreadyRepaid,
    CollateralNotSet,
    InvalidCollateralAmount,
    TokensAlreadyLocked,
    LoanNotFullyFunded,
    LoanNotMatured,
}

impl From<Error> for soroban_sdk::Error {
    fn from(e: Error) -> Self {
        match e {
            Error::Unauthorized => soroban_sdk::Error::from_contract_error(2001),
            Error::InsufficientBalance => soroban_sdk::Error::from_contract_error(2002),
            Error::LoanNotFound => soroban_sdk::Error::from_contract_error(2003),
            Error::InvalidTerms => soroban_sdk::Error::from_contract_error(2004),
            Error::LoanNotActive => soroban_sdk::Error::from_contract_error(2005),
            Error::LoanAlreadyRepaid => soroban_sdk::Error::from_contract_error(2006),
            Error::CollateralNotSet => soroban_sdk::Error::from_contract_error(2007),
            Error::InvalidCollateralAmount => soroban_sdk::Error::from_contract_error(2008),
            Error::TokensAlreadyLocked => soroban_sdk::Error::from_contract_error(2009),
            Error::LoanNotFullyFunded => soroban_sdk::Error::from_contract_error(2010),
            Error::LoanNotMatured => soroban_sdk::Error::from_contract_error(2011),
        }
    }
}


pub fn str_to_address(e: &Env, s: &str) -> Address {
    // Convert &str → soroban_sdk::String → Address
    Address::from_string(&String::from_str(e, s))
}

#[contractimpl]
impl LoanContract {
    /// Initialize the loan contract with admin and RWA token address
    pub fn initialize(e: Env, admin: Address, rwa_token_address: Address) {
        e.storage().instance().set(&"admin", &admin);
        e.storage().instance().set(&"rwa_token", &rwa_token_address);
        e.storage().instance().set(&"next_borrow_id", &1u128);
        e.storage().instance().set(&"next_loan_id", &1u128);
    }
    fn adicionar_dias(dias: i64) -> String {
        let hoje = Local::now();
        let nova_data = hoje + Duration::days(dias);
        
        format!("{:02}/{:02}/{:04}", nova_data.day(), nova_data.month(), nova_data.year())
    }

    pub fn create_borrow(e: Env, builder: Address, property_id: u128, duration_days: u32, apy: u32) -> u128   {
        let ecr1155_client = ecr1155::Client::new(&e, &str_to_address(&e, "CD7MWUED4MXNKY3ADSWJREYWK6AFRHH2ZNCEBIRN5UZBSZLFKZHYIRLH"));
        let property = ecr1155_client.get_property(&property_id);

        let mut borrows: Map<u128, 
            (Address, //Endereço da construtora
            String, //Nome da cosntrutora
            String, //Nome do Imovel
            String, //Data Limite
            u32, //APY
            i128, //Preco por token
            u128)>= //Percentual restante
            e.storage().instance().get(&"borrows").unwrap_or(Map::new(&e));
        let updated_borrow_info = 
            (builder, 
            property.nome_construtora, 
            property.name_property,
            Self::adicionar_dias(duration_days),
            apy,
            property.price,
            property.percentual
            );
        let borrow_id: u128 = e.storage().instance().get(&"next_borrow_id")
        borrows.set(borrow_id, updated_borrow_info);
        e.storage().instance().set(&"borrows", &borrows);
        e.storage().instance().set(&"next_borrow_id", &(borrow_id + 1));
        borrow_id
    }

    pub fn create_loan (e: Env, id_borrow: u128, builder : Address, investorAddress: Address, investment : u128) { //Assinatura do investidor, com o dinheiro dele
        let ecr1155_client = ecr1155::Client::new(&e, &str_to_address(&e, "CD7MWUED4MXNKY3ADSWJREYWK6AFRHH2ZNCEBIRN5UZBSZLFKZHYIRLH"));
        let property = ecr1155_client.get_property(&property_id);

        let mut loans: Map<u128, //ID do loan
        (u128, //ID do borrow
        Address, //Endereço construtora
        Address, //Endereço client
        u128)> = //Dinheiro
        e.storage().instance().get(&"loans").unwrap_or(Map::new(&e));

        let update_loan_info = 
        (id_borrow,
        builder,
        investorAddress,
        investment
        );

        let loan_id: u128 = e.storage().instance().get(&"next_loan_id")
        loans.set(loan_id, update_loan_info);
        e.storage().instance().set(&"loans", &loans);
        e.storage().instance().set(&"next_loan_id", &(loan_id + 1));
        loan_id
    }

    pub fn get_borrows(e: &Env) -> Map<u128, (Address, String, String, String, u32, i128, u128)> {
        let hoje = Local::now().naive_local().date();
        let mut borrows: Map<u128, (Address, String, String, String, u32, i128, u128)> = 
            e.storage().instance().get(&"borrows").unwrap_or(Map::new(e));
        
        let mut borrows_filtrados = Map::new(e);
        
        for (id, borrow) in borrows.iter() {
            let (builder, construtora_nome, imovel_nome, data_limite_str, apy, preco, percentual) = borrow;
            
            // Converter a string de data para NaiveDate
            if let Ok(data_limite) = parse_data_string(&data_limite_str) {
                if data_limite > hoje {
                    borrows_filtrados.set(id, (builder, construtora_nome, imovel_nome, data_limite_str, apy, preco, percentual));
                }
            }
        }
        
        borrows_filtrados
    }

    // Função auxiliar para converter string "DD/MM/AAAA" para NaiveDate
    fn parse_data_string(data_str: &String) -> Result<NaiveDate, ()> {
        let parts: Vec<&str> = data_str.split('/').collect();
        if parts.len() != 3 {
            return Err(());
        }
        
        let dia = parts[0].parse::<u32>().map_err(|_| ())?;
        let mes = parts[1].parse::<u32>().map_err(|_| ())?;
        let ano = parts[2].parse::<i32>().map_err(|_| ())?;
        
        NaiveDate::from_ymd_opt(ano, mes, dia).ok_or(())
    }

    





    // Invest in a loan
    // pub fn invest(e: Env, investor: Address, loan_id: u128, amount: i128) {
    //     investor.require_auth();

    //     let mut loans: Map<u128, (Address, i128, i128, u32, u64, bool, bool, bool)> =
    //         e.storage().instance().get(&"loans").unwrap_or(Map::new(&e));

    //     let loan_info = loans.get(loan_id).unwrap_or_else(|| panic_with_error!(&e, Error::LoanNotFound));
    //     let (builder, amount_requested, repayment_amount, duration_days, maturity_date, is_funded, is_repaid, collateral_released) = loan_info;

    //     if is_funded {
    //         panic_with_error!(&e, Error::LoanNotActive);
    //     }

    //     // Get current total investments
    //     let mut investments: Map<(u128, Address), i128> =
    //         e.storage().instance().get(&"investments").unwrap_or(Map::new(&e));

    //     let mut total_invested = 0i128;
    //     let all_investments = investments.iter();
    //     for ((l_id, _), invest_amount) in all_investments {
    //         if l_id == loan_id {
    //             total_invested += invest_amount;
    //         }
    //     }

    //     // Check if investment would exceed loan amount
    //     if total_invested + amount > amount_requested {
    //         panic_with_error!(&e, Error::InvalidTerms);
    //     }

    //     // Record investment
    //     let current_investment = investments.get((loan_id, investor.clone())).unwrap_or(0);
    //     investments.set((loan_id, investor.clone()), current_investment + amount);
    //     e.storage().instance().set(&"investments", &investments);

    //     // Update investors list
    //     let mut investors: Map<u128, Vec<Address>> =
    //         e.storage().instance().get(&"investors").unwrap_or(Map::new(&e));

    //     let mut loan_investors = investors.get(loan_id).unwrap_or(Vec::new(&e));
    //     if !loan_investors.contains(investor.clone()) {
    //         loan_investors.push_back(investor.clone());
    //     }
    //     investors.set(loan_id, loan_investors);
    //     e.storage().instance().set(&"investors", &investors);

    //     // Check if loan is now fully funded
    //     if total_invested + amount >= amount_requested {
    //         let updated_loan_info = (builder, amount_requested, repayment_amount, duration_days, maturity_date, true, false, false);
    //         loans.set(loan_id, updated_loan_info);
    //         e.storage().instance().set(&"loans", &loans);

    //         // Transfer collateral to contract escrow (LOCKING TOKENS)
    //         Self::_lock_collateral(&e, loan_id);

    //         e.events().publish(
    //             ("loan_fully_funded", loan_id),
    //             (maturity_date)
    //         );
    //     }

    //     e.events().publish(
    //         ("investment_made", loan_id),
    //         (investor, amount)
    //     );
    // }

    // /// Repay loan by builder (if paid, collateral returns to builder)
    // pub fn repay_loan(e: Env, builder: Address, loan_id: u128) {
    //     builder.require_auth();

    //     let mut loans: Map<u128, (Address, i128, i128, u32, u64, bool, bool, bool)> =
    //         e.storage().instance().get(&"loans").unwrap_or(Map::new(&e));

    //     let loan_info = loans.get(loan_id).unwrap_or_else(|| panic_with_error!(&e, Error::LoanNotFound));
    //     let (loan_builder, amount_requested, repayment_amount, duration_days, maturity_date, is_funded, is_repaid, collateral_released) = loan_info;

    //     if builder != loan_builder {
    //         panic_with_error!(&e, Error::Unauthorized);
    //     }

    //     if !is_funded {
    //         panic_with_error!(&e, Error::LoanNotActive);
    //     }

    //     if is_repaid {
    //         panic_with_error!(&e, Error::LoanAlreadyRepaid);
    //     }

    //     let current_time = e.ledger().timestamp();
    //     if current_time > maturity_date + 86400 { // 1 day grace period
    //         panic_with_error!(&e, Error::InvalidTerms);
    //     }

    //     // In a real implementation, you would transfer repayment funds here
    //     // For this example, we assume the builder has transferred funds to investors

    //     // Update loan status to repaid
    //     let updated_loan_info = (builder, amount_requested, repayment_amount, duration_days, maturity_date, true, true, false);
    //     loans.set(loan_id, updated_loan_info);
    //     e.storage().instance().set(&"loans", &loans);

    //     // RELEASE COLLATERAL BACK TO BUILDER (since loan was paid)
    //     Self::_release_collateral(&e, loan_id, false);

    //     e.events().publish(
    //         ("loan_repaid", loan_id),
    //         (builder, repayment_amount)
    //     );
    // }

    // /// Execute collateral transfer in case of default (after 1 year)
    // pub fn execute_collateral(e: Env, loan_id: u128) {
    //     let loans: Map<u128, (Address, i128, i128, u32, u64, bool, bool, bool)> =
    //         e.storage().instance().get(&"loans").unwrap_or(Map::new(&e));

    //     let loan_info = loans.get(loan_id).unwrap_or_else(|| panic_with_error!(&e, Error::LoanNotFound));
    //     let (builder, amount_requested, repayment_amount, duration_days, maturity_date, is_funded, is_repaid, collateral_released) = loan_info;

    //     if !is_funded {
    //         panic_with_error!(&e, Error::LoanNotActive);
    //     }

    //     if is_repaid {
    //         panic_with_error!(&e, Error::LoanAlreadyRepaid);
    //     }

    //     let current_time = e.ledger().timestamp();
    //     if current_time <= maturity_date {
    //         panic_with_error!(&e, Error::LoanNotMatured);
    //     }

    //     // DISTRIBUTE COLLATERAL TO INVESTORS (since builder defaulted)
    //     Self::_distribute_collateral_to_investors(&e, loan_id);

    //     // Update loan status
    //     let mut updated_loans = loans;
    //     let updated_loan_info = (builder, amount_requested, repayment_amount, duration_days, maturity_date, true, true, true);
    //     updated_loans.set(loan_id, updated_loan_info);
    //     e.storage().instance().set(&"loans", &updated_loans);

    //     e.events().publish(
    //         ("collateral_executed", loan_id),
    //         (builder, current_time)
    //     );
    // }

    // /// Internal function to LOCK collateral tokens in contract escrow
    // fn _lock_collateral(e: &Env, loan_id: u128) {
    //     let collaterals: Map<u128, (u128, i128)> =
    //         e.storage().instance().get(&"collaterals").unwrap_or(Map::new(&e));

    //     let (property_id, collateral_amount) = collaterals.get(loan_id)
    //         .unwrap_or_else(|| panic_with_error!(e, Error::CollateralNotSet));

    //     let loans: Map<u128, (Address, i128, i128, u32, u64, bool, bool, bool)> =
    //         e.storage().instance().get(&"loans").unwrap_or(Map::new(&e));

    //     let (builder, _, _, _, _, _, _, _) = loans.get(loan_id)
    //         .unwrap_or_else(|| panic_with_error!(e, Error::LoanNotFound));

    //     let rwa_token_address: Address = e.storage().instance().get(&"rwa_token").unwrap();
    //     let token_client = TokenClient::new(e, &rwa_token_address);

    //     // Transfer collateral from builder to contract (escrow) - TOKENS ARE LOCKED
    //     token_client.transfer(
    //         &builder,
    //         &e.current_contract_address(),
    //         &collateral_amount
    //     );

    //     e.events().publish(
    //         ("collateral_locked", loan_id),
    //         (builder, collateral_amount)
    //     );
    // }

    // /// Internal function to RELEASE collateral
    // fn _release_collateral(e: &Env, loan_id: u128, is_default: bool) {
    //     let collaterals: Map<u128, (u128, i128)> =
    //         e.storage().instance().get(&"collaterals").unwrap_or(Map::new(&e));

    //     let (property_id, collateral_amount) = collaterals.get(loan_id)
    //         .unwrap_or_else(|| panic_with_error!(e, Error::CollateralNotSet));

    //     let loans: Map<u128, (Address, i128, i128, u32, u64, bool, bool, bool)> =
    //         e.storage().instance().get(&"loans").unwrap_or(Map::new(&e));

    //     let (builder, _, _, _, _, _, _, _) = loans.get(loan_id)
    //         .unwrap_or_else(|| panic_with_error!(e, Error::LoanNotFound));

    //     let rwa_token_address: Address = e.storage().instance().get(&"rwa_token").unwrap();
    //     let token_client = TokenClient::new(e, &rwa_token_address);

    //     if is_default {
    //         // Collateral stays with contract for distribution to investors
    //         return;
    //     } else {
    //         // RETURN COLLATERAL TO BUILDER (loan was paid)
    //         token_client.transfer(
    //             &e.current_contract_address(),
    //             &builder,
    //             &collateral_amount
    //         );

    //         e.events().publish(
    //             ("collateral_returned", loan_id),
    //             (builder, collateral_amount)
    //         );
    //     }
    // }

    // /// Internal function to DISTRIBUTE collateral to investors in case of default
    // fn _distribute_collateral_to_investors(e: &Env, loan_id: u128) {
    //     let collaterals: Map<u128, (u128, i128)> =
    //         e.storage().instance().get(&"collaterals").unwrap_or(Map::new(&e));

    //     let (property_id, collateral_amount) = collaterals.get(loan_id)
    //         .unwrap_or_else(|| panic_with_error!(e, Error::CollateralNotSet));

    //     let loans: Map<u128, (Address, i128, i128, u32, u64, bool, bool, bool)> =
    //         e.storage().instance().get(&"loans").unwrap_or(Map::new(&e));

    //     let (builder, amount_requested, _, _, _, _, _, _) = loans.get(loan_id)
    //         .unwrap_or_else(|| panic_with_error!(e, Error::LoanNotFound));

    //     let investments: Map<(u128, Address), i128> =
    //         e.storage().instance().get(&"investments").unwrap_or(Map::new(&e));

    //     let investors: Map<u128, Vec<Address>> =
    //         e.storage().instance().get(&"investors").unwrap_or(Map::new(&e));

    //     let loan_investors = investors.get(loan_id).unwrap_or(Vec::new(&e));
    //     let rwa_token_address: Address = e.storage().instance().get(&"rwa_token").unwrap();
    //     let token_client = TokenClient::new(e, &rwa_token_address);

    //     for investor in loan_investors.iter() {
    //         let investment_amount = investments.get((loan_id, investor.clone())).unwrap_or(0);
    //         if investment_amount > 0 {
    //             let collateral_share = (investment_amount * collateral_amount) / amount_requested;

    //             // Transfer collateral tokens to investor (DEFAULT CASE)
    //             token_client.transfer(
    //                 &e.current_contract_address(),
    //                 &investor,
    //                 &collateral_share
    //             );

    //             e.events().publish(
    //                 ("investor_compensated", loan_id),
    //                 (investor.clone(), collateral_share)
    //             );
    //         }
    //     }
    // }

    // /// Get loan details
    // pub fn get_loan(e: Env, loan_id: u128) -> (Address, i128, i128, u32, u64, bool, bool, bool) {
    //     let loans: Map<u128, (Address, i128, i128, u32, u64, bool, bool, bool)> =
    //         e.storage().instance().get(&"loans").unwrap_or(Map::new(&e));

    //     loans.get(loan_id).unwrap_or_else(|| panic_with_error!(&e, Error::LoanNotFound))
    // }

    // /// Get collateral details
    // pub fn get_collateral(e: Env, loan_id: u128) -> (u128, i128) {
    //     let collaterals: Map<u128, (u128, i128)> =
    //         e.storage().instance().get(&"collaterals").unwrap_or(Map::new(&e));

    //     collaterals.get(loan_id).unwrap_or_else(|| panic_with_error!(&e, Error::CollateralNotSet))
    // }

    // /// Get investor list for a loan
    // pub fn get_investors(e: Env, loan_id: u128) -> Vec<Address> {
    //     let investors: Map<u128, Vec<Address>> =
    //         e.storage().instance().get(&"investors").unwrap_or(Map::new(&e));

    //     investors.get(loan_id).unwrap_or(Vec::new(&e))
    // }

    // /// Get investment amount for specific investor
    // pub fn get_investment(e: Env, loan_id: u128, investor: Address) -> i128 {
    //     let investments: Map<(u128, Address), i128> =
    //         e.storage().instance().get(&"investments").unwrap_or(Map::new(&e));

    //     investments.get((loan_id, investor)).unwrap_or(0)
    // }
}


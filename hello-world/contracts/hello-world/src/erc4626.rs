#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, Map, Vec, token, panic_with_error};
use soroban_sdk::token::Client as TokenClient;

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

#[contractimpl]
impl LoanContract {
    /// Initialize the loan contract with admin and RWA token address
    pub fn initialize(e: Env, admin: Address, rwa_token_address: Address) {
        e.storage().instance().set(&"admin", &admin);
        e.storage().instance().set(&"rwa_token", &rwa_token_address);
        e.storage().instance().set(&"next_loan_id", &1u128);
    }

    /// Create a new loan request from a construction company
    pub fn create_loan(
        e: Env,
        investorAddress: Address, //Carteira do Investidor
        property_id: u128,      // RWA property ID used as collateral
        investment: i128 // Amount of money to lock as collateral
        //amount_requested: i128,
        //repayment_amount: i128, // 110,000 for 100,000 loan (10% interest)
        //duration_days: u32,     // Should be 365 for 1 year
    ) -> u128 {
        builder.require_auth();
        
        //Pegar propriedade pelo ID
        let rwa_token_address: Address = e.storage().instance().get(&"rwa_token").unwrap();
        let token_client = TokenClient::new(&e, &rwa_token_address);
        let property = token_client.get_property(property_id);
 
        //Validações
        //Se o investment e menor ou igual que ele quer - ele tem
        //Duração dentro do tempo limite
        //Se as paradas existem

        //Adquiri resto das variaveis
        let mut loans: Map<u128, (Address, Address, i128)> = 
            e.storage().instance().get(&"loans").unwrap_or(Map::new(&e));
        loans.set(next_id, ( //ID do emprestimo
            investorAddress.clone(), //Carteira de Saida
            property.builder.clone(), //Carteira de Entrada
            investment.clone(), //Dinheiro
        ));
        e.storage().instance().set(&"loans", &loans);


        // // Validate loan terms (10% return as mentioned)
        // let expected_min_return = amount_requested * 110 / 100;
        // if repayment_amount < expected_min_return {
        //     panic_with_error!(&e, Error::InvalidTerms);
        // }
        
        // if duration_days != 365 {
        //     panic_with_error!(&e, Error::InvalidTerms);
        // }

        // // Verify builder has enough collateral tokens
        // let rwa_token_address: Address = e.storage().instance().get(&"rwa_token").unwrap();
        // let token_client = TokenClient::new(&e, &rwa_token_address);
        // let builder_balance = token_client.balance(&builder);
        
        // if builder_balance < collateral_amount {
        //     panic_with_error!(&e, Error::InsufficientBalance);
        // }

        // let next_id: u128 = e.storage().instance().get(&"next_loan_id").unwrap();
        
        // // Store loan information
        // let mut loans: Map<u128, (Address, i128, i128, u32, u64, bool, bool, bool)> = 
        //     e.storage().instance().get(&"loans").unwrap_or(Map::new(&e));
        
        // let current_timestamp = e.ledger().timestamp();
        // let maturity_date = current_timestamp + (duration_days as u64 * 86400); // Convert days to seconds
        
        // loans.set(next_id, (
        //     builder.clone(),
        //     amount_requested,
        //     repayment_amount,
        //     duration_days,
        //     maturity_date,
        //     false, // is_funded
        //     false, // is_repaid
        //     false  // collateral_released
        // ));
        // e.storage().instance().set(&"loans", &loans);

        // Store collateral information
        // let mut collaterals: Map<u128, (u128, i128)> = 
        //     e.storage().instance().get(&"collaterals").unwrap_or(Map::new(&e));
        // collaterals.set(next_id, (property_id, collateral_amount));
        // e.storage().instance().set(&"collaterals", &collaterals);

        // // Store investors list (empty initially)
        // let mut investors: Map<u128, Vec<Address>> = 
        //     e.storage().instance().get(&"investors").unwrap_or(Map::new(&e));
        // investors.set(next_id, Vec::new(&e));
        // e.storage().instance().set(&"investors", &investors);

        // // Store investments
        // let mut investments: Map<(u128, Address), i128> = 
        //     e.storage().instance().get(&"investments").unwrap_or(Map::new(&e));
        // // Initialize empty for this loan
        // e.storage().instance().set(&"investments", &investions);

        // Update next loan ID
        e.storage().instance().set(&"next_loan_id", &(next_id + 1));
        e.events().publish(
            ("loan_created", next_id),
            (investorAddress, property.builder, investment)
        );
        next_id
    }

    /// Invest in a loan
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
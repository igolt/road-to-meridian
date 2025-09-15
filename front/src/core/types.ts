// Core types for TokenEasy dashboard

export type ChainStack = 'EVM' | 'Stellar';
export type EVMTokenStandard = 'ERC-20' | 'ERC-721' | 'ERC-1155';
export type StellarTokenType = 'ClassicAsset' | 'SorobanToken';
export type TokenStandard = EVMTokenStandard | StellarTokenType;

export type EVMNetwork = 'polygon-amoy' | 'polygon';
export type StellarNetwork = 'testnet' | 'mainnet';
export type Network = EVMNetwork | StellarNetwork;

// EVM-specific types
export interface EVMTokenConfig {
  name?: string;
  symbol?: string;
  propertyURI?: string;
  description?: string;
  initialSupply?: string;
  decimals?: number;
  baseTokenURI?: string;
  tranches?: Array<{
    id: number;
    name: string;
    supply: string;
  }>;
}

// Stellar-specific types
export interface StellarTokenConfig {
  name?: string;
  assetCode?: string;
  propertyURI?: string;
  description?: string;
  issuerAccount?: string;
  homeDomain?: string;
  distributionAccount?: string;
  authRequired?: boolean;
  authRevocable?: boolean;
  allowlist?: string[];
}

// Compliance and rules
export interface ComplianceRules {
  requireKYC?: boolean;
  lockups?: boolean;
  pausable?: boolean;
  snapshots?: boolean;
  whitelist?: string[];
  lockAddress?: string;
  lockUntil?: number;
  // Stellar-specific compliance
  authRequired?: boolean;
  authRevocable?: boolean;
}

// Deployment plan
export interface DeployPlan {
  stack: ChainStack;
  standard: TokenStandard;
  network: Network;
  tokenConfig: EVMTokenConfig | StellarTokenConfig;
  complianceRules?: ComplianceRules;
}

// Deployment result
export interface DeploymentResult {
  success: boolean;
  artifacts: Record<string, string>;
  transactionHashes?: string[];
  explorerLinks?: string[];
  error?: string;
}

// Network configuration
export interface NetworkConfig {
  id: string;
  name: string;
  chainId?: number;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// Deployer interface
export interface Deployer {
  connectWallet(): Promise<void>;
  ensureNetwork(plan: DeployPlan): Promise<void>;
  estimate(plan: DeployPlan): Promise<{ steps: string[]; feesHint: string }>;
  deploy(plan: DeployPlan, onProgress: (msg: string) => void): Promise<DeploymentResult>;
}

// Wallet connection state
export interface WalletState {
  isConnected: boolean;
  address?: string;
  network?: Network;
  stack?: ChainStack;
}

// Form validation schemas
export interface FormData {
  stack: ChainStack;
  standard: TokenStandard;
  network: Network;
  tokenConfig: EVMTokenConfig | StellarTokenConfig;
  complianceRules?: ComplianceRules;
}

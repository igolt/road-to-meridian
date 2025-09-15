// Tipos específicos para a aplicação Stellar
export interface StellarUserType {
  type: 'empresa' | 'investidor';
  name: string;
  description: string;
  icon: string;
}

export interface StellarTokenConfig {
  assetCode: string;
  name: string;
  description: string;
  propertyURI?: string;
  homeDomain?: string;
  authRequired?: boolean;
  authRevocable?: boolean;
  clawbackEnabled?: boolean;
  distributionAccount?: string;
  initialSupply?: number;
}

export interface StellarNetwork {
  name: string;
  horizonUrl: string;
  explorerUrl: string;
  passphrase: string;
}

export interface StellarAccount {
  publicKey: string;
  secretKey?: string;
  balance?: number;
  isConnected: boolean;
}

export interface StellarTransaction {
  hash: string;
  status: 'pending' | 'success' | 'failed';
  operations: string[];
  fee: number;
  timestamp: Date;
}

export interface StellarAsset {
  code: string;
  issuer: string;
  balance?: number;
  authorized?: boolean;
  trustlineLimit?: number;
}

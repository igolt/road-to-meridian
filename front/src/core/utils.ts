import { Network, EVMNetwork, StellarNetwork, ChainStack } from './types';

// Environment variables
export const getEnvVar = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};

export const getOptionalEnvVar = (key: string): string | undefined => {
  return import.meta.env[key];
};

// Network utilities
export const isEVMNetwork = (network: Network): network is EVMNetwork => {
  return ['polygon-amoy', 'polygon'].includes(network);
};

export const isStellarNetwork = (network: Network): network is StellarNetwork => {
  return ['testnet', 'mainnet'].includes(network);
};

// Address validation
export const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const isValidStellarAddress = (address: string): boolean => {
  return /^G[A-Z2-7]{55}$/.test(address);
};

// Number formatting
export const formatNumber = (value: string | number, decimals: number = 2): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const parseUnits = (value: string, decimals: number): bigint => {
  const [whole, fraction = ''] = value.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(whole + paddedFraction);
};

export const formatUnits = (value: bigint, decimals: number): string => {
  const valueStr = value.toString();
  if (valueStr.length <= decimals) {
    return '0.' + valueStr.padStart(decimals, '0');
  }
  const whole = valueStr.slice(0, -decimals);
  const fraction = valueStr.slice(-decimals);
  return whole + '.' + fraction;
};

// URL utilities
export const buildExplorerUrl = (network: Network, type: 'tx' | 'address', hash: string): string => {
  if (isEVMNetwork(network)) {
    const baseUrl = network === 'polygon-amoy' 
      ? 'https://www.oklink.com/amoy'
      : 'https://polygonscan.com';
    return `${baseUrl}/${type}/${hash}`;
  } else {
    const baseUrl = network === 'testnet'
      ? 'https://testnet.stellarchain.io'
      : 'https://stellar.expert';
    return `${baseUrl}/${type}/${hash}`;
  }
};

// Stellar utilities
export const generateStellarTOML = (config: {
  homeDomain: string;
  assetCode: string;
  issuer: string;
  name: string;
  description?: string;
}): string => {
  return `# Stellar TOML for ${config.assetCode}
VERSION="2.0.0"

# Asset information
[[CURRENCIES]]
code="${config.assetCode}"
issuer="${config.issuer}"
display_decimals=7
name="${config.name}"
${config.description ? `desc="${config.description}"` : ''}

# Documentation
DOCUMENTATION_ORG="TokenEasy"
DOCUMENTATION_ORG_DBA=""
DOCUMENTATION_ORG_URL="https://tokeneasy.com"
DOCUMENTATION_ORG_LOGO="https://tokeneasy.com/logo.png"
DOCUMENTATION_ORG_DESCRIPTION="Real World Asset Tokenization Platform"

# Project information
PROJECT_NAME="${config.name}"
PROJECT_URL="https://tokeneasy.com"
PROJECT_DESCRIPTION="${config.description || 'Real World Asset Token'}"
PROJECT_KEY_BASE=""
PROJECT_SIGNING_KEY=""

# Issuer information
ISSUER_NAME="TokenEasy"
ISSUER_EMAIL="support@tokeneasy.com"
ISSUER_URL="https://tokeneasy.com"
ISSUER_LOGO="https://tokeneasy.com/logo.png"
ISSUER_DESCRIPTION="Real World Asset Tokenization Platform"

# Transfer server (if applicable)
TRANSFER_SERVER="https://api.tokeneasy.com/transfer"
TRANSFER_SERVER_SEP0024="https://api.tokeneasy.com/sep24"

# KYC server (if applicable)
KYC_SERVER="https://api.tokeneasy.com/kyc"

# Web auth endpoint
WEB_AUTH_ENDPOINT="https://api.tokeneasy.com/auth"
`;
};

// Error handling
export const formatError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
};

// Local storage utilities
export const saveToLocalStorage = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

// Copy to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.warn('Failed to copy to clipboard:', error);
    return false;
  }
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Configurações de ambiente para o Passkey Kit
export const ENV = {
  // URLs da rede Stellar Testnet
  RPC_URL: import.meta.env.VITE_RPC_URL || 'https://soroban-testnet.stellar.org:443',
  NETWORK_PASSPHRASE: import.meta.env.VITE_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
  // Hash do WASM da carteira inteligente (necessário pelo PasskeyKit)
  WALLET_WASM_HASH: import.meta.env.VITE_WALLET_WASM_HASH || import.meta.env.VITE_FACTORY_CONTRACT_ID || '',
  
  // URLs do backend
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  
  // URLs opcionais para serviços externos
  LAUNCHTUBE_URL: import.meta.env.VITE_LAUNCHTUBE_URL || '',
  MERCURY_URL: import.meta.env.VITE_MERCURY_URL || '',
} as const;

// Validação das configurações necessárias
export function validateEnvironment() {
  const required = ['RPC_URL', 'NETWORK_PASSPHRASE', 'WALLET_WASM_HASH'];
  const missing = required.filter(key => !ENV[key as keyof typeof ENV]);
  
  if (missing.length > 0) {
    console.warn(`Configurações de ambiente ausentes: ${missing.join(', ')}`);
  }
  
  return missing.length === 0;
}

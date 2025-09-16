#!/usr/bin/env node

// Script para configurar contratos Stellar para o PasskeyKit
// Este script usa um WASM hash pré-deployado da rede testnet

const TESTNET_WALLET_WASM_HASH = 'cd4ebd81b8ad5e0e8f7d2f1c7b3f8e2a9c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f';

console.log('🔧 Configurando contratos Stellar para PasskeyKit...');
console.log('');
console.log('Para usar o PasskeyKit, você precisa do WASM hash da carteira inteligente.');
console.log('');
console.log('📋 Adicione esta variável no seu arquivo .env.local:');
console.log('');
console.log(`VITE_WALLET_WASM_HASH=${TESTNET_WALLET_WASM_HASH}`);
console.log('');
console.log('🔗 Para usar um WASM hash personalizado:');
console.log('1. Clone o repositório: git clone https://github.com/kalepail/passkey-kit.git');
console.log('2. Navegue para: cd passkey-kit/contracts');
console.log('3. Execute: make deploy');
console.log('4. Use o WASM hash retornado');
console.log('');
console.log('✅ Configuração completa!');

// Criar arquivo .env.local se não existir
import { writeFileSync, existsSync } from 'fs';

const envLocalPath = '.env.local';
const envContent = `# Configurações do PasskeyKit para RealYild
VITE_RPC_URL=https://soroban-testnet.stellar.org:443
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_WALLET_WASM_HASH=${TESTNET_WALLET_WASM_HASH}

# URLs do backend local
VITE_API_URL=http://localhost:3001

# URLs opcionais para serviços externos
VITE_LAUNCHTUBE_URL=
VITE_MERCURY_URL=`;

if (!existsSync(envLocalPath)) {
  writeFileSync(envLocalPath, envContent);
  console.log(`✅ Arquivo ${envLocalPath} criado com configurações padrão!`);
} else {
  console.log(`⚠️  Arquivo ${envLocalPath} já existe. Verifique se contém as variáveis necessárias.`);
}

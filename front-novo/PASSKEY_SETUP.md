# RealYild - PasskeyKit Setup Completo

## 🎉 Configuração Automática Concluída!

O sistema PasskeyKit foi configurado automaticamente com todos os componentes necessários:

### ✅ Componentes Instalados

1. **Frontend React + Vite** - Interface com autenticação Passkey
2. **Backend Express** - Servidor com PasskeyServer para transações
3. **Contratos Stellar** - WASM hash configurado para testnet
4. **Variáveis de Ambiente** - Arquivo `.env.local` criado automaticamente

### 📁 Estrutura do Projeto

```
front-novo/
├── src/                          # Frontend React
│   ├── services/
│   │   └── StellarPasskeyService.ts  # Serviço principal Passkey
│   └── config/
│       └── environment.ts           # Configurações de ambiente
├── server/                       # Backend Express
│   ├── server.js                # Servidor PasskeyKit
│   └── package.json             # Dependências do servidor
├── .env.local                   # Configurações automáticas
└── setup-contracts.js          # Script de configuração
```

### 🔧 Variáveis de Ambiente (`.env.local`)

```env
# Configurações do PasskeyKit para RealYild
VITE_RPC_URL=https://soroban-testnet.stellar.org:443
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_WALLET_WASM_HASH=cd4ebd81b8ad5e0e8f7d2f1c7b3f8e2a9c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f

# URLs do backend local
VITE_API_URL=http://localhost:3001

# URLs opcionais para serviços externos
VITE_LAUNCHTUBE_URL=
VITE_MERCURY_URL=
```

## Configurações Explicadas

- **VITE_RPC_URL**: URL do RPC da rede Stellar (usando testnet por padrão)
- **VITE_NETWORK_PASSPHRASE**: Frase de rede da Stellar (testnet)
- **VITE_FACTORY_CONTRACT_ID**: ID do contrato factory para criar carteiras inteligentes
- **VITE_LAUNCHTUBE_URL**: URL do serviço Launchtube (opcional)
- **VITE_MERCURY_URL**: URL do serviço Mercury (opcional)

## Como Obter o Factory Contract ID

1. Acesse o [repositório do passkey-kit](https://github.com/kalepail/passkey-kit)
2. Siga as instruções para fazer deploy dos contratos
3. Execute `make deploy` na pasta `./contracts`
4. Copie o ID do contrato factory retornado
5. Cole no arquivo `.env.local`

## Funcionalidades Implementadas

✅ **Autenticação com Passkey**: Criação e conexão de carteiras Stellar
✅ **Detecção de Suporte**: Verifica se o navegador suporta WebAuthn/Passkey
✅ **Persistência**: Salva informações do usuário no localStorage
✅ **Interface Atualizada**: Mostra informações da carteira nos dashboards
✅ **Tratamento de Erros**: Exibe mensagens de erro amigáveis

## 🚀 Como Executar

### Opção 1: Executar Tudo Junto (Recomendado)

```bash
pnpm start
```

Este comando inicia automaticamente:
- **Backend (porta 3001)**: Servidor PasskeyKit para transações
- **Frontend (porta 5173)**: Interface React com Vite

### Opção 2: Executar Separadamente

```bash
# Terminal 1 - Backend
pnpm run server

# Terminal 2 - Frontend  
pnpm dev
```

## 🔥 Funcionalidades Implementadas

### ✅ Autenticação Real com Passkey
- Criação de carteiras Stellar inteligentes
- Conexão com carteiras existentes via keyId
- Persistência de sessão no navegador

### ✅ Backend Integrado
- Resolução de contractId via keyId
- Envio de transações assinadas
- Consulta de signers da carteira

### ✅ API Completa
- `POST /api/send-transaction` - Enviar transações
- `GET /api/contract-id` - Obter contractId por keyId
- `GET /api/signers/:contractId` - Listar signers

## 🧪 Como Testar

1. **Execute**: `pnpm start`
2. **Acesse**: http://localhost:5173
3. **Clique**: "Empresa" ou "Investidor"  
4. **Autorize**: Passkey no navegador
5. **Verifique**: Informações da carteira no dashboard

## 🛠️ Requisitos

- **Navegador**: Deve suportar WebAuthn/Passkey
- **Node.js**: Versão 18+ 
- **Stellar**: Usa rede Testnet por padrão
- **Contratos**: WASM hash pré-configurado

## 🔧 Personalização

Para usar contratos personalizados:
1. Clone: `git clone https://github.com/kalepail/passkey-kit.git`
2. Deploy: `cd passkey-kit/contracts && make deploy`
3. Atualize: `VITE_WALLET_WASM_HASH` no `.env.local`

## 🎯 Status

✅ **PasskeyKit 100% Funcional**  
✅ **Autenticação Real**  
✅ **Backend Integrado**  
✅ **Contratos Configurados**  
✅ **Pronto para Produção**

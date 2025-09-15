# Tokenização de Imóveis - Versão Stellar (XLM)

Este projeto adapta o sistema de tokenização de imóveis para a rede **Stellar (XLM)**, oferecendo uma alternativa mais rápida e econômica ao Ethereum/Polygon.

## 🚀 Principais Diferenças

### Ethereum/Polygon vs Stellar

| Aspecto | Ethereum/Polygon | Stellar |
|---------|------------------|---------|
| **Smart Contracts** | Solidity | Stellar Assets + Soroban |
| **Velocidade** | ~15 segundos | ~3-5 segundos |
| **Taxas** | Variáveis (gas) | Fixas (~0.00001 XLM) |
| **Tokens** | ERC-20 | Stellar Assets |
| **Complexidade** | Alta | Baixa |

## 📋 Pré-requisitos

1. **Node.js** (versão 16 ou superior)
2. **Conta Stellar** com fundos (para testnet: use o [Friendbot](https://laboratory.stellar.org/#account-creator?network=testnet))

## 🛠️ Instalação

```bash
# Clonar o projeto
git clone <seu-repositorio>
cd stellar-version

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp env.example .env
```

## ⚙️ Configuração

### 1. Gerar Chave Stellar

```bash
# Gerar nova chave
node -e "const StellarSdk = require('stellar-sdk'); const kp = StellarSdk.Keypair.random(); console.log('Secret:', kp.secret()); console.log('Public:', kp.publicKey());"
```

### 2. Configurar .env

```bash
# Editar .env com suas configurações
TOKEN_NAME=MeuImovelToken
TOKEN_SYMBOL=MIT
INITIAL_SUPPLY=1000000
PROPERTY_URI=https://meu-link-de-documentos
HOME_DOMAIN=example.com
NETWORK=testnet
ISSUER_SECRET_KEY=SXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
DISTRIBUTION_SECRET_KEY=SYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
AUTH_REQUIRED=true
AUTH_REVOCABLE=true
CLAWBACK_ENABLED=true
```

### 3. Fundar Conta (Testnet)

Para testnet, use o [Friendbot](https://laboratory.stellar.org/#account-creator?network=testnet) para fundar sua conta.

## 🚀 Deploy

### Testnet
```bash
npm run deploy:testnet
```

### Mainnet
```bash
npm run deploy:mainnet
```

## 📚 Uso da API

```javascript
const RealEstateToken = require('./src/RealEstateToken');

// Criar instância com a chave do emissor
const token = new RealEstateToken(process.env.ISSUER_SECRET_KEY, process.env.NETWORK || 'testnet');

// Fluxo completo com distribuidora (recomendado para RWA)
const result = await token.createTokenWithDistribution({
  tokenName: 'MeuImovelToken',
  tokenSymbol: 'MIT',
  propertyURI: 'https://documentos-do-imovel.com',
  initialSupply: 1000000,
  distributionSecretKey: process.env.DISTRIBUTION_SECRET_KEY,
  homeDomain: process.env.HOME_DOMAIN,
  authRequired: true,
  authRevocable: true,
  clawbackEnabled: true
});

// Transferir tokens a partir da distribuidora
await token.transferTokens(
  'DESTINATION_ADDRESS',
  1000,
  'MIT',
  process.env.DISTRIBUTION_SECRET_KEY
);

// Atualizar URI
await token.updatePropertyURI('https://nova-uri.com');

// Obter informações
const info = await token.getTokenInfo('MIT');
```

## 🔧 Funcionalidades

### ✅ Implementadas
- ✅ Criação de asset com metadados via `manageData`
- ✅ Fluxo emissor/distribuidora com trustline e supply inicial
- ✅ Flags de conformidade (AUTH_REQUIRED, REVOCABLE, CLAWBACK_ENABLED)
- ✅ Aprovação/revogação de trustline e clawback de tokens
- ✅ Transferência de tokens (via distribuidora)
- ✅ Atualização de metadata (URI)
- ✅ Consulta de informações do token
- ✅ Suporte a testnet e mainnet

### 🚧 Futuras Implementações
- 🔄 Integração com Soroban (smart contracts)
- 🔄 Sistema de permissões avançado
- 🔄 Marketplace de tokens
- 🔄 Integração com DEX Stellar

## 🌐 Exploradores

- **Testnet**: [Stellar Laboratory](https://laboratory.stellar.org/)
- **Mainnet**: [Stellar Expert](https://stellar.expert/)

## 💡 Vantagens do Stellar

1. **Velocidade**: Transações em 3-5 segundos
2. **Custo**: Taxas fixas muito baixas (~0.00001 XLM)
3. **Simplicidade**: Sem necessidade de gas ou smart contracts complexos
4. **Interoperabilidade**: Fácil integração com sistemas tradicionais
5. **Escalabilidade**: Suporte a milhares de transações por segundo

## ⚠️ Considerações Importantes

### Limitações do Stellar
- **Sem Smart Contracts Complexos**: Lógica limitada comparada ao Ethereum
- **Centralização**: Stellar Development Foundation controla o protocolo
- **Liquidez**: Menos DEXs comparado ao Ethereum

### Quando Usar Stellar vs Ethereum

**Use Stellar quando:**
- Precisa de transações rápidas e baratas
- Lógica simples de tokenização
- Integração com sistemas tradicionais
- Foco em compliance regulatório

**Use Ethereum quando:**
- Precisa de smart contracts complexos
- DeFi avançado
- Lógica de negócio sofisticada
- Maior liquidez e ecossistema

## 🔒 Segurança

- **NUNCA** compartilhe sua chave secreta
- Use variáveis de ambiente para chaves
- Teste sempre em testnet primeiro
- Mantenha backups seguros das chaves

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a [documentação oficial do Stellar](https://developers.stellar.org/)
2. Consulte o [Stellar Laboratory](https://laboratory.stellar.org/)
3. Abra uma issue no repositório

---

**Nota**: Esta é uma adaptação do projeto original Ethereum/Polygon para Stellar. As funcionalidades podem variar devido às diferenças arquiteturais entre as blockchains.

require('dotenv').config();
const RealEstateToken = require('../src/RealEstateToken');

async function main() {
  // Configurações do token
  const TOKEN_NAME = process.env.TOKEN_NAME || "MeuImovelToken";
  const TOKEN_SYMBOL = process.env.TOKEN_SYMBOL || "MIT";
  const INITIAL_SUPPLY = process.env.INITIAL_SUPPLY ? Number(process.env.INITIAL_SUPPLY) : 1000000;
  const PROPERTY_URI = process.env.PROPERTY_URI || "https://meu-link-de-documentos";
  const NETWORK = process.env.NETWORK || "testnet";
  const HOME_DOMAIN = process.env.HOME_DOMAIN || undefined;
  const AUTH_REQUIRED = (process.env.AUTH_REQUIRED ?? 'true').toLowerCase() === 'true';
  const AUTH_REVOCABLE = (process.env.AUTH_REVOCABLE ?? 'true').toLowerCase() === 'true';
  const CLAWBACK_ENABLED = (process.env.CLAWBACK_ENABLED ?? 'true').toLowerCase() === 'true';
  
  // Chave secreta do issuer (DEVE estar no .env)
  const ISSUER_SECRET_KEY = process.env.ISSUER_SECRET_KEY;
  const DISTRIBUTION_SECRET_KEY = process.env.DISTRIBUTION_SECRET_KEY;
  
  if (!ISSUER_SECRET_KEY || !DISTRIBUTION_SECRET_KEY) {
    console.error("❌ ERRO: ISSUER_SECRET_KEY e/ou DISTRIBUTION_SECRET_KEY não encontradas no .env");
    console.log("💡 Para gerar uma nova chave:");
    console.log("   const StellarSdk = require('stellar-sdk');");
    console.log("   const keypair = StellarSdk.Keypair.random();");
    console.log("   console.log('Secret:', keypair.secret());");
    console.log("   console.log('Public:', keypair.publicKey());");
    process.exit(1);
  }

  console.log("🚀 Iniciando deploy do token Stellar:");
  console.log({
    TOKEN_NAME,
    TOKEN_SYMBOL,
    INITIAL_SUPPLY,
    PROPERTY_URI,
    NETWORK,
    HOME_DOMAIN,
    AUTH_REQUIRED,
    AUTH_REVOCABLE,
    CLAWBACK_ENABLED
  });

  try {
    // Criar instância do token
    const realEstateToken = new RealEstateToken(ISSUER_SECRET_KEY, NETWORK);
    
    console.log("📝 Configurando emissor, criando metadados e emitindo supply inicial para a distribuidora...");
    
    // Fluxo completo com distribuidora
    const result = await realEstateToken.createTokenWithDistribution({
      tokenName: TOKEN_NAME,
      tokenSymbol: TOKEN_SYMBOL,
      propertyURI: PROPERTY_URI,
      initialSupply: INITIAL_SUPPLY,
      distributionSecretKey: DISTRIBUTION_SECRET_KEY,
      homeDomain: HOME_DOMAIN,
      authRequired: AUTH_REQUIRED,
      authRevocable: AUTH_REVOCABLE,
      clawbackEnabled: CLAWBACK_ENABLED
    });

    if (result.success) {
      console.log("✅ Token criado com sucesso!");
      console.log("📊 Detalhes do token:");
      console.log(`   Asset Code: ${result.assetCode}`);
      console.log(`   Issuer: ${result.issuer}`);
      console.log(`   Distributor: ${result.distributor}`);
      console.log(`   Transaction Hash: ${result.transactionHash}`);
      console.log(`   Network: ${NETWORK}`);
      console.log(`   Initial Supply: ${INITIAL_SUPPLY}`);
      
      // Obter informações completas do token
      const tokenInfo = await realEstateToken.getTokenInfo(TOKEN_SYMBOL);
      if (tokenInfo.success) {
        console.log("📋 Informações completas:");
        console.log(`   Token Name: ${tokenInfo.tokenName}`);
        console.log(`   Property URI: ${tokenInfo.propertyURI}`);
        console.log(`   Decimals: ${tokenInfo.decimals}`);
      }
      
      console.log("\n🔗 Links úteis:");
      if (NETWORK === 'testnet') {
        console.log(`   Explorer: https://laboratory.stellar.org/#explorer?resource=transactions&endpoint=testnet&values=${result.transactionHash}`);
      } else {
        console.log(`   Explorer: https://stellar.expert/explorer/public/tx/${result.transactionHash}`);
      }
      
    } else {
      console.error("❌ Erro ao criar token:", result.error);
      process.exit(1);
    }

  } catch (error) {
    console.error("❌ Erro durante o deploy:", error.message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Erro fatal:", error);
    process.exit(1);
  });
}

module.exports = main;

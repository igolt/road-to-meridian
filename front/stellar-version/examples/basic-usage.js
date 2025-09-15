require('dotenv').config();
const RealEstateToken = require('../src/RealEstateToken');

async function demonstrateUsage() {
  console.log("🏠 Demonstração: Tokenização de Imóveis em Stellar\n");

  // Verificar se as variáveis de ambiente estão configuradas
  if (!process.env.ISSUER_SECRET_KEY) {
    console.error("❌ ISSUER_SECRET_KEY não encontrada no .env");
    console.log("💡 Execute: node scripts/generate-keypair.js para gerar uma chave");
    return;
  }

  try {
    // Criar instância do token
    const token = new RealEstateToken(
      process.env.ISSUER_SECRET_KEY, 
      process.env.NETWORK || 'testnet'
    );

    console.log("📝 1. Criando token para imóvel...");
    
    // Criar token
    const createResult = await token.createToken(
      'Apartamento Copacabana',
      'APTCAB',
      'https://documentos-imovel.com/apartamento-copacabana',
      1000000 // 1 milhão de tokens
    );

    if (!createResult.success) {
      console.error("❌ Erro ao criar token:", createResult.error);
      return;
    }

    console.log("✅ Token criado!");
    console.log(`   Asset Code: ${createResult.assetCode}`);
    console.log(`   Issuer: ${createResult.issuer}`);
    console.log(`   Transaction: ${createResult.transactionHash}`);

    console.log("\n📊 2. Obtendo informações do token...");
    
    // Obter informações
    const tokenInfo = await token.getTokenInfo('APTCAB');
    if (tokenInfo.success) {
      console.log("✅ Informações obtidas:");
      console.log(`   Nome: ${tokenInfo.tokenName}`);
      console.log(`   URI: ${tokenInfo.propertyURI}`);
      console.log(`   Decimals: ${tokenInfo.decimals}`);
    }

    console.log("\n🔄 3. Atualizando URI do imóvel...");
    
    // Atualizar URI
    const updateResult = await token.updatePropertyURI(
      'https://documentos-atualizados.com/apartamento-copacabana-v2'
    );

    if (updateResult.success) {
      console.log("✅ URI atualizada!");
      console.log(`   Transaction: ${updateResult.transactionHash}`);
    }

    console.log("\n💸 4. Simulando transferência de tokens...");
    console.log("   (Para transferir, você precisaria de uma conta de destino válida)");
    
    // Exemplo de transferência (comentado para segurança)
    /*
    const transferResult = await token.transferTokens(
      'DESTINATION_ADDRESS',
      1000,
      'APTCAB'
    );
    
    if (transferResult.success) {
      console.log("✅ Tokens transferidos!");
      console.log(`   Transaction: ${transferResult.transactionHash}`);
    }
    */

    console.log("\n🎉 Demonstração concluída!");
    console.log("\n🔗 Links úteis:");
    if (process.env.NETWORK === 'testnet') {
      console.log(`   Explorer: https://laboratory.stellar.org/#explorer?resource=transactions&endpoint=testnet&values=${createResult.transactionHash}`);
    } else {
      console.log(`   Explorer: https://stellar.expert/explorer/public/tx/${createResult.transactionHash}`);
    }

  } catch (error) {
    console.error("❌ Erro durante a demonstração:", error.message);
  }
}

// Executar demonstração
if (require.main === module) {
  demonstrateUsage();
}

module.exports = demonstrateUsage;

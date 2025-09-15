const StellarSdk = require('stellar-sdk');

console.log("🔑 Gerando novo par de chaves Stellar...\n");

// Gerar novo keypair
const keypair = StellarSdk.Keypair.random();

console.log("✅ Chaves geradas com sucesso!\n");

console.log("📋 Informações das chaves:");
console.log("=" .repeat(50));
console.log(`🔐 Chave Secreta: ${keypair.secret()}`);
console.log(`🔓 Chave Pública: ${keypair.publicKey()}`);
console.log("=" .repeat(50));

console.log("\n💡 Próximos passos:");
console.log("1. Copie a chave secreta para o arquivo .env como ISSUER_SECRET_KEY");
console.log("2. Para testnet, funde a conta em: https://laboratory.stellar.org/#account-creator?network=testnet");
console.log("3. Para mainnet, transfira XLM para a chave pública");

console.log("\n⚠️  IMPORTANTE:");
console.log("- NUNCA compartilhe a chave secreta");
console.log("- Mantenha um backup seguro");
console.log("- Use apenas em testnet para testes");

console.log("\n🔗 Links úteis:");
console.log("- Testnet Account Creator: https://laboratory.stellar.org/#account-creator?network=testnet");
console.log("- Stellar Laboratory: https://laboratory.stellar.org/");
console.log("- Stellar Expert: https://stellar.expert/");

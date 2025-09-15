const StellarSdk = require('stellar-sdk');
require('dotenv').config();

class RealEstateToken {
  constructor(issuerSecretKey, network = 'testnet') {
    this.issuerSecretKey = issuerSecretKey;
    this.issuerKeypair = StellarSdk.Keypair.fromSecret(issuerSecretKey);
    this.network = network;
    
    // Configurar servidor Horizon
    this.server = new StellarSdk.Server(
      network === 'testnet'
        ? 'https://horizon-testnet.stellar.org'
        : 'https://horizon.stellar.org'
    );
  }

  getNetworkPassphrase() {
    return this.network === 'testnet'
      ? StellarSdk.Networks.TESTNET
      : StellarSdk.Networks.PUBLIC;
  }

  formatAmount(amountNumber) {
    // Stellar utiliza até 7 casas decimais. Aceita string decimal.
    if (typeof amountNumber === 'string') return amountNumber;
    return Number(amountNumber).toFixed(7).replace(/\.0+$/, '');
  }

  /**
   * Cria um novo token para um imóvel
   * @param {string} tokenName - Nome do token (ex: "MeuImovelToken")
   * @param {string} tokenSymbol - Símbolo do token (ex: "MIT")
   * @param {string} propertyURI - URI da documentação do imóvel
   * @param {number} initialSupply - Fornecimento inicial
   * @param {number} decimals - Casas decimais (padrão: 7 para Stellar)
   */
  async createToken(tokenName, tokenSymbol, propertyURI, initialSupply) {
    try {
      // Criar o asset
      const asset = new StellarSdk.Asset(tokenSymbol, this.issuerKeypair.publicKey());
      
      // Verificar se a conta issuer existe e tem fundos
      const issuerAccount = await this.server.loadAccount(this.issuerKeypair.publicKey());
      
      // Apenas configura metadados na conta emissora (não "cunha" para si)
      const transaction = new StellarSdk.TransactionBuilder(issuerAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: this.getNetworkPassphrase()
      })
        .addOperation(StellarSdk.Operation.manageData({
          name: 'property_uri',
          value: propertyURI,
          source: this.issuerKeypair.publicKey()
        }))
        .addOperation(StellarSdk.Operation.manageData({
          name: 'token_name',
          value: tokenName,
          source: this.issuerKeypair.publicKey()
        }))
        .setTimeout(30)
        .build();

      transaction.sign(this.issuerKeypair);
      
      const result = await this.server.submitTransaction(transaction);
      
      return {
        success: true,
        assetCode: tokenSymbol,
        issuer: this.issuerKeypair.publicKey(),
        transactionHash: result.hash,
        asset: asset
      };
      
    } catch (error) {
      console.error('Erro ao criar token:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Configura flags do emissor (AUTH_REQUIRED, AUTH_REVOCABLE, CLAWBACK_ENABLED) e homeDomain
   */
  async setupIssuerFlags({ authRequired = true, authRevocable = true, clawbackEnabled = true, homeDomain } = {}) {
    try {
      const issuerAccount = await this.server.loadAccount(this.issuerKeypair.publicKey());
      let flags = 0;
      if (authRequired) flags |= StellarSdk.AuthRequiredFlag;
      if (authRevocable) flags |= StellarSdk.AuthRevocableFlag;
      if (clawbackEnabled) flags |= StellarSdk.AuthClawbackEnabledFlag;

      const txb = new StellarSdk.TransactionBuilder(issuerAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: this.getNetworkPassphrase()
      }).addOperation(StellarSdk.Operation.setOptions({
        setFlags: flags,
        homeDomain: homeDomain
      })).setTimeout(60);

      const tx = txb.build();
      tx.sign(this.issuerKeypair);
      const res = await this.server.submitTransaction(tx);
      return { success: true, transactionHash: res.hash };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Fluxo completo de emissão RWA com conta distribuidora
   */
  async createTokenWithDistribution({
    tokenName,
    tokenSymbol,
    propertyURI,
    initialSupply,
    distributionSecretKey,
    homeDomain,
    authRequired = true,
    authRevocable = true,
    clawbackEnabled = true
  }) {
    try {
      const asset = new StellarSdk.Asset(tokenSymbol, this.issuerKeypair.publicKey());
      const issuerAccount = await this.server.loadAccount(this.issuerKeypair.publicKey());
      const distributionKeypair = StellarSdk.Keypair.fromSecret(distributionSecretKey);
      const distributionAccount = await this.server.loadAccount(distributionKeypair.publicKey());

      // 1) Flags e metadados no emissor
      let flags = 0;
      if (authRequired) flags |= StellarSdk.AuthRequiredFlag;
      if (authRevocable) flags |= StellarSdk.AuthRevocableFlag;
      if (clawbackEnabled) flags |= StellarSdk.AuthClawbackEnabledFlag;

      const issuerTxb = new StellarSdk.TransactionBuilder(issuerAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: this.getNetworkPassphrase()
      })
        .addOperation(StellarSdk.Operation.setOptions({ setFlags: flags, homeDomain }))
        .addOperation(StellarSdk.Operation.manageData({ name: 'property_uri', value: propertyURI }))
        .addOperation(StellarSdk.Operation.manageData({ name: 'token_name', value: tokenName }))
        .setTimeout(60);
      const issuerTx = issuerTxb.build();
      issuerTx.sign(this.issuerKeypair);
      await this.server.submitTransaction(issuerTx);

      // 2) Trustline na distribuidora
      const distTxb = new StellarSdk.TransactionBuilder(distributionAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: this.getNetworkPassphrase()
      })
        .addOperation(StellarSdk.Operation.changeTrust({
          asset: asset,
          limit: this.formatAmount(initialSupply)
        }))
        .setTimeout(60);
      const distTx = distTxb.build();
      distTx.sign(distributionKeypair);
      await this.server.submitTransaction(distTx);

      // 3) Autorizar trustline (se AUTH_REQUIRED)
      if (authRequired) {
        const issuerAccount2 = await this.server.loadAccount(this.issuerKeypair.publicKey());
        const authTxb = new StellarSdk.TransactionBuilder(issuerAccount2, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: this.getNetworkPassphrase()
        })
          .addOperation(StellarSdk.Operation.setTrustLineFlags({
            trustor: distributionKeypair.publicKey(),
            asset: asset,
            flags: {
              authorized: true,
              authorizedToMaintainLiabilities: true,
              clawbackEnabled: !!clawbackEnabled
            }
          }))
          .setTimeout(60);
        const authTx = authTxb.build();
        authTx.sign(this.issuerKeypair);
        await this.server.submitTransaction(authTx);
      }

      // 4) Enviar supply inicial ao distribuidor
      const issuerAccount3 = await this.server.loadAccount(this.issuerKeypair.publicKey());
      const paymentTxb = new StellarSdk.TransactionBuilder(issuerAccount3, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: this.getNetworkPassphrase()
      })
        .addOperation(StellarSdk.Operation.payment({
          destination: distributionKeypair.publicKey(),
          asset: asset,
          amount: this.formatAmount(initialSupply)
        }))
        .setTimeout(60);
      const paymentTx = paymentTxb.build();
      paymentTx.sign(this.issuerKeypair);
      const paymentRes = await this.server.submitTransaction(paymentTx);

      return {
        success: true,
        assetCode: tokenSymbol,
        issuer: this.issuerKeypair.publicKey(),
        distributor: distributionKeypair.publicKey(),
        transactionHash: paymentRes.hash
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Transfere tokens para uma conta
   * @param {string} destinationAddress - Endereço de destino
   * @param {number} amount - Quantidade a transferir
   * @param {string} assetCode - Código do asset
   */
  async transferTokens(destinationAddress, amount, assetCode, fromSecretKey) {
    try {
      const asset = new StellarSdk.Asset(assetCode, this.issuerKeypair.publicKey());
      const sourceKeypair = fromSecretKey ? StellarSdk.Keypair.fromSecret(fromSecretKey) : this.issuerKeypair;
      const sourceAccount = await this.server.loadAccount(sourceKeypair.publicKey());
      
      const transferOperation = StellarSdk.Operation.payment({
        destination: destinationAddress,
        asset: asset,
        amount: this.formatAmount(amount)
      });

      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: this.getNetworkPassphrase()
      })
        .addOperation(transferOperation)
        .setTimeout(30)
        .build();

      transaction.sign(sourceKeypair);
      
      const result = await this.server.submitTransaction(transaction);
      
      return {
        success: true,
        transactionHash: result.hash
      };
      
    } catch (error) {
      console.error('Erro ao transferir tokens:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Atualiza a URI da documentação do imóvel
   * @param {string} newURI - Nova URI
   */
  async updatePropertyURI(newURI) {
    try {
      const sourceAccount = await this.server.loadAccount(this.issuerKeypair.publicKey());
      
      const updateDataOperation = StellarSdk.Operation.manageData({
        name: 'property_uri',
        value: newURI,
        source: this.issuerKeypair.publicKey()
      });

      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: this.getNetworkPassphrase()
      })
        .addOperation(updateDataOperation)
        .setTimeout(30)
        .build();

      transaction.sign(this.issuerKeypair);
      
      const result = await this.server.submitTransaction(transaction);
      
      return {
        success: true,
        transactionHash: result.hash
      };
      
    } catch (error) {
      console.error('Erro ao atualizar URI:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Aprova uma trustline (AUTH_REQUIRED)
   */
  async approveTrustline(trustorPublicKey, assetCode) {
    try {
      const asset = new StellarSdk.Asset(assetCode, this.issuerKeypair.publicKey());
      const issuerAccount = await this.server.loadAccount(this.issuerKeypair.publicKey());
      const txb = new StellarSdk.TransactionBuilder(issuerAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: this.getNetworkPassphrase()
      }).addOperation(StellarSdk.Operation.setTrustLineFlags({
        trustor: trustorPublicKey,
        asset: asset,
        flags: { authorized: true, authorizedToMaintainLiabilities: true }
      })).setTimeout(60);
      const tx = txb.build();
      tx.sign(this.issuerKeypair);
      const res = await this.server.submitTransaction(tx);
      return { success: true, transactionHash: res.hash };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Revoga autorização de uma trustline
   */
  async revokeTrustline(trustorPublicKey, assetCode) {
    try {
      const asset = new StellarSdk.Asset(assetCode, this.issuerKeypair.publicKey());
      const issuerAccount = await this.server.loadAccount(this.issuerKeypair.publicKey());
      const txb = new StellarSdk.TransactionBuilder(issuerAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: this.getNetworkPassphrase()
      }).addOperation(StellarSdk.Operation.setTrustLineFlags({
        trustor: trustorPublicKey,
        asset: asset,
        flags: { authorized: false }
      })).setTimeout(60);
      const tx = txb.build();
      tx.sign(this.issuerKeypair);
      const res = await this.server.submitTransaction(tx);
      return { success: true, transactionHash: res.hash };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Clawback de tokens (requer CLAWBACK_ENABLED no emissor)
   */
  async clawbackTokens(fromPublicKey, assetCode, amount) {
    try {
      const asset = new StellarSdk.Asset(assetCode, this.issuerKeypair.publicKey());
      const issuerAccount = await this.server.loadAccount(this.issuerKeypair.publicKey());
      const txb = new StellarSdk.TransactionBuilder(issuerAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: this.getNetworkPassphrase()
      }).addOperation(StellarSdk.Operation.clawback({
        from: fromPublicKey,
        asset: asset,
        amount: this.formatAmount(amount)
      })).setTimeout(60);
      const tx = txb.build();
      tx.sign(this.issuerKeypair);
      const res = await this.server.submitTransaction(tx);
      return { success: true, transactionHash: res.hash };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtém informações do token
   * @param {string} assetCode - Código do asset
   */
  async getTokenInfo(assetCode) {
    try {
      const asset = new StellarSdk.Asset(assetCode, this.issuerKeypair.publicKey());
      const issuerAccount = await this.server.loadAccount(this.issuerKeypair.publicKey());
      
      // Buscar dados do asset
      const propertyURI = issuerAccount.data_attr.property_uri 
        ? Buffer.from(issuerAccount.data_attr.property_uri, 'base64').toString()
        : null;
      
      const tokenName = issuerAccount.data_attr.token_name
        ? Buffer.from(issuerAccount.data_attr.token_name, 'base64').toString()
        : null;

      return {
        success: true,
        assetCode: assetCode,
        issuer: this.issuerKeypair.publicKey(),
        propertyURI: propertyURI,
        tokenName: tokenName,
        decimals: 7
      };
      
    } catch (error) {
      console.error('Erro ao obter informações do token:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = RealEstateToken;

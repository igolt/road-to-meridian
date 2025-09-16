const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PasskeyServer } = require('passkey-kit');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar PasskeyServer
const passkeyServer = new PasskeyServer({
  rpcUrl: process.env.RPC_URL || 'https://soroban-testnet.stellar.org:443',
  launchtubeUrl: process.env.LAUNCHTUBE_URL,
  launchtubeJwt: process.env.LAUNCHTUBE_JWT,
  mercuryUrl: process.env.MERCURY_URL,
  mercuryJwt: process.env.MERCURY_JWT,
});

// Rota para obter contractId baseado em keyId
app.get('/api/contract-id', async (req, res) => {
  try {
    const { keyId, publicKey, policy } = req.query;
    
    const contractId = await passkeyServer.getContractId({
      keyId,
      publicKey,
      policy
    });
    
    res.json({ contractId });
  } catch (error) {
    console.error('Erro ao obter contractId:', error);
    res.status(500).json({ error: 'Erro ao obter contractId' });
  }
});

// Rota para enviar transação assinada
app.post('/api/send-transaction', async (req, res) => {
  try {
    const { transaction, fee } = req.body;
    
    const result = await passkeyServer.send(transaction, fee);
    
    res.json({ result });
  } catch (error) {
    console.error('Erro ao enviar transação:', error);
    res.status(500).json({ error: 'Erro ao enviar transação' });
  }
});

// Rota para obter signers de uma carteira
app.get('/api/signers/:contractId', async (req, res) => {
  try {
    const { contractId } = req.params;
    
    const signers = await passkeyServer.getSigners(contractId);
    
    res.json({ signers });
  } catch (error) {
    console.error('Erro ao obter signers:', error);
    res.status(500).json({ error: 'Erro ao obter signers' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor PasskeyKit rodando na porta ${PORT}`);
  console.log(`📡 RPC URL: ${process.env.RPC_URL || 'https://soroban-testnet.stellar.org:443'}`);
  console.log(`🔗 Launchtube URL: ${process.env.LAUNCHTUBE_URL || 'Não configurado'}`);
  console.log(`📊 Mercury URL: ${process.env.MERCURY_URL || 'Não configurado'}`);
});

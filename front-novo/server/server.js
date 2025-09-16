const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rota para obter contractId baseado em keyId (mock por enquanto)
app.get('/api/contract-id', async (req, res) => {
  try {
    const { keyId } = req.query;
    
    // Mock: retorna um contractId simulado
    const contractId = `C${keyId ? keyId.substring(0, 20) : 'MOCK'}`;
    
    res.json({ contractId });
  } catch (error) {
    console.error('Erro ao obter contractId:', error);
    res.status(500).json({ error: 'Erro ao obter contractId' });
  }
});

// Rota para enviar transação assinada (mock por enquanto)
app.post('/api/send-transaction', async (req, res) => {
  try {
    const { transaction, fee } = req.body;
    
    // Mock: simula envio de transação
    const result = {
      hash: `TXN_${Date.now()}`,
      status: 'success',
      fee: fee || 100
    };
    
    res.json({ result });
  } catch (error) {
    console.error('Erro ao enviar transação:', error);
    res.status(500).json({ error: 'Erro ao enviar transação' });
  }
});

// Rota para obter signers de uma carteira (mock por enquanto)
app.get('/api/signers/:contractId', async (req, res) => {
  try {
    const { contractId } = req.params;
    
    // Mock: retorna signers simulados
    const signers = [
      {
        keyId: 'mock-key-id',
        publicKey: 'mock-public-key',
        type: 'secp256r1'
      }
    ];
    
    res.json({ signers });
  } catch (error) {
    console.error('Erro ao obter signers:', error);
    res.status(500).json({ error: 'Erro ao obter signers' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'RealYild PasskeyKit Server - Mock Mode'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor PasskeyKit (Mock) rodando na porta ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API endpoints disponíveis:`);
  console.log(`   GET  /api/contract-id?keyId=...`);
  console.log(`   POST /api/send-transaction`);
  console.log(`   GET  /api/signers/:contractId`);
});

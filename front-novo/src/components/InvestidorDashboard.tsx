import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { StellarService } from '../services/StellarService';

interface InvestidorDashboardProps {
  onBack: () => void;
}

export const InvestidorDashboard: React.FC<InvestidorDashboardProps> = ({ onBack }) => {
  const [stellarService] = useState(() => new StellarService());
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [transferForm, setTransferForm] = useState({
    destination: '',
    amount: '',
    assetCode: ''
  });

  const handleConnectWallet = async () => {
    try {
      await stellarService.connectWallet();
      setIsConnected(true);
      const accountBalance = await stellarService.getAccountBalance();
      setBalance(accountBalance);
    } catch (error) {
      console.error('Erro ao conectar carteira:', error);
    }
  };

  const handleTransfer = async () => {
    if (!transferForm.destination || !transferForm.amount || !transferForm.assetCode) {
      alert('Preencha todos os campos');
      return;
    }

    try {
      const transaction = await stellarService.transferTokens(
        transferForm.destination,
        Number(transferForm.amount),
        transferForm.assetCode
      );
      console.log('Transferência realizada:', transaction);
      alert('Transferência realizada com sucesso!');
    } catch (error) {
      console.error('Erro ao transferir:', error);
      alert('Erro ao realizar transferência');
    }
  };

  const handleGetTokenInfo = async () => {
    if (!transferForm.assetCode) {
      alert('Digite o código do asset');
      return;
    }

    try {
      const tokenInfo = await stellarService.getTokenInfo(transferForm.assetCode, '');
      console.log('Informações do token:', tokenInfo);
      alert(`Token: ${tokenInfo.name}\nDescrição: ${tokenInfo.description}\nSupply: ${tokenInfo.totalSupply}`);
    } catch (error) {
      console.error('Erro ao obter informações:', error);
      alert('Erro ao obter informações do token');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="mb-4"
          >
            ← Voltar
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Investidor</h1>
          <p className="text-gray-600 mt-2">Gerencie seus investimentos em tokens de imóveis</p>
        </div>

        {/* Wallet Connection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Carteira Stellar</CardTitle>
            <CardDescription>
              Conecte sua carteira Freighter para começar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isConnected ? (
              <Button onClick={handleConnectWallet} className="bg-blue-600 hover:bg-blue-700">
                Conectar Carteira
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">Carteira Conectada</span>
                </div>
                <div className="text-sm text-gray-600">
                  Saldo: {balance.toFixed(2)} XLM
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Portfolio Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Portfólio de Investimentos</CardTitle>
            <CardDescription>
              Visão geral dos seus tokens de imóveis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600">Tokens Ativos</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">R$ 0,00</div>
                <div className="text-sm text-gray-600">Valor Total</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">0%</div>
                <div className="text-sm text-gray-600">Rendimento</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Token Operations */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Transfer Tokens */}
          <Card>
            <CardHeader>
              <CardTitle>Transferir Tokens</CardTitle>
              <CardDescription>
                Envie tokens para outra conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="transferAsset">Código do Asset</Label>
                <Input
                  id="transferAsset"
                  placeholder="Ex: PROP1"
                  value={transferForm.assetCode}
                  onChange={(e) => setTransferForm({ ...transferForm, assetCode: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="transferDestination">Destino</Label>
                <Input
                  id="transferDestination"
                  placeholder="Chave pública de destino"
                  value={transferForm.destination}
                  onChange={(e) => setTransferForm({ ...transferForm, destination: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="transferAmount">Quantidade</Label>
                <Input
                  id="transferAmount"
                  type="number"
                  placeholder="100"
                  value={transferForm.amount}
                  onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                />
              </div>
              <Button 
                onClick={handleTransfer}
                disabled={!isConnected}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Transferir
              </Button>
            </CardContent>
          </Card>

          {/* Token Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Token</CardTitle>
              <CardDescription>
                Consulte detalhes de um token específico
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="infoAsset">Código do Asset</Label>
                <Input
                  id="infoAsset"
                  placeholder="Ex: PROP1"
                  value={transferForm.assetCode}
                  onChange={(e) => setTransferForm({ ...transferForm, assetCode: e.target.value })}
                />
              </div>
              <Button 
                onClick={handleGetTokenInfo}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Consultar Token
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { StellarService } from '../services/StellarService';
import { StellarTokenConfig } from '../types';

interface EmpresaDashboardProps {
  onBack: () => void;
}

export const EmpresaDashboard: React.FC<EmpresaDashboardProps> = ({ onBack }) => {
  const [stellarService] = useState(() => new StellarService());
  const [isConnected, setIsConnected] = useState(false);
  const [tokenConfig, setTokenConfig] = useState<Partial<StellarTokenConfig>>({
    assetCode: '',
    name: '',
    description: '',
    propertyURI: '',
    homeDomain: '',
    authRequired: true,
    authRevocable: true,
    clawbackEnabled: true,
    initialSupply: 1000000
  });

  const handleConnectWallet = async () => {
    try {
      await stellarService.connectWallet();
      setIsConnected(true);
    } catch (error) {
      console.error('Erro ao conectar carteira:', error);
    }
  };

  const handleCreateToken = async () => {
    if (!tokenConfig.assetCode || !tokenConfig.name) {
      alert('Preencha pelo menos o código do asset e o nome');
      return;
    }

    try {
      const transaction = await stellarService.createRealEstateToken(tokenConfig as StellarTokenConfig);
      console.log('Token criado:', transaction);
      alert('Token criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar token:', error);
      alert('Erro ao criar token');
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Empresa</h1>
          <p className="text-gray-600 mt-2">Gerencie seus tokens de imóveis</p>
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
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-600 font-medium">Carteira Conectada</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Token Creation Form */}
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Token de Imóvel</CardTitle>
            <CardDescription>
              Configure os parâmetros do seu token de imóvel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assetCode">Código do Asset</Label>
                <Input
                  id="assetCode"
                  placeholder="Ex: PROP1"
                  value={tokenConfig.assetCode}
                  onChange={(e) => setTokenConfig({ ...tokenConfig, assetCode: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="name">Nome do Token</Label>
                <Input
                  id="name"
                  placeholder="Ex: Propriedade Residencial SP"
                  value={tokenConfig.name}
                  onChange={(e) => setTokenConfig({ ...tokenConfig, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                placeholder="Descrição detalhada do imóvel"
                value={tokenConfig.description}
                onChange={(e) => setTokenConfig({ ...tokenConfig, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="propertyURI">URI da Documentação</Label>
                <Input
                  id="propertyURI"
                  placeholder="https://exemplo.com/documentacao"
                  value={tokenConfig.propertyURI}
                  onChange={(e) => setTokenConfig({ ...tokenConfig, propertyURI: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="homeDomain">Domínio (opcional)</Label>
                <Input
                  id="homeDomain"
                  placeholder="exemplo.com"
                  value={tokenConfig.homeDomain}
                  onChange={(e) => setTokenConfig({ ...tokenConfig, homeDomain: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="initialSupply">Fornecimento Inicial</Label>
              <Input
                id="initialSupply"
                type="number"
                placeholder="1000000"
                value={tokenConfig.initialSupply}
                onChange={(e) => setTokenConfig({ ...tokenConfig, initialSupply: Number(e.target.value) })}
              />
            </div>

            <Button 
              onClick={handleCreateToken}
              disabled={!isConnected}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Criar Token
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

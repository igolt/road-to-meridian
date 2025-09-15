import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { StellarService } from '../services/StellarService';

interface RealYildScreenProps {
  onSelectEmpresa: () => void;
  onSelectInvestidor: () => void;
}

export const RealYildScreen: React.FC<RealYildScreenProps> = ({ 
  onSelectEmpresa, 
  onSelectInvestidor 
}) => {
  const [stellarService] = useState(() => new StellarService());
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleWalletLogin = async () => {
    setIsConnecting(true);
    try {
      const account = await stellarService.connectWallet();
      setIsWalletConnected(true);
      setWalletAddress(account.publicKey);
    } catch (error) {
      console.error('Erro ao conectar carteira:', error);
      alert('Erro ao conectar carteira. Certifique-se de que o Freighter está instalado e desbloqueado.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await stellarService.disconnectWallet();
      setIsWalletConnected(false);
      setWalletAddress('');
    } catch (error) {
      console.error('Erro ao desconectar carteira:', error);
    }
  };

  const formatAddress = (address: string) => {
    if (address.length <= 20) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
            RealYild
          </h1>
          <p className="text-xl text-gray-600 max-w-xl mx-auto">
            Plataforma de tokenização de imóveis na rede Stellar
          </p>
        </div>

        {/* Wallet Connection Card */}
        <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-800">Carteira Digital</CardTitle>
            <CardDescription className="text-gray-600">
              Conecte sua carteira Freighter para acessar a plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {!isWalletConnected ? (
              <div className="space-y-4">
                <Button 
                  onClick={handleWalletLogin}
                  disabled={isConnecting}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 text-lg shadow-lg"
                >
                  {isConnecting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Conectando...</span>
                    </div>
                  ) : (
                    'Conectar Carteira'
                  )}
                </Button>
                <p className="text-sm text-gray-500">
                  Certifique-se de ter o Freighter instalado e desbloqueado
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 font-medium">Carteira Conectada</span>
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Endereço:</strong> {formatAddress(walletAddress)}
                </div>
                <Button 
                  onClick={handleDisconnect}
                  variant="outline"
                  className="w-full"
                >
                  Desconectar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Type Selection */}
        {isWalletConnected && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Empresa Card */}
            <Card 
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-purple-500 bg-white/80 backdrop-blur-sm"
              onClick={onSelectEmpresa}
            >
              <CardHeader className="text-center pb-4">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  🏢
                </div>
                <CardTitle className="text-2xl text-gray-900">
                  Empresa
                </CardTitle>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Tokenize seus imóveis e gerencie ativos imobiliários na blockchain
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 text-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectEmpresa();
                  }}
                >
                  Acessar como Empresa
                </Button>
              </CardContent>
            </Card>

            {/* Investidor Card */}
            <Card 
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-500 bg-white/80 backdrop-blur-sm"
              onClick={onSelectInvestidor}
            >
              <CardHeader className="text-center pb-4">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  💰
                </div>
                <CardTitle className="text-2xl text-gray-900">
                  Investidor
                </CardTitle>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Invista em tokens de imóveis e diversifique seu portfólio
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 text-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectInvestidor();
                  }}
                >
                  Acessar como Investidor
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-500">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-sm">Powered by Stellar Network</span>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
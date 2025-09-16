import { useState, useEffect } from 'react';
import { StellarPasskeyService, type StellarUser } from '../services/StellarPasskeyService';
import { useToast } from './Toast';

interface WalletMenuProps {
  onDisconnect: () => void;
}

export const WalletMenu: React.FC<WalletMenuProps> = ({ onDisconnect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<StellarUser | null>(null);
  const [balance, setBalance] = useState<string>('0.00');
  const [isLoading, setIsLoading] = useState(true);

  const passkeyService = StellarPasskeyService.getInstance();
  const { addToast, ToastContainer } = useToast();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = passkeyService.getCurrentUser();
        setUser(currentUser);
        
        // Simular carregamento de saldo
        setTimeout(() => {
          setBalance('1,250.50');
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleDisconnect = async () => {
    await passkeyService.disconnect();
    onDisconnect();
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      addToast(`${label} copiado para a área de transferência!`, 'success');
    } catch (error) {
      addToast('Erro ao copiar para a área de transferência', 'error');
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return 'N/A';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* Botão do Menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 bg-white rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200"
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {user.segment === 'empresa' ? '🏢' : '💰'}
            </span>
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-gray-900">
              {user.displayName}
            </div>
            <div className="text-xs text-gray-500">
              {isLoading ? 'Carregando...' : `${balance} USDC`}
            </div>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Overlay para fechar o menu */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
            {/* Header do Menu */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">
                    {user.segment === 'empresa' ? '🏢' : '💰'}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {user.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {user.segment === 'empresa' ? 'Conta Empresa' : 'Conta Investidor'}
                  </p>
                </div>
              </div>
            </div>

            {/* Saldo da Carteira */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Saldo Total</p>
                  <p className="text-lg font-bold text-gray-900">
                    {isLoading ? 'Carregando...' : `${balance} USDC`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Valor em BRL</p>
                  <p className="text-sm font-medium text-gray-700">
                    {isLoading ? '...' : 'R$ 6.250,25'}
                  </p>
                </div>
              </div>
            </div>

            {/* Informações da Carteira */}
            <div className="px-4 py-3 border-b border-gray-100">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Informações da Carteira
              </h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Endereço:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono text-gray-900">
                      {formatAddress(user.contractAddress || '')}
                    </span>
                    <button
                      onClick={() => copyToClipboard(user.contractAddress || '', 'Endereço')}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {user.keyIdBase64 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Key ID:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-mono text-gray-900">
                        {formatAddress(user.keyIdBase64)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(user.keyIdBase64 || '', 'Key ID')}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Ações */}
            <div className="px-4 py-3">
              <div className="space-y-2">
                <button
                  onClick={() => {
                    // Aqui você pode implementar a funcionalidade de ver detalhes
                    console.log('Ver detalhes da carteira');
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Ver Detalhes da Carteira</span>
                </button>
                
                <button
                  onClick={() => {
                    // Aqui você pode implementar a funcionalidade de configurações
                    console.log('Configurações da carteira');
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Configurações</span>
                </button>
                
                <hr className="my-2" />
                
                <button
                  onClick={handleDisconnect}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Desconectar</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

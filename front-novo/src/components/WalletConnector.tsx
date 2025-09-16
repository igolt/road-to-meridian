import React, { useState, useEffect } from 'react';
import { useSorobanReact } from '@soroban-react/core';

const WalletConnector = () => {
  const sorobanContext = useSorobanReact();
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Verificar se a carteira já está conectada ao carregar o componente
  useEffect(() => {
    const checkConnection = async () => {
      if (sorobanContext.address) {
        setIsConnected(true);
        setAccount(sorobanContext.address);
      }
    };
    checkConnection();
  }, [sorobanContext.address]);

  const connectWallet = async () => {
    setLoading(true);
    try {
      // Conectar à carteira Freighter
      await sorobanContext.connect();
      setIsConnected(true);
      setAccount(sorobanContext.address);
      console.log('Carteira conectada:', sorobanContext.address);
    } catch (error) {
      console.error('Erro ao conectar carteira:', error);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await sorobanContext.disconnect();
      setIsConnected(false);
      setAccount(null);
      console.log('Carteira desconectada');
    } catch (error) {
      console.error('Erro ao desconectar carteira:', error);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      margin: '20px 0'
    }}>
      <h2 style={{ color: '#333', marginBottom: '15px' }}>
        🔗 Conexão com Carteira Stellar
      </h2>
      
      {!isConnected ? (
        <button 
          onClick={connectWallet} 
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            if (!loading) {
              (e.target as HTMLButtonElement).style.backgroundColor = '#0056b3';
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              (e.target as HTMLButtonElement).style.backgroundColor = '#007bff';
            }
          }}
        >
          {loading ? '🔄 Conectando...' : '🔗 Conectar Carteira Freighter'}
        </button>
      ) : (
        <div>
          <div style={{ 
            backgroundColor: '#d4edda', 
            padding: '15px', 
            borderRadius: '6px',
            marginBottom: '15px',
            border: '1px solid #c3e6cb'
          }}>
            <p style={{ margin: '0 0 10px 0', color: '#155724', fontWeight: 'bold' }}>
              ✅ Carteira Conectada
            </p>
            <p style={{ 
              margin: '0', 
              wordBreak: 'break-all', 
              color: '#155724',
              fontSize: '14px',
              fontFamily: 'monospace'
            }}>
              <strong>Endereço:</strong> {account}
            </p>
          </div>
          
          <button 
            onClick={disconnectWallet}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#c82333'}
            onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#dc3545'}
          >
            🚪 Desconectar
          </button>
        </div>
      )}
      
      {!isConnected && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '4px',
          fontSize: '14px',
          color: '#6c757d'
        }}>
          <p style={{ margin: '0' }}>
            💡 <strong>Dica:</strong> Certifique-se de ter a extensão Freighter instalada no seu navegador.
          </p>
        </div>
      )}
    </div>
  );
};

export default WalletConnector;

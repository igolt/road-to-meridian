import { useState } from 'react';
// import { useSorobanReact } from '@soroban-react/core';
import EmpresaDashboard from './components/EmpresaDashboard';
import InvestidorDashboard from './components/InvestidorDashboard';

type AppState = 'realyield' | 'empresa' | 'investidor';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('realyield');
  // const [isConnecting, setIsConnecting] = useState(false);
  // const [connectionError, setConnectionError] = useState<string | null>(null);
  // const sorobanContext = useSorobanReact();

  // const connectWalletAndNavigate = async (targetState: 'empresa' | 'investidor') => {
  //   setIsConnecting(true);
  //   setConnectionError(null);
  //   
  //   try {
  //     // Conectar à carteira se não estiver conectada
  //     if (!sorobanContext.address) {
  //       await sorobanContext.connect();
  //     }
  //     
  //     // Navegar para o dashboard correspondente
  //     setCurrentState(targetState);
  //   } catch (error) {
  //     console.error('Erro ao conectar carteira:', error);
  //     setConnectionError('Erro ao conectar carteira. Verifique se a extensão Freighter está instalada.');
  //   } finally {
  //     setIsConnecting(false);
  //   }
  // };

  const handleSelectEmpresa = () => {
    // connectWalletAndNavigate('empresa');
    setCurrentState('empresa');
  };

  const handleSelectInvestidor = () => {
    // connectWalletAndNavigate('investidor');
    setCurrentState('investidor');
  };

  // const handleBackToRealYield = () => {
  //   setCurrentState('realyield');
  //   // setConnectionError(null);
  // };

  if (currentState === 'empresa') {
    return <EmpresaDashboard />;
  }

  if (currentState === 'investidor') {
    return <InvestidorDashboard />;
  }

  // Tela principal RealYield
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        fontSize: '4rem', 
        color: 'white', 
        marginBottom: '20px',
        textAlign: 'center',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        RealYield
      </h1>
      <p style={{ 
        fontSize: '1.2rem', 
        color: 'white', 
        textAlign: 'center',
        marginBottom: '40px',
        textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
      }}>
        Plataforma de tokenização de imóveis na rede Stellar
      </p>
      
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        justifyContent: 'center', 
        flexWrap: 'wrap',
        maxWidth: '600px',
        width: '100%'
      }}>
        <button 
          onClick={handleSelectEmpresa}
          // disabled={isConnecting}
          style={{
            padding: '20px 40px',
            backgroundColor: '#8b5cf6', // isConnecting ? '#9ca3af' : '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            cursor: 'pointer', // isConnecting ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
            flex: '1',
            minWidth: '200px',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => {
            // if (!isConnecting) {
              (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
            // }
          }}
          onMouseOut={(e) => (e.target as HTMLButtonElement).style.transform = 'translateY(0)'}
        >
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
            🏢 {/* {isConnecting ? '🔄' : '🏢'} */}
          </div>
          <div>Empresa</div> {/* {isConnecting ? 'Conectando...' : 'Empresa'} */}
          <div style={{ fontSize: '14px', opacity: 0.9, marginTop: '5px' }}>
            Tokenize seus imóveis {/* {isConnecting ? 'Aguarde...' : 'Tokenize seus imóveis'} */}
          </div>
        </button>
        
        <button 
          onClick={handleSelectInvestidor}
          // disabled={isConnecting}
          style={{
            padding: '20px 40px',
            backgroundColor: '#3b82f6', // isConnecting ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            cursor: 'pointer', // isConnecting ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
            flex: '1',
            minWidth: '200px',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => {
            // if (!isConnecting) {
              (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
            // }
          }}
          onMouseOut={(e) => (e.target as HTMLButtonElement).style.transform = 'translateY(0)'}
        >
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
            💰 {/* {isConnecting ? '🔄' : '💰'} */}
          </div>
          <div>Investidor</div> {/* {isConnecting ? 'Conectando...' : 'Investidor'} */}
          <div style={{ fontSize: '14px', opacity: 0.9, marginTop: '5px' }}>
            Invista em tokens {/* {isConnecting ? 'Aguarde...' : 'Invista em tokens'} */}
          </div>
        </button>
      </div>
      
      {/* Mensagem de erro de conexão */}
      {/* {connectionError && (
        <div style={{ 
          maxWidth: '600px',
          width: '100%',
          marginTop: '20px',
          padding: '15px',
          backgroundColor: 'rgba(220, 53, 69, 0.9)',
          color: 'white',
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '14px'
        }}>
          ⚠️ {connectionError}
        </div>
      )} */}
      
      <div style={{ 
        color: 'white', 
        fontSize: '14px',
        opacity: 0.8,
        marginTop: '40px',
        textAlign: 'center'
      }}>
        Powered by Stellar Network
      </div>
    </div>
  );
}

export default App;
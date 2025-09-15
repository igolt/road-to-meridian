import React, { useState } from 'react';

type AppState = 'realyild' | 'empresa' | 'investidor';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('realyild');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSelectEmpresa = async () => {
    setIsAuthenticating(true);
    // Simular autenticação
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCurrentState('empresa');
    setIsAuthenticating(false);
  };

  const handleSelectInvestidor = async () => {
    setIsAuthenticating(true);
    // Simular autenticação
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCurrentState('investidor');
    setIsAuthenticating(false);
  };

  const handleBackToRealYild = () => {
    setCurrentState('realyild');
  };

  if (currentState === 'empresa') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f0f0f0', 
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <button 
          onClick={handleBackToRealYild}
          style={{
            padding: '10px 20px',
            backgroundColor: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          ← Voltar para RealYild
        </button>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>Dashboard Empresa</h1>
        <p style={{ color: '#666' }}>Gerencie seus tokens de imóveis</p>
      </div>
    );
  }

  if (currentState === 'investidor') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f0f0f0', 
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <button 
          onClick={handleBackToRealYild}
          style={{
            padding: '10px 20px',
            backgroundColor: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          ← Voltar para RealYild
        </button>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>Dashboard Investidor</h1>
        <p style={{ color: '#666' }}>Gerencie seus investimentos em tokens de imóveis</p>
      </div>
    );
  }

  if (isAuthenticating) {
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
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '40px',
          borderRadius: '20px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          maxWidth: '500px',
          width: '100%'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔐</div>
          <h2 style={{ color: '#333', marginBottom: '20px', fontSize: '1.8rem' }}>
            Autenticação com Passkey
          </h2>
          <div className="spinner"></div>
          <p style={{ color: '#666', marginTop: '20px' }}>
            Aguarde a autenticação...
          </p>
        </div>
      </div>
    );
  }

  // Tela principal RealYild
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
        RealYild
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
          style={{
            padding: '20px 40px',
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
            flex: '1',
            minWidth: '200px',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🏢</div>
          <div>Empresa</div>
          <div style={{ fontSize: '14px', opacity: 0.9, marginTop: '5px' }}>
            Tokenize seus imóveis
          </div>
        </button>
        
        <button 
          onClick={handleSelectInvestidor}
          style={{
            padding: '20px 40px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
            flex: '1',
            minWidth: '200px',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💰</div>
          <div>Investidor</div>
          <div style={{ fontSize: '14px', opacity: 0.9, marginTop: '5px' }}>
            Invista em tokens
          </div>
        </button>
      </div>
      
      <div style={{ 
        color: 'white', 
        fontSize: '14px',
        opacity: 0.8,
        marginTop: '40px',
        textAlign: 'center'
      }}>
        Powered by Stellar Network • Autenticação com Passkey
      </div>
    </div>
  );
}

export default App;
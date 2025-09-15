import React, { useState } from 'react';
import EmpresaDashboard from './components/EmpresaDashboard';

type AppState = 'realyield' | 'empresa' | 'investidor';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('realyield');

  const handleSelectEmpresa = () => {
    setCurrentState('empresa');
  };

  const handleSelectInvestidor = () => {
    setCurrentState('investidor');
  };

  const handleBackToRealYield = () => {
    setCurrentState('realyield');
  };

  if (currentState === 'empresa') {
    return <EmpresaDashboard />;
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
          onClick={handleBackToRealYield}
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
          ← Voltar para RealYield
        </button>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>Dashboard Investidor</h1>
        <p style={{ color: '#666' }}>Gerencie seus investimentos em tokens de imóveis</p>
      </div>
    );
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
        Powered by Stellar Network
      </div>
    </div>
  );
}

export default App;
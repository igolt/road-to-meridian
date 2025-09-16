import React from 'react';

export const TestScreen: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f0f0f0', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '20px'
    }}>
      <h1 style={{ 
        fontSize: '3rem', 
        color: '#333', 
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        RealYield
      </h1>
      <p style={{ 
        fontSize: '1.2rem', 
        color: '#666', 
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        Plataforma de tokenização de imóveis na rede Stellar
      </p>
      <div style={{
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button 
          style={{
            padding: '15px 30px',
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
          onClick={() => alert('Empresa selecionada!')}
        >
          🏢 Empresa
        </button>
        <button 
          style={{
            padding: '15px 30px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
          onClick={() => alert('Investidor selecionado!')}
        >
          💰 Investidor
        </button>
      </div>
    </div>
  );
};

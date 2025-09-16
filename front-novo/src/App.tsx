import { useState, useEffect } from 'react';
import { StellarPasskeyService, type StellarUser } from './services/StellarPasskeyService';

type AppState = 'realyild' | 'empresa' | 'investidor';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('realyild');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [currentUser, setCurrentUser] = useState<StellarUser | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const passkeyService = StellarPasskeyService.getInstance();

  useEffect(() => {
    // Verificar suporte ao Passkey e carregar usuário salvo
    setIsSupported(passkeyService.isSupported());
    const storedUser = passkeyService.loadStoredUser();
    if (storedUser) {
      setCurrentUser(storedUser);
      setCurrentState(storedUser.segment);
    }
  }, []);

  const handleSelectEmpresa = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    
    try {
      // Tentar conectar com carteira existente primeiro
      let user = await passkeyService.connectWallet('empresa');
      
      // Se não conseguir conectar, criar nova carteira
      if (!user) {
        user = await passkeyService.createWallet('empresa');
      }
      
      if (user) {
        setCurrentUser(user);
        setCurrentState('empresa');
      } else {
        setAuthError('Falha na autenticação com Passkey');
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      setAuthError('Erro na autenticação: ' + (error as Error).message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSelectInvestidor = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    
    try {
      // Tentar conectar com carteira existente primeiro
      let user = await passkeyService.connectWallet('investidor');
      
      // Se não conseguir conectar, criar nova carteira
      if (!user) {
        user = await passkeyService.createWallet('investidor');
      }
      
      if (user) {
        setCurrentUser(user);
        setCurrentState('investidor');
      } else {
        setAuthError('Falha na autenticação com Passkey');
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      setAuthError('Erro na autenticação: ' + (error as Error).message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleBackToRealYild = async () => {
    await passkeyService.disconnect();
    setCurrentUser(null);
    setCurrentState('realyild');
    setAuthError(null);
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
        <p style={{ color: '#666', marginBottom: '20px' }}>Gerencie seus tokens de imóveis</p>
        {currentUser && (
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>Informações da Carteira</h3>
            <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>
              <strong>Nome:</strong> {currentUser.name}
            </p>
            {currentUser.publicKey && (
              <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>
                <strong>Chave Pública:</strong> {currentUser.publicKey.substring(0, 20)}...
              </p>
            )}
            {currentUser.contractAddress && (
              <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>
                <strong>Contrato:</strong> {currentUser.contractAddress.substring(0, 20)}...
              </p>
            )}
          </div>
        )}
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
        <p style={{ color: '#666', marginBottom: '20px' }}>Gerencie seus investimentos em tokens de imóveis</p>
        {currentUser && (
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>Informações da Carteira</h3>
            <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>
              <strong>Nome:</strong> {currentUser.name}
            </p>
            {currentUser.publicKey && (
              <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>
                <strong>Chave Pública:</strong> {currentUser.publicKey.substring(0, 20)}...
              </p>
            )}
            {currentUser.contractAddress && (
              <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>
                <strong>Contrato:</strong> {currentUser.contractAddress.substring(0, 20)}...
              </p>
            )}
          </div>
        )}
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
            {isSupported ? 'Aguarde a autenticação com Passkey...' : 'Navegador não suporta Passkey'}
          </p>
          {authError && (
            <div style={{ 
              backgroundColor: '#fee', 
              color: '#c33', 
              padding: '10px', 
              borderRadius: '5px', 
              marginTop: '15px',
              fontSize: '14px'
            }}>
              {authError}
            </div>
          )}
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
          onMouseOver={(e) => (e.target as HTMLElement).style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => (e.target as HTMLElement).style.transform = 'translateY(0)'}
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
          onMouseOver={(e) => (e.target as HTMLElement).style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => (e.target as HTMLElement).style.transform = 'translateY(0)'}
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
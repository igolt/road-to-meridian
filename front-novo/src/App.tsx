import { useState, useEffect } from 'react';
import { StellarPasskeyService, type StellarUser } from './services/StellarPasskeyService';
import EmpresaDashboard from './components/EmpresaDashboard';
import InvestidorDashboard from './components/InvestidorDashboard';

type AppState = 'realyield' | 'empresa' | 'investidor';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('realyield');
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

  const handleBackToRealYield = async () => {
    await passkeyService.disconnect();
    setCurrentUser(null);
    setCurrentState('realyield');
    setAuthError(null);
  };

  if (currentState === 'empresa') {
    return <EmpresaDashboard currentUser={currentUser} onBack={handleBackToRealYield} />;
  }

  if (currentState === 'investidor') {
    return <InvestidorDashboard currentUser={currentUser} onBack={handleBackToRealYield} />;
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
        Powered by Stellar Network
      </div>
    </div>
  );
}

export default App;
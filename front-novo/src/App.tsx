import { useState } from 'react';
import SorobanProvider from './components/SorobanProvider';
import EmpresaDashboard from './components/EmpresaDashboard';
import InvestidorDashboard from './components/InvestidorDashboard';
import { useI18n } from './i18n/index';
import { useWallet } from './wallet/WalletProvider';
import { useSorobanReact } from '@soroban-react/core';

type AppState = 'realyield' | 'empresa' | 'investidor';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('realyield');
  const { t, toggleLocale } = useI18n();
  const { connect, isConnecting } = useWallet();
  const soroban = useSorobanReact();
  const [connectionError, setConnectionError] = useState<string | null>(null);

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

  const handleSelectEmpresa = async () => {
    setConnectionError(null);
    try {
      // Garante gesto do usuário para abrir popup
      if (!soroban.address) {
        await soroban.connect();
      }
      setCurrentState('empresa');
      // Sincroniza provider local sem bloquear navegação
      connect().catch(() => {});
    } catch (error) {
      setConnectionError('Falha ao conectar carteira. Verifique a extensão Freighter.');
    }
  };

  const handleSelectInvestidor = async () => {
    setConnectionError(null);
    try {
      // Garante gesto do usuário para abrir popup
      if (!soroban.address) {
        await soroban.connect();
      }
      setCurrentState('investidor');
      // Sincroniza provider local sem bloquear navegação
      connect().catch(() => {});
    } catch (error) {
      setConnectionError('Falha ao conectar carteira. Verifique a extensão Freighter.');
    }
  };

  // const handleBackToRealYield = () => {
  //   setCurrentState('realyield');
  //   // setConnectionError(null);
  // };

  // App inteiro sob o provider para permitir conexão na landing
  return (
    <SorobanProvider>
    {currentState === 'empresa' && <EmpresaDashboard />}
    {currentState === 'investidor' && <InvestidorDashboard />}
    {currentState === 'realyield' && (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>

      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                         radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                         radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)`,
        animation: 'float 20s ease-in-out infinite'
      }} />

      {/* Header */}
      <header style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #4C8BF5 0%, #8b5cf6 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'white',
            boxShadow: '0 8px 32px rgba(76, 139, 245, 0.3)'
          }}>
            R
          </div>
          <div>
            <h3 style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '700',
              margin: 0,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              RealYield
            </h3>
            <p style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '12px',
              margin: 0,
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}>
              Powered by Stellar
            </p>
          </div>
        </div>

        <button
          onClick={toggleLocale}
          style={{
            padding: '8px 16px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.backgroundColor = 'rgba(255,255,255,0.2)';
            target.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.backgroundColor = 'rgba(255,255,255,0.1)';
            target.style.transform = 'scale(1)';
          }}
        >
          {t('common.toggleLanguage')}
        </button>
      </header>

      {/* Main Content */}
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '120px 20px 60px',
        position: 'relative',
        zIndex: 5
      }}>

        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
          animation: 'fadeInUp 1s ease-out'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: '800',
            color: 'white',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #4C8BF5 0%, #8b5cf6 50%, #10b981 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '200% 200%',
            animation: 'gradientShift 4s ease-in-out infinite',
            textShadow: '0 0 40px rgba(76, 139, 245, 0.3)'
          }}>
            {t('landing.hero.title')}
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '40px',
            maxWidth: '600px',
            lineHeight: '1.6',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            {t('landing.hero.subtitle')}
          </p>

          {/* Taglines removidas */}
        </div>

        {/* Cards Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          maxWidth: '1000px',
          width: '100%',
          marginBottom: '60px'
        }}>

          {/* Empresa Card */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '40px 30px',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              animation: 'slideInLeft 0.8s ease-out'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 40px 100px rgba(139, 92, 246, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%)',
              borderRadius: '24px 24px 0 0'
            }} />

            <div style={{
              textAlign: 'center',
              marginBottom: '30px'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                margin: '0 auto 20px',
                boxShadow: '0 12px 32px rgba(139, 92, 246, 0.3)'
              }}>
                🏢
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1f2937',
                margin: '0 0 10px 0'
              }}>
                {t('landing.company.title')}
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                margin: 0,
                lineHeight: '1.5'
              }}>
                {t('landing.company.description')}
              </p>
            </div>

            <div style={{
              display: 'grid',
              gap: '15px',
              marginBottom: '30px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '14px',
                color: '#4b5563'
              }}>
                <span style={{ color: '#10b981' }}>✓</span>
                <span>{t('landing.company.feature1')}</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '14px',
                color: '#4b5563'
              }}>
                <span style={{ color: '#10b981' }}>✓</span>
                <span>{t('landing.company.feature2')}</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '14px',
                color: '#4b5563'
              }}>
                <span style={{ color: '#10b981' }}>✓</span>
                <span>{t('landing.company.feature3')}</span>
              </div>
            </div>

            <button onClick={handleSelectEmpresa} style={{
              width: '100%',
              padding: '16px 24px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isConnecting ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)'
            }}
            disabled={isConnecting}
            onMouseOver={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'translateY(-2px)';
              target.style.boxShadow = '0 12px 32px rgba(139, 92, 246, 0.5)';
            }}
            onMouseOut={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.4)';
            }}
            >
              {isConnecting ? 'Conectando...' : t('landing.company.button')}
            </button>
          </div>

          {/* Investidor Card */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '40px 30px',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              animation: 'slideInRight 0.8s ease-out'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 40px 100px rgba(59, 130, 246, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #4C8BF5 0%, #2563eb 100%)',
              borderRadius: '24px 24px 0 0'
            }} />

            <div style={{
              textAlign: 'center',
              marginBottom: '30px'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #4C8BF5 0%, #2563eb 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                margin: '0 auto 20px',
                boxShadow: '0 12px 32px rgba(59, 130, 246, 0.3)'
              }}>
                💰
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1f2937',
                margin: '0 0 10px 0'
              }}>
                {t('landing.investor.title')}
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                margin: 0,
                lineHeight: '1.5'
              }}>
                {t('landing.investor.description')}
              </p>
            </div>

            <div style={{
              display: 'grid',
              gap: '15px',
              marginBottom: '30px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '14px',
                color: '#4b5563'
              }}>
                <span style={{ color: '#10b981' }}>✓</span>
                <span>{t('landing.investor.feature1')}</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '14px',
                color: '#4b5563'
              }}>
                <span style={{ color: '#10b981' }}>✓</span>
                <span>{t('landing.investor.feature2')}</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '14px',
                color: '#4b5563'
              }}>
                <span style={{ color: '#10b981' }}>✓</span>
                <span>{t('landing.investor.feature3')}</span>
              </div>
            </div>

            <button onClick={handleSelectInvestidor} style={{
              width: '100%',
              padding: '16px 24px',
              background: 'linear-gradient(135deg, #4C8BF5 0%, #2563eb 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isConnecting ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)'
            }}
            disabled={isConnecting}
            onMouseOver={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'translateY(-2px)';
              target.style.boxShadow = '0 12px 32px rgba(59, 130, 246, 0.5)';
            }}
            onMouseOut={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.4)';
            }}
            >
              {isConnecting ? 'Conectando...' : t('landing.investor.button')}
            </button>
          </div>
        </div>

        {connectionError && (
          <div style={{
            marginTop: '16px',
            color: '#f87171',
            backgroundColor: 'rgba(248,113,113,0.15)',
            border: '1px solid rgba(248,113,113,0.35)',
            padding: '10px 14px',
            borderRadius: '10px'
          }}>
            {connectionError}
          </div>
        )}

        {/* Seção de métricas removida */}
      </main>

      {/* Footer */}
      <footer style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        right: '20px',
        textAlign: 'center',
        zIndex: 5
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '10px'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            background: 'linear-gradient(135deg, #4C8BF5 0%, #8b5cf6 100%)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            color: 'white'
          }}>
            S
          </div>
          <span style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {t('landing.footer.powered')}
          </span>
        </div>
        <p style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '12px',
          margin: 0
        }}>
          {t('landing.footer.tagline')}
        </p>
      </footer>

    </div>
    )}
    </SorobanProvider>
  );
}

export default App;
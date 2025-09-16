import { useState } from 'react';
// import { useWallet } from '../wallet/WalletProvider';
import { useI18n } from '../i18n/index';

interface RWAFormData {
  assetName: string;
  definition: string;
  totalSupply: string;
  propertyURI: string;
  metadatas: string;
  constructionType: string;
  location: string;
  expectedCompletion: string;
  expectedAmount: string;
  interestRate: string;
  prazo: string;
  constructorName: string;
  tokenSymbol: string;
}

interface Contract {
  id: string;
  assetName: string;
  totalSupply: string;
  priceUSDC: string;
  status: 'active' | 'completed' | 'draft';
  createdAt: string;
  completionDate?: string;
  dueDate?: string;
  totalInvested: string;
  currentValue: string;
  profit: string;
  investors: number;
  loanAmount: string;
  interestRate: string;
  companyWallet: string;
}

type DashboardTab = 'emissao' | 'contratos' | 'metricas';

function EmpresaDashboard() {
  // const { address } = useWallet();
  const { t, toggleLocale } = useI18n();
  const [activeTab, setActiveTab] = useState<DashboardTab>('emissao');
  const [rwaForm, setRwaForm] = useState<RWAFormData>({
    assetName: '',
    definition: '',
    totalSupply: '',
    propertyURI: '',
    metadatas: '',
    constructionType: '',
    location: '',
    expectedCompletion: '',
    expectedAmount: '',
    interestRate: '',
    prazo: '12',
    constructorName: '',
    tokenSymbol: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Dados simulados de contratos
  const [contracts] = useState<Contract[]>([
    {
      id: '1',
      assetName: 'Residencial Solar Park',
      totalSupply: '1000000',
      priceUSDC: '0.50',
      status: 'active',
      createdAt: '2024-01-15',
      dueDate: '2026-01-15',
      totalInvested: '450000',
      currentValue: '520000',
      profit: '70000',
      investors: 23,
      loanAmount: '500000',
      interestRate: '12',
      companyWallet: 'GABC1234567890ABCDEF1234567890ABCDEF1234'
    },
    {
      id: '2',
      assetName: 'Torre Comercial Downtown',
      totalSupply: '2000000',
      priceUSDC: '1.00',
      status: 'completed',
      createdAt: '2023-08-20',
      completionDate: '2024-02-10',
      totalInvested: '1800000',
      currentValue: '2100000',
      profit: '300000',
      investors: 45,
      loanAmount: '2000000',
      interestRate: '15',
      companyWallet: 'GDEF1234567890ABCDEF1234567890ABCDEF5678'
    },
    {
      id: '3',
      assetName: 'Condomínio Green Valley',
      totalSupply: '1500000',
      priceUSDC: '0.75',
      status: 'active',
      createdAt: '2024-03-01',
      dueDate: '2025-09-01',
      totalInvested: '320000',
      currentValue: '380000',
      profit: '60000',
      investors: 18,
      loanAmount: '1500000',
      interestRate: '10',
      companyWallet: 'GHIJ1234567890ABCDEF1234567890ABCDEF9012'
    }
  ]);

  const handleRWAFormChange = (field: keyof RWAFormData, value: string) => {
    setRwaForm(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!rwaForm.assetName.trim()) errors.push(t('validation.assetNameRequired'));
    if (!rwaForm.definition.trim()) errors.push(t('validation.definitionRequired'));
    if (!rwaForm.totalSupply.trim()) errors.push(t('validation.totalSupplyRequired'));
    if (!rwaForm.location.trim()) errors.push(t('validation.locationRequired'));
    if (!rwaForm.expectedCompletion.trim()) errors.push(t('validation.dueDateRequired'));
    if (!rwaForm.expectedAmount.trim()) errors.push(t('validation.expectedAmountRequired'));
    if (!rwaForm.interestRate.trim()) errors.push(t('validation.interestRateRequired'));
    if (!rwaForm.prazo.trim()) errors.push(t('validation.termRequired'));
    if (!rwaForm.propertyURI.trim()) errors.push(t('validation.ipfsUriRequired'));
    if (!rwaForm.constructorName.trim()) errors.push(t('validation.constructorNameRequired'));
    if (!rwaForm.tokenSymbol.trim()) errors.push(t('validation.tokenSymbolRequired'));

    // Validações numéricas
    if (rwaForm.totalSupply && isNaN(Number(rwaForm.totalSupply))) {
      errors.push(t('validation.totalSupplyInvalid'));
    }
    if (rwaForm.expectedAmount && isNaN(Number(rwaForm.expectedAmount))) {
      errors.push(t('validation.expectedAmountInvalid'));
    }
    if (rwaForm.interestRate && isNaN(Number(rwaForm.interestRate))) {
      errors.push(t('validation.interestRateInvalid'));
    }
    if (rwaForm.prazo && isNaN(Number(rwaForm.prazo))) {
      errors.push(t('validation.termInvalid'));
    }

    return errors;
  };

  const handleCreateRWA = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);
    
    const errors = validateForm();
    if (errors.length > 0) {
      setSubmitMessage({type: 'error', text: errors.join(', ')});
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simular chamada para API
      const formData = {
        ...rwaForm,
        totalSupply: Number(rwaForm.totalSupply),
        expectedAmount: Number(rwaForm.expectedAmount),
        interestRate: Number(rwaForm.interestRate),
        prazo: Number(rwaForm.prazo),
        // companyWallet: address || 'DEMO_WALLET',
        companyWallet: 'DEMO_WALLET',
        timestamp: new Date().toISOString()
      };
      
      console.log('Enviando dados para API:', formData);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitMessage({type: 'success', text: t('messages.success')});

      // Limpar formulário
      setRwaForm({
        assetName: '',
        definition: '',
        totalSupply: '',
        propertyURI: '',
        metadatas: '',
        constructionType: '',
        location: '',
        expectedCompletion: '',
        expectedAmount: '',
        interestRate: '',
        prazo: '12',
        constructorName: '',
        tokenSymbol: ''
      });
      
    } catch (error) {
      setSubmitMessage({type: 'error', text: t('messages.error')});
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToRealYield = () => {
    window.location.reload();
  };

  const activeContracts = contracts.filter(c => c.status === 'active');
  const completedContracts = contracts.filter(c => c.status === 'completed');

  return (
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
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(76, 139, 245, 0.1) 0%, transparent 50%),
                         radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                         radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)`,
        animation: 'float 20s ease-in-out infinite',
        pointerEvents: 'none'
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
              {t('company.title')}
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

        <div style={{ display: 'flex', gap: '10px' }}>
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
          <button
            onClick={handleBackToRealYield}
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
            {t('common.back')}
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div style={{
        position: 'absolute',
        top: '80px',
        left: '40px',
        right: '40px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: '16px 24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'emissao', label: t('tabs.emission'), icon: '🏗️' },
            { id: 'contratos', label: t('tabs.contracts'), icon: '📋' },
            { id: 'metricas', label: t('tabs.metrics'), icon: '📊' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as DashboardTab)}
              style={{
                padding: '12px 20px',
                backgroundColor: activeTab === tab.id ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : 'transparent',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'rgba(107, 114, 128, 0.8)',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? '600' : '500',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: activeTab === tab.id ? '0 8px 24px rgba(139, 92, 246, 0.4)' : 'none',
                transform: activeTab === tab.id ? 'scale(1.05)' : 'scale(1)'
              }}
              onMouseOver={(e) => {
                if (activeTab !== tab.id) {
                  const target = e.target as HTMLButtonElement;
                  target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  target.style.color = 'rgba(255, 255, 255, 0.9)';
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== tab.id) {
                  const target = e.target as HTMLButtonElement;
                  target.style.backgroundColor = 'transparent';
                  target.style.color = 'rgba(107, 114, 128, 0.8)';
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main style={{
        marginTop: '140px',
        padding: '40px',
        position: 'relative',
        zIndex: 5
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {activeTab === 'emissao' && (
          <div style={{ padding: '20px' }}>
            <h2 style={{
              color: 'white',
              marginBottom: '30px',
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              fontWeight: '700',
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              animation: 'fadeInUp 0.8s ease-out'
            }}>
              {t('company.emission.title')}
            </h2>

            {/* Mensagem de feedback */}
            {submitMessage && (
              <div style={{
                padding: '20px',
                borderRadius: '16px',
                marginBottom: '30px',
                backgroundColor: submitMessage?.type === 'success' ?
                  'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                backdropFilter: 'blur(20px)',
                border: `2px solid ${submitMessage?.type === 'success' ?
                  'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                color: submitMessage?.type === 'success' ? '#10b981' : '#ef4444',
                textAlign: 'center',
                fontWeight: '600',
                animation: 'slideInDown 0.5s ease-out',
                boxShadow: submitMessage?.type === 'success' ?
                  '0 8px 24px rgba(16, 185, 129, 0.3)' : '0 8px 24px rgba(239, 68, 68, 0.3)'
              }}>
                {submitMessage?.type === 'success' ? '✅' : '❌'} {submitMessage?.text}
              </div>
            )}

            <form onSubmit={handleCreateRWA}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                padding: '40px',
                borderRadius: '24px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '30px',
                animation: 'fadeInUp 1s ease-out'
              }}>
                <h3 style={{ color: '#8b5cf6', marginBottom: '20px' }}>{t('company.form.projectInfo')}</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    {t('company.form.constructorName')}
                  </label>
                  <input
                    type="text"
                    value={rwaForm.constructorName}
                    onChange={(e) => handleRWAFormChange('constructorName', e.target.value)}
                    placeholder="Ex: Construtora ABC Ltda"
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    {t('company.form.assetName')}
                  </label>
                  <input
                    type="text"
                    value={rwaForm.assetName}
                    onChange={(e) => handleRWAFormChange('assetName', e.target.value)}
                    placeholder="Ex: Residencial Solar Park"
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>

              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  {t('company.form.definition')}
                </label>
                <textarea
                  value={rwaForm.definition}
                  onChange={(e) => handleRWAFormChange('definition', e.target.value)}
                  placeholder="Descreva detalhadamente o projeto de construção..."
                  rows={4}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    {t('company.form.location')}
                  </label>
                  <input
                    type="text"
                    value={rwaForm.location}
                    onChange={(e) => handleRWAFormChange('location', e.target.value)}
                    placeholder="Ex: São Paulo, SP - Brasil"
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
              </div>
            </div>

            <div style={{ 
              backgroundColor: 'white', 
              padding: '30px', 
              borderRadius: '15px', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: '#3b82f6', marginBottom: '20px' }}>{t('company.form.tokenSettings')}</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    {t('company.form.totalSupply')}
                  </label>
                  <input
                    type="number"
                    value={rwaForm.totalSupply}
                    onChange={(e) => handleRWAFormChange('totalSupply', e.target.value)}
                    placeholder="1000000"
                    required
                    min="1"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    {t('company.form.tokenSymbol')}
                  </label>
                  <input
                    type="text"
                    value={rwaForm.tokenSymbol}
                    onChange={(e) => handleRWAFormChange('tokenSymbol', e.target.value.toUpperCase())}
                    placeholder="Ex: RSP"
                    required
                    maxLength={10}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    {t('company.form.borrowAmount')}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={rwaForm.expectedAmount}
                    onChange={(e) => handleRWAFormChange('expectedAmount', e.target.value)}
                    placeholder="500000"
                    required
                    min="0.01"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  {t('company.form.ipfsUri')}
                </label>
                <input
                  type="url"
                  value={rwaForm.propertyURI}
                  onChange={(e) => handleRWAFormChange('propertyURI', e.target.value)}
                  placeholder="https://ipfs.io/ipfs/QmHash..."
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>

            </div>

            <div style={{ 
              backgroundColor: 'white', 
              padding: '30px', 
              borderRadius: '15px', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: '#10b981', marginBottom: '20px' }}>{t('company.form.loanSettings')}</h3>
              
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    {t('company.form.interestRate')}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={rwaForm.interestRate}
                    onChange={(e) => handleRWAFormChange('interestRate', e.target.value)}
                    placeholder="12.0"
                    required
                    min="0.1"
                    max="100"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    {t('company.form.term')}
                  </label>
                  <input
                    type="number"
                    value={rwaForm.prazo}
                    onChange={(e) => handleRWAFormChange('prazo', e.target.value)}
                    placeholder="12"
                    required
                    min="1"
                    max="60"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    {t('company.form.totalWithInterest')}
                  </label>
                  <input
                    type="text"
                    value={rwaForm.expectedAmount && rwaForm.interestRate ? 
                      (parseFloat(rwaForm.expectedAmount) * (1 + parseFloat(rwaForm.interestRate) / 100)).toFixed(2) : 
                      ''
                    }
                    readOnly
                    placeholder="Calculado automaticamente"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '16px',
                      backgroundColor: '#f9fafb',
                      color: '#374151'
                    }}
                  />
                </div>
              </div>
              
            </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '15px',
                  backgroundColor: isSubmitting ? '#9ca3af' : '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  if (!isSubmitting) {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#7c3aed';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isSubmitting) {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#8b5cf6';
                  }
                }}
              >
                {isSubmitting ? '⏳' : t('company.form.submit')}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'contratos' && (
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#333', marginBottom: '30px', fontSize: '2rem' }}>
              {t('company.contracts.title')}
            </h2>


            {/* Contratos Ativos com Valor Arrecadado */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#059669', marginBottom: '20px', fontSize: '1.5rem' }}>
                {t('company.contracts.active')}
              </h3>
              {activeContracts.map(contract => {
                const solicitado = parseFloat(contract.loanAmount || '0');
                const arrecadado = parseFloat(contract.totalInvested || '0');
                const progresso = solicitado > 0 ? Math.min(100, Math.round((arrecadado / solicitado) * 100)) : 0;
                return (
                  <div key={contract.id} style={{ 
                    backgroundColor: 'white', 
                    padding: '20px', 
                    borderRadius: '10px', 
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    marginBottom: '15px',
                    border: '2px solid #10b981'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h4 style={{ color: '#333', margin: 0, fontSize: '1.2rem' }}>{contract.assetName}</h4>
                        <span style={{
                          backgroundColor: '#10b981',
                          color: 'white',
                          padding: '5px 10px',
                          borderRadius: '15px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {t('status.active')}
                        </span>
                    </div>


                    {/* Linha de KPIs */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px', marginBottom: '15px' }}>
                      <div>
                        <strong style={{ color: '#666' }}>{t('company.contracts.investors')}:</strong>
                        <p style={{ margin: '5px 0', color: '#333' }}>{contract.investors}</p>
                      </div>
                      <div>
                        <strong style={{ color: '#666' }}>{t('company.contracts.requested')}:</strong>
                        <p style={{ margin: '5px 0', color: '#333' }}>${solicitado.toLocaleString()}</p>
                      </div>
                      <div>
                        <strong style={{ color: '#666' }}>{t('company.contracts.raised')}:</strong>
                        <p style={{ margin: '5px 0', color: '#10b981', fontWeight: 'bold' }}>${arrecadado.toLocaleString()}</p>
                      </div>
                      <div>
                        <strong style={{ color: '#666' }}>{t('company.contracts.interest')}:</strong>
                        <p style={{ margin: '5px 0', color: '#333' }}>{contract.interestRate}% a.a.</p>
                      </div>
                      <div>
                        <strong style={{ color: '#666' }}>{t('company.contracts.maturity')}:</strong>
                        <p style={{ margin: '5px 0', color: '#333' }}>{contract.dueDate}</p>
                      </div>
                    </div>

                    {/* Barra de Progresso */}
                    <div style={{ marginBottom: '10px', color: '#6b7280', fontSize: '14px' }}>
                      {t('company.contracts.progress')}: {progresso}%
                    </div>
                    <div style={{ 
                      width: '100%', 
                      height: '16px', 
                      backgroundColor: '#e5e7eb', 
                      borderRadius: '8px',
                      overflow: 'hidden',
                      marginBottom: '15px'
                    }}>
                      <div style={{
                        width: `${progresso}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                      }} />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button style={{
                        padding: '8px 16px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}>
                        {t('company.contracts.viewDetails')}
                      </button>
                      <button style={{
                        padding: '8px 16px',
                        backgroundColor: '#8b5cf6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}>
                        {t('company.contracts.closeOffer')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Contratos Finalizados */}
            <div>
              <h3 style={{ color: '#6b7280', marginBottom: '20px', fontSize: '1.5rem' }}>
                {t('company.contracts.completed')}
              </h3>
              {completedContracts.map(contract => (
                <div key={contract.id} style={{ 
                  backgroundColor: 'white', 
                  padding: '20px', 
                  borderRadius: '10px', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  marginBottom: '15px',
                  border: '2px solid #6b7280'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h4 style={{ color: '#333', margin: 0, fontSize: '1.2rem' }}>{contract.assetName}</h4>
                    <span style={{
                      backgroundColor: '#6b7280',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '15px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {t('status.completed')}
                    </span>
                  </div>

                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '15px' }}>
                    <div>
                      <strong style={{ color: '#666' }}>{t('company.contracts.investors')}:</strong>
                      <p style={{ margin: '5px 0', color: '#333' }}>{contract.investors}</p>
                    </div>
                    <div>
                      <strong style={{ color: '#666' }}>{t('company.contracts.paidValue')}:</strong>
                      <p style={{ margin: '5px 0', color: '#333' }}>${parseFloat(contract.currentValue).toLocaleString()}</p>
                    </div>
                    <div>
                      <strong style={{ color: '#666' }}>{t('company.contracts.paidInterest')}:</strong>
                      <p style={{ margin: '5px 0', color: '#10b981', fontWeight: 'bold' }}>
                        ${parseFloat(contract.profit).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <strong style={{ color: '#666' }}>{t('company.contracts.settledOn')}:</strong>
                      <p style={{ margin: '5px 0', color: '#333' }}>{contract.completionDate}</p>
                    </div>
                  </div>
                  
                  <button style={{
                    padding: '8px 16px',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}>
                    {t('status.finalReport')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* (Removido) Aba de empréstimos separada — agora integrada em Contratos */}

        {activeTab === 'metricas' && (
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#333', marginBottom: '30px', fontSize: '2rem' }}>
              {t('company.metrics.title')}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '30px' }}>
              <div style={{ 
                backgroundColor: '#dbeafe', 
                padding: '25px', 
                borderRadius: '15px',
                border: '2px solid #3b82f6',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👥</div>
                <h3 style={{ color: '#1e40af', marginBottom: '10px' }}>{t('company.metrics.totalInvestors')}</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af', margin: 0 }}>
                  {contracts.reduce((sum, c) => sum + c.investors, 0)}
                </p>
              </div>

              <div style={{ 
                backgroundColor: '#f3e8ff', 
                padding: '25px', 
                borderRadius: '15px',
                border: '2px solid #8b5cf6',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🏗️</div>
                <h3 style={{ color: '#6b21a8', marginBottom: '10px' }}>{t('company.metrics.activeProjects')}</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6b21a8', margin: 0 }}>
                  {activeContracts.length}
                </p>
              </div>
            </div>

            <div style={{ 
              backgroundColor: 'white', 
              padding: '30px', 
              borderRadius: '15px', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#333', marginBottom: '20px' }}>📋 {t('company.metrics.table.project')} Summary</h3>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>{t('company.metrics.table.project')}</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>{t('company.metrics.table.status')}</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>{t('company.metrics.table.investors')}</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>{t('company.metrics.table.currentValue')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.map(contract => (
                      <tr key={contract.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px' }}>{contract.assetName}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            backgroundColor: contract.status === 'active' ? '#dcfce7' : '#f3f4f6',
                            color: contract.status === 'active' ? '#166534' : '#374151'
                          }}>
                            {contract.status === 'active' ? t('status.active') : t('status.completed')}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>{contract.investors}</td>
                        <td style={{ padding: '12px' }}>${parseFloat(contract.currentValue).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        </div>
      </main>

    </div>
  );
}

export default EmpresaDashboard;

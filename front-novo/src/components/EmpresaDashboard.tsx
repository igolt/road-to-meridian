import { useState } from 'react';
import { useSorobanReact } from '@soroban-react/core';

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
}

type DashboardTab = 'emissao' | 'contratos' | 'metricas';

function EmpresaDashboard() {
  const sorobanContext = useSorobanReact();
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
    interestRate: ''
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
      interestRate: '12'
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
      interestRate: '15'
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
      interestRate: '10'
    }
  ]);

  const handleRWAFormChange = (field: keyof RWAFormData, value: string) => {
    setRwaForm(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!rwaForm.assetName.trim()) errors.push('Nome do Asset é obrigatório');
    if (!rwaForm.definition.trim()) errors.push('Descrição do projeto é obrigatória');
    if (!rwaForm.totalSupply.trim()) errors.push('Total de tokens é obrigatório');
    if (!rwaForm.location.trim()) errors.push('Localização é obrigatória');
    if (!rwaForm.expectedCompletion.trim()) errors.push('Data de vencimento é obrigatória');
    if (!rwaForm.expectedAmount.trim()) errors.push('Valor esperado é obrigatório');
    if (!rwaForm.interestRate.trim()) errors.push('Taxa de juros é obrigatória');
    if (!rwaForm.propertyURI.trim()) errors.push('URI do IPFS é obrigatória');
    
    // Validações numéricas
    if (rwaForm.totalSupply && isNaN(Number(rwaForm.totalSupply))) {
      errors.push('Total de tokens deve ser um número válido');
    }
    if (rwaForm.expectedAmount && isNaN(Number(rwaForm.expectedAmount))) {
      errors.push('Valor esperado deve ser um número válido');
    }
    if (rwaForm.interestRate && isNaN(Number(rwaForm.interestRate))) {
      errors.push('Taxa de juros deve ser um número válido');
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
        companyWallet: sorobanContext.address || 'DEMO_WALLET',
        timestamp: new Date().toISOString()
      };
      
      console.log('Enviando dados para API:', formData);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitMessage({type: 'success', text: 'RWA criado com sucesso! Token será emitido na rede Stellar.'});
      
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
        interestRate: ''
      });
      
    } catch (error) {
      setSubmitMessage({type: 'error', text: 'Erro ao criar RWA. Tente novamente.'});
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
      backgroundColor: '#f8fafc',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ color: '#333', margin: 0, fontSize: '2rem' }}>
              🏢 Dashboard Empresa - RealYield
            </h1>
            {sorobanContext.address && (
              <p style={{ color: '#666', margin: '5px 0 0 0', fontSize: '14px' }}>
                🔗 Carteira: {sorobanContext.address.slice(0, 8)}...{sorobanContext.address.slice(-8)}
              </p>
            )}
          </div>
          <button 
            onClick={handleBackToRealYield}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← Voltar para RealYield
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '0 20px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', gap: '0' }}>
          {[
            { id: 'emissao', label: '🏗️ Emissão RWA', icon: '🏗️' },
            { id: 'contratos', label: '📋 Contratos & Empréstimos', icon: '📋' },
            { id: 'metricas', label: '📊 Métricas', icon: '📊' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as DashboardTab)}
              style={{
                padding: '15px 25px',
                backgroundColor: activeTab === tab.id ? '#8b5cf6' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#6b7280',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                borderBottom: activeTab === tab.id ? '3px solid #7c3aed' : '3px solid transparent',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {activeTab === 'emissao' && (
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#333', marginBottom: '30px', fontSize: '2rem' }}>
              🏗️ Emissão de RWA - Tokenização de Construção
            </h2>
            
            {/* Mensagem de feedback */}
            {submitMessage && (
              <div style={{ 
                padding: '15px', 
                borderRadius: '8px', 
                marginBottom: '20px',
                backgroundColor: submitMessage.type === 'success' ? '#d1fae5' : '#fee2e2',
                border: `2px solid ${submitMessage.type === 'success' ? '#10b981' : '#ef4444'}`,
                color: submitMessage.type === 'success' ? '#065f46' : '#991b1b'
              }}>
                {submitMessage.type === 'success' ? '✅' : '❌'} {submitMessage.text}
              </div>
            )}
            
            <form onSubmit={handleCreateRWA}>
              <div style={{ 
                backgroundColor: 'white', 
                padding: '30px', 
                borderRadius: '15px', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                marginBottom: '20px'
              }}>
                <h3 style={{ color: '#8b5cf6', marginBottom: '20px' }}>Informações do Projeto</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Nome do Asset (Token)
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
                  Descrição do Projeto
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
                    Localização
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
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Loan Termination Date
                  </label>
                  <input
                    type="date"
                    value={rwaForm.expectedCompletion}
                    onChange={(e) => handleRWAFormChange('expectedCompletion', e.target.value)}
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
              <h3 style={{ color: '#3b82f6', marginBottom: '20px' }}>Configurações do Token</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Total de Tokens (Supply)
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
                    Borrow Amount
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
                  IPFS URI (Real Estate Documents)
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Metadados Adicionais (JSON)
                </label>
                <textarea
                  value={rwaForm.metadatas}
                  onChange={(e) => handleRWAFormChange('metadatas', e.target.value)}
                  placeholder='{"area": "5000m²", "unidades": 50, "arquiteto": "João Silva"}'
                  rows={3}
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
            </div>

            <div style={{ 
              backgroundColor: 'white', 
              padding: '30px', 
              borderRadius: '15px', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: '#10b981', marginBottom: '20px' }}>Configurações de Empréstimo</h3>
              
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Taxa de Juros Anual (%)
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
                    Valor Total com Juros (USDC)
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
                {isSubmitting ? '⏳ Criando RWA...' : '🚀 Criar RWA e Liberar para o Público'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'contratos' && (
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#333', marginBottom: '30px', fontSize: '2rem' }}>
              📋 Contratos & Empréstimos
            </h2>

            {/* Resumo Superior */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '30px' }}>
              <div style={{ 
                backgroundColor: '#fef3c7', 
                padding: '20px', 
                borderRadius: '10px',
                border: '2px solid #f59e0b'
              }}>
                <h3 style={{ color: '#92400e', marginBottom: '10px' }}>📊 Resumo</h3>
                <p style={{ margin: '5px 0', color: '#92400e' }}>
                  <strong>Contratos Ativos:</strong> {activeContracts.length}
                </p>
                <p style={{ margin: '5px 0', color: '#92400e' }}>
                  <strong>Contratos Finalizados:</strong> {completedContracts.length}
                </p>
              </div>
            </div>

            {/* Contratos Ativos com Valor Arrecadado */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#059669', marginBottom: '20px', fontSize: '1.5rem' }}>
                🟢 Contratos Ativos
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
                        ATIVO
                      </span>
                    </div>

                    {/* Linha de KPIs */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px', marginBottom: '15px' }}>
                      <div>
                        <strong style={{ color: '#666' }}>Emprestadores:</strong>
                        <p style={{ margin: '5px 0', color: '#333' }}>{contract.investors}</p>
                      </div>
                      <div>
                        <strong style={{ color: '#666' }}>Solicitado:</strong>
                        <p style={{ margin: '5px 0', color: '#333' }}>${solicitado.toLocaleString()}</p>
                      </div>
                      <div>
                        <strong style={{ color: '#666' }}>Arrecadado:</strong>
                        <p style={{ margin: '5px 0', color: '#10b981', fontWeight: 'bold' }}>${arrecadado.toLocaleString()}</p>
                      </div>
                      <div>
                        <strong style={{ color: '#666' }}>Taxa de Juros:</strong>
                        <p style={{ margin: '5px 0', color: '#333' }}>{contract.interestRate}% a.a.</p>
                      </div>
                      <div>
                        <strong style={{ color: '#666' }}>Vencimento:</strong>
                        <p style={{ margin: '5px 0', color: '#333' }}>{contract.dueDate}</p>
                      </div>
                    </div>

                    {/* Barra de Progresso */}
                    <div style={{ marginBottom: '10px', color: '#6b7280', fontSize: '14px' }}>
                      Progresso da Arrecadação: {progresso}%
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
                        📊 Ver Detalhes
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
                        ✏️ Editar Oferta
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Contratos Finalizados */}
            <div>
              <h3 style={{ color: '#6b7280', marginBottom: '20px', fontSize: '1.5rem' }}>
                ✅ Contratos Finalizados
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
                      FINALIZADO
                    </span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '15px' }}>
                    <div>
                      <strong style={{ color: '#666' }}>Emprestadores:</strong>
                      <p style={{ margin: '5px 0', color: '#333' }}>{contract.investors}</p>
                    </div>
                    <div>
                      <strong style={{ color: '#666' }}>Valor Pago:</strong>
                      <p style={{ margin: '5px 0', color: '#333' }}>${parseFloat(contract.currentValue).toLocaleString()}</p>
                    </div>
                    <div>
                      <strong style={{ color: '#666' }}>Juros Pagos:</strong>
                      <p style={{ margin: '5px 0', color: '#10b981', fontWeight: 'bold' }}>
                        ${parseFloat(contract.profit).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <strong style={{ color: '#666' }}>Quitado em:</strong>
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
                    📊 Ver Relatório Final
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
              📊 Métricas e Performance
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
                <h3 style={{ color: '#1e40af', marginBottom: '10px' }}>Total Investidores</h3>
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
                <h3 style={{ color: '#6b21a8', marginBottom: '10px' }}>Projetos Ativos</h3>
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
              <h3 style={{ color: '#333', marginBottom: '20px' }}>📋 Resumo por Projeto</h3>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Projeto</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Investidores</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Valor Atual</th>
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
                            {contract.status === 'active' ? 'ATIVO' : 'FINALIZADO'}
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
    </div>
  );
}

export default EmpresaDashboard;

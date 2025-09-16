import { useState } from 'react';
import type { StellarUser } from '../services/StellarPasskeyService';

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
  totalInvested: string;
  currentValue: string;
  profit: string;
  investors: number;
  loanAmount: string;
  interestRate: string;
}

type DashboardTab = 'emissao' | 'contratos' | 'emprestimos' | 'metricas';

interface EmpresaDashboardProps {
  currentUser: StellarUser | null;
  onBack: () => Promise<void>;
}

function EmpresaDashboard({ currentUser, onBack }: EmpresaDashboardProps) {
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

  // Dados simulados de contratos
  const [contracts] = useState<Contract[]>([
    {
      id: '1',
      assetName: 'Residencial Solar Park',
      totalSupply: '1000000',
      priceUSDC: '0.50',
      status: 'active',
      createdAt: '2024-01-15',
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

  const handleCreateRWA = () => {
    // Simular criação de RWA
    alert('RWA criado com sucesso! Token será emitido na rede Stellar.');
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
  };

  const handleBackToRealYield = async () => {
    await onBack();
  };

  const activeContracts = contracts.filter(c => c.status === 'active');
  const completedContracts = contracts.filter(c => c.status === 'completed');
  const totalProfit = contracts.reduce((sum, c) => sum + parseFloat(c.profit), 0);
  const totalInvested = contracts.reduce((sum, c) => sum + parseFloat(c.totalInvested), 0);

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
            {currentUser && (
              <p style={{ color: '#666', margin: '5px 0 0 0', fontSize: '14px' }}>
                Conectado como: {currentUser.name}
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
            { id: 'contratos', label: '📋 Contratos', icon: '📋' },
            { id: 'emprestimos', label: '💰 Empréstimos', icon: '💰' },
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
                    Tipo de Construção
                  </label>
                  <select
                    value={rwaForm.constructionType}
                    onChange={(e) => handleRWAFormChange('constructionType', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="residencial">Residencial</option>
                    <option value="comercial">Comercial</option>
                    <option value="industrial">Industrial</option>
                    <option value="misto">Misto</option>
                  </select>
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
                    Previsão de Conclusão
                  </label>
                  <input
                    type="date"
                    value={rwaForm.expectedCompletion}
                    onChange={(e) => handleRWAFormChange('expectedCompletion', e.target.value)}
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
                    Valor Esperado a Arrecadar (USDC)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={rwaForm.expectedAmount}
                    onChange={(e) => handleRWAFormChange('expectedAmount', e.target.value)}
                    placeholder="500000"
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
                  URI do IPFS (Documentos do Projeto)
                </label>
                <input
                  type="text"
                  value={rwaForm.propertyURI}
                  onChange={(e) => handleRWAFormChange('propertyURI', e.target.value)}
                  placeholder="https://ipfs.io/ipfs/QmHash..."
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
              onClick={handleCreateRWA}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#7c3aed'}
              onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#8b5cf6'}
            >
              🚀 Criar RWA e Liberar para o Público
            </button>
          </div>
        )}

        {activeTab === 'contratos' && (
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#333', marginBottom: '30px', fontSize: '2rem' }}>
              📋 Gestão de Contratos RWA
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <div style={{ 
                backgroundColor: '#fef3c7', 
                padding: '20px', 
                borderRadius: '10px',
                border: '2px solid #f59e0b'
              }}>
                <h3 style={{ color: '#92400e', marginBottom: '10px' }}>📊 Resumo Geral</h3>
                <p style={{ margin: '5px 0', color: '#92400e' }}>
                  <strong>Contratos Ativos:</strong> {activeContracts.length}
                </p>
                <p style={{ margin: '5px 0', color: '#92400e' }}>
                  <strong>Contratos Finalizados:</strong> {completedContracts.length}
                </p>
                <p style={{ margin: '5px 0', color: '#92400e' }}>
                  <strong>Lucro Total:</strong> ${totalProfit.toLocaleString()}
                </p>
              </div>

              <div style={{ 
                backgroundColor: '#dbeafe', 
                padding: '20px', 
                borderRadius: '10px',
                border: '2px solid #3b82f6'
              }}>
                <h3 style={{ color: '#1e40af', marginBottom: '10px' }}>💰 Empréstimos</h3>
                <p style={{ margin: '5px 0', color: '#1e40af' }}>
                  <strong>Total Emprestado:</strong> ${totalInvested.toLocaleString()}
                </p>
                <p style={{ margin: '5px 0', color: '#1e40af' }}>
                  <strong>Retorno Médio:</strong> {((totalProfit / totalInvested) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#059669', marginBottom: '20px', fontSize: '1.5rem' }}>
                🟢 Contratos Ativos
              </h3>
              {activeContracts.map(contract => (
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
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '15px' }}>
                    <div>
                      <strong style={{ color: '#666' }}>Emprestadores:</strong>
                      <p style={{ margin: '5px 0', color: '#333' }}>{contract.investors}</p>
                    </div>
                    <div>
                      <strong style={{ color: '#666' }}>Valor do Empréstimo:</strong>
                      <p style={{ margin: '5px 0', color: '#333' }}>${parseFloat(contract.currentValue).toLocaleString()}</p>
                    </div>
                    <div>
                      <strong style={{ color: '#666' }}>Juros Acumulados:</strong>
                      <p style={{ margin: '5px 0', color: '#10b981', fontWeight: 'bold' }}>
                        ${parseFloat(contract.profit).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <strong style={{ color: '#666' }}>Taxa de Juros:</strong>
                      <p style={{ margin: '5px 0', color: '#333' }}>{contract.interestRate}% a.a.</p>
                    </div>
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
              ))}
            </div>

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

        {activeTab === 'emprestimos' && (
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#333', marginBottom: '30px', fontSize: '2rem' }}>
              💰 Status dos Empréstimos RWA
            </h2>

            <div style={{ 
              backgroundColor: 'white', 
              padding: '30px', 
              borderRadius: '15px', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: '#8b5cf6', marginBottom: '20px' }}>Selecionar Contrato para Visualizar</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                  Contrato RWA:
                </label>
                <select style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}>
                  <option value="">Selecione um contrato ativo</option>
                  {activeContracts.map(contract => (
                    <option key={contract.id} value={contract.id}>
                      {contract.assetName} - ${parseFloat(contract.currentValue).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ 
              backgroundColor: 'white', 
              padding: '30px', 
              borderRadius: '15px', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: '#3b82f6', marginBottom: '20px' }}>Progresso da Arrecadação</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 'bold', color: '#333' }}>Valor Solicitado:</span>
                  <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>$500,000 USDC</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 'bold', color: '#333' }}>Valor Arrecadado:</span>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>$350,000 USDC</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <span style={{ fontWeight: 'bold', color: '#333' }}>Progresso:</span>
                  <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>70%</span>
                </div>
                
                {/* Barra de Progresso */}
                <div style={{ 
                  width: '100%', 
                  height: '20px', 
                  backgroundColor: '#e5e7eb', 
                  borderRadius: '10px',
                  overflow: 'hidden',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    width: '70%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                    borderRadius: '10px',
                    transition: 'width 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    70%
                  </div>
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
              <h3 style={{ color: '#10b981', marginBottom: '20px' }}>Configurações do Empréstimo</h3>
              
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Taxa de Juros Anual (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="12.0"
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
                    Prazo do Empréstimo (meses)
                  </label>
                  <input
                    type="number"
                    placeholder="24"
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


            <button
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#2563eb'}
              onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#3b82f6'}
            >
              💾 Atualizar Configurações
            </button>
          </div>
        )}

        {activeTab === 'metricas' && (
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#333', marginBottom: '30px', fontSize: '2rem' }}>
              📊 Métricas e Performance
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '30px' }}>
              <div style={{ 
                backgroundColor: '#f0fdf4', 
                padding: '25px', 
                borderRadius: '15px',
                border: '2px solid #22c55e',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💰</div>
                <h3 style={{ color: '#15803d', marginBottom: '10px' }}>Lucro Total</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#15803d', margin: 0 }}>
                  ${totalProfit.toLocaleString()}
                </p>
              </div>

              <div style={{ 
                backgroundColor: '#fef3c7', 
                padding: '25px', 
                borderRadius: '15px',
                border: '2px solid #f59e0b',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📈</div>
                <h3 style={{ color: '#92400e', marginBottom: '10px' }}>ROI Médio</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#92400e', margin: 0 }}>
                  {((totalProfit / totalInvested) * 100).toFixed(1)}%
                </p>
              </div>

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
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Lucro</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>ROI</th>
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
                        <td style={{ padding: '12px', color: '#10b981', fontWeight: 'bold' }}>
                          ${parseFloat(contract.profit).toLocaleString()}
                        </td>
                        <td style={{ padding: '12px' }}>
                          {((parseFloat(contract.profit) / parseFloat(contract.totalInvested)) * 100).toFixed(1)}%
                        </td>
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

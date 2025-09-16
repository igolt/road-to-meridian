import { useState } from 'react';
import type { StellarUser } from '../services/StellarPasskeyService';

interface EmprestimoFuturo {
  id: string;
  nomeEmprestimo: string;
  construtora: string;
  nomeToken: string;
  complexoConstrutora: string;
  noteToken: string;
  tokensRestantes: string;
  porcentagemConclusao: string;
  precoParte: string;
  porcentagemAPY: string;
  valorTotal: string;
  prazo: string;
  localizacao: string;
}

interface ContratoAtivo {
  id: string;
  nomeEmprestimo: string;
  construtora: string;
  valorInvestido: string;
  tokensAdquiridos: string;
  dataInicio: string;
  dataVencimento: string;
  apy: string;
  jurosAcumulados: string;
  status: 'ativo';
}

interface ContratoFinalizado {
  id: string;
  nomeEmprestimo: string;
  construtora: string;
  valorInvestido: string;
  tokensAdquiridos: string;
  dataInicio: string;
  dataFinalizacao: string;
  apy: string;
  jurosRecebidos: string;
  valorTotalRecebido: string;
  status: 'finalizado';
}

type DashboardTab = 'emprestimos' | 'contrato' | 'historico';

interface InvestidorDashboardProps {
  currentUser: StellarUser | null;
  onBack: () => Promise<void>;
}

function InvestidorDashboard({ currentUser, onBack }: InvestidorDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('emprestimos');
  const [selectedEmprestimo, setSelectedEmprestimo] = useState<EmprestimoFuturo | null>(null);
  const [valorInvestimento, setValorInvestimento] = useState('');
  const [filtroConstrutora, setFiltroConstrutora] = useState('');
  const [filtroAPY, setFiltroAPY] = useState('');

  // Dados simulados de empréstimos futuros
  const [emprestimosFuturos] = useState<EmprestimoFuturo[]>([
    {
      id: '1',
      nomeEmprestimo: 'Residencial Solar Park',
      construtora: 'Construtora Solar Ltda',
      nomeToken: 'SOLAR',
      complexoConstrutora: 'Solar Park Complex',
      noteToken: 'Token representando participação no Residencial Solar Park',
      tokensRestantes: '750000',
      porcentagemConclusao: '25%',
      precoParte: '0.50',
      porcentagemAPY: '12.5',
      valorTotal: '1000000',
      prazo: '24',
      localizacao: 'São Paulo, SP'
    },
    {
      id: '2',
      nomeEmprestimo: 'Torre Comercial Downtown',
      construtora: 'Downtown Construtora',
      nomeToken: 'DOWN',
      complexoConstrutora: 'Downtown Business Center',
      noteToken: 'Token representando participação na Torre Comercial Downtown',
      tokensRestantes: '1200000',
      porcentagemConclusao: '40%',
      precoParte: '1.00',
      porcentagemAPY: '15.0',
      valorTotal: '2000000',
      prazo: '36',
      localizacao: 'Rio de Janeiro, RJ'
    },
    {
      id: '3',
      nomeEmprestimo: 'Condomínio Green Valley',
      construtora: 'Green Valley Construções',
      nomeToken: 'GREEN',
      complexoConstrutora: 'Green Valley Residences',
      noteToken: 'Token representando participação no Condomínio Green Valley',
      tokensRestantes: '900000',
      porcentagemConclusao: '10%',
      precoParte: '0.75',
      porcentagemAPY: '10.0',
      valorTotal: '1500000',
      prazo: '18',
      localizacao: 'Belo Horizonte, MG'
    }
  ]);

  // Dados simulados de contratos ativos
  const [contratosAtivos] = useState<ContratoAtivo[]>([
    {
      id: '1',
      nomeEmprestimo: 'Residencial Solar Park',
      construtora: 'Construtora Solar Ltda',
      valorInvestido: '5000',
      tokensAdquiridos: '10000',
      dataInicio: '2024-01-15',
      dataVencimento: '2026-01-15',
      apy: '12.5',
      jurosAcumulados: '625',
      status: 'ativo'
    },
    {
      id: '2',
      nomeEmprestimo: 'Torre Comercial Downtown',
      construtora: 'Downtown Construtora',
      valorInvestido: '10000',
      tokensAdquiridos: '10000',
      dataInicio: '2024-02-01',
      dataVencimento: '2027-02-01',
      apy: '15.0',
      jurosAcumulados: '1250',
      status: 'ativo'
    }
  ]);

  // Dados simulados de contratos finalizados
  const [contratosFinalizados] = useState<ContratoFinalizado[]>([
    {
      id: '1',
      nomeEmprestimo: 'Residencial Vista Mar',
      construtora: 'Vista Mar Construções',
      valorInvestido: '3000',
      tokensAdquiridos: '6000',
      dataInicio: '2023-06-01',
      dataFinalizacao: '2024-06-01',
      apy: '12.0',
      jurosRecebidos: '360',
      valorTotalRecebido: '3360',
      status: 'finalizado'
    }
  ]);

  const handleBackToRealYield = async () => {
    await onBack();
  };

  const handleInvestir = (emprestimo: EmprestimoFuturo) => {
    setSelectedEmprestimo(emprestimo);
    setActiveTab('contrato');
  };

  const handleAssinarContrato = () => {
    alert('Contrato assinado com sucesso! Investimento realizado.');
    setActiveTab('emprestimos');
    setSelectedEmprestimo(null);
    setValorInvestimento('');
  };

  const emprestimosFiltrados = emprestimosFuturos.filter(emprestimo => {
    const matchConstrutora = !filtroConstrutora || emprestimo.construtora.toLowerCase().includes(filtroConstrutora.toLowerCase());
    const matchAPY = !filtroAPY || parseFloat(emprestimo.porcentagemAPY) >= parseFloat(filtroAPY);
    return matchConstrutora && matchAPY;
  });

  const renderEmprestimosFuturos = () => (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#333', marginBottom: '30px', fontSize: '2rem' }}>
        💰 Empréstimos Futuros
      </h2>

      {/* Filtros */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '10px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#333', marginBottom: '15px' }}>Filtros</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Construtora:
            </label>
            <input
              type="text"
              value={filtroConstrutora}
              onChange={(e) => setFiltroConstrutora(e.target.value)}
              placeholder="Digite o nome da construtora"
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              APY Mínimo (%):
            </label>
            <input
              type="number"
              step="0.1"
              value={filtroAPY}
              onChange={(e) => setFiltroAPY(e.target.value)}
              placeholder="Ex: 10.0"
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
      </div>

      {/* Lista de Empréstimos */}
      <div style={{ display: 'grid', gap: '20px' }}>
        {emprestimosFiltrados.map(emprestimo => (
          <div key={emprestimo.id} style={{ 
            backgroundColor: 'white', 
            padding: '25px', 
            borderRadius: '15px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            border: '2px solid #e5e7eb'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ color: '#333', marginBottom: '10px', fontSize: '1.3rem' }}>
                  {emprestimo.nomeEmprestimo}
                </h3>
                <p style={{ color: '#666', marginBottom: '5px' }}>
                  <strong>Construtora:</strong> {emprestimo.construtora}
                </p>
                <p style={{ color: '#666', marginBottom: '5px' }}>
                  <strong>Token:</strong> {emprestimo.nomeToken} - {emprestimo.complexoConstrutora}
                </p>
                <p style={{ color: '#666', marginBottom: '5px' }}>
                  <strong>Localização:</strong> {emprestimo.localizacao}
                </p>
                <p style={{ color: '#666', marginBottom: '5px' }}>
                  <strong>Prazo:</strong> {emprestimo.prazo} meses
                </p>
                <p style={{ color: '#666', marginBottom: '5px' }}>
                  <strong>Note Token:</strong> {emprestimo.noteToken}
                </p>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  backgroundColor: '#f0f9ff', 
                  padding: '15px', 
                  borderRadius: '10px',
                  border: '2px solid #0ea5e9',
                  marginBottom: '15px'
                }}>
                  <p style={{ color: '#0c4a6e', margin: '5px 0', fontSize: '14px' }}>
                    <strong>APY:</strong> {emprestimo.porcentagemAPY}%
                  </p>
                  <p style={{ color: '#0c4a6e', margin: '5px 0', fontSize: '14px' }}>
                    <strong>Preço por Token:</strong> ${emprestimo.precoParte}
                  </p>
                </div>
                
                <div style={{ 
                  backgroundColor: '#fef3c7', 
                  padding: '15px', 
                  borderRadius: '10px',
                  border: '2px solid #f59e0b',
                  marginBottom: '15px'
                }}>
                  <p style={{ color: '#92400e', margin: '5px 0', fontSize: '14px' }}>
                    <strong>Progresso:</strong> {emprestimo.porcentagemConclusao}
                  </p>
                  <p style={{ color: '#92400e', margin: '5px 0', fontSize: '14px' }}>
                    <strong>Tokens Restantes:</strong> {parseInt(emprestimo.tokensRestantes).toLocaleString()}
                  </p>
                </div>
                
                <button
                  onClick={() => handleInvestir(emprestimo)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#059669'}
                  onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#10b981'}
                >
                  💰 Investir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAssinaturaContrato = () => (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#333', marginBottom: '30px', fontSize: '2rem' }}>
        📝 Assinatura do Contrato
      </h2>

      {selectedEmprestimo && (
        <>
          {/* Informações do Empréstimo */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: '25px', 
            borderRadius: '15px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#333', marginBottom: '20px' }}>Detalhes do Empréstimo</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <p style={{ margin: '8px 0', color: '#666' }}>
                  <strong>Nome:</strong> {selectedEmprestimo.nomeEmprestimo}
                </p>
                <p style={{ margin: '8px 0', color: '#666' }}>
                  <strong>Construtora:</strong> {selectedEmprestimo.construtora}
                </p>
                <p style={{ margin: '8px 0', color: '#666' }}>
                  <strong>Token:</strong> {selectedEmprestimo.nomeToken}
                </p>
                <p style={{ margin: '8px 0', color: '#666' }}>
                  <strong>Localização:</strong> {selectedEmprestimo.localizacao}
                </p>
              </div>
              <div>
                <p style={{ margin: '8px 0', color: '#666' }}>
                  <strong>APY:</strong> {selectedEmprestimo.porcentagemAPY}%
                </p>
                <p style={{ margin: '8px 0', color: '#666' }}>
                  <strong>Prazo:</strong> {selectedEmprestimo.prazo} meses
                </p>
                <p style={{ margin: '8px 0', color: '#666' }}>
                  <strong>Preço por Token:</strong> ${selectedEmprestimo.precoParte}
                </p>
                <p style={{ margin: '8px 0', color: '#666' }}>
                  <strong>Valor Total:</strong> ${parseInt(selectedEmprestimo.valorTotal).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Formulário de Investimento */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: '25px', 
            borderRadius: '15px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#333', marginBottom: '20px' }}>Valor do Investimento</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Valor a Investir (USDC):
              </label>
              <input
                type="number"
                step="0.01"
                value={valorInvestimento}
                onChange={(e) => setValorInvestimento(e.target.value)}
                placeholder="Ex: 1000.00"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>

            {valorInvestimento && (
              <div style={{ 
                backgroundColor: '#f0f9ff', 
                padding: '15px', 
                borderRadius: '8px', 
                border: '2px solid #0ea5e9',
                marginBottom: '20px'
              }}>
                <h4 style={{ color: '#0c4a6e', marginBottom: '10px' }}>Resumo do Investimento</h4>
                <p style={{ color: '#0c4a6e', margin: '5px 0' }}>
                  <strong>Valor Investido:</strong> ${parseFloat(valorInvestimento).toLocaleString()}
                </p>
                <p style={{ color: '#0c4a6e', margin: '5px 0' }}>
                  <strong>Tokens a Receber:</strong> {Math.floor(parseFloat(valorInvestimento) / parseFloat(selectedEmprestimo.precoParte)).toLocaleString()}
                </p>
                <p style={{ color: '#0c4a6e', margin: '5px 0' }}>
                  <strong>Juros Anuais:</strong> ${(parseFloat(valorInvestimento) * parseFloat(selectedEmprestimo.porcentagemAPY) / 100).toFixed(2)}
                </p>
                <p style={{ color: '#0c4a6e', margin: '5px 0' }}>
                  <strong>Total ao Final:</strong> ${(parseFloat(valorInvestimento) * (1 + parseFloat(selectedEmprestimo.porcentagemAPY) / 100)).toFixed(2)}
                </p>
              </div>
            )}

            <button
              onClick={handleAssinarContrato}
              disabled={!valorInvestimento}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: valorInvestimento ? '#10b981' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: valorInvestimento ? 'pointer' : 'not-allowed',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}
            >
              ✍️ Assinar Contrato e Investir
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderHistorico = () => (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#333', marginBottom: '30px', fontSize: '2rem' }}>
        📊 Histórico de Investimentos
      </h2>

      {/* Resumo */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ 
          backgroundColor: '#fef3c7', 
          padding: '20px', 
          borderRadius: '10px',
          border: '2px solid #f59e0b'
        }}>
          <h3 style={{ color: '#92400e', marginBottom: '10px' }}>📊 Resumo Geral</h3>
          <p style={{ margin: '5px 0', color: '#92400e' }}>
            <strong>Contratos Ativos:</strong> {contratosAtivos.length}
          </p>
          <p style={{ margin: '5px 0', color: '#92400e' }}>
            <strong>Contratos Finalizados:</strong> {contratosFinalizados.length}
          </p>
          <p style={{ margin: '5px 0', color: '#92400e' }}>
            <strong>Total Investido:</strong> ${contratosAtivos.reduce((sum, c) => sum + parseFloat(c.valorInvestido), 0).toLocaleString()}
          </p>
        </div>

        <div style={{ 
          backgroundColor: '#dbeafe', 
          padding: '20px', 
          borderRadius: '10px',
          border: '2px solid #3b82f6'
        }}>
          <h3 style={{ color: '#1e40af', marginBottom: '10px' }}>💰 Retornos</h3>
          <p style={{ margin: '5px 0', color: '#1e40af' }}>
            <strong>Juros Acumulados:</strong> ${contratosAtivos.reduce((sum, c) => sum + parseFloat(c.jurosAcumulados), 0).toLocaleString()}
          </p>
          <p style={{ margin: '5px 0', color: '#1e40af' }}>
            <strong>Juros Recebidos:</strong> ${contratosFinalizados.reduce((sum, c) => sum + parseFloat(c.jurosRecebidos), 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Contratos Ativos */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#059669', marginBottom: '20px', fontSize: '1.5rem' }}>
          🟢 Contratos Ativos
        </h3>
        {contratosAtivos.map(contrato => (
          <div key={contrato.id} style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '10px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '15px',
            border: '2px solid #10b981'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ color: '#333', margin: 0, fontSize: '1.2rem' }}>{contrato.nomeEmprestimo}</h4>
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
                <strong style={{ color: '#666' }}>Construtora:</strong>
                <p style={{ margin: '5px 0', color: '#333' }}>{contrato.construtora}</p>
              </div>
              <div>
                <strong style={{ color: '#666' }}>Valor Investido:</strong>
                <p style={{ margin: '5px 0', color: '#333' }}>${parseFloat(contrato.valorInvestido).toLocaleString()}</p>
              </div>
              <div>
                <strong style={{ color: '#666' }}>Tokens:</strong>
                <p style={{ margin: '5px 0', color: '#333' }}>{parseInt(contrato.tokensAdquiridos).toLocaleString()}</p>
              </div>
              <div>
                <strong style={{ color: '#666' }}>APY:</strong>
                <p style={{ margin: '5px 0', color: '#333' }}>{contrato.apy}%</p>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
              <div>
                <strong style={{ color: '#666' }}>Juros Acumulados:</strong>
                <p style={{ margin: '5px 0', color: '#10b981', fontWeight: 'bold' }}>
                  ${parseFloat(contrato.jurosAcumulados).toLocaleString()}
                </p>
              </div>
              <div>
                <strong style={{ color: '#666' }}>Vencimento:</strong>
                <p style={{ margin: '5px 0', color: '#333' }}>{contrato.dataVencimento}</p>
              </div>
              <div>
                <strong style={{ color: '#666' }}>Início:</strong>
                <p style={{ margin: '5px 0', color: '#333' }}>{contrato.dataInicio}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contratos Finalizados */}
      <div>
        <h3 style={{ color: '#6b7280', marginBottom: '20px', fontSize: '1.5rem' }}>
          ✅ Contratos Finalizados
        </h3>
        {contratosFinalizados.map(contrato => (
          <div key={contrato.id} style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '10px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '15px',
            border: '2px solid #6b7280'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ color: '#333', margin: 0, fontSize: '1.2rem' }}>{contrato.nomeEmprestimo}</h4>
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
                <strong style={{ color: '#666' }}>Construtora:</strong>
                <p style={{ margin: '5px 0', color: '#333' }}>{contrato.construtora}</p>
              </div>
              <div>
                <strong style={{ color: '#666' }}>Valor Investido:</strong>
                <p style={{ margin: '5px 0', color: '#333' }}>${parseFloat(contrato.valorInvestido).toLocaleString()}</p>
              </div>
              <div>
                <strong style={{ color: '#666' }}>Tokens:</strong>
                <p style={{ margin: '5px 0', color: '#333' }}>{parseInt(contrato.tokensAdquiridos).toLocaleString()}</p>
              </div>
              <div>
                <strong style={{ color: '#666' }}>APY:</strong>
                <p style={{ margin: '5px 0', color: '#333' }}>{contrato.apy}%</p>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
              <div>
                <strong style={{ color: '#666' }}>Juros Recebidos:</strong>
                <p style={{ margin: '5px 0', color: '#10b981', fontWeight: 'bold' }}>
                  ${parseFloat(contrato.jurosRecebidos).toLocaleString()}
                </p>
              </div>
              <div>
                <strong style={{ color: '#666' }}>Total Recebido:</strong>
                <p style={{ margin: '5px 0', color: '#10b981', fontWeight: 'bold' }}>
                  ${parseFloat(contrato.valorTotalRecebido).toLocaleString()}
                </p>
              </div>
              <div>
                <strong style={{ color: '#666' }}>Finalizado em:</strong>
                <p style={{ margin: '5px 0', color: '#333' }}>{contrato.dataFinalizacao}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

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
              💰 Dashboard Investidor - RealYield
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
            { id: 'emprestimos', label: '💰 Empréstimos Futuros', icon: '💰' },
            { id: 'contrato', label: '📝 Assinatura Contrato', icon: '📝' },
            { id: 'historico', label: '📊 Histórico', icon: '📊' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as DashboardTab)}
              style={{
                padding: '15px 25px',
                backgroundColor: activeTab === tab.id ? '#3b82f6' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#6b7280',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                borderBottom: activeTab === tab.id ? '3px solid #2563eb' : '3px solid transparent',
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
        {activeTab === 'emprestimos' && renderEmprestimosFuturos()}
        {activeTab === 'contrato' && renderAssinaturaContrato()}
        {activeTab === 'historico' && renderHistorico()}
      </div>
    </div>
  );
}

export default InvestidorDashboard;
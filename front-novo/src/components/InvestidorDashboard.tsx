import { useState } from 'react';
// import { useWallet } from '../wallet/WalletProvider'; // Comentado para acessar sem carteira
import { useI18n } from '../i18n/index';

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
  companyWallet: string;
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
  companyWallet: string;
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
  companyWallet: string;
}

type DashboardTab = 'emprestimos' | 'historico';

function InvestidorDashboard() {
  // const { address } = useWallet(); // Comentado para acessar sem carteira
  const { t, toggleLocale } = useI18n();
  const [activeTab, setActiveTab] = useState<DashboardTab>('emprestimos');
  const [selectedEmprestimo, setSelectedEmprestimo] = useState<EmprestimoFuturo | null>(null);
  const [valorInvestimento, setValorInvestimento] = useState('');
  const [filtroConstrutora, setFiltroConstrutora] = useState('');
  const [filtroAPY, setFiltroAPY] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

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
      prazo: '12',
      localizacao: 'São Paulo, SP',
      companyWallet: 'GABC1234567890ABCDEF1234567890ABCDEF1234'
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
      prazo: '12',
      localizacao: 'Rio de Janeiro, RJ',
      companyWallet: 'GDEF1234567890ABCDEF1234567890ABCDEF5678'
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
      prazo: '12',
      localizacao: 'Belo Horizonte, MG',
      companyWallet: 'GHIJ1234567890ABCDEF1234567890ABCDEF9012'
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
      status: 'ativo',
      companyWallet: 'GABC1234567890ABCDEF1234567890ABCDEF1234'
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
      status: 'ativo',
      companyWallet: 'GDEF1234567890ABCDEF1234567890ABCDEF5678'
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
      status: 'finalizado',
      companyWallet: 'GVISTA1234567890ABCDEF1234567890ABCDEF'
    }
  ]);

  const handleBackToRealYield = () => {
    window.location.reload();
  };

  const handleInvestir = (emprestimo: EmprestimoFuturo) => {
    setSelectedEmprestimo(emprestimo);
  };

  const handleAssinarContrato = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);
    
    if (!selectedEmprestimo) {
      setSubmitMessage({type: 'error', text: 'Selecione um empréstimo para investir.'});
      return;
    }
    
    if (!valorInvestimento || parseFloat(valorInvestimento) <= 0) {
      setSubmitMessage({type: 'error', text: 'Valor do investimento deve ser maior que zero.'});
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simular chamada para API
      const investmentData = {
        emprestimoId: selectedEmprestimo.id,
        valorInvestimento: parseFloat(valorInvestimento),
        tokensAReceber: Math.floor(parseFloat(valorInvestimento) / parseFloat(selectedEmprestimo.precoParte)),
        // investorWallet: address || 'DEMO_WALLET', // Reative quando quiser usar carteira real
        investorWallet: 'DEMO_WALLET',
        timestamp: new Date().toISOString(),
        emprestimo: selectedEmprestimo
      };
      
      console.log('Enviando investimento para API:', investmentData);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitMessage({type: 'success', text: 'Contrato assinado com sucesso! Investimento realizado.'});
      
      // Limpar formulário
      setSelectedEmprestimo(null);
      setValorInvestimento('');
      
    } catch (error) {
      setSubmitMessage({type: 'error', text: 'Erro ao realizar investimento. Tente novamente.'});
    } finally {
      setIsSubmitting(false);
    }
  };

  const emprestimosFiltrados = emprestimosFuturos.filter(emprestimo => {
    const matchConstrutora = !filtroConstrutora || emprestimo.construtora.toLowerCase().includes(filtroConstrutora.toLowerCase());
    const matchAPY = !filtroAPY || parseFloat(emprestimo.porcentagemAPY) >= parseFloat(filtroAPY);
    return matchConstrutora && matchAPY;
  });

  const renderEmprestimosFuturos = () => (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#333', marginBottom: '30px', fontSize: '2rem' }}>
        {t('investor.futureLoans.title')}
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Coluna Esquerda: Filtros + Lista */}
        <div>
          {/* Filtros */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '10px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#333', marginBottom: '15px' }}>{t('investor.filters.title')}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  {t('investor.filters.constructor')}:
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
                  {t('investor.filters.apyMin')}:
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
                      <strong>{t('investor.futureLoans.list.constructor')}</strong> {emprestimo.construtora}
                    </p>
                    <p style={{ color: '#666', marginBottom: '5px' }}>
                      <strong>{t('investor.futureLoans.list.token')}</strong> {emprestimo.nomeToken} - {emprestimo.complexoConstrutora}
                    </p>
                    <p style={{ color: '#666', marginBottom: '5px' }}>
                      <strong>{t('investor.futureLoans.list.location')}</strong> {emprestimo.localizacao}
                    </p>
                    <p style={{ color: '#666', marginBottom: '5px' }}>
                      <strong>{t('investor.futureLoans.list.term')}</strong> {emprestimo.prazo} {t('common.months')}
                    </p>
                    <p style={{ color: '#666', marginBottom: '5px' }}>
                      <strong>{t('investor.futureLoans.list.noteToken')}</strong> {emprestimo.noteToken}
                    </p>
                    
                    {/* Endereço da Carteira da Empresa */}
                    <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      <strong style={{ color: '#666', fontSize: '14px' }}>{t('investor.futureLoans.list.companyWallet')}</strong>
                      <p style={{ margin: '5px 0', color: '#333', fontSize: '13px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                        {emprestimo.companyWallet}
                      </p>
                    </div>
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
                        <strong>{t('investor.futureLoans.list.progress')}</strong> {emprestimo.porcentagemConclusao}
                      </p>
                      <p style={{ color: '#92400e', margin: '5px 0', fontSize: '14px' }}>
                        <strong>{t('investor.futureLoans.list.tokensRemaining')}</strong> {parseInt(emprestimo.tokensRestantes).toLocaleString()}
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
                      {t('investor.futureLoans.invest')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna Direita: Assinatura do Contrato */}
        <div>
          {selectedEmprestimo ? (
            <div>
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
              
              <form onSubmit={handleAssinarContrato}>
                <div style={{ 
                  backgroundColor: 'white', 
                  padding: '25px', 
                  borderRadius: '15px', 
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  marginBottom: '20px'
                }}>
                  <h3 style={{ color: '#333', marginBottom: '20px' }}>{t('investor.sign.title')}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <p style={{ margin: '8px 0', color: '#666' }}>
                      <strong>{t('investor.sign.name')}</strong> {selectedEmprestimo.nomeEmprestimo}
                    </p>
                    <p style={{ margin: '8px 0', color: '#666' }}>
                      <strong>{t('investor.sign.constructor')}:</strong> {selectedEmprestimo.construtora}
                    </p>
                    <p style={{ margin: '8px 0', color: '#666' }}>
                      <strong>{t('investor.sign.token')}:</strong> {selectedEmprestimo.nomeToken}
                    </p>
                    <p style={{ margin: '8px 0', color: '#666' }}>
                      <strong>{t('investor.sign.location')}:</strong> {selectedEmprestimo.localizacao}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '8px 0', color: '#666' }}>
                      <strong>{t('investor.sign.apy')}:</strong> {selectedEmprestimo.porcentagemAPY}%
                    </p>
                    <p style={{ margin: '8px 0', color: '#666' }}>
                      <strong>{t('investor.sign.term')}:</strong> {selectedEmprestimo.prazo} meses
                    </p>
                    <p style={{ margin: '8px 0', color: '#666' }}>
                      <strong>{t('investor.sign.price')}:</strong> ${selectedEmprestimo.precoParte}
                    </p>
                    <p style={{ margin: '8px 0', color: '#666' }}>
                      <strong>{t('investor.sign.total')}:</strong> ${parseInt(selectedEmprestimo.valorTotal).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

                <div style={{ 
                  backgroundColor: 'white', 
                  padding: '25px', 
                  borderRadius: '15px', 
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                  <h3 style={{ color: '#333', marginBottom: '20px' }}>{t('investor.invest.title')}</h3>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    {t('investor.invest.amount')}:
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={valorInvestimento}
                    onChange={(e) => setValorInvestimento(e.target.value)}
                    placeholder="Ex: 1000.00"
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

                {valorInvestimento && (
                  <div style={{ 
                    backgroundColor: '#f0f9ff', 
                    padding: '15px', 
                    borderRadius: '8px', 
                    border: '2px solid #0ea5e9',
                    marginBottom: '20px'
                  }}>
                    <h4 style={{ color: '#0c4a6e', marginBottom: '10px' }}>{t('investor.invest.summary')}</h4>
                    <p style={{ color: '#0c4a6e', margin: '5px 0' }}>
                      <strong>{t('investor.invest.invested')}:</strong> ${parseFloat(valorInvestimento).toLocaleString()}
                    </p>
                    <p style={{ color: '#0c4a6e', margin: '5px 0' }}>
                      <strong>{t('investor.invest.tokens')}:</strong> {Math.floor(parseFloat(valorInvestimento) / parseFloat(selectedEmprestimo.precoParte)).toLocaleString()}
                    </p>
                    <p style={{ color: '#0c4a6e', margin: '5px 0' }}>
                      <strong>{t('investor.invest.interest')}:</strong> ${(parseFloat(valorInvestimento) * parseFloat(selectedEmprestimo.porcentagemAPY) / 100).toFixed(2)}
                    </p>
                    <p style={{ color: '#0c4a6e', margin: '5px 0' }}>
                      <strong>{t('investor.invest.final')}:</strong> ${(parseFloat(valorInvestimento) * (1 + parseFloat(selectedEmprestimo.porcentagemAPY) / 100)).toFixed(2)}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !valorInvestimento}
                  style={{
                    width: '100%',
                    padding: '15px',
                    backgroundColor: (isSubmitting || !valorInvestimento) ? '#9ca3af' : '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: (isSubmitting || !valorInvestimento) ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isSubmitting ? '⏳ Processing...' : t('investor.invest.submit')}
                </button>
                </div>
              </form>
            </div>
          ) : (
            <div style={{
              backgroundColor: 'white',
              padding: '25px',
              borderRadius: '15px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#333', margin: 0 }}>{t('investor.futureLoans.selectPrompt')}</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // (Removido) renderAssinaturaContrato agora faz parte da aba de Empréstimos

  const renderHistorico = () => (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#333', marginBottom: '30px', fontSize: '2rem' }}>
        {t('investor.history.title')}
      </h2>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ 
          backgroundColor: '#fef3c7', 
          padding: '20px', 
          borderRadius: '10px',
          border: '2px solid #f59e0b'
        }}>
          <h3 style={{ color: '#92400e', marginBottom: '10px' }}>{t('investor.history.summaryTitle')}</h3>
          <p style={{ margin: '5px 0', color: '#92400e' }}>
            <strong>{t('investor.history.activeCount')}</strong> {contratosAtivos.length}
          </p>
          <p style={{ margin: '5px 0', color: '#92400e' }}>
            <strong>{t('investor.history.completedCount')}</strong> {contratosFinalizados.length}
          </p>
          <p style={{ margin: '5px 0', color: '#92400e' }}>
            <strong>{t('investor.history.totalInvested')}</strong> ${contratosAtivos.reduce((sum, c) => sum + parseFloat(c.valorInvestido), 0).toLocaleString()}
          </p>
        </div>

        <div style={{ 
          backgroundColor: '#dbeafe', 
          padding: '20px', 
          borderRadius: '10px',
          border: '2px solid #3b82f6'
        }}>
          <h3 style={{ color: '#1e40af', marginBottom: '10px' }}>{t('investor.history.returnsTitle')}</h3>
          <p style={{ margin: '5px 0', color: '#1e40af' }}>
            <strong>{t('investor.history.accumulatedInterest')}</strong> ${contratosAtivos.reduce((sum, c) => sum + parseFloat(c.jurosAcumulados), 0).toLocaleString()}
          </p>
          <p style={{ margin: '5px 0', color: '#1e40af' }}>
            <strong>{t('investor.history.receivedInterest')}</strong> ${contratosFinalizados.reduce((sum, c) => sum + parseFloat(c.jurosRecebidos), 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Contratos Ativos */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#059669', marginBottom: '20px', fontSize: '1.5rem' }}>
          {t('investor.history.active')}
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
                {t('status.active')}
              </span>
            </div>

            {/* Company Wallet Address */}
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <strong style={{ color: '#666', fontSize: '14px' }}>{t('investor.common.companyWallet')}</strong>
              <p style={{ margin: '5px 0', color: '#333', fontSize: '13px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {contrato.companyWallet}
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '15px' }}>
              <div>
                <strong style={{ color: '#666' }}>{t('investor.common.constructor')}</strong>
                <p style={{ margin: '5px 0', color: '#333' }}>{contrato.construtora}</p>
              </div>
              <div>
                <strong style={{ color: '#666' }}>{t('investor.common.investedAmount')}</strong>
                <p style={{ margin: '5px 0', color: '#333' }}>${parseFloat(contrato.valorInvestido).toLocaleString()}</p>
              </div>
              <div>
                <strong style={{ color: '#666' }}>{t('investor.common.tokens')}</strong>
                <p style={{ margin: '5px 0', color: '#333' }}>{parseInt(contrato.tokensAdquiridos).toLocaleString()}</p>
              </div>
              <div>
                <strong style={{ color: '#666' }}>{t('investor.common.apy')}</strong>
                <p style={{ margin: '5px 0', color: '#333' }}>{contrato.apy}%</p>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
              <div>
                <strong style={{ color: '#666' }}>{t('investor.history.accumulatedInterest')}</strong>
                <p style={{ margin: '5px 0', color: '#10b981', fontWeight: 'bold' }}>
                  ${parseFloat(contrato.jurosAcumulados).toLocaleString()}
                </p>
              </div>
              <div>
                <strong style={{ color: '#666' }}>{t('investor.common.maturity')}</strong>
                <p style={{ margin: '5px 0', color: '#333' }}>{contrato.dataVencimento}</p>
              </div>
              <div>
                <strong style={{ color: '#666' }}>{t('investor.common.start')}</strong>
                <p style={{ margin: '5px 0', color: '#333' }}>{contrato.dataInicio}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contratos Finalizados */}
      <div>
        <h3 style={{ color: '#6b7280', marginBottom: '20px', fontSize: '1.5rem' }}>
          {t('investor.history.completed')}
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
                {t('status.completed')}
              </span>
            </div>

            {/* Company Wallet Address */}
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <strong style={{ color: '#666', fontSize: '14px' }}>{t('investor.common.companyWallet')}</strong>
              <p style={{ margin: '5px 0', color: '#333', fontSize: '13px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {contrato.companyWallet}
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '15px' }}>
              <div>
                <strong style={{ color: '#666' }}>{t('investor.common.constructor')}</strong>
                <p style={{ margin: '5px 0', color: '#333' }}>{contrato.construtora}</p>
              </div>
              <div>
                <strong style={{ color: '#666' }}>{t('investor.common.investedAmount')}</strong>
                <p style={{ margin: '5px 0', color: '#333' }}>${parseFloat(contrato.valorInvestido).toLocaleString()}</p>
              </div>
              <div>
                <strong style={{ color: '#666' }}>{t('investor.common.tokens')}</strong>
                <p style={{ margin: '5px 0', color: '#333' }}>{parseInt(contrato.tokensAdquiridos).toLocaleString()}</p>
              </div>
              <div>
                <strong style={{ color: '#666' }}>{t('investor.common.apy')}</strong>
                <p style={{ margin: '5px 0', color: '#333' }}>{contrato.apy}%</p>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
              <div>
                <strong style={{ color: '#666' }}>{t('investor.history.receivedInterest')}</strong>
                <p style={{ margin: '5px 0', color: '#10b981', fontWeight: 'bold' }}>
                  ${parseFloat(contrato.jurosRecebidos).toLocaleString()}
                </p>
              </div>
              <div>
                <strong style={{ color: '#666' }}>{t('investor.common.totalReceived')}</strong>
                <p style={{ margin: '5px 0', color: '#10b981', fontWeight: 'bold' }}>
                  ${parseFloat(contrato.valorTotalRecebido).toLocaleString()}
                </p>
              </div>
              <div>
                <strong style={{ color: '#666' }}>{t('investor.common.finalizedOn')}</strong>
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
            I
          </div>
          <div>
            <h3 style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '700',
              margin: 0,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              {t('investor.title')}
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
            { id: 'emprestimos', label: t('tabs.loans_investor'), icon: '💰' },
            { id: 'historico', label: t('tabs.history'), icon: '📊' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as DashboardTab)}
              style={{
                padding: '12px 20px',
                backgroundColor: activeTab === tab.id ? 'linear-gradient(135deg, #4C8BF5 0%, #2563eb 100%)' : 'transparent',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #4C8BF5 0%, #2563eb 100%)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'rgba(107, 114, 128, 0.8)',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? '600' : '500',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: activeTab === tab.id ? '0 8px 24px rgba(59, 130, 246, 0.4)' : 'none',
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
        {activeTab === 'emprestimos' && renderEmprestimosFuturos()}
        {activeTab === 'historico' && renderHistorico()}
        </div>
      </main>

    </div>
  );
}

export default InvestidorDashboard;
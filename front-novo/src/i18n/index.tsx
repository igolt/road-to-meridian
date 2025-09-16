import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type Locale = 'pt-BR' | 'en-US';

type Dictionary = Record<string, string>;

const ptBR: Dictionary = {
  'common.back': '← Voltar para RealYield',
  'common.wallet': '🔗 Carteira',
  'common.toggleLanguage': 'EN',
  'common.months': 'meses',

  'tabs.emission': '🏗️ Emissão RWA',
  'tabs.contracts': '📋 Contratos & Empréstimos',
  'tabs.metrics': '📊 Métricas',
  'tabs.loans_investor': '💰 Empréstimos & Contratos',
  'tabs.history': '📊 Histórico',

  'company.title': '🏢 Dashboard Empresa - RealYield',
  'company.emission.title': '🏗️ Emissão de RWA - Tokenização de Construção',
  'company.feedback.success': 'RWA criado com sucesso! Token será emitido na rede Stellar.',
  'company.feedback.error': 'Erro ao criar RWA. Tente novamente.',
  'company.form.projectInfo': 'Informações do Projeto',
  'company.form.constructorName': 'Nome da Construtora',
  'company.form.assetName': 'Nome do Imóvel (Token)',
  'company.form.definition': 'Descrição do Projeto',
  'company.form.location': 'Localização',
  'company.form.tokenSettings': 'Configurações do Token',
  'company.form.totalSupply': 'Total de Tokens (Supply)',
  'company.form.tokenSymbol': 'Sigla do Token',
  'company.form.borrowAmount': 'Borrow Amount',
  'company.form.ipfsUri': 'IPFS URI (Real Estate Documents)',
  'company.form.loanSettings': 'Configurações de Empréstimo',
  'company.form.interestRate': 'Taxa de Juros Anual (%)',
  'company.form.term': 'Prazo do Empréstimo (meses)',
  'company.form.totalWithInterest': 'Valor Total com Juros (USDC)',
  'company.form.submit': '🚀 Criar RWA e Liberar para o Público',

  // Validation messages
  'validation.assetNameRequired': 'Nome do Asset é obrigatório',
  'validation.definitionRequired': 'Descrição do projeto é obrigatória',
  'validation.totalSupplyRequired': 'Total de tokens é obrigatório',
  'validation.locationRequired': 'Localização é obrigatória',
  'validation.dueDateRequired': 'Data de vencimento é obrigatória',
  'validation.expectedAmountRequired': 'Valor esperado é obrigatório',
  'validation.interestRateRequired': 'Taxa de juros é obrigatória',
  'validation.termRequired': 'Prazo do empréstimo é obrigatório',
  'validation.ipfsUriRequired': 'URI do IPFS é obrigatória',
  'validation.constructorNameRequired': 'Nome da construtora é obrigatório',
  'validation.tokenSymbolRequired': 'Sigla do token é obrigatória',
  'validation.totalSupplyInvalid': 'Total de tokens deve ser um número válido',
  'validation.expectedAmountInvalid': 'Valor esperado deve ser um número válido',
  'validation.interestRateInvalid': 'Taxa de juros deve ser um número válido',
  'validation.termInvalid': 'Prazo deve ser um número válido',

  // Success/Error messages
  'messages.success': 'RWA criado com sucesso! Token será emitido na rede Stellar.',
  'messages.error': 'Erro ao criar RWA. Tente novamente.',

  // Status labels
  'status.active': 'ATIVO',
  'status.completed': 'FINALIZADO',
  'status.finalReport': '📊 Ver Relatório Final',

  'company.contracts.title': '📋 Contratos & Empréstimos',
  'company.contracts.active': '🟢 Contratos Ativos',
  'company.contracts.investors': 'Investidores',
  'company.contracts.requested': 'Solicitado',
  'company.contracts.raised': 'Arrecadado',
  'company.contracts.interest': 'Taxa de Juros',
  'company.contracts.maturity': 'Vencimento',
  'company.contracts.progress': 'Progresso da Arrecadação',
  'company.contracts.viewDetails': '📊 Ver Detalhes',
  'company.contracts.closeOffer': '🔒 Encerrar Oferta',
  'company.contracts.completed': '✅ Contratos Finalizados',
  'company.contracts.paidValue': 'Valor Pago',
  'company.contracts.paidInterest': 'Juros Pagos',
  'company.contracts.settledOn': 'Quitado em',

  'company.metrics.title': '📊 Métricas e Performance',
  'company.metrics.totalInvestors': 'Total Investidores',
  'company.metrics.activeProjects': 'Projetos Ativos',
  'company.metrics.table.project': 'Projeto',
  'company.metrics.table.status': 'Status',
  'company.metrics.table.investors': 'Investidores',
  'company.metrics.table.currentValue': 'Valor Atual',

  // Landing Page (restaurado do commit antigo)
  'landing.hero.title': 'RealYield',
  'landing.hero.subtitle': 'Revolucione o investimento imobiliário através da tokenização blockchain na rede Stellar',
  'landing.hero.tagline1': '🚀 Seguro',
  'landing.hero.tagline2': '⚡ Rápido',
  'landing.hero.tagline3': '💎 Transparente',

  'landing.company.title': 'Para Empresas',
  'landing.company.description': 'Tokenize seus ativos imobiliários e levante capital de forma eficiente',
  'landing.company.feature1': 'Tokenização segura na Stellar',
  'landing.company.feature2': 'Acesso global de investidores',
  'landing.company.feature3': 'Acompanhamento de performance em tempo real',
  'landing.company.button': 'Começar Tokenização →',

  'landing.investor.title': 'Para Investidores',
  'landing.investor.description': 'Descubra oportunidades de imóveis tokenizados com altos retornos',
  'landing.investor.feature1': 'Portfólio imobiliário diversificado',
  'landing.investor.feature2': 'Investimento mínimo baixo',
  'landing.investor.feature3': 'Tokens líquidos e negociáveis',
  'landing.investor.button': 'Começar Investimento →',

  'landing.stats.totalRaised': 'Total Arrecadado',
  'landing.stats.properties': 'Propriedades',
  'landing.stats.avgApy': 'APY Médio',

  'landing.footer.powered': 'Powered by Stellar Network',
  'landing.footer.tagline': 'Seguro • Transparente • Eficiente',

  'investor.title': '💰 Dashboard Investidor - RealYield',
  'investor.futureLoans.title': '💰 Empréstimos Futuros',
  'investor.filters.title': 'Filtros',
  'investor.filters.constructor': 'Construtora:',
  'investor.filters.apyMin': 'APY Mínimo (%):',
  'investor.futureLoans.invest': '💰 Investir',
  'investor.futureLoans.list.constructor': 'Construtora:',
  'investor.futureLoans.list.token': 'Token:',
  'investor.futureLoans.list.location': 'Localização:',
  'investor.futureLoans.list.term': 'Prazo:',
  'investor.futureLoans.list.noteToken': 'Note Token:',
  'investor.futureLoans.list.companyWallet': '🏢 Carteira da Empresa:',
  'investor.futureLoans.list.progress': 'Progresso:',
  'investor.futureLoans.list.tokensRemaining': 'Tokens Restantes:',
  'investor.futureLoans.selectPrompt': 'Selecione um empréstimo para investir',
  'investor.futureLoans.list.constructor': 'Construtora:',
  'investor.futureLoans.list.token': 'Token:',
  'investor.futureLoans.list.location': 'Localização:',
  'investor.futureLoans.list.term': 'Prazo:',
  'investor.futureLoans.list.noteToken': 'Note Token:',
  'investor.futureLoans.list.companyWallet': '🏢 Carteira da Empresa:',
  'investor.futureLoans.selectPrompt': 'Selecione um empréstimo para investir',
  'investor.sign.title': '📝 Assinatura do Contrato',
  'investor.sign.name': 'Nome:',
  'investor.sign.constructor': 'Construtora:',
  'investor.sign.token': 'Token:',
  'investor.sign.location': 'Localização:',
  'investor.sign.apy': 'APY:',
  'investor.sign.term': 'Prazo:',
  'investor.sign.price': 'Preço por Token:',
  'investor.sign.total': 'Valor Total:',
  'investor.invest.title': 'Valor do Investimento',
  'investor.invest.amount': 'Valor a Investir (USDC):',
  'investor.invest.summary': 'Resumo do Investimento',
  'investor.invest.invested': 'Valor Investido:',
  'investor.invest.tokens': 'Tokens a Receber:',
  'investor.invest.interest': 'Juros Anuais:',
  'investor.invest.final': 'Total ao Final:',
  'investor.invest.submit': '✍️ Assinar Contrato e Investir',
  'investor.history.title': '📊 Histórico de Investimentos',
  'investor.history.active': '🟢 Contratos Ativos',
  'investor.history.completed': '✅ Contratos Finalizados',
  'investor.history.summaryTitle': '📊 Resumo Geral',
  'investor.history.activeCount': 'Contratos Ativos:',
  'investor.history.completedCount': 'Contratos Finalizados:',
  'investor.history.totalInvested': 'Total Investido:',
  'investor.history.returnsTitle': '💰 Retornos',
  'investor.history.accumulatedInterest': 'Juros Acumulados:',
  'investor.history.receivedInterest': 'Juros Recebidos:',
  'investor.common.constructor': 'Construtora:',
  'investor.common.investedAmount': 'Valor Investido:',
  'investor.common.tokens': 'Tokens:',
  'investor.common.apy': 'APY:',
  'investor.common.maturity': 'Vencimento:',
  'investor.common.start': 'Início:',
  'investor.common.companyWallet': '🏢 Carteira da Empresa:',
  'investor.common.totalReceived': 'Total Recebido:',
  'investor.common.finalizedOn': 'Finalizado em:',
};

const enUS: Dictionary = {
  'common.back': '← Back to RealYield',
  'common.wallet': '🔗 Wallet',
  'common.toggleLanguage': 'PT',
  'common.months': 'months',

  'tabs.emission': '🏗️ RWA Issuance',
  'tabs.contracts': '📋 Contracts & Loans',
  'tabs.metrics': '📊 Metrics',
  'tabs.loans_investor': '💰 Loans & Contracts',
  'tabs.history': '📊 History',

  'company.title': '🏢 Company Dashboard - RealYield',
  'company.emission.title': '🏗️ RWA Issuance - Construction Tokenization',
  'company.feedback.success': 'RWA created successfully! Token will be issued on Stellar network.',
  'company.feedback.error': 'Error creating RWA. Please try again.',
  'company.form.projectInfo': 'Project Information',
  'company.form.constructorName': 'Constructor Name',
  'company.form.assetName': 'Property Name (Token)',
  'company.form.definition': 'Project Description',
  'company.form.location': 'Location',
  'company.form.tokenSettings': 'Token Settings',
  'company.form.totalSupply': 'Total Tokens (Supply)',
  'company.form.tokenSymbol': 'Token Symbol',
  'company.form.borrowAmount': 'Borrow Amount',
  'company.form.ipfsUri': 'IPFS URI (Real Estate Documents)',
  'company.form.loanSettings': 'Loan Settings',
  'company.form.interestRate': 'Annual Interest Rate (%)',
  'company.form.term': 'Loan Term (months)',
  'company.form.totalWithInterest': 'Total Amount with Interest (USDC)',
  'company.form.submit': '🚀 Create RWA and Release to Public',

  // Validation messages
  'validation.assetNameRequired': 'Asset name is required',
  'validation.definitionRequired': 'Project description is required',
  'validation.totalSupplyRequired': 'Total tokens is required',
  'validation.locationRequired': 'Location is required',
  'validation.dueDateRequired': 'Due date is required',
  'validation.expectedAmountRequired': 'Expected amount is required',
  'validation.interestRateRequired': 'Interest rate is required',
  'validation.termRequired': 'Loan term is required',
  'validation.ipfsUriRequired': 'IPFS URI is required',
  'validation.constructorNameRequired': 'Constructor name is required',
  'validation.tokenSymbolRequired': 'Token symbol is required',
  'validation.totalSupplyInvalid': 'Total tokens must be a valid number',
  'validation.expectedAmountInvalid': 'Expected amount must be a valid number',
  'validation.interestRateInvalid': 'Interest rate must be a valid number',
  'validation.termInvalid': 'Term must be a valid number',

  // Success/Error messages
  'messages.success': 'RWA created successfully! Token will be issued on Stellar network.',
  'messages.error': 'Error creating RWA. Please try again.',

  // Status labels
  'status.active': 'ACTIVE',
  'status.completed': 'COMPLETED',
  'status.finalReport': '📊 View Final Report',

  'company.contracts.title': '📋 Contracts & Loans',
  'company.contracts.active': '🟢 Active Contracts',
  'company.contracts.investors': 'Investors',
  'company.contracts.requested': 'Requested',
  'company.contracts.raised': 'Raised',
  'company.contracts.interest': 'Interest Rate',
  'company.contracts.maturity': 'Maturity',
  'company.contracts.progress': 'Fundraising Progress',
  'company.contracts.viewDetails': '📊 View Details',
  'company.contracts.closeOffer': '🔒 Close Offer',
  'company.contracts.completed': '✅ Completed Contracts',
  'company.contracts.paidValue': 'Paid Value',
  'company.contracts.paidInterest': 'Interest Paid',
  'company.contracts.settledOn': 'Settled on',

  'company.metrics.title': '📊 Metrics & Performance',
  'company.metrics.totalInvestors': 'Total Investors',
  'company.metrics.activeProjects': 'Active Projects',
  'company.metrics.table.project': 'Project',
  'company.metrics.table.status': 'Status',
  'company.metrics.table.investors': 'Investors',
  'company.metrics.table.currentValue': 'Current Value',

  'investor.title': '💰 Investor Dashboard - RealYield',
  'investor.futureLoans.title': '💰 Future Loans',
  'investor.filters.title': 'Filters',
  'investor.filters.constructor': 'Constructor:',
  'investor.filters.apyMin': 'Min APY (%):',
  'investor.futureLoans.invest': '💰 Invest',
  'investor.futureLoans.list.constructor': 'Constructor:',
  'investor.futureLoans.list.token': 'Token:',
  'investor.futureLoans.list.location': 'Location:',
  'investor.futureLoans.list.term': 'Term:',
  'investor.futureLoans.list.noteToken': 'Note Token:',
  'investor.futureLoans.list.companyWallet': '🏢 Company Wallet:',
  'investor.futureLoans.list.progress': 'Progress:',
  'investor.futureLoans.list.tokensRemaining': 'Tokens Remaining:',
  'investor.futureLoans.selectPrompt': 'Select a loan to invest',
  'investor.sign.title': '📝 Contract Signature',
  'investor.sign.name': 'Name:',
  'investor.sign.constructor': 'Constructor:',
  'investor.sign.token': 'Token:',
  'investor.sign.location': 'Location:',
  'investor.sign.apy': 'APY:',
  'investor.sign.term': 'Term:',
  'investor.sign.price': 'Price per Token:',
  'investor.sign.total': 'Total Value:',
  'investor.invest.title': 'Investment Amount',
  'investor.invest.amount': 'Amount to Invest (USDC):',
  'investor.invest.summary': 'Investment Summary',
  'investor.invest.invested': 'Invested Amount:',
  'investor.invest.tokens': 'Tokens to Receive:',
  'investor.invest.interest': 'Annual Interest:',
  'investor.invest.final': 'Total at End:',
  'investor.invest.submit': '✍️ Sign Contract and Invest',
  'investor.history.title': '📊 Investment History',
  'investor.history.active': '🟢 Active Contracts',
  'investor.history.completed': '✅ Completed Contracts',

  // Landing Page
  'landing.hero.title': 'RealYield',
  'landing.hero.subtitle': 'Revolutionize real estate investing through blockchain tokenization on the Stellar network',
  'landing.hero.tagline1': '🚀 Secure',
  'landing.hero.tagline2': '⚡ Fast',
  'landing.hero.tagline3': '💎 Transparent',

  'landing.company.title': 'For Companies',
  'landing.company.description': 'Tokenize your real estate assets and raise capital efficiently',
  'landing.company.feature1': 'Secure tokenization on Stellar',
  'landing.company.feature2': 'Global investor access',
  'landing.company.feature3': 'Real-time performance tracking',
  'landing.company.button': 'Start Tokenization →',

  'landing.investor.title': 'For Investors',
  'landing.investor.description': 'Discover tokenized real estate opportunities with high returns',
  'landing.investor.feature1': 'Diversified real estate portfolio',
  'landing.investor.feature2': 'Low minimum investment',
  'landing.investor.feature3': 'Liquid and tradable tokens',
  'landing.investor.button': 'Start Investing →',

  'landing.stats.totalRaised': 'Total Raised',
  'landing.stats.properties': 'Properties',
  'landing.stats.avgApy': 'Average APY',

  'landing.footer.powered': 'Powered by Stellar Network',
  'landing.footer.tagline': 'Secure • Transparent • Efficient',
};

type I18nContextType = {
  locale: Locale;
  t: (key: string) => string;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialLocale = (): Locale => {
    if (typeof window === 'undefined') return 'pt-BR';
    const saved = localStorage.getItem('locale') as Locale | null;
    return saved === 'pt-BR' || saved === 'en-US' ? saved : 'pt-BR';
  };

  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  const dict = useMemo(() => (locale === 'pt-BR' ? ptBR : enUS), [locale]);

  const t = useCallback((key: string) => {
    return dict[key] ?? key;
  }, [dict]);

  const toggleLocale = useCallback(() => {
    setLocale(prev => (prev === 'pt-BR' ? 'en-US' : 'pt-BR'));
  }, []);

  // Persistir idioma selecionado
  React.useEffect(() => {
    try {
      localStorage.setItem('locale', locale);
    } catch {}
  }, [locale]);

  const value = useMemo(() => ({ locale, t, setLocale, toggleLocale }), [locale, t, toggleLocale]);

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within LanguageProvider');
  return ctx;
};



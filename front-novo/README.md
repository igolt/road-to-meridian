# Stellar Real Estate - Frontend

Este é o frontend da aplicação Stellar Real Estate, uma plataforma para tokenização de imóveis na rede Stellar.

## Funcionalidades

### Tela de Seleção
- Interface para escolher entre **Empresa** e **Investidor**
- Design moderno e responsivo
- Preparado para futuras abas específicas

### Dashboard Empresa
- Conectar carteira Freighter
- Criar tokens de imóveis
- Configurar parâmetros do token (código, nome, descrição, etc.)
- Gerenciar flags de autorização

### Dashboard Investidor
- Conectar carteira Freighter
- Visualizar portfólio de investimentos
- Transferir tokens
- Consultar informações de tokens

## Tecnologias

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Radix UI** para componentes acessíveis
- **Stellar SDK** (preparado para integração)

## Instalação

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## Estrutura do Projeto

```
src/
├── components/
│   ├── ui/                 # Componentes base (Button, Card, Input, etc.)
│   ├── UserTypeSelector.tsx    # Tela de seleção de tipo de usuário
│   ├── EmpresaDashboard.tsx    # Dashboard para empresas
│   └── InvestidorDashboard.tsx # Dashboard para investidores
├── services/
│   └── StellarService.ts       # Serviço para integração com Stellar
├── types/
│   └── index.ts               # Tipos TypeScript
├── lib/
│   └── utils.ts              # Utilitários
└── App.tsx                   # Componente principal
```

## Integração com Stellar

A aplicação está preparada para integração com:
- **Freighter Wallet** para conexão de carteira
- **Stellar SDK** para operações na blockchain
- **Horizon API** para consultas de rede

## Próximos Passos

1. Integração real com Stellar SDK
2. Implementação de abas específicas para cada tipo de usuário
3. Sistema de autenticação
4. Histórico de transações
5. Notificações em tempo real

## Desenvolvimento

Para contribuir com o projeto:

1. Clone o repositório
2. Instale as dependências
3. Execute `npm run dev`
4. Faça suas alterações
5. Teste localmente
6. Submeta um pull request
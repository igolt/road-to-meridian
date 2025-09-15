# TokenEasy - RWA Tokenization Platform

TokenEasy is a production-ready dashboard for creating and deploying Real World Asset (RWA) tokens on both EVM and Stellar networks through a unified, guided wizard interface.

## Features

- **Multi-Chain Support**: Deploy tokens on EVM (Polygon Amoy/Polygon) and Stellar (Testnet/Mainnet)
- **Multiple Token Standards**: 
  - EVM: ERC-20, ERC-721, ERC-1155
  - Stellar: Classic Assets, Soroban Tokens (optional)
- **Guided Wizard**: Step-by-step token creation process
- **Compliance Features**: KYC whitelists, lockups, pausable tokens, snapshots
- **Wallet Integration**: RainbowKit for EVM, Freighter for Stellar
- **Modern UI**: Built with React, TypeScript, Tailwind CSS, and shadcn/ui

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or other EVM wallet
- Freighter wallet (for Stellar)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tokeneasy-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Project Configuration
   VITE_EVM_PROJECT_NAME=TokenEasy
   VITE_DEFAULT_PROPERTY_URI=https://example.com/property-docs

   # EVM Network Configuration (Optional)
   VITE_ALCHEMY_ID=your_alchemy_id_here
   VITE_INFURA_ID=your_infura_id_here

   # Stellar Network Configuration
   VITE_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
   # For mainnet: https://horizon.stellar.org

   # Feature Flags
   VITE_ENABLE_SOROBAN=false
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_EVM_PROJECT_NAME` | Project name for EVM deployments | `TokenEasy` |
| `VITE_DEFAULT_PROPERTY_URI` | Default URI for property documentation | `https://example.com/property-docs` |
| `VITE_STELLAR_HORIZON_URL` | Stellar Horizon server URL | `https://horizon-testnet.stellar.org` |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_ALCHEMY_ID` | Alchemy API key for better EVM performance | `your_alchemy_id` |
| `VITE_INFURA_ID` | Infura API key for better EVM performance | `your_infura_id` |
| `VITE_ENABLE_SOROBAN` | Enable Soroban token support | `true` or `false` |
| `VITE_SOROBAN_RPC_URL` | Soroban RPC URL (if Soroban enabled) | `https://soroban-testnet.stellar.org` |

## Usage Guide

### Step 1: Choose Your Platform
- Select between **EVM** or **Stellar**
- Choose the appropriate token standard
- Select your target network

### Step 2: Configure Token Basics
- **Name**: Human-readable token name
- **Symbol/Asset Code**: Short identifier (3-5 chars for EVM, 1-12 for Stellar)
- **Property URI**: Link to property documentation
- **Description**: Optional detailed description

#### EVM-Specific Fields
- **Initial Supply**: Starting token amount
- **Decimals**: Number of decimal places (default: 18)
- **Base Token URI**: For ERC-721 metadata

#### Stellar-Specific Fields
- **Issuer Account**: Your Stellar public key
- **Home Domain**: Domain for TOML file
- **Distribution Account**: Account to receive initial tokens

### Step 3: Set Compliance Rules
#### EVM Compliance
- **KYC Required**: Whitelist-only transfers
- **Lockups**: Time-based token restrictions
- **Pausable**: Emergency pause functionality
- **Snapshots**: Balance snapshots for governance

#### Stellar Compliance
- **Authorization Required**: Require issuer approval for trustlines
- **Authorization Revocable**: Allow revoking trustline authorizations

### Step 4: Deploy
- Review your configuration
- Connect your wallet
- Deploy your token
- Get contract addresses and explorer links

## Network Configuration

### Adding More EVM Networks

1. **Update network configuration** in `src/deployers/evmDeployer.ts`:
   ```typescript
   const NETWORKS = {
     'your-network': {
       ...yourChainConfig,
       rpcUrl: 'your_rpc_url',
       explorerUrl: 'your_explorer_url'
     }
   };
   ```

2. **Add to wagmi config** in `src/App.tsx`:
   ```typescript
   chains: [polygonAmoy, polygon, yourChain],
   ```

3. **Update network options** in `src/components/wizard/Step1StackStandard.tsx`

### Switching to Stellar Mainnet

1. **Update environment variable**:
   ```env
   VITE_STELLAR_HORIZON_URL=https://horizon.stellar.org
   ```

2. **Update network options** in the wizard

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── wizard/         # Wizard step components
├── core/               # Core types and utilities
├── deployers/          # Chain-specific deployers
├── lib/                # Utility functions
└── App.tsx             # Main application
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests
```

### Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Deployment

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Environment-Specific Builds

```bash
# Development
npm run dev

# Production
npm run build
npm run preview
```

## Troubleshooting

### Common Issues

1. **Wallet Connection Fails**
   - Ensure MetaMask is installed and unlocked
   - Check if you're on the correct network
   - Try refreshing the page

2. **Stellar Deployment Fails**
   - Ensure Freighter wallet is installed and connected
   - Verify you have sufficient XLM for transaction fees
   - Check if the account exists on the selected network

3. **EVM Deployment Fails**
   - Ensure you have sufficient MATIC for gas fees
   - Verify you're on the correct network
   - Check if the contract ABI is properly loaded

### Debug Mode

Enable debug logging by setting:
```env
VITE_DEBUG=true
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the troubleshooting section

## Roadmap

- [ ] ERC-1155 tranche management UI
- [ ] Advanced compliance features
- [ ] Token verification integration
- [ ] Multi-language support (i18n)
- [ ] Deployment presets
- [ ] Analytics dashboard
- [ ] Mobile app

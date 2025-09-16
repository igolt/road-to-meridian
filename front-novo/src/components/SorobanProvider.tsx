import React from 'react';
import { SorobanReactProvider } from '@soroban-react/core';
import { freighter } from '@soroban-react/freighter';
import { WalletProvider } from '../wallet/WalletProvider';

interface SorobanProviderProps {
  children: React.ReactNode;
}

// Configuração manual da chain testnet
const testnetChain = {
  id: 'testnet',
  name: 'Testnet',
  networkPassphrase: 'Test SDF Network ; September 2015',
  network: 'testnet',
  networkUrl: 'https://soroban-testnet.stellar.org',
  rpcUrl: 'https://soroban-testnet.stellar.org',
  iconBackground: '#fff',
  iconUrl: 'https://stellar.org/favicon.ico',
} as any;

const SorobanProvider: React.FC<SorobanProviderProps> = ({ children }) => {
  return (
    <SorobanReactProvider 
      appName="RealYield" 
      chains={[testnetChain]} 
      connectors={[freighter()]}
    > 
      <WalletProvider>
        {children}
      </WalletProvider>
    </SorobanReactProvider>
  );
};

export default SorobanProvider;

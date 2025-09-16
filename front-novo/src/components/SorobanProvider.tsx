import React from 'react';
import { WalletProvider } from '../wallet/WalletProvider';

interface SorobanProviderProps {
  children: React.ReactNode;
}

const SorobanProvider: React.FC<SorobanProviderProps> = ({ children }) => {
  return (
    <WalletProvider>
      {children}
    </WalletProvider>
  );
};

export default SorobanProvider;

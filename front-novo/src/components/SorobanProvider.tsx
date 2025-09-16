import React from 'react';
import { SorobanReactProvider } from '@soroban-react/core';
import { freighter } from '@soroban-react/freighter';
import { futurenet, testnet, mainnet } from '@soroban-react/chains';

interface SorobanProviderProps {
  children: React.ReactNode;
}

const SorobanProvider: React.FC<SorobanProviderProps> = ({ children }) => {
  // Configuração das redes disponíveis (todas as redes para suportar qualquer carteira)
  const allowedChains = [futurenet, testnet, mainnet];
  
  // Configuração das carteiras disponíveis
  const connectors = [freighter()];

  return (
    <SorobanReactProvider
      chains={allowedChains}
      connectors={connectors}
      appName="RealYield"
      autoconnect={false}
    >
      {children}
    </SorobanReactProvider>
  );
};

export default SorobanProvider;

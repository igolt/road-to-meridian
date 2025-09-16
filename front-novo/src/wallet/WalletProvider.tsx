import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Networks } from 'stellar-sdk';

interface WalletContextValue {
  address: string | null;
  isInstalled: boolean;
  isConnecting: boolean;
  network: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [network, setNetwork] = useState<string | null>(null);

  useEffect(() => {
    const freighter = (globalThis as any)?.freighterApi as any | undefined;
    const check = async () => {
      try {
        const has = typeof freighter !== 'undefined';
        setIsInstalled(has);
        if (!has) return;
        const net = await freighter.getNetwork?.().catch(() => null);
        if (typeof net === 'string') setNetwork(net);
        else if (net && typeof net.network === 'string') setNetwork(net.network);
        else setNetwork(null);
        const existing = await freighter.getPublicKey?.().catch(() => null);
        if (existing) setAddress(existing);
      } catch {
        setIsInstalled(false);
      }
    };
    check();
    let elapsed = 0;
    const interval = setInterval(() => {
      const has = typeof (globalThis as any)?.freighterApi !== 'undefined';
      if (has) {
        setIsInstalled(true);
        clearInterval(interval);
      }
      elapsed += 250;
      if (elapsed > 5000) clearInterval(interval);
    }, 250);
    return () => clearInterval(interval);
  }, []);

  const connect = useCallback(async () => {
    const freighter = (globalThis as any)?.freighterApi as any | undefined;
    if (!freighter) throw new Error('Freighter não instalada');
    setIsConnecting(true);
    try {
      // Garante que o popup de permissão apareça em gesto do usuário
      try {
        const connected = await freighter.isConnected?.().catch(() => false);
        if (!connected && freighter.connect) {
          await freighter.connect();
        }
      } catch {}
      const pub = await freighter.getPublicKey();
      setAddress(pub);
      const net = await freighter.getNetwork?.().catch(() => null);
      if (typeof net === 'string') setNetwork(net || Networks.PUBLIC);
      else if (net && typeof net.network === 'string') setNetwork(net.network);
      else setNetwork(Networks.PUBLIC);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    setAddress(null);
  }, []);

  const value = useMemo(
    () => ({ address, isInstalled, isConnecting, network, connect, disconnect }),
    [address, isInstalled, isConnecting, network, connect, disconnect]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = (): WalletContextValue => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet deve ser usado dentro de WalletProvider');
  return ctx;
};



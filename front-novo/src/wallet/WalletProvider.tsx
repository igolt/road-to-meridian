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
    const check = async () => {
      try {
        const freighter = (globalThis as any)?.freighterApi as any | undefined;
        const hasFreighter = typeof freighter !== 'undefined';
        setIsInstalled(hasFreighter);
        if (!hasFreighter) return;
        // Tenta obter rede; não força permissão aqui
        const net = await freighter.getNetwork?.().catch(() => null);
        if (typeof net === 'string') setNetwork(net);
        else if (net && typeof net.network === 'string') setNetwork(net.network);
        else setNetwork(null);
        // Se o site já tem permissão, getPublicKey resolve sem prompt
        const existing = await freighter.getPublicKey?.().catch(() => null);
        if (existing) setAddress(existing);
      } catch {
        setIsInstalled(false);
      }
    };
    check();
    // Poll por curto período para aguardar a injeção da extensão após load
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
    if (!isInstalled) throw new Error('Freighter não instalada');
    setIsConnecting(true);
    try {
      // Se a API suportar, verifique e solicite permissão explicitamente
      const freighter = (globalThis as any)?.freighterApi as any;
      try {
        const isAllowed = await freighter?.isAllowed?.().catch(() => false);
        if (!isAllowed && freighter?.setAllowed) {
          await freighter.setAllowed();
        }
      } catch {}
      // getPublicKey deve disparar o prompt; adiciona tentativas rápidas
      let pub: string | null = null;
      let lastErr: unknown = null;
      for (let i = 0; i < 3; i++) {
        try {
          pub = await freighter.getPublicKey();
          break;
        } catch (e) {
          lastErr = e;
          // pequeno atraso e tenta novamente para dar tempo do usuário interagir
          await new Promise((r) => setTimeout(r, 300));
        }
      }
      if (!pub) throw lastErr || new Error('Não foi possível obter a chave pública');
      setAddress(pub);
      const net = await freighter.getNetwork?.().catch(() => null);
      if (typeof net === 'string') setNetwork(net || Networks.PUBLIC);
      else if (net && typeof net.network === 'string') setNetwork(net.network);
      else setNetwork(Networks.PUBLIC);
    } finally {
      setIsConnecting(false);
    }
  }, [isInstalled]);

  const disconnect = useCallback(async () => {
    // Freighter não oferece logout; limpamos o estado local
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



import { PasskeyKit } from 'passkey-kit';
import { ENV, validateEnvironment } from '../config/environment';

export interface StellarUser {
  id: string;
  name: string;
  displayName: string;
  segment: 'empresa' | 'investidor';
  publicKey?: string;
  contractAddress?: string;
  keyIdBase64?: string;
}

export class StellarPasskeyService {
  private static instance: StellarPasskeyService;
  private passkeyKit: PasskeyKit | null = null;
  private currentUser: StellarUser | null = null;
  private isInitialized = false;

  static getInstance(): StellarPasskeyService {
    if (!StellarPasskeyService.instance) {
      StellarPasskeyService.instance = new StellarPasskeyService();
    }
    return StellarPasskeyService.instance;
  }

  /**
   * Inicializa o PasskeyKit com as configurações do ambiente
   */
  async initialize(): Promise<boolean> {
    try {
      if (!validateEnvironment()) {
        console.error('Configurações de ambiente inválidas');
        return false;
      }

      this.passkeyKit = new PasskeyKit({
        rpcUrl: ENV.RPC_URL,
        networkPassphrase: ENV.NETWORK_PASSPHRASE,
        walletWasmHash: ENV.WALLET_WASM_HASH,
      });

      this.isInitialized = true;
      console.log('PasskeyKit inicializado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao inicializar PasskeyKit:', error);
      return false;
    }
  }

  /**
   * Verifica se o navegador suporta WebAuthn/Passkey
   */
  isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.navigator !== 'undefined' &&
      typeof window.navigator.credentials !== 'undefined' &&
      typeof window.navigator.credentials.create !== 'undefined'
    );
  }

  /**
   * Cria uma nova carteira Stellar com Passkey
   */
  async createWallet(segment: 'empresa' | 'investidor'): Promise<StellarUser | null> {
    try {
      if (!this.isInitialized || !this.passkeyKit) {
        const initialized = await this.initialize();
        if (!initialized) {
          throw new Error('Falha ao inicializar PasskeyKit');
        }
      }

      if (!this.isSupported()) {
        throw new Error('Navegador não suporta Passkey/WebAuthn');
      }

      // Registro e criação de carteira real via PasskeyKit
      const result = await (this.passkeyKit as PasskeyKit).createWallet('RealYild', segment);

      const user: StellarUser = {
        id: `user_${Date.now()}`,
        name: segment === 'empresa' ? 'Empresa RealYild' : 'Investidor RealYild',
        displayName: segment === 'empresa' ? 'Empresa' : 'Investidor',
        segment,
        contractAddress: result.contractId,
        keyIdBase64: result.keyIdBase64,
      };

      this.currentUser = user;
      this.saveUserToStorage(user);
      
      console.log('Carteira Stellar criada:', user);
      return user;
    } catch (error) {
      console.error('Erro ao criar carteira:', error);
      return null;
    }
  }

  /**
   * Conecta com uma carteira existente
   */
  async connectWallet(segment: 'empresa' | 'investidor'): Promise<StellarUser | null> {
    try {
      if (!this.isInitialized || !this.passkeyKit) {
        const initialized = await this.initialize();
        if (!initialized) {
          throw new Error('Falha ao inicializar PasskeyKit');
        }
      }

      if (!this.isSupported()) {
        throw new Error('Navegador não suporta Passkey/WebAuthn');
      }

      // Tentar reconectar usando o keyId salvo (se houver)
      const stored = this.currentUser ?? this.loadStoredUser();
      const keyId = stored?.keyIdBase64;

      const res = await (this.passkeyKit as PasskeyKit).connectWallet({
        keyId,
        getContractId: async (keyId: string) => {
          try {
            const response = await fetch(`${ENV.API_URL}/api/contract-id?keyId=${encodeURIComponent(keyId)}`);
            if (!response.ok) return undefined;
            const data = await response.json();
            return data.contractId;
          } catch (error) {
            console.warn('Erro ao buscar contractId do backend:', error);
            return undefined;
          }
        }
      });

      const user: StellarUser = {
        id: `user_${Date.now()}`,
        name: segment === 'empresa' ? 'Empresa RealYild' : 'Investidor RealYild',
        displayName: segment === 'empresa' ? 'Empresa' : 'Investidor',
        segment,
        contractAddress: res.contractId,
        keyIdBase64: res.keyIdBase64,
      };

      this.currentUser = user;
      this.saveUserToStorage(user);
      
      console.log('Carteira Stellar conectada:', user);
      return user;
    } catch (error) {
      console.error('Erro ao conectar carteira:', error);
      return null;
    }
  }

  /**
   * Obtém o usuário atual
   */
  getCurrentUser(): StellarUser | null {
    return this.currentUser;
  }

  /**
   * Desconecta o usuário atual
   */
  async disconnect(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('stellar_user');
    console.log('Usuário desconectado');
  }

  /**
   * Carrega usuário salvo do localStorage
   */
  loadStoredUser(): StellarUser | null {
    try {
      const stored = localStorage.getItem('stellar_user');
      if (stored) {
        const user = JSON.parse(stored) as StellarUser;
        this.currentUser = user;
        return user;
      }
    } catch (error) {
      console.error('Erro ao carregar usuário salvo:', error);
    }
    return null;
  }

  /**
   * Salva usuário no localStorage
   */
  private saveUserToStorage(user: StellarUser): void {
    try {
      localStorage.setItem('stellar_user', JSON.stringify(user));
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  }

  /**
   * Obtém informações da carteira atual
   */
  async getWalletInfo(): Promise<any> {
    if (!this.currentUser) {
      throw new Error('Nenhuma carteira conectada');
    }

    try {
      return {
        publicKey: this.currentUser.publicKey,
        contractAddress: this.currentUser.contractAddress,
        segment: this.currentUser.segment
      };
    } catch (error) {
      console.error('Erro ao obter informações da carteira:', error);
      throw error;
    }
  }

  /**
   * Verifica se há uma carteira conectada
   */
  isConnected(): boolean {
    return this.currentUser !== null && this.isInitialized;
  }

  /**
   * Envia uma transação assinada via backend
   */
  async sendTransaction(transaction: any, fee?: number): Promise<any> {
    try {
      const response = await fetch(`${ENV.API_URL}/api/send-transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transaction, fee }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao enviar transação: ${response.statusText}`);
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Erro ao enviar transação:', error);
      throw error;
    }
  }

  /**
   * Obtém os signers de uma carteira
   */
  async getSigners(contractId?: string): Promise<any[]> {
    try {
      const walletContractId = contractId || this.currentUser?.contractAddress;
      if (!walletContractId) {
        throw new Error('Nenhuma carteira conectada');
      }

      const response = await fetch(`${ENV.API_URL}/api/signers/${encodeURIComponent(walletContractId)}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao obter signers: ${response.statusText}`);
      }

      const data = await response.json();
      return data.signers;
    } catch (error) {
      console.error('Erro ao obter signers:', error);
      throw error;
    }
  }

  /**
   * Assina uma transação usando Passkey
   */
  async signTransaction(transaction: any): Promise<any> {
    if (!this.passkeyKit || !this.currentUser) {
      throw new Error('Nenhuma carteira conectada');
    }

    try {
      const signedTx = await (this.passkeyKit as PasskeyKit).sign(transaction, {
        keyId: this.currentUser.keyIdBase64,
      });

      return signedTx;
    } catch (error) {
      console.error('Erro ao assinar transação:', error);
      throw error;
    }
  }
}

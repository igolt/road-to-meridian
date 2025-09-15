export interface PasskeyUser {
  id: string;
  name: string;
  displayName: string;
  segment: 'empresa' | 'investidor';
}

export class PasskeyService {
  private static instance: PasskeyService;
  private currentUser: PasskeyUser | null = null;

  static getInstance(): PasskeyService {
    if (!PasskeyService.instance) {
      PasskeyService.instance = new PasskeyService();
    }
    return PasskeyService.instance;
  }

  /**
   * Verifica se o navegador suporta WebAuthn/Passkey
   */
  isSupported(): boolean {
    return !!(
      window.PublicKeyCredential &&
      window.navigator.credentials &&
      window.navigator.credentials.create &&
      window.navigator.credentials.get
    );
  }

  /**
   * Simula autenticação com Passkey
   */
  async authenticateUser(segment: 'empresa' | 'investidor'): Promise<PasskeyUser | null> {
    try {
      // Simular delay de autenticação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular usuário retornado
      const user: PasskeyUser = {
        id: 'user_' + Date.now(),
        name: segment === 'empresa' ? 'Empresa RealYild' : 'Investidor RealYild',
        displayName: segment === 'empresa' ? 'Empresa' : 'Investidor',
        segment
      };

      this.currentUser = user;
      this.saveUserToStorage(user);
      return user;
    } catch (error) {
      console.error('Erro na autenticação:', error);
      return null;
    }
  }

  /**
   * Obtém o usuário atual
   */
  getCurrentUser(): PasskeyUser | null {
    return this.currentUser;
  }

  /**
   * Desconecta o usuário atual
   */
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('realyild_user');
  }

  /**
   * Verifica se há um usuário salvo
   */
  hasStoredUser(): boolean {
    return !!localStorage.getItem('realyild_user');
  }

  /**
   * Carrega usuário do armazenamento local
   */
  loadStoredUser(): PasskeyUser | null {
    try {
      const stored = localStorage.getItem('realyild_user');
      if (stored) {
        this.currentUser = JSON.parse(stored);
        return this.currentUser;
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    }
    return null;
  }

  /**
   * Salva usuário no armazenamento local
   */
  private saveUserToStorage(user: PasskeyUser): void {
    try {
      localStorage.setItem('realyild_user', JSON.stringify(user));
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  }
}
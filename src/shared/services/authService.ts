/**
 * Authentication service
 * User login, register, session management
 */

import type { User, UserSession, LoginFormData } from '@/shared/types';

export class AuthService {
  private static readonly USERS_KEY = 'users';
  private static readonly SESSION_KEY = 'currentUser';

  /**
   * Kullanıcı girişi
   */
  static async login(credentials: LoginFormData): Promise<{ success: boolean; user?: UserSession; error?: string }> {
    try {
      const users = this.getUsers();
      const user = users.find(u => u.email === credentials.email && u.password === credentials.password);

      if (user) {
        const session: UserSession = {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isPremium: user.isPremium,
          loginTime: new Date().toISOString()
        };

        this.setCurrentUser(session);
        return { success: true, user: session };
      } else {
        return { success: false, error: 'E-poçt və ya şifrə yanlışdır' };
      }
    } catch {
      return { success: false, error: 'Giriş zamanı xəta baş verdi' };
    }
  }

  /**
   * Kullanıcı çıkışı
   */
  static logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  /**
   * Mevcut oturum bilgilerini getirir
   */
  static getCurrentUser(): UserSession | null {
    try {
      const userStr = localStorage.getItem(this.SESSION_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  /**
   * Kullanıcının giriş yapıp yapmadığını kontrol eder
   */
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  /**
   * Admin paneli için özel kontrol
   */
  static isAdminAuthenticated(): boolean {
    // Admin panel kendi authentication'ını yönetiyor
    // Bu fonksiyon gelecekte kullanılmak üzere
    return false;
  }

  /**
   * LocalStorage'dan kullanıcıları getirir
   */
  private static getUsers(): User[] {
    try {
      const usersStr = localStorage.getItem(this.USERS_KEY);
      return usersStr ? JSON.parse(usersStr) : [];
    } catch {
      return [];
    }
  }

  /**
   * Mevcut kullanıcı oturumunu ayarlar
   */
  private static setCurrentUser(user: UserSession): void {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
  }

  /**
   * E-posta adresinin kullanımda olup olmadığını kontrol eder
   */
  static isEmailTaken(email: string): boolean {
    const users = this.getUsers();
    return users.some(user => user.email === email);
  }

  /**
   * Session'ın geçerli olup olmadığını kontrol eder
   */
  static isSessionValid(): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Session'ın 30 gün geçerli olduğunu varsayıyoruz
    const sessionAge = Date.now() - new Date(user.loginTime).getTime();
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 gün

    return sessionAge < maxAge;
  }

  /**
   * Session'ı yeniler
   */
  static refreshSession(): void {
    const user = this.getCurrentUser();
    if (user) {
      user.loginTime = new Date().toISOString();
      this.setCurrentUser(user);
    }
  }
}

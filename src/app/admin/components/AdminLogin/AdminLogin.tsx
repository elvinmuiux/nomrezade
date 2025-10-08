'use client';

import React, { useState } from 'react';
import { useAdminSession } from '../../lib/hooks/useAdminSession';
import styles from './AdminLogin.module.css';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdminSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('🔍 AdminLogin: Starting login process');
      const session = await login(email, password);
      console.log('🔍 AdminLogin: Login successful, session:', session);
      console.log('🔍 AdminLogin: Calling onLoginSuccess');
      onLoginSuccess();
      console.log('🔍 AdminLogin: onLoginSuccess called');
      
      // Sayfa yenileme - giriş başarılı olduktan sonra
      console.log('🔄 AdminLogin: Refreshing page after successful login');
      setTimeout(() => {
        window.location.reload();
      }, 500); // 500ms bekleyip sayfa yenile
      
    } catch (error) {
      console.error('❌ AdminLogin: Login error:', error);
      setError(error instanceof Error ? error.message : 'Giriş zamanı xəta baş verdi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1>Admin Panele Giriş</h1>
          <p>Daxil olmaq üçün email və şifrəni daxil edin</p>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email ünvanınızı daxil edin..."
              className={styles.emailInput}
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrəni daxil edin..."
              className={styles.passwordInput}
              required
            />
          </div>
          
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? 'Giriş edilir...' : 'Daxil ol'}
          </button>
        </form>
      </div>
    </div>
  );
}
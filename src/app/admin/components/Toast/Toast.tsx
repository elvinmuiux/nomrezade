'use client';

import { useEffect } from 'react';
import styles from './Toast.module.css';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

export default function Toast({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={`${styles.toast} ${styles[toast.type]}`}>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.icon}>{getIcon()}</span>
          <span className={styles.title}>{toast.title}</span>
          <button 
            className={styles.closeButton}
            onClick={() => onRemove(toast.id)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
        {toast.message && (
          <div className={styles.message}>{toast.message}</div>
        )}
      </div>
      <div className={styles.progressBar}>
        <div 
          className={styles.progress}
          data-duration={toast.duration || 5000}
        />
      </div>
    </div>
  );
}

'use client';

import styles from './AdminHeader.module.css';

interface AdminHeaderProps {
  onAddNew: () => void;
  onLogout: () => void;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AdminHeader({ onAddNew, onLogout, user }: AdminHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.headerLeft}>
          {user && (
            <div className={styles.userInfo}>
              <span className={styles.userName}>Xoş gəlmisiniz, {user.name}</span>
              <span className={styles.userEmail}>{user.email}</span>
            </div>
          )}
        </div>
        <div className={styles.headerActions}>
          <button 
            onClick={onAddNew}
            className={styles.addButton}
          >
            Elan Əlavə Et
          </button>
          <button 
            onClick={onLogout}
            className={styles.logoutButton}
          >
            Çıxış
          </button>
        </div>
      </div>
    </div>
  );
}



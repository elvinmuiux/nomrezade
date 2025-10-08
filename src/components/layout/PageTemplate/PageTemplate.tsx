"use client";

import React from 'react';
import styles from './PageTemplate.module.css';

interface PageTemplateProps {
  children: React.ReactNode;
  showTopNav?: boolean;
  showAlert?: boolean;
  alertMessage?: string;
  className?: string;
}

const PageTemplate: React.FC<PageTemplateProps> = ({
  children,
  showTopNav = true,
  showAlert = false,
  alertMessage = '',
  className = ''
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      {/* Top Navigation Bar - Simplified */}
      {showTopNav && (
        <div className={styles.topNav}>
          {/* Navigation content will be handled by individual page templates */}
        </div>
      )}

      {/* Alert Banner */}
      {showAlert && alertMessage && (
        <div className={styles.alertBanner}>
          <span className={styles.alertIcon}>⚠️</span>
          <p className={styles.alertText}>
            {alertMessage}
          </p>
        </div>
      )}

      {/* Page Content */}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default PageTemplate;

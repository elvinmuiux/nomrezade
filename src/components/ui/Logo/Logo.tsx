import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AuthButtons from '@/components/common/AuthButtons/AuthButtons';
import styles from './Logo.module.css';
import { LogoProps } from '@/shared/types/navigation';

const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'medium',
  src = '/logos/nomrezade-logo.svg',
  alt = 'Nomrezade Logo',
  title = 'nömre.zade',
  subtitle = 'Sizin Nömrələriniz bizdə.',
  showBrandInfo = true
}) => {
  // Complete logo area with brand information
  if (showBrandInfo) {
    return (
      <div className={`${styles.logoArea} ${className}`}>
        <div className={styles.logoAndMobileAuth}>
          <div className={`${styles.logo} ${styles[size]}`}>
            <Link href="/" className={styles.logoLink}>
              {src ? (
                <div className={styles.logoContainer}>
                  <Image
                    src={src}
                    alt={alt}
                    width={size === 'small' ? 40 : size === 'large' ? 80 : 60}
                    height={size === 'small' ? 40 : size === 'large' ? 80 : 60}
                    className={styles.logoImage}
                    priority
                  />
                </div>
              ) : (
                <div className={styles.logoCircle}>
                  <span className={styles.logoText}>NZ</span>
                </div>
              )}
            </Link>
          </div>
          <div className={styles.mobileAuthButtons}>
            <AuthButtons />
          </div>
        </div>
        <div className={styles.brandInfo}>
          <h1 className={styles.brandTitle}>{title}</h1>
          <p className={styles.brandSubtitle}>{subtitle}</p>
          <div className={styles.desktopAuthButtons}>
            <AuthButtons />
          </div>
        </div>
      </div>
    );
  }

  // Simple logo only (for backward compatibility)
  if (src) {
    return (
      <div className={`${styles.logo} ${styles[size]} ${className}`}>
        <Link href="/" className={styles.logoLink}>
          <div className={styles.logoContainer}>
            <Image
              src={src}
              alt={alt}
              width={size === 'small' ? 40 : size === 'large' ? 80 : 60}
              height={size === 'small' ? 40 : size === 'large' ? 80 : 60}
              className={styles.logoImage}
              priority
            />
          </div>
        </Link>
      </div>
    );
  }

  // Fallback to text logo
  // return (
  //   <div className={`${styles.logo} ${styles[size]} ${className}`}>
  //     <div className={styles.logoCircle}>
  //       <span className={styles.logoText}>NZ</span>
  //     </div>
  //   </div>
  // );
};

export default Logo;

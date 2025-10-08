'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import styles from './DeleteModal.module.css';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  phoneNumber?: string;
  isLoading?: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  phoneNumber = '',
  isLoading = false
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleSection}>
            <div className={styles.modalIcon}>
              <AlertTriangle size={20} />
            </div>
            <h2>Nömrəni Sil</h2>
          </div>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            disabled={isLoading}
            aria-label="Bağla"
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.warningIcon}>
            <AlertTriangle size={48} />
          </div>
          
          <div className={styles.warningText}>
            <h3>Bu əməliyyatı geri qaytarmaq mümkün deyil!</h3>
            <p>
              <strong>{phoneNumber}</strong> nömrəsini silmək istədiyinizə əminsiniz?
            </p>
            <p className={styles.warningNote}>
              Bu nömrə bütün sistemdən tamamilə silinəcək və bərpa edilə bilməyəcək.
            </p>
          </div>
        </div>

        <div className={styles.modalActions}>
          <button 
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isLoading}
          >
            Ləğv et
          </button>
          <button 
            className={styles.deleteButton}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Silinir...' : 'Sil'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;

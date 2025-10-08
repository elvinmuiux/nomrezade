'use client';

import React from 'react';
import { X, Phone, DollarSign, User, Tag, FileText } from 'lucide-react';
import styles from './AddEditNumberModal.module.css';

interface FormData {
  phoneNumber: string;
  price: string;
  contactPhone: string;
  type: 'standard' | 'gold' | 'premium';
  description: string;
  isSeller: boolean;
}

interface AddEditNumberModalProps {
  showAddModal: boolean;
  showEditModal: boolean;
  formData: FormData;
  setFormData: (data: FormData) => void;
  selectedFormPrefix: string;
  setSelectedFormPrefix: (prefix: string) => void;
  prefixes: string[];
  types: string[];
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  error: string;
}

export default function AddEditNumberModal({
  showAddModal,
  showEditModal,
  formData,
  setFormData,
  selectedFormPrefix,
  setSelectedFormPrefix,
  prefixes,
  types,
  onSubmit,
  onClose,
  error
}: AddEditNumberModalProps) {
  if (!showAddModal && !showEditModal) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleSection}>
            <div className={styles.modalIcon}>
              <Phone size={20} />
            </div>
            <h2>{showAddModal ? 'Yeni Elan Əlavə Et' : 'Elanı Redaktə Et'}</h2>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <Tag size={16} />
              Prefiks seç
            </label>
            <div className={styles.prefixButtons}>
              {prefixes.map(prefix => (
                <button
                  key={prefix}
                  type="button"
                  className={`${styles.prefixButton} ${selectedFormPrefix === prefix ? styles.prefixButtonActive : ''}`}
                  onClick={() => {
                    setSelectedFormPrefix(prefix);
                    setFormData({...formData, phoneNumber: ''});
                  }}
                >
                  {prefix}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <Phone size={16} />
              Nömrə
            </label>
            <div className={styles.inputContainer}>
              <input
                type="text"
                value={selectedFormPrefix ? `${selectedFormPrefix}-${formData.phoneNumber}` : ''}
                onChange={(e) => {
                  if (!selectedFormPrefix) return;
                  const fullValue = e.target.value;
                  if (fullValue.startsWith(selectedFormPrefix)) {
                    const withoutPrefix = fullValue.substring(selectedFormPrefix.length);
                    const cleanValue = withoutPrefix.startsWith('-') ? withoutPrefix.substring(1) : withoutPrefix;
                    const value = cleanValue.replace(/\D/g, '');
                    let formatted = '';
                    if (value.length > 0) {
                      if (value.length <= 3) {
                        formatted = value;
                      } else if (value.length <= 5) {
                        formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
                      } else {
                        formatted = `${value.slice(0, 3)}-${value.slice(3, 5)}-${value.slice(5, 7)}`;
                      }
                    }
                    setFormData({...formData, phoneNumber: formatted});
                  } else {
                    const value = fullValue.replace(/\D/g, '');
                    let formatted = '';
                    if (value.length > 0) {
                      if (value.length <= 3) {
                        formatted = value;
                      } else if (value.length <= 5) {
                        formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
                      } else {
                        formatted = `${value.slice(0, 3)}-${value.slice(3, 5)}-${value.slice(5, 7)}`;
                      }
                    }
                    setFormData({...formData, phoneNumber: formatted});
                  }
                }}
                placeholder={selectedFormPrefix ? `${selectedFormPrefix}-267-63-66` : "Əvvəlcə prefiks seçin"}
                className={`${styles.formInput} ${!selectedFormPrefix ? styles.inputDisabled : ''}`}
                disabled={!selectedFormPrefix}
                maxLength={15}
                required
                minLength={7}
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <DollarSign size={16} />
              Qiymət
            </label>
            <div className={styles.inputContainer}>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
                    setFormData({...formData, price: value});
                  }
                }}
                placeholder="50"
                className={styles.formInput}
                required
                min="1"
                step="1"
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <User size={16} />
              Əlaqə Nömrəsi
            </label>
            <div className={styles.inputContainer}>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  let formatted = '';
                  if (value.length > 0) {
                    if (value.length <= 3) {
                      formatted = value;
                    } else if (value.length <= 6) {
                      formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
                    } else if (value.length <= 8) {
                      formatted = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
                    } else {
                      formatted = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 8)}-${value.slice(8, 10)}`;
                    }
                  }
                  setFormData({...formData, contactPhone: formatted});
                }}
                placeholder="050-266-63-66"
                className={styles.formInput}
                maxLength={13}
                required
                minLength={7}
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <Tag size={16} />
              Tip
            </label>
            <div className={styles.typeButtons}>
              {types.map(type => (
                <button
                  key={type}
                  type="button"
                  className={`${styles.typeButton} ${formData.type === type ? styles.typeButtonActive : ''}`}
                  onClick={() => setFormData({...formData, type: type as 'standard' | 'gold' | 'premium'})}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <FileText size={16} />
              Açıqlama (istəyə bağlı)
            </label>
            <div className={styles.inputContainer}>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Nömrə haqqında əlavə məlumat..."
                className={`${styles.formInput} ${styles.textareaInput}`}
                rows={3}
              />
            </div>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}
          
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Ləğv et
            </button>
            <button type="submit" className={styles.submitButton}>
              {showAddModal ? 'Əlavə et' : 'Yenilə'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



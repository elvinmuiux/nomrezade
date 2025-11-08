'use client';

import React, { useEffect, useState } from 'react';
import { X, Phone, DollarSign, User, Tag, FileText, Plus } from 'lucide-react';
import styles from './AddEditNumberModal.module.css';

interface FormData {
  phoneNumber: string;
  price: string;
  contactPhone: string;
  type: 'standard' | 'gold' | 'premium';
  description: string;
  isSeller: boolean;
  phoneNumbers?: string[]; // Array for multiple numbers
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
  // Local state for multiple phone numbers
  const [phoneNumbersList, setPhoneNumbersList] = useState<string[]>([]);
  const [currentPhoneInput, setCurrentPhoneInput] = useState('');

  // When opening the "Yeni Elan Əlavə Et" modal, lock the contact phone
  // to the corporate support number and disable editing of the contact
  // phone and description fields per request. We only apply this for
  // the add-new modal so edit flow remains editable.
  useEffect(() => {
    if (showAddModal) {
      const fixedContact = '050-444-44-22';
      if (formData.contactPhone !== fixedContact) {
        setFormData({ ...formData, contactPhone: fixedContact, phoneNumbers: [] });
      }
      // Reset the list when opening
      setPhoneNumbersList([]);
      setCurrentPhoneInput('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAddModal]);

  if (!showAddModal && !showEditModal) return null;
  
  // Helper: format digits into the listing phone field (used after prefix)
  const formatListingPhone = (digits: string) => {
    const value = digits.replace(/\D/g, '');
    if (!value) return '';
    if (value.length <= 3) return value;
    if (value.length <= 5) return `${value.slice(0, 3)}-${value.slice(3)}`;
    return `${value.slice(0, 3)}-${value.slice(3, 5)}-${value.slice(5, 7)}`;
  };

  // Helper: format contact phone (supports longer grouping)
  const formatContactPhone = (digits: string) => {
    const value = digits.replace(/\D/g, '');
    if (!value) return '';
    if (value.length <= 3) return value;
    if (value.length <= 6) return `${value.slice(0, 3)}-${value.slice(3)}`;
    if (value.length <= 8) return `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
    return `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 8)}-${value.slice(8, 10)}`;
  };

  // Add phone number to the list when Enter is pressed
  const handleAddPhoneToList = () => {
    if (!selectedFormPrefix || !currentPhoneInput.trim()) {
      return;
    }
    
    const formatted = formatListingPhone(currentPhoneInput);
    if (formatted && /^\d{3}-\d{2}-\d{2}$/.test(formatted)) {
      const fullNumber = `${selectedFormPrefix}-${formatted}`;
      if (!phoneNumbersList.includes(fullNumber)) {
        setPhoneNumbersList([...phoneNumbersList, fullNumber]);
        setCurrentPhoneInput('');
      }
    }
  };

  // Handle Enter key press
  const handlePhoneInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddPhoneToList();
    }
  };

  // Remove phone number from list
  const handleRemovePhoneFromList = (index: number) => {
    setPhoneNumbersList(phoneNumbersList.filter((_, i) => i !== index));
  };

  // Handle form submission with multiple numbers
  const handleMultiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If we have multiple numbers in the list, update formData with them
    if (showAddModal && phoneNumbersList.length > 0) {
      setFormData({ ...formData, phoneNumbers: phoneNumbersList });
    }
    
    onSubmit(e);
  };

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
          <button onClick={onClose} className={styles.closeButton} aria-label="Bağla" title="Bağla">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleMultiSubmit} className={styles.modalForm}>
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
                    setCurrentPhoneInput('');
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
              {showAddModal ? 'Nömrələr (Enter ilə əlavə edin)' : 'Nömrə'}
            </label>
            <div className={styles.inputContainer}>
              <input
                type="text"
                value={showAddModal 
                  ? (selectedFormPrefix ? `${selectedFormPrefix}-${currentPhoneInput}` : '')
                  : (selectedFormPrefix ? `${selectedFormPrefix}-${formData.phoneNumber}` : '')
                }
                onChange={(e) => {
                  if (!selectedFormPrefix) return;
                  const fullValue = e.target.value;
                  let cleanValue = '';
                  
                  if (fullValue.startsWith(selectedFormPrefix)) {
                    const withoutPrefix = fullValue.substring(selectedFormPrefix.length);
                    cleanValue = withoutPrefix.startsWith('-') ? withoutPrefix.substring(1) : withoutPrefix;
                  } else {
                    cleanValue = fullValue.replace(/\D/g, '');
                  }
                  
                  const formatted = formatListingPhone(cleanValue);
                  
                  if (showAddModal) {
                    setCurrentPhoneInput(formatted);
                  } else {
                    setFormData({ ...formData, phoneNumber: formatted });
                  }
                }}
                onKeyDown={showAddModal ? handlePhoneInputKeyDown : undefined}
                placeholder={selectedFormPrefix ? `${selectedFormPrefix}-267-63-66` : "Əvvəlcə prefiks seçin"}
                className={`${styles.formInput} ${!selectedFormPrefix ? styles.inputDisabled : ''}`}
                disabled={!selectedFormPrefix}
                maxLength={15}
                required={!showAddModal || phoneNumbersList.length === 0}
                minLength={7}
              />
              {showAddModal && selectedFormPrefix && (
                <button
                  type="button"
                  onClick={handleAddPhoneToList}
                  className={styles.addPhoneButton}
                  title="Nömrə əlavə et"
                >
                  <Plus size={18} />
                </button>
              )}
            </div>
            
            {/* Display list of added phone numbers */}
            {showAddModal && phoneNumbersList.length > 0 && (
              <div className={styles.phoneNumbersList}>
                <div className={styles.phoneNumbersListHeader}>
                  <span>Əlavə ediləcək nömrələr ({phoneNumbersList.length})</span>
                </div>
                <div className={styles.phoneNumbersListItems}>
                  {phoneNumbersList.map((phone, index) => (
                    <div key={index} className={styles.phoneNumberItem}>
                      <span className={styles.phoneNumberText}>({phone})</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePhoneFromList(index)}
                        className={styles.removePhoneButton}
                        title="Sil"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                  // If we're in add-new mode the contact is locked and should not change
                  if (showAddModal) return;
                  const value = e.target.value.replace(/\D/g, '');
                  const formatted = formatContactPhone(value);
                  setFormData({ ...formData, contactPhone: formatted });
                }}
                placeholder="050-266-63-66"
                className={styles.formInput}
                maxLength={13}
                required
                minLength={7}
                disabled={showAddModal}
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
                onChange={(e) => {
                  if (showAddModal) return; // block editing in add-new modal
                  setFormData({...formData, description: e.target.value});
                }}
                placeholder={showAddModal ? 'Açıqlama hazırda deaktivdir' : 'Nömrə haqqında əlavə məlumat...'}
                className={`${styles.formInput} ${styles.textareaInput}`}
                rows={3}
                disabled={showAddModal}
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



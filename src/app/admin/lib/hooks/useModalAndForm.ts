import { useState } from 'react';
import { apiService } from '@/shared/services/ApiService';
import type { PhoneNumber, FormData } from '../types/types';

export const useModalAndForm = (loadPhoneNumbers: () => Promise<void>, setError: (error: string) => void, showToast?: {
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
}) => {
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingNumber, setEditingNumber] = useState<PhoneNumber | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    phoneNumber: '',
    price: '',
    contactPhone: '',
    type: 'standard',
    description: '',
    isSeller: false
  });

  // Prefix selection state
  const [selectedFormPrefix, setSelectedFormPrefix] = useState<string>('');

  const handleAddNewListing = () => {
    setFormData({
      phoneNumber: '',
      price: '',
      contactPhone: '',
      type: 'standard',
      description: '',
      isSeller: false
    });
    setSelectedFormPrefix('');
    setShowAddModal(true);
  };

  const handleEditListing = (number: PhoneNumber) => {
    setEditingNumber(number);
    
    // Extract prefix from phone number (e.g., "(050)-255-33-22" -> "050")
    const prefixMatch = number.phoneNumber.match(/\((\d+)\)/);
    const prefix = prefixMatch ? prefixMatch[1] : '';
    
    // Extract phone number without prefix (e.g., "(050)-255-33-22" -> "255-33-22")
    const phoneNumberWithoutPrefix = number.phoneNumber.replace(/^\(\d+\)-/, '');
    
    setFormData({
      phoneNumber: phoneNumberWithoutPrefix,
      price: number.price.toString(),
      contactPhone: number.contactPhone || '',
      type: number.type,
      description: number.description || '',
      isSeller: number.isSeller || false
    });
    setSelectedFormPrefix(prefix);
    setShowEditModal(true);
  };

  const handleDeleteListing = async (id: string) => {
    setLoading(true);

    try {
      // Delete phone number using centralized API service
      const result = await apiService.deletePhoneNumber(id);

      if (result.success) {
        // Force cache invalidation
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => registration.update());
          });
        }
        showToast?.showSuccess('Nömrə silindi', 'Nömrə uğurla silindi!');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await loadPhoneNumbers();
      } else {
        console.error('API Error:', result.error);
        setError(result.error || 'Nömrə silinərkən xəta baş verdi');
      }
    } catch (error) {
      console.error('Error deleting number:', error);
      setError('Nömrə silinərkən xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingNumber(null);
    setFormData({
      phoneNumber: '',
      price: '',
      contactPhone: '',
      type: 'standard',
      description: '',
      isSeller: false
    });
    setSelectedFormPrefix('');
    setError('');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (showAddModal) {
      // Comprehensive form validation for add
      const errors: string[] = [];
      
      if (!selectedFormPrefix) {
        errors.push('Operator seçin');
      }
      
      if (!formData.phoneNumber.trim()) {
        errors.push('Telefon nömrəsi daxil edin');
      } else if (!/^\d{3}-\d{2}-\d{2}$/.test(formData.phoneNumber.trim())) {
        errors.push('Telefon nömrəsi formatı: 255-33-22');
      }
      
      if (!formData.price.trim()) {
        errors.push('Qiymət daxil edin');
      } else if (isNaN(parseInt(formData.price)) || parseInt(formData.price) <= 0) {
        errors.push('Qiymət rəqəm olmalıdır və 0-dan böyük olmalıdır');
      }
      
      if (!formData.contactPhone.trim()) {
        errors.push('Əlaqə telefonu daxil edin');
      }
      
      if (errors.length > 0) {
        setError(errors.join(', '));
        setLoading(false);
        return;
      }

      // Create formatted phone number: (050)-255-33-22
      const fullPhoneNumber = `(${selectedFormPrefix})-${formData.phoneNumber}`;
      
      // Debug log the data being sent
      const requestData = {
        phoneNumber: fullPhoneNumber,
        price: parseInt(formData.price),
        contactPhone: formData.contactPhone,
        type: formData.type,
        description: formData.description || '',
        isSeller: formData.isSeller || false
      };
      
      console.log('Sending request data:', requestData);
      
      // Add new number via centralized API service
      const result = await apiService.createPhoneNumber(requestData);
      console.log('API Response:', result);
      
      if (result.success) {
        // Clear form data
        setFormData({
          phoneNumber: '',
          price: '',
          contactPhone: '',
          type: 'standard',
          description: '',
          isSeller: false
        });
        setSelectedFormPrefix('');
        
        // Success feedback to user
        showToast?.showSuccess('Nömrə əlavə edildi', 'Yeni nömrə uğurla əlavə edildi!');
        
        // Wait a moment for server-side updates to propagate
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Reload phone numbers to show the new addition
        await loadPhoneNumbers();
        setShowAddModal(false);
        setError('');
      } else {
        console.error('API Error:', result.error);
        setError(result.error || 'Nömrə əlavə edilərkən xəta baş verdi');
      }
    } else if (showEditModal && editingNumber) {
      // Comprehensive form validation for edit
      const errors: string[] = [];
      
      if (!selectedFormPrefix) {
        errors.push('Operator seçin');
      }
      
      if (!formData.phoneNumber.trim()) {
        errors.push('Telefon nömrəsi daxil edin');
      } else if (!/^\d{3}-\d{2}-\d{2}$/.test(formData.phoneNumber.trim())) {
        errors.push('Telefon nömrəsi formatı: 255-33-22');
      }
      
      if (!formData.price.trim()) {
        errors.push('Qiymət daxil edin');
      } else if (isNaN(parseInt(formData.price)) || parseInt(formData.price) <= 0) {
        errors.push('Qiymət rəqəm olmalıdır və 0-dan böyük olmalıdır');
      }
      
      if (!formData.contactPhone.trim()) {
        errors.push('Əlaqə telefonu daxil edin');
      }
      
      if (errors.length > 0) {
        setError(errors.join(', '));
        setLoading(false);
        return;
      }

      const fullPhoneNumber = `(${selectedFormPrefix})-${formData.phoneNumber}`;

      // Update existing number via centralized API service
      const result = await apiService.updatePhoneNumber({
        id: editingNumber.id,
        phoneNumber: fullPhoneNumber,
        price: parseInt(formData.price),
        contactPhone: formData.contactPhone,
        type: formData.type,
        description: formData.description || '',
        isSeller: formData.isSeller || false
      });

      if (result.success) {
        // Clear form data
        setFormData({
          phoneNumber: '',
          price: '',
          contactPhone: '',
          type: 'standard',
          description: '',
          isSeller: false
        });
        setSelectedFormPrefix('');
        
        // Success feedback to user
        showToast?.showSuccess('Nömrə yeniləndi', 'Nömrə məlumatları uğurla yeniləndi!');
        
        // Wait a moment for server-side updates to propagate
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Reload phone numbers to show the updated data
        await loadPhoneNumbers();
        setShowEditModal(false);
        setEditingNumber(null);
        setError('');
      } else {
        console.error('API Error:', result.error);
        setError(result.error || 'Nömrə yenilənərkən xəta baş verdi');
      }
    }
    setLoading(false);
  };

  return {
    // Modal states
    showAddModal,
    showEditModal,
    editingNumber,
    loading,
    
    // Form states
    formData,
    setFormData,
    selectedFormPrefix,
    setSelectedFormPrefix,
    
    // Actions
    handleAddNewListing,
    handleEditListing,
    handleDeleteListing,
    handleFormSubmit,
    closeModal
  };
};
'use client';

import { useCallback, useMemo } from 'react';
import styles from './AdminPanel.module.css';

// Import components
import AdminLogin from './components/AdminLogin/AdminLogin';
import AdminHeader from './components/AdminHeader/AdminHeader';
import SearchAndFilter from '@/components/ui/SearchAndFilter/SearchAndFilter';
import AdminStatistics from './components/AdminStatistics/AdminStatistics';
import NumbersList from './components/NumbersList/NumbersList';
import AddEditNumberModal from './components/AddEditNumberModal/AddEditNumberModal';
import { ToastProvider, useToast } from './components/Toast/ToastContainer';
import { SearchFilterProvider } from '@/shared/contexts/SearchFilterContext';

// Import hooks
import { usePhoneNumberData } from './lib/hooks/usePhoneNumberData';
import { useModalAndForm } from './lib/hooks/useModalAndForm';
import { usePhoneNumberFilter } from './lib/hooks/usePhoneNumberFilter';
import { useAdminSession } from './lib/hooks/useAdminSession';

function AdminPanelContent() {
  const { isAuthenticated, user, logout, isLoading, forceUpdate } = useAdminSession();
  const toast = useToast();

  console.log('🔍 AdminPanelContent render:', { isAuthenticated, user, isLoading, forceUpdate });

  // Memoized constants
  const prefixes = useMemo(() => ['010', '050', '051', '055', '060', '070', '077', '099'], []);
  const types = useMemo(() => ['standard', 'premium', 'gold'], []);

  // Use custom hooks
  const { phoneNumbers, loading, loadPhoneNumbers } = usePhoneNumberData();
  
  // Use admin phone number filter hook
  const {
    filteredNumbers,
    searchTerm
  } = usePhoneNumberFilter(phoneNumbers);

  const {
    showAddModal,
    showEditModal,
    loading: modalLoading,
    formData,
    setFormData,
    selectedFormPrefix,
    setSelectedFormPrefix,
    handleAddNewListing,
    handleEditListing,
    handleDeleteListing,
    handleFormSubmit,
    closeModal
  } = useModalAndForm(loadPhoneNumbers, () => {}, toast);

  // Memoized login success handler
  const handleLoginSuccess = useCallback(() => {
    console.log('🔍 handleLoginSuccess called');
    // Session is automatically saved by login function
    // Phone numbers will auto-load via useEffect in usePhoneNumberData
  }, []);

  // Memoized logout handler
  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  // Memoized delete handler
  const handleDelete = useCallback((id: string) => {
    handleDeleteListing(id);
  }, [handleDeleteListing]);

  // Show loading spinner while checking session
  if (isLoading) {
    return (
      <div className={styles.adminContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Yüklənir...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className={styles.adminContainer}>
      <AdminHeader 
        onAddNew={handleAddNewListing}
        onLogout={handleLogout}
        user={user}
      />

      <div>
        <SearchAndFilter
          showPrefixFilter={true}
          showTypeFilter={true}
        />

        <AdminStatistics filteredNumbers={filteredNumbers} loading={loading} />

        <NumbersList
          filteredNumbers={filteredNumbers}
          loading={loading || modalLoading}
          searchTerm={searchTerm}
          onEdit={handleEditListing}
          onDelete={handleDelete}
        />
      </div>

      <AddEditNumberModal
        showAddModal={showAddModal}
        showEditModal={showEditModal}
        formData={formData}
        setFormData={setFormData}
        selectedFormPrefix={selectedFormPrefix}
        setSelectedFormPrefix={setSelectedFormPrefix}
        prefixes={prefixes}
        types={types}
        onSubmit={handleFormSubmit}
        onClose={closeModal}
        error=""
      />
    </div>
  );
}

export default function AdminPanel() {
  return (
    <ToastProvider>
      <SearchFilterProvider>
        <AdminPanelContent />
      </SearchFilterProvider>
    </ToastProvider>
  );
}

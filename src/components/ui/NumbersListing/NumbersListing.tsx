/**
 * NumbersListing Modular Component
 * Main component with internal sub-components and hooks
 */

'use client';

import React, { useState } from 'react';
import { MessageCircle, ShoppingBasket, ChevronLeft, ChevronRight, X, RefreshCw, Filter } from 'lucide-react';
import { useStatistics } from '@/shared/hooks/useStatistics';
import { useDataProvider, type PhoneAd } from '@/components/common/DataProvider';
import { usePhoneNumberFilter } from '@/shared/hooks/usePhoneNumberFilter';
import { useSearchFilter } from '@/shared/contexts/SearchFilterContext';
import { formatPriceSimple } from '@/shared/utils/format';
import { highlightNumber } from '@/shared/utils/highlightNumber';
import styles from './NumbersListing.module.css';
import Image from 'next/image';

// ===== Types =====
export interface NumbersListingProps {
  pageTitle: string;
  operatorPrefixes?: string[];
  operatorName?: string;
  // Search props
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  selectedPrefix?: string;
  setSelectedPrefix?: (prefix: string) => void;
  filteredNumbers?: PhoneAd[];
  // Optional node to render on the right side of the header (e.g., back button)
  headerRight?: React.ReactNode;
}

interface ModalState {
  isOpen: boolean;
  phoneNumber: string;
  contactPhone: string;
}

interface PaginationConfig {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

interface EmptyStateProps {
  searchTerm: string;
  selectedPrefix: string;
  selectedType: string;
  onClearFilters: () => void;
  onRefresh: () => void;
}

// ===== Utils =====
const getOperatorLogo = (provider: string): string => {
  // Normalize provider name to match logo mapping
  const normalizedProvider = provider
    .replace(/_/g, ' ')  // Replace underscores with spaces
    .toLowerCase()       // Convert to lowercase first
    .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize first letter of each word
    .replace('Nar Mobile', 'Nar-Mobile'); // Special case for Nar-Mobile
  
  const logoMap: { [key: string]: string } = {
    'Azercell': '/images/operators/azercell.svg',
    'Bakcell': '/images/operators/bakcell.svg',
    'Nar-Mobile': '/images/operators/nar-mobile.svg',
    'Naxtel': '/images/operators/naxtel.svg'
  };
  
  const logo = logoMap[normalizedProvider];
  
  console.log(`🔍 Operator Debug:`);
  console.log(`  Original Provider: "${provider}"`);
  console.log(`  Normalized Provider: "${normalizedProvider}"`);
  console.log(`  Found Logo: "${logo}"`);
  console.log(`  Available Keys:`, Object.keys(logoMap));
  console.log(`  Match Found: ${!!logo}`);
  
  if (!logo) {
    console.warn(`⚠️ No logo found for provider: "${provider}" -> "${normalizedProvider}"`);
  }
  
  return logo || '/images/operators/azercell.svg';
};

const getPaginationPages = (currentPage: number, totalPages?: number): (number | string)[] => {
  const pages: (number | string)[] = [];
  const showPages = 5;
  
  if (!totalPages) return [1];
  
  if (totalPages <= showPages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    
    if (currentPage <= 3) {
      for (let i = 2; i <= Math.min(4, totalPages - 1); i++) {
        pages.push(i);
      }
      if (totalPages > 4) {
        pages.push('...');
      }
    } else if (currentPage >= totalPages - 2) {
      if (totalPages > 4) {
        pages.push('...');
      }
      for (let i = Math.max(totalPages - 3, 2); i <= totalPages - 1; i++) {
        pages.push(i);
      }
    } else {
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
    }
    
    if (totalPages > 1) {
      pages.push(totalPages);
    }
  }
  
  return pages;
};

// ===== Sub-Components =====

// Modal Component
const Modal: React.FC<{
  isOpen: boolean;
  phoneNumber: string;
  contactPhone: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isOpen, phoneNumber, contactPhone, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Sifariş Təsdiqi</h3>
          <button
            className={styles.modalCloseButton}
            onClick={onCancel}
            aria-label="Bağla"
          >
            <X size={20} />
          </button>
        </div>
        <div className={styles.modalBody}>
          <p className={styles.modalText}>
            <strong>{phoneNumber}</strong> nömrəsini sifariş etmək istədiyinizə?
          </p>
          <p className={styles.modalSubText}>
            İndi zəng edin! <strong>{contactPhone}</strong>
          </p>
        </div>
        <div className={styles.modalActions}>
          <button 
            className={styles.modalCancelButton}
            onClick={onCancel}
          >
            Ləğv et
          </button>
          <button 
            className={styles.modalConfirmButton}
            onClick={onConfirm}
          >
            Zəng edin
          </button>
        </div>
      </div>
    </div>
  );
};

// Pagination Component
const Pagination: React.FC<PaginationConfig> = ({
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  if (totalPages <= 1) return null;

  const pages = getPaginationPages(currentPage, totalPages);

  return (
    <div className={styles.pagination}>
      <button 
        className={styles.paginationButton}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Əvvəlki səhifə"
      >
        <ChevronLeft size={16} />
      </button>
      
      <div className={styles.pageNumbers}>
        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                ...
              </span>
            );
          }
          
          return (
            <button
              key={page}
              className={`${styles.pageButton} ${currentPage === page ? styles.activePage : ''}`}
              onClick={() => onPageChange(page as number)}
              aria-label={`Səhifə ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>
      
      <button 
        className={styles.paginationButton}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Növbəti səhifə"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

// Empty State Component
const EmptyState: React.FC<EmptyStateProps> = ({
  searchTerm,
  selectedPrefix,
  selectedType,
  onClearFilters,
  onRefresh,
}) => {
  const hasActiveFilters = searchTerm || selectedPrefix || selectedType;

  return (
    <div className={styles.emptyState}>
      {hasActiveFilters ? (
        <>
          <div className={styles.emptyIcon}>
            <Filter size={48} color="var(--color-primary)" />
          </div>
          <p className={styles.emptyTitle}>Axtarışa uyğun nömrə tapılmadı</p>
          <p className={styles.emptySubtitle}>
            Başqa açar sözlərlə axtarışı yenidən cəhd edin və ya filtrləri təmizləyin.
          </p>
          <button 
            onClick={onClearFilters} 
            className={styles.clearFiltersButton}
          >
            <X size={18} />
            Filtrləri təmizlə
          </button>
        </>
      ) : (
        <>
          <div className={styles.emptyIcon}>
            <ShoppingBasket size={48} color="var(--color-primary)" />
          </div>
          <p className={styles.emptyTitle}>Hal-hazırda nömrə mövcud deyil</p>
          <p className={styles.emptySubtitle}>
            Bu operator üçün hal-hazırda nömrə mövcud deyil. 
            Yeni nömrələr üçün səhifəni yeniləyin və ya digər operatorları yoxlayın.
          </p>
          <button 
            onClick={onRefresh} 
            className={styles.clearFiltersButton}
          >
            <RefreshCw size={18} />
            Səhifəni yenilə
          </button>
        </>
      )}
    </div>
  );
};

// Desktop Layout Component
const DesktopLayout: React.FC<{
  numbers: PhoneAd[];
  loading: boolean;
  modalState: ModalState;
  onWhatsAppContact: (phoneNumber: string, contactPhone: string) => void;
  onOrderNumber: (phoneNumber: string, contactPhone: string) => void;
  onModalCancel: () => void;
  onModalConfirm: () => void;
  searchTerm: string;
}> = ({
  numbers,
  loading,
  modalState,
  onWhatsAppContact,
  onOrderNumber,
  onModalCancel,
  onModalConfirm,
  searchTerm,
}) => {
  if (loading) {
    return (
      <div className={styles.desktopList}>
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className={styles.skeletonListItem}>
            <div className={styles.skeletonCellNumber}>
              <div className={styles.skeletonOperatorLogo}></div>
              <div className={styles.skeletonPhoneNumber}></div>
            </div>
            <div className={styles.skeletonCellProvider}>
              <div className={styles.skeletonProvider}></div>
            </div>
            <div className={styles.skeletonCellType}>
              <div className={styles.skeletonTypeTag}></div>
            </div>
            <div className={styles.skeletonCellPrice}>
              <div className={styles.skeletonPriceIcon}></div>
              <div className={styles.skeletonPrice}></div>
            </div>
            <div className={styles.skeletonCellActions}>
              <div className={styles.skeletonFavoriteButton}></div>
              <div className={styles.skeletonActionButton}></div>
              <div className={styles.skeletonOrderButton}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Desktop List View */}
      <div className={styles.desktopList}>
        {numbers.map((ad) => (
          <div key={ad.id} className={styles.listItem}>
            <div className={styles.cellNumber}>
              <Image
                src={getOperatorLogo(ad.provider || '')}
                alt={`${ad.provider || 'Unknown'} operator logo`}
                className={styles.operatorLogo}
                width={30}
                height={20}
              />
              <span className={styles.phoneNumber}>
                {highlightNumber(ad.phoneNumber, searchTerm).parts.map((part, index) => (
                  <span
                    key={index}
                    className={part.isHighlighted ? styles.phoneNumberHighlight : undefined}
                  >
                    {part.text}
                  </span>
                ))}
              </span>
            </div>
            <div className={styles.cellProvider}>
              <span className={styles.provider}>{ad.provider || 'Unknown'}</span>
            </div>
            <div className={styles.cellType}>
              <span className={`${styles.typeTag} ${styles[ad.type]}`}>
                {ad.type}
              </span>
            </div>
            <div className={styles.cellPrice}>
              <span className={styles.price}>
                <span className={styles.priceAmount}>{formatPriceSimple(ad.price)}</span>
                <span className={styles.priceSymbol}>₼</span>
              </span>
            </div>
            <div className={styles.cellActions}>
              <button 
                className={styles.actionButton} 
                onClick={() => onWhatsAppContact(ad.phoneNumber, ad.contactPhone || "0504444422")} 
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <MessageCircle size={18} />
              </button>
              <button 
                onClick={() => onOrderNumber(ad.phoneNumber, ad.contactPhone || '050-444-44-22')} 
                className={styles.orderButtonInline} 
                aria-label="Sifariş"
                title="Sifariş"
              >
                Sifariş
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalState.isOpen}
        phoneNumber={modalState.phoneNumber}
        contactPhone={modalState.contactPhone}
        onConfirm={onModalConfirm}
        onCancel={onModalCancel}
      />
    </>
  );
};

// Mobile Layout Component
const MobileLayout: React.FC<{
  numbers: PhoneAd[];
  loading: boolean;
  modalState: ModalState;
  onWhatsAppContact: (phoneNumber: string, contactPhone: string) => void;
  onOrderNumber: (phoneNumber: string, contactPhone: string) => void;
  onModalCancel: () => void;
  onModalConfirm: () => void;
  searchTerm: string;
}> = ({
  numbers,
  loading,
  modalState,
  onWhatsAppContact,
  onOrderNumber,
  onModalCancel,
  onModalConfirm,
  searchTerm,
}) => {
  if (loading) {
    return (
      <div className={styles.mobileList}>
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className={styles.skeletonMobileCard}>
            <div className={styles.skeletonMobileCardContent}>
              <div className={styles.skeletonMobileTopRow}>
                <div className={styles.skeletonMobileLeftSection}>
                  <div className={styles.skeletonMobileOperatorLogo}></div>
                  <div className={styles.skeletonMobilePhoneNumber}></div>
                </div>
                <div className={styles.skeletonMobileRightSection}>
                  <div className={styles.skeletonMobileTypeTag}></div>
                </div>
              </div>
              <div className={styles.skeletonMobileBottomRow}>
                <div className={styles.skeletonMobilePriceSection}>
                  <div className={styles.skeletonMobilePriceIcon}></div>
                  <div className={styles.skeletonMobilePrice}></div>
                </div>
                <div className={styles.skeletonMobileActions}>
                  <div className={styles.skeletonMobileActionButton}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className={styles.mobileList}>
        {numbers.map((ad) => (
          <div key={ad.id} className={styles.mobileCard}>
            <div className={styles.mobileCardContent}>
              <div className={styles.mobileTopRow}>
                <div className={styles.mobileLeftSection}>
                  <Image
                    src={getOperatorLogo(ad.provider || '')}
                    alt={`${ad.provider || 'Unknown'} operator logo`}
                    className={styles.mobileOperatorLogo}
                    width={20}
                    height={15}
                  />
                  <span className={styles.mobilePhoneNumber}>
                {highlightNumber(ad.phoneNumber, searchTerm).parts.map((part, index) => (
                  <span
                    key={index}
                    className={part.isHighlighted ? styles.phoneNumberHighlight : undefined}
                  >
                    {part.text}
                  </span>
                ))}
              </span>
                </div>
                <div className={styles.mobileCenterSection}>
                  <span className={styles.mobileProvider}>{ad.provider || 'Unknown'}</span>
                </div>
                <div className={styles.mobileRightSection}>
                  <span className={`${styles.mobileTypeTag} ${styles[ad.type]}`}>
                    {ad.type}
                  </span>
                </div>
              </div>
              <div className={styles.mobileBottomRow}>
                <div className={styles.mobilePriceSection}>
                  <ShoppingBasket className={styles.mobilePriceIcon} size={16} />
                  <span className={styles.mobilePriceText}>
                    <span className={styles.priceAmount}>{formatPriceSimple(ad.price)}</span>
                    <span className={styles.priceSymbol}>₼</span>
                  </span>
                </div>
                <div className={styles.mobileActions}>
                  <div className={styles.mobileActionButton} onClick={() => onWhatsAppContact(ad.phoneNumber, ad.contactPhone || "0504444422")}>
                    <MessageCircle size={16} />
                  </div>
                  <div className={styles.mobileOrderButton} onClick={() => onOrderNumber(ad.phoneNumber, ad.contactPhone || '050-444-44-22')}>
                    Sifariş
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalState.isOpen}
        phoneNumber={modalState.phoneNumber}
        contactPhone={modalState.contactPhone}
        onConfirm={onModalConfirm}
        onCancel={onModalCancel}
      />
    </>
  );
};

// ===== Main Component =====
export default function NumbersListing({
  pageTitle,
  operatorPrefixes,
  operatorName,
  searchTerm: propSearchTerm,
  setSearchTerm: propSetSearchTerm,
  selectedPrefix: propSelectedPrefix,
  setSelectedPrefix: propSetSelectedPrefix,
  filteredNumbers: propFilteredNumbers,
  headerRight,
}: NumbersListingProps) {
  const { phoneNumbers, loading: isLoading } = useDataProvider();
  const { incrementSold } = useStatistics();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 14;
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');
  const [selectedContactPhone, setSelectedContactPhone] = useState('');
  
  // Use context for search and filter state
  const {
    searchTerm: contextSearchTerm,
    setSearchTerm: contextSetSearchTerm,
    selectedPrefix: contextSelectedPrefix,
    setSelectedPrefix: contextSetSelectedPrefix,
    selectedType: contextSelectedType,
    setSelectedType: contextSetSelectedType,
  } = useSearchFilter();

  // Use props if provided, otherwise use context state
  const finalSearchTerm = propSearchTerm !== undefined ? propSearchTerm : contextSearchTerm;
  const finalSetSearchTerm = propSetSearchTerm || contextSetSearchTerm;
  const finalSelectedPrefix = propSelectedPrefix !== undefined ? propSelectedPrefix : contextSelectedPrefix;
  const finalSetSelectedPrefix = propSetSelectedPrefix || contextSetSelectedPrefix;
  const finalSelectedType = contextSelectedType;
  const finalSetSelectedType = contextSetSelectedType;

  // Use phone number filter book with context values
  const {
    filteredNumbers,
  } = usePhoneNumberFilter(phoneNumbers, operatorPrefixes, {
    searchTerm: finalSearchTerm,
    selectedPrefix: finalSelectedPrefix,
    selectedType: finalSelectedType,
    operatorName: operatorName,
  });

  const finalFilteredNumbers = propFilteredNumbers || filteredNumbers;

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNumbers = finalFilteredNumbers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [finalSearchTerm, finalSelectedPrefix]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderNumber = (phoneNumber: string, contactPhone: string) => {
    setSelectedPhoneNumber(phoneNumber);
    setSelectedContactPhone(contactPhone);
    setIsModalOpen(true);
  };

  const handleModalConfirm = () => {
    // Increment sold numbers statistics
    incrementSold();
    
    // Clean and format contact phone for calling
    const digitsOnly = selectedContactPhone.replace(/[^0-9]/g, '');

    // Normalize: remove leading 0 or existing country code (994) so we don't duplicate
    let normalized = digitsOnly;
    if (normalized.startsWith('0')) {
      normalized = normalized.slice(1);
    } else if (normalized.startsWith('994')) {
      normalized = normalized.slice(3);
    }

    // Close modal and make call using +994<rest>
    setIsModalOpen(false);
    window.location.href = `tel:+994${normalized}`;
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleWhatsAppContact = (phoneNumber: string, contactPhone: string) => {
    const message = encodeURIComponent(`Salam! ${phoneNumber} nömrəsi barədə məlumat almaq istərdim.`);

    // Sanitize contact phone similar to call behaviour
    let waDigits = contactPhone.replace(/[^0-9]/g, '');
    if (waDigits.startsWith('0')) {
      waDigits = waDigits.slice(1);
    } else if (waDigits.startsWith('994')) {
      waDigits = waDigits.slice(3);
    }

    window.open(`https://wa.me/994${waDigits}?text=${message}`, '_blank');
  };

  // Clear filters handler
  const handleClearFilters = () => {
    finalSetSearchTerm('');
    finalSetSelectedPrefix('');
    finalSetSelectedType('');
    setCurrentPage(1);
  };

  // Refresh handler
  const handleRefresh = () => {
    window.location.reload();
  };

  const modalState: ModalState = {
    isOpen: isModalOpen,
    phoneNumber: selectedPhoneNumber,
    contactPhone: selectedContactPhone,
  };

  const pagination: PaginationConfig = {
    currentPage,
    itemsPerPage,
    totalItems: finalFilteredNumbers.length,
    onPageChange: handlePageChange,
  };

  const emptyState: EmptyStateProps = {
    searchTerm: finalSearchTerm,
    selectedPrefix: finalSelectedPrefix,
    selectedType: finalSelectedType,
    onClearFilters: handleClearFilters,
    onRefresh: handleRefresh,
  };

  return (
    <div className={styles.numbersContainer}>
      {/* Header Section */}
        <div className={styles.header}>
          {operatorName && (
            <Image 
              src={`/images/operators/${operatorName}.svg`} 
              alt={`${operatorName} logo`} 
              className={styles.operatorLogo} 
              width={32} 
              height={32} 
            />
          )}
          
          <div className={styles.statsInfo}>
            {isLoading ? (
              <div className={styles.skeletonTotalCount}></div>
            ) : (
              <span className={styles.totalCount}>
                Cəmi: {finalFilteredNumbers.length} nömrə
              </span>
            )}
          </div>
          <h1 className={styles.title}>{pageTitle}</h1>

          {/* Optional actions rendered on the right side of the header */}
          <div className={styles.headerActions}>
            {/* headerRight is optional and may be undefined */}
            {headerRight}
          </div>
        </div>

      {/* Content Section */}
        <div className={styles.content}>
        {/* Desktop Layout */}
        <DesktopLayout
          numbers={currentNumbers}
          loading={isLoading}
          modalState={modalState}
          onWhatsAppContact={handleWhatsAppContact}
          onOrderNumber={handleOrderNumber}
          onModalCancel={handleModalCancel}
          onModalConfirm={handleModalConfirm}
          searchTerm={finalSearchTerm}
        />

        {/* Mobile Layout */}
        <MobileLayout
          numbers={currentNumbers}
          loading={isLoading}
          modalState={modalState}
          onWhatsAppContact={handleWhatsAppContact}
          onOrderNumber={handleOrderNumber}
          onModalCancel={handleModalCancel}
          onModalConfirm={handleModalConfirm}
          searchTerm={finalSearchTerm}
        />

        {/* Empty State */}
        {finalFilteredNumbers.length === 0 && !isLoading && (
          <EmptyState {...emptyState} />
        )}

        {/* Pagination */}
        <Pagination {...pagination} />
        </div>
    </div>
  );
}
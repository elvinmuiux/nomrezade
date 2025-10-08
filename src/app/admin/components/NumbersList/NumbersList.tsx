'use client';

import React, { useMemo, useCallback, useState } from 'react';
import { Edit, Trash2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPriceSimple } from '@/shared/utils/format';
import Image from 'next/image';
import styles from './NumbersList.module.css';
import type { PhoneNumber } from '../../lib/types/types';
import DeleteModal from '../DeleteModal/DeleteModal';

interface NumbersListProps {
  filteredNumbers: PhoneNumber[];
  loading: boolean;
  searchTerm?: string;
  onEdit: (number: PhoneNumber) => void;
  onDelete: (id: string) => void;
}

interface PaginationConfig {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const NumbersList = React.memo<NumbersListProps>(({ filteredNumbers, loading, searchTerm = '', onEdit, onDelete }) => {
  // Operator logo utility function
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
    
    return logoMap[normalizedProvider] || '/images/operators/azercell.svg';
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    phoneNumber: PhoneNumber | null;
  }>({
    isOpen: false,
    phoneNumber: null
  });

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNumbers = filteredNumbers.slice(startIndex, endIndex);

  // Reset to first page when filteredNumbers change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredNumbers.length]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const getPaginationPages = useCallback((currentPage: number, totalPages: number): (number | string)[] => {
    const pages: (number | string)[] = [];
    const showPages = 5;
    
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
  }, []);

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

  const handleDeleteClick = useCallback((number: PhoneNumber) => {
    setDeleteModal({
      isOpen: true,
      phoneNumber: number
    });
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteModal.phoneNumber) {
      onDelete(deleteModal.phoneNumber.id);
      setDeleteModal({
        isOpen: false,
        phoneNumber: null
      });
    }
  }, [deleteModal.phoneNumber, onDelete]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteModal({
      isOpen: false,
      phoneNumber: null
    });
  }, []);
  const highlightMatch = useCallback((text: string, search: string) => {
    if (!search || search.length < 2) return text;
    const cleanSearch = search.replace(/\D/g, '');
    if (!cleanSearch) return text;
    const cleanText = text.replace(/\D/g, '');
    if (!cleanText.includes(cleanSearch)) return text;
    const matchIndex = cleanText.indexOf(cleanSearch);
    if (matchIndex === -1) return text;
    let result = '';
    let cleanIndex = 0;
    let inHighlight = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (/\d/.test(char)) {
        if (cleanIndex >= matchIndex && cleanIndex < matchIndex + cleanSearch.length) {
          if (!inHighlight) {
            result += `<span class="${styles.highlight}">`;
            inHighlight = true;
          }
          result += char;
          if (cleanIndex === matchIndex + cleanSearch.length - 1) {
            result += '</span>';
            inHighlight = false;
          }
        } else {
          if (inHighlight) {
            result += '</span>';
            inHighlight = false;
          }
          result += char;
        }
        cleanIndex++;
      } else {
        result += char;
      }
    }
    if (inHighlight) {
      result += '</span>';
    }
    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  }, []);

  const desktopListItems = useMemo(() => {
    return currentNumbers.map((number, index) => (
      <div key={`${number.id}-${number.prefix}-${number.type}-${index}`} className={styles.listItem}>
        <div className={styles.listItemContent}>
          <div className={styles.cellNumber}>
            <Image
              src={getOperatorLogo(number.operator || '')}
              alt={`${number.operator || 'Unknown'} operator logo`}
              className={styles.operatorLogo}
              width={24}
              height={24}
            />
            <span className={`${styles.phoneNumber} ${number.isSeller ? styles.sellerNumber : ''}`}>
              {highlightMatch(number.phoneNumber, searchTerm)}
            </span>
          </div>
          <div className={styles.cellProvider}>
            <span className={styles.provider}>{number.operator || 'N/A'}</span>
          </div>
          <div className={styles.cellType}>
            <span className={`${styles.typeTag} ${styles[number.type]}`}>
              {number.type}
            </span>
          </div>
          <div className={styles.cellPrice}>
            <span className={styles.price}>
              <span className={styles.priceAmount}>{formatPriceSimple(number.price)}</span>
              <span className={styles.priceSymbol}>₼</span>
            </span>
          </div>
          <div className={styles.cellContact}>
            <span className={styles.contactPhone}>{number.contactPhone || 'N/A'}</span>
          </div>
          <div className={styles.cellActions}>
            <button onClick={() => onEdit(number)} className={styles.actionButton} title="Redaktə et">
              <Edit size={18} />
            </button>
            <button onClick={() => handleDeleteClick(number)} className={styles.actionButton} title="Sil">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    ));
  }, [currentNumbers, searchTerm, highlightMatch, onEdit, handleDeleteClick]);

  const mobileListItems = useMemo(() => {
    return currentNumbers.map((number, index) => (
      <div key={`${number.id}-${number.prefix}-${number.type}-${index}`} className={styles.mobileCard}>
        <div className={styles.mobileCardContent}>
          <div className={styles.mobileTopRow}>
            <div className={styles.mobileLeftSection}>
              <Image
                src={getOperatorLogo(number.operator || '')}
                alt={`${number.operator || 'Unknown'} operator logo`}
                className={styles.operatorLogo}
                width={20}
                height={20}
              />
              <span className={`${styles.mobilePhoneNumber} ${number.isSeller ? styles.sellerNumber : ''}`}>
                {highlightMatch(number.phoneNumber, searchTerm)}
              </span>
            </div>
            <div className={styles.mobileRightSection}>
              <span className={`${styles.mobileTypeTag} ${styles[number.type]}`}>
                {number.type}
              </span>
            </div>
          </div>
          <div className={styles.mobileBottomRow}>
            <div className={styles.mobilePriceSection}>
              <span className={styles.mobilePrice}>
                <span className={styles.priceAmount}>{formatPriceSimple(number.price)}</span>
                <span className={styles.priceSymbol}>₼</span>
              </span>
              <span className={styles.mobileProvider}>{number.operator || 'N/A'}</span>
            </div>
            <div className={styles.mobileActions}>
              <button onClick={() => onEdit(number)} className={styles.mobileActionButton} title="Redaktə et">
                <Edit size={16} />
              </button>
              <button onClick={() => handleDeleteClick(number)} className={styles.mobileActionButton} title="Sil">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          {number.contactPhone && (
            <div className={styles.mobileContactRow}>
              <span className={styles.mobileContactPhone}>Əlaqə: {number.contactPhone}</span>
            </div>
          )}
        </div>
      </div>
    ));
  }, [currentNumbers, searchTerm, highlightMatch, onEdit, handleDeleteClick]);

  if (loading) {
    return (
      <div className={styles.tableSection}>
        <div className={styles.tableContainer}>
          <div className={styles.desktopList}>
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className={styles.listItem}>
                <div className={styles.listItemContent}>
                  <div className={styles.cellNumber}>
                    <div className={styles.skeletonPhoneNumber}></div>
                  </div>
                  <div className={styles.cellProvider}>
                    <div className={styles.skeletonProvider}></div>
                  </div>
                  <div className={styles.cellType}>
                    <div className={styles.skeletonTypeTag}></div>
                  </div>
                  <div className={styles.cellPrice}>
                    <div className={styles.skeletonPrice}></div>
                  </div>
                  <div className={styles.cellContact}>
                    <div className={styles.skeletonContact}></div>
                  </div>
                  <div className={styles.cellActions}>
                    <div className={styles.skeletonActionButton}></div>
                    <div className={styles.skeletonActionButton}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.mobileList}>
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className={styles.mobileCard}>
                <div className={styles.mobileCardContent}>
                  <div className={styles.mobileTopRow}>
                    <div className={styles.mobileLeftSection}>
                      <div className={styles.skeletonMobilePhoneNumber}></div>
                    </div>
                    <div className={styles.mobileRightSection}>
                      <div className={styles.skeletonMobileTypeTag}></div>
                    </div>
                  </div>
                  <div className={styles.mobileBottomRow}>
                    <div className={styles.mobilePriceSection}>
                      <div className={styles.skeletonMobilePrice}></div>
                      <div className={styles.skeletonMobileProvider}></div>
                    </div>
                    <div className={styles.mobileActions}>
                      <div className={styles.skeletonMobileActionButton}></div>
                      <div className={styles.skeletonMobileActionButton}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (filteredNumbers.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <Filter size={48} color="var(--color-primary)" />
        </div>
        <p className={styles.emptyTitle}>Axtarışa uyğun nömrə tapılmadı</p>
        <p className={styles.emptySubtitle}>
          Başqa açar sözlərlə axtarışı yenidən cəhd edin və ya filtrləri təmizləyin.
        </p>
      </div>
    );
  }

  const pagination: PaginationConfig = {
    currentPage,
    itemsPerPage,
    totalItems: filteredNumbers.length,
    onPageChange: handlePageChange,
  };

  return (
    <>
      <div className={styles.tableSection}>
        <div className={styles.tableContainer}>
          <div className={styles.desktopList}>{desktopListItems}</div>
          <div className={styles.mobileList}>{mobileListItems}</div>
        </div>
      </div>

      <Pagination {...pagination} />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        phoneNumber={deleteModal.phoneNumber ? `${deleteModal.phoneNumber.prefix}${deleteModal.phoneNumber.phoneNumber}` : ''}
        isLoading={loading}
      />
    </>
  );
});

NumbersList.displayName = 'NumbersList';

export default NumbersList;



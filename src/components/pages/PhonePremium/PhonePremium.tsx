'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone } from 'lucide-react';
import Link from 'next/link';
import { StatisticsManager } from '@/shared/lib/statistics';
import { apiService, type PhoneNumber } from '@/shared/services/ApiService';
import SearchAndFilter from '@/components/ui/SearchAndFilter/SearchAndFilter';
import styles from './PhonePremium.module.css';

interface PremiumListing {
  id: string;
  phoneNumber: string;
  price: number;
  contactPhone: string;
  type: string;
  isVip: boolean;
  is_sold?: boolean;
}

const PhonePremium: React.FC = () => {
  const [listings, setListings] = useState<PremiumListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPremiumListings = async () => {
      setLoading(true);
      try {
        console.log('🔍 PhonePremium: Fetching premium listings from MongoDB');
        
        // Use centralized API service to get premium phone numbers
        const result = await apiService.getPhoneNumbersByType('premium', 200);
        
        if (result.success && result.data) {
          // Convert MongoDB data to component format
          const premiumListings: PremiumListing[] = result.data.map((phone: PhoneNumber) => ({
            id: phone.id,
            phoneNumber: phone.phoneNumber,
            price: phone.price,
            contactPhone: phone.contactPhone || '(050) 444-44-22',
            type: phone.type.toLowerCase(),
            isVip: phone.isVip || false,
            is_sold: phone.status === 'SOLD'
          }));
          
          setListings(premiumListings);
          console.log(`✅ PhonePremium: Loaded ${premiumListings.length} premium listings from MongoDB`);
        } else {
          console.error('❌ PhonePremium: Failed to fetch premium listings:', result.error);
          setListings([]);
        }
      } catch (error) {
        console.error('❌ PhonePremium: Error fetching premium listings:', error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPremiumListings();
  }, []);

  const filteredListings = listings;

  const handleContact = (contactNumber: string, phoneNumber: string) => {
    const confirmed = confirm(`${phoneNumber} nömrəsi üçün əlaqə qurmaq istəyirsiniz?\n\nİndi zəng etmək istəyirsinizmi?`);
    if (confirmed) {
      // Increment the sold numbers count
      StatisticsManager.incrementSoldNumbers();
      // Proceed with the call
      window.location.href = `tel:${contactNumber.replace(/[^0-9]/g, '')}`;
    }
  };
  

  return (
    <div className={styles.phonePremiumContainer}>
      <div className={styles.phoneHeader}>
        <Link href="/" className={styles.backButton}>
          <ArrowLeft size={20} />
          <span>Geri</span>
        </Link>
        <h1>
          Premium Nömrələr
          {listings.length > 0 && <span className={styles.listingCount}>({listings.length})</span>}
        </h1>
        <div className={styles.headerPlaceholder}></div>
      </div>

      <SearchAndFilter
        searchPlaceholder="Premium elanlar içində axtar..."
      />

      <div className={styles.phoneListContainer}>
        {loading ? (
          <div className={styles.loadingState}>Yüklənir...</div>
        ) : filteredListings.length > 0 ? (
          <table className={styles.phoneTable}>
            <tbody>
              {filteredListings.map((ad) => (
                <tr key={ad.id}>
                  <td className={styles.phoneNumberCell}>
                    {ad.phoneNumber}
                  </td>
                  <td className={styles.priceCell}>{ad.price} ₼</td>
                  <td className={styles.actionCell}>
                    <button onClick={() => handleContact(ad.contactPhone, ad.phoneNumber)} className={styles.contactButton}>
                      <Phone size={16} />
                      <span>Əlaqə</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.noListingsMessage}>
            Hal-hazırda Premium nömrəsi mövcud deyil
          </div>
        )}
      </div>
    </div>
  );
};

export default PhonePremium;

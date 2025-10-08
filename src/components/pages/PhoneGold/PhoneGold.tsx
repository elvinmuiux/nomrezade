'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, ArrowLeft, Gem } from 'lucide-react';
import { apiService, type PhoneNumber } from '@/shared/services/ApiService';
import SearchAndFilter from '@/components/ui/SearchAndFilter/SearchAndFilter';
import styles from './PhoneGold.module.css';

interface GoldListing {
  id: string;
  phoneNumber: string;
  price: number;
  contactPhone: string;
  type: string;
  isVip?: boolean;
  is_sold?: boolean;
}

export default function PhoneGold() {
  const [listings, setListings] = useState<GoldListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoldListings = async () => {
      setLoading(true);
      try {
        console.log('🔍 PhoneGold: Fetching gold listings from MongoDB');
        
        // Use centralized API service to get gold phone numbers
        const result = await apiService.getPhoneNumbersByType('gold', 200);
        
        if (result.success && result.data) {
          // Convert MongoDB data to component format
          const goldListings: GoldListing[] = result.data.map((phone: PhoneNumber) => ({
            id: phone.id,
            phoneNumber: phone.phoneNumber,
            price: phone.price,
            contactPhone: phone.contactPhone || '(050) 444-44-22',
            type: phone.type.toLowerCase(),
            isVip: phone.isVip || false,
            is_sold: phone.status === 'SOLD'
          }));
          
          setListings(goldListings);
          console.log(`✅ PhoneGold: Loaded ${goldListings.length} gold listings from MongoDB`);
        } else {
          console.error('❌ PhoneGold: Failed to fetch gold listings:', result.error);
          setListings([]);
        }
      } catch (error) {
        console.error('❌ PhoneGold: Error fetching gold listings:', error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGoldListings();
  }, []);

  const handleCall = async (phoneNumber: string) => {
    // Dynamically import the StatisticsManager only on the client-side
    const { StatisticsManager } = await import('@/shared/lib/statistics');
    // Increment the sold numbers count
    StatisticsManager.incrementSoldNumbers();
    // Proceed with the call
    window.location.href = `tel:${phoneNumber.replace(/[^0-9]/g, '')}`;
  };

  const filteredListings = listings;

  return (
    <div className={styles.phoneGoldContainer}>
      <div className={styles.phoneGoldHeader}>
        <Link href="/" className={styles.backButton}>
          <ArrowLeft size={24} />
        </Link>
        <div className={styles.headerTitleContainer}>
          <h1>
            <Gem size={20} className={styles.headerIcon} />
            <span>Gold Elanlar</span>
            <span className={styles.listingCount}>({filteredListings.length})</span>
          </h1>
        </div>
        {/* Placeholder to balance the back button and keep the title perfectly centered */}
        <div className={styles.headerSpacer}></div>
      </div>

      <SearchAndFilter
        searchPlaceholder="Gold elanlar içində axtar..."
      />

      {loading ? (
        <div className={styles.loadingState}>Yüklənir...</div>
      ) : filteredListings.length > 0 ? (
        <div className={styles.phoneGoldList}>
          {filteredListings.map(listing => (
            <div key={listing.id} className={styles.phoneGoldListingItem}>
              <div className={styles.phoneNumberContainer}>
                <span className={styles.phoneNumber}>{listing.phoneNumber}</span>
              </div>
              <span className={styles.price}>{listing.price} ₼</span>
              <button className={styles.callButton} onClick={() => handleCall(listing.contactPhone)} aria-label={`Zəng et ${listing.contactPhone}`}>
                <Phone size={16} />
                <span>Əlaqə</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noListingsMessage}>
          Hal-hazırda Gold nömrəsi mövcud deyil
        </div>
      )}
    </div>
  );
}

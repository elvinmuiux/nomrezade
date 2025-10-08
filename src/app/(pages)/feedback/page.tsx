'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageTemplate from '@/components/layout/PageTemplate/PageTemplate';
import styles from './page.module.css';

export default function FeedbackPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const feedbackData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || '',
      rating: parseInt(formData.get('rating') as string) || 0,
      feedbackType: formData.get('feedback_type') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
      date: new Date().toISOString(),
      timestamp: Date.now()
    };

    try {
      // Submit feedback to MongoDB via API
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        // Reset form
        (e.target as HTMLFormElement).reset();
      } else {
        alert('Rəy göndərilərkən xəta baş verdi: ' + (result.error || 'Naməlum xəta'));
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      alert('Rəy göndərilərkən xəta baş verdi');
    }
  };

  if (isSubmitted) {
    return (
      <PageTemplate>
        <div className={styles.container}>
          <div className={styles.successMessage}>
            <h2>✅ Rəyiniz uğurla göndərildi!</h2>
            <p>Təşəkkür edirik ki, bizimlə fikrinizi bölüşdünüz.</p>
            <div className={styles.actions}>
              <button 
                onClick={() => setIsSubmitted(false)}
                className={styles.button}
              >
                Yeni Rəy Göndər
              </button>
              <button 
                onClick={() => router.push('/')}
                className={styles.buttonSecondary}
              >
                Ana Səhifəyə Qayıt
              </button>
            </div>
          </div>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Bizimlə Əlaqə</h1>
          <p>Fikrinizi bizimlə bölüşün və təkliflərinizi göndərin</p>
        </div>

        <div className={styles.feedbackForm}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Ad Soyad *</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Adınızı və soyadınızı daxil edin"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">E-poçt *</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="E-poçt ünvanınızı daxil edin"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Telefon</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Telefon nömrənizi daxil edin"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="rating">Reytinq</label>
              <select id="rating" name="rating">
                <option value="">Reytinq seçin</option>
                <option value="5">5 - Əla</option>
                <option value="4">4 - Yaxşı</option>
                <option value="3">3 - Orta</option>
                <option value="2">2 - Pis</option>
                <option value="1">1 - Çox pis</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="feedback_type">Rəy Növü *</label>
              <select id="feedback_type" name="feedback_type" required>
                <option value="">Rəy növünü seçin</option>
                <option value="GENERAL">Ümumi</option>
                <option value="COMPLAINT">Şikayət</option>
                <option value="SUGGESTION">Təklif</option>
                <option value="BUG_REPORT">Xəta Bildirişi</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subject">Mövzu *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                placeholder="Rəyinizin mövzusunu daxil edin"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">Mesaj *</label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Rəyinizi ətraflı yazın..."
              />
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                Rəy Göndər
              </button>
            </div>
          </form>
        </div>

        <div className={styles.contactInfo}>
          <h3>Digər Əlaqə Üsulları</h3>
          <div className={styles.contactMethods}>
            <div className={styles.contactMethod}>
              <h4>📧 E-poçt</h4>
              <p>info@nomrezade.az</p>
            </div>
            <div className={styles.contactMethod}>
              <h4>📱 Telefon</h4>
              <p>+994 50 444 44 22</p>
            </div>
            <div className={styles.contactMethod}>
              <h4>🕒 İş Saatları</h4>
              <p>Hər gün 09:00 - 18:00</p>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
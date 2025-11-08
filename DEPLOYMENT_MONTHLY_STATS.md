# Admin Panel - Aylıq Ziyarətçi Statistikası

## Nə Əlavə Edildi?

### 1. Yeni Statistika Kartı
Admin Panel-da **"Aylıq Ziyarətçi"** adlı yeni kart əlavə edildi. Bu kart:
- Cari ayın səhifə baxışlarını göstərir
- Hər səhifə ziyarətində avtomatik artır
- Real-vaxt məlumat göstərir
- Narıncı rəngli border ilə birinci sırada yerləşir

### 2. Avtomatik Aylıq Yeniləmə
- Hər ayın 1-də statistika avtomatik sıfırlanır
- Vercel Cron Jobs vasitəsilə idarə olunur
- Keçmiş ayların məlumatları saxlanılır

### 3. Dəyişikliklər

#### Database (Prisma Schema)
```prisma
model MonthlyVisitorStats {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  month      String   @unique // "2025-11"
  visitors   Int      @default(0)
  pageViews  Int      @default(0)
  lastUpdated DateTime @default(now())
}
```

#### Yeni API Endpoints
1. `GET /api/admin/monthly-stats` - Aylıq statistika məlumatı
2. `POST /api/admin/monthly-stats` - Statistikanı yenilə
3. `GET /api/cron/reset-monthly-stats` - Aylıq sıfırlama (cron job)

#### Dəyişdirilən Fayllar
1. **prisma/schema.prisma** - MonthlyVisitorStats modeli əlavə edildi
2. **src/app/admin/components/AdminStatistics/AdminStatistics.tsx** - Aylıq data göstərilməsi
3. **src/app/admin/components/AdminStatistics/AdminStatistics.module.css** - 6 kart üçün stil
4. **src/shared/services/ApiService.ts** - MonthlyStats API metodları
5. **src/middleware.ts** - Səhifə ziyarətlərini qeyd etmək
6. **vercel.json** - Cron job konfiqurasiyası (YENİ)

## Deploy Sonrası Yoxlamalar

### 1. Database Migration
Database avtomatik sync olacaq, amma əmin olmaq üçün:
```bash
npx prisma db push
npx prisma generate
```

### 2. Vercel Cron Job
Vercel Dashboard-da:
1. Project > Settings > Cron Jobs
2. Yoxlayın ki, `/api/cron/reset-monthly-stats` görünür
3. Schedule: `0 0 1 * *` (hər ayın 1-də, saat 00:00)
4. Status: Active

### 3. Test Etmək
1. Admin Panel-ə daxil olun: `https://your-domain.com/0x/admin`
2. Yoxlayın ki, "Aylıq Ziyarətçi" kartı görünür
3. Bir neçə səhifə açın və rəqəmin artdığını yoxlayın
4. API-ni test edin: `https://your-domain.com/api/admin/monthly-stats`

### 4. Manuel Cron Test (Developer üçün)
```bash
curl https://your-domain.com/api/cron/reset-monthly-stats
```

## Vizual Görünüş

Admin Panel-da statistika kartları (soldan sağa):
```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Aylıq Ziyarətçi │ │ Ümumi Nömrələr  │ │   Standard      │
│   [Narıncı]     │ │    [Mavi]       │ │    [Yaşıl]      │
│     5,430       │ │      250        │ │      150        │
└─────────────────┘ └─────────────────┘ └─────────────────┘

┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│    Premium      │ │      Gold       │ │    Satıcılar    │
│    [Sarı]       │ │   [Bənövşəyi]   │ │    [Qırmızı]    │
│       60        │ │       40        │ │       15        │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

## Environment Variables
Heç bir yeni environment variable lazım deyil. Mövcud `DATABASE_URL` kifayətdir.

## Performance
- Middleware hər səhifə üçün bir async API call edir (fire-and-forget)
- Database-də hər ay üçün yalnız 1 sənəd saxlanılır
- Minimal performans təsiri

## Monitoring
Vercel Dashboard-da:
- Function Logs > `/api/admin/monthly-stats` - API çağırışları
- Cron Jobs > Execution History - Aylıq reset tarixçəsi

## Backup
Keçmiş ayların məlumatları avtomatik saxlanılır:
- 2025-10: { visitors: 4523, pageViews: 15234 }
- 2025-11: { visitors: 1250, pageViews: 5430 }
- 2025-12: { visitors: 0, pageViews: 0 } (yeni ay)

## Support
Problemlərlə qarşılaşsanız:
1. Server logs yoxlayın
2. MongoDB Atlas-da `monthly_visitor_stats` collection-una baxın
3. `MONTHLY_STATS_README.md` faylına baxın
4. Prisma client-i yenidən generate edin: `npx prisma generate`

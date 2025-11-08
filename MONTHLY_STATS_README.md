# Aylıq Ziyarətçi Statistikası

Bu funksionallıq Admin Panel-da aylıq səhifə ziyarətçilərinin sayını göstərir.

## Xüsusiyyətlər

### 1. Aylıq Statistika Göstərilməsi
- Admin Panel-da **"Aylıq Ziyarətçi"** adlı yeni statistika kartı əlavə edilib
- Bu kart cari ayın səhifə baxışlarının sayını göstərir
- Məlumat real-vaxtda yenilənir

### 2. Avtomatik Sayma
- Hər səhifə ziyarəti avtomatik olaraq qeyd edilir
- Middleware vasitəsilə bütün səhifə baxışları izlənilir
- API və ya statik fayllar sayılmır

### 3. Aylıq Yeniləmə
- Hər ayın 1-də statistika avtomatik olaraq sıfırlanır
- Keçmiş ayın məlumatları saxlanılır
- Vercel Cron Jobs vasitəsilə idarə olunur

## Texniki Detallar

### Database Strukturu
```prisma
model MonthlyVisitorStats {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  month      String   @unique // Format: YYYY-MM (e.g., "2025-11")
  visitors   Int      @default(0)
  pageViews  Int      @default(0)
  lastUpdated DateTime @default(now()) @updatedAt
}
```

### API Endpoints

#### 1. Məlumat Əldə Etmək
```
GET /api/admin/monthly-stats
```
Cavab:
```json
{
  "success": true,
  "data": {
    "month": "2025-11",
    "visitors": 1250,
    "pageViews": 5430,
    "lastUpdated": "2025-11-08T10:30:00.000Z"
  }
}
```

#### 2. Statistikanı Yeniləmək
```
POST /api/admin/monthly-stats
```
Body:
```json
{
  "action": "increment_pageview" // or "increment_visitor"
}
```

#### 3. Cron Job - Aylıq Sıfırlama
```
GET /api/cron/reset-monthly-stats
```
Bu endpoint hər ayın 1-də avtomatik işləyir (Vercel Cron tərəfindən).

### Cron Job Konfiqurasiyası

`vercel.json` faylında:
```json
{
  "crons": [
    {
      "path": "/api/cron/reset-monthly-stats",
      "schedule": "0 0 1 * *"
    }
  ]
}
```

Schedule formatı: `0 0 1 * *`
- İlk `0`: Dəqiqə (0-59)
- İkinci `0`: Saat (0-23)
- `1`: Ayın günü (hər ayın 1-i)
- İlk `*`: Ay (hər ay)
- İkinci `*`: Həftənin günü (hər gün)

## İstifadə

### Admin Panel-da Görünüş
Admin Panel-a daxil olduqda, statistika bölməsində 6 kart görünəcək:
1. **Aylıq Ziyarətçi** - Cari ayın səhifə baxışları (yeni)
2. Ümumi Nömrələr
3. Standard
4. Premium
5. Gold
6. Satıcılar

### Manuel Test
Cron job-u manuel test etmək üçün:
```bash
curl http://localhost:3000/api/cron/reset-monthly-stats
```

## Qeydlər

- Statistika MongoDB-də saxlanılır
- Hər ay üçün ayrıca qeyd yaradılır
- Keçmiş ayların məlumatları saxlanılır (tarixçə üçün)
- Avtomatik sıfırlama Vercel-də deploy edildikdən sonra işləyəcək
- Local development-də cron job işləməyəcək (manual çağırmalısınız)

## Deployment

Vercel-ə deploy etdikdən sonra:
1. Vercel Dashboard-a gedin
2. Project Settings > Cron Jobs bölməsinə keçin
3. Cron job-un aktiv olduğunu yoxlayın
4. Növbəti işə salınma vaxtını görə bilərsiniz

## Troubleshooting

Əgər statistika görünmürsə:
1. Browser console-da error yoxlayın
2. `/api/admin/monthly-stats` endpoint-ə GET request göndərin
3. Database-də `monthly_visitor_stats` collection-unun olduğunu yoxlayın
4. Prisma client-in yenilənmiş olduğunu təsdiqləyin: `npx prisma generate`

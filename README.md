# 📞 nomremzade.az

**Phone Number Trading Platform for Azerbaijan**

![Next.js](https://img.shields.io/badge/Next.js-15.3.3-000000?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat&logo=tailwind-css)

## 🎯 **Features**

- 📱 **Ad Types**: Premium, Gold, Standard listings
- 🏢 **Multi-Operator**: Azercell, Bakcell, Nar Mobile, Naxtel support
- 🔐 **Secure Database**: Encrypted local storage with KV support
- 📊 **Real-time Statistics**: Visitor tracking and analytics
- 🎨 **Responsive Design**: Mobile-first approach
- ⚡ **Performance**: Optimized data structure and caching
- 🛡️ **Type Safety**: Full TypeScript implementation

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/username/nomremzade.az-main.git
cd nomremzade.az-main

# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Production Deployment on Vercel

This project uses MongoDB as the primary database:
- **Development**: MongoDB Atlas
- **Production**: MongoDB Atlas

### Setup MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Add the environment variable to your Vercel project:

```bash
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### How it works

- **localhost**: Connects to MongoDB Atlas
- **nomrezade.az (production)**: Connects to MongoDB Atlas via Prisma

### Admin Panel

Access admin panel at: `https://nomrezade.az/admin`

The admin panel uses MongoDB for all operations.

### API Endpoints

- `GET /api/admin/numbers` - Get phone numbers
- `POST /api/admin/numbers` - Add new phone number
- `PUT /api/admin/numbers` - Update phone number
- `DELETE /api/admin/numbers` - Delete phone number
- `GET /api/statistics` - Get statistics
- `POST /api/statistics` - Update statistics

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Nomremzade.az - Phone Number Trading Platform

Azərbaycan üçün nömrə alış-satış platforması

## 🚀 Xüsusiyyətlər

- **Avtomatik Qeydiyyat Yönləndirməsi**: Giriş etməmiş istifadəçilər avtomatik qeydiyyata yönləndirilir
- **Premium/Gold/Standart Elan Sistemi**: Müxtəlif elan paketləri
- **Secure Database**: Təhlükəsiz məlumat saxlanması
- **User Session Management**: İstifadəçi sessiya idarəetməsi
- **Responsive Design**: Mobil və desktop uyğunluq

## 📱 Elan Sistemləri

### Premium Elan (30 gün)
- Xüsusi vurğulanma
- Siyahının yuxarısında göstərilmə
- Daha çox görünmə

### Gold Elan (20 gün)
- Öncelikli göstərilmə
- Orta səviyyə vurğulanma

### Standart Elan (7 gün)
- Adi göstərilmə
- Qısa müddət

## 🔧 Texniki Məlumatlar

### Faylların Təşkili
```
/src/app/
  ├── register/           → Qeydiyyat səhifəsi
  ├── login/              → Giriş səhifəsi
  ├── numbers/            → Elanların göstərilməsi
  └── post-ad/
      ├── premium/        → Premium elan
      ├── gold/           → Gold elan
      └── standard/       → Standart elan

/src/components/
  ├── layout/             → Səhifə strukturu
  └── ui/                 → UI komponentləri

/src/lib/
  └── database.ts         → Məlumat bazası əməliyyatları
```

### Məlumat Saxlanması
- LocalStorage ilə encrypted məlumat saxlanması
- İstifadəçi məlumatları və elanlar təhlükəsizdir
- Secure Database sinifi ilə idarəetmə

### İstifadəçi Autentifikasiyası
- Qeydiyyat və giriş sistemi
- Session idarəetməsi
- Təhlükəsiz şifrə saxlanması

## 🛠️ Development

### Lokal olaraq işə salmaq:
```bash
# Dependencies yüklə
npm install

# Development server başlat
npm run dev

# Production build
npm run build

# Production server başlat
npm run start
```

### Environment Variables
`.env.local` faylı yaradın:
```bash
# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Database encryption key
DATABASE_ENCRYPTION_KEY=your_secret_key
```

## 📄 Səhifələr

- `/` - Ana səhifə
- `/register` - Qeydiyyat
- `/login` - Giriş
- `/numbers` - Elanlar siyahısı
- `/post-ad/premium` - Premium elan yerləşdir
- `/post-ad/gold` - Gold elan yerləşdir
- `/post-ad/standard` - Standart elan yerləşdir

## 🔐 Təhlükəsizlik

- Məlumatlar encrypted şəkildə saxlanılır
- İstifadəçi sessiyaları təhlükəsizdir
- Form validasiyası və sanitization
- XSS və CSRF qorunması

## 📞 Əlaqə

- Website: [nomremzade.az](https://nomremzade.az)
- Email: support@nomremzade.az

---

Made with ❤️ for Azerbaijan 🇦🇿

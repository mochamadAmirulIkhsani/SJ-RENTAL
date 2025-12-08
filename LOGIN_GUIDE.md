# Dokumentasi Sistem Login

## 🔐 Fitur Authentication

Sistem login telah berhasil dibuat dengan fitur:

1. **User Registration** - Pendaftaran user baru
2. **User Login** - Autentikasi dengan JWT
3. **Password Hashing** - Password di-hash dengan bcrypt
4. **Role-based Access** - Admin dan Customer memiliki akses berbeda
5. **Protected Routes** - Middleware untuk proteksi halaman

## 📁 File yang Dibuat

### Backend (API Routes)

- `app/api/auth/login/route.ts` - Endpoint login
- `app/api/auth/register/route.ts` - Endpoint registrasi
- `app/api/auth/verify/route.ts` - Endpoint verifikasi token

### Frontend (Pages)

- `app/login/page.tsx` - Halaman login
- `app/register/page.tsx` - Halaman registrasi

### Utilities

- `lib/auth.ts` - Helper functions untuk authentication (hash, verify, JWT)
- `middleware.ts` - Middleware untuk proteksi route

### Database

- `prisma/schema.prisma` - Updated dengan field `password`, `role`, `createdAt`, `updatedAt`
- `prisma/seed.ts` - Seed dengan user yang memiliki password

## 🚀 Cara Testing

### 1. Jalankan Development Server

```bash
npm run dev
```

### 2. Test Login

Buka browser dan akses: `http://localhost:3000/login`

**Akun Admin:**

- Email: `admin@sjrental.com`
- Password: `admin123`

**Akun Customer:**

- Email: `customer@example.com`
- Password: `customer123`

### 3. Test Registrasi

Buka browser dan akses: `http://localhost:3000/register`

- Isi form registrasi
- Pilih role (Admin/Customer)
- Klik Daftar

### 4. Test API dengan cURL atau Postman

**Login:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sjrental.com","password":"admin123"}'
```

**Register:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com","password":"password123","name":"New User","role":"CUSTOMER"}'
```

**Verify Token:**

```bash
curl -X GET http://localhost:3000/api/auth/verify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 🔑 JWT Token

Setelah login berhasil, response akan berisi:

```json
{
  "message": "Login berhasil",
  "user": {
    "id": 1,
    "email": "admin@sjrental.com",
    "name": "Admin User",
    "role": "ADMIN",
    "createdAt": "2024-12-08T10:00:00.000Z",
    "updatedAt": "2024-12-08T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Token disimpan di `localStorage` dan berlaku selama 7 hari.

## 🛡️ Protected Routes

Middleware akan mengecek authentication untuk route berikut:

- `/admin/*` - Hanya bisa diakses oleh user dengan role ADMIN
- `/home` - Hanya bisa diakses oleh user yang sudah login
- `/booking` - Hanya bisa diakses oleh user yang sudah login
- `/my-bookings` - Hanya bisa diakses oleh user yang sudah login

## 🔧 Environment Variables

Pastikan file `.env.local` berisi:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DATABASE_URL=your-database-url
```

**PENTING:** Ganti `JWT_SECRET` dengan key yang lebih aman di production!

## 📊 Database Schema

Model User sekarang memiliki field:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String   @default("")
  name      String?
  role      String   @default("CUSTOMER") // ADMIN or CUSTOMER
  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt
  posts     Post[]
}
```

## 🎯 Flow Authentication

1. User mengisi form login dengan email dan password
2. Frontend mengirim POST request ke `/api/auth/login`
3. Backend verify email dan password
4. Jika valid, backend generate JWT token
5. Token dikirim ke frontend dan disimpan di localStorage
6. Setiap request berikutnya, frontend mengirim token di header
7. Middleware verify token sebelum mengakses protected routes
8. Jika token invalid, redirect ke halaman login

## 🔒 Security Features

- ✅ Password di-hash dengan bcrypt (salt rounds: 10)
- ✅ JWT token dengan expiry 7 hari
- ✅ Password minimal 6 karakter
- ✅ Email unique constraint
- ✅ Role-based access control
- ✅ Protected API routes
- ✅ Middleware untuk proteksi halaman

## 📝 Next Steps

1. Tambahkan fitur "Forgot Password"
2. Implementasi refresh token
3. Tambahkan rate limiting untuk login attempts
4. Implementasi email verification
5. Tambahkan 2FA (Two-Factor Authentication)
6. Setup HTTPS di production
7. Implementasi session management

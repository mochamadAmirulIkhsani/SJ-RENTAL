# Panduan Integrasi Midtrans - SJ Rental

## 🚀 Langkah-Langkah Setup

### 1. Jalankan SQL Migration di Supabase

1. Buka Supabase Dashboard: https://supabase.com/dashboard
2. Pilih project "SJRENTAL"
3. Klik **SQL Editor** di sidebar kiri
4. Klik **New Query**
5. Copy paste semua kode dari file: `prisma/migrations/manual_add_payment_fields.sql`
6. Klik **Run** untuk execute query
7. Pastikan muncul pesan sukses dan tidak ada error

### 2. Verifikasi Tabel Booking

Jalankan query ini untuk memastikan kolom payment sudah ada:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'Booking';
```

Pastikan ada kolom berikut:

- ✅ paymentStatus
- ✅ paymentMethod
- ✅ transactionId
- ✅ paymentUrl
- ✅ paidAt
- ✅ notes
- ✅ totalDays

### 3. Test Aplikasi

```bash
npm run dev
```

Buka browser dan test:

1. Login sebagai customer: customer@example.com
2. Buka halaman Booking: http://localhost:3000/booking
3. Pilih motor yang tersedia
4. Pilih tanggal rental
5. Klik "Proceed to Payment"
6. Akan muncul popup Midtrans Snap

### 4. Test Payment (Sandbox)

Gunakan kartu test berikut:

**✅ Pembayaran Sukses:**

- Card Number: `4811 1111 1111 1114`
- CVV: `123`
- Expiry: `01/25`

**❌ Pembayaran Gagal:**

- Card Number: `4011 1111 1111 1112`
- CVV: `123`
- Expiry: `01/25`

## 📋 Struktur File yang Diubah

### Backend API (Menggunakan Supabase)

- ✅ `app/api/bookings/route.ts` - GET & POST booking dengan Supabase
- ✅ `app/api/bookings/webhook/route.ts` - Webhook Midtrans dengan Supabase

### Frontend

- ✅ `app/(customer)/booking/page.tsx` - Halaman booking dengan Midtrans Snap
- ✅ `app/(customer)/confirmation/page.tsx` - Halaman konfirmasi pembayaran

### Database

- ✅ `prisma/migrations/manual_add_payment_fields.sql` - SQL manual untuk Supabase

### Configuration

- ✅ `.env` - Midtrans credentials sudah ditambahkan

## 🔄 Alur Booking & Payment

```
1. Customer pilih motor → Isi form → Klik "Proceed to Payment"
   ↓
2. Backend create booking di Supabase
   ↓
3. Backend call Midtrans Snap API → dapat payment token
   ↓
4. Frontend buka popup Midtrans dengan token
   ↓
5. Customer bayar via Midtrans
   ↓
6. Midtrans kirim webhook ke backend
   ↓
7. Backend update status booking & motor di Supabase
   ↓
8. Customer redirect ke halaman konfirmasi
```

## 🔐 Environment Variables

Sudah tersedia di `.env`:

```env
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="your_key"
MIDTRANS_SERVER_KEY="your_key"
MIDTRANS_IS_PRODUCTION=false
```

⚠️ **Mode: Sandbox** - Untuk production, ganti dengan credentials production dari Midtrans.

## 🧪 Testing Checklist

- [ ] SQL migration berhasil di Supabase
- [ ] Kolom payment muncul di tabel Booking
- [ ] Aplikasi bisa running (`npm run dev`)
- [ ] Halaman booking menampilkan daftar motor
- [ ] Form booking bisa diisi
- [ ] Popup Midtrans muncul setelah submit
- [ ] Payment sukses → Status berubah jadi "Paid"
- [ ] Motor status berubah jadi "Rented"
- [ ] Halaman konfirmasi menampilkan detail booking

## ⚠️ Troubleshooting

### Popup Midtrans tidak muncul

**Cek:**

1. Browser console untuk error
2. Midtrans Snap script loaded? (lihat Network tab)
3. Client key benar di `.env`?

### Webhook tidak jalan

**Cek:**

1. Aplikasi harus deploy public (localhost tidak bisa terima webhook)
2. Set webhook URL di Midtrans Dashboard saat production
3. Signature verification error? Pastikan Server Key benar

### Motor tidak berubah status

**Cek:**

1. Webhook sukses diterima?
2. Transaction status dari Midtrans apa? (capture/settlement)
3. Lihat server logs untuk error

## 📞 Support

**Midtrans:**

- Docs: https://docs.midtrans.com
- Sandbox: https://dashboard.sandbox.midtrans.com
- Support: support@midtrans.com

**Supabase:**

- Dashboard: https://supabase.com/dashboard
- Docs: https://supabase.com/docs
- SQL Editor: Dashboard > SQL Editor

## ✅ Status Implementasi

- ✅ Backend API dengan Supabase (tidak pakai Prisma)
- ✅ Midtrans Snap integration
- ✅ Webhook handler
- ✅ Booking page dengan payment popup
- ✅ Confirmation page
- ✅ SQL migration script
- ⏳ Perlu run SQL di Supabase Dashboard
- ⏳ Testing payment flow

---

**Next Steps:**

1. Jalankan SQL migration di Supabase
2. Test booking flow
3. Verifikasi webhook (perlu deploy ke server public untuk production)

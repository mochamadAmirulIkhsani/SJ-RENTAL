# Midtrans Callback API - README

## 📌 Overview

API callback Midtrans untuk mengupdate status pembayaran booking secara otomatis menggunakan **Supabase langsung** (bukan Prisma) untuk menghindari error.

## 🎯 Endpoints

### 1. Main Callback Endpoint

```
POST /api/payment/callback
```

Endpoint utama yang menerima notifikasi dari Midtrans.

### 2. Test Callback Endpoint

```
POST /api/payment/test-callback
GET  /api/payment/test-callback
```

Endpoint untuk testing callback di localhost (tanpa perlu Midtrans real).

## ⚡ Quick Test

```powershell
# 1. Jalankan server
npm run dev

# 2. Test callback (ganti BOOK-XXX dengan booking code yang valid)
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/payment/test-callback" -ContentType "application/json" -Body '{"bookingCode":"BOOK-20231209-ABC123","transactionStatus":"settlement"}'
```

## 📁 Files Created

```
app/
  api/
    payment/
      callback/
        route.ts          # Main callback handler
      test-callback/
        route.ts          # Test simulator

CALLBACK_API.md             # Dokumentasi lengkap API
QUICK_TEST_CALLBACK.md      # Panduan testing cepat
```

## 🔑 Environment Variables Required

Pastikan ada di `.env`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
MIDTRANS_SERVER_KEY=your_midtrans_server_key
```

## 🚀 How It Works

1. **Midtrans** mengirim payment notification ke `/api/payment/callback`
2. API **verifikasi signature** untuk keamanan
3. API **cari booking** berdasarkan order_id (bookingCode)
4. API **update status** booking dan motor berdasarkan transaction_status
5. API **kirim response** success ke Midtrans

## 📊 Status Updates

| Midtrans Status | Payment Status | Booking Status | Motor Status |
| --------------- | -------------- | -------------- | ------------ |
| settlement      | Paid           | Confirmed      | Rented       |
| pending         | Unpaid         | Pending        | -            |
| cancel          | Unpaid         | Cancelled      | Available    |
| expire          | Unpaid         | Cancelled      | Available    |

## 🔧 Setup for Production

1. Deploy aplikasi ke server (Vercel, Railway, etc.)
2. Copy public URL: `https://your-domain.com`
3. Set di Midtrans Dashboard:
   ```
   Settings → Configuration → Payment Notification URL
   https://your-domain.com/api/payment/callback
   ```

## 🧪 Testing

### Local Testing (Recommended)

```bash
# Menggunakan test endpoint
npm run dev

# Test settlement (payment success)
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/payment/test-callback" -ContentType "application/json" -Body '{"bookingCode":"YOUR_BOOKING_CODE","transactionStatus":"settlement"}'
```

### Production Testing (dengan ngrok)

```bash
# Install dan jalankan ngrok
ngrok http 3000

# Set webhook URL di Midtrans Dashboard
https://your-ngrok-url.ngrok.io/api/payment/callback

# Buat transaksi real dan bayar via Midtrans Snap
```

## 📚 Documentation

- **[CALLBACK_API.md](./CALLBACK_API.md)** - Full API documentation
- **[QUICK_TEST_CALLBACK.md](./QUICK_TEST_CALLBACK.md)** - Quick testing guide

## ✅ Benefits

✅ **Direct Supabase** - Tidak menggunakan Prisma, menghindari error  
✅ **Signature Verification** - Keamanan dengan signature validation  
✅ **Auto Update** - Otomatis update booking dan motor status  
✅ **Detailed Logging** - Log lengkap untuk debugging  
✅ **Easy Testing** - Test endpoint untuk development

## 🛠️ Technologies

- **Next.js 14** - App Router & API Routes
- **Supabase** - Direct database access
- **Midtrans** - Payment gateway
- **TypeScript** - Type safety

## 🆘 Troubleshooting

**Signature Invalid?**

- Check `MIDTRANS_SERVER_KEY` di `.env`

**Booking Not Found?**

- Pastikan booking code benar
- Check di database apakah booking exists

**Failed to Update?**

- Check `SUPABASE_SERVICE_ROLE_KEY` (harus service role, bukan anon)
- Check database connection

## 👨‍💻 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Test callback
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/payment/test-callback" -ContentType "application/json" -Body '{"bookingCode":"BOOK-TEST","transactionStatus":"settlement"}'
```

## 📞 Support

Untuk pertanyaan atau issue:

1. Check logs di terminal
2. Review [CALLBACK_API.md](./CALLBACK_API.md)
3. Check Midtrans Dashboard → Notification History

---

**Status**: ✅ Production Ready  
**Last Updated**: December 9, 2024

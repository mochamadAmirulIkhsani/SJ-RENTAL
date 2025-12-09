# Midtrans Payment Callback API

API endpoint untuk menerima notifikasi pembayaran dari Midtrans dan mengupdate status pembayaran di database.

## 📍 Endpoint

```
POST /api/payment/callback
```

## 🔑 Fitur Utama

✅ **Menggunakan Supabase Langsung** - Tidak menggunakan Prisma untuk menghindari error  
✅ **Signature Verification** - Memvalidasi signature dari Midtrans untuk keamanan  
✅ **Auto Update Status** - Otomatis mengupdate status booking dan motor  
✅ **Detailed Logging** - Log lengkap untuk debugging  
✅ **Error Handling** - Penanganan error yang komprehensif

## 🔐 Environment Variables Required

Pastikan environment variables berikut sudah diset di `.env` atau `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Midtrans
MIDTRANS_SERVER_KEY=your_midtrans_server_key
```

## 📊 Status Mapping

API ini akan mengupdate status berdasarkan `transaction_status` dari Midtrans:

| Midtrans Status              | Payment Status | Booking Status | Motor Status    |
| ---------------------------- | -------------- | -------------- | --------------- |
| `capture` / `settlement`     | Paid           | Confirmed      | Rented          |
| `pending`                    | Unpaid         | Pending        | (tidak berubah) |
| `deny` / `cancel` / `expire` | Unpaid         | Cancelled      | Available       |
| `refund`                     | Refunded       | Cancelled      | Available       |

## 🔄 Flow Proses

1. **Receive Notification** - Menerima payload dari Midtrans
2. **Verify Signature** - Validasi signature untuk keamanan
3. **Find Booking** - Cari booking berdasarkan `order_id` (bookingCode)
4. **Determine Status** - Tentukan status berdasarkan `transaction_status`
5. **Update Booking** - Update data booking di database
6. **Update Motor** - Update status motor jika diperlukan
7. **Send Response** - Kirim response success ke Midtrans

## 📝 Request Format (dari Midtrans)

Midtrans akan mengirim POST request dengan body seperti ini:

```json
{
  "order_id": "BOOK-20231209-ABC123",
  "status_code": "200",
  "gross_amount": "150000.00",
  "signature_key": "a1b2c3d4e5f6...",
  "transaction_status": "settlement",
  "fraud_status": "accept",
  "payment_type": "gopay",
  "transaction_time": "2023-12-09 10:30:00",
  "transaction_id": "midtrans-trx-123456"
}
```

## ✅ Response Format

### Success Response (200)

```json
{
  "success": true,
  "message": "Payment notification processed successfully",
  "data": {
    "bookingCode": "BOOK-20231209-ABC123",
    "paymentStatus": "Paid",
    "bookingStatus": "Confirmed",
    "transactionId": "midtrans-trx-123456"
  }
}
```

### Error Response (400/401/404/500)

```json
{
  "success": false,
  "error": "Invalid signature",
  "message": "Signature verification failed"
}
```

## 🧪 Testing

### 1. Test Endpoint Accessibility

```bash
curl http://localhost:3000/api/payment/callback
```

Response:

```json
{
  "message": "Midtrans Payment Callback Endpoint",
  "status": "active",
  "timestamp": "2023-12-09T10:30:00.000Z"
}
```

### 2. Test dengan Webhook Simulator

Gunakan endpoint test yang sudah ada:

```bash
curl -X POST http://localhost:3000/api/bookings/test-webhook \
  -H "Content-Type: application/json" \
  -d '{"bookingCode": "BOOK-20231209-ABC123"}'
```

### 3. Setup di Midtrans Dashboard

1. Login ke [Midtrans Dashboard](https://dashboard.sandbox.midtrans.com)
2. Pilih **Settings** → **Configuration**
3. Set **Payment Notification URL**:
   ```
   https://your-domain.com/api/payment/callback
   ```
4. Pilih **HTTP Method**: POST
5. Klik **Save**

> **Note**: Midtrans tidak bisa mengirim webhook ke `localhost`. Untuk testing lokal, gunakan ngrok atau deploy ke server.

### 4. Setup dengan ngrok (untuk testing lokal)

```bash
# Install ngrok
# Download dari https://ngrok.com/download

# Jalankan aplikasi Next.js
npm run dev

# Di terminal baru, jalankan ngrok
ngrok http 3000

# Copy HTTPS URL yang diberikan ngrok
# Contoh: https://abc123.ngrok.io

# Set di Midtrans Dashboard:
# https://abc123.ngrok.io/api/payment/callback
```

## 📋 Monitoring & Debugging

### Check Logs

Log akan tampil di terminal saat callback diterima:

```
=== MIDTRANS CALLBACK RECEIVED ===
Timestamp: 2023-12-09T10:30:00.000Z
Payload: {...}
Signature Verification:
- Expected: a1b2c3d4e5f6...
- Received: a1b2c3d4e5f6...
- Match: true
✅ Signature verified successfully
Searching for booking with code: BOOK-20231209-ABC123
✅ Booking found:
- Booking ID: 1
- Current Status: Pending
- Current Payment Status: Unpaid
...
```

### Check di Midtrans Dashboard

1. Login ke Midtrans Dashboard
2. Buka **Transactions**
3. Klik transaksi yang ingin dicek
4. Scroll ke bawah, lihat **Notification History**
5. Cek status pengiriman webhook

### Check di Database

```sql
-- Check booking status
SELECT id, "bookingCode", status, "paymentStatus", "transactionId", "paidAt"
FROM "Booking"
WHERE "bookingCode" = 'BOOK-20231209-ABC123';

-- Check motor status
SELECT id, "plateNumber", status
FROM "Motor"
WHERE id = (SELECT "motorId" FROM "Booking" WHERE "bookingCode" = 'BOOK-20231209-ABC123');
```

## 🔧 Troubleshooting

### Problem: Signature Invalid

**Cause**: `MIDTRANS_SERVER_KEY` salah atau tidak sesuai

**Solution**:

- Pastikan `MIDTRANS_SERVER_KEY` di `.env` benar
- Copy ulang dari Midtrans Dashboard → Settings → Access Keys

### Problem: Booking Not Found

**Cause**: `order_id` dari Midtrans tidak match dengan `bookingCode` di database

**Solution**:

- Pastikan saat create booking, `bookingCode` tersimpan dengan benar
- Check di database apakah booking dengan kode tersebut ada

### Problem: Failed to Update Booking

**Cause**: Database connection error atau permission issue

**Solution**:

- Pastikan `SUPABASE_SERVICE_ROLE_KEY` benar (bukan anon key)
- Check koneksi database
- Check RLS (Row Level Security) policies di Supabase

### Problem: Webhook Tidak Terkirim

**Cause**:

- URL tidak accessible dari internet
- Midtrans belum dikonfigurasi

**Solution**:

- Pastikan aplikasi sudah deploy atau gunakan ngrok
- Set webhook URL di Midtrans Dashboard
- Test dengan simulator dulu

## 🚀 Deployment

### Vercel

1. Deploy aplikasi ke Vercel
2. Copy deployment URL (contoh: `https://sjrental.vercel.app`)
3. Set webhook URL di Midtrans:
   ```
   https://sjrental.vercel.app/api/payment/callback
   ```

### Railway / Render / Server Lain

1. Deploy aplikasi
2. Copy public URL
3. Set webhook URL di Midtrans dengan format:
   ```
   https://your-domain.com/api/payment/callback
   ```

## 🔒 Security Notes

1. **Signature Verification** - Selalu verifikasi signature dari Midtrans
2. **Service Role Key** - Jangan expose `SUPABASE_SERVICE_ROLE_KEY` ke client
3. **HTTPS Only** - Production harus menggunakan HTTPS
4. **Rate Limiting** - Pertimbangkan tambahkan rate limiting di production

## 📚 References

- [Midtrans Notification Documentation](https://docs.midtrans.com/en/after-payment/http-notification)
- [Midtrans Signature Key](https://docs.midtrans.com/en/after-payment/http-notification#notification-payload)
- [Supabase Admin API](https://supabase.com/docs/reference/javascript/auth-admin-api)

## 💡 Tips

1. **Always check logs** - Log sangat detail untuk debugging
2. **Test di sandbox first** - Gunakan sandbox environment sebelum production
3. **Monitor webhook history** - Regular check di Midtrans Dashboard
4. **Keep service role key secret** - Jangan commit ke git

## 🆘 Support

Jika ada masalah atau pertanyaan:

1. Check logs di terminal
2. Check Midtrans Dashboard → Notification History
3. Check database langsung
4. Review dokumentasi Midtrans

---

**Last Updated**: December 9, 2024  
**API Version**: 1.0  
**Status**: ✅ Production Ready

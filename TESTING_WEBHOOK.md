# Testing Midtrans Payment Webhook

## Masalah: Webhook Tidak Berjalan di Localhost

Midtrans **tidak bisa** mengirim webhook notification ke `localhost`. Webhook hanya berfungsi ketika aplikasi sudah di-deploy ke server public yang bisa diakses dari internet.

## Solusi Testing di Development

### 1. Testing Manual Menggunakan Test Webhook Endpoint

Saya sudah membuat endpoint khusus untuk simulasi webhook: `/api/bookings/test-webhook`

**Cara menggunakan:**

```bash
# Setelah membuat booking, catat bookingCode-nya
# Misal: SJ-1765279373425-3

# Test pembayaran berhasil (settlement)
curl -X POST http://localhost:3000/api/bookings/test-webhook \
  -H "Content-Type: application/json" \
  -d '{"bookingCode": "SJ-1765279373425-3", "transactionStatus": "settlement"}'

# Test pembayaran pending
curl -X POST http://localhost:3000/api/bookings/test-webhook \
  -H "Content-Type: application/json" \
  -d '{"bookingCode": "SJ-1765279373425-3", "transactionStatus": "pending"}'

# Test pembayaran cancel
curl -X POST http://localhost:3000/api/bookings/test-webhook \
  -H "Content-Type: application/json" \
  -d '{"bookingCode": "SJ-1765279373425-3", "transactionStatus": "cancel"}'
```

**Atau menggunakan PowerShell:**

```powershell
# Pembayaran berhasil
Invoke-RestMethod -Uri "http://localhost:3000/api/bookings/test-webhook" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"bookingCode": "SJ-1765279373425-3", "transactionStatus": "settlement"}'

# Pembayaran pending
Invoke-RestMethod -Uri "http://localhost:3000/api/bookings/test-webhook" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"bookingCode": "SJ-1765279373425-3", "transactionStatus": "pending"}'
```

### 2. Langkah-Langkah Testing

1. **Buat booking** melalui halaman `/booking`
2. **Catat bookingCode** yang muncul (misal: `SJ-1765279373425-3`)
3. **Cek status awal** di admin booking management - harusnya `Unpaid`
4. **Kirim test webhook** menggunakan curl atau PowerShell di atas
5. **Refresh halaman** admin booking - status harusnya berubah jadi `Paid`
6. **Cek motor status** - harusnya berubah jadi `Rented`

### 3. Monitoring Webhook Logs

Webhook sekarang sudah dilengkapi dengan logging. Untuk melihat log:

```bash
# Jalankan npm run dev dan lihat terminal output
npm run dev

# Log yang akan muncul:
[WEBHOOK] Received notification from Midtrans: {...}
[WEBHOOK] Hash verification - Expected: xxx Received: xxx
[WEBHOOK] Found booking: 1 Current status: Unpaid
[WEBHOOK] Payment successful - updating motor to Rented
[WEBHOOK] Updating booking with: {...}
[WEBHOOK] Booking updated successfully!
```

## Untuk Production (Server Public)

### 1. Deploy Aplikasi

Deploy ke platform seperti:

- Vercel
- Netlify
- Railway
- DigitalOcean
- AWS

### 2. Set Webhook URL di Midtrans

1. Login ke **Midtrans Dashboard**: https://dashboard.sandbox.midtrans.com
2. Go to **Settings** → **Configuration**
3. Set **Payment Notification URL** ke:
   ```
   https://your-domain.com/api/bookings/webhook
   ```
4. Save

### 3. Test di Production

1. Buat booking dengan kartu test
2. Midtrans akan otomatis kirim webhook
3. Status akan update otomatis tanpa perlu manual test

## Troubleshooting

### Webhook tidak update status

**Cek di terminal log:**

- ✅ Apakah ada log `[WEBHOOK] Received notification`?

  - **Tidak ada**: Webhook belum dipanggil
  - **Ada**: Lanjut cek berikutnya

- ✅ Apakah signature valid?

  - Log: `[WEBHOOK] Invalid signature!`
  - **Fix**: Pastikan `MIDTRANS_SERVER_KEY` benar di `.env`

- ✅ Apakah booking ditemukan?

  - Log: `[WEBHOOK] Booking not found`
  - **Fix**: Pastikan `bookingCode` yang dikirim sesuai

- ✅ Apakah update berhasil?
  - Log: `[WEBHOOK] Failed to update booking`
  - **Fix**: Cek koneksi Supabase

### Payment status tetap Unpaid setelah bayar

**Di localhost:**

- Midtrans tidak bisa kirim webhook ke localhost
- **Solusi**: Gunakan test webhook endpoint (lihat di atas)

**Di production:**

- Pastikan webhook URL sudah di-set di Midtrans Dashboard
- Cek webhook notification log di Midtrans Dashboard

### Motor status tidak berubah

**Cek:**

1. Webhook berhasil dipanggil?
2. Transaction status = `settlement` atau `capture`?
3. Tidak ada error di console log?

## Status Mapping

| Midtrans Status | Booking Status | Payment Status | Motor Status |
| --------------- | -------------- | -------------- | ------------ |
| `settlement`    | Confirmed      | Paid           | Rented       |
| `capture`       | Confirmed      | Paid           | Rented       |
| `pending`       | Pending        | Unpaid         | Rented       |
| `deny`          | Cancelled      | Unpaid         | Available    |
| `cancel`        | Cancelled      | Unpaid         | Available    |
| `expire`        | Cancelled      | Unpaid         | Available    |
| `refund`        | Cancelled      | Refunded       | Available    |

## Contoh Response Test Webhook

```json
{
  "message": "Simulated webhook sent",
  "webhookResponse": {
    "message": "Notification processed"
  },
  "payload": {
    "order_id": "SJ-1765279373425-3",
    "status_code": "200",
    "gross_amount": "500000.00",
    "signature_key": "abc123...",
    "transaction_status": "settlement",
    "fraud_status": "accept",
    "payment_type": "bank_transfer",
    "transaction_time": "2025-12-09T...",
    "transaction_id": "TEST-1765280000000"
  }
}
```

## FAQ

**Q: Kenapa setelah bayar di Midtrans Snap, status tetap Unpaid?**  
A: Karena di localhost, webhook tidak bisa diterima. Gunakan test webhook endpoint untuk simulasi.

**Q: Bagaimana cara test di localhost tanpa deploy?**  
A: Gunakan `/api/bookings/test-webhook` endpoint dengan curl atau PowerShell.

**Q: Apakah webhook otomatis jalan di production?**  
A: Ya, asal webhook URL sudah di-set di Midtrans Dashboard.

**Q: Bagaimana cara melihat webhook yang dikirim Midtrans?**  
A: Login ke Midtrans Dashboard → Transaction → pilih transaksi → lihat "Notification History"

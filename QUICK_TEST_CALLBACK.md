# Quick Start - Testing Midtrans Callback

Panduan cepat untuk testing API callback Midtrans di localhost.

## 🚀 Langkah-Langkah Testing

### 1. Pastikan Server Berjalan

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

### 2. Buat Booking Terlebih Dahulu

Gunakan aplikasi untuk membuat booking atau via API:

```bash
# Buka aplikasi di browser
http://localhost:3000/home

# Login sebagai customer dan buat booking motor
```

Catat **Booking Code** yang dihasilkan, contoh: `BOOK-20231209-ABC123`

### 3. Test Callback API

#### Opsi A: Menggunakan Test Endpoint (RECOMMENDED)

```bash
# PowerShell
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/payment/test-callback" -ContentType "application/json" -Body '{"bookingCode":"BOOK-20231209-ABC123","transactionStatus":"settlement"}'

# Atau menggunakan curl
curl -X POST http://localhost:3000/api/payment/test-callback -H "Content-Type: application/json" -d "{\"bookingCode\":\"BOOK-20231209-ABC123\",\"transactionStatus\":\"settlement\"}"
```

#### Opsi B: Manual Call ke Callback Endpoint

```bash
# Generate signature terlebih dahulu
# Atau langsung test dengan endpoint test di atas
```

### 4. Lihat Hasil di Terminal

Terminal akan menampilkan log seperti ini:

```
=== SIMULATING MIDTRANS CALLBACK ===
Booking Code: BOOK-20231209-ABC123
Transaction Status: settlement
Generated Payload: {...}
Sending to: http://localhost:3000/api/payment/callback

=== MIDTRANS CALLBACK RECEIVED ===
Timestamp: 2023-12-09T10:30:00.000Z
Payload: {...}
✅ Signature verified successfully
✅ Booking found
✅ Payment SUCCESSFUL
✅ Booking updated successfully
✅ Motor status updated successfully
=== CALLBACK PROCESSED SUCCESSFULLY ===
```

### 5. Cek Database

```sql
-- Cek status booking
SELECT
  id,
  "bookingCode",
  status,
  "paymentStatus",
  "transactionId",
  "paidAt",
  "updatedAt"
FROM "Booking"
WHERE "bookingCode" = 'BOOK-20231209-ABC123';
```

Expected result setelah callback `settlement`:

- `status` = `Confirmed`
- `paymentStatus` = `Paid`
- `paidAt` = timestamp saat ini

## 🧪 Test Different Transaction Statuses

### Test Payment Success

```bash
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/payment/test-callback" -ContentType "application/json" -Body '{"bookingCode":"BOOK-20231209-ABC123","transactionStatus":"settlement"}'
```

Expected:

- ✅ Payment Status: `Paid`
- ✅ Booking Status: `Confirmed`
- ✅ Motor Status: `Rented`

### Test Payment Pending

```bash
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/payment/test-callback" -ContentType "application/json" -Body '{"bookingCode":"BOOK-20231209-ABC123","transactionStatus":"pending"}'
```

Expected:

- ⏳ Payment Status: `Unpaid`
- ⏳ Booking Status: `Pending`

### Test Payment Cancelled

```bash
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/payment/test-callback" -ContentType "application/json" -Body '{"bookingCode":"BOOK-20231209-ABC123","transactionStatus":"cancel"}'
```

Expected:

- ❌ Payment Status: `Unpaid`
- ❌ Booking Status: `Cancelled`
- ❌ Motor Status: `Available`

### Test Payment Expired

```bash
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/payment/test-callback" -ContentType "application/json" -Body '{"bookingCode":"BOOK-20231209-ABC123","transactionStatus":"expire"}'
```

Expected:

- ❌ Payment Status: `Unpaid`
- ❌ Booking Status: `Cancelled`
- ❌ Motor Status: `Available`

## 📊 View Available Test Options

Buka di browser atau gunakan curl:

```bash
# Browser
http://localhost:3000/api/payment/test-callback

# Curl
curl http://localhost:3000/api/payment/test-callback
```

Akan menampilkan semua opsi transaction status yang bisa ditest.

## 🔍 Troubleshooting

### Error: Booking not found

**Problem**: Booking Code tidak ada di database

**Solution**:

1. Pastikan sudah membuat booking terlebih dahulu
2. Check booking code yang benar di database:
   ```sql
   SELECT "bookingCode", status, "paymentStatus" FROM "Booking" ORDER BY "createdAt" DESC LIMIT 5;
   ```

### Error: Invalid signature

**Problem**: `MIDTRANS_SERVER_KEY` tidak sesuai

**Solution**:

1. Check `.env` file
2. Pastikan `MIDTRANS_SERVER_KEY` benar
3. Restart server setelah update `.env`

### Error: Failed to update booking

**Problem**: Database connection atau permission issue

**Solution**:

1. Check `SUPABASE_SERVICE_ROLE_KEY` di `.env`
2. Pastikan menggunakan service role key, bukan anon key
3. Check Supabase dashboard apakah database online

## 🌐 Testing dengan Real Midtrans

Untuk testing dengan Midtrans real (bukan simulator):

### 1. Deploy ke Server (atau gunakan ngrok)

```bash
# Install ngrok
# Download dari https://ngrok.com/download

# Jalankan ngrok
ngrok http 3000

# Copy HTTPS URL
# Contoh: https://abc123.ngrok.io
```

### 2. Set Webhook di Midtrans Dashboard

1. Login ke [Midtrans Dashboard](https://dashboard.sandbox.midtrans.com)
2. Pilih **Settings** → **Configuration**
3. Set **Payment Notification URL**:
   ```
   https://abc123.ngrok.io/api/payment/callback
   ```
4. Klik **Save**

### 3. Buat Transaksi Real

1. Buka aplikasi via ngrok URL
2. Buat booking
3. Bayar menggunakan Midtrans Snap
4. Midtrans akan otomatis kirim callback ke endpoint kita

### 4. Monitor di Terminal

Log akan muncul di terminal saat Midtrans mengirim callback:

```
=== MIDTRANS CALLBACK RECEIVED ===
Timestamp: 2023-12-09T10:30:00.000Z
...
```

## ✅ Checklist Testing

- [ ] Server running di localhost:3000
- [ ] Booking sudah dibuat
- [ ] Booking Code dicatat
- [ ] Test endpoint accessibility (GET /api/payment/callback)
- [ ] Test dengan transaction status `settlement`
- [ ] Verify database updated (paymentStatus = Paid)
- [ ] Test dengan transaction status `cancel`
- [ ] Verify database updated (paymentStatus = Unpaid, status = Cancelled)
- [ ] Test dengan transaction status `pending`
- [ ] Check logs di terminal
- [ ] (Optional) Test dengan real Midtrans via ngrok

## 📝 Example Complete Test Flow

```powershell
# 1. Start server
npm run dev

# 2. Di browser, buat booking dan dapatkan booking code
# Contoh: BOOK-20231209-XYZ789

# 3. Test payment success
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/payment/test-callback" -ContentType "application/json" -Body '{"bookingCode":"BOOK-20231209-XYZ789","transactionStatus":"settlement"}'

# 4. Check result (should see success message)

# 5. Query database untuk verify
# Buka Supabase dashboard atau gunakan SQL client
SELECT * FROM "Booking" WHERE "bookingCode" = 'BOOK-20231209-XYZ789';

# 6. Expected: paymentStatus = 'Paid', status = 'Confirmed'
```

## 🎯 Success Criteria

Test berhasil jika:

✅ API response status 200  
✅ Response body contains `"success": true`  
✅ Database `paymentStatus` updated sesuai transaction status  
✅ Database `bookingStatus` updated sesuai transaction status  
✅ Motor status updated (jika applicable)  
✅ No error di terminal logs

## 💡 Tips

1. **Gunakan test endpoint** untuk development - Lebih mudah dan cepat
2. **Check logs** - Selalu monitor terminal untuk debug
3. **Test semua status** - Settlement, pending, cancel, expire
4. **Verify database** - Selalu check apakah data benar-benar terupdate
5. **Keep booking code** - Save booking code untuk testing berulang

## 🔗 Related Documentation

- [CALLBACK_API.md](./CALLBACK_API.md) - Dokumentasi lengkap API
- [TESTING_WEBHOOK.md](./TESTING_WEBHOOK.md) - Testing dengan webhook asli
- [MIDTRANS_INTEGRATION.md](./MIDTRANS_INTEGRATION.md) - Integrasi Midtrans

---

**Happy Testing! 🚀**

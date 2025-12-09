# Midtrans Payment Integration - Implementation Guide

## 📋 Overview

Complete integration of Midtrans payment gateway for the SJ Rental booking system. This implementation includes booking creation, payment processing via Midtrans Snap, and webhook handling for payment status updates.

## 🔑 Configuration

### Environment Variables (.env)

```env
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="your_key"
MIDTRANS_SERVER_KEY="your_key"
MIDTRANS_IS_PRODUCTION=false
```

- Client Key: Used in frontend for Snap popup
- Server Key: Used in backend for API calls
- Is Production: Set to `false` for sandbox testing

## 🗄️ Database Schema Changes

### Extended Booking Model

Added payment tracking fields to `prisma/schema.prisma`:

```prisma
model Booking {
  // ... existing fields ...

  // Payment fields
  paymentStatus   String    @default("Unpaid")  // Unpaid, Paid, Refunded
  paymentMethod   String?                        // credit_card, bank_transfer, etc.
  transactionId   String?                        // Midtrans transaction ID
  paymentUrl      String?                        // Snap payment URL
  paidAt          DateTime?                      // Payment completion timestamp
  notes           String?                        // Customer notes/special requests

  @@index([transactionId])
}
```

**Status**: Schema updated, Prisma client generated ✅
**Note**: Database connection failed - schema changes need to be pushed when database is accessible.

## 🔌 API Endpoints

### 1. POST /api/bookings - Create Booking

**Purpose**: Create new booking and initiate Midtrans payment

**Request Body**:

```json
{
  "motorId": 1,
  "userId": 2,
  "startDate": "2024-12-20T00:00:00.000Z",
  "endDate": "2024-12-25T00:00:00.000Z",
  "notes": "Optional special requests"
}
```

**Response**:

```json
{
  "booking": {
    "id": 1,
    "bookingCode": "SJ-1702998400000-1",
    "motorId": 1,
    "userId": 2,
    "startDate": "2024-12-20T00:00:00.000Z",
    "endDate": "2024-12-25T00:00:00.000Z",
    "totalPrice": 500000,
    "status": "Pending",
    "paymentStatus": "Unpaid",
    "transactionId": "midtrans-token-here",
    "paymentUrl": "https://app.sandbox.midtrans.com/snap/v3/..."
  },
  "payment": {
    "token": "midtrans-snap-token",
    "redirect_url": "https://app.sandbox.midtrans.com/snap/v3/..."
  }
}
```

**Features**:

- ✅ Validates motor availability
- ✅ Calculates total days and price
- ✅ Generates unique booking code (SJ-{timestamp}-{motorId})
- ✅ Creates Midtrans Snap transaction
- ✅ Returns payment token for frontend

### 2. GET /api/bookings - List Bookings

**Purpose**: Retrieve bookings with filters

**Query Parameters**:

- `userId` - Filter by user ID
- `status` - Filter by booking status
- `bookingCode` - Get specific booking by code

**Example**:

```
GET /api/bookings?userId=2
GET /api/bookings?bookingCode=SJ-1702998400000-1
GET /api/bookings?status=Confirmed
```

**Response**:

```json
{
  "bookings": [
    {
      "id": 1,
      "bookingCode": "SJ-1702998400000-1",
      "motor": {
        "id": 1,
        "brand": "Honda",
        "model": "PCX 160",
        "name": "Honda PCX 160 ABS",
        "image": "/motors/pcx.jpg"
      },
      "user": {
        "id": 2,
        "email": "customer@example.com",
        "fullName": "John Doe"
      }
      // ... other fields
    }
  ]
}
```

### 3. POST /api/bookings/webhook - Midtrans Webhook

**Purpose**: Handle payment notifications from Midtrans

**Midtrans Webhook URL**: `https://yourdomain.com/api/bookings/webhook`

**Security**: Verifies SHA512 signature hash

**Handled Transaction Statuses**:

- `capture` / `settlement` → Payment successful → Status: Paid, Motor: Rented
- `pending` → Payment pending → Status: Unpaid
- `deny` / `cancel` / `expire` → Payment failed → Status: Cancelled, Motor: Available
- `refund` → Payment refunded → Status: Refunded, Motor: Available

**Auto-Updates**:

- ✅ Booking payment status
- ✅ Motor availability status
- ✅ Payment timestamp (paidAt)

## 💻 Frontend Implementation

### Booking Page (`app/(customer)/booking/page.tsx`)

**Features**:

- ✅ Fetches available motors from `/api/motors?status=Available`
- ✅ Dynamic motor selection dropdown
- ✅ Date picker for rental period (start/end dates)
- ✅ Real-time price calculation
- ✅ Order summary with motor details
- ✅ Midtrans Snap SDK integration
- ✅ Payment popup handling

**Key Components**:

```tsx
// Midtrans Snap SDK loaded dynamically
useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
  script.setAttribute("data-client-key", clientKey);
  document.body.appendChild(script);
}, []);

// Open payment popup after booking creation
window.snap.pay(data.payment.token, {
  onSuccess: (result) => router.push(`/confirmation?booking=${bookingCode}`),
  onPending: (result) => router.push(`/confirmation?booking=${bookingCode}`),
  onError: (result) => alert("Payment failed"),
  onClose: () => alert("Payment cancelled"),
});
```

**Responsive Design**:

- Mobile-first layout with breakpoints: 360px → 640px → 768px → 1024px
- Grid layout: `lg:grid-cols-3` for form + sidebar
- Sticky order summary on desktop: `lg:sticky lg:top-4`

### Confirmation Page (`app/(customer)/confirmation/page.tsx`)

**Features**:

- ✅ Fetches booking details by bookingCode from URL
- ✅ Displays payment status with icons
- ✅ Shows booking details, motor info, customer info
- ✅ Transaction ID display
- ✅ Next steps guide for confirmed bookings
- ✅ Responsive layout for all devices

**URL Format**: `/confirmation?booking=SJ-1702998400000-1`

**Status Indicators**:

- 🟢 Paid → Green check icon → "Booking Confirmed!"
- 🟡 Unpaid → Yellow clock icon → "Payment is pending"
- 🔴 Refunded → Red X icon → "Booking cancelled and refunded"

## 🔄 Complete Booking Flow

1. **Customer Selects Motor** → Booking page loads available motors from API
2. **Customer Fills Form** → Select motor, dates, add notes
3. **Submit Booking** → POST to `/api/bookings`
4. **Backend Creates Transaction**:
   - Validates motor availability
   - Calculates total price
   - Calls Midtrans Snap API
   - Saves booking with payment URL
5. **Frontend Opens Payment** → Midtrans Snap popup appears
6. **Customer Pays** → Processes payment via Midtrans
7. **Midtrans Sends Webhook** → POST to `/api/bookings/webhook`
8. **Backend Updates Status**:
   - Updates booking paymentStatus to "Paid"
   - Updates motor status to "Rented"
   - Records payment timestamp
9. **Customer Redirected** → Confirmation page shows booking details

## 🧪 Testing

### Test Cards (Sandbox)

Midtrans provides test cards for sandbox testing:

**Successful Payment**:

- Card: 4811 1111 1111 1114
- CVV: 123
- Exp: 01/25

**Failed Payment**:

- Card: 4011 1111 1111 1112
- CVV: 123
- Exp: 01/25

### Testing Checklist

- [ ] Create booking with available motor
- [ ] Complete payment successfully → Check status changes
- [ ] Cancel payment → Check booking remains Unpaid
- [ ] Test webhook manually → Send POST to webhook URL
- [ ] Check motor status changes (Available ↔ Rented)
- [ ] Verify confirmation page displays correctly
- [ ] Test responsive design on mobile/tablet/desktop

## 🚀 Deployment Checklist

### Before Production:

1. **Update Environment Variables**:

   ```env
   MIDTRANS_IS_PRODUCTION=true
   NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="<production-client-key>"
   MIDTRANS_SERVER_KEY="<production-server-key>"
   ```

2. **Update Snap URL**:

   - Sandbox: `https://app.sandbox.midtrans.com/snap/snap.js`
   - Production: `https://app.midtrans.com/snap/snap.js`

3. **Configure Midtrans Webhook**:

   - Login to Midtrans Dashboard
   - Settings → Configuration → Notification URL
   - Set to: `https://yourdomain.com/api/bookings/webhook`

4. **Database Migration**:

   ```bash
   npx prisma migrate deploy
   # or
   npx prisma db push
   ```

5. **Test Production Payment**:
   - Use real credit card (small amount)
   - Verify webhook received
   - Check status updates work

### Security Notes:

- ✅ Server key kept secure (server-side only)
- ✅ Webhook signature verification implemented
- ✅ User authentication required for bookings
- ✅ Motor availability validated before booking

## 📝 API Documentation

### Midtrans Snap API

**Endpoint**: `https://app.sandbox.midtrans.com/snap/v1/transactions`

**Authentication**: Base64(ServerKey:)

**Request Example**:

```json
{
  "transaction_details": {
    "order_id": "SJ-1702998400000-1",
    "gross_amount": 500000
  },
  "customer_details": {
    "first_name": "John Doe",
    "email": "customer@example.com"
  },
  "item_details": [
    {
      "id": "1",
      "name": "Honda PCX 160",
      "price": 100000,
      "quantity": 5
    }
  ]
}
```

## 🐛 Troubleshooting

### Issue: Database Connection Failed

**Solution**: Database appears to be down/unreachable. Schema changes are ready but not pushed yet.

```bash
# When database is back online, run:
npx prisma db push
# or
npx prisma migrate deploy
```

### Issue: Payment Popup Not Opening

**Check**:

1. Midtrans Snap script loaded? (Check browser console)
2. Client key correct in .env?
3. `window.snap` available? (Add console.log)

### Issue: Webhook Not Working

**Check**:

1. Webhook URL configured in Midtrans Dashboard?
2. Server publicly accessible?
3. Signature verification passing?

### Issue: Motor Not Marked as Rented

**Check**:

1. Webhook received? (Check server logs)
2. Transaction status = "capture" or "settlement"?
3. Database update successful? (Check Prisma logs)

## 📦 Dependencies Added

- `date-fns` - Date formatting for confirmation page
- Midtrans Snap SDK (loaded via CDN)

## ✅ Implementation Status

**Completed**:

- ✅ Environment configuration
- ✅ Database schema extension
- ✅ Booking creation API with Midtrans integration
- ✅ Webhook handler for payment notifications
- ✅ Booking page with motor selection and payment
- ✅ Confirmation page with booking details
- ✅ Prisma client generation
- ✅ Responsive design (mobile-first)

**Pending** (requires database access):

- ⏳ Database migration to apply schema changes
- ⏳ Test complete booking flow end-to-end
- ⏳ Production deployment configuration

## 🔗 Related Files

- `app/api/bookings/route.ts` - Booking CRUD + Midtrans integration
- `app/api/bookings/webhook/route.ts` - Payment notification handler
- `app/(customer)/booking/page.tsx` - Customer booking form
- `app/(customer)/confirmation/page.tsx` - Payment confirmation
- `prisma/schema.prisma` - Database schema with payment fields
- `.env` - Midtrans credentials

## 📞 Support

For Midtrans support:

- Documentation: https://docs.midtrans.com
- Sandbox Dashboard: https://dashboard.sandbox.midtrans.com
- Production Dashboard: https://dashboard.midtrans.com

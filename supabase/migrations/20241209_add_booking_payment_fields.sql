-- Add payment fields to Booking table
ALTER TABLE "Booking" 
  ADD COLUMN IF NOT EXISTS "paymentStatus" TEXT NOT NULL DEFAULT 'Unpaid',
  ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT,
  ADD COLUMN IF NOT EXISTS "transactionId" TEXT,
  ADD COLUMN IF NOT EXISTS "paymentUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "paidAt" TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS "notes" TEXT,
  ADD COLUMN IF NOT EXISTS "totalDays" INTEGER;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "Booking_transactionId_idx" ON "Booking"("transactionId");
CREATE INDEX IF NOT EXISTS "Booking_paymentStatus_idx" ON "Booking"("paymentStatus");
CREATE INDEX IF NOT EXISTS "Booking_bookingCode_idx" ON "Booking"("bookingCode");

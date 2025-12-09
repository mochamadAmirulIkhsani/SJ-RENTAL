-- Manual Migration: Add Payment Fields to Booking Table
-- Run this SQL directly in Supabase SQL Editor
-- Navigate to: Supabase Dashboard > SQL Editor > New Query

-- Step 1: Add payment-related columns to Booking table
ALTER TABLE "Booking" 
  ADD COLUMN IF NOT EXISTS "paymentStatus" TEXT NOT NULL DEFAULT 'Unpaid',
  ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT,
  ADD COLUMN IF NOT EXISTS "transactionId" TEXT,
  ADD COLUMN IF NOT EXISTS "paymentUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "paidAt" TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS "notes" TEXT;

-- Step 2: Add totalDays column if not exists (for booking duration)
ALTER TABLE "Booking"
  ADD COLUMN IF NOT EXISTS "totalDays" INTEGER;

-- Step 3: Create index on transactionId for faster lookups
CREATE INDEX IF NOT EXISTS "Booking_transactionId_idx" ON "Booking"("transactionId");

-- Step 4: Create index on paymentStatus for filtering
CREATE INDEX IF NOT EXISTS "Booking_paymentStatus_idx" ON "Booking"("paymentStatus");

-- Step 5: Create index on bookingCode for webhook lookups
CREATE INDEX IF NOT EXISTS "Booking_bookingCode_idx" ON "Booking"("bookingCode");

-- Verification: Check if columns were added successfully
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'Booking'
  AND column_name IN ('paymentStatus', 'paymentMethod', 'transactionId', 'paymentUrl', 'paidAt', 'notes', 'totalDays')
ORDER BY ordinal_position;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Payment fields migration completed successfully!';
END $$;

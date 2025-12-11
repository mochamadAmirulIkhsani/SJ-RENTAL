-- Add index for booking availability checks
-- This improves performance when checking for double bookings

-- Index on motorId, status, startDate, endDate for faster conflict detection
CREATE INDEX IF NOT EXISTS idx_booking_availability 
ON "Booking" ("motorId", "status", "startDate", "endDate");

-- Index on booking date ranges for overlap checks
CREATE INDEX IF NOT EXISTS idx_booking_dates 
ON "Booking" ("startDate", "endDate");

-- Comment to explain the double booking prevention logic
COMMENT ON TABLE "Booking" IS 'Bookings table with double booking prevention. Check for overlapping bookings using: WHERE motorId = ? AND status IN (Pending, Paid, Active) AND startDate < ? AND endDate > ?';

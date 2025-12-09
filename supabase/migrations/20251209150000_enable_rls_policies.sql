-- Enable Row Level Security
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Motor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;

-- Create policies untuk User table
CREATE POLICY "Enable read access for authenticated users" ON "User"
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for authenticated users" ON "User"
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for users based on email" ON "User"
FOR UPDATE
TO authenticated
USING (auth.email() = email);

-- Create policies untuk Motor table
CREATE POLICY "Enable read access for all users" ON "Motor"
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Enable insert for authenticated users" ON "Motor"
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON "Motor"
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Enable delete for authenticated users" ON "Motor"
FOR DELETE
TO authenticated
USING (true);

-- Create policies untuk Booking table
CREATE POLICY "Enable read access for all users" ON "Booking"
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for authenticated users" ON "Booking"
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON "Booking"
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Enable delete for authenticated users" ON "Booking"
FOR DELETE
TO authenticated
USING (true);

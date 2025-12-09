-- Seed data for SJ Rental

-- Insert Users (with hashed passwords - bcrypt hash for 'admin123' and 'customer123')
INSERT INTO "User" (name, email, password, role, "createdAt", "updatedAt") VALUES
('Admin User', 'admin@sjrental.com', '$2a$10$YourHashedPasswordHere1', 'ADMIN', NOW(), NOW()),
('Customer Demo', 'customer@example.com', '$2a$10$YourHashedPasswordHere2', 'CUSTOMER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert Motors
INSERT INTO "Motor" (name, "plateNumber", type, cc, brand, model, year, color, status, location, "pricePerDay", "createdAt", "updatedAt") VALUES
('Honda Beat', 'B 1234 ABC', 'Automatic', '110cc', 'Honda', 'Beat', 2023, 'Red', 'Available', 'Central Office', 50000, NOW(), NOW()),
('Yamaha Mio', 'B 5678 DEF', 'Automatic', '125cc', 'Yamaha', 'Mio', 2023, 'Blue', 'Available', 'Central Office', 55000, NOW(), NOW()),
('Honda Vario 160', 'B 9012 GHI', 'Automatic', '160cc', 'Honda', 'Vario', 2024, 'Black', 'Available', 'South Branch', 75000, NOW(), NOW()),
('Yamaha Aerox', 'B 3456 JKL', 'Automatic', '155cc', 'Yamaha', 'Aerox', 2024, 'White', 'Rented', 'North Branch', 80000, NOW(), NOW()),
('Honda Scoopy', 'B 7890 MNO', 'Automatic', '110cc', 'Honda', 'Scoopy', 2023, 'Pink', 'Maintenance', 'Workshop', 50000, NOW(), NOW()),
('Yamaha NMAX', 'B 2345 PQR', 'Automatic', '155cc', 'Yamaha', 'NMAX', 2024, 'Gray', 'Available', 'Central Office', 85000, NOW(), NOW()),
('Honda PCX', 'B 6789 STU', 'Automatic', '160cc', 'Honda', 'PCX', 2024, 'Silver', 'Rented', 'East Branch', 90000, NOW(), NOW()),
('Yamaha Freego', 'B 0123 VWX', 'Automatic', '125cc', 'Yamaha', 'Freego', 2023, 'Blue', 'Available', 'West Branch', 60000, NOW(), NOW());

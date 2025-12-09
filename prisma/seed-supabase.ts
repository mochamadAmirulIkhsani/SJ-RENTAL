import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import "dotenv/config";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function main() {
  console.log("Start seeding with Supabase Client...");

  // Hash passwords
  const adminPassword = await hashPassword("admin123");
  const customerPassword = await hashPassword("customer123");

  // Seed users
  const users = [
    {
      name: "Admin User",
      email: "admin@sjrental.com",
      password: adminPassword,
      role: "ADMIN",
    },
    {
      name: "Customer Demo",
      email: "customer@example.com",
      password: customerPassword,
      role: "CUSTOMER",
    },
  ];

  for (const user of users) {
    const { data: existingUser } = await supabase.from('"User"').select("*").eq("email", user.email).single();

    if (!existingUser) {
      const { data, error } = await supabase.from('"User"').insert(user).select();

      if (error) {
        console.error(`Error creating user ${user.email}:`, error);
      } else {
        console.log(`Created user: ${user.email}`);
      }
    } else {
      console.log(`User already exists: ${user.email}`);
    }
  }

  // Seed Motors
  const motors = [
    {
      name: "Honda Beat",
      plateNumber: "B 1234 ABC",
      type: "Automatic",
      cc: "110cc",
      brand: "Honda",
      model: "Beat",
      year: 2023,
      color: "Red",
      status: "Available",
      location: "Central Office",
      pricePerDay: 50000,
    },
    {
      name: "Yamaha Mio",
      plateNumber: "B 5678 DEF",
      type: "Automatic",
      cc: "125cc",
      brand: "Yamaha",
      model: "Mio",
      year: 2023,
      color: "Blue",
      status: "Available",
      location: "Central Office",
      pricePerDay: 55000,
    },
    {
      name: "Honda Vario 160",
      plateNumber: "B 9012 GHI",
      type: "Automatic",
      cc: "160cc",
      brand: "Honda",
      model: "Vario",
      year: 2024,
      color: "Black",
      status: "Available",
      location: "South Branch",
      pricePerDay: 75000,
    },
    {
      name: "Yamaha Aerox",
      plateNumber: "B 3456 JKL",
      type: "Automatic",
      cc: "155cc",
      brand: "Yamaha",
      model: "Aerox",
      year: 2024,
      color: "White",
      status: "Rented",
      location: "North Branch",
      pricePerDay: 80000,
    },
    {
      name: "Honda Scoopy",
      plateNumber: "B 7890 MNO",
      type: "Automatic",
      cc: "110cc",
      brand: "Honda",
      model: "Scoopy",
      year: 2023,
      color: "Pink",
      status: "Maintenance",
      location: "Workshop",
      pricePerDay: 50000,
    },
    {
      name: "Yamaha NMAX",
      plateNumber: "B 2345 PQR",
      type: "Automatic",
      cc: "155cc",
      brand: "Yamaha",
      model: "NMAX",
      year: 2024,
      color: "Gray",
      status: "Available",
      location: "Central Office",
      pricePerDay: 85000,
    },
    {
      name: "Honda PCX",
      plateNumber: "B 6789 STU",
      type: "Automatic",
      cc: "160cc",
      brand: "Honda",
      model: "PCX",
      year: 2024,
      color: "Silver",
      status: "Rented",
      location: "East Branch",
      pricePerDay: 90000,
    },
    {
      name: "Yamaha Freego",
      plateNumber: "B 0123 VWX",
      type: "Automatic",
      cc: "125cc",
      brand: "Yamaha",
      model: "Freego",
      year: 2023,
      color: "Blue",
      status: "Available",
      location: "West Branch",
      pricePerDay: 60000,
    },
  ];

  for (const motor of motors) {
    const { data, error } = await supabase.from('"Motor"').insert(motor).select();

    if (error) {
      console.error(`Error creating motor ${motor.name}:`, error);
    } else {
      console.log(`Created motor: ${motor.name} - ${motor.plateNumber}`);
    }
  }

  console.log("Seeding finished.");
  console.log("\nLogin credentials:");
  console.log("Admin - Email: admin@sjrental.com, Password: admin123");
  console.log("Customer - Email: customer@example.com, Password: customer123");
}

main().catch(console.error);

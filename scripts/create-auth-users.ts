import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAuthUsers() {
  console.log("Creating auth users for existing database users...\n");

  const users = [
    {
      email: "admin@sjrental.com",
      password: "admin123",
      role: "ADMIN",
      name: "Admin User",
    },
    {
      email: "customer@example.com",
      password: "customer123",
      role: "CUSTOMER",
      name: "Customer Demo",
    },
  ];

  for (const user of users) {
    console.log(`Creating auth user for: ${user.email}`);

    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name: user.name,
        role: user.role,
      },
    });

    if (error) {
      console.error(`Error creating user ${user.email}:`, error.message);
    } else {
      console.log(`✅ Created auth user: ${user.email}`);
    }
  }

  console.log("\n✅ Auth users creation completed!");
  console.log("\nLogin credentials:");
  console.log("Admin - Email: admin@sjrental.com, Password: admin123");
  console.log("Customer - Email: customer@example.com, Password: customer123");
}

createAuthUsers().catch(console.error);

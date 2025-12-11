import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Your Account",
  description: "Create your free SJ Rental account & start renting. Access our full fleet, exclusive deals & seamless booking. Join thousands of happy riders!",
  keywords: ["register", "sign up", "create account", "daftar akun", "member registration"],
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Register | SJ Rental",
    description: "Create your free account & start renting. Access our fleet, deals & seamless booking experience.",
    type: "website",
    url: "https://sjrental.com/register",
  },
  alternates: {
    canonical: "https://sjrental.com/register",
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login to Your Account",
  description: "Login to your SJ Rental account. Manage bookings, view rental history & enjoy exclusive member benefits. Sign in now!",
  keywords: ["login", "sign in", "member login", "account access", "masuk akun"],
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Login | SJ Rental",
    description: "Login to your SJ Rental account. Manage bookings & view rental history.",
    type: "website",
    url: "https://sjrental.com/login",
  },
  alternates: {
    canonical: "https://sjrental.com/login",
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

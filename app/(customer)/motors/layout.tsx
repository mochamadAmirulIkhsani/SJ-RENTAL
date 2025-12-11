import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Available Motors for Rent",
  description: "Browse quality motorcycles for rent. Find your perfect bike with flexible daily, weekly or monthly options. Well-maintained & fully insured.",
  keywords: ["available motors", "motorcycle fleet", "bike selection", "motor catalog", "rent motorcycle", "sewa motor tersedia"],
  openGraph: {
    title: "Available Motors for Rent | SJ Rental",
    description: "Browse quality motorcycles available for rent in Indonesia. Flexible options & full insurance.",
    type: "website",
    url: "https://sjrental.com/motors",
  },
  alternates: {
    canonical: "https://sjrental.com/motors",
  },
};

export default function MotorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

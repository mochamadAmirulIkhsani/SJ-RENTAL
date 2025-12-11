import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Premium Motor Rental",
  description: "Premium motorcycle rentals in Indonesia. Browse our fleet, flexible periods & comprehensive insurance. Experience freedom on two wheels!",
  keywords: ["motor rental home", "motorcycle rental Indonesia", "premium bike rental", "sewa motor premium"],
  openGraph: {
    title: "SJ Rental - Premium Motor Rental Service",
    description: "Premium motorcycle rentals in Indonesia. Browse our fleet with flexible periods & full insurance.",
    type: "website",
    url: "https://sjrental.com/home",
  },
  alternates: {
    canonical: "https://sjrental.com/home",
  },
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return children;
}

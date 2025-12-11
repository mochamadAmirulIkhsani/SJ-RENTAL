import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Your Motor",
  description: "Book your motorcycle in just a few clicks. Choose your bike, select dates & confirm. Fast, easy & secure online booking system.",
  keywords: ["book motor", "motor booking", "rent motorcycle online", "reservasi motor", "booking sepeda motor"],
  openGraph: {
    title: "Book Your Motor Now | SJ Rental",
    description: "Book your motorcycle in clicks with our secure online system. Choose, select dates & confirm!",
    type: "website",
    url: "https://sjrental.com/booking",
  },
  alternates: {
    canonical: "https://sjrental.com/booking",
  },
};

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return children;
}

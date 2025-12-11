import type { Metadata } from "next";
import { Inter, Calistoga, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const calistoga = Calistoga({
  variable: "--font-calistoga",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sjrental.com"),
  title: {
    default: "SJ Rental - Premium Motor Rental Service in Indonesia",
    template: "%s | SJ Rental",
  },
  description: "Rent quality motorcycles in Indonesia. Flexible daily, weekly & monthly rentals with full insurance. Trusted by thousands - Book now!",
  keywords: ["motor rental", "motorcycle rental", "bike rental Indonesia", "sewa motor", "rental sepeda motor", "motor rental service", "affordable motor rental", "motorcycle hire", "motorbike rental", "scooter rental"],
  authors: [{ name: "SJ Rental" }],
  creator: "SJ Rental",
  publisher: "SJ Rental",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    url: "https://sjrental.com",
    title: "SJ Rental - Premium Motor Rental Service in Indonesia",
    description: "Rent quality motorcycles in Indonesia with flexible rental options and comprehensive insurance. Trusted by thousands - 5-star service.",
    siteName: "SJ Rental",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SJ Rental - Premium Motor Rental Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SJ Rental - Premium Motor Rental Service",
    description: "Quality motorcycle rentals in Indonesia. Flexible periods, full insurance & 5-star service. Book now!",
    images: ["/og-image.jpg"],
    creator: "@sjrental",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: "https://sjrental.com",
  },
  category: "Motor Rental Service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SJ Rental",
    description: "Premium motor rental service offering quality motorcycles with flexible rental options",
    url: "https://sjrental.com",
    logo: "https://sjrental.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: ["Indonesian", "English"],
    },
    sameAs: ["https://www.facebook.com/sjrental", "https://www.instagram.com/sjrental", "https://twitter.com/sjrental"],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1000",
      bestRating: "5",
      worstRating: "1",
    },
    offers: {
      "@type": "AggregateOffer",
      offerCount: "50",
      lowPrice: "50000",
      highPrice: "500000",
      priceCurrency: "IDR",
    },
  };

  return (
    <html lang="id">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <link rel="canonical" href="https://sjrental.com" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.variable} ${calistoga.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

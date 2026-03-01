import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "E-menu | 72 Shoes",
  description: "72Shoes - Online Ordering System",
  // This is what Telegram/Facebook looks for:
  openGraph: {
    title: "E-menu | 72 Shoes",
    description: "ការបញ្ជាទិញទំនិញតាមអនឡាញដែលងាយស្រួលបំផុត",
    url: 'https://72-shoes.vercel.app/',
    siteName: '72 shoes Accessory',
    images: [
      {
        url: 'https://github.com/Vireak-Sok/small-ecommerce-with-telegram-alert/blob/main/src/assets/logo.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'km_KH',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import dynamic from "next/dynamic";

const ToastContainer = dynamic(() => import("@/src/components/ToastContainer"), { ssr: false });
const LiveChatWidget = dynamic(() => import("@/src/components/LiveChatWidget"), { ssr: false });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TravelGo - Travel Booking Website",
  description: "Đặt tour du lịch dễ dàng với TravelGo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className="max-w-6xl mx-auto px-4">{children}</main>
        <Footer />
        <ToastContainer />
        <LiveChatWidget />
      </body>
    </html>
  );
}

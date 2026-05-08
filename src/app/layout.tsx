import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JustJobNG – Find Your Dream Job",
  description:
    "JustJobNG is a modern job portal connecting talented professionals with top employers worldwide. Browse 15,000+ jobs across all industries.",
  keywords: "jobs, hiring, careers, employment, job search, recruiters",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white text-gray-800">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

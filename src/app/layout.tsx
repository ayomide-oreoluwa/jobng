import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "jobNG – Find Your Next Job",
    template: "%s | jobNG",
  },
  description:
    "Nigeria's No. 1 job aggregrator platform. Browse live listings, apply to top Jobs, and grow your career. Subscribe via *7098#.",
  keywords: "jobs Nigeria, careers, employment, job search, jobNG, MTN jobs",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "jobNG – Find Your Next Job",
    description: "Browse live job listings across Nigeria.",
    siteName: "jobNG",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0F1C",
};

// app/layout.tsx

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`${plusJakarta.variable} ${dmSans.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="font-body antialiased min-h-screen flex flex-col bg-(--ink) text-(--surface)">
        <AuthProvider>
          <Navbar />
          {/* Added pt-(--spacing-nav-height) to push content below the fixed navbar */}
          <main className="grow pt-(--spacing-nav-height)">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
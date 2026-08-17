import { AuthProvider } from "@/context/AuthContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prep Interview",
  description:
    "Practice job-specific interview questions, track your response times, and prepare for top career opportunities.",
  openGraph: {
    title: "Prep Interview | jobNG",
    description: "Master job-specific interview questions on jobNG.",
    siteName: "jobNG",
    type: "website",
  },
};

export default function PrepInterviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="w-full min-h-[calc(100vh-var(--spacing-nav-height))] flex flex-col bg-(--ink) text-(--surface)">
        {children}
      </div>
    </AuthProvider>
  );
}
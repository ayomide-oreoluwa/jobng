"use client";

import { useEffect, useState } from "react";
import CountUp from "../shared/CountUp";
import { authHeaders } from "@/lib/auth-client";

// Hardcoded fallback count when the user is not logged in or on fetch error
const HARDCODED_FALLBACK_COUNT = 5000;

const fetchJobsCount = async (): Promise<number> => {
  try {
    const res = await fetch("/api/jobs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(), // Sends Bearer token if logged in
      },
      cache: "no-store",
    });

    // If 401 Unauthorized (not logged in), return hardcoded fallback without throwing
    if (res.status === 401) {
      return HARDCODED_FALLBACK_COUNT;
    }

    if (!res.ok) {
      return HARDCODED_FALLBACK_COUNT;
    }

    const data = await res.json();
    return typeof data.count === "number" && data.count > 0
      ? data.count
      : HARDCODED_FALLBACK_COUNT;
  } catch {
    // Network or server error -> fallback gracefully
    return HARDCODED_FALLBACK_COUNT;
  }
};

export default function AboutStats() {
  const [targetCount, setTargetCount] = useState<number | null>(null);

  useEffect(() => {
    let canceled = false;

    fetchJobsCount().then((nextCount) => {
      if (!canceled) {
        setTargetCount(nextCount);
      }
    });

    return () => {
      canceled = true;
    };
  }, []);

  return (
    <div>
      <div className="text-[2.5rem] font-extrabold text-[var(--ink)] mb-2 -tracking-[0.02em]">
        {targetCount === null ? (
          "..."
        ) : (
          <CountUp target={targetCount} suffix="+" className="inline" />
        )}
      </div>
      <div className="text-[var(--text-muted)] text-sm font-semibold uppercase tracking-widest">
        Active Listings
      </div>
    </div>
  );
}
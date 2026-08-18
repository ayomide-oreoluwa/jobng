"use client";

import { useEffect, useState } from "react";
import CountUp from "../shared/CountUp";
import { authHeaders } from "@/lib/auth-client";

const HARDCODED_FALLBACK_COUNT = 5000;

const fetchJobsCount = async (): Promise<number> => {
  try {
    const res = await fetch("/api/jobs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      cache: "no-store",
    });

    if (res.status === 401 || !res.ok) {
      return HARDCODED_FALLBACK_COUNT;
    }

    const data = await res.json();
    return typeof data.count === "number" && data.count > 0
      ? data.count
      : HARDCODED_FALLBACK_COUNT;
  } catch {
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
    <div className="flex flex-col items-center justify-center p-2 text-center">
      <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-1 min-h-[44px] flex items-center justify-center">
        {targetCount === null ? (
          <span className="inline-block w-20 h-8 rounded-lg bg-emerald-100/60 animate-pulse" />
        ) : (
          <CountUp target={targetCount} suffix="+" className="inline text-[#00A651]" />
        )}
      </div>
      <div className="text-slate-500 text-xs sm:text-sm font-extrabold uppercase tracking-widest">
        Active Listings
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import CountUp from "../shared/CountUp";

const fetchJobsCount = async () => {
  const res = await fetch("/api/jobs", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch jobs count");
  }

  const data = await res.json();
  return typeof data.count === "number" ? data.count : 0;
};

export default function AboutStats() {
  const [targetCount, setTargetCount] = useState<number | null>(null);

  useEffect(() => {
    let canceled = false;

    fetchJobsCount()
      .then((nextCount) => {
        if (!canceled) {
          setTargetCount(nextCount);
        }
      })
      .catch((error) => {
        console.error("Error fetching jobs count:", error);
        if (!canceled) {
          setTargetCount(0);
        }
      });

    return () => {
      canceled = true;
    };
  }, []);

  return (
    <div>
      <div className="text-[2.5rem] font-extrabold text-[var(--ink)] mb-2 -tracking-[0.02em]">
        {targetCount === null ? "0+" : <CountUp target={targetCount} suffix="+" className="inline" />}
      </div>
      <div className="text-[var(--text-muted)] text-sm font-semibold uppercase tracking-widest">
        Active Listings
      </div>
    </div>
  );
}

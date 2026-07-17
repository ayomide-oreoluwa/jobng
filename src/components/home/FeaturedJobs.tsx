"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import JobCard from "@/components/shared/JobCard";
import JobCardSkeleton from "@/components/shared/JobCardSkeleton";
import { authHeaders } from "@/lib/auth-client";
import type { ApiJob } from "@/lib/justjobApi";
import { FiArrowRight, FiLogIn } from "react-icons/fi";

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsAuth, setNeedsAuth] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/jobs?page=1&page_size=6", {
          headers: authHeaders(),
        });
        const data = await res.json();
        if (cancelled) return;
        if (res.status === 401) {
          setNeedsAuth(true);
          setJobs([]);
          return;
        }
        if (data.ok && Array.isArray(data.items)) {
          setJobs(data.items.slice(0, 6));
        }
      } catch {
        if (!cancelled) setJobs([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="jj-featured">
      <div className="container-xl">
        <div className="jj-featured__head">
          <div>
            <span className="jj-featured__eyebrow">Live Listings</span>
            <h2 className="jj-featured__title">Latest openings</h2>
            <p className="jj-featured__sub">Fresh roles from companies on JustJobNG</p>
          </div>
          {!needsAuth && jobs.length > 0 && (
            <Link href="/jobs" className="jj-btn jj-btn--ghost jj-featured__all">
              Browse all <FiArrowRight size={14} />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="jj-featured__grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <JobCardSkeleton key={i} variant="grid" />
            ))}
          </div>
        ) : needsAuth ? (
          <div className="jj-card jj-featured__auth">
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--gold-muted)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
              <FiLogIn size={26} style={{ color: "var(--gold)" }} />
            </div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 800, margin: "0 0 8px", color: "#fff" }}>Sign in to view jobs</h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: "0 0 1.25rem", lineHeight: 1.6 }}>
              Dial <strong style={{ color: "var(--gold)" }}>*7098#</strong> to subscribe, then log in to browse live listings.
            </p>
            <Link href="/login" className="jj-btn jj-btn--gold" style={{ padding: "10px 24px" }}>
              Login
            </Link>
          </div>
        ) : jobs.length === 0 ? null : (
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            style={{ paddingBottom: 48 }}
          >
            {jobs.map((job) => (
              <SwiperSlide key={job.job_id} style={{ height: "auto" }}>
                <JobCard job={job} variant="grid" />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      <style>{`
        .jj-featured { padding: 5rem 0; bg: #0A0A0C; }
        .jj-featured__head {
          display: flex; flex-wrap: wrap; align-items: flex-end;
          justify-content: space-between; gap: 1rem; margin-bottom: 2.5rem;
        }
        .jj-featured__eyebrow {
          display: block; font-size: 0.75rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.12em;
          color: var(--gold); margin-bottom: 8px;
        }
        .jj-featured__title {
          font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800;
          color: #fff; margin: 0 0 6px;
        }
        .jj-featured__sub { font-size: 0.9375rem; color: var(--text-muted); margin: 0; }
        .jj-featured__all { padding: 10px 18px; white-space: nowrap; border-color: var(--border-strong) !important; color: white !important; }
        .jj-featured__all:hover { bg: white/5 !important; }
        .jj-featured__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .jj-featured__auth {
          text-align: center; padding: 3rem 2rem; max-width: 480px; margin: 0 auto;
          bg: var(--surface-elevated) !important;
          border-color: var(--border) !important;
        }
      `}</style>
    </section>
  );
}

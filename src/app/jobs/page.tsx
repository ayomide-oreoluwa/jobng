/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { FiSearch, FiGrid, FiX, FiList, FiSquare, FiLogIn, FiRefreshCw } from "react-icons/fi";
import JobCard from "@/components/shared/JobCard";
import JobCardSkeleton from "@/components/shared/JobCardSkeleton";
import PageLoader from "@/components/shared/PageLoader";
import { authHeaders } from "@/lib/auth-client";
import { Apijustjob } from "@/lib/jobApi";

const CATEGORY_OPTIONS = ["Remote", "On-site", "Hybrid", "Full-time", "Part-time"];
const PAGE_SIZE = 20;

function JobsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get("q") ?? "");
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [jobs, setJobs] = useState<Apijustjob[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [needsAuth, setNeedsAuth] = useState(false);
  const [page, setPage] = useState(1);

  // Keep state in sync if search params change externally (e.g. browser back/forward buttons)
  useEffect(() => {
    const qParam = searchParams.get("q") ?? "";
    const catParam = searchParams.get("category") ?? "";
    setKeyword(qParam);
    setDebouncedKeyword(qParam);
    setCategory(catParam);
  }, [searchParams]);

  // Debounce search input updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  // Synchronize state back into the browser URL without triggering full page refreshes
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedKeyword) params.set("q", debouncedKeyword);
    if (category) params.set("category", category);

    const queryString = params.toString();
    const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(targetUrl, { scroll: false });
  }, [debouncedKeyword, category, pathname, router]);

  const fetchJobs = useCallback(async (signal: AbortSignal) => {
    setLoading(true);
    setError("");
    setNeedsAuth(false);
    try {
      const qs = new URLSearchParams();
      if (debouncedKeyword) qs.set("search", debouncedKeyword);
      if (category) qs.set("category", category);
      qs.set("page", String(page));
      qs.set("page_size", String(PAGE_SIZE));

      const res = await fetch(`/api/jobs?${qs.toString()}`, {
        headers: authHeaders(),
        signal,
      });
      const data = await res.json();

      if (res.status === 401 || data.requiresAuth) {
        setNeedsAuth(true);
        setJobs([]);
        setTotal(0);
        return;
      }

      if (!data.ok) {
        setError(data.error ?? "Could not load jobs from server.");
        setJobs([]);
        setTotal(0);
        return;
      }

      setJobs(data.items ?? []);
      setTotal(data.count ?? 0);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError("Network error occurred. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [debouncedKeyword, category, page]);

  useEffect(() => {
    const controller = new AbortController();
    fetchJobs(controller.signal);
    return () => controller.abort();
  }, [fetchJobs]);

  const resetFilters = () => {
    setKeyword("");
    setCategory("");
    setPage(1);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="jj-jobs-page">
      <div className="jj-jobs-hero">
        <div className="container-xl">
          <h1 className="jj-jobs-hero__title">Browse Jobs</h1>
          <p className="jj-jobs-hero__sub">
            {total > 0
              ? `${total.toLocaleString()} live Jobs across Nigeria`
              : "Live listings from the jobNG network"}
          </p>
        </div>
      </div>

      <div className="jj-jobs-toolbar">
        <div className="container-xl" style={{ padding: "12px 0" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            {/* Search Input */}
            <div className="jj-jobs-search" style={{ flex: "1 1 240px" }}>
              <FiSearch size={16} style={{ color: "var(--gold-hover)", flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Job title, company, or keywords..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                aria-label="Search job title or keywords"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "0.875rem",
                  color: "var(--text)",
                }}
              />
              {keyword && (
                <button
                  title="Clear search"
                  type="button"
                  onClick={() => setKeyword("")}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)" }}
                >
                  <FiX size={14} />
                </button>
              )}
            </div>

            {/* Category Select */}
            <div className="jj-jobs-search" style={{ flex: "0 1 200px" }}>
              <FiGrid size={14} style={{ color: "var(--gold-hover)", flexShrink: 0 }} />
              <select
                title="Filter by category"
                aria-label="Filter jobs by category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "0.875rem",
                  color: "var(--text)",
                  cursor: "pointer",
                }}
              >
                <option value="">All categories</option>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {category && (
                <button
                  title="Clear category filter"
                  type="button"
                  onClick={() => {
                    setCategory("");
                    setPage(1);
                  }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)", marginRight: 4 }}
                >
                  <FiX size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-xl" style={{ padding: "2rem 0 4rem" }}>
        {needsAuth ? (
          <div className="jj-card" style={{ textAlign: "center", padding: "4rem 2rem", maxWidth: 520, margin: "0 auto" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "var(--gold-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem",
              }}
            >
              <FiLogIn size={24} color="var(--gold-hover)" />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 8px", color: "var(--ink)" }}>
              Sign in to browse jobs
            </h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
              Sign in with your phone and PIN. New here? Dial <strong style={{ color: "var(--ink)" }}>*7098#</strong> to subscribe first.
            </p>
            <Link href={`/login?callbackUrl=${encodeURIComponent("/jobs")}`} className="jj-btn jj-btn--gold" style={{ padding: "12px 28px" }}>
              <FiLogIn size={16} /> Login
            </Link>
          </div>
        ) : loading ? (
          <div
            style={{
              display: viewMode === "grid" ? "grid" : "flex",
              gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(300px, 1fr))" : undefined,
              flexDirection: viewMode === "grid" ? undefined : "column",
              gap: 16,
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <JobCardSkeleton key={i} variant={viewMode} />
            ))}
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p style={{ color: "#ef4444", fontWeight: 600, marginBottom: 16 }}>{error}</p>
            <button
              type="button"
              onClick={() => fetchJobs(new AbortController().signal)}
              className="jj-btn jj-btn--gold"
              style={{ padding: "10px 24px", display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <FiRefreshCw size={14} /> Try again
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: 0 }}>
                Showing <strong style={{ color: "var(--ink)" }}>{jobs.length}</strong>
                {total > 0 && (
                  <>
                    {" "}
                    of <strong style={{ color: "var(--ink)" }}>{total.toLocaleString()}</strong>
                  </>
                )}
              </p>
              <div style={{ display: "flex", gap: 4, background: "var(--surface-elevated)", border: "1px solid var(--border)", borderRadius: 10, padding: 4 }}>
                {(["list", "grid"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    aria-label={`Switch to ${mode} view`}
                    onClick={() => setViewMode(mode)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 7,
                      border: "none",
                      cursor: "pointer",
                      background: viewMode === mode ? "var(--ink)" : "transparent",
                      color: viewMode === mode ? "#fff" : "var(--text-faint)",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {mode === "list" ? <FiList size={14} /> : <FiSquare size={14} />}
                  </button>
                ))}
              </div>
            </div>

            {jobs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 0" }}>
                <p style={{ fontSize: "2.5rem", marginBottom: 12 }}>🔍</p>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 800, margin: "0 0 6px" }}>No jobs found</h3>
                <p style={{ color: "var(--text-muted)", margin: "0 0 16px" }}>
                  We couldn&apos;t find any jobs matching your search criteria.
                </p>
                {(keyword || category) && (
                  <button type="button" onClick={resetFilters} className="jj-btn jj-btn--ghost" style={{ padding: "8px 20px" }}>
                    Clear search & filters
                  </button>
                )}
              </div>
            ) : (
              <div
                style={{
                  display: viewMode === "grid" ? "grid" : "flex",
                  gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(300px, 1fr))" : undefined,
                  flexDirection: viewMode === "grid" ? undefined : "column",
                  gap: 16,
                }}
              >
                {jobs.map((job) => (
                  <JobCard key={job.job_id} job={job} variant={viewMode} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 32 }}>
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="jj-btn jj-btn--ghost"
                  style={{ padding: "8px 18px", opacity: page <= 1 ? 0.4 : 1 }}
                >
                  Previous
                </button>
                <span style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontWeight: 600 }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="jj-btn jj-btn--ghost"
                  style={{ padding: "8px 18px", opacity: page >= totalPages ? 0.4 : 1 }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading jobs" />}>
      <JobsContent />
    </Suspense>
  );
}
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  FiSearch,
  FiX,
  FiList,
  FiSquare,
  FiLogIn,
  FiRefreshCw,
  FiSliders,
  FiChevronDown,
} from "react-icons/fi";
import JobCard from "@/components/shared/JobCard";
import JobCardSkeleton from "@/components/shared/JobCardSkeleton";
import PageLoader from "@/components/shared/PageLoader";
import { authHeaders } from "@/lib/auth-client";
import { Apijustjob } from "@/lib/jobApi";

const CATEGORY_OPTIONS = ["Remote", "On-site", "Hybrid", "Full-time", "Part-time"];
const PAGE_SIZE = 15;

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

  // Sync state with URL search params
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

  // Synchronize state back into the browser URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedKeyword) params.set("q", debouncedKeyword);
    if (category) params.set("category", category);

    const queryString = params.toString();
    const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(targetUrl, { scroll: false });
  }, [debouncedKeyword, category, pathname, router]);

  const fetchJobs = useCallback(
    async (signal: AbortSignal) => {
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
    },
    [debouncedKeyword, category, page]
  );

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
  const activeFiltersCount = (keyword ? 1 : 0) + (category ? 1 : 0);

  return (
    <div className="jj-jobs-page min-h-screen bg-slate-50/60">
      {/* Hero Header */}
      <div className="jj-jobs-hero relative overflow-hidden bg-gradient-to-br from-[#00A651] via-[#00863F] to-[#005e2b] pt-10 pb-14 sm:pt-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
        <div className="container-xl max-w-7xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white backdrop-blur-md mb-3 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            Live Job Index
          </span>
          <h1 className="jj-jobs-hero__title text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Explore Opportunities
          </h1>
          <p className="jj-jobs-hero__sub text-sm sm:text-base text-emerald-50/90 mt-2 max-w-xl font-normal">
            {total > 0
              ? `${total.toLocaleString()} active roles available across Nigeria`
              : "Connecting verified talent with premier roles on jobNG"}
          </p>
        </div>
      </div>

      {/* Floating Modern Search & Category Toolbar */}
      <div className="sticky top-0 z-20 px-4 sm:px-6 lg:px-8 -mt-7 sm:-mt-9">
        <div className="container-xl max-w-7xl mx-auto">
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-3.5 sm:p-5 shadow-xl shadow-slate-900/5 transition-all">
            {/* Search Input Bar */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
              <div className="relative flex-1 flex items-center bg-slate-50 hover:bg-slate-100/80 border border-slate-200 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10 rounded-xl transition-all duration-200">
                <FiSearch size={20} className="text-slate-400 shrink-0 ml-3.5" />
                <input
                  type="text"
                  placeholder="Job title, tech stack, company, or keywords..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  aria-label="Search job title or keywords"
                  className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-800 placeholder-slate-400 focus:ring-0 px-3 py-2.5 sm:py-3"
                />
                {keyword && (
                  <button
                    title="Clear search"
                    type="button"
                    onClick={() => setKeyword("")}
                    className="mr-2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-all"
                  >
                    <FiX size={16} />
                  </button>
                )}
              </div>

              {/* Active Filter Clear Tag (Desktop) */}
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors shrink-0 border border-rose-200/60"
                >
                  <FiX size={14} /> Clear {activeFiltersCount} {activeFiltersCount === 1 ? "filter" : "filters"}
                </button>
              )}
            </div>

            {/* Mobile Premium Category Dropdown */}
            <div className="md:hidden mt-3 pt-3 border-t border-slate-100 flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">
                <FiSliders size={14} className="text-[#00A651]" />
                <span>Workplace:</span>
              </div>
              <div className="relative flex-1">
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                  aria-label="Filter by workplace type"
                  className="w-full appearance-none bg-slate-50 hover:bg-slate-100/70 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl pl-3.5 pr-8 py-2.5 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all cursor-pointer shadow-sm"
                >
                  <option value="">All Roles</option>
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <FiChevronDown
                  size={16}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>

              {/* Mobile Clear Button */}
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  title="Clear filters"
                  className="inline-flex items-center justify-center p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl shrink-0 border border-rose-200/60 transition-colors"
                >
                  <FiX size={15} />
                </button>
              )}
            </div>

            {/* Desktop Category Pill Filters */}
            <div className="hidden md:flex mt-3.5 pt-3.5 border-t border-slate-100 items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                <FiSliders size={14} className="text-slate-400" />
                <span>Workplace:</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCategory("");
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  category === ""
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                }`}
              >
                All Roles
              </button>

              {CATEGORY_OPTIONS.map((c) => {
                const isActive = category === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCategory(isActive ? "" : c);
                      setPage(1);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer border ${
                      isActive
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
                        : "bg-slate-100/80 text-slate-600 border-transparent hover:bg-slate-200/80 hover:text-slate-900"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="container-xl max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pt-10 sm:pb-16">
        {needsAuth ? (
          <div className="jj-card text-center py-12 px-6 max-w-md mx-auto bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <FiLogIn size={26} className="text-[#00A651]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Sign in to browse jobs
            </h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Sign in with your phone and PIN. New here? Dial <strong className="text-slate-900">*7098#</strong> to subscribe first.
            </p>
            <Link
              href={`/login?callbackUrl=${encodeURIComponent("/jobs")}`}
              className="jj-btn jj-btn--gold inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3 text-sm font-semibold text-white bg-[#00A651] hover:bg-[#00863F] rounded-xl transition-colors shadow-md shadow-emerald-600/15"
            >
              <FiLogIn size={18} /> Login
            </Link>
          </div>
        ) : loading ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                : "flex flex-col gap-4"
            }
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <JobCardSkeleton key={i} variant={viewMode} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200/80">
            <p className="text-rose-500 font-semibold mb-4 text-sm sm:text-base">{error}</p>
            <button
              type="button"
              onClick={() => fetchJobs(new AbortController().signal)}
              className="jj-btn jj-btn--gold inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-[#00A651] hover:bg-[#00863F] rounded-xl transition-colors"
            >
              <FiRefreshCw size={16} /> Try again
            </button>
          </div>
        ) : (
          <>
            {/* View Header & View Mode Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <p className="text-sm text-slate-600">
                Showing <strong className="text-slate-900 font-semibold">{jobs.length}</strong>
                {total > 0 && (
                  <>
                    {" "}of <strong className="text-slate-900 font-semibold">{total.toLocaleString()}</strong>
                  </>
                )}
              </p>

              <div className="self-start sm:self-auto flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl border border-slate-200/80">
                {(["list", "grid"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    aria-label={`Switch to ${mode} view`}
                    onClick={() => setViewMode(mode)}
                    className={`p-2 rounded-lg transition-all flex items-center justify-center ${
                      viewMode === mode
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {mode === "list" ? <FiList size={16} /> : <FiSquare size={16} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Grid / List */}
            {jobs.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200/80">
                <p className="text-4xl mb-3">🔍</p>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No jobs found</h3>
                <p className="text-sm text-slate-600 mb-5">
                  We couldn&apos;t find any jobs matching your search criteria.
                </p>
                {(keyword || category) && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="jj-btn jj-btn--ghost px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors"
                  >
                    Clear search & filters
                  </button>
                )}
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                    : "flex flex-col gap-4"
                }
              >
                {jobs.map((job) => (
                  <JobCard key={job.job_id} job={job} variant={viewMode} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="jj-btn jj-btn--ghost min-h-[40px] px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-600 font-semibold px-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="jj-btn jj-btn--ghost min-h-[40px] px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
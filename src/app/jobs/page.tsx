/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FiSearch, FiX, FiLogIn, FiArrowUpRight, FiBriefcase,
  FiCalendar, FiZap, FiFilter, FiBookmark, FiExternalLink,
  FiCheck, FiCode, FiMapPin, FiDollarSign,
} from "react-icons/fi";
import { authHeaders } from "@/lib/auth-client";
import type { ApiJob } from "@/lib/justjobApi";
import { stripHtml } from "@/lib/html";
import PageLoader from "@/components/shared/PageLoader";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Tech Stack Badge guesser ─────────────────────────────── */
const TECH_STACKS: Record<string, string> = {
  react: "#61DAFB", typescript: "#3178C6", python: "#3776AB",
  "next.js": "#FFFFFF", nextjs: "#FFFFFF", django: "#092E20",
  node: "#339933", nodejs: "#339933", javascript: "#F7DF1E",
  aws: "#FF9900", docker: "#2496ED", vue: "#42B883",
  angular: "#DD0031", rust: "#DEA584", golang: "#00ADD8",
  java: "#ED8B00", php: "#777BB4", laravel: "#FF2D20",
  tailwind: "#06B6D4", figma: "#F24E1E", sql: "#CC2927",
  mongodb: "#47A248", graphql: "#E10098", flutter: "#02569B",
};

function guessStack(text: string): { name: string; color: string }[] {
  const lower = text.toLowerCase();
  return Object.entries(TECH_STACKS)
    .filter(([k]) => lower.includes(k))
    .slice(0, 4)
    .map(([k, color]) => ({ name: k.charAt(0).toUpperCase() + k.slice(1), color }));
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff}d ago`;
    return d.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
  } catch { return iso; }
}

function companyInitial(name: string) {
  return name?.trim().charAt(0).toUpperCase() || "J";
}

/* ─── Quick Apply Modal ─────────────────────────────────────── */
function QuickApplyModal({ job, onClose }: { job: ApiJob; onClose: () => void }) {
  const applyUrl = job.job_url;
  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-[60] backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.aside
        key="panel"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-[460px] bg-[#121215] border-l border-[var(--border)] flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--gold-muted)] flex items-center justify-center font-black text-[var(--gold)] text-base shrink-0">
              {companyInitial(job.company_name)}
            </div>
            <div>
              <p className="text-[13px] font-bold text-white leading-tight line-clamp-1">{job.job_title}</p>
              <p className="text-[11px] text-[var(--text-muted)]">{job.company_name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors" aria-label="Close">
            <FiX size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div className="bg-[var(--gold-muted)] border border-[var(--gold)]/20 rounded-xl p-4">
            <p className="text-[12px] font-bold uppercase tracking-wider text-[var(--gold)] mb-1">Quick Apply</p>
            <p className="text-[13px] text-white/80 leading-relaxed">
              Ready to send your application? Click the button below to apply directly on the company&apos;s portal.
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[13px] text-[var(--text-muted)]">
              <FiBriefcase size={14} className="text-[var(--gold)]" />
              <span className="font-semibold text-white">{job.category ?? "General"}</span>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-[var(--text-muted)]">
              <FiCalendar size={14} className="text-[var(--gold)]" />
              <span>Posted {formatDate(job.created_at)}</span>
            </div>
          </div>

          {/* Stack */}
          {(() => {
            const stack = guessStack(`${job.job_title ?? ""} ${job.description ?? ""} ${job.category ?? ""}`);
            return stack.length > 0 ? (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Tech Stack</p>
                <div className="flex flex-wrap gap-2">
                  {stack.map((s) => (
                    <span key={s.name} className="flex items-center gap-1.5 bg-white/5 border border-[var(--border)] rounded-full px-3 py-1 text-[12px] font-semibold text-white">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            ) : null;
          })()}

          {/* Description Preview */}
          {job.description && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Role Overview</p>
              <p className="text-[13px] text-[var(--text-muted)] leading-relaxed line-clamp-6">
                {stripHtml(job.description)}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-5 border-t border-[var(--border)] space-y-3">
          {applyUrl ? (
            <a
              href={applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[var(--gold)] text-[var(--ink)] font-bold text-[14px] rounded-xl py-3.5 hover:bg-[var(--gold-light)] transition-colors shadow-[var(--shadow-gold)]"
            >
              Apply Now <FiExternalLink size={15} />
            </a>
          ) : (
            <div className="text-center py-2">
              <p className="text-[12px] text-[var(--text-muted)]">Contact the company directly to apply.</p>
            </div>
          )}
          <Link
            href={`/jobs/${job.job_id}`}
            className="flex items-center justify-center gap-2 w-full bg-white/5 border border-[var(--border)] text-white font-semibold text-[13px] rounded-xl py-3 hover:bg-white/10 transition-colors no-underline"
          >
            View full details <FiArrowUpRight size={13} />
          </Link>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}

/* ─── Bento Job Card ─────────────────────────────────────────── */
function BentoJobCard({ job, onApply, saved, onToggleSave }: {
  job: ApiJob;
  onApply: (job: ApiJob) => void;
  saved: boolean;
  onToggleSave: (id: string) => void;
}) {
  const stack = guessStack(`${job.job_title ?? ""} ${job.description ?? ""} ${job.category ?? ""}`);
  const excerpt = stripHtml(job.description ?? "");
  // eslint-disable-next-line react-hooks/purity
  const salaryLevel = Math.floor(Math.random() * 60) + 30; // visual demo indicator

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group bg-[#121215] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--gold)]/30 hover:shadow-[0_0_24px_rgba(212,255,63,0.06)] transition-all duration-300 flex flex-col gap-4"
    >
      {/* Top Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-[var(--gold-muted)] border border-[var(--gold)]/20 flex items-center justify-center font-black text-[var(--gold)] text-base shrink-0">
            {companyInitial(job.company_name)}
          </div>
          <div className="min-w-0">
            <Link
              href={`/jobs/${job.job_id}`}
              className="text-[14px] font-bold text-white no-underline hover:text-[var(--gold)] transition-colors line-clamp-2 leading-tight"
            >
              {job.job_title ?? "Untitled Role"}
            </Link>
            <p className="text-[12px] text-[var(--text-muted)] mt-0.5 truncate">{job.company_name}</p>
          </div>
        </div>
        <button
          onClick={() => onToggleSave(job.job_id)}
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
            saved
              ? "bg-[var(--gold-muted)] text-[var(--gold)]"
              : "bg-white/5 text-[var(--text-muted)] hover:text-white hover:bg-white/10"
          }`}
          title={saved ? "Unsave" : "Save"}
        >
          <FiBookmark size={13} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Tech Stack Badges */}
      {stack.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {stack.map((s) => (
            <span
              key={s.name}
              className="flex items-center gap-1 bg-white/[0.04] border border-[var(--border)] rounded-full px-2.5 py-1 text-[11px] font-semibold text-[var(--text-muted)] group-hover:border-[var(--border-strong)] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
              {s.name}
            </span>
          ))}
        </div>
      )}

      {/* Excerpt */}
      {excerpt && (
        <p className="text-[12px] text-[var(--text-muted)] leading-relaxed line-clamp-2">{excerpt}</p>
      )}

      {/* Salary Level Visual Indicator */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[var(--text-faint)] font-medium flex items-center gap-1">
            <FiDollarSign size={11} /> Comp. range estimate
          </span>
          <span className="text-[var(--gold)] font-bold">{salaryLevel > 60 ? "High" : salaryLevel > 40 ? "Mid" : "Entry"}</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)] rounded-full transition-all"
            style={{ width: `${salaryLevel}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-[var(--border)]">
        <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-faint)]">
          {job.category && (
            <span className="flex items-center gap-1">
              <FiBriefcase size={11} className="text-[var(--gold)]" />
              {job.category}
            </span>
          )}
          <span className="text-[var(--border-strong)]">·</span>
          <span className="flex items-center gap-1">
            <FiCalendar size={11} />
            {formatDate(job.created_at)}
          </span>
        </div>
        <button
          onClick={() => onApply(job)}
          className="flex items-center gap-1.5 bg-[var(--gold)] text-[var(--ink)] font-bold text-[11px] px-3 py-1.5 rounded-lg hover:bg-[var(--gold-light)] transition-colors shadow-[var(--shadow-gold)]"
        >
          <FiZap size={11} /> Quick Apply
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Filter Toggle ──────────────────────────────────────────── */
function FilterToggle({ label, icon: Icon, active, onToggle }: {
  label: string;
  icon: React.ElementType;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
        active
          ? "bg-[var(--gold-muted)] border border-[var(--gold)]/30 text-[var(--gold)]"
          : "bg-white/[0.03] border border-[var(--border)] text-[var(--text-muted)] hover:bg-white/5 hover:text-white hover:border-[var(--border-strong)]"
      }`}
    >
      <Icon size={13} />
      <span className="flex-1 text-left">{label}</span>
      {active && <FiCheck size={12} />}
    </button>
  );
}

/* ─── Main Content ───────────────────────────────────────────── */
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Tech: FiCode, Engineering: FiCode, Finance: FiDollarSign,
  Marketing: FiZap, Remote: FiMapPin, Healthcare: FiBriefcase,
  Education: FiBriefcase, Design: FiZap,
};

function JobsContent() {
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("q") ?? "");
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());
  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [needsAuth, setNeedsAuth] = useState(false);
  const [page, setPage] = useState(1);
  const [applyJob, setApplyJob] = useState<ApiJob | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    setNeedsAuth(false);
    try {
      const qs = new URLSearchParams();
      if (keyword) qs.set("search", keyword);
      qs.set("page", String(page));
      qs.set("page_size", "20");
      const res = await fetch(`/api/jobs?${qs}`, { headers: authHeaders() });
      const data = await res.json();
      if (res.status === 401 || data.requiresAuth) { setNeedsAuth(true); setJobs([]); return; }
      if (!data.ok) { setError(data.error ?? "Could not load jobs."); setJobs([]); return; }
      setJobs(data.items ?? []);
      setTotal(data.count ?? 0);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [keyword, page]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const categories = Array.from(new Set(jobs.map((j) => j.category).filter(Boolean) as string[])).sort();

  const filteredJobs = activeCategories.size > 0
    ? jobs.filter((j) => j.category && activeCategories.has(j.category))
    : jobs;

  const toggleCategory = (cat: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const savedJobs = jobs.filter((j) => savedIds.has(j.job_id));
  const [matchScore] = useState(() => Math.floor(Math.random() * 20) + 78); // UI demo

  return (
    <div className="min-h-screen bg-[#0A0A0C]">
      {/* Quick Apply Modal */}
      {applyJob && <QuickApplyModal job={applyJob} onClose={() => setApplyJob(null)} />}

      {/* Page Header */}
      <div className="border-b border-[var(--border)] bg-[#0A0A0C]/80 backdrop-blur-md sticky top-[var(--nav-height)] z-30">
        <div className="container-xl py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-lg">
              <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--gold)]" />
              <input
                type="text"
                placeholder="Search roles, companies, stacks..."
                value={keyword}
                onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
                className="w-full bg-[#121215] border border-[var(--border)] rounded-xl pl-10 pr-4 py-2.5 text-[13px] text-white placeholder-[var(--text-faint)] outline-none focus:border-[var(--gold)] focus:shadow-[0_0_0_3px_rgba(212,255,63,0.1)] transition-all"
              />
              {keyword && (
                <button onClick={() => setKeyword("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)] hover:text-white">
                  <FiX size={14} />
                </button>
              )}
            </div>
            <span className="hidden sm:flex items-center gap-1.5 text-[12px] text-[var(--text-muted)] bg-[#121215] border border-[var(--border)] rounded-xl px-3 py-2.5">
              <FiFilter size={13} className="text-[var(--gold)]" />
              {total > 0 ? `${total.toLocaleString()} roles` : "All roles"}
            </span>
          </div>
        </div>
      </div>

      {/* Bento 3-Column Grid */}
      <div className="container-xl py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_240px] gap-6">

          {/* ── Left Column: Filter Panel ─────────── */}
          <aside className="space-y-5">
            <div className="bg-[#121215] border border-[var(--border)] rounded-xl p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-faint)] mb-3">Categories</p>
              <div className="space-y-1.5">
                {categories.length === 0 && !loading ? (
                  <p className="text-[12px] text-[var(--text-faint)]">Load jobs to filter</p>
                ) : categories.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat] ?? FiBriefcase;
                  return (
                    <FilterToggle
                      key={cat}
                      label={cat}
                      icon={Icon}
                      active={activeCategories.has(cat)}
                      onToggle={() => toggleCategory(cat)}
                    />
                  );
                })}
              </div>
              {activeCategories.size > 0 && (
                <button
                  onClick={() => setActiveCategories(new Set())}
                  className="mt-3 w-full text-[11px] text-[var(--text-faint)] hover:text-[var(--gold)] font-semibold text-left transition-colors"
                >
                  Clear filters ({activeCategories.size})
                </button>
              )}
            </div>

            {/* Location Pill Filters */}
            <div className="bg-[#121215] border border-[var(--border)] rounded-xl p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-faint)] mb-3">Location</p>
              <div className="flex flex-wrap gap-2">
                {["Remote", "Lagos", "Abuja", "Port Harcourt", "Anywhere"].map((loc) => (
                  <button
                    key={loc}
                    className="flex items-center gap-1 bg-white/[0.04] border border-[var(--border)] rounded-full px-2.5 py-1 text-[11px] text-[var(--text-muted)] hover:border-[var(--gold)]/40 hover:text-[var(--gold)] transition-all font-medium"
                  >
                    <FiMapPin size={10} /> {loc}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Center Column: Job Feed ───────────── */}
          <main className="space-y-4 min-w-0">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <p className="text-[13px] text-[var(--text-muted)]">
                Showing <span className="text-white font-bold">{filteredJobs.length}</span>
                {total > 0 && <> of <span className="text-white font-bold">{total.toLocaleString()}</span> roles</>}
              </p>
              {page > 1 && (
                <span className="text-[11px] text-[var(--text-faint)] font-semibold bg-[#121215] border border-[var(--border)] rounded-lg px-2.5 py-1">
                  Page {page}
                </span>
              )}
            </div>

            {needsAuth ? (
              <div className="bg-[#121215] border border-[var(--border)] rounded-xl p-10 text-center">
                <div className="w-14 h-14 rounded-xl bg-[var(--gold-muted)] flex items-center justify-center mx-auto mb-4">
                  <FiLogIn size={24} className="text-[var(--gold)]" />
                </div>
                <h3 className="text-[18px] font-bold text-white mb-2">Sign in to browse jobs</h3>
                <p className="text-[13px] text-[var(--text-muted)] mb-5 leading-relaxed max-w-xs mx-auto">
                  Sign in with your phone and PIN. New here? Dial <strong className="text-[var(--gold)]">*7098#</strong> to subscribe first.
                </p>
                <Link href={`/login?callbackUrl=${encodeURIComponent("/jobs")}`} className="jj-btn jj-btn--gold px-6 py-3">
                  <FiLogIn size={15} /> Login
                </Link>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-1 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-[#121215] border border-[var(--border)] rounded-xl p-5 animate-pulse space-y-3">
                    <div className="flex gap-3">
                      <div className="w-11 h-11 rounded-xl bg-white/5" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-white/5 rounded w-2/3" />
                        <div className="h-3 bg-white/5 rounded w-1/3" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {[60, 80, 50].map((w) => <div key={w} className="h-5 bg-white/5 rounded-full" style={{ width: w }} />)}
                    </div>
                    <div className="h-3 bg-white/5 rounded" />
                    <div className="h-3 bg-white/5 rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-[#121215] border border-[var(--border)] rounded-xl p-8 text-center">
                <p className="text-red-400 mb-4 text-sm">{error}</p>
                <button onClick={fetchJobs} className="jj-btn jj-btn--gold px-5 py-2.5">Retry</button>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="bg-[#121215] border border-[var(--border)] rounded-xl p-10 text-center">
                <p className="text-4xl mb-3">🔍</p>
                <h3 className="text-[16px] font-bold text-white mb-2">No roles found</h3>
                <p className="text-[13px] text-[var(--text-muted)]">Try a different search term or clear your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredJobs.map((job) => (
                  <BentoJobCard
                    key={job.job_id}
                    job={job}
                    onApply={setApplyJob}
                    saved={savedIds.has(job.job_id)}
                    onToggleSave={toggleSave}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {total > jobs.length && !loading && !needsAuth && (
              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 text-[13px] font-semibold rounded-lg bg-[#121215] border border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:border-[var(--border-strong)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  ← Prev
                </button>
                <span className="text-[12px] text-[var(--text-muted)] font-medium">Page {page}</span>
                <button
                  disabled={jobs.length < 18}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 text-[13px] font-semibold rounded-lg bg-[#121215] border border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:border-[var(--border-strong)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </main>

          {/* ── Right Column: Insights Panel ─────── */}
          <aside className="space-y-5">
            {/* Match Score */}
            <div className="bg-[#121215] border border-[var(--border)] rounded-xl p-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-faint)] mb-4">Profile Match</p>
              <div className="flex flex-col items-center gap-3">
                {/* Radial SVG */}
                <div className="relative w-24 h-24">
                  <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90" fill="none">
                    <circle cx="18" cy="18" r="15.9" stroke="#1F1F24" strokeWidth="2.5" />
                    <circle
                      cx="18" cy="18" r="15.9"
                      stroke="var(--gold)"
                      strokeWidth="2.5"
                      strokeDasharray={`${matchScore} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[22px] font-black text-white">{matchScore}%</span>
                  </div>
                </div>
                <p className="text-[12px] text-[var(--text-muted)] text-center leading-relaxed">
                  Strong alignment with current listings. Complete your profile to improve matches.
                </p>
                <Link href="/login" className="w-full flex items-center justify-center gap-1.5 bg-[var(--gold-muted)] border border-[var(--gold)]/20 text-[var(--gold)] font-semibold text-[12px] py-2 rounded-lg hover:bg-[var(--gold-muted)]/80 transition-colors no-underline">
                  <FiZap size={12} /> Boost Match
                </Link>
              </div>
            </div>

            {/* Saved Jobs */}
            <div className="bg-[#121215] border border-[var(--border)] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-faint)]">Saved Roles</p>
                <span className="text-[11px] font-bold text-[var(--gold)] bg-[var(--gold-muted)] rounded-full px-2 py-0.5">{savedJobs.length}</span>
              </div>
              {savedJobs.length === 0 ? (
                <p className="text-[12px] text-[var(--text-faint)] text-center py-3">
                  Bookmark roles using the <FiBookmark className="inline" size={11} /> icon
                </p>
              ) : (
                <div className="space-y-2">
                  {savedJobs.slice(0, 4).map((j) => (
                    <Link key={j.job_id} href={`/jobs/${j.job_id}`} className="flex items-center gap-2 no-underline group">
                      <div className="w-7 h-7 rounded-lg bg-[var(--gold-muted)] flex items-center justify-center text-[var(--gold)] font-bold text-[11px] shrink-0">
                        {companyInitial(j.company_name)}
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] group-hover:text-white transition-colors line-clamp-1">{j.job_title}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-[#121215] border border-[var(--border)] rounded-xl p-5 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-faint)]">Market Snapshot</p>
              {[
                { label: "Active listings", value: total > 0 ? total.toLocaleString() : "300+" },
                { label: "Remote roles", value: "48%" },
                { label: "Tech sector", value: "62%" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[12px] text-[var(--text-muted)]">{label}</span>
                  <span className="text-[12px] font-bold text-white">{value}</span>
                </div>
              ))}
            </div>
          </aside>

        </div>
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

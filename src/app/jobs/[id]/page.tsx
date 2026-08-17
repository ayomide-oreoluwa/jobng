"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiExternalLink,
  FiGlobe,
  FiLogIn,
  FiSearch,
  FiShare2,
  FiCheck,
  FiShieldCheck,
  FiClock,
} from "react-icons/fi";
import { authHeaders } from "@/lib/auth-client";
import { sanitizeHtml } from "@/lib/html";
import JobDetailSkeleton from "@/components/shared/JobDetailSkeleton";
import { Apijustjob } from "@/lib/jobApi";
import { FiShield } from "react-icons/fi";

function formatDate(iso?: string | null, short = false): string {
  if (!iso) return "N/A";
  try {
    const date = new Date(iso);
    if (isNaN(date.getTime())) return iso;
    return date.toLocaleDateString("en-NG", {
      day: "numeric",
      month: short ? "short" : "long",
      year: short ? undefined : "numeric",
    });
  } catch {
    return iso;
  }
}

function companyInitial(name?: string | null): string {
  return name?.trim().charAt(0).toUpperCase() || "J";
}

function formatWebsiteUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";

  const [job, setJob] = useState<Apijustjob | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/jobs/${encodeURIComponent(id)}`, {
          headers: authHeaders(),
        });
        const data = await res.json();
        if (cancelled) return;

        if (res.status === 401 || data.requiresAuth) {
          setNeedsAuth(true);
          return;
        }

        if (!res.ok || !data.job) {
          setNotFound(true);
          return;
        }

        setJob(data.job);
      } catch {
        if (!cancelled) {
          setNotFound(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job?.job_title ?? "Job Opportunity",
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard if share interface is dismissed/unsupported
      }
    }
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) return <JobDetailSkeleton />;

  /* --- Premium Auth Required View --- */
  if (needsAuth) {
    return (
      <div className="min-h-screen bg-[var(--surface)] pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-[440px] w-full bg-[var(--surface-elevated)] border border-[var(--border)] rounded-[var(--radius-md)] shadow-[var(--shadow-md)] p-8 md:p-10 text-center relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--gold-light)] via-[var(--gold)] to-[var(--gold-light)]" />
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--gold-muted)] to-[var(--surface)] border border-[var(--gold)]/20 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <FiLogIn size={26} className="text-[var(--gold)]" />
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--ink)] mb-3">
            Sign in Required
          </h1>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-8">
            Please log in to access full details for this role. To subscribe via USSD, dial <strong className="text-[var(--ink)] font-bold">*7098#</strong>.
          </p>

          <Link 
            href={`/login?callbackUrl=${encodeURIComponent(`/jobs/${id}`)}`} 
            className="inline-flex items-center justify-center gap-2 w-full font-bold text-sm bg-gradient-to-r from-[var(--gold-light)] via-[var(--gold)] to-[var(--gold-hover)] text-[var(--ink)] shadow-[var(--shadow-gold)] rounded-[var(--radius-sm)] py-3.5 transition-all duration-200 active:scale-[0.98] hover:shadow-[0_12px_30px_rgba(0,166,81,0.3)] hover:-translate-y-0.5"
          >
            Sign In to Continue
          </Link>
        </div>
      </div>
    );
  }

  /* --- Premium Not Found View --- */
  if (notFound || !job) {
    return (
      <div className="min-h-screen bg-[var(--surface)] pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center text-center">
        <div className="max-w-md w-full flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center mb-5 text-[var(--text-muted)] shadow-[var(--shadow-sm)]">
            <FiSearch size={32} />
          </div>
          <h1 className="text-2xl font-extrabold text-[var(--ink)] tracking-tight mb-2">Job Listing Unavailable</h1>
          <p className="text-[var(--text-muted)] text-sm mb-8 leading-relaxed">
            This position may have been filled, unlisted, or expired.
          </p>
          <button 
            type="button" 
            onClick={() => router.push("/jobs")} 
            className="inline-flex items-center justify-center gap-2.5 font-bold text-sm bg-[var(--surface-elevated)] text-[var(--ink)] border border-[var(--border-strong)] rounded-[var(--radius-sm)] px-6 py-3 transition-all duration-200 hover:bg-[var(--surface)] hover:border-[var(--ink)]/30 active:scale-[0.98]"
          >
            <FiArrowLeft size={16} /> Explore Other Roles
          </button>
        </div>
      </div>
    );
  }

  const title = job.job_title ?? "Untitled Job";
  const companyName = job.company_name ?? "Unknown Company";
  const website = formatWebsiteUrl(job.company_website);

  return (
    <div className="min-h-screen bg-[var(--surface)] animate-fade-in-up">
      {/* Premium Hero Header */}
      <header className="bg-[var(--ink)] relative overflow-hidden pt-10 pb-14 md:pt-14 md:pb-20 border-b border-[var(--border)]/20 shadow-lg">
        {/* Ambient Gradient Flares */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-radial from-[var(--gold)]/15 via-[var(--gold)]/5 to-transparent pointer-events-none rounded-full blur-2xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-radial from-emerald-500/10 to-transparent pointer-events-none rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--gold)]/40 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Navigation & Action Bar */}
          <div className="flex items-center justify-between mb-8">
            <Link 
              href="/jobs" 
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-white/60 hover:text-[var(--gold-light)] transition-colors duration-200 group bg-white/5 border border-white/10 rounded-full px-4 py-2 backdrop-blur-sm"
            >
              <FiArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-200" /> 
              Back to all jobs
            </Link>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-4 py-2 transition-all duration-200 backdrop-blur-sm active:scale-[0.97]"
            >
              {copied ? <FiCheck size={14} className="text-emerald-400" /> : <FiShare2 size={14} />}
              <span>{copied ? "Link Copied" : "Share Job"}</span>
            </button>
          </div>
          
          {/* Main Hero Card Content */}
          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
            <div className="flex items-start gap-5 sm:gap-6">
              {/* Company Logo Badge */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[var(--gold)]/25 via-[var(--gold)]/10 to-transparent border border-[var(--gold)]/30 flex items-center justify-center font-black text-2xl sm:text-3xl text-[var(--gold-light)] shrink-0 shadow-2xl backdrop-blur-md">
                {companyInitial(companyName)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase text-[var(--gold-light)] bg-[var(--gold)]/15 border border-[var(--gold)]/30 px-2.5 py-0.5 rounded-full">
                    <FiShield size={12} /> Verified Role
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {title}
                </h1>

                <p className="text-base font-medium text-white/70">{companyName}</p>
                
                {/* Meta Attributes */}
                <div className="flex flex-wrap gap-2.5 pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/80 bg-white/8 border border-white/12 rounded-lg px-3.5 py-1.5 backdrop-blur-sm shadow-sm">
                    <FiBriefcase size={13} className="text-[var(--gold-light)]" /> {job.category ?? "General"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/80 bg-white/8 border border-white/12 rounded-lg px-3.5 py-1.5 backdrop-blur-sm shadow-sm">
                    <FiCalendar size={13} className="text-[var(--gold-light)]" /> {formatDate(job.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Description Column */}
          <div className="lg:col-span-2 space-y-6">
            {job.description ? (
              <div className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] p-6 sm:p-9 transition-all duration-200">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border)]">
                  <div className="w-1.5 h-6 bg-gradient-to-b from-[var(--gold-light)] to-[var(--gold)] rounded-full" />
                  <h2 className="text-lg font-extrabold text-[var(--ink)] tracking-tight">Job Overview & Requirements</h2>
                </div>
                
                <div
                  className="prose max-w-none text-sm leading-relaxed text-[var(--text-muted)]
                    prose-p:mb-4 prose-p:last:mb-0
                    prose-headings:text-[var(--ink)] prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:mt-7 prose-headings:mb-3
                    prose-h3:text-base
                    prose-strong:text-[var(--ink)] prose-strong:font-bold
                    prose-ul:list-disc prose-ul:pl-5 prose-ul:my-4 prose-ul:space-y-1.5
                    prose-ol:list-decimal prose-ol:pl-5 prose-ol:my-4 prose-ol:space-y-1.5
                    prose-li:mb-1.5
                    prose-a:text-[var(--gold-hover)] prose-a:underline prose-a:underline-offset-4 prose-a:font-semibold
                    prose-blockquote:border-l-4 prose-blockquote:border-[var(--gold)] prose-blockquote:bg-[var(--surface)] prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-md prose-blockquote:italic"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.description) }}
                />
              </div>
            ) : (
              <div className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-[var(--radius-md)] p-8 text-center text-[var(--text-muted)] text-sm">
                No description provided for this position.
              </div>
            )}
          </div>

          {/* Sticky Sidebar Column */}
          <aside className="lg:sticky lg:top-28 space-y-5">
            <div className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] p-6 sm:p-7 transition-all duration-300 hover:shadow-[var(--shadow-md)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--gold-light)] via-[var(--gold)] to-[var(--gold-light)]" />

              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--text-faint)] mb-1">
                Employer Details
              </p>
              <h3 className="text-xl font-extrabold text-[var(--ink)] tracking-tight mb-2">
                {companyName}
              </h3>

              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--gold-hover)] hover:text-[var(--gold)] transition-colors mb-6 group"
                >
                  <FiGlobe size={14} /> 
                  <span className="group-hover:underline underline-offset-2">Visit Official Website</span>
                </a>
              )}

              {/* Primary Apply Action Button */}
              <div className="pt-2">
                {job.job_url ? (
                  <a
                    href={job.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full text-center font-bold text-sm bg-gradient-to-r from-[var(--gold-light)] via-[var(--gold)] to-[var(--gold-hover)] text-[var(--ink)] shadow-[var(--shadow-gold)] rounded-[var(--radius-sm)] py-3.5 px-5 transition-all duration-200 active:scale-[0.98] hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(0,166,81,0.35)]"
                  >
                    Apply for Position <FiExternalLink size={15} />
                  </a>
                ) : (
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] p-4 text-center">
                    <p className="text-xs font-medium text-[var(--text-muted)] leading-relaxed">
                      Direct online application link is unavailable. Please check the company website to apply.
                    </p>
                  </div>
                )}
              </div>

              {/* Sidebar Quick Meta List */}
              <div className="mt-6 pt-5 border-t border-[var(--border)] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                    <FiClock size={13} /> Date Posted
                  </span>
                  <span className="font-semibold text-[var(--ink)]">
                    {formatDate(job.created_at, true)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                    <FiShield size={13} /> Verification
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Active Listing
                  </span>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}
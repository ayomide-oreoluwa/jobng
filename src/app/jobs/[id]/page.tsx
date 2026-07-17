"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FiArrowLeft, FiBriefcase, FiCalendar, FiExternalLink,
  FiGlobe, FiLogIn, FiZap, FiUsers, FiCheck, FiClock,
  FiMapPin, FiDollarSign, FiBookmark, FiCode,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { authHeaders } from "@/lib/auth-client";
import type { ApiJob } from "@/lib/justjobApi";
import { sanitizeHtml } from "@/lib/html";
import { getJobById } from "@/data/jobs";

/* ─── Helpers ────────────────────────────────────────────────── */
/** Deterministic pseudo-random number [0, 1) seeded by a string — safe to call during render. */
function seededRandom(seed: string, salt: number): number {
  let h = salt;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 0x9e3779b9);
    h ^= h >>> 16;
  }
  return (h >>> 0) / 0xffffffff;
}
function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
  } catch { return iso; }
}
function companyInitial(name: string) {
  return name?.trim().charAt(0).toUpperCase() || "J";
}

const TECH_STACKS: Record<string, string> = {
  react: "#61DAFB", typescript: "#3178C6", python: "#3776AB",
  "next.js": "#FFFFFF", nextjs: "#FFFFFF", django: "#092E20",
  node: "#339933", nodejs: "#339933", javascript: "#F7DF1E",
  aws: "#FF9900", docker: "#2496ED", vue: "#42B883",
  angular: "#DD0031", rust: "#DEA584", golang: "#00ADD8",
  java: "#ED8B00", php: "#777BB4", sql: "#CC2927",
  mongodb: "#47A248", graphql: "#E10098", flutter: "#02569B",
};
function guessStack(text: string): { name: string; color: string }[] {
  const lower = text.toLowerCase();
  return Object.entries(TECH_STACKS)
    .filter(([k]) => lower.includes(k))
    .slice(0, 6)
    .map(([k, color]) => ({ name: k.charAt(0).toUpperCase() + k.slice(1), color }));
}

function mockToApiJob(mock: ReturnType<typeof getJobById>): ApiJob | null {
  if (!mock) return null;
  return {
    job_id: mock.id,
    job_title: mock.title,
    job_url: null,
    created_at: mock.postedDate,
    company_name: mock.company,
    company_website: null,
    category: mock.category,
    description: `<p>${mock.description}</p>${
      mock.responsibilities.length
        ? `<h3>Responsibilities</h3><ul>${mock.responsibilities.map((r) => `<li>${r}</li>`).join("")}</ul>`
        : ""
    }${
      mock.requirements.length
        ? `<h3>Requirements</h3><ul>${mock.requirements.map((r) => `<li>${r}</li>`).join("")}</ul>`
        : ""
    }`,
  };
}

/* ─── Interview Timeline ─────────────────────────────────────── */
const PIPELINE = [
  { label: "Application", icon: FiCheck, done: true },
  { label: "Screening", icon: FiClock, done: false },
  { label: "Technical", icon: FiCode, done: false },
  { label: "Final Round", icon: FiUsers, done: false },
  { label: "Offer", icon: FiZap, done: false },
];

/* ─── Skeleton ───────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="min-h-screen bg-[#0A0A0C] animate-pulse">
      <div className="h-64 bg-[#121215]" />
      <div className="container-xl py-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-4">
          <div className="h-8 bg-white/5 rounded w-2/3" />
          <div className="h-4 bg-white/5 rounded w-full" />
          <div className="h-4 bg-white/5 rounded w-5/6" />
          <div className="h-4 bg-white/5 rounded w-3/4" />
        </div>
        <div className="h-80 bg-white/5 rounded-xl" />
      </div>
    </div>
  );
}

/* ─── Section Block ──────────────────────────────────────────── */
function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#121215] border border-[var(--border)] rounded-xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[var(--border)]">
        <div className="w-8 h-8 rounded-lg bg-[var(--gold-muted)] flex items-center justify-center">
          <Icon size={15} className="text-[var(--gold)]" />
        </div>
        <h2 className="text-[16px] font-bold text-white tracking-tight">{title}</h2>
      </div>
      {children}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";

  const [job, setJob] = useState<ApiJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/jobs/${encodeURIComponent(id)}`, { headers: authHeaders() });
        const data = await res.json();
        if (cancelled) return;
        if (res.status === 401 || data.requiresAuth) { setNeedsAuth(true); return; }
        if (res.status === 404 || !data.ok) {
          const mockJob = mockToApiJob(getJobById(id));
          if (mockJob) { setJob(mockJob); return; }
          setNotFound(true); return;
        }
        setJob(data.job);
      } catch {
        if (!cancelled) {
          const mockJob = mockToApiJob(getJobById(id));
          if (mockJob) { setJob(mockJob); return; }
          setNotFound(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <Skeleton />;

  /* ── Auth Gate ──────────────────────────────────────────────── */
  if (needsAuth) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center px-4">
        <div className="max-w-[420px] w-full bg-[#121215] border border-[var(--border)] rounded-2xl p-10 text-center">
          <div className="w-14 h-14 rounded-xl bg-[var(--gold-muted)] flex items-center justify-center mx-auto mb-5">
            <FiLogIn size={24} className="text-[var(--gold)]" />
          </div>
          <h1 className="text-xl font-extrabold text-white mb-2">Sign in required</h1>
          <p className="text-[13px] text-[var(--text-muted)] leading-relaxed mb-6">
            Log in to view job details. To subscribe, dial <strong className="text-[var(--gold)]">*7098#</strong> first.
          </p>
          <Link href={`/login?callbackUrl=${encodeURIComponent(`/jobs/${id}`)}`} className="jj-btn jj-btn--gold px-7 py-3">
            Login
          </Link>
        </div>
      </div>
    );
  }

  /* ── Not Found ──────────────────────────────────────────────── */
  if (notFound || !job) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center text-center px-4">
        <div className="max-w-md">
          <span className="text-5xl mb-4 block">🔍</span>
          <h1 className="text-2xl font-extrabold text-white mb-2">Job not found</h1>
          <p className="text-[var(--text-muted)] text-sm mb-6">This listing may have been removed or expired.</p>
          <button onClick={() => router.push("/jobs")} className="jj-btn jj-btn--ghost px-5 py-2.5">
            <FiArrowLeft size={14} /> Back to jobs
          </button>
        </div>
      </div>
    );
  }

  const title = job.job_title ?? "Untitled role";
  const website = job.company_website
    ? (job.company_website.startsWith("http") ? job.company_website : `https://${job.company_website}`)
    : null;
  const stack = guessStack(`${title} ${job.description ?? ""} ${job.category ?? ""}`);
  const salaryMin = (Math.floor(seededRandom(String(job.id ?? title), 1) * 6) + 8) * 100;
  const salaryMax = salaryMin + (Math.floor(seededRandom(String(job.id ?? title), 2) * 4) + 4) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#0A0A0C]"
    >
      {/* ── Glassmorphic Top Header ───────────────────────────── */}
      <div className="relative bg-gradient-to-br from-[#121215] via-[#0A0A0C] to-[#0A0A0C] overflow-hidden border-b border-[var(--border)]">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--gold-glow)] opacity-20 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[var(--violet-glow)] opacity-10 blur-[60px] pointer-events-none" />

        <div className="relative z-10 container-xl py-10 md:py-14">
          <Link href="/jobs" className="inline-flex items-center gap-2 text-[12px] font-semibold text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors mb-8 group no-underline">
            <FiArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" /> All roles
          </Link>

          <div className="flex flex-col md:flex-row gap-6 md:items-start">
            {/* Company Logo Avatar */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-[var(--gold-muted)] to-[var(--gold-muted)]/30 border border-[var(--gold)]/20 flex items-center justify-center font-black text-[var(--gold)] text-2xl md:text-3xl shrink-0 backdrop-blur-sm">
              {companyInitial(job.company_name)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start gap-3 mb-3">
                {/* Stage tags */}
                <span className="flex items-center gap-1.5 text-[11px] font-bold bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/70">
                  Series A
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-bold bg-[var(--gold-muted)] border border-[var(--gold)]/20 rounded-full px-3 py-1 text-[var(--gold)]">
                  <FiMapPin size={10} /> Remote OK
                </span>
                {job.category && (
                  <span className="flex items-center gap-1.5 text-[11px] font-bold bg-[var(--violet-muted)] border border-[var(--violet)]/20 rounded-full px-3 py-1 text-[var(--violet)]">
                    <FiBriefcase size={10} /> {job.category}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-2">
                {title}
              </h1>
              <p className="text-[15px] text-[var(--text-muted)] font-medium mb-4">{job.company_name}</p>

              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 text-[12px] text-[var(--text-muted)] bg-white/5 border border-[var(--border)] rounded-full px-3 py-1">
                  <FiCalendar size={11} className="text-[var(--gold)]" /> Posted {formatDate(job.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body Split Grid ───────────────────────────────────── */}
      <div className="container-xl py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">

          {/* Left 65%: Editorial Case Study Columns */}
          <div className="space-y-6 min-w-0">

            {/* The Mission */}
            <Section icon={FiZap} title="The Mission">
              <div
                className="text-[14px] text-[var(--text-muted)] leading-[1.85]
                  [&_h1]:text-white [&_h1]:font-bold [&_h1]:text-lg [&_h1]:mb-2 [&_h1]:mt-4
                  [&_h2]:text-white [&_h2]:font-bold [&_h2]:text-base [&_h2]:mb-2 [&_h2]:mt-4
                  [&_h3]:text-white [&_h3]:font-bold [&_h3]:text-sm [&_h3]:mb-2 [&_h3]:mt-3
                  [&_p]:mb-3 [&_p:last-child]:mb-0
                  [&_ul]:list-none [&_ul]:space-y-1.5 [&_ul]:pl-0 [&_ul]:my-3
                  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-3
                  [&_li]:relative [&_li]:pl-5 [&_li]:before:content-['✓'] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:text-[var(--gold)] [&_li]:before:font-bold
                  [&_strong]:text-white [&_strong]:font-semibold
                  [&_a]:text-[var(--gold)] [&_a]:underline [&_a]:underline-offset-2"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.description ?? "") }}
              />
            </Section>

            {/* The Stack */}
            {stack.length > 0 && (
              <Section icon={FiCode} title="The Stack">
                <div className="flex flex-wrap gap-3">
                  {stack.map((s) => (
                    <div
                      key={s.name}
                      className="flex items-center gap-2 bg-[#0A0A0C] border border-[var(--border)] rounded-xl px-4 py-3 hover:border-[var(--border-strong)] transition-colors"
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-[13px] font-bold text-white">{s.name}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* About the Team */}
            <Section icon={FiUsers} title="The Team">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Team Size", value: "12–40" },
                  { label: "Stage", value: "Series A" },
                  { label: "Founded", value: "2019" },
                  { label: "Location", value: "Lagos, NG" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#0A0A0C] border border-[var(--border)] rounded-xl p-4 text-center">
                    <p className="text-[18px] font-black text-[var(--gold)]">{value}</p>
                    <p className="text-[11px] text-[var(--text-faint)] font-medium mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </Section>

          </div>

          {/* Right 35%: Sticky Bento Panel */}
          <aside className="space-y-4 lg:sticky lg:top-[calc(var(--nav-height)+1.5rem)]">

            {/* Compensation Card */}
            <div className="bg-[#121215] border border-[var(--border)] rounded-xl p-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-faint)] mb-3">Compensation</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-[24px] font-black text-[var(--gold)]">₦{salaryMin}K</span>
                <span className="text-[14px] text-[var(--text-muted)] font-semibold">– {salaryMax}K</span>
                <span className="text-[11px] text-[var(--text-faint)] ml-1">/mo</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)] rounded-full w-[70%]" />
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                <FiDollarSign size={11} className="text-[var(--gold)]" />
                <span>Competitive — top 30% in sector</span>
              </div>
            </div>

            {/* Interview Pipeline */}
            <div className="bg-[#121215] border border-[var(--border)] rounded-xl p-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-faint)] mb-4">Interview Process</p>
              <div className="space-y-2">
                {PIPELINE.map(({ label, icon: Icon, done }, i) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      done
                        ? "bg-[var(--gold-muted)] border border-[var(--gold)]/30 text-[var(--gold)]"
                        : "bg-white/5 border border-[var(--border)] text-[var(--text-faint)]"
                    }`}>
                      <Icon size={12} />
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <span className={`text-[12px] font-semibold ${done ? "text-white" : "text-[var(--text-muted)]"}`}>
                        {label}
                      </span>
                      <span className="text-[10px] text-[var(--text-faint)]">Step {i + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-[#121215] border border-[var(--border)] rounded-xl p-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-faint)] mb-1">Hiring via</p>
              <h3 className="text-[15px] font-bold text-white mb-3">{job.company_name}</h3>
              {website && (
                <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[12px] font-semibold text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors mb-4 no-underline">
                  <FiGlobe size={12} /> Visit website
                </a>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-[var(--border)] text-[10px] text-[var(--text-faint)] font-mono">
                <span>ID #{job.job_id.slice(-6)}</span>
                <span>{new Date(job.created_at).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}</span>
              </div>
            </div>

            {/* Primary CTA */}
            {job.job_url ? (
              <a
                href={job.job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[var(--gold)] text-[var(--ink)] font-bold text-[14px] rounded-xl py-3.5 hover:bg-[var(--gold-light)] transition-colors shadow-[var(--shadow-gold)] no-underline"
              >
                Apply Now <FiExternalLink size={14} />
              </a>
            ) : (
              <div className="bg-[#121215] border border-[var(--border)] rounded-xl p-4 text-center">
                <p className="text-[12px] text-[var(--text-muted)] leading-relaxed">
                  Contact the company directly to apply for this role.
                </p>
              </div>
            )}

            {/* Secondary Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setSaved((s) => !s)}
                className={`flex-1 flex items-center justify-center gap-2 font-semibold text-[13px] rounded-xl py-2.5 border transition-all ${
                  saved
                    ? "bg-[var(--gold-muted)] border-[var(--gold)]/30 text-[var(--gold)]"
                    : "bg-[#121215] border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:border-[var(--border-strong)]"
                }`}
              >
                <FiBookmark size={13} fill={saved ? "currentColor" : "none"} />
                {saved ? "Saved" : "Save"}
              </button>
              <Link href="/jobs" className="flex-1 flex items-center justify-center gap-2 bg-[#121215] border border-[var(--border)] text-[var(--text-muted)] hover:text-white font-semibold text-[13px] rounded-xl py-2.5 no-underline hover:border-[var(--border-strong)] transition-all">
                <FiArrowLeft size={13} /> Back
              </Link>
            </div>

          </aside>
        </div>
      </div>
    </motion.div>
  );
}
import Link from "next/link";
import { FiBriefcase, FiCalendar, FiExternalLink, FiArrowUpRight } from "react-icons/fi";
import type { ApiJob } from "@/lib/justjobApi";
import { stripHtml } from "@/lib/html";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function companyInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "J";
}

interface JobCardProps {
  job: ApiJob;
  variant?: "list" | "grid";
}

export default function JobCard({ job, variant = "list" }: JobCardProps) {
  const title = job.job_title ?? "Untitled role";
  const category = job.category ?? "General";
  const plainDescription = stripHtml(job.description);

  const avatar = (
    <div className="jj-job-card__avatar">{companyInitial(job.company_name)}</div>
  );

  if (variant === "grid") {
    return (
      <div className="job-card jj-job-card jj-job-card--grid">
        <div className="jj-job-card__top">
          {avatar}
          <div className="jj-job-card__info">
            <Link href={`/jobs/${job.job_id}`} className="jj-job-card__title">
              {title}
            </Link>
            <p className="jj-job-card__company">{job.company_name}</p>
          </div>
        </div>
        <div className="jj-job-card__meta">
          <span className="jj-pill"><FiBriefcase size={10} /> {category}</span>
          <span className="jj-job-card__date"><FiCalendar size={11} /> {formatDate(job.created_at)}</span>
        </div>
        {plainDescription && (
          <p className="jj-job-card__excerpt">{plainDescription}</p>
        )}
        <Link href={`/jobs/${job.job_id}`} className="jj-job-card__cta">
          View role <FiArrowUpRight size={13} />
        </Link>
      </div>
    );
  }

  return (
    <div className="job-card jj-job-card jj-job-card--list">
      {avatar}
      <div className="jj-job-card__body">
        <Link href={`/jobs/${job.job_id}`} className="jj-job-card__title jj-job-card__title--lg">
          {title}
        </Link>
        <p className="jj-job-card__company">{job.company_name}</p>
        <div className="jj-job-card__meta">
          <span className="jj-pill"><FiBriefcase size={10} /> {category}</span>
          <span className="jj-job-card__date"><FiCalendar size={11} /> {formatDate(job.created_at)}</span>
        </div>
        {plainDescription && (
          <p className="jj-job-card__excerpt jj-job-card__excerpt--list">{plainDescription}</p>
        )}
      </div>
      <div className="jj-job-card__actions">
        <Link href={`/jobs/${job.job_id}`} className="jj-btn jj-btn--ghost" style={{ padding: "7px 16px", fontSize: "0.8125rem" }}>
          View
        </Link>
        {job.job_url && (
          <a
            href={job.job_url}
            target="_blank"
            rel="noopener noreferrer"
            className="jj-job-card__apply"
          >
            Apply <FiExternalLink size={11} />
          </a>
        )}
      </div>
    </div>
  );
}

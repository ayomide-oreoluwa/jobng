import Link from "next/link";
import Image from "next/image";
import { FiMapPin, FiBriefcase, FiBookmark } from "react-icons/fi";
import { Job } from "@/types";

const typeColors: Record<string, { bg: string; text: string }> = {
  "Full Time":  { bg: "#eff6ff", text: "#1967D2" },
  "Part Time":  { bg: "#f0fdf4", text: "#16a34a" },
  "Remote":     { bg: "#faf5ff", text: "#7c3aed" },
  "Freelance":  { bg: "#fff7ed", text: "#ea580c" },
  "Internship": { bg: "#fdf2f8", text: "#be185d" },
};

interface JobCardProps {
  job: Job;
  variant?: "list" | "grid";
}

export default function JobCard({ job, variant = "list" }: JobCardProps) {
  const tc = typeColors[job.type] ?? { bg: "#f9fafb", text: "#374151" };

  if (variant === "grid") {
    return (
      <div
        className="job-card"
        style={{
          background: "#fff", borderRadius: 16,
          border: "1px solid #e5e7eb", padding: 20,
          display: "flex", flexDirection: "column", gap: 12,
          position: "relative", height: "100%",
        }}
      >
        {job.featured && (
          <span style={{ position: "absolute", top: 12, right: 12, background: "#fffbeb", color: "#d97706", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>
            ⭐ Featured
          </span>
        )}
        {job.urgent && (
          <span style={{ position: "absolute", top: 12, left: 12, background: "#fef2f2", color: "#ef4444", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>
            Urgent
          </span>
        )}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginTop: job.featured || job.urgent ? 24 : 0 }}>
          <div style={{ width: 48, height: 48, borderRadius: 10, overflow: "hidden", border: "1px solid #f3f4f6", flexShrink: 0, background: "#f9fafb" }}>
            <Image src={job.companyLogo} alt={job.company} width={48} height={48} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <Link href={`/jobs/${job.id}`} style={{ fontWeight: 600, fontSize: 14, color: "#111827", textDecoration: "none", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {job.title}
            </Link>
            <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{job.company}</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#9ca3af" }}>
            <FiBriefcase size={11} /> {job.category}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#9ca3af" }}>
            <FiMapPin size={11} /> {job.location}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
          <span style={{ background: tc.bg, color: tc.text, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 99 }}>
            {job.type}
          </span>
          <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{job.salary}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="job-card"
      style={{
        background: "#fff", borderRadius: 16,
        border: "1px solid #e5e7eb", padding: "18px 20px",
        display: "flex", alignItems: "flex-start", gap: 16,
      }}
    >
      <div style={{ width: 56, height: 56, borderRadius: 12, overflow: "hidden", border: "1px solid #f3f4f6", flexShrink: 0, background: "#f9fafb" }}>
        <Image src={job.companyLogo} alt={job.company} width={56} height={56} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <div>
            <Link href={`/jobs/${job.id}`} style={{ fontWeight: 600, fontSize: 15, color: "#111827", textDecoration: "none" }}>
              {job.title}
            </Link>
            <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{job.company}</p>
          </div>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            {job.urgent  && <span style={{ background: "#fef2f2", color: "#ef4444", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>Urgent</span>}
            {job.featured && <span style={{ background: "#fffbeb", color: "#d97706", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>⭐ Featured</span>}
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginTop: 8 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#9ca3af" }}>
            <FiBriefcase size={11} /> {job.category}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#9ca3af" }}>
            <FiMapPin size={11} /> {job.location}
          </span>
          <span style={{ background: tc.bg, color: tc.text, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 99 }}>
            {job.type}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: "#d1d5db", padding: 2 }} aria-label="Bookmark">
          <FiBookmark size={17} />
        </button>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1967D2" }}>{job.salary}</span>
        <Link href={`/jobs/${job.id}`} style={{ fontSize: 12, background: "#eff6ff", color: "#1967D2", fontWeight: 600, padding: "6px 14px", borderRadius: 8, textDecoration: "none" }}>
          Apply Now
        </Link>
      </div>
    </div>
  );
}

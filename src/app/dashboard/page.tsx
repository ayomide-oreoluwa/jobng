"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiArrowUpRight, FiZap, FiBriefcase, FiMessageSquare,
  FiCheckCircle, FiClock, FiSend, FiAward, FiTrendingUp,
  FiCode, FiDatabase, FiGlobe, FiSearch, FiGrid,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

/* ─── Mock Data ──────────────────────────────────────────────── */
type PipelineStage = "Applied" | "Screening" | "Interviewing" | "Offer Received" | "Rejected";

const PIPELINE_STAGES: PipelineStage[] = ["Applied", "Screening", "Interviewing", "Offer Received"];

const mockApplications = [
  { id: "1", role: "Senior React Engineer", company: "Paystack", stage: "Interviewing" as PipelineStage, date: "3 days ago", match: 94 },
  { id: "2", role: "Full Stack Developer", company: "Flutterwave", stage: "Screening" as PipelineStage, date: "1 week ago", match: 87 },
  { id: "3", role: "Frontend Engineer", company: "Kuda Bank", stage: "Applied" as PipelineStage, date: "2 weeks ago", match: 79 },
  { id: "4", role: "Lead Engineer", company: "Andela", stage: "Offer Received" as PipelineStage, date: "5 days ago", match: 96 },
];

const mockSkills = [
  { name: "React", level: 92, icon: FiCode, color: "#61DAFB" },
  { name: "TypeScript", level: 86, icon: FiCode, color: "#3178C6" },
  { name: "Node.js", level: 78, icon: FiGlobe, color: "#339933" },
  { name: "SQL", level: 70, icon: FiDatabase, color: "#CC2927" },
];

type Message = { id: number; from: string; text: string; time: string; me: boolean };
const mockMessages: Record<string, Message[]> = {
  "1": [
    { id: 1, from: "Paystack HR", text: "Hi! We'd love to schedule your technical interview.", time: "10:32 AM", me: false },
    { id: 2, from: "Me", text: "Thank you! I'm available Tuesday or Wednesday.", time: "11:05 AM", me: true },
    { id: 3, from: "Paystack HR", text: "Perfect! Tuesday 2 PM works. We'll send the invite.", time: "11:20 AM", me: false },
  ],
  "4": [
    { id: 1, from: "Andela Recruiter", text: "Congratulations! We'd like to extend an offer.", time: "Yesterday", me: false },
    { id: 2, from: "Me", text: "This is exciting! Can I review the offer letter?", time: "Yesterday", me: true },
  ],
};

/* ─── Pipeline Stage Badge ───────────────────────────────────── */
const stageConfig: Record<PipelineStage, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  Applied:        { color: "text-white",            bg: "bg-white/5",           border: "border-white/10",       icon: FiSend },
  Screening:      { color: "text-blue-400",         bg: "bg-blue-500/10",       border: "border-blue-500/20",    icon: FiSearch },
  Interviewing:   { color: "text-[var(--gold)]",    bg: "bg-[var(--gold-muted)]", border: "border-[var(--gold)]/20", icon: FiClock },
  "Offer Received":{ color: "text-emerald-400",     bg: "bg-emerald-500/10",    border: "border-emerald-500/20", icon: FiCheckCircle },
  Rejected:       { color: "text-red-400",          bg: "bg-red-500/10",        border: "border-red-500/20",     icon: FiArrowUpRight },
};

function StageBadge({ stage }: { stage: PipelineStage }) {
  const cfg = stageConfig[stage];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      <Icon size={10} /> {stage}
    </span>
  );
}

/* ─── Radial Dial ────────────────────────────────────────────── */
function RadialDial({ score, label }: { score: number; label: string }) {
  const circumference = 2 * Math.PI * 56;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
        <circle cx="70" cy="70" r="56" fill="none" stroke="#1F1F24" strokeWidth="10" />
        <circle
          cx="70" cy="70" r="56" fill="none"
          stroke="url(#dialGradient)" strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="dialGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--violet)" />
            <stop offset="100%" stopColor="var(--gold)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[32px] font-black text-white">{score}</span>
        <span className="text-[11px] text-[var(--text-muted)] font-semibold">/ 100</span>
      </div>
      <p className="mt-2 text-[12px] font-semibold text-[var(--text-muted)]">{label}</p>
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────── */
export default function DashboardPage() {
  const { phone, isAuthenticated } = useAuth();
  const [activeInbox, setActiveInbox] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);

  const sendMessage = (appId: string) => {
    if (!newMessage.trim()) return;
    setMessages((prev) => ({
      ...prev,
      [appId]: [
        ...(prev[appId] ?? []),
        { id: Date.now(), from: "Me", text: newMessage.trim(), time: "Now", me: true },
      ],
    }));
    setNewMessage("");
  };

  const overallMatchScore = 88;
  const activeInboxApp = mockApplications.find((a) => a.id === activeInbox);

  return (
    <div className="min-h-screen bg-[#0A0A0C] pb-16">

      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[#0A0A0C]">
        <div className="container-xl py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[var(--gold)] bg-[var(--gold-muted)] border border-[var(--gold)]/20 rounded-full px-3 py-1 mb-3">
                <FiGrid size={11} /> Command Center
              </div>
              <h1 className="text-[28px] sm:text-[34px] font-black text-white tracking-tight leading-tight">
                {isAuthenticated ? `Welcome back` : "Your Dashboard"}
              </h1>
              {isAuthenticated && phone && (
                <p className="text-[var(--text-muted)] text-[14px] mt-1">{phone} · Job Seeker Account</p>
              )}
            </div>
            <Link href="/jobs" className="flex items-center gap-2 bg-[var(--gold)] text-[var(--ink)] font-bold text-[13px] px-4 py-2.5 rounded-xl hover:bg-[var(--gold-light)] transition-colors no-underline shrink-0">
              <FiSearch size={14} /> Find Jobs
            </Link>
          </div>
        </div>
      </div>

      <div className="container-xl py-8">
        {/* Top Bento Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {/* Stat Cards */}
          {[
            { label: "Active Applications", value: "4", icon: FiBriefcase, color: "text-[var(--gold)]", bg: "bg-[var(--gold-muted)]", border: "border-[var(--gold)]/20" },
            { label: "Interviews Scheduled", value: "2", icon: FiClock, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
            { label: "Profile Match Avg", value: `${overallMatchScore}%`, icon: FiTrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          ].map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} className={`bg-[#121215] border ${border} rounded-xl p-5 flex items-center gap-4`}>
              <div className={`w-12 h-12 rounded-xl ${bg} ${border} border flex items-center justify-center shrink-0`}>
                <Icon size={20} className={color} />
              </div>
              <div>
                <p className="text-[28px] font-black text-white leading-none">{value}</p>
                <p className="text-[12px] text-[var(--text-muted)] mt-0.5 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

          {/* ── Left: Applications + Inbox ────────── */}
          <div className="space-y-6">

            {/* Active Applications Pipeline */}
            <div className="bg-[#121215] border border-[var(--border)] rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--gold-muted)] flex items-center justify-center">
                    <FiBriefcase size={14} className="text-[var(--gold)]" />
                  </div>
                  <h2 className="text-[15px] font-bold text-white">Active Applications</h2>
                </div>
                <span className="text-[11px] text-[var(--text-faint)] font-semibold bg-white/5 border border-[var(--border)] rounded-full px-2.5 py-1">
                  {mockApplications.length} total
                </span>
              </div>

              <div className="space-y-4">
                {mockApplications.map((app) => {
                  const currentIdx = PIPELINE_STAGES.indexOf(app.stage as PipelineStage);
                  return (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#0A0A0C] border border-[var(--border)] rounded-xl p-4 hover:border-[var(--border-strong)] transition-all"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="text-[14px] font-bold text-white leading-tight">{app.role}</p>
                          <p className="text-[12px] text-[var(--text-muted)] mt-0.5">{app.company} · {app.date}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] font-bold text-[var(--gold)] bg-[var(--gold-muted)] rounded-full px-2 py-0.5">{app.match}%</span>
                          <StageBadge stage={app.stage} />
                        </div>
                      </div>

                      {/* Mini Pipeline Progress Bar */}
                      <div className="relative">
                        <div className="flex items-center gap-0">
                          {PIPELINE_STAGES.map((stage, idx) => {
                            const isCompleted = idx <= currentIdx;
                            const isCurrent = idx === currentIdx;
                            return (
                              <div key={stage} className="flex items-center flex-1 min-w-0">
                                <div className={`w-full h-1 rounded-full transition-all ${
                                  isCompleted ? "bg-[var(--gold)]" : "bg-white/10"
                                }`} />
                                <div className={`w-3 h-3 rounded-full shrink-0 -mx-1 z-10 transition-all ${
                                  isCurrent ? "bg-[var(--gold)] shadow-[0_0_8px_rgba(212,255,63,0.5)]" :
                                  isCompleted ? "bg-[var(--gold)]" : "bg-white/10"
                                }`} />
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex justify-between mt-1.5">
                          {PIPELINE_STAGES.map((stage, idx) => (
                            <span key={stage} className={`text-[9px] font-semibold truncate flex-1 text-center ${
                              idx <= currentIdx ? "text-[var(--gold)]" : "text-[var(--text-faint)]"
                            }`}>
                              {stage.split(" ")[0]}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--border)]">
                        <button
                          onClick={() => setActiveInbox(activeInbox === app.id ? null : app.id)}
                          className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                            activeInbox === app.id
                              ? "bg-[var(--violet-muted)] text-[var(--violet)] border border-[var(--violet)]/20"
                              : "bg-white/5 text-[var(--text-muted)] hover:text-white border border-[var(--border)]"
                          }`}
                        >
                          <FiMessageSquare size={11} />
                          {messages[app.id]?.length ?? 0} messages
                        </button>
                        <Link href="/jobs" className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-white/5 text-[var(--text-muted)] hover:text-white border border-[var(--border)] no-underline transition-colors">
                          <FiArrowUpRight size={11} /> View role
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Inbox Panel */}
            <AnimatePresence>
              {activeInbox && activeInboxApp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#121215] border border-[var(--violet)]/30 rounded-xl overflow-hidden"
                >
                  <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--violet-muted)] flex items-center justify-center">
                        <FiMessageSquare size={14} className="text-[var(--violet)]" />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-white">Recruiter Inbox</p>
                        <p className="text-[11px] text-[var(--text-muted)]">{activeInboxApp.company} · {activeInboxApp.role}</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveInbox(null)} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[var(--text-faint)] hover:text-white transition-colors text-lg leading-none">×</button>
                  </div>

                  {/* Messages */}
                  <div className="px-5 py-4 space-y-3 max-h-[280px] overflow-y-auto">
                    {(messages[activeInbox] ?? []).map((msg) => (
                      <div key={msg.id} className={`flex ${msg.me ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-xl px-3 py-2 ${
                          msg.me
                            ? "bg-[var(--gold)] text-[var(--ink)] rounded-br-sm"
                            : "bg-white/10 text-white rounded-bl-sm"
                        }`}>
                          {!msg.me && <p className="text-[10px] font-bold text-[var(--violet)] mb-1">{msg.from}</p>}
                          <p className="text-[12px] font-medium">{msg.text}</p>
                          <p className="text-[9px] opacity-60 mt-1 text-right">{msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reply Input */}
                  <div className="px-5 py-3 border-t border-[var(--border)] flex gap-2">
                    <input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage(activeInbox)}
                      placeholder="Type a message..."
                      className="flex-1 bg-[#0A0A0C] border border-[var(--border)] rounded-lg px-3 py-2 text-[12px] text-white placeholder-[var(--text-faint)] outline-none focus:border-[var(--violet)]/50 transition-colors"
                    />
                    <button
                      onClick={() => sendMessage(activeInbox)}
                      className="w-9 h-9 rounded-lg bg-[var(--violet)] flex items-center justify-center text-white hover:bg-[#7577F3] transition-colors shrink-0"
                    >
                      <FiSend size={14} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* ── Right: Skill Alignment + Tips ─────── */}
          <div className="space-y-5">

            {/* Skill Alignment Radial Meter */}
            <div className="bg-[#121215] border border-[var(--border)] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-[var(--violet-muted)] flex items-center justify-center">
                  <FiAward size={14} className="text-[var(--violet)]" />
                </div>
                <h2 className="text-[15px] font-bold text-white">Skill Alignment</h2>
              </div>
              <div className="flex justify-center mb-6">
                <RadialDial score={overallMatchScore} label="Overall Match Score" />
              </div>
              <div className="space-y-3">
                {mockSkills.map(({ name, level, color }) => (
                  <div key={name} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[var(--text-muted)] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                        {name}
                      </span>
                      <span className="font-bold text-white">{level}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${level}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-[#121215] border border-[var(--border)] rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[var(--gold-muted)] flex items-center justify-center">
                  <FiZap size={14} className="text-[var(--gold)]" />
                </div>
                <h2 className="text-[14px] font-bold text-white">Profile Boosts</h2>
              </div>
              <div className="space-y-2">
                {[
                  "Add a portfolio URL (+8% match)",
                  "Complete skills section (+12% match)",
                  "Upload a resume (+15% visibility)",
                ].map((tip) => (
                  <div key={tip} className="flex items-start gap-2 text-[12px] text-[var(--text-muted)]">
                    <FiZap size={11} className="text-[var(--gold)] mt-0.5 shrink-0" />
                    {tip}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

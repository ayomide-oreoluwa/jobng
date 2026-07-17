"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiCode, FiActivity, FiDollarSign, FiZap, FiMapPin } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const popularSuggestions = [
  { text: "React Developer", type: "role", match: "98% Match" },
  { text: "Python Engineer", type: "role", match: "94% Match" },
  { text: "Remote", type: "location", match: "Anywhere" },
  { text: "Next.js", type: "tech", match: "Trending" },
  { text: "Django", type: "tech", match: "High Pay" }
];

const trendingBadges = [
  { name: "React", color: "#61DAFB", delay: 0 },
  { name: "TypeScript", color: "#3178C6", delay: 0.5 },
  { name: "Python", color: "#3776AB", delay: 1 },
  { name: "Next.js", color: "#FFFFFF", delay: 1.5 },
  { name: "Django", color: "#092E20", delay: 2 },
  { name: "Rust", color: "#DEA584", delay: 2.5 },
  { name: "PyTorch", color: "#EE4C2C", delay: 3 },
  { name: "AWS", color: "#FF9900", delay: 3.5 },
];

const salaryStats = [
  { role: "Lead React Engineer", range: "₦1.5M - ₦2.2M/mo", change: "+12% this month" },
  { role: "Senior Python Developer", range: "₦1.8M - ₦2.6M/mo", change: "High Demand" },
  { role: "Mobile Engineer (React Native)", range: "₦1.2M - ₦1.8M/mo", change: "Hot Role" },
  { role: "Product Manager", range: "₦1.0M - ₦1.6M/mo", change: "+8% this month" },
];

export default function HeroSection() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [salaryIndex, setSalaryIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSalaryIndex((prev) => (prev + 1) % salaryStats.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e?: React.FormEvent, term?: string) => {
    if (e) e.preventDefault();
    const activeTerm = term ?? keyword;
    const params = new URLSearchParams();
    if (activeTerm) params.set("q", activeTerm);
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden px-4 py-16 md:py-24 bg-[#0A0A0C]">
      {/* Background glow animations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-radial from-[var(--gold-glow)] to-transparent opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-radial from-[var(--violet-glow)] to-transparent opacity-20 pointer-events-none" />
      
      <div className="container-xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Headline and Command Palette Search */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-[var(--gold)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-pulse" />
              Next-Gen Job Matchmaker
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white">
              Precise matchmaker.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)]">
                Zero noise.
              </span>
            </h1>
            
            <p className="text-[16px] md:text-[18px] text-[var(--text-muted)] leading-relaxed max-w-xl">
              Nigeria&apos;s hyper-focused talent portal. Search with our command palette, dial <span className="text-white font-bold">*7098#</span> to subscribe, and instantly match with your ideal tech stack.
            </p>
          </div>

          {/* Floating Command Palette Search Input */}
          <div className="relative max-w-xl">
            <form 
              onSubmit={(e) => handleSearch(e)}
              className={`flex items-center gap-3 bg-[#121215] border rounded-xl px-4 py-3.5 transition-all duration-300 ${
                isFocused 
                  ? "border-[var(--gold)] shadow-[0_0_20px_rgba(212,255,63,0.15)]" 
                  : "border-[var(--border)]"
              }`}
            >
              <FiSearch className="text-[var(--gold)] shrink-0" size={20} />
              <input
                type="text"
                placeholder="Search job title, stack or keywords... (Press / to focus)"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                className="w-full bg-transparent border-none outline-none text-white placeholder-[var(--text-faint)] text-[15px] font-medium"
              />
              <div className="hidden sm:flex items-center gap-1 bg-[#1F1F24] border border-[#2A2A30] rounded px-1.5 py-0.5 text-[10px] text-[var(--text-muted)] font-mono shrink-0">
                ⌘K
              </div>
            </form>

            {/* Suggestions Command Dropdown Panel */}
            <AnimatePresence>
              {isFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 mt-2 bg-[#121215] border border-[var(--border-strong)] rounded-xl shadow-[var(--shadow-lg)] overflow-hidden z-50 p-2"
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--text-faint)] flex justify-between">
                    <span>Quick Recommendations</span>
                    <span>Action</span>
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {popularSuggestions.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSearch(undefined, item.text)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          {item.type === "role" && <FiCode size={14} className="text-[var(--gold)]" />}
                          {item.type === "location" && <FiMapPin size={14} className="text-[var(--violet)]" />}
                          {item.type === "tech" && <FiZap size={14} className="text-white" />}
                          <span className="text-[13px] font-semibold text-white">{item.text}</span>
                        </div>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white/5 text-[var(--text-muted)]">
                          {item.match}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Floating 3D Tech Badge Grid & Salary Rotating Widget */}
        <div className="lg:col-span-6 relative flex justify-center items-center h-[400px] md:h-[480px]">
          {/* Tilted 3D grid container */}
          <div 
            className="relative w-full max-w-[420px] aspect-square transition-transform duration-700"
            style={{
              perspective: "1000px",
              transform: "rotateX(15deg) rotateY(-20deg) rotateZ(4deg)",
              transformStyle: "preserve-3d"
            }}
          >
            {/* Tech badges floating with CSS animation */}
            {trendingBadges.map((badge, index) => {
              const xPos = [5, 65, 10, 70, 40, 75, 15, 55][index];
              const yPos = [10, 15, 45, 50, 25, 75, 78, 85][index];
              return (
                <motion.div
                  key={badge.name}
                  animate={{
                    y: [0, -12, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: badge.delay,
                  }}
                  className="absolute bg-[#121215]/90 border border-[var(--border)] rounded-full px-4 py-2 flex items-center gap-2 shadow-[var(--shadow-md)] shrink-0"
                  style={{
                    left: `${xPos}%`,
                    top: `${yPos}%`,
                    transform: `translateZ(${index * 15}px)`,
                    backdropFilter: "blur(4px)"
                  }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: badge.color }} />
                  <span className="text-[12px] font-extrabold text-white tracking-tight">{badge.name}</span>
                </motion.div>
              );
            })}

            {/* Floating Rotating Live Salary Stats widget */}
            <motion.div
              animate={{
                y: [0, 8, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute left-[15%] top-[30%] w-[70%] bg-[#121215] border border-[var(--border)] rounded-2xl p-5 shadow-[var(--shadow-lg)]"
              style={{
                transform: "translateZ(80px)",
                boxShadow: "0 24px 50px rgba(0, 0, 0, 0.4)"
              }}
            >
              <div className="flex items-center justify-between mb-3 border-b border-[var(--border-strong)] pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[var(--gold-muted)] flex items-center justify-center text-[var(--gold)]">
                    <FiActivity size={14} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Live compensation index</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--gold)]">
                  <FiDollarSign size={12} /> Active
                </div>
              </div>

              {/* Ticker Content */}
              <div className="h-[52px] relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={salaryIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="absolute inset-0 flex flex-col justify-center"
                  >
                    <p className="text-[13px] font-bold text-white leading-none truncate mb-1">
                      {salaryStats[salaryIndex].role}
                    </p>
                    <div className="flex items-baseline justify-between">
                      <span className="text-[18px] font-black text-[var(--gold)] tracking-tight">
                        {salaryStats[salaryIndex].range}
                      </span>
                      <span className="text-[10px] font-semibold text-[var(--text-muted)] bg-white/5 rounded px-1.5 py-0.5">
                        {salaryStats[salaryIndex].change}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}
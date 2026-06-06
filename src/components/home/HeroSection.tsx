"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay } },
});

const popularTags = ["Engineering", "Finance", "Marketing", "Healthcare", "Remote"];

export default function HeroSection() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <section className="jj-hero">
      {/* Grid texture */}
      <div className="jj-hero__grid" aria-hidden />
      {/* Glow orbs */}
      <motion.div
        className="jj-hero__orb jj-hero__orb--gold"
        animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="jj-hero__orb jj-hero__orb--teal"
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      <div className="container-xl jj-hero__content">
        <motion.div variants={fadeUp(0)} initial="hidden" animate="show" className="jj-hero__badge">
          <motion.span
            className="jj-hero__badge-dot"
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          Live jobs updated daily
        </motion.div>

        <motion.h1 variants={fadeUp(0.1)} initial="hidden" animate="show" className="jj-hero__title">
          Your next role<br />
          <span className="jj-hero__title-accent">starts here.</span>
        </motion.h1>

        <motion.p variants={fadeUp(0.2)} initial="hidden" animate="show" className="jj-hero__sub">
          Discover opportunities across Nigeria. Subscribe via <strong>*7098#</strong>, then browse and apply in seconds.
        </motion.p>

        <motion.form variants={fadeUp(0.3)} initial="hidden" animate="show" onSubmit={handleSearch} className="jj-hero__search">
          <FiSearch size={18} style={{ color: "var(--gold-hover)", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search job title or company..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="jj-hero__search-input"
          />
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" className="jj-btn jj-btn--gold jj-hero__search-btn">
            Find Jobs <FiArrowRight size={16} />
          </motion.button>
        </motion.form>

        <motion.div variants={fadeUp(0.42)} initial="hidden" animate="show" className="jj-hero__tags">
          <span className="jj-hero__tags-label">Popular:</span>
          {popularTags.map((tag) => (
            <button key={tag} type="button" onClick={() => setKeyword(tag)} className="jj-hero__tag">
              {tag}
            </button>
          ))}
        </motion.div>

        <motion.div variants={fadeUp(0.52)} initial="hidden" animate="show" className="jj-hero__stats">
          {[
            { value: "300+", label: "Live listings" },
            { value: "*7098#", label: "Subscribe via USSD" },
            { value: "24/7", label: "Always available" },
          ].map((s) => (
            <div key={s.label} className="jj-hero__stat">
              <span className="jj-hero__stat-value">{s.value}</span>
              <span className="jj-hero__stat-label">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="jj-hero__wave" aria-hidden>
        <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 80 }}>
          <path d="M0 80H1440V30C1200 80 900 10 720 10C540 10 240 80 0 30V80Z" fill="var(--surface)" />
        </svg>
      </div>

      <style>{`
        .jj-hero {
          background: var(--ink);
          min-height: 92vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: calc(var(--nav-height) + 3rem) 0 5rem;
        }
        .jj-hero__grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 100%);
        }
        .jj-hero__orb {
          position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none;
        }
        .jj-hero__orb--gold {
          top: 10%; right: 5%; width: 420px; height: 420px;
          background: rgba(245, 166, 35, 0.18);
        }
        .jj-hero__orb--teal {
          bottom: 20%; left: 0; width: 360px; height: 360px;
          background: rgba(45, 212, 191, 0.1);
        }
        .jj-hero__content {
          text-align: center;
          position: relative;
          z-index: 1;
          max-width: 760px;
        }
        .jj-hero__badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 999px; padding: 6px 16px;
          font-size: 0.8125rem; font-weight: 600;
          color: rgba(255,255,255,0.7); margin-bottom: 1.75rem;
        }
        .jj-hero__badge-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--teal); display: inline-block;
        }
        .jj-hero__title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 800; color: #fff;
          line-height: 1.1; margin: 0 0 1.25rem;
          letter-spacing: -0.03em;
        }
        .jj-hero__title-accent {
          background: linear-gradient(135deg, var(--gold-light), var(--gold));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .jj-hero__sub {
          font-size: 1.0625rem; color: rgba(255,255,255,0.55);
          max-width: 480px; margin: 0 auto 2.5rem; line-height: 1.65;
        }
        .jj-hero__sub strong { color: var(--gold-light); font-weight: 700; }
        .jj-hero__search {
          display: flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.97);
          border-radius: var(--radius-md);
          padding: 8px 8px 8px 18px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.35);
          max-width: 580px; margin: 0 auto 1.5rem;
        }
        .jj-hero__search-input {
          flex: 1; border: none; outline: none; background: transparent;
          font-size: 0.9375rem; color: var(--ink); min-width: 0;
        }
        .jj-hero__search-input::placeholder { color: var(--text-faint); }
        .jj-hero__search-btn { padding: 12px 22px; white-space: nowrap; flex-shrink: 0; }
        .jj-hero__tags {
          display: flex; flex-wrap: wrap; align-items: center;
          justify-content: center; gap: 8px; margin-bottom: 3rem;
        }
        .jj-hero__tags-label { font-size: 0.8125rem; color: rgba(255,255,255,0.35); }
        .jj-hero__tag {
          background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.65); border-radius: 999px;
          padding: 5px 14px; font-size: 0.8125rem; font-weight: 600;
          cursor: pointer; transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .jj-hero__tag:hover {
          background: rgba(245,166,35,0.15); border-color: rgba(245,166,35,0.3);
          color: var(--gold-light);
        }
        .jj-hero__stats {
          display: flex; justify-content: center; gap: 2.5rem; flex-wrap: wrap;
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 2rem;
        }
        .jj-hero__stat { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .jj-hero__stat-value {
          font-family: var(--font-display), sans-serif;
          font-size: 1.375rem; font-weight: 800; color: var(--gold-light);
        }
        .jj-hero__stat-label { font-size: 0.75rem; color: rgba(255,255,255,0.4); font-weight: 500; }
        .jj-hero__wave { position: absolute; bottom: 0; left: 0; right: 0; line-height: 0; }
        @media (max-width: 640px) {
          .jj-hero__search { flex-wrap: wrap; padding: 12px; }
          .jj-hero__search-btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </section>
  );
}

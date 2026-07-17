"use client";
import Link from "next/link";
import { FiBriefcase, FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0A0A0C] via-[#121215] to-[#1F1F24] border-t border-[var(--border)] py-20">
      
      {/* Animated blobs */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[60px] -right-[60px] w-[300px] h-[300px] bg-[var(--gold-glow)] rounded-full blur-[60px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.09, 1], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-40px] left-[10%] w-[250px] h-[250px] bg-[var(--violet-glow)] rounded-full blur-[60px] pointer-events-none"
      />

      {/* Grid dots pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
          
          {/* Left Content Column */}
          <motion.div
            initial={{ opacity: 0, x: -48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[540px]"
          >
            <span className="inline-block bg-white/5 border border-white/10 text-[var(--gold)] text-[12px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4">
              Start Today — It&apos;s Free
            </span>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold text-white leading-tight mb-3.5 tracking-tight">
              The Smarter Way to Find Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)]">Next Opportunity</span>
            </h2>
            <p className="text-base text-[var(--text-muted)] leading-relaxed max-w-[460px]">
              Join over 4 million professionals already using JustJobNG. Whether you&apos;re looking for your first job or your next big career move — we&apos;ve got you covered.
            </p>
          </motion.div>

          {/* Right Action Column */}
          <motion.div
            initial={{ opacity: 0, x: 48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="flex flex-col gap-3.5 min-w-[260px] sm:max-w-xs w-full lg:w-auto"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/jobs"
                className="flex items-center justify-center gap-2.5 bg-[var(--gold)] text-[var(--ink)] font-bold text-[15px] no-underline px-8 py-3.5 rounded-lg shadow-[var(--shadow-gold)] hover:bg-[var(--gold-light)] transition-colors duration-200"
              >
                <FiSearch size={16} />
                Browse Jobs
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/post-job"
                className="flex items-center justify-center gap-2.5 bg-[#121215] text-white border border-[var(--border)] font-bold text-[15px] no-underline px-8 py-3.5 rounded-lg hover:bg-white/5 transition-colors duration-200"
              >
                <FiBriefcase size={16} />
                Post a Job
              </Link>
            </motion.div>

            <p className="text-[12px] text-[var(--text-faint)] text-center mt-1">
              No credit card required · Cancel anytime
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
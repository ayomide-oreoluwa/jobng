"use client";
import Link from "next/link";
import { FiBriefcase, FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-ink via-[#052914] to-gold-hover py-20">
      
      {/* Animated blobs */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[60px] -right-[60px] w-[300px] h-[300px] bg-[rgba(0,166,81,0.18)] rounded-full blur-[60px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.09, 1], opacity: [0.1, 0.18, 0.1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom---40px] left-[10%] w-[250px] h-[250px] bg-[rgba(141,198,63,0.12)] rounded-full blur-[60px] pointer-events-none"
      />

      {/* Grid dots pattern layout wrapper */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        {/* Switched to clear flex-col scaling to prevent items wrapping unevenly on tablets */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
          
          {/* Left Content Column */}
          <motion.div
            initial={{ opacity: 0, x: -48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[540px]"
          >
            <span className="inline-block bg-white/12 border border-white/20 text-white/80 text-[12px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4">
              Start Today — It&apos;s Free
            </span>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold text-white leading-tight mb-3.5 tracking-tight">
              The Smarter Way to Find Your{" "}
              <span className="text-teal">Next Opportunity</span>
            </h2>
            <p className="text-base text-[#CDEBB0]/88 leading-relaxed max-w-[460px]">
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
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/jobs"
                className="flex items-center justify-center gap-2.5 bg-white text-gold-hover font-bold text-[15px] no-underline px-8 py-3.5 rounded-sm shadow-md hover:bg-surface transition-colors duration-200"
              >
                <FiSearch size={16} />
                Browse Jobs
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/post-job"
                className="flex items-center justify-center gap-2.5 bg-white/12 text-white border-[1.5px] border-white/25 font-bold text-[15px] no-underline px-8 py-3.5 rounded-sm hover:bg-white/20 transition-colors duration-200"
              >
                <FiBriefcase size={16} />
                Post a Job
              </Link>
            </motion.div>

            <p className="text-[12px] text-white/45 text-center mt-1">
              No credit card required · Cancel anytime
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
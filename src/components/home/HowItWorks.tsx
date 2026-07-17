"use client";
import { FiSearch, FiFileText, FiSend, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import SectionHeader from "@/components/shared/SectionHeader";

const steps = [
  {
    icon: FiSearch,
    step: "01",
    title: "Search for Jobs",
    bg: "bg-[var(--gold-muted)]",
    color: "text-[var(--gold)]",
    border: "border-[var(--border)] hover:border-[var(--gold)]/30",
    desc: "Browse job listings filtered by location, category, salary, and job type to find your perfect match.",
  },
  {
    icon: FiFileText,
    step: "02",
    title: "Create Your Profile",
    bg: "bg-indigo-500/10",
    color: "text-indigo-400",
    border: "border-[var(--border)] hover:border-indigo-500/30",
    desc: "Build a professional profile that showcases your skills, experience, and portfolio. Make employers notice you.",
  },
  {
    icon: FiSend,
    step: "03",
    title: "Apply Instantly",
    bg: "bg-purple-500/10",
    color: "text-purple-400",
    border: "border-[var(--border)] hover:border-purple-500/30",
    desc: "Apply to multiple jobs with a single click. Track your application status in real time from your dashboard.",
  },
  {
    icon: FiCheckCircle,
    step: "04",
    title: "Get Hired",
    bg: "bg-emerald-500/10",
    color: "text-emerald-400",
    border: "border-[var(--border)] hover:border-emerald-500/30",
    desc: "Land interviews, negotiate offers, and start your new role. Thousands of candidates find jobs here every month.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-[#0A0A0C] border-t border-[var(--border)]">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHeader
          subtitle="Simple Process"
          title="How It Works"
          description="Get started with JustJobNG in four simple steps and land your dream job faster"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map(({ icon: Icon, step, title, bg, color, border, desc }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className={`bg-[#121215] border-[1px] ${border} rounded-xl p-7 relative text-center cursor-default transition-all duration-300`}
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1F1F24] border border-[var(--border-strong)] text-[var(--gold)] text-[11px] font-bold w-7 h-7 rounded-full flex items-center justify-center">
                {step}
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className={`w-14 h-14 ${bg} rounded-xl flex items-center justify-center mx-auto mt-4 mb-4`}
              >
                <Icon className={`${color} text-2xl`} aria-hidden="true" />
              </motion.div>

              <h3 className="font-bold text-[16px] text-white mb-2">{title}</h3>
              <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
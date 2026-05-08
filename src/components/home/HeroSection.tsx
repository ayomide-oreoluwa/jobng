"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiMapPin, FiGrid } from "react-icons/fi";
import { motion } from "framer-motion";

const locations = [
  "All Locations", "New York", "Los Angeles", "Miami",
  "London", "Paris", "Florida", "Nevada", "Washington", "Remote",
];
const categories = [
  "All Categories", "Design", "Development", "Marketing",
  "Accounting / Finance", "Human Resource", "Health and Care",
  "Customer", "Project Management", "Automotive Jobs",
];

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay } },
});

export default function HeroSection() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (location && location !== "All Locations") params.set("location", location);
    if (category && category !== "All Categories") params.set("category", category);
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <section
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)",
        minHeight: "88vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        paddingTop: "5rem",
        paddingBottom: "5rem",
      }}
    >
      {/* Animated blobs */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "10%", right: "10%",
          width: 400, height: 400,
          background: "rgba(99,102,241,0.18)", borderRadius: "50%",
          filter: "blur(80px)", pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.12, 0.2, 0.12] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        style={{
          position: "absolute", bottom: "15%", left: "5%",
          width: 500, height: 500,
          background: "rgba(59,130,246,0.14)", borderRadius: "50%",
          filter: "blur(100px)", pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div style={{ width: "100%", maxWidth: 900, padding: "0 1.5rem", textAlign: "center", position: "relative", zIndex: 1 }}>

        {/* Badge */}
        <motion.div
          variants={fadeUp(0)}
          initial="hidden"
          animate="show"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 999, padding: "6px 16px", marginBottom: 24,
            color: "rgba(255,255,255,0.8)", fontSize: 14,
          }}
        >
          <motion.span
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: 8, height: 8, background: "#34d399", borderRadius: "50%", display: "inline-block" }}
          />
          15,000+ Jobs Available Right Now
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={fadeUp(0.12)}
          initial="hidden"
          animate="show"
          style={{
            fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.15,
            marginBottom: 16,
            letterSpacing: "-0.02em",
          }}
        >
          Find Your{" "}
          <span style={{ background: "linear-gradient(90deg,#60a5fa,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Dream Job
          </span>
          {" "}Today
        </motion.h1>

        {/* Sub */}
        <motion.p
          variants={fadeUp(0.24)}
          initial="hidden"
          animate="show"
          style={{
            fontSize: "1.125rem", color: "rgba(186,218,255,0.85)",
            maxWidth: 520, margin: "0 auto 40px",
          }}
        >
          Browse thousands of job listings across all industries. Your next career move starts here.
        </motion.p>

        {/* Search Form */}
        <motion.form
          variants={fadeUp(0.36)}
          initial="hidden"
          animate="show"
          onSubmit={handleSearch}
          style={{
            background: "#ffffff",
            borderRadius: 16,
            padding: 10,
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            maxWidth: 820,
            margin: "0 auto",
          }}
        >
          {/* Keyword */}
          <div
            style={{
              flex: "1 1 200px",
              display: "flex", alignItems: "center", gap: 8,
              background: "#f8fafc", border: "1.5px solid #e2e8f0",
              borderRadius: 10, padding: "10px 14px",
            }}
          >
            <FiSearch style={{ color: "#1967D2", flexShrink: 0 }} size={16} />
            <input
              type="text"
              placeholder="Job title, keywords..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{
                flex: 1, border: "none", outline: "none", background: "transparent",
                fontSize: 14, color: "#374151",
              }}
            />
          </div>

          {/* Location */}
          <div
            style={{
              flex: "1 1 160px",
              display: "flex", alignItems: "center", gap: 8,
              background: "#f8fafc", border: "1.5px solid #e2e8f0",
              borderRadius: 10, padding: "10px 14px",
            }}
          >
            <FiMapPin style={{ color: "#1967D2", flexShrink: 0 }} size={15} />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                flex: 1, border: "none", outline: "none", background: "transparent",
                fontSize: 14, color: "#374151", cursor: "pointer",
              }}
            >
              {locations.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Category */}
          <div
            style={{
              flex: "1 1 180px",
              display: "flex", alignItems: "center", gap: 8,
              background: "#f8fafc", border: "1.5px solid #e2e8f0",
              borderRadius: 10, padding: "10px 14px",
            }}
          >
            <FiGrid style={{ color: "#1967D2", flexShrink: 0 }} size={15} />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                flex: 1, border: "none", outline: "none", background: "transparent",
                fontSize: 14, color: "#374151", cursor: "pointer",
              }}
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, background: "#1558b8" }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            style={{
              flex: "0 0 auto",
              background: "#1967D2", color: "#fff",
              border: "none", borderRadius: 10,
              padding: "12px 28px", fontSize: 14,
              fontWeight: 700, cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Find Jobs
          </motion.button>
        </motion.form>

        {/* Popular tags */}
        <motion.div
          variants={fadeUp(0.48)}
          initial="hidden"
          animate="show"
          style={{ marginTop: 24, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>Popular:</span>
          {["Designer", "Developer", "Marketing", "Finance", "Remote"].map((tag) => (
            <motion.button
              key={tag}
              type="button"
              whileHover={{ background: "rgba(255,255,255,0.18)", borderColor: "rgba(255,255,255,0.35)", color: "rgba(255,255,255,0.95)" }}
              whileTap={{ scale: 0.93 }}
              onClick={() => setKeyword(tag)}
              style={{
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.7)", borderRadius: 999,
                padding: "4px 14px", fontSize: 13, cursor: "pointer",
              }}
            >
              {tag}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Wave */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%" }}>
          <path d="M0 60L1440 60L1440 20C1200 60 840 0 720 0C600 0 240 60 0 20L0 60Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}

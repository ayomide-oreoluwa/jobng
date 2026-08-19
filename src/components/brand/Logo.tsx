"use client";

import { useId } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export interface LogoProps {
  /** Show wordmark beside the mark */
  showText?: boolean;
  /** light = for dark backgrounds, dark = for light backgrounds */
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  /** Enable smooth micro-animations */
  animated?: boolean;
}

const sizes = {
  sm: { 
    mark: 32, 
    text: "text-lg", 
    gap: "gap-2"
  },
  md: { 
    mark: 40, 
    text: "text-xl sm:text-2xl", 
    gap: "gap-2.5"
  },
  lg: { 
    mark: 48, 
    text: "text-2xl sm:text-3xl", 
    gap: "gap-3"
  },
};

function LogoMark({ 
  size, 
  animated = true 
}: { 
  size: number; 
  animated?: boolean; 
}) {
  const rawId = useId();
  const gradId = `logoGrad-${rawId.replace(/:/g, "")}`;

  return (
    <div 
      className="relative flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 ease-out"
      style={{ width: size, height: size }}
    >
      {/* Ambient Glow behind the logo mark */}
      {animated && (
        <div 
          className="absolute inset-0 rounded-xl bg-linear-to-tr from-[#8DC63F] to-[#00A651] opacity-25 blur-md group-hover:opacity-60 transition-opacity duration-300 pointer-events-none"
          aria-hidden
        />
      )}

      {/* Main SVG Logo */}
      <svg
        className="relative z-10 w-full h-full drop-shadow-sm"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* Background Tile */}
        <rect 
          width="44" 
          height="44" 
          rx="12" 
          className="fill-slate-950" 
        />

        {/* Subtle Glass Subtle Outer Stroke */}
        <rect 
          x="0.5" 
          y="0.5" 
          width="43" 
          height="43" 
          rx="11.5" 
          className="stroke-white/15" 
        />

        {/* Upward Arrow Icon with optional floating animation */}
        <motion.path
          animate={animated ? { y: [0, -1.5, 0] } : undefined}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          d="M22 10L30 20H25.5V32H18.5V20H14L22 10Z"
          fill={`url(#${gradId})`}
        />

        {/* Pulsing Accent Dot */}
        <circle 
          cx="22" 
          cy="36" 
          r="2.5" 
          className="fill-[#00A651] animate-pulse" 
        />

        <defs>
          <linearGradient 
            id={gradId} 
            x1="14" 
            y1="10" 
            x2="30" 
            y2="32" 
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#8DC63F" />
            <stop offset="1" stopColor="#00A651" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function Logo({
  showText = true,
  variant = "light",
  size = "md",
  href = "/",
  className = "",
  animated = true,
}: LogoProps) {
  const s = sizes[size];
  const textColor = variant === "light" ? "text-white" : "text-slate-900";

  const content = (
    <span
      className={`group inline-flex items-center ${s.gap} select-none cursor-pointer focus:outline-none ${className}`}
    >
      <LogoMark size={s.mark} animated={animated} />
      
      {showText && (
        <span className="flex items-baseline font-black tracking-tight leading-none">
          <span className={`${s.text} ${textColor} transition-colors duration-200`}>
            Job
          </span>
          <span className={`${s.text} text-[#00A651] transition-transform duration-200 group-hover:translate-x-0.5`}>
            NG
          </span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link 
        href={href} 
        className="inline-block no-underline rounded-xl focus-visible:ring-2 focus-visible:ring-[#00A651] focus-visible:ring-offset-2 focus:outline-none" 
        aria-label="jobNG Home"
      >
        {content}
      </Link>
    );
  }

  return content;
}
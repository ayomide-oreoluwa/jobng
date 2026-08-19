"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  hasError?: boolean;
  autoFocus?: boolean;
  onComplete?: (code: string) => void;
  className?: string;
}

export function OtpInput({
  value = "",
  onChange,
  length = 6,
  disabled = false,
  hasError = false,
  autoFocus = true,
  onComplete,
  className = "",
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  useEffect(() => {
    if (autoFocus && !disabled) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus, disabled]);

  const focusBox = (index: number) => {
    if (index >= 0 && index < length) {
      inputRefs.current[index]?.focus();
      inputRefs.current[index]?.select();
    }
  };

  const updateValue = (nextDigits: string[]) => {
    const combined = nextDigits.join("").slice(0, length);
    onChange(combined);
    if (combined.length === length && onComplete) {
      onComplete(combined);
    }
  };

  const handleChange = (index: number, raw: string) => {
    const clean = raw.replace(/\D/g, "");
    if (!clean) {
      const next = [...digits];
      next[index] = "";
      updateValue(next);
      return;
    }

    if (clean.length > 1) {
      const next = [...digits];
      for (let i = 0; i < clean.length && index + i < length; i++) {
        next[index + i] = clean[i];
      }
      updateValue(next);
      focusBox(Math.min(index + clean.length, length - 1));
      return;
    }

    const next = [...digits];
    next[index] = clean;
    updateValue(next);
    if (index < length - 1) focusBox(index + 1);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        updateValue(next);
      } else if (index > 0) {
        const next = [...digits];
        next[index - 1] = "";
        updateValue(next);
        focusBox(index - 1);
      }
      e.preventDefault();
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusBox(index - 1);
      e.preventDefault();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      focusBox(index + 1);
      e.preventDefault();
    }
  };

  return (
    <div className={`flex items-center justify-center gap-2 sm:gap-3 select-none ${className}`}>
      {digits.map((digit, index) => {
        const isFilled = Boolean(digit);
        return (
          <motion.div
            key={index}
            whileHover={{ scale: disabled ? 1 : 1.04 }}
            whileTap={{ scale: disabled ? 1 : 0.96 }}
            className="relative"
          >
            <input
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              disabled={disabled}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`
                w-11 h-14 sm:w-13 sm:h-16 text-center font-extrabold text-xl sm:text-2xl
                rounded-2xl border transition-all duration-200 outline-none
                ${
                  hasError
                    ? "border-red-500/80 bg-red-500/5 text-red-600 focus:ring-4 focus:ring-red-500/20"
                    : isFilled
                    ? "border-[#00A651] bg-[#00A651]/5 text-slate-900 focus:ring-4 focus:ring-[#00A651]/20 shadow-xs"
                    : "border-slate-200 bg-white text-slate-900 focus:border-[#00A651] focus:ring-4 focus:ring-[#00A651]/20 shadow-xs"
                }
                ${disabled ? "opacity-50 cursor-not-allowed bg-slate-100" : "cursor-pointer"}
              `}
            />
            {isFilled && !hasError && (
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00A651]" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
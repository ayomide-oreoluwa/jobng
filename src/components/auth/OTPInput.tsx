"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export interface OtpInputProps {
  /** The controlled string value of the OTP */
  value: string;
  /** Callback fired whenever the OTP digits change */
  onChange: (value: string) => void;
  /** Number of OTP boxes to display (default: 6) */
  length?: number;
  /** Disable all inputs */
  disabled?: boolean;
  /** Apply error styling across all input boxes */
  hasError?: boolean;
  /** Auto-focus the first empty input box on mount */
  autoFocus?: boolean;
  /** Callback fired automatically when all digits are filled */
  onComplete?: (code: string) => void;
  /** Additional container styling */
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

  // Create an array representing each box position
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  // Auto-focus the first input on initial mount
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

  const setDigitAt = (index: number, digit: string) => {
    const next = [...digits];
    next[index] = digit;
    updateValue(next);
  };

  const handleChange = (index: number, raw: string) => {
    const clean = raw.replace(/\D/g, "");

    if (!clean) {
      setDigitAt(index, "");
      return;
    }

    // Handles pasting or mobile keyboard auto-fill batch input
    if (clean.length > 1) {
      const next = [...digits];
      for (let i = 0; i < clean.length && index + i < length; i++) {
        next[index + i] = clean[i];
      }
      updateValue(next);

      const nextFocus = Math.min(index + clean.length, length - 1);
      focusBox(nextFocus);
      return;
    }

    // Single digit entry
    setDigitAt(index, clean);
    if (index < length - 1) {
      focusBox(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        setDigitAt(index, "");
      } else if (index > 0) {
        setDigitAt(index - 1, "");
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

  const handlePaste = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;

    const next = [...digits];
    for (let i = 0; i < pasted.length && index + i < length; i++) {
      next[index + i] = pasted[i];
    }
    updateValue(next);

    const lastFilled = Math.min(index + pasted.length, length - 1);
    focusBox(lastFilled);
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
              aria-label={`Digit ${index + 1} of ${length}`}
              disabled={disabled}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={(e) => handlePaste(index, e)}
              onFocus={(e) => e.target.select()}
              className={`
                w-11 h-14 sm:w-13 sm:h-16
                text-center font-extrabold text-xl sm:text-2xl
                rounded-2xl border transition-all duration-200 outline-none
                ${
                  hasError
                    ? "border-red-500/80 bg-red-500/5 text-red-600 focus:ring-4 focus:ring-red-500/20"
                    : isFilled
                    ? "border-[#00A651] bg-[#00A651]/5 text-slate-900 focus:ring-4 focus:ring-[#00A651]/20 shadow-xs"
                    : "border-slate-200 bg-white text-slate-900 focus:border-[#00A651] focus:ring-4 focus:ring-[#00A651]/20 focus:bg-white shadow-xs"
                }
                ${disabled ? "opacity-50 cursor-not-allowed bg-slate-100" : "cursor-pointer"}
              `}
            />

            {/* Subtle Active Indicator Dot */}
            {isFilled && !hasError && (
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00A651]" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
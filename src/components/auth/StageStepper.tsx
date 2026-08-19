"use client";

import React from "react";
import { motion } from "framer-motion";

interface StageStepperProps {
  currentStep: number;
  totalSteps?: number;
}

export function StageStepper({ currentStep, totalSteps = 3 }: StageStepperProps) {
  return (
    <div className="w-full mb-6 select-none">
      {/* Left-Aligned Compact Pill Indicator */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;

          return (
            <motion.div
              key={stepNumber}
              layout
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className={`h-2 rounded-full ${
                isActive
                  ? "w-9 bg-gradient-to-r from-[#00A651] to-emerald-400"
                  : isCompleted
                  ? "w-4.5 bg-[#00A651]"
                  : "w-4.5 bg-slate-500"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
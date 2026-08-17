'use client';

import React from 'react';
import { UserResponse } from '@/types/interview';
import { FiAward, FiRotateCcw } from 'react-icons/fi';

interface InterviewResultsProps {
  responses: UserResponse[];
  onRestart: () => void;
}

export const InterviewResults: React.FC<InterviewResultsProps> = ({ responses, onRestart }) => {
  const correctCount = responses.filter((r) => r.isCorrect).length;
  const scorePercentage = Math.round((correctCount / (responses.length || 1)) * 100);

  return (
    <div className="max-w-2xl mx-auto bg-white border border-[#0F172A]/10 rounded-3xl p-8 text-center space-y-6 shadow-md">
      <div className="w-16 h-16 bg-[#00A651]/10 border border-[#00A651]/20 text-[#00A651] rounded-full flex items-center justify-center mx-auto">
        <FiAward className="w-8 h-8" />
      </div>

      <div>
        <h2 className="text-2xl font-extrabold text-[#0A0F1C]">Interview Completed!</h2>
        <p className="text-xs text-[#64748B] mt-1">
          Here is your total score breakdown across selected technical categories.
        </p>
      </div>

      <div className="bg-[#F5F4F0] border border-[#0F172A]/10 p-6 rounded-2xl flex items-center justify-around">
        <div>
          <span className="text-3xl font-extrabold text-[#00A651]">{scorePercentage}%</span>
          <p className="text-xs text-[#64748B] mt-1">Overall Accuracy</p>
        </div>
        <div className="h-10 w-px bg-[#0F172A]/10" />
        <div>
          <span className="text-3xl font-extrabold text-[#0A0F1C]">
            {correctCount} / {responses.length}
          </span>
          <p className="text-xs text-[#64748B] mt-1">Correct Answers</p>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="w-full py-4 rounded-2xl bg-[#0A0F1C] hover:bg-[#151B2E] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
      >
        <FiRotateCcw className="w-4 h-4" />
        <span>Configure New Practice Session</span>
      </button>
    </div>
  );
};
'use client';

import React, { useState } from 'react';

import { JOB_ROLES } from '@/data/interviewData';
import { InterviewConfig, JobRole, DifficultyLevel, TimerOption } from '@/types/interview';
import { FiBriefcase, FiSliders, FiTimer, FiHelpCircle, FiArrowRight } from 'react-icons/fi';
import { FiClock } from 'react-icons/fi';

interface InterviewSetupProps {
  onStartSession: (config: InterviewConfig) => void;
}

export const InterviewSetup: React.FC<InterviewSetupProps> = ({ onStartSession }) => {
  const [selectedRole, setSelectedRole] = useState<JobRole>('frontend');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [timer, setTimer] = useState<TimerOption>(120);
  const [questionCount, setQuestionCount] = useState<number>(20);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartSession({
      jobRole: selectedRole,
      difficulty,
      timerPerQuestion: timer,
      questionCount,
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border border-[#0F172A]/10 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(10,15,28,0.08)]">
      {/* Header */}
      <div className="mb-8 text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A0F1C] tracking-tight">
          Configure Your <span className="text-[#00A651]">Mock Interview</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#64748B]">
          Choose target job, difficulty bar, per-question timer, and target question count.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Target Job Role */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-[#00A651] uppercase tracking-wider">
            <FiBriefcase className="w-4 h-4" /> 1. Select Target Job Role
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {JOB_ROLES.map((role) => (
              <button
                type="button"
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`p-4 rounded-2xl text-left border transition-all ${
                  selectedRole === role.id
                    ? 'bg-[#00A651]/10 border-[#00A651] text-[#0A0F1C] shadow-[0_4px_20px_rgba(0,166,81,0.15)] ring-1 ring-[#00A651]'
                    : 'bg-[#F5F4F0] border-[#0F172A]/10 text-[#64748B] hover:border-[#0F172A]/20'
                }`}
              >
                <div className="font-bold text-sm text-[#0A0F1C]">{role.label}</div>
                <div className="text-[11px] text-[#64748B] mt-1 truncate">
                  {role.categories.join(' → ')}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Difficulty Level Selector Bar */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-[#00A651] uppercase tracking-wider">
            <FiSliders className="w-4 h-4" /> 2. Difficulty Level Bar
          </label>
          <div className="grid grid-cols-3 gap-2 bg-[#F5F4F0] p-1.5 rounded-2xl border border-[#0F172A]/10">
            {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((level) => (
              <button
                type="button"
                key={level}
                onClick={() => setDifficulty(level)}
                className={`py-2.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  difficulty === level
                    ? 'bg-gradient-to-r from-[#8DC63F] to-[#00A651] text-white shadow-md'
                    : 'text-[#64748B] hover:text-[#0A0F1C]'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Per Question Timer */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-[#00A651] uppercase tracking-wider">
            <FiClock className="w-4 h-4" /> 3. Per Question Timer
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '60s', value: 60 },
              { label: '2 mins', value: 120 },
              { label: '3 mins', value: 180 },
              { label: 'Untimed', value: 0 },
            ].map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setTimer(opt.value as TimerOption)}
                className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  timer === opt.value
                    ? 'bg-[#00A651]/10 border-[#00A651] text-[#00863F]'
                    : 'bg-[#F5F4F0] border-[#0F172A]/10 text-[#64748B] hover:border-[#0F172A]/20'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Question Count Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-xs font-bold text-[#00A651] uppercase tracking-wider">
              <FiHelpCircle className="w-4 h-4" /> 4. Number of Questions
            </label>
            <span className="text-xs font-bold text-[#00863F] bg-[#00A651]/15 px-3 py-1 rounded-full border border-[#00A651]/20">
              {questionCount} Questions
            </span>
          </div>
          <input
            type="range"
            min={20}
            max={60}
            step={5}
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full accent-[#00A651] bg-[#F5F4F0] h-2 rounded-lg cursor-pointer border border-[#0F172A]/10"
          />
          <div className="flex justify-between text-[11px] text-[#64748B] font-medium">
            <span>Minimum: 20</span>
            <span>Maximum: 60</span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#8DC63F] via-[#00A651] to-[#00863F] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_8px_32px_rgba(0,166,81,0.25)] hover:shadow-[0_12px_40px_rgba(0,166,81,0.35)] transition-all active:scale-[0.99]"
        >
          <span>Start Interview Practice</span>
          <FiArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

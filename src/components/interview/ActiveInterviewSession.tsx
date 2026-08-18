/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect } from 'react';
import { Question, InterviewConfig, UserResponse } from '@/types/interview';
import { FiClock, FiEye, FiArrowRight, FiArrowLeft, FiCheck } from 'react-icons/fi';

interface ActiveInterviewSessionProps {
  questions: Question[];
  config: InterviewConfig;
  onComplete: (responses: UserResponse[]) => void;
}

export const ActiveInterviewSession: React.FC<ActiveInterviewSessionProps> = ({
  questions,
  config,
  onComplete,
}) => {
  const TIMER_LIMIT = 60; // 60s per question standard
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(TIMER_LIMIT);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Track selected options per question index
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );

  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  // Timer logic - resets to 60s per question
  useEffect(() => {
    setTimeLeft(TIMER_LIMIT);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return TIMER_LIMIT;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Handle option select with automatic advance
  const handleSelectOption = (index: number) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentIndex] = index;
    setSelectedAnswers(updatedAnswers);

    // Auto advance to next question after subtle feedback pause (250ms)
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setShowExplanation(false);
        setCurrentIndex((prev) => prev + 1);
      }
    }, 250);
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setShowExplanation(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishInterview();
    }
  };

  const finishInterview = () => {
    const finalResponses: UserResponse[] = questions.map((q, idx) => {
      const selected = selectedAnswers[idx];
      return {
        questionId: q.id,
        selectedOptionIndex: selected,
        isCorrect: selected === q.correctOptionIndex,
        timeSpentSeconds: TIMER_LIMIT - timeLeft,
      };
    });
    onComplete(finalResponses);
  };

  const currentSelectedOption = selectedAnswers[currentIndex];

  return (
    <div className="font-['Lato',sans-serif] max-w-3xl mx-auto space-y-5 pb-10">
      
      {/* Category Progression Bar & Timers */}
      <div className="bg-white border border-[#0F172A]/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#00A651]/10 text-[#00863F] text-xs font-bold border border-[#00A651]/20">
            {currentQuestion.category}
          </span>
          <p className="text-xs text-[#64748B] mt-1.5 font-medium">
            Question <span className="text-[#0A0F1C] font-bold">{currentIndex + 1}</span> of {questions.length}
          </p>
        </div>

        {/* 60s Question Timer */}
        <div className="flex items-center gap-2 bg-[#F8F9FA] border border-[#0F172A]/10 px-3.5 py-1.5 rounded-xl text-[#0A0F1C] font-mono font-bold text-sm">
          <FiClock className={`w-4 h-4 ${timeLeft <= 10 ? 'text-red-500 animate-bounce' : 'text-[#00A651]'}`} />
          <span>00:{String(timeLeft).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#E8E6E1] h-2 rounded-full overflow-hidden">
        <div
          className="bg-[#00A651] h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white border border-[#0F172A]/10 rounded-3xl p-5 sm:p-8 space-y-6 shadow-sm">
        <h3 className="text-base sm:text-lg font-bold text-[#0A0F1C] leading-snug">
          {currentQuestion.questionText}
        </h3>

        {/* Options List */}
        <div className="space-y-2.5">
          {currentQuestion.options.map((optText, idx) => {
            const isSelected = currentSelectedOption === idx;
            return (
              <button
                type="button"
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all ${
                  isSelected
                    ? 'bg-[#00A651]/10 border-[#00A651] text-[#0A0F1C] font-semibold ring-1 ring-[#00A651]'
                    : 'bg-[#F8F9FA] border-[#0F172A]/10 text-[#1E293B] hover:bg-slate-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-[#00A651] border-[#00A651] text-white'
                        : 'border-[#64748B] text-[#64748B]'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-xs sm:text-sm leading-relaxed">{optText}</span>
                </div>
                {isSelected && <FiCheck className="w-4 h-4 text-[#00A651] flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Concept Explanation Toggle */}
        <div className="border-t border-[#0F172A]/10 pt-4">
          <button
            type="button"
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-xs font-bold text-[#00863F] flex items-center gap-1.5 hover:underline"
          >
            <FiEye className="w-4 h-4" />
            <span>{showExplanation ? 'Hide Explanation' : 'View Concept Hint'}</span>
          </button>

          {showExplanation && (
            <div className="mt-3 p-3.5 bg-[#F8F9FA] rounded-2xl border border-[#0F172A]/10 text-xs text-[#1E293B] leading-relaxed">
              <strong className="text-[#0A0F1C] block mb-1">Explanation:</strong>
              {currentQuestion.explanation}
            </div>
          )}
        </div>

        {/* Dynamic Prev / Next Controls */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handlePrevQuestion}
            disabled={currentIndex === 0}
            className={`px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
              currentIndex === 0
                ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200'
                : 'bg-white border-[#0F172A]/20 text-[#0A0F1C] hover:bg-gray-50'
            }`}
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentIndex + 1 === questions.length ? (
            <button
              type="button"
              onClick={finishInterview}
              className="px-6 py-3 rounded-xl bg-[#00A651] hover:bg-[#00863F] text-white font-bold text-xs flex items-center gap-2 shadow-md"
            >
              <span>Submit & Finish</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextQuestion}
              className="px-5 py-3 rounded-xl bg-[#0A0F1C] hover:bg-[#151B2E] text-white font-bold text-xs flex items-center gap-2 shadow-sm"
            >
              <span>Next</span>
              <FiArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Powered by Attribution */}
      <div className="text-center pt-2">
        <span className="text-[11px] text-[#64748B] font-medium">
          Powered by <strong className="text-[#00A651]">Maekandex Academy</strong>
        </span>
      </div>
    </div>
  );
};
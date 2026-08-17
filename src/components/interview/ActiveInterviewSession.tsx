'use client';

import React, { useState, useEffect } from 'react';
import { Question, InterviewConfig, UserResponse } from '@/types/interview';
import { FiClock, FiEye, FiArrowRight } from 'react-icons/fi';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(config.timerPerQuestion);
  const [showExplanation, setShowExplanation] = useState(false);
  const [responses, setResponses] = useState<UserResponse[]>([]);

  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  // Per-question timer logic
  useEffect(() => {
    if (config.timerPerQuestion === 0) return; // Untimed

    setTimeLeft(config.timerPerQuestion);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return config.timerPerQuestion;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, config.timerPerQuestion]);

  const handleNextQuestion = () => {
    const isCorrect = selectedOption === currentQuestion.correctOptionIndex;

    const newResponse: UserResponse = {
      questionId: currentQuestion.id,
      selectedOptionIndex: selectedOption,
      isCorrect,
      timeSpentSeconds: config.timerPerQuestion > 0 ? config.timerPerQuestion - timeLeft : 0,
    };

    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);
    setSelectedOption(null);
    setShowExplanation(false);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete(updatedResponses);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Category Progression Bar & Timers */}
      <div className="bg-white border border-[#0F172A]/10 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00A651]/10 text-[#00863F] text-xs font-bold border border-[#00A651]/20">
            {currentQuestion.category}
          </div>
          <p className="text-xs text-[#64748B] mt-2">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>

        {/* Timer */}
        {config.timerPerQuestion > 0 && (
          <div className="flex items-center gap-2 bg-[#F5F4F0] border border-[#0F172A]/10 px-4 py-2 rounded-xl text-[#0A0F1C] font-mono font-bold text-base">
            <FiClock className="w-5 h-5 text-[#00A651] animate-pulse" />
            <span>
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#E8E6E1] h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-[#8DC63F] to-[#00A651] h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white border border-[#0F172A]/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h3 className="text-lg sm:text-xl font-extrabold text-[#0A0F1C] leading-snug">
          {currentQuestion.questionText}
        </h3>

        {/* Options List */}
        <div className="space-y-3">
          {currentQuestion.options.map((optText, idx) => {
            const isSelected = selectedOption === idx;
            return (
              <button
                type="button"
                key={idx}
                onClick={() => setSelectedOption(idx)}
                className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  isSelected
                    ? 'bg-[#00A651]/10 border-[#00A651] text-[#0A0F1C] font-semibold ring-1 ring-[#00A651]'
                    : 'bg-[#F5F4F0]/60 border-[#0F172A]/10 text-[#1E293B] hover:bg-[#F5F4F0]'
                }`}
              >
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
              </button>
            );
          })}
        </div>

        {/* Toggle Explanation */}
        <div className="border-t border-[#0F172A]/10 pt-4">
          <button
            type="button"
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-xs font-bold text-[#00863F] flex items-center gap-1.5 hover:underline"
          >
            <FiEye className="w-4 h-4" />
            <span>{showExplanation ? 'Hide Explanation' : 'View Concept Explanation'}</span>
          </button>

          {showExplanation && (
            <div className="mt-3 p-4 bg-[#F5F4F0] rounded-2xl border border-[#0F172A]/10 text-xs text-[#1E293B] leading-relaxed">
              <strong className="text-[#0A0F1C] block mb-1">Answer Concept:</strong>
              {currentQuestion.explanation}
            </div>
          )}
        </div>

        {/* Submit / Next Button */}
        <button
          type="button"
          disabled={selectedOption === null}
          onClick={handleNextQuestion}
          className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            selectedOption !== null
              ? 'bg-gradient-to-r from-[#8DC63F] via-[#00A651] to-[#00863F] text-white shadow-[0_8px_32px_rgba(0,166,81,0.25)] hover:shadow-[0_12px_40px_rgba(0,166,81,0.35)]'
              : 'bg-[#E8E6E1] text-[#94A3B8] cursor-not-allowed'
          }`}
        >
          <span>{currentIndex + 1 === questions.length ? 'Finish Session' : 'Next Question'}</span>
          <FiArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
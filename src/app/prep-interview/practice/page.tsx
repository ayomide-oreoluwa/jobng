'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InterviewConfig, Question, UserResponse } from '@/types/interview';
import { getQuestionsForSession } from '@/data/interviewData';
import { ActiveInterviewSession } from '@/components/interview/ActiveInterviewSession';
import { InterviewResults } from '@/components/interview/InterviewResults';
import { InterviewSetup } from '@/components/interview/InterviewSetup';

export default function InterviewPrepPracticePage() {
  const router = useRouter();
  const [config, setConfig] = useState<InterviewConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<UserResponse[] | null>(null);

  const handleStartSession = (newConfig: InterviewConfig) => {
    setConfig(newConfig);
    const sessionQuestions = getQuestionsForSession(
      newConfig.jobRole,
      newConfig.difficulty,
      newConfig.questionCount
    );
    setQuestions(sessionQuestions);
    setResponses(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    setConfig(null);
    setQuestions([]);
    setResponses(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyForJobs = () => {
    router.push('/jobs');
  };

  return (
    <main className="font-['Lato',sans-serif] min-h-screen bg-[#F8F9FA] text-[#0A0F1C] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-all">
      <div className="max-w-6xl mx-auto">
        {/* Step 1: Configuration Setup */}
        {!config && <InterviewSetup onStartSession={handleStartSession} />}

        {/* Step 2: Active Test Session */}
        {config && questions.length > 0 && !responses && (
          <ActiveInterviewSession
            questions={questions}
            config={config}
            onComplete={(finalResponses) => {
              setResponses(finalResponses);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Step 3: Results & Analytics */}
        {responses && (
          <InterviewResults
            responses={responses}
            onRestart={handleRestart}
            onApplyForJobs={handleApplyForJobs}
          />
        )}
      </div>
    </main>
  );
}
'use client';

import React, { useState } from 'react';
import { InterviewConfig, Question, UserResponse } from '@/types/interview';
import { generateInterviewSession } from '@/data/interviewData';
import { ActiveInterviewSession } from '@/components/interview/ActiveInterviewSession';
import { InterviewResults } from '@/components/interview/InterviewResults';
import { InterviewSetup } from '@/components/interview/InterviewSetup';

export default function InterviewPrepPracticePage() {
  const [config, setConfig] = useState<InterviewConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<UserResponse[] | null>(null);

  const handleStartSession = (newConfig: InterviewConfig) => {
    setConfig(newConfig);
    const sessionQuestions = generateInterviewSession(
      newConfig.jobRole,
      newConfig.difficulty,
      newConfig.questionCount
    );
    setQuestions(sessionQuestions);
    setResponses(null);
  };

  return (
    <main className="min-h-screen bg-[#F5F4F0] text-[#1E293B] py-12 px-4 sm:px-6 lg:px-8">
      {!config && <InterviewSetup onStartSession={handleStartSession} />}

      {config && questions.length > 0 && !responses && (
        <ActiveInterviewSession
          questions={questions}
          config={config}
          onComplete={(finalResponses) => setResponses(finalResponses)}
        />
      )}

      {responses && (
        <InterviewResults
          responses={responses}
          onRestart={() => {
            setConfig(null);
            setResponses(null);
          }}
        />
      )}
    </main>
  );
}

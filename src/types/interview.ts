export type JobRole = 
  | 'frontend' 
  | 'backend' 
  | 'fullstack' 
  | 'mobile' 
  | 'devops' 
  | 'data-engineer'
  | 'product-manager'
  | 'leadership'
  | 'customer-service'
  | 'finance-accounting'
  | 'cybersecurity'
  | 'excel-expert'
  | 'data-analyst'
  | 'ui-ux-designer'
  | 'project-manager'
  | 'software-developer'
  | 'ai-engineer'
  | 'internship-entry'
  | 'managerial'
  | 'digital-marketing'
  | 'sales';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type TimerOption = 60 | 120 | 180 | 0; // seconds per question (0 = untimed)

export interface Question {
  id: string;
  jobRole: JobRole;
  category: string;
  categoryOrder: number; // 1 to 5 sequential progression
  difficulty: DifficultyLevel;
  title: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface InterviewConfig {
  jobRole: JobRole;
  difficulty: DifficultyLevel;
  timerPerQuestion: TimerOption;
  questionCount: number; // 20 to 60
}

export interface UserResponse {
  questionId: string;
  selectedOptionIndex: number | null;
  isCorrect: boolean;
  timeSpentSeconds: number;
}
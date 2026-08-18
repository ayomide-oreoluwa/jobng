export type JobRole = 
  | 'frontend' 
  | 'backend' 
  | 'fullstack' 
  | 'devops' 
  | 'mobile' 
  | 'data-science' 
  | 'ui-ux' 
  | 'product-management';

export type DifficultyLevel = 'easy' | 'medium';

export interface Question {
  id: string;
  category: string;
  jobRole: JobRole;
  difficulty: DifficultyLevel;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface InterviewConfig {
  jobRole: JobRole;
  difficulty: DifficultyLevel;
  questionCount: number; // Min 5, Max 25
}

export interface UserResponse {
  questionId: string;
  selectedOptionIndex: number | null;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface JobRoleOption {
  id: JobRole;
  label: string;
  categories: string[];
}
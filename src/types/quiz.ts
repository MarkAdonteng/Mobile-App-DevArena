export type ProgrammingLanguage = 'Python' | 'JavaScript' | 'Java' | 'C++' | 'React' | 'TypeScript';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Lesson {
  id: string;
  title: string;
  content: string;
  codeExamples: string[];
  difficulty: Difficulty;
  order: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  code?: string;
}

export interface Quiz {
  questions: QuizQuestion[];
  language: ProgrammingLanguage;
  difficulty: Difficulty;
}

export interface QuizProgress {
  completed: boolean;
  score: number;
  timestamp: number;
}

export interface UserProgress {
  [lessonId: string]: QuizProgress;
} 
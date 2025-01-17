export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type ProgrammingLanguage = 
  | 'Python' 
  | 'JavaScript' 
  | 'TypeScript' 
  | 'C++' 
  | 'Java' 
  | 'React'
  | 'Swift' 
  | 'Kotlin' 
  | 'Go' 
  | 'Rust'
  | 'PHP'
  | 'C#'
  | 'Flutter'
  | 'Next.js';

export type QuizQuestion = {
  id: string;
  question: string;
  code?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

export type QuizTopic = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type Quiz = {
  id: string;
  language: ProgrammingLanguage;
  topic: string;
  difficulty: DifficultyLevel;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit: number;
  points: number;
};

export type QuizProgress = {
  quizId: string;
  completed: boolean;
  score: number;
  dateTaken: string;
}; 
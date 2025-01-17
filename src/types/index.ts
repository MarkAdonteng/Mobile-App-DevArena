import { RootStackParamList } from './navigation';

export type ProgrammingLanguage = 'Python' | 'JavaScript' | 'Java' | 'C++';

export type GameType = 'Quiz' | 'CodeChallenge' | 'Visualization';

export type Module = {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  language: ProgrammingLanguage;
  points: number;
  completed: boolean;
  games: Game[];
};

export type Game = {
  id: string;
  title: string;
  type: GameType;
  points: number;
  completed: boolean;
  content: GameContent;
};

export type GameContent = {
  questions?: QuizQuestion[];
  challenge?: CodeChallenge;
  visualization?: VisualizationData;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

export type CodeChallenge = {
  instructions: string;
  initialCode: string;
  expectedOutput: string;
  hints: string[];
};

export type VisualizationData = {
  type: 'array' | 'tree' | 'graph';
  data: any;
  steps: string[];
};

export type UserProgress = {
  totalPoints: number;
  level: number;
  completedModules: string[];
  achievements: string[];
};

export interface GameItem {
  id: string;
  title: string;
  description: string;
  image: string;
  routeName: keyof RootStackParamList;
}

export interface VideoItem {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  views: string;
} 
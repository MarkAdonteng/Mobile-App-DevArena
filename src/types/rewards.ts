export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number; // number of quizzes needed
}

export interface UserRewards {
  points: number;
  badges: Badge[];
  completedQuizzes: number;
} 
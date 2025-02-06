import { Badge } from '../types/rewards';

export const POINTS_PER_QUIZ = 10;

export const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'quiz_novice',
    name: 'Quiz Novice',
    description: 'Complete 5 quizzes',
    icon: 'school',
    requirement: 5
  },
  {
    id: 'quiz_apprentice',
    name: 'Quiz Apprentice',
    description: 'Complete 10 quizzes',
    icon: 'school',
    requirement: 10
  },
  {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Complete 20 quizzes',
    icon: 'workspace-premium',
    requirement: 20
  },
  {
    id: 'quiz_expert',
    name: 'Quiz Expert',
    description: 'Complete 30 quizzes',
    icon: 'stars',
    requirement: 30
  },
  {
    id: 'quiz_legend',
    name: 'Quiz Legend',
    description: 'Complete 50 quizzes',
    icon: 'military-tech',
    requirement: 50
  }
]; 
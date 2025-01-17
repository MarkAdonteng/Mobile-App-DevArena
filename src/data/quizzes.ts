import { Quiz, ProgrammingLanguage, DifficultyLevel } from '../types/quiz';

const generateQuizId = (language: string, difficulty: string) => 
  `${language.toLowerCase()}-${difficulty.toLowerCase()}`;

const createQuiz = (
  language: ProgrammingLanguage,
  difficulty: DifficultyLevel,
  questions: Quiz['questions'],
  topic: string
): Quiz => ({
  id: generateQuizId(language, difficulty),
  language,
  difficulty,
  topic,
  title: `${language} ${difficulty} Quiz`,
  description: `Test your ${language} knowledge at the ${difficulty} level`,
  questions,
  timeLimit: 30,
  points: difficulty === 'Beginner' ? 100 : difficulty === 'Intermediate' ? 200 : 300
});

// Sample Python Beginner Quiz
const pythonBeginnerQuestions = [
  {
    id: 'py-beg-1',
    question: 'What is the output of: print(2 + 2)',
    options: ['4', '22', 'Error', 'None'],
    correctAnswer: 0,
    explanation: 'The + operator performs arithmetic addition on numbers.'
  },
  {
    id: 'py-beg-2',
    question: 'Which of these is a valid variable name in Python?',
    options: ['2variable', '_variable', 'variable-name', 'variable name'],
    correctAnswer: 1,
    explanation: 'Variable names can start with an underscore but not with a number or contain spaces.'
  },
  // Add more questions...
];

// Sample JavaScript Intermediate Quiz
const jsIntermediateQuestions = [
  {
    id: 'js-int-1',
    question: 'What is the output of: console.log(typeof typeof 1)',
    code: 'console.log(typeof typeof 1);',
    options: ['number', 'string', 'undefined', 'object'],
    correctAnswer: 1,
    explanation: 'typeof 1 returns "number", and typeof "number" returns "string"'
  },
  {
    id: 'js-int-2',
    question: 'What is closure in JavaScript?',
    options: [
      'A way to secure variables',
      'A function with access to its outer scope',
      'A way to close browser windows',
      'A method to end loops'
    ],
    correctAnswer: 1,
    explanation: 'A closure is a function that has access to variables in its outer (enclosing) lexical scope.'
  },
  // Add more questions...
];

export const quizzes: Quiz[] = [
  createQuiz('Python', 'Beginner', pythonBeginnerQuestions, 'basics'),
  // Add more quizzes...
];

// Helper function to get quizzes by language and difficulty
export const getQuizzes = (language?: ProgrammingLanguage, difficulty?: DifficultyLevel) => {
  let filtered = quizzes;
  if (language) {
    filtered = filtered.filter(quiz => quiz.language === language);
  }
  if (difficulty) {
    filtered = filtered.filter(quiz => quiz.difficulty === difficulty);
  }
  return filtered;
}; 
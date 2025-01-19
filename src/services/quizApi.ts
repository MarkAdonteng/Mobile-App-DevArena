import { QuizQuestion, ProgrammingLanguage } from '../types/quiz';
import type { DifficultyLevel } from '../types/quiz';

type QuizQuestions = Record<ProgrammingLanguage, Record<string, Record<DifficultyLevel, QuizQuestion[]>>>;

const programmingQuizzes: QuizQuestions = {
  'Python': {
    'basics': {
      'Beginner': [
        {
          id: 'py-basics-1',
          question: 'What is the output of: print(2 + 2)',
          options: ['4', '22', 'Error', 'None'],
          correctAnswer: 0,
          explanation: 'The + operator performs arithmetic addition on numbers.'
        },
        {
          id: 'py-basics-2',
          question: 'Which of these is a valid variable name in Python?',
          options: ['2variable', '_variable', 'variable-name', 'variable name'],
          correctAnswer: 1,
          explanation: 'Variable names can start with an underscore but not with a number or contain spaces.'
        },
        // Add 8 more beginner questions
      ],
      'Intermediate': [
        {
          id: 'py-basics-int-1',
          question: 'What is list comprehension in Python?',
          options: [
            'A way to create lists using loops',
            'A method to sort lists',
            'A function to filter lists',
            'A class for list operations'
          ],
          correctAnswer: 0,
          explanation: 'List comprehension is a concise way to create lists using a single line of code.'
        },
        // Add 9 more intermediate questions
      ],
      'Advanced': [
        {
          id: 'py-basics-adv-1',
          question: 'What is a decorator in Python?',
          options: [
            'A design pattern',
            'A function that modifies another function',
            'A class method',
            'A type of variable'
          ],
          correctAnswer: 1,
          explanation: 'A decorator is a function that takes another function as input and extends its behavior.'
        },
        // Add 9 more advanced questions
      ]
    },
    // Add more Python topics with questions
  },
  'JavaScript': {
    'basics': {
      'Beginner': [
        {
          id: 'js-basics-1',
          question: 'What is the result of: typeof "42"',
          options: ['number', 'string', 'undefined', 'object'],
          correctAnswer: 1,
          explanation: 'The typeof operator returns "string" for string literals, even if they contain numbers.'
        },
        // Add 9 more beginner questions
      ],
      'Intermediate': [
        {
          id: 'js-basics-int-1',
          question: 'What is closure in JavaScript?',
          options: [
            'A way to end functions',
            'A function that has access to variables in its outer scope',
            'A method to close browser windows',
            'A type of loop'
          ],
          correctAnswer: 1,
          explanation: 'A closure is a function that maintains access to variables from its outer scope.'
        },
        // Add 9 more intermediate questions
      ],
      'Advanced': [
        // Add 10 advanced questions
      ]
    },
    // Add more JavaScript topics
  },
  'React': {
    'components': {
      'Beginner': [
        {
          id: 'react-comp-1',
          question: 'What is a React component?',
          options: [
            'A JavaScript function',
            'A reusable UI element',
            'A CSS class',
            'A HTML tag'
          ],
          correctAnswer: 1,
          explanation: 'A React component is a reusable piece of UI that can contain both logic and presentation.'
        },
        // Add 9 more beginner questions
      ],
      // Add intermediate and advanced questions
    },
    // Add more React topics
  },
  // Add questions for other languages...
};

export const fetchQuizQuestions = async (
  language: ProgrammingLanguage,
  topic: string,
  difficulty: DifficultyLevel,
): Promise<QuizQuestion[]> => {
  try {
    const questions = programmingQuizzes[language]?.[topic]?.[difficulty] || [];
    return questions;
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return [];
  }
}; 
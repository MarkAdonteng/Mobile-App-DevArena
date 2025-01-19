import { ProgrammingLanguage, Difficulty, Lesson } from '../types/quiz';
import { pythonLessons } from '../components/languages/PythonLessons';
import { javascriptLessons } from '../components/languages/JavaScriptLessons';
import { cppLessons } from '../components/languages/CppLessons';
import { reactLessons } from '../components/languages/ReactLessons';

export const languageInfo: Record<ProgrammingLanguage, {
  icon: string;
  color: string;
  description: string;
  lessons: Record<Difficulty, Lesson[]>;
}> = {
  Python: {
    icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg',
    color: '#3776AB',
    description: 'Learn Python - a versatile language known for its simplicity and readability.',
    lessons: pythonLessons,
  },
  JavaScript: {
    icon: 'https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_js.svg',
    color: '#F7DF1E',
    description: 'Master JavaScript - the language of the web and modern development.',
    lessons: javascriptLessons,
  },
  Java: {
    icon: 'https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_java.svg',
    color: '#007396',
    description: 'Explore Java - a powerful, object-oriented programming language.',
    lessons: {
      Beginner: [],
      Intermediate: [],
      Advanced: [],
    },
  },
  'C++': {
    icon: 'https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_cpp.svg',
    color: '#00599C',
    description: 'Learn C++ - a high-performance language for system programming.',
    lessons: cppLessons,
  },
  React: {
    icon: 'https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_reactjs.svg',
    color: '#61DAFB',
    description: 'Master React - a popular library for building user interfaces.',
    lessons: reactLessons,
  },
  TypeScript: {
    icon: 'https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_typescript.svg',
    color: '#3178C6',
    description: 'Learn TypeScript - a typed superset of JavaScript.',
    lessons: {
      Beginner: [],
      Intermediate: [],
      Advanced: [],
    },
  },
}; 
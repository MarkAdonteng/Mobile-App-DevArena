import { ProgrammingLanguage, Difficulty, Lesson } from '../types/quiz';
import { pythonLessons } from '../components/languages/PythonLessons';
import { javascriptLessons } from '../components/languages/JavaScriptLessons';
import { cppLessons } from '../components/languages/CppLessons';
import { reactLessons } from '../components/languages/ReactLessons';
import { angularLessons } from '../components/languages/AngularLessons';
import { laravelLessons } from '../components/languages/LaravelLessons';
import { djangoLessons } from '../components/languages/DjangoLessons';
import { javaLessons } from '../components/languages/JavaLessons';
import { phpLessons } from '../components/languages/PhpLessons';
import { typescriptLessons } from '../components/languages/TypescriptLessons';

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
    lessons: javaLessons,
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
    lessons: typescriptLessons,
  },
  PHP: {
    color: '#777BB3',
    icon: 'https://www.php.net/images/logos/php-logo.svg',
    description: 'Server-side scripting language designed for web development',
    lessons: phpLessons,
  },
  Angular: {
    color: '#DD0031',
    icon: 'https://angular.io/assets/images/logos/angular/angular.svg',
    description: 'Platform for building mobile and desktop web applications',

    lessons: angularLessons,
  },
  Laravel: {
    color: '#FF2D20',

    icon: 'https://laravel.com/img/logomark.min.svg',

    description: 'PHP web application framework with expressive, elegant syntax',

    lessons: laravelLessons,
  },

  Django: {
    color: '#092E20',

    icon: 'https://static.djangoproject.com/img/logos/django-logo-positive.svg',

    description: 'High-level Python web framework that encourages rapid development',

    lessons: djangoLessons,
  },
}; 
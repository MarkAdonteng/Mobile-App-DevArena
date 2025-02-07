import React from 'react';
import { Lesson, Difficulty } from '../../types/quiz';

export const typescriptLessons: Record<Difficulty, Lesson[]> = {
  Beginner: [
    {
      id: 'typescript_basics_1',
      title: 'Introduction to TypeScript',
      content: `TypeScript is a strongly typed programming language that builds on JavaScript.

Key Concepts:
• Basic types
• Type annotations
• Variables and constants
• Type inference`,
      codeExamples: [`
// Basic types and type annotations
let name: string = "John";
let age: number = 25;
let isStudent: boolean = true;
let numbers: number[] = [1, 2, 3, 4, 5];

// Type inference
let message = "Hello"; // TypeScript infers string type

// Union types
let id: string | number;
id = "abc123";
id = 123;

// Type aliases
type Point = {
    x: number;
    y: number;
};

let position: Point = { x: 10, y: 20 };`],
      difficulty: 'Beginner',
      order: 1,
    },
    {
      id: 'typescript_basics_2',
      title: 'Functions in TypeScript',
      content: `Understanding functions and their type annotations.

Key Concepts:
• Function parameters
• Return types
• Optional parameters
• Default parameters
• Function overloads`,
      codeExamples: [`
// Function with type annotations
function add(a: number, b: number): number {
    return a + b;
}

// Arrow functions
const multiply = (x: number, y: number): number => x * y;

// Optional parameters
function greet(name: string, greeting?: string): string {
    return greeting ? \`\${greeting}, \${name}!\` : \`Hello, \${name}!\`;
}

// Default parameters
function createUser(name: string, age: number = 18): void {
    console.log(\`Created user \${name} with age \${age}\`);
}

// Function overloads
function process(x: number): number;
function process(x: string): string;
function process(x: any): any {
    return x;
}`],
      difficulty: 'Beginner',
      order: 2,
    },
    {
      id: 'typescript_basics_3',
      title: 'Interfaces and Classes',
      content: `Object-oriented programming with TypeScript.

Key Concepts:
• Interfaces
• Classes
• Inheritance
• Access modifiers
• Implementing interfaces`,
      codeExamples: [`
// Interface definition
interface User {
    name: string;
    age: number;
    email?: string;
    greet(): void;
}

// Class implementing interface
class Student implements User {
    constructor(
        public name: string,
        public age: number,
        private studentId: string
    ) {}

    greet(): void {
        console.log(\`Hello, I'm \${this.name}\`);
    }

    getStudentId(): string {
        return this.studentId;
    }
}

// Inheritance
class GraduateStudent extends Student {
    constructor(
        name: string,
        age: number,
        studentId: string,
        public thesis: string
    ) {
        super(name, age, studentId);
    }
}`],
      difficulty: 'Beginner',
      order: 3,
    },
    {
      id: 'typescript_basics_4',
      title: 'Generics',
      content: `Working with generic types in TypeScript.

Key Concepts:
• Generic functions
• Generic interfaces
• Generic classes
• Generic constraints`,
      codeExamples: [`
// Generic function
function identity<T>(arg: T): T {
    return arg;
}

// Generic interface
interface Container<T> {
    value: T;
    getValue(): T;
}

// Generic class
class Box<T> {
    private content: T;

    constructor(value: T) {
        this.content = value;
    }

    getValue(): T {
        return this.content;
    }
}

// Generic constraints
interface Lengthwise {
    length: number;
}

function logLength<T extends Lengthwise>(arg: T): void {
    console.log(arg.length);
}`],
      difficulty: 'Beginner',
      order: 4,
    }
  ],
  Intermediate: [
    {
      id: 'typescript_inter_1',
      title: 'Advanced Types',
      content: `Understanding advanced type features in TypeScript.

Key Concepts:
• Union and intersection types
• Type guards
• Type assertions
• Mapped types
• Utility types`,
      codeExamples: [`
// Union and intersection types
type StringOrNumber = string | number;
type NumberAndString = { num: number } & { str: string };

// Type guards
function processValue(value: string | number) {
    if (typeof value === "string") {
        return value.toUpperCase();
    }
    return value.toFixed(2);
}

// Mapped types
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

// Utility types
interface Todo {
    title: string;
    description: string;
    completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;
type PartialTodo = Partial<Todo>;`],
      difficulty: 'Intermediate',
      order: 1,
    },
    {
      id: 'typescript_inter_2',
      title: 'Decorators',
      content: `Using decorators for metaprogramming.

Key Concepts:
• Class decorators
• Method decorators
• Property decorators
• Parameter decorators`,
      codeExamples: [`
// Class decorator
function logger<T extends { new (...args: any[]): {} }>(
    constructor: T
) {
    return class extends constructor {
        constructor(...args: any[]) {
            super(...args);
            console.log("Instance created");
        }
    };
}

// Method decorator
function log(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const original = descriptor.value;
    descriptor.value = function(...args: any[]) {
        console.log(\`Calling \${propertyKey}\`);
        return original.apply(this, args);
    };
}

@logger
class Example {
    @log
    greet() {
        console.log("Hello!");
    }
}`],
      difficulty: 'Intermediate',
      order: 2,
    }
  ],
  Advanced: [
    {
      id: 'typescript_adv_1',
      title: 'Advanced TypeScript Patterns',
      content: `Advanced TypeScript programming patterns and techniques.

Key Concepts:
• Conditional types
• Infer keyword
• Template literal types
• Type-level programming`,
      codeExamples: [`
// Conditional types
type TypeName<T> = T extends string
    ? "string"
    : T extends number
    ? "number"
    : T extends boolean
    ? "boolean"
    : "object";

// Template literal types
type EventName<T extends string> = \`on\${Capitalize<T>}\`;

// Type-level programming
type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object
        ? DeepReadonly<T[P]>
        : T[P];
};

// Advanced inference
type ReturnType<T extends (...args: any) => any> = 
    T extends (...args: any) => infer R ? R : any;

type Parameters<T extends (...args: any) => any> = 
    T extends (...args: infer P) => any ? P : never;`],
      difficulty: 'Advanced',
      order: 1,
    }
  ]
};

import React from 'react';
import { Lesson, Difficulty } from '../../types/quiz';

export const javascriptLessons: Record<Difficulty, Lesson[]> = {
  Beginner: [
    {
      id: 'js_basics_1',
      title: 'Introduction to JavaScript',
      content: `JavaScript is the language of the web, powering interactive websites and modern applications.

Key Concepts:
• JavaScript basics and syntax
• Variables and data types
• Console output
• Basic operators`,
      codeExamples: [`
// Variables and data types
let name = "Alice";     // String
const age = 25;        // Number
let isStudent = true;  // Boolean

// Console output
console.log("Hello, World!");
console.log(\`Name: \${name}, Age: \${age}\`);

// Basic operators
let x = 10 + 5;  // Addition
let y = 20 - 8;  // Subtraction
let z = x * y;   // Multiplication
`],
      difficulty: 'Beginner',
      order: 1,
    },
    {
      id: 'js_basics_2',
      title: 'Control Flow',
      content: `Learn how to control program flow using conditional statements and loops.

Key Concepts:
• If statements
• Switch statements
• For loops
• While loops
• Break and continue`,
      codeExamples: [`
// If statements
let age = 18;
if (age >= 18) {
  console.log("Adult");
} else {
  console.log("Minor");
}

// Switch statement
let day = "Monday";
switch (day) {
  case "Monday":
    console.log("Start of week");
    break;
  case "Friday":
    console.log("Weekend soon!");
    break;
  default:
    console.log("Regular day");
}

// Loops
for (let i = 0; i < 5; i++) {
  console.log(i);
}

let count = 0;
while (count < 3) {
  console.log(count);
  count++;
}`],
      difficulty: 'Beginner',
      order: 2,
    },
    {
      id: 'js_basics_3',
      title: 'Arrays and Array Methods',
      content: `Master working with arrays and their built-in methods.

Key Concepts:
• Array creation
• Array methods (push, pop, shift, unshift)
• Array iteration
• Map, filter, and reduce`,
      codeExamples: [`
// Array creation and basic methods
let fruits = ['apple', 'banana', 'orange'];
fruits.push('grape');     // Add to end
fruits.pop();            // Remove from end
fruits.unshift('kiwi');  // Add to start
fruits.shift();          // Remove from start

// Array iteration
fruits.forEach(fruit => console.log(fruit));

// Map, filter, reduce
let numbers = [1, 2, 3, 4, 5];
let doubled = numbers.map(n => n * 2);
let evens = numbers.filter(n => n % 2 === 0);
let sum = numbers.reduce((acc, curr) => acc + curr, 0);`],
      difficulty: 'Beginner',
      order: 3,
    },
    {
      id: 'js_basics_4',
      title: 'Objects and Properties',
      content: `Learn to work with objects, properties, and methods.

Key Concepts:
• Object creation
• Properties and methods
• Object methods
• This keyword`,
      codeExamples: [`
// Object creation
let person = {
  name: 'John',
  age: 30,
  greet: function() {
    return \`Hello, I'm \${this.name}\`;
  }
};

// Accessing properties
console.log(person.name);
console.log(person['age']);

// Adding/modifying properties
person.location = 'New York';
person.age = 31;

// Object methods
console.log(person.greet());`],
      difficulty: 'Beginner',
      order: 4,
    },
    {
      id: 'js_basics_5',
      title: 'Functions and Scope',
      content: `Understanding functions and variable scope.

Key Concepts:
• Function declaration vs expression
• Arrow functions
• Parameters and arguments
• Variable scope
• Closures`,
      codeExamples: [`
// Function declaration
function greet(name) {
  return \`Hello, \${name}!\`;
}

// Function expression
const add = function(a, b) {
  return a + b;
};

// Arrow function
const multiply = (a, b) => a * b;

// Closure example
function counter() {
  let count = 0;
  return function() {
    return ++count;
  };
}`],
      difficulty: 'Beginner',
      order: 5,
    }
  ],
  Intermediate: [
    {
      id: 'js_intermediate_1',
      title: 'ES6+ Features',
      content: `Learn modern JavaScript features introduced in ES6+.

Key Concepts:
• Let, const, and var
• Template literals
• Destructuring
• Default parameters
• Spread and rest operators`,
      codeExamples: [`
// Let and Const
let name = "Alice";
const age = 25;

// Template literals
console.log(\`Hello, \${name}\`);

// Destructuring
let person = { name: "John", age: 30 };
let { name, age } = person;`],
      difficulty: 'Intermediate',
      order: 6,
    },
    {
      id: 'js_intermediate_2',
      title: 'Asynchronous JavaScript',
      content: `Understand how to handle asynchronous operations.

Key Concepts:
• Callbacks
• Promises
• Async/Await`,
      codeExamples: [`
// Promise example
function fetchData() {
  return new Promise(resolve => {
    setTimeout(() => resolve("Data loaded"), 2000);
  });
}

fetchData().then(console.log);`],
      difficulty: 'Intermediate',
      order: 7,
    },
    {
      id: 'js_intermediate_3',
      title: 'JavaScript DOM Manipulation',
      content: `Learn how to interact with the Document Object Model (DOM).

Key Concepts:
• Selecting elements
• Modifying elements
• Event listeners
• Adding/removing classes`,
      codeExamples: [`
// Select an element
const heading = document.querySelector("h1");

// Modify text
heading.textContent = "New Title";

// Add event listener
heading.addEventListener("click", () => alert("Clicked!"));`],
      difficulty: 'Intermediate',
      order: 8,
    },
  ],
  Advanced: [
    {
      id: 'js_advanced_1',
      title: 'Object-Oriented JavaScript (OOP)',
      content: `Learn OOP concepts in JavaScript.

Key Concepts:
• Classes and constructors
• Prototypes
• Inheritance`,
      codeExamples: [`
// Class example
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return \`Hello, my name is \${this.name}\`;
  }
}

const john = new Person("John", 30);
console.log(john.greet());`],
      difficulty: 'Advanced',
      order: 11,
    },
    {
      id: 'js_advanced_2',
      title: 'Functional Programming in JavaScript',
      content: `Explore functional programming techniques.

Key Concepts:
• Higher-order functions
• Pure functions
• Currying`,
      codeExamples: [`
// Higher-order function
const multiply = (a) => (b) => a * b;
const double = multiply(2);
console.log(double(5)); // 10`],
      difficulty: 'Advanced',
      order: 12,
    }
  ]
};

import React from 'react';
import { Lesson, Difficulty } from '../../types/quiz';

export const pythonLessons: Record<Difficulty, Lesson[]> = {
  Beginner: [
    {
      id: 'py_basics_1',
      title: 'Introduction to Python',
      content: `Python is a high-level, interpreted programming language known for its simplicity and readability.

Key Concepts:
• Python syntax and basic structure
• Variables and data types
• Print statements and basic input/output

Let's start with a simple example:`,
      codeExamples: [`
# This is a comment
print("Hello, World!")  # Your first Python program

# Variables and data types
name = "Alice"          # String
age = 25               # Integer
height = 1.75          # Float
is_student = True      # Boolean

# Print with variables
print(f"Name: {name}")
print(f"Age: {age}")
`],
      difficulty: 'Beginner',
      order: 1,
    },
    {
      id: 'py_basics_2',
      title: 'Control Flow: If Statements',
      content: `Learn how to make decisions in your code using if statements.

Key Concepts:
• Conditional statements
• Comparison operators
• Logical operators
• Nested if statements`,
      codeExamples: [`
# Basic if statement
age = 18
if age >= 18:
    print("You are an adult")
else:
    print("You are a minor")

# Multiple conditions
score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"
`],
      difficulty: 'Beginner',
      order: 2,
    },
    {
      id: 'py_basics_3',
      title: 'Loops in Python',
      content: `Master loops to repeat actions in your code.

Key Concepts:
• For loops
• While loops
• Loop control statements
• Range function`,
      codeExamples: [`
# For loop with range
for i in range(5):
    print(i)  # Prints 0 to 4

# While loop
count = 0
while count < 5:
    print(count)
    count += 1

# Loop through a list
fruits = ["apple", "banana", "orange"]
for fruit in fruits:
    print(fruit)
`],
      difficulty: 'Beginner',
      order: 3,
    },
    {
      id: 'py_basics_4',
      title: 'Lists and Tuples',
      content: `Work with collections of data using lists and tuples.

Key Concepts:
• List creation and manipulation
• List methods
• Tuples vs Lists
• Indexing and slicing`,
      codeExamples: [`
# Lists
numbers = [1, 2, 3, 4, 5]
numbers.append(6)      # Add element
numbers.pop()         # Remove last element
numbers[0] = 10       # Modify element

# Tuples (immutable)
coordinates = (10, 20)
x, y = coordinates    # Tuple unpacking
`],
      difficulty: 'Beginner',
      order: 4,
    },
    {
      id: 'py_basics_5',
      title: 'Dictionaries',
      content: `Learn to work with key-value pairs using dictionaries.

Key Concepts:
• Dictionary creation
• Adding and removing items
• Accessing values
• Dictionary methods`,
      codeExamples: [`
# Create a dictionary
person = {
    "name": "John",
    "age": 30,
    "city": "New York"
}

# Access and modify
print(person["name"])
person["age"] = 31

# Dictionary methods
keys = person.keys()
values = person.values()
`],
      difficulty: 'Beginner',
      order: 5,
    },
  ],
  Intermediate: [
    {
      id: 'py_inter_1',
      title: 'Functions and Parameters',
      content: `Master function creation and parameter handling.

Key Concepts:
• Function definition
• Parameters and arguments
• Return values
• Default parameters`,
      codeExamples: [`
# Basic function
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

# Multiple parameters
def calculate_total(items, tax_rate=0.1):
    subtotal = sum(items)
    tax = subtotal * tax_rate
    return subtotal + tax
`],
      difficulty: 'Intermediate',
      order: 1,
    },
    {
      id: 'py_inter_2',
      title: 'Object-Oriented Programming',
      content: `Learn the basics of OOP in Python.

Key Concepts:
• Classes and objects
• Inheritance
• Methods and attributes
• Constructor (__init__)`,
      codeExamples: [`
class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        pass

class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"
`],
      difficulty: 'Intermediate',
      order: 2,
    },
    {
      id: 'py_inter_3',
      title: 'Error Handling',
      content: `Handle exceptions and errors in Python.

Key Concepts:
• Try-except blocks
• Multiple except blocks
• Finally clause
• Raising exceptions`,
      codeExamples: [`
try:
    number = int(input("Enter a number: "))
    result = 10 / number
except ValueError:
    print("Please enter a valid number")
except ZeroDivisionError:
    print("Cannot divide by zero")
finally:
    print("Execution completed")
`],
      difficulty: 'Intermediate',
      order: 3,
    },
    {
      id: 'py_inter_4',
      title: 'File Handling',
      content: `Work with files in Python.

Key Concepts:
• Reading files
• Writing files
• Context managers (with)
• File modes`,
      codeExamples: [`
# Reading a file
with open('data.txt', 'r') as file:
    content = file.read()

# Writing to a file
with open('output.txt', 'w') as file:
    file.write("Hello, World!")

# Appending to a file
with open('log.txt', 'a') as file:
    file.write("New log entry\\n")
`],
      difficulty: 'Intermediate',
      order: 4,
    },
    {
      id: 'py_inter_5',
      title: 'List Comprehensions',
      content: `Master list comprehensions for cleaner code.

Key Concepts:
• Basic list comprehension
• Conditional list comprehension
• Nested list comprehension
• Dictionary comprehension`,
      codeExamples: [`
# Basic list comprehension
squares = [x**2 for x in range(10)]

# With condition
even_squares = [x**2 for x in range(10) if x % 2 == 0]

# Dictionary comprehension
square_dict = {x: x**2 for x in range(5)}
`],
      difficulty: 'Intermediate',
      order: 5,
    },
  ],
  Advanced: [
    {
      id: 'py_adv_1',
      title: 'Decorators',
      content: `Learn about Python decorators and their applications.

Key Concepts:
• Function decorators
• Class decorators
• Decorator chaining
• Decorators with arguments`,
      codeExamples: [`
def timer(func):
    def wrapper(*args, **kwargs):
        import time
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"Function took {end-start} seconds")
        return result
    return wrapper

@timer
def slow_function():
    import time
    time.sleep(1)
`],
      difficulty: 'Advanced',
      order: 1,
    },
    {
      id: 'py_adv_2',
      title: 'Generators and Iterators',
      content: `Master generators and iterators for efficient memory usage.

Key Concepts:
• Generator functions
• Generator expressions
• Iterator protocol
• yield keyword`,
      codeExamples: [`
# Generator function
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

# Generator expression
squares = (x**2 for x in range(1000000))
`],
      difficulty: 'Advanced',
      order: 2,
    },
    {
      id: 'py_adv_3',
      title: 'Multithreading and Multiprocessing',
      content: `Learn concurrent programming in Python.

Key Concepts:
• Threading module
• Multiprocessing module
• Thread synchronization
• Process pools`,
      codeExamples: [`
import threading
import multiprocessing

def worker():
    print(f"Worker thread/process running")

# Threading
thread = threading.Thread(target=worker)
thread.start()

# Multiprocessing
process = multiprocessing.Process(target=worker)
process.start()
`],
      difficulty: 'Advanced',
      order: 3,
    },
    {
      id: 'py_adv_4',
      title: 'Context Managers',
      content: `Create and use context managers.

Key Concepts:
• Context manager protocol
• __enter__ and __exit__
• contextlib module
• Nested context managers`,
      codeExamples: [`
class MyContext:
    def __enter__(self):
        print("Entering context")
        return self
    
    def __exit__(self, exc_type, exc_value, traceback):
        print("Exiting context")
        return False

with MyContext():
    print("Inside context")
`],
      difficulty: 'Advanced',
      order: 4,
    },
    {
      id: 'py_adv_5',
      title: 'Metaclasses',
      content: `Understand and use metaclasses in Python.

Key Concepts:
• Metaclass basics
• Class creation control
• Abstract base classes
• Custom metaclasses`,
      codeExamples: [`
class MyMetaclass(type):
    def __new__(cls, name, bases, attrs):
        # Add methods or attributes to class
        attrs['new_method'] = lambda self: print("Hello")
        return super().__new__(cls, name, bases, attrs)

class MyClass(metaclass=MyMetaclass):
    pass
`],
      difficulty: 'Advanced',
      order: 5,
    },
  ],
}; 
import React from 'react';
import { Lesson, Difficulty } from '../../types/quiz';

export const javaLessons: Record<Difficulty, Lesson[]> = {
  Beginner: [
    {
      id: 'java_basics_1',
      title: 'Introduction to Java',
      content: `Java is a class-based, object-oriented programming language designed to be platform-independent.

Key Concepts:
• Basic syntax
• Variables and data types
• Operators
• Control flow statements`,
      codeExamples: [`
// Basic Java program
public class HelloWorld {
    public static void main(String[] args) {
        // Variables and data types
        String name = "John";
        int age = 25;
        double height = 1.75;
        boolean isStudent = true;

        // Output
        System.out.println("Hello, " + name + "!");

        // Control structures
        if (age >= 18) {
            System.out.println("Adult");
        } else {
            System.out.println("Minor");
        }

        // For loop
        for (int i = 0; i < 5; i++) {
            System.out.print(i + " ");
        }
    }
}`],
      difficulty: 'Beginner',
      order: 1,
    },
    {
      id: 'java_basics_2',
      title: 'Arrays and Methods',
      content: `Working with arrays and methods in Java.

Key Concepts:
• Array declaration and initialization
• Array manipulation
• Method declaration
• Method overloading`,
      codeExamples: [`
public class ArraysAndMethods {
    // Method with parameters
    public static int add(int a, int b) {
        return a + b;
    }

    // Method overloading
    public static double add(double a, double b) {
        return a + b;
    }

    public static void main(String[] args) {
        // Array declaration and initialization
        int[] numbers = {1, 2, 3, 4, 5};
        String[] fruits = new String[3];
        fruits[0] = "Apple";
        fruits[1] = "Banana";
        fruits[2] = "Orange";

        // Array iteration
        for (String fruit : fruits) {
            System.out.println(fruit);
        }

        // Using methods
        System.out.println(add(5, 3));      // Calls int version
        System.out.println(add(3.2, 2.1));  // Calls double version
    }
}`],
      difficulty: 'Beginner',
      order: 2,
    },
    {
      id: 'java_basics_3',
      title: 'Object-Oriented Programming',
      content: `Understanding OOP concepts in Java.

Key Concepts:
• Classes and objects
• Constructors
• Inheritance
• Encapsulation`,
      codeExamples: [`
// Base class
public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

// Derived class
public class Student extends Person {
    private String studentId;

    public Student(String name, int age, String studentId) {
        super(name, age);
        this.studentId = studentId;
    }

    public void study() {
        System.out.println(getName() + " is studying");
    }
}`],
      difficulty: 'Beginner',
      order: 3,
    },
    {
      id: 'java_basics_4',
      title: 'Exception Handling',
      content: `Working with exceptions in Java.

Key Concepts:
• Try-catch blocks
• Multiple catch blocks
• Finally clause
• Custom exceptions`,
      codeExamples: [`
public class ExceptionExample {
    public static void divide(int a, int b) throws ArithmeticException {
        if (b == 0) {
            throw new ArithmeticException("Division by zero!");
        }
        System.out.println(a / b);
    }

    public static void main(String[] args) {
        try {
            divide(10, 0);
        } catch (ArithmeticException e) {
            System.out.println("Error: " + e.getMessage());
        } finally {
            System.out.println("This always executes");
        }

        // Custom exception
        class InvalidAgeException extends Exception {
            public InvalidAgeException(String message) {
                super(message);
            }
        }
    }
}`],
      difficulty: 'Beginner',
      order: 4,
    }
  ],
  Intermediate: [
    {
      id: 'java_inter_1',
      title: 'Collections Framework',
      content: `Understanding Java Collections Framework.

Key Concepts:
• Lists, Sets, and Maps
• Iterators
• Generics
• Collection operations`,
      codeExamples: [`
import java.util.*;

public class CollectionsExample {
    public static void main(String[] args) {
        // ArrayList
        List<String> list = new ArrayList<>();
        list.add("Apple");
        list.add("Banana");
        list.add("Orange");

        // HashSet
        Set<Integer> set = new HashSet<>();
        set.add(1);
        set.add(2);
        set.add(1); // Duplicate not added

        // HashMap
        Map<String, Integer> map = new HashMap<>();
        map.put("John", 25);
        map.put("Jane", 30);

        // Using streams
        list.stream()
            .filter(s -> s.startsWith("A"))
            .forEach(System.out::println);
    }
}`],
      difficulty: 'Intermediate',
      order: 1,
    },
    {
      id: 'java_inter_2',
      title: 'Multithreading',
      content: `Working with threads in Java.

Key Concepts:
• Thread creation
• Synchronization
• Thread states
• Thread communication`,
      codeExamples: [`
public class ThreadExample {
    public static void main(String[] args) {
        // Creating thread using Runnable
        Runnable task = () -> {
            for (int i = 0; i < 5; i++) {
                System.out.println("Thread: " + i);
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        };

        Thread thread = new Thread(task);
        thread.start();

        // Synchronization example
        class Counter {
            private int count = 0;
            
            public synchronized void increment() {
                count++;
            }
        }
    }
}`],
      difficulty: 'Intermediate',
      order: 2,
    }
  ],
  Advanced: [
    {
      id: 'java_adv_1',
      title: 'Advanced Java Features',
      content: `Advanced programming concepts in Java.

Key Concepts:
• Lambda expressions
• Stream API
• Optional class
• Functional interfaces`,
      codeExamples: [`
import java.util.stream.Stream;
import java.util.Optional;
import java.util.function.Function;

public class AdvancedFeatures {
    public static void main(String[] args) {
        // Lambda expressions
        Function<String, Integer> length = str -> str.length();

        // Stream API
        Stream.of("Apple", "Banana", "Orange")
            .map(String::toUpperCase)
            .filter(s -> s.startsWith("A"))
            .forEach(System.out::println);

        // Optional
        Optional<String> optional = Optional.of("Hello");
        optional.ifPresent(System.out::println);

        // Method reference
        List<String> names = Arrays.asList("John", "Jane");
        names.forEach(System.out::println);
    }
}`],
      difficulty: 'Advanced',
      order: 1,
    }
  ]
};

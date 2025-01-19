import React from 'react';
import { Lesson, Difficulty } from '../../types/quiz';

export const cppLessons: Record<Difficulty, Lesson[]> = {
  Beginner: [
    {
      id: 'cpp_basics_1',
      title: 'Introduction to C++',
      content: `C++ is a powerful general-purpose programming language that extends C with object-oriented features.

Key Concepts:
• Basic syntax and structure
• Variables and data types
• Input/Output operations
• Basic operators`,
      codeExamples: [`
#include <iostream>
using namespace std;

int main() {
    // Basic output
    cout << "Hello, World!" << endl;

    // Variables and data types
    int age = 25;
    double height = 1.75;
    string name = "Alice";

    // Basic input
    cout << "Enter your age: ";
    cin >> age;

    return 0;
}`],
      difficulty: 'Beginner',
      order: 1,
    },
    {
      id: 'cpp_basics_2',
      title: 'Control Flow',
      content: `Learn about control structures in C++.

Key Concepts:
• If statements
• Switch cases
• Loops (for, while)
• Break and continue`,
      codeExamples: [`
#include <iostream>
using namespace std;

int main() {
    // If statement
    int age = 18;
    if (age >= 18) {
        cout << "Adult" << endl;
    } else {
        cout << "Minor" << endl;
    }

    // For loop
    for (int i = 0; i < 5; i++) {
        cout << i << " ";
    }

    // While loop
    int count = 0;
    while (count < 3) {
        cout << count << endl;
        count++;
    }

    return 0;
}`],
      difficulty: 'Beginner',
      order: 2,
    },
    {
      id: 'cpp_basics_3',
      title: 'Functions',
      content: `Understanding functions in C++.

Key Concepts:
• Function declaration
• Parameters and return types
• Function overloading
• Default arguments`,
      codeExamples: [`
#include <iostream>
using namespace std;

// Function declaration
int add(int a, int b) {
    return a + b;
}

// Function overloading
double add(double a, double b) {
    return a + b;
}

// Default arguments
void greet(string name = "User") {
    cout << "Hello, " << name << endl;
}

int main() {
    cout << add(5, 3) << endl;      // Calls int version
    cout << add(3.2, 2.1) << endl;  // Calls double version
    greet();                        // Uses default argument
    return 0;
}`],
      difficulty: 'Beginner',
      order: 3,
    },
    {
      id: 'cpp_basics_4',
      title: 'Arrays and Strings',
      content: `Working with arrays and strings in C++.

Key Concepts:
• Array declaration and initialization
• Array operations
• String manipulation
• C-style vs C++ strings`,
      codeExamples: [`
#include <iostream>
#include <string>
using namespace std;

int main() {
    // Arrays
    int numbers[5] = {1, 2, 3, 4, 5};
    
    // Array iteration
    for (int i = 0; i < 5; i++) {
        cout << numbers[i] << " ";
    }

    // Strings
    string name = "Alice";
    cout << "Length: " << name.length() << endl;
    cout << "Substring: " << name.substr(0, 2) << endl;

    return 0;
}`],
      difficulty: 'Beginner',
      order: 4,
    },
    {
      id: 'cpp_basics_5',
      title: 'Pointers and References',
      content: `Understanding memory management in C++.

Key Concepts:
• Pointers basics
• References
• Memory allocation
• Address operator`,
      codeExamples: [`
#include <iostream>
using namespace std;

int main() {
    // Pointers
    int x = 10;
    int* ptr = &x;
    cout << "Value: " << *ptr << endl;
    cout << "Address: " << ptr << endl;

    // References
    int& ref = x;
    ref = 20; // Changes x
    cout << "x is now: " << x << endl;

    // Dynamic allocation
    int* arr = new int[3];
    delete[] arr; // Free memory

    return 0;
}`],
      difficulty: 'Beginner',
      order: 5,
    }
  ],
  Intermediate: [
    {
      id: 'cpp_inter_1',
      title: 'Classes and Objects',
      content: `Object-oriented programming in C++.

Key Concepts:
• Class definition
• Objects and instances
• Constructors and destructors
• Access specifiers`,
      codeExamples: [`
class Person {
private:
    string name;
    int age;

public:
    // Constructor
    Person(string n, int a) : name(n), age(a) {}

    // Member functions
    void introduce() {
        cout << "I'm " << name << ", " << age << " years old." << endl;
    }
};

int main() {
    Person person("Alice", 25);
    person.introduce();
    return 0;
}`],
      difficulty: 'Intermediate',
      order: 1,
    },
    {
      id: 'cpp_inter_2',
      title: 'Inheritance and Polymorphism',
      content: `Understanding inheritance and polymorphism in C++.

Key Concepts:
• Base and derived classes
• Virtual functions
• Method overriding
• Abstract classes`,
      codeExamples: [`
class Animal {
public:
    virtual void makeSound() {
        cout << "Some sound" << endl;
    }
    virtual ~Animal() {}
};

class Dog : public Animal {
public:
    void makeSound() override {
        cout << "Woof!" << endl;
    }
};

class Cat : public Animal {
public:
    void makeSound() override {
        cout << "Meow!" << endl;
    }
};

int main() {
    Animal* animals[] = { new Dog(), new Cat() };
    for (auto animal : animals) {
        animal->makeSound();  // Polymorphic behavior
    }
    return 0;
}`],
      difficulty: 'Intermediate',
      order: 2,
    },
    {
      id: 'cpp_inter_3',
      title: 'Exception Handling',
      content: `Learn to handle errors and exceptions in C++.

Key Concepts:
• Try-catch blocks
• Throwing exceptions
• Custom exceptions
• Exception safety`,
      codeExamples: [`
#include <stdexcept>

class DivisionByZero : public std::exception {
public:
    const char* what() const noexcept override {
        return "Division by zero!";
    }
};

double divide(double a, double b) {
    if (b == 0) {
        throw DivisionByZero();
    }
    return a / b;
}

int main() {
    try {
        cout << divide(10, 0) << endl;
    } catch (const DivisionByZero& e) {
        cout << "Error: " << e.what() << endl;
    }
    return 0;
}`],
      difficulty: 'Intermediate',
      order: 3,
    },
    {
      id: 'cpp_inter_4',
      title: 'Operator Overloading',
      content: `Customize operator behavior for user-defined types.

Key Concepts:
• Operator functions
• Friend functions
• Assignment operators
• Stream operators`,
      codeExamples: [`
class Complex {
private:
    double real, imag;
public:
    Complex(double r = 0, double i = 0) : real(r), imag(i) {}
    
    Complex operator+(const Complex& other) {
        return Complex(real + other.real, imag + other.imag);
    }
    
    friend ostream& operator<<(ostream& os, const Complex& c) {
        os << c.real << " + " << c.imag << "i";
        return os;
    }
};

int main() {
    Complex a(1, 2), b(3, 4);
    Complex c = a + b;
    cout << c << endl;
    return 0;
}`],
      difficulty: 'Intermediate',
      order: 4,
    },
    {
      id: 'cpp_inter_5',
      title: 'Smart Pointers',
      content: `Modern C++ memory management with smart pointers.

Key Concepts:
• unique_ptr
• shared_ptr
• weak_ptr
• Memory leaks prevention`,
      codeExamples: [`
#include <memory>

class Resource {
public:
    Resource() { cout << "Resource acquired" << endl; }
    ~Resource() { cout << "Resource released" << endl; }
    void use() { cout << "Resource in use" << endl; }
};

int main() {
    // Unique pointer
    unique_ptr<Resource> res1(new Resource());
    res1->use();

    // Shared pointer
    shared_ptr<Resource> res2 = make_shared<Resource>();
    shared_ptr<Resource> res3 = res2;  // Reference count = 2
    
    return 0;  // Automatic cleanup
}`],
      difficulty: 'Intermediate',
      order: 5,
    }
  ],
  Advanced: [
    {
      id: 'cpp_adv_1',
      title: 'Templates and STL',
      content: `Advanced C++ features and the Standard Template Library.

Key Concepts:
• Template functions
• Template classes
• STL containers
• Iterators`,
      codeExamples: [`
#include <vector>
#include <algorithm>

// Template function
template<typename T>
T max(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    vector<int> numbers = {1, 2, 3, 4, 5};
    
    // Using STL algorithms
    sort(numbers.begin(), numbers.end());
    
    // Using template function
    cout << max(10, 20) << endl;
    cout << max(3.14, 2.72) << endl;
    
    return 0;
}`],
      difficulty: 'Advanced',
      order: 1,
    },
    // Add more advanced lessons...
  ],
}; 
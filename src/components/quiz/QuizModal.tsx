import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Button,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CodeEditor from '../common/CodeEditor';
import { useUser } from '../../context/UserContext';

type QuizQuestion = {
  id: string;
  question: string;
  code?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  lessonId: string;
  onComplete: (score: number) => void;
};

const PASSING_SCORE = 80; // 80% passing threshold

const quizzes: Record<string, QuizQuestion[]> = {
  'py_basics_1': [
    {
      id: 'q1',
      question: 'What will be the output of this code?',
      code: 'print(2 + 3)',
      options: ['5', '23', 'Error', 'None'],
      correctAnswer: 0,
      explanation: 'The + operator performs arithmetic addition on numbers.',
    },
    {
      id: 'q2',
      question: 'Which of these is a valid variable name in Python?',
      options: ['2variable', '_variable', 'variable-name', 'variable name'],
      correctAnswer: 1,
      explanation: 'Variable names can start with an underscore but not with a number or contain spaces.',
    },
    {
      id: 'q3',
      question: 'What is the correct way to create a comment in Python?',
      options: [
        '// This is a comment',
        '/* This is a comment */',
        '# This is a comment',
        '-- This is a comment'
      ],
      correctAnswer: 2,
      explanation: 'In Python, single-line comments start with the # symbol.',
    },
  ],
  'py_basics_2': [
    {
      id: 'q1',
      question: 'What will this code print?',
      code: `
age = 15
if age >= 18:
    print("Adult")
else:
    print("Minor")
`,
      options: ['Adult', 'Minor', 'Error', 'Nothing'],
      correctAnswer: 1,
      explanation: 'Since age (15) is less than 18, the code will print "Minor".',
    },
    {
      id: 'q2',
      question: 'Which operator is used for equality comparison in Python?',
      options: ['=', '==', '===', '!='],
      correctAnswer: 1,
      explanation: 'The == operator is used to compare values for equality.',
    },
    {
      id: 'q3',
      question: 'What is the output of this code?',
      code: `
x = 5
y = 10
print(x > y)
`,
      options: ['True', 'False', 'Error', '5'],
      correctAnswer: 1,
      explanation: '5 is not greater than 10, so the comparison returns False.',
    },
  ],

  'py_basics_3': [
    {
      "id": "q1",
      "question": "What will this code print?",
      "code": `
for i in range(3):
    print(i)
`,
      "options": ["0 1 2", "1 2 3", "0 1 2 3", "Error"],
      "correctAnswer": 0,
      "explanation": "The range(3) generates values 0, 1, and 2, which are printed in sequence."
    },
    {
      "id": "q2",
      "question": "Which loop is used when the number of iterations is unknown beforehand?",
      "options": ["for loop", "while loop", "do-while loop", "foreach loop"],
      "correctAnswer": 1,
      "explanation": "A while loop is used when the number of iterations is not known in advance."
    },
    {
      "id": "q3",
      "question": "What will this code output?",
      "code": `
x = 0
while x < 3:
    print(x)
    x += 1
`,
      "options": ["0 1 2", "0 1 2 3", "Error", "Infinite loop"],
      "correctAnswer": 0,
      "explanation": "The while loop runs until x is no longer less than 3, printing 0, 1, and 2."
    }
],
'py_basics_4': [
    {
      "id": "q1",
      "question": "Which of the following methods is used to add an element to a list?",
      "options": ["add()", "insert()", "append()", "push()"],
      "correctAnswer": 2,
      "explanation": "The append() method adds an element to the end of a list."
    },
    {
      "id": "q2",
      "question": "What will this code output?",
      "code": `
my_list = [1, 2, 3]
my_list.insert(1, 5)
print(my_list)
`,
      "options": ["[1, 2, 3, 5]", "[5, 1, 2, 3]", "[1, 5, 2, 3]", "Error"],
      "correctAnswer": 2,
      "explanation": "The insert() method adds 5 at index 1, shifting the elements right."
    },
    {
      "id": "q3",
      "question": "What will this tuple code output?",
      "code": `
my_tuple = (1, 2, 3)
my_tuple[0] = 4
print(my_tuple)
`,
      "options": ["(4, 2, 3)", "Error", "(1, 2, 3)", "None"],
      "correctAnswer": 1,
      "explanation": "Tuples are immutable, so trying to modify an element raises a TypeError."
    }
],
'py_basics_5': [
    {
      "id": "q1",
      "question": "What will this dictionary code output?",
      "code": `
my_dict = {"a": 1, "b": 2}
print(my_dict.get("c", "Not Found"))
`,
      "options": ["1", "2", "Not Found", "Error"],
      "correctAnswer": 2,
      "explanation": "Since 'c' is not in the dictionary, the get() method returns the default value 'Not Found'."
    },
    {
      "id": "q2",
      "question": "Which method is used to remove a key-value pair from a dictionary?",
      "options": ["remove()", "delete()", "pop()", "discard()"],
      "correctAnswer": 2,
      "explanation": "The pop() method removes the specified key and returns its value."
    },
    {
      "id": "q3",
      "question": "What will this code output?",
      "code": `
my_dict = {"x": 10, "y": 20}
my_dict["z"] = 30
print(my_dict)
`,
      "options": [
        "{'x': 10, 'y': 20, 'z': 30}",
        "{'x': 10, 'y': 20}",
        "Error",
        "None"
      ],
      "correctAnswer": 0,
      "explanation": "Adding a new key-value pair to a dictionary dynamically updates it."
    }
],

'py_inter_1': [
    {
      "id": "q1",
      "question": "What will this code output?",
      "code": `
def greet(name):
    return "Hello, " + name

print(greet("Mark"))
`,
      "options": ["Hello, Mark", "Hello, ", "Mark", "Error"],
      "correctAnswer": 0,
      "explanation": "The function takes a name as an argument and returns 'Hello, Mark'."
    },
    {
      "id": "q2",
      "question": "Which keyword is used to define a function in Python?",
      "options": ["func", "define", "def", "function"],
      "correctAnswer": 2,
      "explanation": "Python uses the 'def' keyword to define functions."
    },
    {
      "id": "q3",
      "question": "What will this code print?",
      "code": `
def add(a, b=5):
    return a + b

print(add(3))
`,
      "options": ["3", "8", "5", "Error"],
      "correctAnswer": 1,
      "explanation": "Since 'b' has a default value of 5, calling add(3) results in 3 + 5 = 8."
    }
],

'py_inter_2': [
    {
      "id": "q1",
      "question": "What will this code output?",
      "code": `
class Person:
    def __init__(self, name):
        self.name = name

p = Person("Alice")
print(p.name)
`,
      "options": ["Alice", "name", "None", "Error"],
      "correctAnswer": 0,
      "explanation": "The constructor (__init__) initializes 'name', and p.name returns 'Alice'."
    },
    {
      "id": "q2",
      "question": "Which keyword is used to define a class in Python?",
      "options": ["class", "struct", "object", "define"],
      "correctAnswer": 0,
      "explanation": "Python uses the 'class' keyword to define a class."
    },
    {
      "id": "q3",
      "question": "What is inheritance in Python?",
      "options": [
        "When a class takes methods and attributes from another class",
        "A function that returns multiple values",
        "A special type of loop",
        "None of the above"
      ],
      "correctAnswer": 0,
      "explanation": "Inheritance allows a class to inherit attributes and methods from another class."
    }
],

'py_inter_3': [
    {
      "id": "q1",
      "question": "What will this code output?",
      "code": `
try:
    x = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero")
`,
      "options": ["10", "0", "Cannot divide by zero", "Error"],
      "correctAnswer": 2,
      "explanation": "Dividing by zero raises a ZeroDivisionError, which is caught in the except block."
    },
    {
      "id": "q2",
      "question": "Which keyword is used to handle exceptions in Python?",
      "options": ["catch", "error", "except", "handle"],
      "correctAnswer": 2,
      "explanation": "The 'except' keyword is used to catch exceptions in Python."
    },
    {
      "id": "q3",
      "question": "What will this code output?",
      "code": `
try:
    print(5 + "10")
except TypeError:
    print("Invalid operation")
`,
      "options": ["510", "Invalid operation", "None", "Error"],
      "correctAnswer": 1,
      "explanation": "Adding an integer and a string raises a TypeError, which is caught in the except block."
    }
],

'py_inter_4': [
    {
      "id": "q1",
      "question": "What will this code do?",
      "code": `
file = open("test.txt", "w")
file.write("Hello, World!")
file.close()
`,
      "options": ["Write 'Hello, World!' to test.txt", "Print 'Hello, World!'", "Raise an error", "Do nothing"],
      "correctAnswer": 0,
      "explanation": "The 'w' mode opens the file for writing and writes 'Hello, World!' to it."
    },
    {
      "id": "q2",
      "question": "Which mode opens a file for reading?",
      "options": ["w", "r", "a", "x"],
      "correctAnswer": 1,
      "explanation": "The 'r' mode is used to open a file for reading."
    },
    {
      "id": "q3",
      "question": "What will this code output?",
      "code": `
file = open("test.txt", "r")
print(file.read())
file.close()
`,
      "options": [
        "Contents of test.txt",
        "test.txt",
        "Error",
        "None"
      ],
      "correctAnswer": 0,
      "explanation": "The read() method reads and prints the entire contents of test.txt."
    }
],

'py_inter_5': [
    {
      "id": "q1",
      "question": "What will this code output?",
      "code": `
nums = [x for x in range(5)]
print(nums)
`,
      "options": ["[0, 1, 2, 3, 4]", "[1, 2, 3, 4, 5]", "[0, 1, 2, 3, 4, 5]", "Error"],
      "correctAnswer": 0,
      "explanation": "List comprehensions generate lists in a compact way. This creates a list from 0 to 4."
    },
    {
      "id": "q2",
      "question": "Which of the following is a correct list comprehension?",
      "options": [
        "[x for x in range(10) if x % 2 == 0]",
        "[x in range(10) for x if x % 2 == 0]",
        "[x for range(10) in x if x % 2 == 0]",
        "None of the above"
      ],
      "correctAnswer": 0,
      "explanation": "List comprehensions use the syntax [expression for item in iterable if condition]."
    },
    {
      "id": "q3",
      "question": "What will this code output?",
      "code": `
squared = [x**2 for x in range(4)]
print(squared)
`,
      "options": ["[1, 4, 9, 16]", "[0, 1, 4, 9]", "[0, 1, 4]", "Error"],
      "correctAnswer": 1,
      "explanation": "Each number in range(4) is squared, resulting in [0, 1, 4, 9]."
    }
],


  'js_basics_1': [
    {
      id: 'q1',
      question: 'What will be the output of: console.log(typeof "42")?',
      options: ['number', 'string', 'undefined', 'object'],
      correctAnswer: 1,
      explanation: 'The typeof operator returns "string" for string literals, even if they contain numbers.',
    },
    {
      id: 'q2',
      question: 'Which is the correct way to declare a constant in JavaScript?',
      options: ['let x = 1;', 'const x = 1;', 'var x = 1;', 'constant x = 1;'],
      correctAnswer: 1,
      explanation: 'const is used to declare constants in JavaScript. The value cannot be reassigned.',
    },
    {
      id: 'q3',
      question: 'What is the output of this code?',
      code: `
let x = 5;
let y = "10";
console.log(x + y);`,
      options: ['15', '510', 'Error', 'undefined'],
      correctAnswer: 1,
      explanation: 'When adding a number and string, JavaScript converts the number to a string and performs concatenation.',
    },
  ],
  'js_basics_2': [
    {
      id: 'q1',
      question: 'What will this code output?',
      code: `
let x = 10;
if (x > 5) {
  console.log("A");
} else if (x > 8) {
  console.log("B");
} else {
  console.log("C");
}`,
      options: ['A', 'B', 'C', 'Both A and B'],
      correctAnswer: 0,
      explanation: 'Once the first condition (x > 5) is true, the code block executes and the rest is skipped.',
    },
    {
      id: 'q2',
      question: 'How many times will this loop run?',
      code: `
for (let i = 0; i < 5; i += 2) {
  console.log(i);
}`,
      options: ['2 times', '3 times', '4 times', '5 times'],
      correctAnswer: 2,
      explanation: 'The loop will run for i = 0, 2, 4 (three times) before i becomes >= 5.',
    },
    {
      id: 'q3',
      question: 'What is the purpose of the break statement in a loop?',
      options: [
        'Skip the current iteration',
        'Exit the loop completely',
        'Continue to the next loop',
        'Pause the loop execution'
      ],
      correctAnswer: 1,
      explanation: 'The break statement is used to exit a loop completely, stopping any further iterations.',
    },
  ],

  'js_basics_3': [
    {
      "id": "q1",
      "question": "What will this code output?",
      "code": `
let arr = [1, 2, 3, 4];
console.log(arr.length);
`,
      "options": ["3", "4", "5", "Error"],
      "correctAnswer": 1,
      "explanation": "The length property returns the number of elements in an array, which is 4."
    },
    {
      "id": "q2",
      "question": "Which method is used to add an element to the end of an array?",
      "options": ["push()", "pop()", "shift()", "unshift()"],
      "correctAnswer": 0,
      "explanation": "The push() method adds an element to the end of an array."
    },
    {
      "id": "q3",
      "question": "What will this code output?",
      "code": `
let numbers = [10, 20, 30];
numbers.pop();
console.log(numbers);
`,
      "options": ["[10, 20, 30]", "[10, 20]", "[10, 30]", "Error"],
      "correctAnswer": 1,
      "explanation": "The pop() method removes the last element from an array, so [10, 20] remains."
    }
],
'js_basics_4': [
    {
      "id": "q1",
      "question": "What will this code output?",
      "code": `
let person = {name: "John", age: 25};
console.log(person.name);
`,
      "options": ["John", "25", "undefined", "Error"],
      "correctAnswer": 0,
      "explanation": "The dot notation accesses the name property, which is 'John'."
    },
    {
      "id": "q2",
      "question": "Which syntax correctly accesses the value of the 'age' property in an object?",
      "options": ["person[age]", "person.age", "person->age", "person::age"],
      "correctAnswer": 1,
      "explanation": "Dot notation (person.age) is the correct way to access object properties in JavaScript."
    },
    {
      "id": "q3",
      "question": "What will this code output?",
      "code": `
let car = {brand: "Toyota", year: 2020};
car.model = "Corolla";
console.log(car.model);
`,
      "options": ["Corolla", "Toyota", "undefined", "Error"],
      "correctAnswer": 0,
      "explanation": "You can add new properties to an object dynamically. The model property is assigned 'Corolla'."
    }
],
'js_basics_5': [
    {
      "id": "q1",
      "question": "What will this code output?",
      "code": `
function greet() {
    return "Hello, World!";
}
console.log(greet());
`,
      "options": ["Hello, World!", "undefined", "null", "Error"],
      "correctAnswer": 0,
      "explanation": "The function returns 'Hello, World!', which is then logged to the console."
    },
    {
      "id": "q2",
      "question": "Which keyword is used to define a function in JavaScript?",
      "options": ["function", "def", "func", "define"],
      "correctAnswer": 0,
      "explanation": "The 'function' keyword is used to define a function in JavaScript."
    },
    {
      "id": "q3",
      "question": "What will this code output?",
      "code": `
let x = 10;
function test() {
    let x = 5;
    console.log(x);
}
test();
`,
      "options": ["10", "5", "undefined", "Error"],
      "correctAnswer": 1,
      "explanation": "The function has a local variable 'x' which takes precedence over the global 'x', so it logs 5."
    }
],



  'cpp_inter_2': [
    {
      id: 'q1',
      question: 'What is the purpose of the virtual keyword in C++?',
      options: [
        'To create a new variable',
        'To enable runtime polymorphism',
        'To declare a constant',
        'To create a template'
      ],
      correctAnswer: 1,
      explanation: 'The virtual keyword is used to enable runtime polymorphism, allowing derived classes to override base class methods.',
    },
    {
      id: 'q2',
      question: 'What will this code output?',
      code: `
class Base {
public:
    virtual void show() { cout << "Base"; }
};
class Derived : public Base {
public:
    void show() { cout << "Derived"; }
};
Base* ptr = new Derived();
ptr->show();`,
      options: ['Base', 'Derived', 'Error', 'Nothing'],
      correctAnswer: 1,
      explanation: 'Due to virtual function and runtime polymorphism, the Derived class version of show() is called.',
    },
    {
      id: 'q3',
      question: 'What is an abstract class in C++?',
      options: [
        'A class that cannot be instantiated',
        'A class with only static members',
        'A class without constructors',
        'A template class'
      ],
      correctAnswer: 0,
      explanation: 'An abstract class is one that has at least one pure virtual function and cannot be instantiated.',
    },
  ],
  'cpp_inter_3': [
    {
      id: 'q1',
      question: 'What is the correct way to catch all exceptions in C++?',
      options: [
        'catch(Exception e)',
        'catch(...)',
        'catch(all)',
        'catchAll()'
      ],
      correctAnswer: 1,
      explanation: 'catch(...) is used to catch all exceptions in C++.',
    },
    // Add more quizzes for other lessons...
  ],
  'cpp_inter_4': [
    {
      "id": "q1",
      "question": "What will this code output?",
      "code": `
#include <iostream>
using namespace std;

class Point {
public:
    int x, y;
    Point(int a, int b) : x(a), y(b) {}

    Point operator+(const Point& p) {
        return Point(x + p.x, y + p.y);
    }
};

int main() {
    Point p1(3, 4), p2(1, 2);
    Point p3 = p1 + p2;
    cout << p3.x << ", " << p3.y;
    return 0;
}
`,
      "options": ["3, 4", "1, 2", "4, 6", "Error"],
      "correctAnswer": 2,
      "explanation": "The overloaded + operator adds corresponding x and y values, resulting in (4, 6)."
    },
    {
      "id": "q2",
      "question": "Which keyword is used to declare operator overloading in C++?",
      "options": ["overload", "operator", "op", "function"],
      "correctAnswer": 1,
      "explanation": "The 'operator' keyword is used to define overloaded operators in C++."
    },
    {
      "id": "q3",
      "question": "Which operator cannot be overloaded in C++?",
      "options": ["+", "=", "->", "?: (ternary operator)"],
      "correctAnswer": 3,
      "explanation": "The ternary operator (?:) cannot be overloaded in C++."
    }
],
'cpp_inter_5': [
    {
      "id": "q1",
      "question": "Which header file is required for smart pointers in C++?",
      "options": ["<memory>", "<smart>", "<pointer>", "<iostream>"],
      "correctAnswer": 0,
      "explanation": "The <memory> header is required to use smart pointers like unique_ptr and shared_ptr."
    },
    {
      "id": "q2",
      "question": "What will this code output?",
      "code": `
#include <iostream>
#include <memory>
using namespace std;

int main() {
    unique_ptr<int> ptr = make_unique<int>(10);
    cout << *ptr;
    return 0;
}
`,
      "options": ["10", "Address of ptr", "Null", "Error"],
      "correctAnswer": 0,
      "explanation": "The unique_ptr holds an integer with value 10, and *ptr dereferences it to print 10."
    },
    {
      "id": "q3",
      "question": "Which smart pointer allows multiple references to the same object?",
      "options": ["unique_ptr", "shared_ptr", "weak_ptr", "raw pointer"],
      "correctAnswer": 1,
      "explanation": "shared_ptr allows multiple references and uses reference counting to manage memory."
    }
],
  'cpp_adv_2': [
    {
      id: 'q1',
      question: 'What is the purpose of std::move in C++?',
      options: [
        'To copy objects efficiently',
        'To transfer ownership of resources',
        'To delete objects',
        'To create new objects'
      ],
      correctAnswer: 1,
      explanation: 'std::move is used to indicate that an object may be "moved from", allowing the efficient transfer of resources from one object to another.',
    },
    {
      id: 'q2',
      question: 'What is an rvalue reference in C++?',
      options: [
        'A reference to a constant',
        'A reference to a temporary object',
        'A reference to a global variable',
        'A reference to a pointer'
      ],
      correctAnswer: 1,
      explanation: 'An rvalue reference (T&&) is a reference that can bind to temporary objects, enabling move semantics.',
    },
    {
      id: 'q3',
      question: 'What will this code do?',
      code: `
string str1 = "Hello";
string str2 = std::move(str1);
cout << str1;`,
      options: [
        'Print "Hello"',
        'Print an empty string',
        'Cause undefined behavior',
        'Compilation error'
      ],
      correctAnswer: 2,
      explanation: 'After moving from str1, its state is unspecified. Using it without reassignment can lead to undefined behavior.',
    },
  ],
  'cpp_adv_3': [
    {
      id: 'q1',
      question: 'What is a race condition?',
      options: [
        'When two threads compete for CPU time',
        'When multiple threads access shared data without proper synchronization',
        'When one thread runs faster than another',
        'When threads are created in the wrong order'
      ],
      correctAnswer: 1,
      explanation: 'A race condition occurs when multiple threads access shared data concurrently without proper synchronization, leading to unpredictable results.',
    },
    {
      id: 'q2',
      question: 'What is the purpose of std::mutex?',
      options: [
        'To create new threads',
        'To prevent concurrent access to shared resources',
        'To terminate threads',
        'To measure thread performance'
      ],
      correctAnswer: 1,
      explanation: 'std::mutex is used to protect shared data from concurrent access by multiple threads.',
    },
    {
      id: 'q3',
      question: 'What happens if you forget to call join() on a thread?',
      options: [
        'Nothing',
        'Program crashes',
        'Thread continues running',
        'std::terminate is called when the thread object is destroyed'
      ],
      correctAnswer: 3,
      explanation: 'If a thread object is destroyed before joining or detaching, std::terminate is called, causing the program to abort.',
    },
  ],
  'cpp_basics_1': [
    {
      id: 'q1',
      question: 'What is the output of this C++ code?',
      code: `
#include <iostream>
using namespace std;
int main() {
    cout << "Hello, World!";
    return 0;
}`,
      options: ['Hello, World!', 'Error', 'Nothing', 'undefined'],
      correctAnswer: 0,
      explanation: 'This is a basic C++ program that prints "Hello, World!" to the console.',
    },
    {
      id: 'q2',
      question: 'Which header file is required for input/output in C++?',
      options: ['<stdio.h>', '<iostream>', '<istream>', '<stdio>'],
      correctAnswer: 1,
      explanation: '<iostream> is the C++ header file that contains definitions for input/output operations.',
    },
    {
      id: 'q3',
      question: 'What is the correct way to declare a variable in C++?',
      options: [
        'var x = 5;',
        'let x = 5;',
        'int x = 5;',
        'x = 5;'
      ],
      correctAnswer: 2,
      explanation: 'In C++, variables must be declared with their type. "int x = 5;" is the correct way to declare an integer variable.',
    },
  ],
  'cpp_basics_2': [
    {
      id: 'q1',
      question: 'What is the output of this code?',
      code: `
int x = 5;
if(x > 3) {
    cout << "A";
} else {
    cout << "B";
}`,
      options: ['A', 'B', 'AB', 'Error'],
      correctAnswer: 0,
      explanation: 'Since x (5) is greater than 3, the code will output "A".',
    },
    // ... add more quizzes for cpp_basics_2
  ],
  'cpp_basics_3': [
    {
      "id": "q1",
      "question": "What will this code output?",
      "code": `
#include <iostream>
using namespace std;

int main() {
    int arr[] = {1, 2, 3, 4};
    cout << arr[2];
    return 0;
}
`,
      "options": ["1", "2", "3", "4"],
      "correctAnswer": 2,
      "explanation": "Arrays in C++ are zero-indexed, so arr[2] refers to the third element, which is 3."
    },
    {
      "id": "q2",
      "question": "Which header file is needed to use C++ strings?",
      "options": ["<string>", "<cstring>", "<iostream>", "<cstdlib>"],
      "correctAnswer": 0,
      "explanation": "The <string> header is required for using the string class in C++."
    },
    {
      "id": "q3",
      "question": "What will this code output?",
      "code": `
#include <iostream>
#include <string>
using namespace std;

int main() {
    string str = "Hello";
    str += " World";
    cout << str;
    return 0;
}
`,
      "options": ["Hello", "World", "Hello World", "Error"],
      "correctAnswer": 2,
      "explanation": "Using the += operator concatenates 'World' to 'Hello', resulting in 'Hello World'."
    }
],
'cpp_basics_4': [
    {
      "id": "q1",
      "question": "What does this code output?",
      "code": `
#include <iostream>
using namespace std;

int main() {
    int x = 10;
    int* ptr = &x;
    cout << *ptr;
    return 0;
}
`,
      "options": ["x", "Address of x", "10", "Error"],
      "correctAnswer": 2,
      "explanation": "The * operator dereferences the pointer, giving the value stored at x, which is 10."
    },
    {
      "id": "q2",
      "question": "What symbol is used to declare a pointer in C++?",
      "options": ["&", "*", "->", "%"],
      "correctAnswer": 1,
      "explanation": "The * symbol is used to declare a pointer in C++."
    },
    {
      "id": "q3",
      "question": "What does this code output?",
      "code": `
#include <iostream>
using namespace std;

void update(int &n) {
    n = 20;
}

int main() {
    int x = 10;
    update(x);
    cout << x;
    return 0;
}
`,
      "options": ["10", "20", "Error", "Undefined"],
      "correctAnswer": 1,
      "explanation": "The function modifies 'x' via a reference parameter, updating its value to 20."
    }
],
  // ... add quizzes for other C++ lessons
  'react_basics_1': [
    {
      id: 'q1',
      question: 'What is JSX?',
      options: [
        'A JavaScript engine',
        'A syntax extension for JavaScript that allows HTML-like code',
        'A new programming language',
        'A React component'
      ],
      correctAnswer: 1,
      explanation: 'JSX is a syntax extension for JavaScript that lets you write HTML-like code within JavaScript.',
    },
    {
      id: 'q2',
      question: 'What will this code render?',
      code: `
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

<Greeting name="World" />`,
      options: [
        'Hello, {name}!',
        'Hello, World!',
        'Error',
        'Nothing'
      ],
      correctAnswer: 1,
      explanation: 'The component will render "Hello, World!" because the name prop value "World" is interpolated into the JSX.',
    },
    {
      id: 'q3',
      question: 'Which is NOT a valid way to create a React component?',
      options: [
        'function Welcome() { return <h1>Hello</h1>; }',
        'const Welcome = () => <h1>Hello</h1>;',
        'class Welcome { render() { return <h1>Hello</h1>; } }',
        'class Welcome extends React.Component { render() { return <h1>Hello</h1>; } }'
      ],
      correctAnswer: 2,
      explanation: 'A class component must extend React.Component to be valid.',
    },
  ],
  'react_basics_2': [
    {
      "id": "q1",
      "question": "What hook is used to manage state in a functional component?",
      "options": ["useEffect", "useState", "useContext", "useReducer"],
      "correctAnswer": 1,
      "explanation": "The useState hook is used to manage state in functional components."
    },
    {
      "id": "q2",
      "question": "What will this code output?",
      "code": `
import React, { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);

    return (
        <button onClick={() => setCount(count + 1)}>
            Clicked {count} times
        </button>
    );
}
`,
      "options": [
        "An error because setCount is not a function",
        "A button that updates count on click",
        "Nothing happens when clicking",
        "A static button that shows 'Clicked 0 times'"
      ],
      "correctAnswer": 1,
      "explanation": "The button updates the count state using setCount when clicked."
    },
    {
      "id": "q3",
      "question": "What event handler is used to detect a button click in React?",
      "options": ["onPress", "onClick", "onChange", "onSubmit"],
      "correctAnswer": 1,
      "explanation": "The onClick event handler is used to detect clicks in React."
    }
],
'react_basics_3': [
    {
      "id": "q1",
      "question": "What function is commonly used to render a list in React?",
      "options": ["forEach", "map", "filter", "reduce"],
      "correctAnswer": 1,
      "explanation": "The map function is used to render lists in React by returning JSX elements."
    },
    {
      "id": "q2",
      "question": "What is required when rendering a list of elements in React?",
      "options": [
        "A unique 'key' prop for each item",
        "A for loop",
        "An ID attribute",
        "Nothing special is required"
      ],
      "correctAnswer": 0,
      "explanation": "Each list item should have a unique 'key' prop to optimize React rendering."
    },
    {
      "id": "q3",
      "question": "What will this code output?",
      "code": `
const numbers = [1, 2, 3];
return (
    <ul>
        {numbers.map(num => (
            num % 2 === 0 ? <li key={num}>{num}</li> : null
        ))}
    </ul>
);
`,
      "options": ["A list with 1, 2, 3", "A list with 2", "A list with 1 and 3", "Nothing"],
      "correctAnswer": 1,
      "explanation": "The map function only returns items that meet the condition (even numbers), so only '2' is rendered."
    }
],
'react_basics_4': [
    {
      "id": "q1",
      "question": "What hook is commonly used to handle form state in React?",
      "options": ["useEffect", "useReducer", "useState", "useRef"],
      "correctAnswer": 2,
      "explanation": "The useState hook is used to manage form inputs in React."
    },
    {
      "id": "q2",
      "question": "What will this code output?",
      "code": `
import React, { useState } from 'react';

function Form() {
    const [name, setName] = useState('');

    return (
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
    );
}
`,
      "options": [
        "A static input field",
        "An error because setName is not defined",
        "An input field that updates when typed into",
        "An input field that always stays empty"
      ],
      "correctAnswer": 2,
      "explanation": "The onChange handler updates the state, allowing the input value to change dynamically."
    },
    {
      "id": "q3",
      "question": "What event is used to handle form submission in React?",
      "options": ["onInput", "onChange", "onSubmit", "onKeyPress"],
      "correctAnswer": 2,
      "explanation": "The onSubmit event is used to handle form submissions in React."
    }
],
'react_basics_5': [
    {
      "id": "q1",
      "question": "Which hook is equivalent to componentDidMount in class components?",
      "options": ["useEffect", "useState", "useContext", "useRef"],
      "correctAnswer": 0,
      "explanation": "useEffect with an empty dependency array [] runs once after the initial render, similar to componentDidMount."
    },
    {
      "id": "q2",
      "question": "What will this code output?",
      "code": `
import React, { useEffect } from 'react';

function Example() {
    useEffect(() => {
        console.log('Component Mounted');
    }, []);

    return <div>Hello</div>;
}
`,
      "options": [
        "'Component Mounted' logs on every render",
        "'Component Mounted' logs only once",
        "'Component Mounted' never logs",
        "An error occurs"
      ],
      "correctAnswer": 1,
      "explanation": "Since useEffect runs only once when the dependency array is empty, 'Component Mounted' logs just once."
    },
    {
      "id": "q3",
      "question": "What hook is used to perform side effects in React?",
      "options": ["useState", "useEffect", "useRef", "useMemo"],
      "correctAnswer": 1,
      "explanation": "useEffect is used to handle side effects such as data fetching and subscriptions."
    }
],
'react_inter_1': [
    {
      "id": "q1",
      "question": "Which state management library is commonly used in React applications?",
      "options": ["Redux", "Vuex", "Angular Store", "JQuery"],
      "correctAnswer": 0,
      "explanation": "Redux is a popular state management library used in React applications."
    },
    {
      "id": "q2",
      "question": "What will this code output?",
      "code": `
import React, { useReducer } from 'react';

const reducer = (state, action) => {
    switch (action.type) {
        case 'increment':
            return { count: state.count + 1 };
        case 'decrement':
            return { count: state.count - 1 };
        default:
            return state;
    }
};

function Counter() {
    const [state, dispatch] = useReducer(reducer, { count: 0 });

    return (
        <div>
            <p>Count: {state.count}</p>
            <button onClick={() => dispatch({ type: 'increment' })}>+</button>
            <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
        </div>
    );
}
`,
      "options": [
        "An error because useReducer is not defined",
        "A counter that increments and decrements correctly",
        "A static counter that doesn't change",
        "The buttons will cause an infinite loop"
      ],
      "correctAnswer": 1,
      "explanation": "useReducer manages state updates based on dispatched actions, allowing the count to increase or decrease when buttons are clicked."
    },
    {
      "id": "q3",
      "question": "Which of the following is NOT an alternative to Redux for state management?",
      "options": ["useState", "useReducer", "Context API", "Bootstrap"],
      "correctAnswer": 3,
      "explanation": "Bootstrap is a CSS framework and has nothing to do with state management."
    },
    {
      "id": "q4",
      "question": "How can you avoid unnecessary re-renders in a React component with state?",
      "options": [
        "Use React.memo()",
        "Use useEffect() without dependencies",
        "Use useState() inside useEffect()",
        "Avoid using keys in lists"
      ],
      "correctAnswer": 0,
      "explanation": "React.memo() helps optimize performance by preventing re-renders when props haven’t changed."
    },
    {
      "id": "q5",
      "question": "What is the benefit of using the Context API?",
      "options": [
        "It eliminates the need for prop drilling",
        "It makes React faster",
        "It prevents state changes",
        "It replaces React Router"
      ],
      "correctAnswer": 0,
      "explanation": "The Context API allows state to be shared across components without prop drilling."
    }
],
  'react_inter_2': [
    {
      id: 'q1',
      question: 'What is the main purpose of custom hooks in React?',
      options: [
        'To create custom components',
        'To reuse stateful logic between components',
        'To style components',
        'To handle routing'
      ],
      correctAnswer: 1,
      explanation: 'Custom hooks allow you to extract component logic into reusable functions.',
    },
    {
      id: 'q2',
      question: 'What naming convention must custom hooks follow?',
      options: [
        'start with "hook"',
        'start with "use"',
        'end with "Hook"',
        'no special convention'
      ],
      correctAnswer: 1,
      explanation: 'Custom hooks must start with "use" to follow React Hook conventions.',
    },
    {
      id: 'q3',
      question: 'What will this custom hook return?',
      code: `
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount(c => c + 1);
  return [count, increment];
}`,
      options: [
        'Just the count',
        'Just the increment function',
        'An array with count and increment function',
        'undefined'
      ],
      correctAnswer: 2,
      explanation: 'The hook returns an array containing the count state and increment function.',
    },
  ],
  'react_inter_3': [
    {
      id: 'q1',
      question: 'What is the purpose of the exact prop in React Router?',
      options: [
        'To match URLs exactly',
        'To validate route parameters',
        'To enable strict mode',
        'To prevent navigation'
      ],
      correctAnswer: 0,
      explanation: 'The exact prop ensures that the route matches the URL exactly, not just the beginning.',
    },
    {
      id: 'q2',
      question: 'How do you access URL parameters in a React component using React Router?',
      options: [
        'From window.location',
        'Using useParams hook',
        'Through props.params',
        'Using getParameters()'
      ],
      correctAnswer: 1,
      explanation: 'The useParams hook from React Router provides access to URL parameters.',
    },
    {
      id: 'q3',
      question: 'What is the purpose of the Switch component in React Router?',
      options: [
        'To toggle between routes',
        'To render the first matching route exclusively',
        'To enable route transitions',
        'To handle 404 errors'
      ],
      correctAnswer: 1,
      explanation: 'Switch renders the first Route or Redirect that matches the current URL.',
    },
  ],
  'react_inter_4': [
    {
      id: 'q1',
      question: 'What is the best practice for handling API errors in React?',
      options: [
        'Ignore them',
        'Console.log them',
        'Store them in state and show user feedback',
        'Refresh the page'
      ],
      correctAnswer: 2,
      explanation: 'Storing errors in state allows you to show appropriate feedback to users.',
    },
    {
      id: 'q2',
      question: 'When using fetch, what is the correct way to handle HTTP errors?',
      code: `
fetch('api/data')
  .then(response => {
    // What should go here?
  })`,
      options: [
        'response.json()',
        'if (!response.ok) throw Error(response.statusText)',
        'response.text()',
        'response.status === 200'
      ],
      correctAnswer: 1,
      explanation: 'Check response.ok and throw an error if the request was not successful.',
    },
    {
      id: 'q3',
      question: 'What is the purpose of the useEffect cleanup function?',
      options: [
        'To clear the console',
        'To reset state',
        'To cancel pending requests and subscriptions',
        'To clear localStorage'
      ],
      correctAnswer: 2,
      explanation: 'The cleanup function prevents memory leaks by canceling ongoing operations when the component unmounts.',
    },
  ],
  'react_adv_1': [
    {
      "id": "q1",
      "question": "Which React hook is used to memoize the result of a function?",
      "options": ["useEffect", "useState", "useMemo", "useReducer"],
      "correctAnswer": 2,
      "explanation": "useMemo memoizes the result of an expensive function and recomputes only when dependencies change."
    },
    {
      "id": "q2",
      "question": "What is the primary purpose of React.memo()?",
      "options": [
        "To store component state",
        "To prevent unnecessary re-renders of a component",
        "To handle side effects",
        "To manage local storage data"
      ],
      "correctAnswer": 1,
      "explanation": "React.memo prevents unnecessary re-renders by memoizing a component and re-rendering it only if props change."
    },
    {
      "id": "q3",
      "question": "Which technique can improve performance when rendering large lists?",
      "options": ["Virtualization", "Rendering all items at once", "Using more useEffect hooks", "Increasing the state updates"],
      "correctAnswer": 0,
      "explanation": "Virtualization (e.g., using react-window or react-virtualized) renders only visible items, improving performance for large lists."
    },
    {
      "id": "q4",
      "question": "Which optimization technique helps reduce unnecessary re-renders in React?",
      "options": [
        "Using inline functions inside JSX",
        "Using useCallback for memoizing functions",
        "Recreating objects in the component body",
        "Always updating the state directly"
      ],
      "correctAnswer": 1,
      "explanation": "useCallback memoizes a function reference, preventing unnecessary re-renders when passing callbacks to child components."
    },
    {
      "id": "q5",
      "question": "Why should you avoid passing new object literals as props?",
      "options": [
        "It causes unnecessary re-renders",
        "It prevents component updates",
        "It improves performance",
        "It makes state management easier"
      ],
      "correctAnswer": 0,
      "explanation": "Passing new object literals as props creates new references on every render, causing child components to re-render unnecessarily."
    },
    {
      "id": "q6",
      "question": "What is the primary benefit of using lazy loading in React?",
      "options": [
        "Reduces the initial bundle size and speeds up page load time",
        "Makes all components render faster",
        "Eliminates the need for state management",
        "Prevents errors in asynchronous functions"
      ],
      "correctAnswer": 0,
      "explanation": "Lazy loading (React.lazy + Suspense) defers loading components until they are needed, reducing the initial bundle size."
    },
    {
      "id": "q7",
      "question": "Which statement about React's reconciliation process is true?",
      "options": [
        "React always updates all components in the virtual DOM",
        "React compares the previous and new virtual DOM and updates only changed elements",
        "React updates components in the order they were mounted",
        "React clears the entire DOM and re-renders everything"
      ],
      "correctAnswer": 1,
      "explanation": "React’s reconciliation algorithm updates only the changed elements by comparing the previous and new virtual DOM."
    }
],
  'react_adv_2': [
    {
      id: 'q1',
      question: 'What is the purpose of debouncing in React?',
      options: [
        'To prevent memory leaks',
        'To delay function execution until after a period of inactivity',
        'To optimize rendering',
        'To handle errors'
      ],
      correctAnswer: 1,
      explanation: 'Debouncing delays function execution until after a pause in triggering events, useful for search inputs or window resizing.',
    },
    // Add more questions...
  ],
  'react_adv_3': [
    {
      id: 'q1',
      question: 'Why might you split context into State and Dispatch contexts?',
      options: [
        'To improve performance by preventing unnecessary rerenders',
        'To make the code more organized',
        'To handle errors better',
        'To support multiple providers'
      ],
      correctAnswer: 0,
      explanation: 'Splitting context allows components to subscribe only to the parts they need, reducing unnecessary rerenders.',
    },
    // Add more questions...
  ],

  "java_basics_1": [
    {
      "id": "q1",
      "question": "Which of the following is a valid way to declare a variable in Java?",
      "options": ["var x = 5;", "int x = 5;", "x = 5;", "integer x = 5;"],
      "correctAnswer": 1,
      "explanation": "In Java, variables must be declared with a specific type, such as int, before assignment."
    },
    {
      "id": "q2",
      "question": "Which of these is not a primitive data type in Java?",
      "options": ["int", "char", "String", "double"],
      "correctAnswer": 2,
      "explanation": "String is not a primitive data type in Java; it is an object."
    }
  ],
  "java_basics_2": [
    {
      "id": "q1",
      "question": "How do you correctly declare an array in Java?",
      "options": ["int[] arr = new int[5];", "int arr(5);", "array<int> arr;", "int arr = new array(5);"],
      "correctAnswer": 0,
      "explanation": "Arrays in Java are declared using square brackets `[]` and initialized with `new`."
    },
    {
      "id": "q2",
      "question": "What will be the output of this code?\n\n```java\nint[] nums = {1, 2, 3};\nSystem.out.println(nums.length);\n```",
      "options": ["1", "2", "3", "3.0"],
      "correctAnswer": 2,
      "explanation": "The `length` property of an array returns the number of elements, which is 3 in this case."
    }
  ],
  "java_basics_3": [
    {
      "id": "q1",
      "question": "Which keyword is used to define a class in Java?",
      "options": ["define", "class", "Class", "struct"],
      "correctAnswer": 1,
      "explanation": "In Java, the `class` keyword is used to define a class."
    },
    {
      "id": "q2",
      "question": "What concept does Java use to support multiple methods with the same name but different parameters?",
      "options": ["Method overriding", "Method overloading", "Encapsulation", "Polymorphism"],
      "correctAnswer": 1,
      "explanation": "Method overloading allows multiple methods to have the same name with different parameters."
    }
  ],
  "java_basics_4": [
    {
      "id": "q1",
      "question": "Which of the following is an access modifier in Java?",
      "options": ["public", "static", "final", "return"],
      "correctAnswer": 0,
      "explanation": "`public` is an access modifier that allows a class or method to be accessible from anywhere."
    },
    {
      "id": "q2",
      "question": "Which principle of OOP ensures that data is hidden from the user?",
      "options": ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"],
      "correctAnswer": 2,
      "explanation": "Encapsulation ensures that data is hidden and accessed only through methods."
    }
  ],
  "java_basics_5": [
    {
      "id": "q1",
      "question": "Which block of code is mandatory when handling exceptions in Java?",
      "options": ["try", "catch", "finally", "None of the above"],
      "correctAnswer": 0,
      "explanation": "A `try` block is required to define code that might throw an exception."
    },
    {
      "id": "q2",
      "question": "What exception is thrown when dividing by zero in Java?",
      "options": ["NullPointerException", "ArithmeticException", "ArrayIndexOutOfBoundsException", "IllegalArgumentException"],
      "correctAnswer": 1,
      "explanation": "Dividing by zero in Java results in an `ArithmeticException`."
    }
  ],
  "java_inter_1": [
    {
      "id": "q1",
      "question": "Which of the following is an interface in Java Collections Framework?",
      "options": ["ArrayList", "HashMap", "List", "TreeSet"],
      "correctAnswer": 2,
      "explanation": "List is an interface in Java Collections Framework, while ArrayList, HashMap, and TreeSet are implementations."
    },
    {
      "id": "q2",
      "question": "What is the time complexity of retrieving an element by index in an ArrayList?",
      "options": ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
      "correctAnswer": 0,
      "explanation": "ArrayList provides O(1) time complexity for retrieving an element by index since it uses an array internally."
    },
    {
      "id": "q3",
      "question": "Which collection class does not allow duplicate elements?",
      "options": ["ArrayList", "HashSet", "LinkedList", "HashMap"],
      "correctAnswer": 1,
      "explanation": "HashSet does not allow duplicate elements, ensuring uniqueness in stored values."
    }
  ],
  "java_inter_2": [
    {
      "id": "q1",
      "question": "Which Java class is used to create threads?",
      "options": ["Runnable", "Thread", "Executor", "Callable"],
      "correctAnswer": 1,
      "explanation": "The Thread class is used to create and manage threads in Java."
    },
    {
      "id": "q2",
      "question": "How do you start a thread in Java?",
      "options": [
        "Calling run() method",
        "Calling start() method",
        "Instantiating a Thread object",
        "Using the new keyword"
      ],
      "correctAnswer": 1,
      "explanation": "The start() method is used to begin the execution of a thread."
    },
    {
      "id": "q3",
      "question": "Which keyword is used to prevent multiple threads from executing a block of code simultaneously?",
      "options": ["volatile", "synchronized", "transient", "static"],
      "correctAnswer": 1,
      "explanation": "The `synchronized` keyword ensures that only one thread executes a block of code at a time."
    }
  ],
  
  "java_adv_1": [
    {
      "id": "q1",
      "question": "Which of the following is a feature introduced in Java 8?",
      "options": ["Generics", "Lambdas", "Annotations", "Multithreading"],
      "correctAnswer": 1,
      "explanation": "Java 8 introduced Lambda expressions, which provide a functional programming style."
    },
    {
      "id": "q2",
      "question": "What is the purpose of the Stream API in Java?",
      "options": [
        "To process collections of data in a functional style",
        "To create new data structures",
        "To replace loops in Java",
        "To improve exception handling"
      ],
      "correctAnswer": 0,
      "explanation": "The Stream API in Java is used for processing collections in a declarative and functional manner."
    },
    {
      "id": "q3",
      "question": "Which functional interface is used for representing a function that takes one argument and returns a value?",
      "options": ["Supplier", "Consumer", "Function", "Predicate"],
      "correctAnswer": 2,
      "explanation": "The `Function<T, R>` interface represents a function that takes an argument of type T and returns a result of type R."
    },
    {
      "id": "q4",
      "question": "What is the difference between `var` in Java and `let` in JavaScript?",
      "options": [
        "`var` in Java is used for local variable type inference, whereas `let` in JavaScript is for block-scoped variables.",
        "They are identical in behavior.",
        "Java does not have `var`.",
        "`let` is only used in Java while `var` is used in JavaScript."
      ],
      "correctAnswer": 0,
      "explanation": "`var` in Java (introduced in Java 10) allows local variable type inference, whereas `let` in JavaScript is used for block-scoped variables."
    },
    {
      "id": "q5",
      "question": "Which feature introduced in Java 14 provides a simpler way to return values from a switch statement?",
      "options": ["Pattern Matching", "Switch Expressions", "Records", "Text Blocks"],
      "correctAnswer": 1,
      "explanation": "Switch expressions, introduced in Java 14, allow returning values directly from a switch statement."
    }
  ],
  "typescript_basics_1": [
    {
      "id": "q1",
      "question": "What is TypeScript?",
      "options": [
        "A framework for building mobile apps",
        "A strongly typed superset of JavaScript",
        "A CSS preprocessor",
        "A database management tool"
      ],
      "correctAnswer": 1,
      "explanation": "TypeScript is a strongly typed superset of JavaScript that compiles to plain JavaScript."
    },
    {
      "id": "q2",
      "question": "Which file extension is used for TypeScript files?",
      "options": [".js", ".ts", ".jsx", ".tsx"],
      "correctAnswer": 1,
      "explanation": "TypeScript files use the `.ts` extension."
    }
  ],
  "typescript_basics_2": [
    {
      "id": "q1",
      "question": "How do you define a function in TypeScript that returns a string?",
      "options": [
        "function greet(): void",
        "function greet(): string",
        "function greet()",
        "function greet(): any"
      ],
      "correctAnswer": 1,
      "explanation": "In TypeScript, specifying `: string` after the parentheses defines the return type as a string."
    },
    {
      "id": "q2",
      "question": "What is the purpose of optional parameters in TypeScript functions?",
      "options": [
        "To enforce parameter types",
        "To allow functions to be called with fewer arguments",
        "To increase performance",
        "To enable asynchronous execution"
      ],
      "correctAnswer": 1,
      "explanation": "Optional parameters allow functions to be called with fewer arguments, using the `?` symbol."
    }
  ],
  "typescript_basics_3": [
    {
      "id": "q1",
      "question": "Which keyword is used to define an interface in TypeScript?",
      "options": ["class", "interface", "struct", "module"],
      "correctAnswer": 1,
      "explanation": "The `interface` keyword is used to define an interface in TypeScript."
    },
    {
      "id": "q2",
      "question": "How do you implement an interface in a TypeScript class?",
      "options": [
        "class MyClass extends MyInterface",
        "class MyClass implements MyInterface",
        "class MyClass inherits MyInterface",
        "class MyClass uses MyInterface"
      ],
      "correctAnswer": 1,
      "explanation": "The `implements` keyword is used for classes to adhere to the structure defined by an interface."
    }
  ],
  "typescript_basics_4": [
    {
      "id": "q1",
      "question": "What is a class in TypeScript?",
      "options": [
        "A blueprint for creating objects",
        "A CSS styling tool",
        "A function wrapper",
        "A data structure for arrays"
      ],
      "correctAnswer": 0,
      "explanation": "A class in TypeScript is a blueprint from which objects are created, similar to JavaScript ES6 classes."
    },
    {
      "id": "q2",
      "question": "Which access modifier makes a class member accessible only within its own class?",
      "options": ["public", "private", "protected", "readonly"],
      "correctAnswer": 1,
      "explanation": "The `private` access modifier restricts access to the class member only within its own class."
    }
  ],
  "typescript_basics_5": [
    {
      "id": "q1",
      "question": "What are generics in TypeScript?",
      "options": [
        "A way to enforce data types",
        "A way to create reusable components",
        "A method of data binding",
        "A library for AJAX requests"
      ],
      "correctAnswer": 1,
      "explanation": "Generics allow you to create reusable components that can work with any data type."
    },
    {
      "id": "q2",
      "question": "Which of the following is a correct usage of generics in TypeScript?",
      "code": "function identity<T>(arg: T): T { return arg; }",
      "options": [
        "Function that returns any data type",
        "Function that only accepts numbers",
        "Function that returns the same type as the argument",
        "Function that doesn't return anything"
      ],
      "correctAnswer": 2,
      "explanation": "The generic function `identity<T>` returns the same type as the argument passed in."
    }
  ],
  "typescript_inter_1": [
    {
      "id": "q1",
      "question": "What is a Union type in TypeScript?",
      "options": [
        "A type that combines multiple types and allows any of them",
        "A type that enforces strict type matching",
        "A type that only allows string values",
        "A way to define arrays in TypeScript"
      ],
      "correctAnswer": 0,
      "explanation": "Union types allow a variable to be of multiple types using the `|` operator."
    },
    {
      "id": "q2",
      "question": "Which TypeScript type is used when a value can be of any type?",
      "options": ["unknown", "any", "never", "void"],
      "correctAnswer": 1,
      "explanation": "The `any` type allows a variable to hold any type of value."
    },
    {
      "id": "q3",
      "question": "What is a mapped type in TypeScript?",
      "options": [
        "A type that is created dynamically based on another type",
        "A type that maps array values",
        "A type that creates a new object instance",
        "A type that enforces immutability"
      ],
      "correctAnswer": 0,
      "explanation": "Mapped types allow you to transform object properties into a new type dynamically."
    }
  ],
  "typescript_inter_2": [
    {
      "id": "q1",
      "question": "What is a decorator in TypeScript?",
      "options": [
        "A function that adds metadata to a class, method, or property",
        "A function that modifies a string",
        "A way to handle errors in TypeScript",
        "A CSS styling method"
      ],
      "correctAnswer": 0,
      "explanation": "Decorators are functions that add metadata or modify behavior for classes, methods, properties, or parameters."
    },
    {
      "id": "q2",
      "question": "Which TypeScript decorator is used to define a class-level metadata?",
      "options": ["@Component", "@Injectable", "@ClassDecorator", "@Module"],
      "correctAnswer": 2,
      "explanation": "Custom class decorators can be created using `@ClassDecorator` in TypeScript."
    },
    {
      "id": "q3",
      "question": "Which TypeScript configuration flag must be enabled to use decorators?",
      "options": ["strict", "experimentalDecorators", "emitDecoratorMetadata", "allowJS"],
      "correctAnswer": 1,
      "explanation": "The `experimentalDecorators` flag must be enabled in `tsconfig.json` to use decorators."
    }
  ],
    "typescript_adv_1": [
      {
        "id": "q1",
        "question": "What is the utility type `Partial<T>` used for in TypeScript?",
        "options": [
          "Creates a new type where all properties of T are required",
          "Creates a new type where all properties of T are optional",
          "Removes all properties from T",
          "Ensures all properties of T are readonly"
        ],
        "correctAnswer": 1,
        "explanation": "The `Partial<T>` utility type makes all properties of `T` optional."
      },
      {
        "id": "q2",
        "question": "What is the difference between `readonly` and `const` in TypeScript?",
        "options": [
          "`readonly` is used for object properties, `const` is used for variables",
          "`readonly` ensures values cannot change, `const` allows reassignment",
          "`readonly` can be reassigned, `const` prevents function execution",
          "There is no difference; they behave the same"
        ],
        "correctAnswer": 0,
        "explanation": "The `readonly` modifier prevents modification of object properties, while `const` prevents reassignment of variables."
      },
      {
        "id": "q3",
        "question": "What does the `Record<K, T>` utility type do?",
        "options": [
          "Creates a type with keys of type K and values of type T",
          "Records logs of function calls",
          "Maps an array to an object",
          "Stores only primitive values"
        ],
        "correctAnswer": 0,
        "explanation": "The `Record<K, T>` utility type creates a type with keys of type `K` and values of type `T`."
      },
      {
        "id": "q4",
        "question": "What is an `Indexed Access Type` in TypeScript?",
        "options": [
          "A type that allows extracting types using object keys",
          "A type used only in arrays",
          "A type that replaces generics",
          "A way to perform database indexing"
        ],
        "correctAnswer": 0,
        "explanation": "Indexed Access Types allow extracting a specific property type from an object type using `T[K]`."
      },
      {
        "id": "q5",
        "question": "What does the `infer` keyword do in TypeScript?",
        "options": [
          "Infers a type from a given generic parameter",
          "Imports types from external modules",
          "Forces a specific type",
          "Creates an instance of an object"
        ],
        "correctAnswer": 0,
        "explanation": "The `infer` keyword is used in conditional types to infer a type from a given generic parameter."
      }
    ],
    "php_basics_1": [
      {
        "id": "q1",
        "question": "What does PHP stand for?",
        "options": [
          "Personal Home Page",
          "PHP: Hypertext Preprocessor",
          "Private Hosting Protocol",
          "Programming Hypertext Page"
        ],
        "correctAnswer": 1,
        "explanation": "PHP originally stood for 'Personal Home Page', but now it stands for 'PHP: Hypertext Preprocessor'."
      },
      {
        "id": "q2",
        "question": "Which symbol is used to start a PHP variable?",
        "options": ["$", "@", "&", "#"],
        "correctAnswer": 0,
        "explanation": "In PHP, all variables start with a `$` sign."
      },
      {
        "id": "q3",
        "question": "Which function is used to display output in PHP?",
        "options": ["print()", "echo()", "display()", "show()"],
        "correctAnswer": 1,
        "explanation": "The `echo()` function is commonly used to output data in PHP."
      }
    ],
    "php_basics_2": [
      {
        "id": "q1",
        "question": "How do you create an indexed array in PHP?",
        "options": [
          "$arr = array('apple', 'banana', 'cherry');",
          "$arr = ['apple' => 'red', 'banana' => 'yellow'];",
          "$arr = new Array('apple', 'banana', 'cherry');",
          "array.create('apple', 'banana', 'cherry');"
        ],
        "correctAnswer": 0,
        "explanation": "In PHP, indexed arrays are created using `array()` or `[]`."
      },
      {
        "id": "q2",
        "question": "Which function is used to count the number of elements in an array?",
        "options": ["count()", "size()", "length()", "sizeof()"],
        "correctAnswer": 0,
        "explanation": "The `count()` function is used to determine the number of elements in an array."
      },
      {
        "id": "q3",
        "question": "How do you define a function in PHP?",
        "code": "Fill in the missing part:\n```php\nfunction myFunction() {\n    echo 'Hello, World!';\n}\n```",
        "options": [
          "define myFunction()",
          "function myFunction()",
          "create myFunction()",
          "new function myFunction()"
        ],
        "correctAnswer": 1,
        "explanation": "Functions in PHP are defined using the `function` keyword."
      }
    ],
    "php_basics_3": [
      {
        "id": "q1",
        "question": "Which method is used to send form data securely?",
        "options": ["GET", "POST", "SESSION", "COOKIE"],
        "correctAnswer": 1,
        "explanation": "The `POST` method sends form data securely and does not expose it in the URL."
      },
      {
        "id": "q2",
        "question": "What superglobal is used to access form data sent via POST?",
        "options": ["$_REQUEST", "$_GET", "$_SESSION", "$_POST"],
        "correctAnswer": 3,
        "explanation": "The `$_POST` superglobal is used to access data sent via the POST method."
      },
      {
        "id": "q3",
        "question": "What is the correct way to check if a form is submitted?",
        "options": [
          "if ($_SERVER['REQUEST_METHOD'] == 'POST')",
          "if (isset($_POST['submit']))",
          "if ($_POST == true)",
          "if ($_REQUEST == 'submit')"
        ],
        "correctAnswer": 0,
        "explanation": "Checking `$_SERVER['REQUEST_METHOD'] == 'POST'` ensures the form was submitted using POST."
      }
    ],
    "php_inter_1": [
      {
        "id": "q1",
        "question": "Which keyword is used to define a class in PHP?",
        "options": ["class", "define", "object", "new"],
        "correctAnswer": 0,
        "explanation": "The `class` keyword is used to define a class in PHP."
      },
      {
        "id": "q2",
        "question": "How do you create an object from a class in PHP?",
        "code": "Given the class:\n```php\nclass Car {\n    public $brand;\n}\n```\nWhich is the correct way to create an object?",
        "options": [
          "$car = new Car();",
          "$car = Car();",
          "$car = create Car();",
          "$car = new object(Car);"
        ],
        "correctAnswer": 0,
        "explanation": "Objects are created using the `new` keyword followed by the class name."
      },
      {
        "id": "q3",
        "question": "What is the purpose of a constructor in PHP?",
        "options": [
          "To initialize an object when it is created",
          "To destroy an object when it is no longer needed",
          "To create a new instance of a class",
          "To inherit properties from another class"
        ],
        "correctAnswer": 0,
        "explanation": "A constructor (`__construct()`) is a special method used to initialize an object when it is created."
      },
      {
        "id": "q4",
        "question": "Which access modifier restricts access to a class property only within the same class?",
        "options": ["public", "private", "protected", "static"],
        "correctAnswer": 1,
        "explanation": "The `private` access modifier means the property can only be accessed within the same class."
      },
      {
        "id": "q5",
        "question": "How do you define a method inside a class in PHP?",
        "code": "Fill in the missing part:\n```php\nclass Person {\n    _____ function sayHello() {\n        return 'Hello';\n    }\n}\n```",
        "options": ["public", "method", "define", "var"],
        "correctAnswer": 0,
        "explanation": "Methods in a class are typically defined with an access modifier like `public`."
      },
      {
        "id": "q6",
        "question": "What is inheritance in PHP?",
        "options": [
          "A feature that allows one class to extend another",
          "A way to store data persistently",
          "A technique for defining constants",
          "A method to create multiple objects"
        ],
        "correctAnswer": 0,
        "explanation": "Inheritance allows a class to extend another class and inherit its properties and methods."
      },
      {
        "id": "q7",
        "question": "Which keyword is used to inherit from another class?",
        "options": ["extend", "inherits", "implements", "extends"],
        "correctAnswer": 3,
        "explanation": "The `extends` keyword is used to indicate that a class is inheriting from another class."
      },
      {
        "id": "q8",
        "question": "Which keyword is used to implement an interface in PHP?",
        "options": ["extends", "implements", "inherit", "interface"],
        "correctAnswer": 1,
        "explanation": "The `implements` keyword is used when a class implements an interface."
      },
      {
        "id": "q9",
        "question": "What is the difference between `abstract` and `interface` in PHP?",
        "options": [
          "Abstract classes can have both implemented and abstract methods, while interfaces only contain method signatures.",
          "Interfaces can have implemented methods, while abstract classes cannot.",
          "Both are the same and interchangeable.",
          "An interface cannot be implemented in PHP."
        ],
        "correctAnswer": 0,
        "explanation": "Abstract classes can define both implemented and abstract methods, while interfaces only declare method signatures."
      },
      {
        "id": "q10",
        "question": "What will the following code output?\n```php\nclass ParentClass {\n    protected $value = 'Hello';\n}\n\nclass ChildClass extends ParentClass {\n    public function getValue() {\n        return $this->value;\n    }\n}\n\n$child = new ChildClass();\necho $child->getValue();\n```",
        "options": ["Hello", "Error", "NULL", "Undefined"],
        "correctAnswer": 0,
        "explanation": "Since `$value` is `protected`, it is accessible within the child class."
      }
    ],
    "php_adv_1": [
    {
      "id": "q1",
      "question": "What is the primary purpose of namespaces in PHP?",
      "options": [
        "To organize and encapsulate classes, functions, and constants",
        "To define global variables",
        "To handle database connections",
        "To execute shell commands"
      ],
      "correctAnswer": 0,
      "explanation": "Namespaces allow for better organization of classes, functions, and constants, preventing name conflicts."
    },
    {
      "id": "q2",
      "question": "Which PHP function is used to load a class automatically when it is needed?",
      "options": [
        "autoload()",
        "require_once()",
        "spl_autoload_register()",
        "include()"
      ],
      "correctAnswer": 2,
      "explanation": "`spl_autoload_register()` registers a function that will be called automatically to load undefined classes."
    },
    {
      "id": "q3",
      "question": "What is the difference between `trait` and `abstract class` in PHP?",
      "options": [
        "Traits allow multiple inheritance-like behavior, while abstract classes can only be extended by one class",
        "Abstract classes can have implemented methods, while traits cannot",
        "Traits are used for database operations",
        "Abstract classes cannot have methods"
      ],
      "correctAnswer": 0,
      "explanation": "Traits allow code reuse in multiple classes without requiring inheritance, whereas abstract classes define base classes that must be extended."
    },
    {
      "id": "q4",
      "question": "Which of the following is NOT a valid way to handle errors in PHP?",
      "options": [
        "Using `try-catch` blocks",
        "Using `error_reporting()`",
        "Using `set_exception_handler()`",
        "Using `require('file_does_not_exist.php')` without handling"
      ],
      "correctAnswer": 3,
      "explanation": "Using `require()` on a nonexistent file will cause a fatal error if not handled properly."
    },
    {
      "id": "q5",
      "question": "What is the purpose of `PDO` in PHP?",
      "options": [
        "It provides a consistent interface for database access",
        "It is used for file handling",
        "It is a template engine",
        "It is used to send emails"
      ],
      "correctAnswer": 0,
      "explanation": "PHP Data Objects (PDO) is a database abstraction layer that allows secure and consistent database access."
    },
    {
      "id": "q6",
      "question": "Which of the following correctly starts a PHP session?",
      "options": [
        "`start_session();`",
        "`session_start();`",
        "`begin_session();`",
        "`new Session();`"
      ],
      "correctAnswer": 1,
      "explanation": "`session_start();` is used to begin a new session or resume an existing one."
    },
    {
      "id": "q7",
      "question": "What will happen if you try to serialize an object in PHP?",
      "options": [
        "It will be converted into a storable string format",
        "It will be executed as PHP code",
        "It will throw an error",
        "It will be converted into a JSON object"
      ],
      "correctAnswer": 0,
      "explanation": "Serialization converts an object into a string that can be stored and later unserialized back into an object."
    },
    {
      "id": "q8",
      "question": "Which of the following is TRUE about JSON and PHP?",
      "options": [
        "`json_encode()` converts PHP arrays/objects into JSON format",
        "`json_decode()` is used to encode PHP arrays",
        "PHP does not support JSON",
        "`json_format()` is a built-in PHP function"
      ],
      "correctAnswer": 0,
      "explanation": "`json_encode()` is used to convert PHP arrays and objects into JSON format."
    },
    {
      "id": "q9",
      "question": "Which PHP function is used to prevent SQL injection when using MySQLi?",
      "options": [
        "`mysqli_escape_string()`",
        "`mysqli_real_escape_string()`",
        "`mysql_protect()`",
        "`sanitize_sql()`"
      ],
      "correctAnswer": 1,
      "explanation": "`mysqli_real_escape_string()` escapes special characters in a string to prevent SQL injection."
    },
    {
      "id": "q10",
      "question": "What is Composer in PHP?",
      "options": [
        "A package manager for PHP",
        "A debugging tool",
        "A framework",
        "A database management system"
      ],
      "correctAnswer": 0,
      "explanation": "Composer is a dependency management tool for PHP that allows easy installation and management of libraries."
    }
  ],
  "angular_basics_1": [
    {
      "id": "q1",
      "question": "Which command is used to create a new Angular project?",
      "options": [
        "ng new project-name",
        "npm new project-name",
        "angular create project-name",
        "ng create project-name"
      ],
      "correctAnswer": 0,
      "explanation": "`ng new project-name` is the Angular CLI command used to create a new Angular project."
    },
    {
      "id": "q2",
      "question": "Which file is the main entry point of an Angular application?",
      "options": [
        "index.html",
        "main.ts",
        "app.component.ts",
        "angular.json"
      ],
      "correctAnswer": 1,
      "explanation": "`main.ts` is the entry point of an Angular application, where the root module is bootstrapped."
    },
    {
      "id": "q3",
      "question": "Which decorator is used to define an Angular module?",
      "options": [
        "@Component",
        "@NgModule",
        "@Injectable",
        "@Directive"
      ],
      "correctAnswer": 1,
      "explanation": "`@NgModule` is used to define an Angular module, which organizes the application."
    }
  ],
  "angular_basics_2": [
    {
      "id": "q1",
      "question": "What is the purpose of the `@Component` decorator in Angular?",
      "options": [
        "Defines a service",
        "Defines a module",
        "Defines a directive",
        "Defines a component"
      ],
      "correctAnswer": 3,
      "explanation": "`@Component` is used to define an Angular component, which controls a portion of the UI."
    },
    {
      "id": "q2",
      "question": "Which Angular file type is primarily used for defining the template of a component?",
      "options": [
        ".ts",
        ".html",
        ".css",
        ".json"
      ],
      "correctAnswer": 1,
      "explanation": "Angular component templates are defined using `.html` files."
    },
    {
      "id": "q3",
      "question": "What is the syntax for one-way data binding in Angular?",
      "options": [
        "{{ expression }}",
        "[property]='value'",
        "(event)='handler()'",
        "*ngIf='condition'"
      ],
      "correctAnswer": 0,
      "explanation": "Interpolation (`{{ expression }}`) is used for one-way data binding in Angular."
    }
  ],
  "angular_basics_3": [
    {
      "id": "q1",
      "question": "Which directive is used to conditionally show or hide elements?",
      "options": [
        "*ngFor",
        "*ngIf",
        "ngClass",
        "ngModel"
      ],
      "correctAnswer": 1,
      "explanation": "`*ngIf` is used to conditionally display elements based on an expression."
    },
    {
      "id": "q2",
      "question": "What does `*ngFor` do in Angular?",
      "options": [
        "Binds a CSS class dynamically",
        "Loops through a list and renders items",
        "Validates form input",
        "Creates an Angular service"
      ],
      "correctAnswer": 1,
      "explanation": "`*ngFor` is used to iterate over an array and dynamically render elements."
    },
    {
      "id": "q3",
      "question": "Which directive is used to dynamically apply CSS classes?",
      "options": [
        "ngStyle",
        "ngModel",
        "ngClass",
        "ngFor"
      ],
      "correctAnswer": 2,
      "explanation": "`ngClass` is used to dynamically apply CSS classes based on conditions."
    }
  ],
  "angular_basics_4": [
    {
      "id": "q1",
      "question": "Which directive is used for two-way data binding in Angular forms?",
      "options": [
        "ngIf",
        "ngClass",
        "ngModel",
        "ngStyle"
      ],
      "correctAnswer": 2,
      "explanation": "`ngModel` enables two-way data binding in Angular forms."
    },
    {
      "id": "q2",
      "question": "What is the difference between Template-driven and Reactive forms?",
      "options": [
        "Template-driven forms are easier for complex forms, while Reactive forms are for simpler ones",
        "Reactive forms use form controls in the component, while Template-driven forms use directives in the template",
        "There is no difference",
        "Template-driven forms require more code than Reactive forms"
      ],
      "correctAnswer": 1,
      "explanation": "Reactive forms are more flexible and defined in the component, while Template-driven forms rely on directives in the template."
    },
    {
      "id": "q3",
      "question": "Which built-in validator checks if a field is required?",
      "options": [
        "minLength",
        "maxLength",
        "required",
        "pattern"
      ],
      "correctAnswer": 2,
      "explanation": "The `required` validator ensures that a field is not left empty."
    }
  ],
  "angular_inter_1": [
    {
      "id": "q1",
      "question": "What is the main purpose of Angular services?",
      "options": [
        "To define UI components",
        "To manage application logic and reusable functionality",
        "To style Angular applications",
        "To create database connections"
      ],
      "correctAnswer": 1,
      "explanation": "Angular services are used to encapsulate business logic and reusable functionality."
    },
    {
      "id": "q2",
      "question": "How do you inject a service into a component in Angular?",
      "options": [
        "By using the `@Injectable()` decorator",
        "By adding it to the module imports",
        "By manually importing it in the component file",
        "By declaring it inside the `@Component` decorator"
      ],
      "correctAnswer": 0,
      "explanation": "The `@Injectable()` decorator marks a class as a service that can be injected into other components."
    },
    {
      "id": "q3",
      "question": "Which Angular provider scope ensures that a service instance is shared across the entire application?",
      "options": [
        "`providedIn: 'root'`",
        "`providedIn: 'any'`",
        "`providedIn: 'module'`",
        "`providedIn: 'component'`"
      ],
      "correctAnswer": 0,
      "explanation": "Using `providedIn: 'root'` ensures a singleton service shared across the entire application."
    }
  ],
  "angular_inter_2": [
    {
      "id": "q1",
      "question": "Which module is required to make HTTP requests in Angular?",
      "options": [
        "HttpModule",
        "HttpClientModule",
        "FormsModule",
        "CommonModule"
      ],
      "correctAnswer": 1,
      "explanation": "`HttpClientModule` is the Angular module that allows making HTTP requests."
    },
    {
      "id": "q2",
      "question": "What is the primary benefit of using Observables for HTTP requests in Angular?",
      "options": [
        "They execute synchronously",
        "They allow handling multiple values over time",
        "They block UI updates until the request completes",
        "They replace promises in JavaScript"
      ],
      "correctAnswer": 1,
      "explanation": "Observables in Angular allow handling multiple values over time and support features like operators for data transformation."
    },
    {
      "id": "q3",
      "question": "Which Angular service is used to make HTTP requests?",
      "options": [
        "HttpService",
        "HttpClient",
        "FetchService",
        "RequestHandler"
      ],
      "correctAnswer": 1,
      "explanation": "`HttpClient` is the Angular service used for making HTTP requests."
    }
  ],
  "angular_adv_1": [
    {
      "id": "q1",
      "question": "What is the purpose of NgRx in Angular applications?",
      "options": [
        "To manage CSS styles dynamically",
        "To store application state in a centralized store",
        "To optimize component rendering",
        "To replace Angular services"
      ],
      "correctAnswer": 1,
      "explanation": "NgRx provides a centralized state management solution using Redux-like patterns."
    },
    {
      "id": "q2",
      "question": "Which of the following is a core component of NgRx?",
      "options": [
        "Actions",
        "Modules",
        "Pipes",
        "Directives"
      ],
      "correctAnswer": 0,
      "explanation": "NgRx consists of core components like Actions, Reducers, Selectors, and Effects."
    },
    {
      "id": "q3",
      "question": "How does NgRx handle state immutability?",
      "options": [
        "By modifying existing state objects",
        "By using Redux principles and returning new state objects",
        "By directly updating the database",
        "By using two-way data binding"
      ],
      "correctAnswer": 1,
      "explanation": "NgRx follows Redux principles, ensuring state immutability by returning new state objects instead of modifying existing ones."
    }
  ],
  "laravel_basics_1": [
    {
      "id": "q1",
      "question": "What command is used to create a new Laravel project?",
      "options": [
        "`composer create-project laravel/laravel project-name`",
        "`php artisan serve`",
        "`laravel new project-name`",
        "`npm install laravel`"
      ],
      "correctAnswer": 0,
      "explanation": "The correct command to create a new Laravel project is `composer create-project laravel/laravel project-name`."
    },
    {
      "id": "q2",
      "question": "Which file contains Laravel's application configuration settings?",
      "options": [
        ".env",
        "config/app.php",
        "routes/web.php",
        "bootstrap/app.php"
      ],
      "correctAnswer": 1,
      "explanation": "The `config/app.php` file contains Laravel's core configuration settings."
    },
    {
      "id": "q3",
      "question": "Which command starts a Laravel development server?",
      "options": [
        "`php artisan run`",
        "`php artisan serve`",
        "`laravel start`",
        "`npm start`"
      ],
      "correctAnswer": 1,
      "explanation": "`php artisan serve` starts Laravel's built-in development server."
    }
  ],
  "laravel_basics_2": [
    {
      "id": "q1",
      "question": "What is Eloquent in Laravel?",
      "options": [
        "A database migration tool",
        "A templating engine",
        "Laravel’s built-in ORM for database interactions",
        "A session management system"
      ],
      "correctAnswer": 2,
      "explanation": "Eloquent is Laravel’s ORM (Object-Relational Mapping) used for database interactions."
    },
    {
      "id": "q2",
      "question": "How do you define a model in Laravel?",
      "options": [
        "`php artisan make:controller`",
        "`php artisan make:model ModelName`",
        "`php artisan create:model ModelName`",
        "`php artisan migrate:model ModelName`"
      ],
      "correctAnswer": 1,
      "explanation": "The correct command to create a model in Laravel is `php artisan make:model ModelName`."
    },
    {
      "id": "q3",
      "question": "Which Eloquent method is used to retrieve all records from a model?",
      "options": [
        "find()",
        "get()",
        "all()",
        "first()"
      ],
      "correctAnswer": 2,
      "explanation": "The `all()` method retrieves all records from a model."
    }
  ],
  "laravel_inter_1": [
    {
      "id": "q1",
      "question": "Which Laravel package is used for authentication?",
      "options": [
        "Sanctum",
        "Auth",
        "Passport",
        "Breeze"
      ],
      "correctAnswer": 1,
      "explanation": "Laravel provides built-in authentication using the `Auth` package."
    },
    {
      "id": "q2",
      "question": "Which command generates authentication scaffolding in Laravel?",
      "options": [
        "`php artisan make:auth`",
        "`php artisan ui auth`",
        "`php artisan auth:make`",
        "`php artisan scaffold:auth`"
      ],
      "correctAnswer": 1,
      "explanation": "In Laravel, `php artisan ui auth` generates authentication scaffolding."
    }
  ],
  "laravel_inter_2": [
    {
      "id": "q1",
      "question": "Which Laravel package is recommended for API authentication?",
      "options": [
        "Sanctum",
        "Breeze",
        "JWT",
        "Auth"
      ],
      "correctAnswer": 0,
      "explanation": "Laravel Sanctum is recommended for API authentication."
    },
    {
      "id": "q2",
      "question": "Which HTTP method is used to update a resource in a REST API?",
      "options": [
        "GET",
        "POST",
        "PUT",
        "DELETE"
      ],
      "correctAnswer": 2,
      "explanation": "The `PUT` method is used to update a resource in a REST API."
    }
  ],
  "laravel_adv_1": [
    {
      "id": "q1",
      "question": "What is Laravel Livewire used for?",
      "options": [
        "Database management",
        "Building reactive UI components without JavaScript",
        "Laravel authentication",
        "Logging events"
      ],
      "correctAnswer": 1,
      "explanation": "Livewire is used to build dynamic UI components without writing JavaScript."
    },
    {
      "id": "q2",
      "question": "Which Laravel feature is used for event-driven programming?",
      "options": [
        "Queues",
        "Events & Listeners",
        "Notifications",
        "Middleware"
      ],
      "correctAnswer": 1,
      "explanation": "Laravel's Events & Listeners allow event-driven programming."
    },
    {
      "id": "q3",
      "question": "Which Laravel command queues background jobs?",
      "options": [
        "`php artisan queue:listen`",
        "`php artisan queue:work`",
        "`php artisan job:process`",
        "`php artisan queue:run`"
      ],
      "correctAnswer": 1,
      "explanation": "`php artisan queue:work` processes queued jobs in Laravel."
    }
  ],
  "django_basics_1": [
    {
      "id": "q1",
      "question": "Which command is used to create a new Django project?",
      "options": [
        "`django-admin startproject project_name`",
        "`django startproject project_name`",
        "`python manage.py startproject project_name`",
        "`django create project project_name`"
      ],
      "correctAnswer": 0,
      "explanation": "The correct command is `django-admin startproject project_name`."
    },
    {
      "id": "q2",
      "question": "What is the default web server used by Django for development?",
      "options": [
        "Apache",
        "Nginx",
        "Django's built-in server",
        "Gunicorn"
      ],
      "correctAnswer": 2,
      "explanation": "Django comes with a built-in development server for testing purposes."
    }
  ],
  "django_basics_2": [
    {
      "id": "q1",
      "question": "Which Django file is used to define models?",
      "options": [
        "models.py",
        "views.py",
        "database.py",
        "urls.py"
      ],
      "correctAnswer": 0,
      "explanation": "Models in Django are defined in the `models.py` file."
    },
    {
      "id": "q2",
      "question": "Which command is used to apply database migrations?",
      "options": [
        "`python manage.py makemigrations`",
        "`python manage.py migrate`",
        "`python manage.py createsuperuser`",
        "`python manage.py dbsync`"
      ],
      "correctAnswer": 1,
      "explanation": "The `migrate` command applies pending migrations to the database."
    }
  ],
  "django_basics_3": [
    {
      "id": "q1",
      "question": "Which function is used to map URLs to views in Django?",
      "options": [
        "`url()`",
        "`path()`",
        "`route()`",
        "`redirect()`"
      ],
      "correctAnswer": 1,
      "explanation": "The `path()` function is used in `urls.py` to map views."
    },
    {
      "id": "q2",
      "question": "Which file is used to define URL patterns in a Django app?",
      "options": [
        "models.py",
        "urls.py",
        "views.py",
        "settings.py"
      ],
      "correctAnswer": 1,
      "explanation": "URL patterns for an app are defined in `urls.py`."
    }
  ],
   "django_basics_4": [
    {
      "id": "q1",
      "question": "Which directory is typically used to store Django templates?",
      "options": [
        "`/templates`",
        "`/views`",
        "`/static`",
        "`/html`"
      ],
      "correctAnswer": 0,
      "explanation": "By convention, Django templates are stored in a `/templates` directory."
    },
    {
      "id": "q2",
      "question": "Which tag is used in Django templates to include another template?",
      "options": [
        "`{% include 'file.html' %}`",
        "`{% extends 'file.html' %}`",
        "`{% import 'file.html' %}`",
        "`{% load 'file.html' %}`"
      ],
      "correctAnswer": 0,
      "explanation": "The `{% include 'file.html' %}` tag is used to include another template."
    }
  ],
  "django_inter_1": [
    {
      "id": "q1",
      "question": "Which Django module provides class-based views?",
      "options": [
        "django.views",
        "django.views.generic",
        "django.http",
        "django.core.views"
      ],
      "correctAnswer": 1,
      "explanation": "Class-based views are available in `django.views.generic`."
    },
    {
      "id": "q2",
      "question": "Which CBV is used for displaying a list of objects?",
      "options": [
        "DetailView",
        "ListView",
        "UpdateView",
        "DeleteView"
      ],
      "correctAnswer": 1,
      "explanation": "The `ListView` class is used to display a list of objects."
    }
  ],
  "django_inter_2": [
    {
      "id": "q1",
      "question": "Which Django package handles authentication?",
      "options": [
        "django.contrib.auth",
        "django.auth",
        "django.security",
        "django.contrib.security"
      ],
      "correctAnswer": 0,
      "explanation": "Authentication is handled by `django.contrib.auth`."
    },
    {
      "id": "q2",
      "question": "Which function logs in a user in Django?",
      "options": [
        "authenticate()",
        "login()",
        "signin()",
        "auth_user()"
      ],
      "correctAnswer": 1,
      "explanation": "The `login()` function is used to authenticate a user session."
    }
  ],
  "django_inter_3": [
    {
      "id": "q1",
      "question": "What is Django REST Framework (DRF) used for?",
      "options": [
        "Building real-time apps",
        "Creating RESTful APIs",
        "Handling authentication",
        "Managing templates"
      ],
      "correctAnswer": 1,
      "explanation": "Django REST Framework is used for creating RESTful APIs."
    },
    {
      "id": "q2",
      "question": "Which class is used to serialize models in Django REST Framework?",
      "options": [
        "ModelViewSet",
        "APIView",
        "ModelSerializer",
        "JsonResponse"
      ],
      "correctAnswer": 2,
      "explanation": "The `ModelSerializer` class is used for serializing models."
    }
  ],
  "django_adv_1": [
    {
      "id": "q1",
      "question": "Which Django feature is used to cache query results?",
      "options": [
        "Django Sessions",
        "Django Cache Framework",
        "Django ORM",
        "Django Middleware"
      ],
      "correctAnswer": 1,
      "explanation": "Django provides a cache framework for storing query results."
    },
    {
      "id": "q2",
      "question": "Which Django tool is used for real-time updates?",
      "options": [
        "Django Channels",
        "Django WebSockets",
        "Django Signals",
        "Django Async"
      ],
      "correctAnswer": 0,
      "explanation": "Django Channels enables real-time updates using WebSockets."
    }
  ]
  
  



  // Add quizzes for react_adv_4 and react_adv_5
};

const QuizModal: React.FC<Props> = ({ visible, onClose, lessonId, onComplete }) => {
  const { updateRewards } = useUser();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = quizzes[lessonId] || [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = () => {
    if (selectedAnswer === null) return;

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const nextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      const finalScore = (score / questions.length) * 100;
      const passed = finalScore >= PASSING_SCORE;
      
      if (!isSubmitting) {
        setIsSubmitting(true);
        try {
          if (passed) {
            await updateRewards(true, lessonId);
            Alert.alert(
              'Quiz Completed!',
              `Congratulations! You scored ${finalScore}% and passed the quiz!`,
              [
                {
                  text: 'Continue',
                  onPress: () => {
                    onComplete(finalScore);
                    onClose();
                  },
                },
              ]
            );
          } else {
            Alert.alert(
              'Quiz Failed',
              `You scored ${finalScore}%. You need ${PASSING_SCORE}% to pass and unlock the next quiz.`,
              [
                {
                  text: 'Try Again',
                  onPress: () => {
                    // Reset the quiz state
                    setCurrentQuestionIndex(0);
                    setScore(0);
                    setSelectedAnswer(null);
                    setShowExplanation(false);
                    onComplete(finalScore);
                  },
                },
                {
                  text: 'Exit',
                  onPress: () => {
                    onComplete(finalScore);
                    onClose();
                  },
                },
              ]
            );
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to save quiz results. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  if (!currentQuestion) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Icon name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.title}>Quiz</Text>
          <Text style={styles.progress}>
            {currentQuestionIndex + 1}/{questions.length}
          </Text>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.question}>{currentQuestion.question}</Text>
          
          {currentQuestion.code && (
            <CodeEditor
              code={currentQuestion.code}
              language="python"
              readOnly={true}
            />
          )}

          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                selectedAnswer === index && styles.selectedOption,
                showExplanation && index === currentQuestion.correctAnswer && styles.correctOption,
                showExplanation && selectedAnswer === index && selectedAnswer !== currentQuestion.correctAnswer && styles.wrongOption,
              ]}
              onPress={() => !showExplanation && setSelectedAnswer(index)}
              disabled={showExplanation}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}

          {showExplanation && (
            <View style={styles.explanation}>
              <Text style={styles.explanationTitle}>Explanation:</Text>
              <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {!showExplanation ? (
            <TouchableOpacity
              style={[styles.button, selectedAnswer === null && styles.buttonDisabled]}
              onPress={handleAnswer}
              disabled={selectedAnswer === null}
            >
              <Text style={styles.buttonText}>Submit Answer</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.finishButton,
                isSubmitting && styles.finishButtonDisabled
              ]}
              onPress={nextQuestion}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.finishButtonText}>
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 4,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 16,
  },
  progress: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  option: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  correctOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  wrongOption: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  optionText: {
    fontSize: 16,
  },
  explanation: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 4,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  successText: {
    color: 'green',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  failText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  finishButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  finishButtonDisabled: {
    opacity: 0.7,
  },
  finishButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default QuizModal; 
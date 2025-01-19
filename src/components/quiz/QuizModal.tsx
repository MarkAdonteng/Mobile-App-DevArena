import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CodeEditor from '../common/CodeEditor';

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
  // Add quizzes for react_adv_4 and react_adv_5
};

const QuizModal: React.FC<Props> = ({ visible, onClose, lessonId, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const questions = quizzes[lessonId] || [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = () => {
    if (selectedAnswer === null) return;

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      const finalScore = (score / questions.length) * 100;
      Alert.alert(
        'Quiz Completed!',
        `Your score: ${finalScore}%`,
        [
          {
            text: 'OK',
            onPress: () => {
              onComplete(finalScore);
              onClose();
            },
          },
        ]
      );
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
              style={styles.button}
              onPress={nextQuestion}
            >
              <Text style={styles.buttonText}>
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </Text>
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
});

export default QuizModal; 
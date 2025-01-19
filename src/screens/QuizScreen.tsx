import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { fetchUserProgress, updateUserProgress } from '../services/userProgress';
import CodeEditor from '../components/common/CodeEditor';

type ProgrammingLanguage = 'Python' | 'JavaScript' | 'Java' | 'C++' | 'React' | 'TypeScript';
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

const languageInfo: Record<ProgrammingLanguage, {
  icon: string;
  color: string;
  description: string;
}> = {
  Python: {
    icon: 'https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_python.svg',
    color: '#3776AB',
    description: 'Learn Python - a versatile language known for its simplicity and readability.',
  },
  JavaScript: {
    icon: 'https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_js.svg',
    color: '#F7DF1E',
    description: 'Master JavaScript - the language of the web and modern development.',
  },
  Java: {
    icon: 'https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_java.svg',
    color: '#007396',
    description: 'Explore Java - a powerful, object-oriented programming language.',
  },
  'C++': {
    icon: 'https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_cpp.svg',
    color: '#00599C',
    description: 'Learn C++ - a high-performance language for system programming.',
  },
  React: {
    icon: 'https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_reactjs.svg',
    color: '#61DAFB',
    description: 'Master React - a popular library for building user interfaces.',
  },
  TypeScript: {
    icon: 'https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_typescript.svg',
    color: '#3178C6',
    description: 'Learn TypeScript - a typed superset of JavaScript.',
  },
};

type Lesson = {
  id: string;
  title: string;
  content: string;
  codeExamples: string[];
  difficulty: Difficulty;
  order: number;
};

type Quiz = {
  id: string;
  questionType: 'multiple-choice' | 'coding';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  hint: string;
  difficulty: Difficulty;
  points: number;
};

const pythonLessons: Record<Difficulty, Lesson[]> = {
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
      title: 'Basic Operations',
      content: `Learn about basic operations in Python including arithmetic, comparison, and logical operations.

Key Concepts:
• Arithmetic operators (+, -, *, /, //, %, **)
• Comparison operators (==, !=, >, <, >=, <=)
• Logical operators (and, or, not)`,
      codeExamples: [`
# Arithmetic operations
x = 10
y = 3

print(x + y)    # Addition: 13
print(x - y)    # Subtraction: 7
print(x * y)    # Multiplication: 30
print(x / y)    # Division: 3.333...
print(x // y)   # Floor division: 3
print(x % y)    # Modulus: 1
print(x ** y)   # Exponentiation: 1000

# Comparison operations
print(x > y)    # True
print(x == y)   # False
print(x != y)   # True

# Logical operations
a = True
b = False
print(a and b)  # False
print(a or b)   # True
print(not a)    # False
`],
      difficulty: 'Beginner',
      order: 2,
    },
    // Add more beginner lessons
  ],
  Intermediate: [
    {
      id: 'py_inter_1',
      title: 'Functions and Modules',
      content: `Functions are reusable blocks of code that perform specific tasks. Modules help organize related functions and variables.

Key Concepts:
• Function definition and parameters
• Return values
• Default arguments
• Module import and usage`,
      codeExamples: [`
# Function definition
def greet(name, greeting="Hello"):
    """This function prints a greeting"""
    return f"{greeting}, {name}!"

# Function calls
print(greet("Alice"))           # Hello, Alice!
print(greet("Bob", "Hi"))      # Hi, Bob!

# Module import
import math

# Using module functions
radius = 5
area = math.pi * radius ** 2
print(f"Circle area: {area:.2f}")
`],
      difficulty: 'Intermediate',
      order: 1,
    },
    // Add more intermediate lessons
  ],
  Advanced: [
    {
      id: 'py_adv_1',
      title: 'Decorators and Generators',
      content: `Decorators modify function behavior. Generators create iterators efficiently.

Key Concepts:
• Decorator syntax and usage
• Function wrapping
• Generator functions
• Yield statement`,
      codeExamples: [`
# Decorator example
def timer(func):
    def wrapper(*args, **kwargs):
        import time
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"Function took {end-start:.2f} seconds")
        return result
    return wrapper

@timer
def slow_function():
    import time
    time.sleep(1)
    return "Done!"

# Generator example
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

# Using the generator
for num in fibonacci(5):
    print(num)
`],
      difficulty: 'Advanced',
      order: 1,
    },
    // Add more advanced lessons
  ],
};

const QuizScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('Beginner');
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      loadUserProgress();
    }
  }, [user]);

  const loadUserProgress = async () => {
    if (user) {
      const progress = await fetchUserProgress(user.uid);
      setUserProgress(progress);
      setLoading(false);
    }
  };

  const LanguageSelector = () => (
    <ScrollView style={styles.languageList}>
      {Object.entries(languageInfo).map(([lang, info]) => (
        <TouchableOpacity
          key={lang}
          style={[styles.languageCard, { borderColor: info.color }]}
          onPress={() => setSelectedLanguage(lang as ProgrammingLanguage)}
        >
          <View style={styles.languageHeader}>
            <Image 
              source={{ uri: info.icon }}
              style={styles.languageIcon}
            />
            <Text style={styles.languageTitle}>{lang}</Text>
          </View>
          <Text style={styles.languageDescription}>{info.description}</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${calculateProgress(lang)}%`,
                  backgroundColor: info.color,
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {calculateProgress(lang)}% Complete
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const calculateProgress = (language: string) => {
    // Calculate progress based on completed lessons
    // This is a placeholder implementation
    return 0;
  };

  const handleLessonComplete = async (lessonId: string) => {
    if (user) {
      const updatedProgress = { ...userProgress, [lessonId]: true };
      await updateUserProgress(user.uid, updatedProgress);
      setUserProgress(updatedProgress);
    }
  };

  const isLessonUnlocked = (difficulty: Difficulty, order: number): boolean => {
    if (difficulty === 'Beginner') return true;
    if (difficulty === 'Intermediate') {
      return Object.entries(userProgress)
        .filter(([id]) => id.startsWith('py_basics'))
        .every(([, completed]) => completed);
    }
    if (difficulty === 'Advanced') {
      return Object.entries(userProgress)
        .filter(([id]) => id.startsWith('py_inter'))
        .every(([, completed]) => completed);
    }
    return false;
  };

  return (
    <View style={styles.container}>
      {!selectedLanguage ? (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Programming Languages</Text>
            <Text style={styles.subtitle}>Select a language to start learning</Text>
          </View>
          <LanguageSelector />
        </>
      ) : (
        <>
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setSelectedLanguage(null)}
              >
                <Icon name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.title}>{selectedLanguage} Programming</Text>
            </View>
            <View style={styles.difficultySelector}>
              {['Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                <TouchableOpacity
                  key={diff}
                  style={[
                    styles.difficultyButton,
                    selectedDifficulty === diff && styles.selectedDifficulty,
                  ]}
                  onPress={() => setSelectedDifficulty(diff as Difficulty)}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      selectedDifficulty === diff && styles.selectedDifficultyText,
                    ]}
                  >
                    {diff}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#2196F3" />
          ) : (
            <ScrollView style={styles.lessonList}>
              {pythonLessons[selectedDifficulty].map((lesson) => (
                <TouchableOpacity
                  key={lesson.id}
                  style={[
                    styles.lessonCard,
                    !isLessonUnlocked(lesson.difficulty, lesson.order) && styles.lockedLesson,
                  ]}
                  onPress={() => {
                    if (isLessonUnlocked(lesson.difficulty, lesson.order)) {
                      setCurrentLesson(lesson);
                    } else {
                      Alert.alert(
                        'Lesson Locked',
                        'Complete previous lessons to unlock this one!'
                      );
                    }
                  }}
                  disabled={!isLessonUnlocked(lesson.difficulty, lesson.order)}
                >
                  <View style={styles.lessonHeader}>
                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                    {userProgress[lesson.id] && (
                      <Icon name="check-circle" size={24} color="#4CAF50" />
                    )}
                    {!isLessonUnlocked(lesson.difficulty, lesson.order) && (
                      <Icon name="lock" size={24} color="#999" />
                    )}
                  </View>
                  <Text style={styles.lessonDescription}>
                    {lesson.content.split('\n')[0]}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Lesson Modal */}
          <Modal
            visible={currentLesson !== null}
            animationType="slide"
            onRequestClose={() => setCurrentLesson(null)}
          >
            {currentLesson && (
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setCurrentLesson(null)}
                  >
                    <Icon name="close" size={24} color="#666" />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>{currentLesson.title}</Text>
                </View>
                <ScrollView style={styles.modalContent}>
                  <Text style={styles.lessonContent}>{currentLesson.content}</Text>
                  {currentLesson.codeExamples.map((example, index) => (
                    <CodeEditor
                      key={index}
                      code={example}
                      language="python"
                      readOnly={true}
                    />
                  ))}
                </ScrollView>
                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.startQuizButton}
                    onPress={() => {
                      handleLessonComplete(currentLesson.id);
                      setShowQuiz(true);
                    }}
                  >
                    <Text style={styles.buttonText}>Start Quiz</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Modal>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  difficultySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
  },
  difficultyButton: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  selectedDifficulty: {
    backgroundColor: '#2196F3',
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedDifficultyText: {
    color: '#fff',
  },
  lessonList: {
    flex: 1,
    padding: 16,
  },
  lessonCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  lockedLesson: {
    opacity: 0.5,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  lessonDescription: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  lessonContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  startQuizButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  languageList: {
    flex: 1,
    padding: 16,
  },
  languageCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    borderLeftWidth: 4,
  },
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  languageIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  languageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  languageDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
});

export default QuizScreen; 
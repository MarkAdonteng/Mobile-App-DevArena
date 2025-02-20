import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { QuizQuestion, ProgrammingLanguage, Difficulty } from '../../types/quiz';
import { fetchQuizQuestions } from '../../services/quizApi';

interface Props {
  language: ProgrammingLanguage;
  difficulty: Difficulty;
  onComplete: (score: number) => void;
  onBack: () => void;
}

export const QuizInterface: React.FC<Props> = ({
  language,
  difficulty,
  onComplete,
  onBack,
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    const fetchedQuestions = await fetchQuizQuestions(language, 'basics', difficulty);
    setQuestions(fetchedQuestions);
    setLoading(false);
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    if (questions[currentQuestion] && answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion === questions.length - 1) {
      onComplete(score);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No questions available for this topic.</Text>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const question = questions[currentQuestion];
  if (!question) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading question.</Text>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.progressBar}>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.question}>{question.question}</Text>
        {question.code && (
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>{question.code}</Text>
          </View>
        )}
      </View>

      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswer === index && styles.selectedOption,
              selectedAnswer !== null && index === question.correctAnswer && styles.correctOption,
              selectedAnswer === index && index !== question.correctAnswer && styles.wrongOption,
            ]}
            onPress={() => handleAnswer(index)}
            disabled={selectedAnswer !== null}
          >
            <Text style={[
              styles.optionText,
              selectedAnswer !== null && index === question.correctAnswer && styles.correctOptionText,
              selectedAnswer === index && index !== question.correctAnswer && styles.wrongOptionText,
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {showExplanation && (
        <View style={styles.explanationContainer}>
          <Text style={styles.explanationText}>{question.explanation}</Text>
        </View>
      )}

      {selectedAnswer !== null && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next Question'}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressText: {
    fontSize: 16,
    color: '#666',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  questionContainer: {
    marginBottom: 24,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  codeBlock: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 14,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
  },
  correctOption: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
  },
  wrongOption: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
  },
  optionText: {
    fontSize: 16,
  },
  correctOptionText: {
    color: '#4caf50',
  },
  wrongOptionText: {
    color: '#f44336',
  },
  explanationContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#666',
  },
  nextButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 
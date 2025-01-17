import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { QuizQuestion } from '../../types';

type QuizProps = {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
};

export const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (selectedIndex: number) => {
    const question = questions[currentQuestion];
    const isCorrect = selectedIndex === question.correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
      Alert.alert('Correct!', question.explanation);
    } else {
      Alert.alert('Incorrect', question.explanation);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(score);
    }
  };

  const question = questions[currentQuestion];

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        Question {currentQuestion + 1} of {questions.length}
      </Text>
      <Text style={styles.question}>{question.question}</Text>
      <View style={styles.options}>
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => handleAnswer(index)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.score}>Score: {score}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  progress: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  options: {
    gap: 10,
  },
  optionButton: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 16,
    color: '#2196F3',
  },
  score: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 
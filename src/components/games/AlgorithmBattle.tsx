import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Animated,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Algorithm = {
  id: number;
  name: string;
  description: string;
  template: string;
  testCases: { input: any; output: any }[];
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
};

const AlgorithmBattle = () => {
  const [currentAlgorithm, setCurrentAlgorithm] = useState<Algorithm | null>(null);
  const [userCode, setUserCode] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  const algorithms: Algorithm[] = [
    {
      id: 1,
      name: 'Array Sum',
      description: 'Write a function that returns the sum of all numbers in an array.',
      template: `function arraySum(numbers) {
  // Your code here
}`,
      testCases: [
        { input: [1, 2, 3, 4, 5], output: 15 },
        { input: [-1, 0, 1], output: 0 },
        { input: [10, 20, 30], output: 60 },
      ],
      timeLimit: 60,
      difficulty: 'easy',
      points: 100,
    },
    {
      id: 2,
      name: 'Find Maximum',
      description: 'Write a function that finds the largest number in an array.',
      template: `function findMax(numbers) {
  // Your code here
}`,
      testCases: [
        { input: [1, 5, 3, 9, 2], output: 9 },
        { input: [-1, -5, -2], output: -1 },
        { input: [100, 50, 75], output: 100 },
      ],
      timeLimit: 660,
      difficulty: 'easy',
      points: 100,
    },
    // Add more algorithms here
  ];

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isPlaying) {
      handleTimeUp();
    }
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    const randomAlgorithm = algorithms[Math.floor(Math.random() * algorithms.length)];
    setCurrentAlgorithm(randomAlgorithm);
    setTimeLeft(randomAlgorithm.timeLimit);
    setUserCode(randomAlgorithm.template);
    setIsPlaying(true);
    setGameStarted(true);
  };

  const handleTimeUp = () => {
    setIsPlaying(false);
    Alert.alert('Time\'s Up!', 'Would you like to try again?', [
      {
        text: 'Try Again',
        onPress: startGame,
      },
      {
        text: 'End Game',
        onPress: () => setGameStarted(false),
        style: 'cancel',
      },
    ]);
  };

  const handleSubmit = () => {
    try {
      const userFunction = new Function('input', userCode);
      const allTestsPassed = currentAlgorithm?.testCases.every(
        test => userFunction(test.input) === test.output
      );

      if (allTestsPassed) {
        const timeBonus = Math.floor(timeLeft / 10);
        const points = (currentAlgorithm?.points || 0) + timeBonus;
        setScore(prev => prev + points);
        Alert.alert(
          'Success!',
          `All test cases passed!\nPoints earned: ${points}`,
          [
            {
              text: 'Next Challenge',
              onPress: startGame,
            },
          ]
        );
      } else {
        Alert.alert('Try Again', 'Some test cases failed. Check your code and try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'There\'s an error in your code. Check the syntax and try again.');
    }
  };

  const Tutorial = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showTutorial}
      onRequestClose={() => setShowTutorial(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.tutorialContainer}>
          <Text style={styles.tutorialTitle}>Algorithm Battle</Text>
          <ScrollView style={styles.tutorialContent}>
            <Text style={styles.tutorialText}>
              Welcome to Algorithm Battle! Test your coding skills by solving algorithmic challenges against the clock.
            </Text>
            <Text style={styles.tutorialSubtitle}>How to Play:</Text>
            <Text style={styles.tutorialText}>
              • You'll be given an algorithm challenge{'\n'}
              • Write code to solve the problem{'\n'}
              • Submit before time runs out{'\n'}
              • Pass all test cases to win points{'\n'}
              • Get bonus points for finishing fast
            </Text>
          </ScrollView>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => {
              setShowTutorial(false);
              startGame();
            }}
          >
            <Text style={styles.buttonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {!gameStarted ? (
        <View style={styles.welcomeScreen}>
          <Text style={styles.title}>Algorithm Battle</Text>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.buttonText}>Start Game</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.tutorialButton}
            onPress={() => setShowTutorial(true)}
          >
            <Text style={styles.buttonText}>How to Play</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.score}>Score: {score}</Text>
            <Text style={styles.timer}>Time: {timeLeft}s</Text>
          </View>

          <ScrollView style={styles.content}>
            {currentAlgorithm && (
              <View style={styles.challengeCard}>
                <Text style={styles.challengeTitle}>{currentAlgorithm.name}</Text>
                <Text style={styles.challengeDescription}>
                  {currentAlgorithm.description}
                </Text>
                <TextInput
                  style={styles.codeInput}
                  multiline
                  value={userCode}
                  onChangeText={setUserCode}
                />
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                >
                  <Text style={styles.buttonText}>Submit Solution</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </>
      )}
      <Tutorial />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  welcomeScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 4,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  challengeCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 4,
  },
  challengeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
  },
  codeInput: {
    fontFamily: 'monospace',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    fontSize: 14,
    minHeight: 200,
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  tutorialButton: {
    backgroundColor: '#FF9800',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tutorialContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  tutorialTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  tutorialContent: {
    marginBottom: 20,
  },
  tutorialText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  tutorialSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default AlgorithmBattle; 
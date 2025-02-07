import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

const choices = ['rock', 'paper', 'scissors'];

const RockPaperScissors = () => {
  const [userChoice, setUserChoice] = useState<string | null>(null);
  const [computerChoice, setComputerChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scores, setScores] = useState({
    player: 0,
    computer: 0,
    ties: 0
  });

  const resetGame = () => {
    setUserChoice(null);
    setComputerChoice(null);
    setResult('');
    setIsPlaying(false);
    setIsLoading(false);
  };

  const resetScores = () => {
    setScores({
      player: 0,
      computer: 0,
      ties: 0
    });
  };

  const determineWinner = (user: string, computer: string) => {
    if (user === computer) {
      setScores(prev => ({ ...prev, ties: prev.ties + 1 }));
      return "It's a tie!";
    }
    if (
      (user === 'rock' && computer === 'scissors') ||
      (user === 'paper' && computer === 'rock') ||
      (user === 'scissors' && computer === 'paper')
    ) {
      setScores(prev => ({ ...prev, player: prev.player + 1 }));
      return 'You win!';
    }
    setScores(prev => ({ ...prev, computer: prev.computer + 1 }));
    return 'Computer wins!';
  };

  const handleChoice = async (choice: string) => {
    setIsLoading(true);
    setIsPlaying(true);
    setUserChoice(choice);

    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1000));

    const computerSelection = choices[Math.floor(Math.random() * choices.length)];
    setComputerChoice(computerSelection);
    setResult(determineWinner(choice, computerSelection));
    setIsLoading(false);
  };

  const getChoiceImage = (choice: string) => {
    switch (choice) {
      case 'rock':
        return '✊';
      case 'paper':
        return '✋';
      case 'scissors':
        return '✌️';
      default:
        return '❓';
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a237e', '#000']}
        style={styles.header}
      >
        <Text style={styles.title}>Rock Paper Scissors</Text>
        <Text style={styles.subtitle}>Choose your move!</Text>
      </LinearGradient>

      {/* Score Board */}
      <View style={styles.scoreBoard}>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>You</Text>
          <Text style={styles.scoreNumber}>{scores.player}</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>Ties</Text>
          <Text style={styles.scoreNumber}>{scores.ties}</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>Computer</Text>
          <Text style={styles.scoreNumber}>{scores.computer}</Text>
        </View>
      </View>

      <View style={styles.gameArea}>
        {/* Game Status Display */}
        <View style={styles.statusContainer}>
          <View style={styles.playerChoice}>
            <Text style={styles.choiceLabel}>You</Text>
            <Text style={styles.choiceEmoji}>
              {userChoice ? getChoiceImage(userChoice) : '❓'}
            </Text>
          </View>

          <Text style={styles.vs}>VS</Text>

          <View style={styles.playerChoice}>
            <Text style={styles.choiceLabel}>Computer</Text>
            <Text style={styles.choiceEmoji}>
              {isLoading ? (
                <ActivityIndicator color="#1a237e" size="large" />
              ) : (
                computerChoice ? getChoiceImage(computerChoice) : '❓'
              )}
            </Text>
          </View>
        </View>

        {/* Result Display */}
        {result && (
          <Text style={styles.result}>{result}</Text>
        )}

        {/* Choice Buttons */}
        {!isPlaying ? (
          <View style={styles.choices}>
            {choices.map((choice) => (
              <TouchableOpacity
                key={choice}
                style={styles.choiceButton}
                onPress={() => handleChoice(choice)}
              >
                <Text style={styles.choiceButtonEmoji}>{getChoiceImage(choice)}</Text>
                <Text style={styles.choiceButtonText}>{choice.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.playAgainButton}
              onPress={resetGame}
            >
              <Text style={styles.playAgainText}>Play Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.resetScoresButton}
              onPress={resetScores}
            >
              <Text style={styles.resetScoresText}>Reset Scores</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  gameArea: {
    flex: 1,
    padding: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 30,
  },
  playerChoice: {
    alignItems: 'center',
  },
  choiceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  choiceEmoji: {
    fontSize: 48,
  },
  vs: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
  },
  result: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#1a237e',
  },
  choices: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  choiceButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  choiceButtonEmoji: {
    fontSize: 32,
    marginBottom: 5,
  },
  choiceButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  scoreBoard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  playAgainButton: {
    backgroundColor: '#1a237e',
    padding: 15,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  playAgainText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetScoresButton: {
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
  },
  resetScoresText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default RockPaperScissors; 
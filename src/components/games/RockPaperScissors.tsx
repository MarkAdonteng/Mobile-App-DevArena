import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Choice = 'rock' | 'paper' | 'scissors' | null;
type GameState = 'playing' | 'win' | 'lose' | 'draw';

export const RockPaperScissors = () => {
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [aiChoice, setAiChoice] = useState<Choice>(null);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [pattern, setPattern] = useState<number[]>([]);

  const choices: Choice[] = ['rock', 'paper', 'scissors'];

  const getIcon = (choice: Choice) => {
    switch (choice) {
      case 'rock':
        return 'back-hand';
      case 'paper':
        return 'front-hand';
      case 'scissors':
        return 'content-cut';
      default:
        return 'help';
    }
  };

  const aiPredict = () => {
    if (pattern.length < 1) {
      return choices[Math.floor(Math.random() * 3)];
    }

    const net = new brain.recurrent.LSTMTimeStep();
    net.train([pattern], { iterations: 100, log: false });
    const predicted = Math.round(net.run(pattern));
    const aiChoice = choices[(predicted % 3)];
    
    return aiChoice;
  };

  const checkWin = (player: Choice, ai: Choice) => {
    if (!player || !ai) return 'playing';
    if (player === ai) return 'draw';
    if (
      (player === 'rock' && ai === 'scissors') ||
      (player === 'paper' && ai === 'rock') ||
      (player === 'scissors' && ai === 'paper')
    ) {
      setPlayerScore(prev => prev + 1);
      return 'win';
    }
    setAiScore(prev => prev + 1);
    return 'lose';
  };

  const handleChoice = (choice: Choice) => {
    if (choice === null) return;
    
    const aiMove = aiPredict();
    setPlayerChoice(choice);
    setAiChoice(aiMove);
    
    const result = checkWin(choice, aiMove);
    setGameState(result);
    
    // Update pattern for AI learning
    setPattern(prev => {
      const choiceNum = choices.indexOf(choice) + 1;
      if (prev.length >= 10) {
        const newPattern = [...prev.slice(1), choiceNum];
        return newPattern;
      }
      return [...prev, choiceNum];
    });
  };

  const resetRound = () => {
    setPlayerChoice(null);
    setAiChoice(null);
    setGameState('playing');
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoreBoard}>
        <Text style={styles.scoreText}>Player: {playerScore}</Text>
        <Text style={styles.scoreText}>AI: {aiScore}</Text>
      </View>

      <View style={styles.gameArea}>
        <View style={styles.choiceArea}>
          <Text style={styles.playerLabel}>Player</Text>
          <View style={[styles.choice, playerChoice && styles.activeChoice]}>
            <Icon 
              name={getIcon(playerChoice)} 
              size={60} 
              color={gameState === 'win' ? '#4CAF50' : gameState === 'lose' ? '#f44336' : '#2196F3'} 
            />
          </View>
        </View>

        <Text style={styles.vs}>VS</Text>

        <View style={styles.choiceArea}>
          <Text style={styles.playerLabel}>AI</Text>
          <View style={[styles.choice, aiChoice && styles.activeChoice]}>
            <Icon 
              name={getIcon(aiChoice)} 
              size={60} 
              color={gameState === 'lose' ? '#4CAF50' : gameState === 'win' ? '#f44336' : '#2196F3'} 
            />
          </View>
        </View>
      </View>

      <View style={styles.controls}>
        {gameState === 'playing' ? (
          choices.map((choice) => (
            <TouchableOpacity
              key={choice}
              style={styles.button}
              onPress={() => handleChoice(choice)}
            >
              <Icon name={getIcon(choice)} size={30} color="#fff" />
              <Text style={styles.buttonText}>{choice.toUpperCase()}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={resetRound}
          >
            <Icon name="refresh" size={30} color="#fff" />
            <Text style={styles.buttonText}>PLAY AGAIN</Text>
          </TouchableOpacity>
        )}
      </View>

      {gameState !== 'playing' && (
        <Text style={[
          styles.result,
          gameState === 'win' && styles.win,
          gameState === 'lose' && styles.lose,
        ]}>
          {gameState === 'win' ? 'You Win!' : gameState === 'lose' ? 'AI Wins!' : 'Draw!'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  scoreBoard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  gameArea: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 40,
  },
  choiceArea: {
    alignItems: 'center',
  },
  playerLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  choice: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  activeChoice: {
    borderWidth: 3,
    borderColor: '#2196F3',
  },
  vs: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 10,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 120,
    justifyContent: 'center',
  },
  resetButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  result: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    color: '#2196F3',
  },
  win: {
    color: '#4CAF50',
  },
  lose: {
    color: '#f44336',
  },
});

export default RockPaperScissors; 
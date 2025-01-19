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

const NUMBERS_COUNT = 8;
const BAR_WIDTH = (Dimensions.get('window').width - 64) / (NUMBERS_COUNT * 2); // Split screen for player and AI

type ArrayBar = {
  value: number;
  position: Animated.Value;
  height: number;
};

const SortingRace = () => {
  const [playerArray, setPlayerArray] = useState<ArrayBar[]>([]);
  const [aiArray, setAiArray] = useState<ArrayBar[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerMoves, setPlayerMoves] = useState(0);
  const [aiMoves, setAiMoves] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [winner, setWinner] = useState<'player' | 'ai' | null>(null);

  useEffect(() => {
    initializeArrays();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        if (timeLeft % 2 === 0) aiMove();
      }, 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const initializeArrays = () => {
    const numbers = Array.from({ length: NUMBERS_COUNT }, () => 
      Math.floor(Math.random() * 100) + 1
    );
    
    const playerBars = numbers.map((value, i) => ({
      value,
      position: new Animated.Value(i * BAR_WIDTH),
      height: value * 2 + 50,
    }));

    const aiBars = [...playerBars].map((bar, i) => ({
      ...bar,
      position: new Animated.Value(i * BAR_WIDTH),
    }));

    setPlayerArray(playerBars);
    setAiArray(aiBars);
    setPlayerMoves(0);
    setAiMoves(0);
    setTimeLeft(60);
    setWinner(null);
  };

  const swap = (array: ArrayBar[], index1: number, index2: number, isPlayer: boolean) => {
    if (index1 === index2) return array;
    
    const newArray = [...array];
    const position1 = newArray[index1].position;
    const position2 = newArray[index2].position;

    Animated.parallel([
      Animated.timing(position1, {
        toValue: index2 * BAR_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(position2, {
        toValue: index1 * BAR_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const temp = newArray[index1];
    newArray[index1] = newArray[index2];
    newArray[index2] = temp;

    if (isPlayer) {
      setPlayerMoves(prev => prev + 1);
    } else {
      setAiMoves(prev => prev + 1);
    }

    return newArray;
  };

  const aiMove = () => {
    if (!isPlaying) return;
    
    // Simple bubble sort step
    for (let i = 0; i < aiArray.length - 1; i++) {
      if (aiArray[i].value > aiArray[i + 1].value) {
        const newArray = swap(aiArray, i, i + 1, false);
        setAiArray(newArray);
        break;
      }
    }
  };

  const handleBarPress = (index: number) => {
    if (!isPlaying || winner) return;

    if (selectedIndices.length === 0) {
      setSelectedIndices([index]);
    } else if (selectedIndices.length === 1) {
      const firstIndex = selectedIndices[0];
      setSelectedIndices([]);
      const newArray = swap(playerArray, firstIndex, index, true);
      setPlayerArray(newArray);
    }
  };

  const startGame = () => {
    initializeArrays();
    setIsPlaying(true);
  };

  const endGame = () => {
    setIsPlaying(false);
    const playerSorted = isSorted(playerArray);
    const aiSorted = isSorted(aiArray);
    
    if (playerSorted && !aiSorted) {
      setWinner('player');
    } else if (!playerSorted && aiSorted) {
      setWinner('ai');
    } else if (playerSorted && aiSorted) {
      setWinner(playerMoves <= aiMoves ? 'player' : 'ai');
    }
  };

  const isSorted = (array: ArrayBar[]) => {
    return array.every((bar, i) => i === 0 || array[i - 1].value <= bar.value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>Player Moves: {playerMoves}</Text>
          <Text style={styles.score}>AI Moves: {aiMoves}</Text>
        </View>
        <Text style={styles.timer}>Time: {timeLeft}s</Text>
      </View>

      <View style={styles.gameArea}>
        <View style={styles.arrayContainer}>
          <Text style={styles.playerLabel}>Player</Text>
          <View style={styles.barsContainer}>
            {playerArray.map((bar, index) => (
              <Animated.View
                key={`player-${index}`}
                style={[
                  styles.bar,
                  {
                    height: bar.height,
                    transform: [{ translateX: bar.position }],
                    backgroundColor: selectedIndices.includes(index) ? '#FFC107' : '#2196F3',
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.barTouchable}
                  onPress={() => handleBarPress(index)}
                >
                  <Text style={styles.barText}>{bar.value}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        <View style={styles.arrayContainer}>
          <Text style={styles.playerLabel}>AI</Text>
          <View style={styles.barsContainer}>
            {aiArray.map((bar, index) => (
              <Animated.View
                key={`ai-${index}`}
                style={[
                  styles.bar,
                  {
                    height: bar.height,
                    transform: [{ translateX: bar.position }],
                    backgroundColor: '#F44336',
                  },
                ]}
              >
                <Text style={styles.barText}>{bar.value}</Text>
              </Animated.View>
            ))}
          </View>
        </View>
      </View>

      {(!isPlaying || winner) && (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>
            {winner ? `${winner === 'player' ? 'You Win!' : 'AI Wins!'}` : 'Ready to Race?'}
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Icon name="play-arrow" size={24} color="#fff" />
            <Text style={styles.buttonText}>
              {winner ? 'Play Again' : 'Start Game'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreContainer: {
    flex: 1,
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F44336',
  },
  gameArea: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  arrayContainer: {
    flex: 1,
    marginVertical: 10,
  },
  playerLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    position: 'relative',
  },
  bar: {
    width: BAR_WIDTH - 4,
    position: 'absolute',
    bottom: 0,
    borderRadius: 4,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default SortingRace; 
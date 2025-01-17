import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { GameScreenNavigationProp } from '../../types/navigation';

type Props = {
  navigation: GameScreenNavigationProp;
};

const AlgorithmBattle: React.FC<Props> = ({ navigation }) => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [sorted, setSorted] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const newNumbers = Array.from({ length: 6 }, () => 
      Math.floor(Math.random() * 100)
    );
    setNumbers(newNumbers);
    setSorted(false);
    setMoves(0);
  };

  const swapNumbers = (index1: number, index2: number) => {
    const newNumbers = [...numbers];
    [newNumbers[index1], newNumbers[index2]] = [newNumbers[index2], newNumbers[index1]];
    setNumbers(newNumbers);
    setMoves(moves + 1);
    
    checkIfSorted(newNumbers);
  };

  const checkIfSorted = (nums: number[]) => {
    const isSorted = nums.every((num, index) => 
      index === 0 || nums[index - 1] <= num
    );
    
    if (isSorted) {
      setSorted(true);
      Alert.alert(
        'Congratulations!',
        `You sorted the array in ${moves + 1} moves!`,
        [
          {
            text: 'Play Again',
            onPress: initializeGame,
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sort the Numbers</Text>
      <Text style={styles.moves}>Moves: {moves}</Text>
      <View style={styles.numbersContainer}>
        {numbers.map((number, index) => (
          <TouchableOpacity
            key={index}
            style={styles.numberButton}
            onPress={() => {
              if (index < numbers.length - 1) {
                swapNumbers(index, index + 1);
              }
            }}
          >
            <Text style={styles.numberText}>{number}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={styles.resetButton}
        onPress={initializeGame}
      >
        <Text style={styles.resetText}>Reset Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  moves: {
    fontSize: 18,
    marginBottom: 20,
  },
  numbersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 30,
  },
  numberButton: {
    width: 60,
    height: 60,
    backgroundColor: '#2196F3',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AlgorithmBattle; 
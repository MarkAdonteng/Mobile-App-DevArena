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
const BAR_WIDTH = (Dimensions.get('window').width - 64) / NUMBERS_COUNT;

type ArrayBar = {
  value: number;
  position: Animated.Value;
  height: number;
};

const SortingChallenge = () => {
  const [numbers, setNumbers] = useState<ArrayBar[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [moves, setMoves] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  useEffect(() => {
    initializeArray();
  }, []);

  const initializeArray = () => {
    const newNumbers: ArrayBar[] = Array.from({ length: NUMBERS_COUNT }, (_, i) => ({
      value: Math.floor(Math.random() * 100) + 1,
      position: new Animated.Value(i * BAR_WIDTH),
      height: Math.floor(Math.random() * 200) + 50,
    }));
    setNumbers(newNumbers);
    setMoves(0);
  };

  const swap = (index1: number, index2: number) => {
    if (index1 === index2) return;
    
    const newNumbers = [...numbers];
    const position1 = newNumbers[index1].position;
    const position2 = newNumbers[index2].position;

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

    const temp = newNumbers[index1];
    newNumbers[index1] = newNumbers[index2];
    newNumbers[index2] = temp;
    setNumbers(newNumbers);
    setMoves(moves + 1);
  };

  const handleBarPress = (index: number) => {
    if (isSorting) return;

    if (selectedIndices.length === 0) {
      setSelectedIndices([index]);
    } else if (selectedIndices.length === 1) {
      const firstIndex = selectedIndices[0];
      setSelectedIndices([]);
      swap(firstIndex, index);
    }
  };

  const checkSolution = () => {
    setIsSorting(true);
    const isSorted = numbers.every((num, i) => 
      i === 0 || numbers[i - 1].value <= num.value
    );

    if (isSorted) {
      // Celebration animation
      numbers.forEach((num, i) => {
        Animated.sequence([
          Animated.spring(num.position, {
            toValue: i * BAR_WIDTH,
            useNativeDriver: true,
          }),
          Animated.spring(num.position, {
            toValue: i * BAR_WIDTH + 10,
            useNativeDriver: true,
          }),
          Animated.spring(num.position, {
            toValue: i * BAR_WIDTH,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
    setTimeout(() => setIsSorting(false), 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sorting Challenge</Text>
        <Text style={styles.moves}>Moves: {moves}</Text>
      </View>

      <View style={styles.barsContainer}>
        {numbers.map((num, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleBarPress(index)}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.bar,
                {
                  height: num.height,
                  transform: [{ translateX: num.position }],
                  backgroundColor: selectedIndices.includes(index) 
                    ? '#2196F3' 
                    : '#4CAF50',
                },
              ]}
            >
              <Text style={styles.barText}>{num.value}</Text>
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={initializeArray}
          disabled={isSorting}
        >
          <Icon name="refresh" size={24} color="#fff" />
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.checkButton]} 
          onPress={checkSolution}
          disabled={isSorting}
        >
          <Icon name="check" size={24} color="#fff" />
          <Text style={styles.buttonText}>Check</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  moves: {
    fontSize: 18,
    color: '#666',
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 24,
  },
  bar: {
    width: BAR_WIDTH - 4,
    marginHorizontal: 2,
    borderRadius: 4,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 4,
  },
  barText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default SortingChallenge; 
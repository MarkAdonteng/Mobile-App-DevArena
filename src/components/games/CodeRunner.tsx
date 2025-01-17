import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { GameScreenNavigationProp } from '../../types/navigation';

type Props = {
  navigation: GameScreenNavigationProp;
};

const CodeRunner: React.FC<Props> = ({ navigation }) => {
  const [position] = useState(new Animated.ValueXY({ x: 0, y: 0 }));
  const [score, setScore] = useState(0);

  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    const distance = 50;
    const duration = 200;

    const moveConfig = {
      up: { x: 0, y: -distance },
      down: { x: 0, y: distance },
      left: { x: -distance, y: 0 },
      right: { x: distance, y: 0 },
    };

    Animated.timing(position, {
      toValue: moveConfig[direction],
      duration,
      useNativeDriver: true,
    }).start();

    setScore(prev => prev + 10);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Score: {score}</Text>
      <View style={styles.gameArea}>
        <Animated.View
          style={[
            styles.player,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
              ],
            },
          ]}
        />
      </View>
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => movePlayer('up')}
        >
          <Text style={styles.controlText}>↑</Text>
        </TouchableOpacity>
        <View style={styles.horizontalControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => movePlayer('left')}
          >
            <Text style={styles.controlText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => movePlayer('right')}
          >
            <Text style={styles.controlText}>→</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => movePlayer('down')}
        >
          <Text style={styles.controlText}>↓</Text>
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
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  gameArea: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    position: 'relative',
  },
  player: {
    width: 30,
    height: 30,
    backgroundColor: '#2196F3',
    borderRadius: 15,
    position: 'absolute',
  },
  controls: {
    alignItems: 'center',
    gap: 10,
  },
  horizontalControls: {
    flexDirection: 'row',
    gap: 40,
  },
  controlButton: {
    width: 60,
    height: 60,
    backgroundColor: '#2196F3',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default CodeRunner; 
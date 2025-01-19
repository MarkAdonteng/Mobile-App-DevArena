import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Position = {
  x: number;
  y: number;
};

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

type Challenge = {
  id: number;
  title: string;
  description: string;
  template: string;
  solution: string;
  hint: string;
  concept: 'loops' | 'conditions' | 'functions' | 'arrays';
};

const GRID_SIZE = 20;
const CELL_SIZE = Math.floor(Dimensions.get('window').width / GRID_SIZE);

const CodeSnake = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 5, y: 5 }]);
  const [food, setFood] = useState<Position>({ x: 10, y: 10 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [showChallenge, setShowChallenge] = useState(true);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [userCode, setUserCode] = useState('');
  const [showTutorial, setShowTutorial] = useState(true);
  const gameLoop = useRef<NodeJS.Timeout>();

  const challenges: Challenge[] = [
    {
      id: 1,
      title: 'Basic Movement',
      description: 'Write a function that moves the snake one step in its current direction.',
      template: `function moveSnake(snake, direction) {
  // Your code here
  // Return the new head position { x: number, y: number }
}`,
      solution: `function moveSnake(snake, direction) {
  const head = snake[0];
  switch(direction) {
    case 'UP': return { x: head.x, y: head.y - 1 };
    case 'DOWN': return { x: head.x, y: head.y + 1 };
    case 'LEFT': return { x: head.x - 1, y: head.y };
    case 'RIGHT': return { x: head.x + 1, y: head.y };
  }
}`,
      hint: 'Use a switch statement to handle different directions and update the x/y coordinates accordingly.',
      concept: 'conditions',
    },
    {
      id: 2,
      title: 'Food Detection',
      description: 'Write a function that checks if the snake can eat the food.',
      template: `function canEatFood(snake, food) {
  // Your code here
  // Return true if snake head is at food position
}`,
      solution: `function canEatFood(snake, food) {
  const head = snake[0];
  return head.x === food.x && head.y === food.y;
}`,
      hint: 'Compare the x and y coordinates of the snake\'s head with the food position.',
      concept: 'conditions',
    },
    // Add more challenges for different concepts
  ];

  useEffect(() => {
    setCurrentChallenge(challenges[0]);
    return () => {
      if (gameLoop.current) clearInterval(gameLoop.current);
    };
  }, []);

  const startGame = () => {
    if (gameLoop.current) clearInterval(gameLoop.current);
    gameLoop.current = setInterval(gameStep, 200);
    setIsPlaying(true);
  };

  const pauseGame = () => {
    if (gameLoop.current) clearInterval(gameLoop.current);
    setIsPlaying(false);
  };

  const gameStep = () => {
    try {
      // Execute user's movement code
      const moveSnakeFunction = new Function('snake', 'direction', userCode);
      const newHead = moveSnakeFunction(snake, direction);

      if (isCollision(newHead)) {
        handleGameOver();
        return;
      }

      const newSnake = [newHead, ...snake];
      
      // Execute user's food detection code
      const canEatFoodFunction = new Function('snake', 'food', userCode);
      const shouldEatFood = canEatFoodFunction([newHead, ...snake], food);

      if (shouldEatFood) {
        setScore(prev => prev + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    } catch (error) {
      pauseGame();
      Alert.alert('Code Error', 'There\'s an error in your code. Check the syntax and try again.');
    }
  };

  const isCollision = (head: Position): boolean => {
    // Check wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    // Check self collision
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
  };

  const generateFood = (): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  };

  const handleGameOver = () => {
    pauseGame();
    Alert.alert(
      'Game Over!',
      `Score: ${score}\nLevel: ${level}`,
      [
        {
          text: 'Try Again',
          onPress: () => {
            setSnake([{ x: 5, y: 5 }]);
            setDirection('RIGHT');
            setScore(0);
            setShowChallenge(true);
          },
        },
      ]
    );
  };

  const handleCodeSubmit = () => {
    try {
      // Test the code with sample inputs
      const testFunction = new Function('snake', 'direction', userCode);
      testFunction([{ x: 0, y: 0 }], 'RIGHT');
      
      setShowChallenge(false);
      startGame();
    } catch (error) {
      Alert.alert('Code Error', 'There\'s an error in your code. Check the syntax and try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={showChallenge}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowChallenge(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.challengeContainer}>
            <Text style={styles.challengeTitle}>{currentChallenge?.title}</Text>
            <Text style={styles.challengeDescription}>
              {currentChallenge?.description}
            </Text>
            <TextInput
              style={styles.codeInput}
              multiline
              value={userCode}
              onChangeText={setUserCode}
              placeholder={currentChallenge?.template}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.hintButton}
                onPress={() => Alert.alert('Hint', currentChallenge?.hint)}
              >
                <Text style={styles.buttonText}>Hint</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleCodeSubmit}
              >
                <Text style={styles.buttonText}>Run Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.levelText}>Level: {level}</Text>
      </View>

      <View style={styles.gameBoard}>
        {snake.map((segment, index) => (
          <View
            key={index}
            style={[
              styles.segment,
              {
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                backgroundColor: index === 0 ? '#4CAF50' : '#81C784',
              },
            ]}
          />
        ))}
        <View
          style={[
            styles.food,
            {
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
            },
          ]}
        />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setDirection('UP')}
        >
          <Icon name="arrow-upward" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.horizontalControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setDirection('LEFT')}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setDirection('RIGHT')}
          >
            <Icon name="arrow-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setDirection('DOWN')}
        >
          <Icon name="arrow-downward" size={24} color="#fff" />
        </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  levelText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  gameBoard: {
    width: GRID_SIZE * CELL_SIZE,
    height: GRID_SIZE * CELL_SIZE,
    borderWidth: 2,
    borderColor: '#ccc',
    alignSelf: 'center',
    position: 'relative',
  },
  segment: {
    width: CELL_SIZE - 2,
    height: CELL_SIZE - 2,
    borderRadius: CELL_SIZE / 2,
    position: 'absolute',
  },
  food: {
    width: CELL_SIZE - 2,
    height: CELL_SIZE - 2,
    borderRadius: CELL_SIZE / 2,
    backgroundColor: '#F44336',
    position: 'absolute',
  },
  controls: {
    padding: 16,
    alignItems: 'center',
  },
  horizontalControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginVertical: 8,
  },
  controlButton: {
    width: 60,
    height: 60,
    backgroundColor: '#2196F3',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  challengeContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
  },
  challengeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: 16,
    marginBottom: 16,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hintButton: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    flex: 2,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CodeSnake; 
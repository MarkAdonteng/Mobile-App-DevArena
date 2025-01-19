import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Position = {
  row: number;
  col: number;
};

type Word = {
  word: string;
  found: boolean;
  positions: Position[];
};

type Cell = {
  letter: string;
  selected: boolean;
  highlighted: boolean;
};

const GRID_SIZE = 10;
const WORDS = [
  'ALGORITHM',
  'ARRAY',
  'BINARY',
  'CODE',
  'DATA',
  'FUNCTION',
  'LOOP',
  'STACK',
  'STRING',
  'VARIABLE',
];

const WordSearch = () => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [selection, setSelection] = useState<Position[]>([]);
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [timer, setTimer] = useState(300); // 5 minutes
  const [showTutorial, setShowTutorial] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (timer > 0 && !gameOver) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
        if (timer % 15 === 0) { // AI makes a move every 15 seconds
          aiMove();
        }
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      endGame();
    }
  }, [timer, gameOver]);

  const initializeGame = () => {
    const { newGrid, placedWords } = generateGrid();
    setGrid(newGrid);
    setWords(placedWords);
    setScore({ player: 0, ai: 0 });
    setTimer(300);
    setGameOver(false);
  };

  const generateGrid = () => {
    // Initialize empty grid
    const newGrid: Cell[][] = Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(null).map(() => ({
        letter: '',
        selected: false,
        highlighted: false,
      }))
    );

    const placedWords: Word[] = [];
    const directions = [
      [0, 1],   // right
      [1, 0],   // down
      [1, 1],   // diagonal right-down
      [-1, 1],  // diagonal right-up
    ];

    // Place words
    for (const word of WORDS) {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 100) {
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const startRow = Math.floor(Math.random() * GRID_SIZE);
        const startCol = Math.floor(Math.random() * GRID_SIZE);

        if (canPlaceWord(word, startRow, startCol, direction, newGrid)) {
          const positions: Position[] = [];
          for (let i = 0; i < word.length; i++) {
            const row = startRow + i * direction[0];
            const col = startCol + i * direction[1];
            newGrid[row][col].letter = word[i];
            positions.push({ row, col });
          }
          placedWords.push({ word, found: false, positions });
          placed = true;
        }
        attempts++;
      }
    }

    // Fill empty cells with random letters
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (!newGrid[i][j].letter) {
          newGrid[i][j].letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    return { newGrid, placedWords };
  };

  const canPlaceWord = (
    word: string,
    startRow: number,
    startCol: number,
    direction: number[],
    grid: Cell[][]
  ): boolean => {
    if (
      startRow + word.length * direction[0] > GRID_SIZE ||
      startRow + word.length * direction[0] < 0 ||
      startCol + word.length * direction[1] > GRID_SIZE ||
      startCol + word.length * direction[1] < 0
    ) {
      return false;
    }

    for (let i = 0; i < word.length; i++) {
      const row = startRow + i * direction[0];
      const col = startCol + i * direction[1];
      if (grid[row][col].letter && grid[row][col].letter !== word[i]) {
        return false;
      }
    }

    return true;
  };

  const handleCellPress = (row: number, col: number) => {
    if (gameOver) return;

    const newGrid = [...grid];
    const newSelection = [...selection];

    if (selection.length === 0) {
      newSelection.push({ row, col });
      newGrid[row][col].selected = true;
    } else {
      const start = selection[0];
      const direction = getDirection(start, { row, col });
      
      if (direction) {
        const selectedPositions = getPositionsInLine(start, { row, col }, direction);
        const selectedWord = selectedPositions
          .map(pos => grid[pos.row][pos.col].letter)
          .join('');

        const wordMatch = words.find(w => 
          !w.found && (w.word === selectedWord || w.word === selectedWord.split('').reverse().join(''))
        );

        if (wordMatch) {
          wordMatch.found = true;
          setScore(prev => ({ ...prev, player: prev.player + 1 }));
          selectedPositions.forEach(pos => {
            newGrid[pos.row][pos.col].highlighted = true;
          });
          checkGameEnd();
        }
      }

      // Clear selection
      selection.forEach(pos => {
        newGrid[pos.row][pos.col].selected = false;
      });
      newSelection.length = 0;
    }

    setGrid(newGrid);
    setSelection(newSelection);
  };

  const getDirection = (start: Position, end: Position) => {
    const rowDiff = end.row - start.row;
    const colDiff = end.col - start.col;
    
    if (rowDiff === 0 && colDiff !== 0) return [0, Math.sign(colDiff)];
    if (colDiff === 0 && rowDiff !== 0) return [Math.sign(rowDiff), 0];
    if (Math.abs(rowDiff) === Math.abs(colDiff)) return [Math.sign(rowDiff), Math.sign(colDiff)];
    return null;
  };

  const getPositionsInLine = (start: Position, end: Position, direction: number[]) => {
    const positions: Position[] = [];
    let current = { ...start };
    
    while (
      current.row >= 0 && current.row < GRID_SIZE &&
      current.col >= 0 && current.col < GRID_SIZE
    ) {
      positions.push({ ...current });
      if (current.row === end.row && current.col === end.col) break;
      current.row += direction[0];
      current.col += direction[1];
    }
    
    return positions;
  };

  const aiMove = () => {
    if (gameOver) return;

    const unFoundWords = words.filter(w => !w.found);
    if (unFoundWords.length === 0) return;

    // AI randomly finds a word
    const wordToFind = unFoundWords[Math.floor(Math.random() * unFoundWords.length)];
    wordToFind.found = true;
    
    const newGrid = [...grid];
    wordToFind.positions.forEach(pos => {
      newGrid[pos.row][pos.col].highlighted = true;
    });
    
    setGrid(newGrid);
    setScore(prev => ({ ...prev, ai: prev.ai + 1 }));
    checkGameEnd();
  };

  const checkGameEnd = () => {
    if (words.every(w => w.found)) {
      endGame();
    }
  };

  const endGame = () => {
    setGameOver(true);
    const message = score.player > score.ai 
      ? 'Congratulations! You won!'
      : score.player < score.ai
      ? 'AI wins! Better luck next time!'
      : "It's a tie!";
    Alert.alert('Game Over', message, [
      { text: 'Play Again', onPress: initializeGame }
    ]);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const Tutorial = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showTutorial}
      onRequestClose={() => setShowTutorial(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.tutorialContainer}>
          <Text style={styles.tutorialTitle}>How to Play Word Search</Text>
          
          <ScrollView style={styles.tutorialContent}>
            <View style={styles.tutorialSection}>
              <Text style={styles.tutorialSubtitle}>Rules:</Text>
              <Text style={styles.tutorialText}>
                • Find words hidden in the grid{'\n'}
                • Words can be placed horizontally, vertically, or diagonally{'\n'}
                • Compete against AI to find more words{'\n'}
                • Game ends when all words are found or time runs out
              </Text>
            </View>

            <View style={styles.tutorialSection}>
              <Text style={styles.tutorialSubtitle}>How to Select Words:</Text>
              <Text style={styles.tutorialText}>
                • Tap the first letter of the word{'\n'}
                • Tap the last letter to select the word{'\n'}
                • Words can be read forwards or backwards{'\n'}
                • Found words will be highlighted
              </Text>
            </View>

            <View style={styles.tutorialSection}>
              <Text style={styles.tutorialSubtitle}>Scoring:</Text>
              <Text style={styles.tutorialText}>
                • Each found word earns 1 point{'\n'}
                • AI searches for words every 15 seconds{'\n'}
                • Player with the most points wins{'\n'}
                • Time limit: 5 minutes
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={styles.tutorialButton}
            onPress={() => setShowTutorial(false)}
          >
            <Text style={styles.tutorialButtonText}>Start Playing!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Tutorial />
      
      <View style={styles.header}>
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>Player: {score.player}</Text>
          <Text style={styles.score}>AI: {score.ai}</Text>
        </View>
        <View style={styles.timerContainer}>
          <Text style={styles.timer}>{formatTime(timer)}</Text>
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={() => setShowTutorial(true)}
          >
            <Icon name="help" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.grid}>
        {grid.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((cell, colIndex) => (
              <TouchableOpacity
                key={`cell-${rowIndex}-${colIndex}`}
                style={[
                  styles.cell,
                  cell.selected && styles.selectedCell,
                  cell.highlighted && styles.highlightedCell,
                ]}
                onPress={() => handleCellPress(rowIndex, colIndex)}
              >
                <Text style={[
                  styles.letter,
                  cell.highlighted && styles.highlightedLetter,
                ]}>
                  {cell.letter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.wordList}>
        <Text style={styles.wordListTitle}>Words to Find:</Text>
        <View style={styles.words}>
          {words.map((word, index) => (
            <Text
              key={word.word}
              style={[
                styles.word,
                word.found && styles.foundWord,
              ]}
            >
              {word.word}
            </Text>
          ))}
        </View>
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
    marginBottom: 16,
  },
  scoreContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
  },
  helpButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  grid: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedCell: {
    backgroundColor: '#e3f2fd',
  },
  highlightedCell: {
    backgroundColor: '#c8e6c9',
  },
  letter: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  highlightedLetter: {
    color: '#2e7d32',
  },
  wordList: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  wordListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  words: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  word: {
    fontSize: 16,
    padding: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  foundWord: {
    textDecorationLine: 'line-through',
    color: '#666',
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
    width: '100%',
    maxHeight: '80%',
  },
  tutorialTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#2196F3',
  },
  tutorialContent: {
    maxHeight: '80%',
  },
  tutorialSection: {
    marginBottom: 16,
  },
  tutorialSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  tutorialText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  tutorialButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  tutorialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WordSearch; 
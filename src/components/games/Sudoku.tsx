import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Cell = {
  value: number | null;
  isOriginal: boolean;
  notes: number[];
};

type Board = Cell[][];

const Sudoku = () => {
  const [board, setBoard] = useState<Board>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [mistakes, setMistakes] = useState(0);
  const [timer, setTimer] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (board.length > 0) {
        setTimer(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [board]);

  const initializeGame = () => {
    const newBoard = generateSudokuBoard(difficulty);
    setBoard(newBoard);
    setMistakes(0);
    setTimer(0);
  };

  const generateSudokuBoard = (difficulty: 'easy' | 'medium' | 'hard'): Board => {
    // Initialize empty board
    const emptyBoard: Board = Array(9).fill(null).map(() =>
      Array(9).fill(null).map(() => ({
        value: null,
        isOriginal: false,
        notes: [],
      }))
    );

    // Generate solved board
    const solvedBoard = solveSudoku([...emptyBoard]);

    // Remove numbers based on difficulty
    const cellsToRemove = {
      easy: 40,
      medium: 50,
      hard: 60,
    };

    const puzzleBoard = [...solvedBoard];
    let removed = 0;
    while (removed < cellsToRemove[difficulty]) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (puzzleBoard[row][col].value !== null) {
        puzzleBoard[row][col] = {
          value: null,
          isOriginal: false,
          notes: [],
        };
        removed++;
      }
    }

    return puzzleBoard;
  };

  const solveSudoku = (board: Board): Board => {
    // Implementation of backtracking algorithm to solve Sudoku
    const isValid = (num: number, pos: [number, number], board: Board) => {
      // Check row
      for (let x = 0; x < 9; x++) {
        if (board[pos[0]][x].value === num && pos[1] !== x) {
          return false;
        }
      }

      // Check column
      for (let x = 0; x < 9; x++) {
        if (board[x][pos[1]].value === num && pos[0] !== x) {
          return false;
        }
      }

      // Check box
      const boxX = Math.floor(pos[1] / 3) * 3;
      const boxY = Math.floor(pos[0] / 3) * 3;

      for (let i = boxY; i < boxY + 3; i++) {
        for (let j = boxX; j < boxX + 3; j++) {
          if (board[i][j].value === num && i !== pos[0] && j !== pos[1]) {
            return false;
          }
        }
      }

      return true;
    };

    const findEmpty = (board: Board): [number, number] | null => {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (board[i][j].value === null) {
            return [i, j];
          }
        }
      }
      return null;
    };

    const solve = () => {
      const find = findEmpty(board);
      if (!find) {
        return true;
      }

      const [row, col] = find;

      for (let i = 1; i <= 9; i++) {
        if (isValid(i, [row, col], board)) {
          board[row][col] = {
            value: i,
            isOriginal: true,
            notes: [],
          };

          if (solve()) {
            return true;
          }

          board[row][col] = {
            value: null,
            isOriginal: false,
            notes: [],
          };
        }
      }
      return false;
    };

    solve();
    return board;
  };

  const handleCellPress = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (number: number) => {
    if (!selectedCell || board[selectedCell.row][selectedCell.col].isOriginal) {
      return;
    }

    const newBoard = [...board];
    if (isNotesMode) {
      const cell = newBoard[selectedCell.row][selectedCell.col];
      const noteIndex = cell.notes.indexOf(number);
      if (noteIndex === -1) {
        cell.notes.push(number);
      } else {
        cell.notes.splice(noteIndex, 1);
      }
    } else {
      newBoard[selectedCell.row][selectedCell.col] = {
        ...newBoard[selectedCell.row][selectedCell.col],
        value: number,
      };
      // Check if move is valid
      if (!isValidMove(selectedCell.row, selectedCell.col, number)) {
        setMistakes(prev => {
          if (prev + 1 >= 3) {
            Alert.alert('Game Over', 'You made too many mistakes!');
            initializeGame();
            return 0;
          }
          return prev + 1;
        });
      }
    }
    setBoard(newBoard);
  };

  const isValidMove = (row: number, col: number, value: number): boolean => {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (i !== col && board[row][i].value === value) {
        return false;
      }
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (i !== row && board[i][col].value === value) {
        return false;
      }
    }

    // Check box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if (i !== row && j !== col && board[i][j].value === value) {
          return false;
        }
      }
    }

    return true;
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
          <Text style={styles.tutorialTitle}>How to Play Sudoku</Text>
          
          <ScrollView style={styles.tutorialContent}>
            <View style={styles.tutorialSection}>
              <Text style={styles.tutorialSubtitle}>Basic Rules:</Text>
              <Text style={styles.tutorialText}>
                • Fill the 9×9 grid with numbers from 1-9{'\n'}
                • Each row must contain numbers 1-9 without repetition{'\n'}
                • Each column must contain numbers 1-9 without repetition{'\n'}
                • Each 3×3 box must contain numbers 1-9 without repetition
              </Text>
            </View>

            <View style={styles.tutorialSection}>
              <Text style={styles.tutorialSubtitle}>Game Features:</Text>
              <Text style={styles.tutorialText}>
                • Tap a cell to select it{'\n'}
                • Use the number pad to input numbers{'\n'}
                • Toggle 'Notes' mode to add small numbers as hints{'\n'}
                • You have 3 mistakes allowed before game over{'\n'}
                • Timer tracks your solving speed{'\n'}
                • Original numbers cannot be changed
              </Text>
            </View>

            <View style={styles.tutorialSection}>
              <Text style={styles.tutorialSubtitle}>Tips:</Text>
              <Text style={styles.tutorialText}>
                • Use notes to track possible numbers for each cell{'\n'}
                • Look for single candidates in rows/columns/boxes{'\n'}
                • Start with the numbers that appear most frequently{'\n'}
                • Use the process of elimination
              </Text>
            </View>

            <View style={styles.tutorialSection}>
              <Text style={styles.tutorialSubtitle}>Difficulty Levels:</Text>
              <Text style={styles.tutorialText}>
                • Easy: More numbers revealed, good for beginners{'\n'}
                • Medium: Balanced challenge{'\n'}
                • Hard: Fewer numbers revealed, requires advanced techniques
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={styles.tutorialButton}
            onPress={() => setShowTutorial(false)}
          >
            <Text style={styles.tutorialButtonText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.timer}>Time: {formatTime(timer)}</Text>
        <Text style={styles.mistakes}>Mistakes: {mistakes}/3</Text>
      </View>
      <TouchableOpacity 
        style={styles.helpButton}
        onPress={() => setShowTutorial(true)}
      >
        <Icon name="help" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Tutorial />
      {renderHeader()}

      <View style={styles.board}>
        {board.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((cell, colIndex) => (
              <TouchableOpacity
                key={`cell-${rowIndex}-${colIndex}`}
                style={[
                  styles.cell,
                  selectedCell?.row === rowIndex && selectedCell?.col === colIndex && styles.selectedCell,
                  cell.isOriginal && styles.originalCell,
                  (rowIndex + 1) % 3 === 0 && styles.bottomBorder,
                  (colIndex + 1) % 3 === 0 && styles.rightBorder,
                ]}
                onPress={() => handleCellPress(rowIndex, colIndex)}
              >
                {cell.value ? (
                  <Text style={[
                    styles.cellText,
                    cell.isOriginal && styles.originalText
                  ]}>
                    {cell.value}
                  </Text>
                ) : (
                  <View style={styles.notes}>
                    {cell.notes.map((note) => (
                      <Text key={note} style={styles.noteText}>{note}</Text>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.controls}>
        <View style={styles.numberPad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <TouchableOpacity
              key={number}
              style={styles.numberButton}
              onPress={() => handleNumberInput(number)}
            >
              <Text style={styles.numberText}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, isNotesMode && styles.activeButton]}
            onPress={() => setIsNotesMode(!isNotesMode)}
          >
            <Icon name="edit" size={24} color={isNotesMode ? '#2196F3' : '#666'} />
            <Text style={styles.actionButtonText}>Notes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={initializeGame}
          >
            <Icon name="refresh" size={24} color="#666" />
            <Text style={styles.actionButtonText}>New Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
    alignItems: 'center',
    padding: 16,
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mistakes: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
  },
  board: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 36,
    height: 36,
    borderWidth: 0.5,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCell: {
    backgroundColor: '#e3f2fd',
  },
  originalCell: {
    backgroundColor: '#f5f5f5',
  },
  bottomBorder: {
    borderBottomWidth: 2,
  },
  rightBorder: {
    borderRightWidth: 2,
  },
  cellText: {
    fontSize: 18,
  },
  originalText: {
    fontWeight: 'bold',
  },
  notes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
    padding: 2,
  },
  noteText: {
    fontSize: 8,
    width: '33%',
    textAlign: 'center',
  },
  controls: {
    padding: 16,
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  numberButton: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  numberText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
  },
  activeButton: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  actionButtonText: {
    marginTop: 4,
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
  headerLeft: {
    flex: 1,
  },
  helpButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
});

export default Sudoku; 
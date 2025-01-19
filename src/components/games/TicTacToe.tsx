import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Player = 'X' | 'O' | null;
type Board = Player[];
type Difficulty = 'easy' | 'medium' | 'hard';

const TicTacToe = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerNext, setIsPlayerNext] = useState(true);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!isPlayerNext && !gameOver) {
      const timer = setTimeout(() => {
        makeAiMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerNext, gameOver]);

  const checkWinner = (currentBoard: Board): Player | 'draw' | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const [a, b, c] of lines) {
      if (currentBoard[a] && 
          currentBoard[a] === currentBoard[b] && 
          currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }

    if (currentBoard.every(cell => cell !== null)) {
      return 'draw';
    }

    return null;
  };

  const handleCellPress = (index: number) => {
    if (board[index] || !isPlayerNext || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerNext(false);

    const winner = checkWinner(newBoard);
    if (winner) {
      handleGameEnd(winner);
    }
  };

  const makeAiMove = () => {
    if (gameOver) return;

    let move: number;
    switch (difficulty) {
      case 'easy':
        move = getRandomMove();
        break;
      case 'medium':
        move = Math.random() < 0.7 ? getBestMove() : getRandomMove();
        break;
      case 'hard':
        move = getBestMove();
        break;
      default:
        move = getBestMove();
    }

    const newBoard = [...board];
    newBoard[move] = 'O';
    setBoard(newBoard);
    setIsPlayerNext(true);

    const winner = checkWinner(newBoard);
    if (winner) {
      handleGameEnd(winner);
    }
  };

  const getRandomMove = (): number => {
    const availableMoves = board
      .map((cell, index) => cell === null ? index : null)
      .filter((index): index is number => index !== null);
    
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };

  const getBestMove = (): number => {
    let bestScore = -Infinity;
    let bestMove = 0;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        const score = minimax(board, 0, false);
        board[i] = null;

        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  };

  const minimax = (currentBoard: Board, depth: number, isMaximizing: boolean): number => {
    const winner = checkWinner(currentBoard);
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (winner === 'draw') return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < currentBoard.length; i++) {
        if (currentBoard[i] === null) {
          currentBoard[i] = 'O';
          const score = minimax(currentBoard, depth + 1, false);
          currentBoard[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < currentBoard.length; i++) {
        if (currentBoard[i] === null) {
          currentBoard[i] = 'X';
          const score = minimax(currentBoard, depth + 1, true);
          currentBoard[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const handleGameEnd = (result: Player | 'draw') => {
    setGameOver(true);
    if (result === 'X') {
      setPlayerScore(prev => prev + 1);
      Alert.alert('Victory!', 'You won!', [{ text: 'Play Again', onPress: resetGame }]);
    } else if (result === 'O') {
      setAiScore(prev => prev + 1);
      Alert.alert('Defeat!', 'AI won!', [{ text: 'Try Again', onPress: resetGame }]);
    } else {
      Alert.alert('Draw!', 'It\'s a tie!', [{ text: 'Play Again', onPress: resetGame }]);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerNext(true);
    setGameOver(false);
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
          <Text style={styles.tutorialTitle}>How to Play Tic-Tac-Toe</Text>
          
          <ScrollView style={styles.tutorialContent}>
            <View style={styles.tutorialSection}>
              <Text style={styles.tutorialSubtitle}>Rules:</Text>
              <Text style={styles.tutorialText}>
                • You play as X, AI plays as O{'\n'}
                • Take turns placing your marks{'\n'}
                • Get three in a row to win{'\n'}
                • Can be horizontal, vertical, or diagonal
              </Text>
            </View>

            <View style={styles.tutorialSection}>
              <Text style={styles.tutorialSubtitle}>Difficulty Levels:</Text>
              <Text style={styles.tutorialText}>
                • Easy: AI makes random moves{'\n'}
                • Medium: AI sometimes makes mistakes{'\n'}
                • Hard: AI is unbeatable
              </Text>
            </View>

            <View style={styles.tutorialSection}>
              <Text style={styles.tutorialSubtitle}>Tips:</Text>
              <Text style={styles.tutorialText}>
                • Control the center{'\n'}
                • Block your opponent{'\n'}
                • Create multiple winning paths{'\n'}
                • Watch out for diagonal traps
              </Text>
            </View>
          </ScrollView>

          <View style={styles.difficultyButtons}>
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.difficultyButton,
                  difficulty === level && styles.selectedDifficulty
                ]}
                onPress={() => {
                  setDifficulty(level);
                  resetGame();
                }}
              >
                <Text style={[
                  styles.difficultyButtonText,
                  difficulty === level && styles.selectedDifficultyText
                ]}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

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
          <Text style={styles.score}>Player (X): {playerScore}</Text>
          <Text style={styles.score}>AI (O): {aiScore}</Text>
        </View>
        <TouchableOpacity 
          style={styles.helpButton}
          onPress={() => setShowTutorial(true)}
        >
          <Icon name="help" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.board}>
        {board.map((cell, index) => (
          <TouchableOpacity
            key={index}
            style={styles.cell}
            onPress={() => handleCellPress(index)}
          >
            {cell && (
              <Text style={[
                styles.cellText,
                cell === 'X' ? styles.playerText : styles.aiText
              ]}>
                {cell}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.resetButton}
        onPress={resetGame}
      >
        <Icon name="refresh" size={24} color="#fff" />
        <Text style={styles.resetButtonText}>New Game</Text>
      </TouchableOpacity>
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
    marginBottom: 32,
  },
  scoreContainer: {
    flex: 1,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  helpButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    elevation: 4,
  },
  cell: {
    width: '33%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cellText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  playerText: {
    color: '#2196F3',
  },
  aiText: {
    color: '#F44336',
  },
  resetButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
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
    maxHeight: '60%',
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
  difficultyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  difficultyButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedDifficulty: {
    backgroundColor: '#2196F3',
  },
  difficultyButtonText: {
    fontSize: 16,
    color: '#666',
  },
  selectedDifficultyText: {
    color: '#fff',
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

export default TicTacToe; 
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
const CELL_SIZE = (width - 60) / 3;

type Player = 'X' | 'O' | null;
type Board = Player[];

const TicTacToe = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [scores, setScores] = useState({
    X: 0,
    O: 0,
    ties: 0,
  });

  const calculateWinner = (squares: Board): Player => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handlePress = (index: number) => {
    if (board[index] || calculateWinner(board)) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const winner = calculateWinner(newBoard);
    if (winner) {
      setScores(prev => ({
        ...prev,
        [winner]: prev[winner] + 1
      }));
      Alert.alert(
        'Game Over!',
        `Player ${winner} wins!`,
        [{ text: 'Play Again', onPress: resetGame }]
      );
    } else if (!newBoard.includes(null)) {
      setScores(prev => ({
        ...prev,
        ties: prev.ties + 1
      }));
      Alert.alert(
        'Game Over!',
        "It's a tie!",
        [{ text: 'Play Again', onPress: resetGame }]
      );
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  const resetScores = () => {
    setScores({
      X: 0,
      O: 0,
      ties: 0,
    });
  };

  const renderCell = (index: number) => {
    const value = board[index];
    const isWinningCell = calculateWinner(board) === value;

    return (
      <TouchableOpacity
        style={[
          styles.cell,
          isWinningCell && styles.winningCell
        ]}
        onPress={() => handlePress(index)}
        activeOpacity={0.7}
      >
        {value && (
          <Text 
            style={[
              styles.cellText,
              { color: value === 'X' ? '#2196F3' : '#f44336' }
            ]}
          >
            {value}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a237e', '#000']}
        style={styles.header}
      >
        <Text style={styles.title}>Tic Tac Toe</Text>
        <Text style={styles.subtitle}>
          {calculateWinner(board) 
            ? `Winner: Player ${calculateWinner(board)}`
            : `Next Player: ${isXNext ? 'X' : 'O'}`}
        </Text>
      </LinearGradient>

      {/* Score Board */}
      <View style={styles.scoreBoard}>
        <View style={styles.scoreItem}>
          <Text style={[styles.scoreLabel, { color: '#2196F3' }]}>Player X</Text>
          <Text style={styles.scoreNumber}>{scores.X}</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>Ties</Text>
          <Text style={styles.scoreNumber}>{scores.ties}</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={[styles.scoreLabel, { color: '#f44336' }]}>Player O</Text>
          <Text style={styles.scoreNumber}>{scores.O}</Text>
        </View>
      </View>

      <View style={styles.board}>
        <View style={styles.row}>
          {renderCell(0)}
          {renderCell(1)}
          {renderCell(2)}
        </View>
        <View style={styles.row}>
          {renderCell(3)}
          {renderCell(4)}
          {renderCell(5)}
        </View>
        <View style={styles.row}>
          {renderCell(6)}
          {renderCell(7)}
          {renderCell(8)}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={resetGame}
        >
          <Text style={styles.buttonText}>New Game</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.resetScoresButton}
          onPress={resetScores}
        >
          <Text style={styles.buttonText}>Reset Scores</Text>
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
    fontWeight: '500',
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  board: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 2,
    borderColor: '#1a237e',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cellText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  winningCell: {
    backgroundColor: '#E3F2FD',
  },
  buttonContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  resetButton: {
    backgroundColor: '#1a237e',
    padding: 15,
    borderRadius: 25,
    width: '45%',
    alignItems: 'center',
  },
  resetScoresButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 25,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TicTacToe; 
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
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width - 40;
const CELL_SIZE = BOARD_SIZE / 8;

type Piece = {
  player: 1 | 2;
  isKing: boolean;
} | null;

type Position = {
  row: number;
  col: number;
};

type Stats = {
  player1Wins: number;
  player2Wins: number;
  draws: number;
};

const Checkers = () => {
  const [board, setBoard] = useState<(Piece | null)[][]>(initializeBoard());
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [stats, setStats] = useState<Stats>({
    player1Wins: 0,
    player2Wins: 0,
    draws: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const savedStats = await AsyncStorage.getItem('checkersStats');
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const saveStats = async (newStats: Stats) => {
    try {
      await AsyncStorage.setItem('checkersStats', JSON.stringify(newStats));
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  };

  function initializeBoard(): (Piece | null)[][] {
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Place player 1's pieces (top)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          board[row][col] = { player: 1, isKing: false };
        }
      }
    }
    
    // Place player 2's pieces (bottom)
    for (let row = 5; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          board[row][col] = { player: 2, isKing: false };
        }
      }
    }
    
    return board;
  }

  const handleWin = (winner: 1 | 2) => {
    const newStats = {
      ...stats,
      [`player${winner}Wins`]: stats[`player${winner}Wins` as keyof Stats] + 1
    };
    setStats(newStats);
    saveStats(newStats);
    
    Alert.alert(
      'Game Over!',
      `Player ${winner} wins! 🎉`,
      [
        {
          text: 'New Game',
          onPress: resetGame
        }
      ]
    );
  };

  const checkWinner = () => {
    let player1Pieces = 0;
    let player2Pieces = 0;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece) {
          if (piece.player === 1) player1Pieces++;
          if (piece.player === 2) player2Pieces++;
        }
      }
    }

    if (player1Pieces === 0) handleWin(2);
    if (player2Pieces === 0) handleWin(1);
  };

  const handlePiecePress = (row: number, col: number) => {
    const piece = board[row][col];

    if (!selectedPiece) {
      if (piece && piece.player === currentPlayer) {
        setSelectedPiece({ row, col });
      }
    } else {
      const validMove = isValidMove(selectedPiece, { row, col });
      if (validMove) {
        movePiece(selectedPiece, { row, col });
      }
      setSelectedPiece(null);
    }
  };

  const isValidMove = (from: Position, to: Position): boolean => {
    const piece = board[from.row][from.col];
    if (!piece) return false;

    const rowDiff = to.row - from.row;
    const colDiff = Math.abs(to.col - from.col);

    // Basic movement rules
    if (board[to.row][to.col]) return false;
    if (colDiff !== 1 && colDiff !== 2) return false;

    // Regular pieces can only move forward
    if (!piece.isKing) {
      if (piece.player === 1 && rowDiff < 0) return false;
      if (piece.player === 2 && rowDiff > 0) return false;
    }

    // Jumping over opponent's piece
    if (colDiff === 2) {
      const jumpedRow = (from.row + to.row) / 2;
      const jumpedCol = (from.col + to.col) / 2;
      const jumpedPiece = board[jumpedRow][jumpedCol];
      return jumpedPiece !== null && jumpedPiece.player !== piece.player;
    }

    return true;
  };

  const movePiece = (from: Position, to: Position) => {
    const newBoard = board.map(row => [...row]);
    const piece = newBoard[from.row][from.col];
    if (!piece) return;

    // Move the piece
    newBoard[to.row][to.col] = {
      ...piece,
      isKing: piece.isKing || to.row === 0 || to.row === 7
    };
    newBoard[from.row][from.col] = null;

    // Remove jumped piece if it was a jump move
    if (Math.abs(to.col - from.col) === 2) {
      const jumpedRow = (from.row + to.row) / 2;
      const jumpedCol = (from.col + to.col) / 2;
      newBoard[jumpedRow][jumpedCol] = null;
    }

    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);

    // Check for game over
    checkWinner();
  };

  const resetGame = () => {
    setBoard(initializeBoard());
    setSelectedPiece(null);
    setCurrentPlayer(1);
  };

  const renderCell = (row: number, col: number) => {
    const piece = board[row][col];
    const isSelected = selectedPiece?.row === row && selectedPiece?.col === col;
    const isDarkCell = (row + col) % 2 === 1;

    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        style={[
          styles.cell,
          isDarkCell && styles.darkCell,
          isSelected && styles.selectedCell,
        ]}
        onPress={() => handlePiecePress(row, col)}
      >
        {piece && (
          <View style={[
            styles.piece,
            piece.player === 1 ? styles.player1Piece : styles.player2Piece,
            isSelected && styles.selectedPiece
          ]}>
            {piece.isKing && (
              <Icon name="star" size={20} color="#FFD700" style={styles.kingIcon} />
            )}
          </View>
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
        <Text style={styles.title}>Checkers</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Player 1 (Brown)</Text>
            <Text style={styles.statValue}>{stats.player1Wins} wins</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Player 2 (Dark Red)</Text>
            <Text style={styles.statValue}>{stats.player2Wins} wins</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.board}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.resetButton}
        onPress={resetGame}
      >
        <Text style={styles.resetButtonText}>New Game</Text>
      </TouchableOpacity>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  board: {
    alignSelf: 'center',
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  darkCell: {
    backgroundColor: '#8B4513',
  },
  selectedCell: {
    backgroundColor: '#DAA520',
  },
  piece: {
    width: CELL_SIZE * 0.8,
    height: CELL_SIZE * 0.8,
    borderRadius: CELL_SIZE * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  player1Piece: {
    backgroundColor: '#8B4513',
    borderWidth: 2,
    borderColor: '#A0522D',
  },
  player2Piece: {
    backgroundColor: '#8B0000',
    borderWidth: 2,
    borderColor: '#A52A2A',
  },
  selectedPiece: {
    borderColor: '#FFD700',
    borderWidth: 3,
  },
  kingIcon: {
    position: 'absolute',
  },
  resetButton: {
    backgroundColor: '#1a237e',
    padding: 15,
    borderRadius: 25,
    margin: 20,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Checkers; 
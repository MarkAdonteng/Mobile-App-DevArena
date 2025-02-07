import React, { useState } from 'react';
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

const Checkers = () => {
  const [board, setBoard] = useState<(Piece | null)[][]>(initializeBoard());
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });

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
    checkGameOver(newBoard);
  };

  const checkGameOver = (currentBoard: (Piece | null)[][]) => {
    let player1Pieces = 0;
    let player2Pieces = 0;

    currentBoard.forEach(row => {
      row.forEach(cell => {
        if (cell?.player === 1) player1Pieces++;
        if (cell?.player === 2) player2Pieces++;
      });
    });

    if (player1Pieces === 0) {
      setScores(prev => ({ ...prev, player2: prev.player2 + 1 }));
      Alert.alert('Game Over', 'Player 2 wins!', [
        { text: 'New Game', onPress: resetGame }
      ]);
    } else if (player2Pieces === 0) {
      setScores(prev => ({ ...prev, player1: prev.player1 + 1 }));
      Alert.alert('Game Over', 'Player 1 wins!', [
        { text: 'New Game', onPress: resetGame }
      ]);
    }
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
        <Text style={styles.subtitle}>Make your move!</Text>
      </LinearGradient>

      <View style={styles.scoreBoard}>
        <View style={styles.scoreItem}>
          <View style={[styles.scoreIndicator, styles.player1Piece]} />
          <Text style={styles.scoreText}>Player 1: {scores.player1}</Text>
        </View>
        <View style={styles.scoreItem}>
          <View style={[styles.scoreIndicator, styles.player2Piece]} />
          <Text style={styles.scoreText}>Player 2: {scores.player2}</Text>
        </View>
      </View>

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
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  scoreBoard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 10,
    elevation: 3,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  scoreText: {
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
    backgroundColor: '#CD853F',
    borderWidth: 2,
    borderColor: '#DEB887',
  },
  player2Piece: {
    backgroundColor: '#8B4513',
    borderWidth: 2,
    borderColor: '#A0522D',
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
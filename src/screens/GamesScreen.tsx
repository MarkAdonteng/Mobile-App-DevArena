import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GameStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

type GameNavigationProp = StackNavigationProp<GameStackParamList>;

const games = [
  {
    id: 'tictactoe',
    name: 'Tic Tac Toe',
    description: 'Classic game vs Player or AI',
    icon: 'grid-3x3',
    color: '#2196F3',
    component: 'TicTacToe' as keyof GameStackParamList,
  },
  {
    id: 'rps',
    name: 'Rock Paper Scissors',
    description: 'Test your luck!',
    icon: 'sports-esports',
    color: '#4CAF50',
    component: 'RockPaperScissors' as keyof GameStackParamList,
  },
  {
    id: 'sudoku',
    name: 'Sudoku',
    description: 'Number placement puzzle',
    icon: 'grid-on',
    color: '#3F51B5',
    component: 'Sudoku' as keyof GameStackParamList,
  },
  // {
  //   id: 'checkers',
  //   name: 'Checkers',
  //   description: 'Classic board game strategy',
  //   icon: 'grid-on',
  //   color: '#9C27B0',
  //   component: 'Checkers' as keyof GameStackParamList,  // Changed from 'Chess' to 'Checkers'
  // },
  {
    id: 'wordsearch',
    name: 'Word Search',
    description: 'Find hidden words',
    icon: 'search',
    color: '#009688',
    component: 'WordSearch' as keyof GameStackParamList,
  },
  {
    id: 'coderunner',
    name: 'Code Runner',
    description: 'Write and run code',
    icon: 'code',
    color: '#FF5722',
    component: 'CodeRunner' as keyof GameStackParamList,
  },
  {
    id: 'knapsack',
    name: 'Knapsack Hunt',
    description: 'Solve the puzzle',
    icon: 'backpack',
    color: '#FF9800',
    component: 'KnapsackHunt' as keyof GameStackParamList,
  },
];

const GamesScreen = () => {
  const navigation = useNavigation<GameNavigationProp>();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a237e', '#000']}
        style={styles.header}
      >
        <Text style={styles.title}>Game Arena</Text>
        <Text style={styles.subtitle}>Challenge yourself with our collection of games</Text>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gamesGrid}>
          {games.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={styles.gameCard}
              onPress={() => navigation.navigate(game.component)}
            >
              <LinearGradient
                colors={[game.color, `${game.color}99`]}
                style={styles.cardGradient}
              >
                <Icon name={game.icon} size={40} color="#FFF" />
                <Text style={styles.gameName}>{game.name}</Text>
                <Text style={styles.gameDescription}>{game.description}</Text>
                
                <View style={styles.playButton}>
                  <Icon name="play-arrow" size={24} color="#FFF" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  gameCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.2,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  gameName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  gameDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
  playButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GamesScreen; 
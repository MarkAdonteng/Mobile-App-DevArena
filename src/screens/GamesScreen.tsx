import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { GameStackParamList } from '../types/navigation';

// Define the navigation param list
type RootStackParamList = {
  SortingChallenge: undefined;
  PathfindingMaze: undefined;
  NumberGuessing: undefined;
  TowerOfHanoi: undefined;
  SortingRace: undefined;
  Sudoku: undefined;
  WordSearch: undefined;
  TicTacToe: undefined;
  KnapsackHunt: undefined;
  BinaryTree: undefined;
  RockPaperScissors: undefined;
  CodeRunner: undefined;
  AlgorithmBattle: undefined;
  DebugDetective: undefined;
  CodeSnake: undefined;
};

type GameScreenNavigationProp = NavigationProp<GameStackParamList>;

type GameItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  route: keyof GameStackParamList;
  backgroundColor: string;
  iconColor: string;
};

const games: GameItem[] = [
  {
    id: '1',
    title: 'Code Runner',
    description: 'Write and execute code to solve programming challenges',
    icon: 'code',
    difficulty: 'Medium',
    route: 'CodeRunner',
    backgroundColor: '#9C27B0',
    iconColor: '#6A1B9A',
  },
  {
    id: '2',
    title: 'Algorithm Battle',
    description: 'Race against time to implement efficient algorithms',
    icon: 'speed',
    difficulty: 'Hard',
    route: 'AlgorithmBattle',
    backgroundColor: '#F44336',
    iconColor: '#C62828',
  },
  {
    id: '3',
    title: 'Rock Paper Scissors',
    description: 'Challenge the AI in a classic game with a learning twist',
    icon: 'back-hand',
    difficulty: 'Easy',
    route: 'RockPaperScissors',
    backgroundColor: '#4CAF50',
    iconColor: '#2E7D32',
  },
  {
    id: '4',
    title: 'Sudoku Solver',
    description: 'Play Sudoku with algorithmic hints',
    icon: 'grid-on',
    difficulty: 'Hard',
    route: 'Sudoku',
    backgroundColor: '#3F51B5',
    iconColor: '#283593',
  },
  {
    id: '5',
    title: 'Word Search',
    description: 'Find words while competing with AI solver',
    icon: 'search',
    difficulty: 'Medium',
    route: 'WordSearch',
    backgroundColor: '#009688',
    iconColor: '#00695C',
  },
  {
    id: '6',
    title: 'AI Tic-Tac-Toe',
    description: 'Challenge Minimax AI in Tic-Tac-Toe',
    icon: 'close',
    difficulty: 'Easy',
    route: 'TicTacToe',
    backgroundColor: '#FF5722',
    iconColor: '#D84315',
  },
  {
    id: '7',
    title: 'Debug Detective',
    description: 'Solve coding mysteries and fix buggy code',
    icon: 'bug-report',
    difficulty: 'Medium',
    route: 'DebugDetective',
    backgroundColor: '#2196F3',
    iconColor: '#1565C0',
  },
  {
    id: '8',
    title: 'Code Snake',
    description: 'Learn programming concepts while playing Snake',
    icon: 'code',
    difficulty: 'Medium',
    route: 'CodeSnake',
    backgroundColor: '#4CAF50',
    iconColor: '#2E7D32',
  },
];

const GameCard = React.memo(({ 
  item, 
  index, 
  cardWidth, 
  onPress 
}: { 
  item: GameItem; 
  index: number; 
  cardWidth: number;
  onPress: () => void;
}) => {
  const translateY = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 500,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, [index]);

  return (
    <Animated.View
      style={[
        styles.gameCard,
        {
          width: cardWidth,
          transform: [{ translateY }],
          backgroundColor: item.backgroundColor,
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        style={styles.cardContent}
      >
        <View style={[styles.iconContainer, { backgroundColor: item.iconColor }]}>
          <Icon name={item.icon} size={32} color="#fff" />
        </View>
        <Text style={styles.gameTitle}>{item.title}</Text>
        <Text style={styles.gameDescription}>{item.description}</Text>
        <View style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>{item.difficulty}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

const GamesScreen = () => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation<GameScreenNavigationProp>();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderGameCard = ({ item, index }: { item: GameItem; index: number }) => {
    const cardWidth = (width - 48) / 2;
    return (
      <GameCard
        item={item}
        index={index}
        cardWidth={cardWidth}
        onPress={() => navigation.navigate(item.route)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={games}
        renderItem={renderGameCard}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  gameCard: {
    borderRadius: 16,
    margin: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  gameDescription: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default GamesScreen; 
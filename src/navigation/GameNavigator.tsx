import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import GamesScreen from '../screens/GamesScreen';
import TicTacToe from '../components/games/TicTacToe';
import RockPaperScissors from '../components/games/RockPaperScissors';
import Checkers from '../components/games/Checkers';
import Sudoku from '../components/games/Sudoku';
import WordSearch from '../components/games/WordSearch';
import CodeRunner from '../components/games/CodeRunner';
import KnapsackHunt from '../components/games/KnapsackHunt';
import { GameStackParamList } from '../types/navigation';

const Stack = createStackNavigator<GameStackParamList>();

const GameNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="GamesList"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#f5f5f5' }
      }}
    >
      <Stack.Screen 
        name="GamesList" 
        component={GamesScreen}
      />
      <Stack.Screen 
        name="TicTacToe" 
        component={TicTacToe}
      />
      <Stack.Screen 
        name="RockPaperScissors" 
        component={RockPaperScissors}
      />
      <Stack.Screen 
        name="Checkers" 
        component={Checkers}
      />
      <Stack.Screen 
        name="Sudoku" 
        component={Sudoku}
      />
      <Stack.Screen 
        name="WordSearch" 
        component={WordSearch}
      />
      <Stack.Screen 
        name="CodeRunner" 
        component={CodeRunner}
      />
      <Stack.Screen 
        name="KnapsackHunt" 
        component={KnapsackHunt}
      />
    </Stack.Navigator>
  );
};

export default GameNavigator; 
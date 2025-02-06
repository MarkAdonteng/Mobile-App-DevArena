import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Define the tab navigation param list
export type TabParamList = {
  General: undefined;
  Quiz: undefined;
  Videos: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  MainApp: undefined;
  Help: undefined;
};

export type GameStackParamList = {
  GamesList: undefined;
  CodeRunner: undefined;
  AlgorithmBattle: undefined;
  RockPaperScissors: undefined;
  Sudoku: undefined;
  WordSearch: undefined;
  TicTacToe: undefined;
  DebugDetective: undefined;
  CodeSnake: undefined;
};

export type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList>;
export type GameScreenNavigationProp = StackNavigationProp<RootStackParamList>;

// Create a composite navigation prop that combines stack and tab navigation
export type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  StackNavigationProp<RootStackParamList>
>; 
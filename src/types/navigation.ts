import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Define the tab navigation param list
export type TabParamList = {
  General: undefined;
  Games: undefined;
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
  TicTacToe: undefined;
  RockPaperScissors: undefined;
  Checkers: undefined;
  Sudoku: undefined;
  WordSearch: undefined;
  CodeRunner: undefined;
  KnapsackHunt: undefined;
};

export type GameScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Games'>,
  StackNavigationProp<GameStackParamList>
>;

export type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList>;

// Create a composite navigation prop that combines stack and tab navigation
export type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  StackNavigationProp<RootStackParamList>
>; 
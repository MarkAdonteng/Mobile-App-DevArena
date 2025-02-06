import { StackNavigationProp } from '@react-navigation/stack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  MainApp: undefined;
  Help: undefined;
  Quiz: undefined;
  Account: undefined;
  General: undefined;
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

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>; 
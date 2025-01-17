import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  MainApp: undefined;
  Help: undefined;
  GamesList: undefined;
  CodeRunner: undefined;
  AlgorithmBattle: undefined;
  DebugMaster: undefined;
};

export type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList>;
export type GameScreenNavigationProp = StackNavigationProp<RootStackParamList>; 
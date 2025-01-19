import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from './src/types/navigation';
import { UserProvider } from './src/context/UserContext';

// Import screens
import LoginScreen from './src/screens/auth/LoginScreen';
import SignupScreen from './src/screens/auth/SignupScreen';
import QuizScreen from './src/screens/QuizScreen';
import GamesScreen from './src/screens/GamesScreen';
import VideosScreen from './src/screens/VideosScreen';
import AccountScreen from './src/screens/AccountScreen';
import CodeRunner from './src/components/games/CodeRunner';
import AlgorithmBattle from './src/components/games/AlgorithmBattle';
import HelpScreen from './src/screens/HelpScreen';
import GeneralScreen from './src/screens/GeneralScreen';
import SortingChallenge from './src/components/games/SortingChallenge';
import RockPaperScissors from './src/components/games/RockPaperScissors';
import SortingRace from './src/components/games/SortingRace';
import Sudoku from './src/components/games/Sudoku';
import WordSearch from './src/components/games/WordSearch';
import TicTacToe from './src/components/games/TicTacToe';
import KnapsackHunt from './src/components/games/KnapsackHunt';
import DebugDetective from './src/components/games/DebugDetective';
import CodeSnake from './src/components/games/CodeSnake';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const GameStack = createStackNavigator();

const GameStackNavigator = () => (
  <GameStack.Navigator>
    <GameStack.Screen 
      name="GamesList" 
      component={GamesScreen}
      options={{ headerShown: false }}
    />
    <GameStack.Screen 
      name="CodeRunner" 
      component={CodeRunner}
      options={{ title: 'Code Runner' }}
    />
    <GameStack.Screen 
      name="AlgorithmBattle" 
      component={AlgorithmBattle}
      options={{ title: 'Algorithm Battle' }}
    />
    <GameStack.Screen 
      name="SortingChallenge" 
      component={SortingChallenge}
      options={{ 
        title: 'Sorting Challenge',
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
      }}
    />
    <GameStack.Screen 
      name="RockPaperScissors" 
      component={RockPaperScissors}
      options={{ 
        title: 'Rock Paper Scissors',
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
      }}
    />
    <GameStack.Screen 
      name="SortingRace" 
      component={SortingRace}
      options={{ 
        title: 'Sorting Race',
        headerStyle: {
          backgroundColor: '#F44336',
        },
        headerTintColor: '#fff',
      }}
    />
    <GameStack.Screen 
      name="Sudoku" 
      component={Sudoku}
      options={{ 
        title: 'Sudoku Solver',
        headerStyle: {
          backgroundColor: '#3F51B5',
        },
        headerTintColor: '#fff',
      }}
    />
    <GameStack.Screen 
      name="WordSearch" 
      component={WordSearch}
      options={{ 
        title: 'Word Search',
        headerStyle: {
          backgroundColor: '#009688',
        },
        headerTintColor: '#fff',
      }}
    />
    <GameStack.Screen 
      name="TicTacToe" 
      component={TicTacToe}
      options={{ 
        title: 'AI Tic-Tac-Toe',
        headerStyle: {
          backgroundColor: '#FF5722',
        },
        headerTintColor: '#fff',
      }}
    />
    <GameStack.Screen 
      name="KnapsackHunt" 
      component={KnapsackHunt}
      options={{ 
        title: 'Knapsack Hunt',
        headerStyle: {
          backgroundColor: '#795548',
        },
        headerTintColor: '#fff',
      }}
    />
    <GameStack.Screen 
      name="DebugDetective" 
      component={DebugDetective}
      options={{ 
        title: 'Debug Detective',
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
      }}
    />
    <GameStack.Screen 
      name="CodeSnake" 
      component={CodeSnake}
      options={{ 
        title: 'Code Snake',
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff',
      }}
    />
  </GameStack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case 'General':
            iconName = 'home';
            break;
          case 'Quiz':
            iconName = 'quiz';
            break;
          case 'Games':
            iconName = 'sports-esports';
            break;
          case 'Videos':
            iconName = 'ondemand-video';
            break;
          case 'Account':
            iconName = 'person';
            break;
          default:
            iconName = 'circle';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#2196F3',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="General" component={GeneralScreen} />
    <Tab.Screen name="Quiz" component={QuizScreen} />
    <Tab.Screen name="Games" component={GameStackNavigator} />
    <Tab.Screen name="Videos" component={VideosScreen} />
    <Tab.Screen name="Account" component={AccountScreen} />
  </Tab.Navigator>
);

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="MainApp" component={TabNavigator} />
          <Stack.Screen name="Help" component={HelpScreen} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: 5,
    paddingTop: 5,
  },
});

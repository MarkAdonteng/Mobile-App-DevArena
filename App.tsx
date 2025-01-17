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

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const MainApp = () => {
  return (
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
      <Tab.Screen name="Games" component={GamesScreen} />
      <Tab.Screen name="Videos" component={VideosScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

const GameStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="GamesList" 
      component={GamesScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="CodeRunner" 
      component={CodeRunner}
      options={{ title: 'Code Runner' }}
    />
    <Stack.Screen 
      name="AlgorithmBattle" 
      component={AlgorithmBattle}
      options={{ title: 'Algorithm Battle' }}
    />
  </Stack.Navigator>
);

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="MainApp" component={MainApp} />
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

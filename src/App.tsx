import { useEffect } from 'react';
import { auth, fetchUserData } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useUser } from './context/UserContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/auth/LoginScreen';
import SignupScreen from './screens/auth/SignupScreen';
import TabNavigator from './navigation/TabNavigator';
import HelpScreen from './screens/HelpScreen';

const Stack = createStackNavigator();

function App() {
  const { setUser } = useUser();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        try {
          const userData = await fetchUserData(firebaseUser.uid);
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        // User is signed out
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="MainApp" component={TabNavigator} />
        <Stack.Screen name="Help" component={HelpScreen} />
        // Add other screens as necessary
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App; 
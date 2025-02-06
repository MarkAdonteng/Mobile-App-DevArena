import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GeneralScreen from '../screens/GeneralScreen';
import QuizScreen from '../screens/QuizScreen';
import AccountScreen from '../screens/AccountScreen';
import VideosScreen from '../screens/VideosScreen';  // Import the existing screen

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
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
              iconName = 'school';
              break;
            case 'Videos':
              iconName = 'play-circle-filled';
              break;
            case 'Account':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="General" 
        component={GeneralScreen}
        options={{
          title: 'Home'
        }}
      />
      <Tab.Screen 
        name="Quiz" 
        component={QuizScreen}
        options={{
          title: 'Learn'
        }}
      />
      <Tab.Screen 
        name="Videos" 
        component={VideosScreen}
        options={{
          title: 'Tutorials'
        }}
      />
      <Tab.Screen 
        name="Account" 
        component={AccountScreen}
        options={{
          title: 'Profile'
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator; 
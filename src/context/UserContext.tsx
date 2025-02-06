import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRewards } from '../types/rewards';
import { AVAILABLE_BADGES, POINTS_PER_QUIZ } from '../config/badges';
import { Alert } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db, fetchUserData } from '../services/firebase';

export type User = {
  uid: string;
  email: string;
  fullName: string;
  profileImage?: string;
  completedModules: string[];
  achievements: string[];
  rewards: {
    points: number;
    badges: any[];  // or proper Badge type
    completedQuizzes: number;
  };
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  updateRewards: (completedQuiz: boolean, lessonId: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Function to refresh user data
  const refreshUserData = async () => {
    if (user?.uid) {
      try {
        const freshUserData = await fetchUserData(user.uid);
        setUser(freshUserData);
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    }
  };

  const updateRewards = async (completedQuiz: boolean, lessonId: string) => {
    if (!user || !completedQuiz) return;

    try {
      const updatedUser = { ...user };
      
      // Initialize rewards if they don't exist
      if (!updatedUser.rewards) {
        updatedUser.rewards = {
          points: 0,
          badges: [],
          completedQuizzes: 0
        };
      }

      // Update points and completed quizzes
      const newPoints = updatedUser.rewards.points + POINTS_PER_QUIZ;
      const newCompletedQuizzes = updatedUser.rewards.completedQuizzes + 1;

      // Check for new badges based on completed quizzes
      const newBadges = AVAILABLE_BADGES.filter(badge => 
        !updatedUser.rewards.badges.find(b => b.id === badge.id) && 
        newCompletedQuizzes >= badge.requirement
      );

      const updatedRewards = {
        points: newPoints,
        badges: [...updatedUser.rewards.badges, ...newBadges],
        completedQuizzes: newCompletedQuizzes
      };

      // Update Firestore first
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        rewards: updatedRewards,
        completedModules: Array.from(new Set([...(user.completedModules || []), lessonId]))
      });

      // Refresh user data from Firestore to ensure consistency
      await refreshUserData();

      // Show badge notifications after successful update
      if (newBadges.length > 0) {
        // Show badges one at a time with a slight delay
        for (const badge of newBadges) {
          await new Promise(resolve => setTimeout(resolve, 500)); // Add small delay between notifications
          Alert.alert(
            '🏆 New Badge Earned!',
            `Congratulations! You've earned the "${badge.name}" badge!\n\n${badge.description}`,
            [{ text: 'OK' }]
          );
        }
      }

      return true;
    } catch (error) {
      console.error('Error updating rewards:', error);
      Alert.alert(
        'Error',
        'Failed to save your rewards. Please check your internet connection.',
        [{ text: 'OK' }]
      );
      throw error;
    }
  };

  // Wrap setUser to ensure rewards are initialized
  const wrappedSetUser = async (newUser: User | null) => {
    if (newUser) {
      try {
        // If setting a new user, fetch fresh data from Firestore
        const freshUserData = await fetchUserData(newUser.uid);
        setUser(freshUserData);
      } catch (error) {
        console.error('Error setting user:', error);
        // Fallback to provided user data if fetch fails
        setUser(newUser);
      }
    } else {
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: wrappedSetUser, updateRewards }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 
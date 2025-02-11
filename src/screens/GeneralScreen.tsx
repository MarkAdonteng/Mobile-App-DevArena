import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  ImageBackground,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../types/navigation';
import { useUser } from '../context/UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

// Daily challenge interface
interface DailyChallenge {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
  explanation: string;
}

const dailyChallenges: DailyChallenge[] = [
  {
    id: '1',
    question: 'What is the time complexity of a binary search?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correctAnswer: 1,
    points: 10,
    explanation: 'Binary search has a time complexity of O(log n) as it divides the search space in half with each iteration.'
  },
  {
    id: '2',
    question: 'Which data structure uses LIFO?',
    options: ['Queue', 'Stack', 'Tree', 'Graph'],
    correctAnswer: 1,
    points: 10,
    explanation: 'A Stack uses Last-In-First-Out (LIFO) principle where the last element added is the first one to be removed.'
  },
  // Add more daily challenges here
];

const GeneralScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, setUser } = useUser();
  const { width } = useWindowDimensions();
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);
  const [hasCompletedDaily, setHasCompletedDaily] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);

  const features = [
    {
      title: 'Interactive Lessons',
      description: 'Learn through hands-on coding exercises',
      icon: 'code',
      color: '#4CAF50',
      action: () => navigation.navigate('Quiz'),
    },
    {
      title: 'Progress Tracking',
      description: 'Monitor your learning journey',
      icon: 'trending-up',
      color: '#2196F3',
      action: () => navigation.navigate('Account'),
    },
    {
      title: 'Earn Badges',
      description: 'Get rewarded for your achievements',
      icon: 'military-tech',
      color: '#FFC107',
      action: () => navigation.navigate('Account'),
    },
    {
      title: 'Video Tutorials',
      description: 'Watch and learn programming concepts',
      icon: 'play-circle-filled',
      color: '#9C27B0',
      action: () => navigation.navigate('Videos'),
    },
  ];

  useEffect(() => {
    if (user) {
      checkDailyChallenge();
      selectDailyChallenge();
    }
  }, [user]);

  const selectDailyChallenge = () => {
    const today = new Date().toDateString();
    const challengeIndex = Math.floor(
      new Date(today).getTime() / (1000 * 60 * 60 * 24)
    ) % dailyChallenges.length;
    setDailyChallenge(dailyChallenges[challengeIndex]);
  };

  const checkDailyChallenge = async () => {
    if (!user) return;
    
    const today = new Date().toDateString();
    const dailyRef = doc(db, 'users', user.uid, 'dailyChallenges', today);
    const dailyDoc = await getDoc(dailyRef);
    setHasCompletedDaily(dailyDoc.exists());
  };

  const handleDailyChallenge = async (selectedAnswer: number) => {
    if (!dailyChallenge || !user) return;

    const today = new Date().toDateString();
    const dailyRef = doc(db, 'users', user.uid, 'dailyChallenges', today);
    const userRef = doc(db, 'users', user.uid);
    const userData = await getDoc(userRef);
    const currentPoints = userData.data()?.rewards?.points || 0;

    if (selectedAnswer === dailyChallenge.correctAnswer) {
      // Add 20 points for correct answer
      const newPoints = currentPoints + 20;
      
      await setDoc(dailyRef, {
        completed: true,
        timestamp: new Date().toISOString(),
      });

      await setDoc(userRef, {
        ...userData.data(),
        rewards: {
          ...userData.data()?.rewards,
          points: newPoints,
        },
      }, { merge: true });

      Alert.alert(
        'Correct! 🎉',
        `${dailyChallenge.explanation}\n\nYou earned 20 points!\nTotal Points: ${newPoints}`,
        [{ text: 'OK' }]
      );
      setHasCompletedDaily(true);
    } else {
      // Subtract 30 points for wrong answer
      const newPoints = Math.max(0, currentPoints - 30); // Prevent negative points
      
      await setDoc(userRef, {
        ...userData.data(),
        rewards: {
          ...userData.data()?.rewards,
          points: newPoints,
        },
      }, { merge: true });

      Alert.alert(
        'Incorrect ❌',
        `${dailyChallenge.explanation}\n\nYou lost 30 points!\nTotal Points: ${newPoints}`,
        [{ text: 'Try Again' }]
      );
    }

    // Refresh user data to update points display
    const freshUserData = await getDoc(userRef);
    if (user && freshUserData.exists()) {
      const updatedUser = {
        ...user,
        rewards: {
          ...user.rewards,
          points: freshUserData.data()?.rewards?.points || 0,
        },
      };
      // Update user context
      setUser(updatedUser);
    }
  };

  const handleShowChallenge = () => {
    if (!hasCompletedDaily) {
      setShowChallenge(true);
    } else {
      Alert.alert(
        'Challenge Completed',
        'You have already completed today\'s challenge. Come back tomorrow for a new one!',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Section */}
      <ImageBackground
        source={{ 
          uri: 'https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg'
        }}
        style={styles.header}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
          style={styles.gradient}
        >
          <Text style={styles.welcomeText}>
            Welcome to EduPlay,{'\n'}
            <Text style={styles.userName}>{user?.fullName || 'Learner'}</Text>
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Icon name="school" size={24} color="#FFC107" />
              <Text style={styles.statNumber}>{user?.rewards?.completedQuizzes || 0}</Text>
              <Text style={styles.statLabel}>Quizzes</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="emoji-events" size={24} color="#FFC107" />
              <Text style={styles.statNumber}>{user?.rewards?.points || 0}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="military-tech" size={24} color="#FFC107" />
              <Text style={styles.statNumber}>{user?.rewards?.badges?.length || 0}</Text>
              <Text style={styles.statLabel}>Badges</Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>

      {/* Daily Challenge Card */}
      <TouchableOpacity 
        style={styles.challengeCard}
        onPress={handleShowChallenge}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#1a237e', '#3949ab']}
          style={styles.challengeGradient}
        >
          <View style={styles.challengeHeader}>
            <Icon name="emoji-events" size={32} color="#FFD700" />
            <View style={styles.challengeHeaderText}>
              <Text style={styles.challengeCardTitle}>Daily Challenge</Text>
              <Text style={styles.challengeCardSubtitle}>
                {hasCompletedDaily ? 'Completed for today!' : 'New challenge available!'}
              </Text>
            </View>
            {hasCompletedDaily && (
              <Icon name="check-circle" size={24} color="#4CAF50" />
            )}
          </View>
          <Text style={styles.challengeCardPoints}>
            {!hasCompletedDaily && `Earn ${dailyChallenge?.points || 0} points!`}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Challenge Modal */}
      {showChallenge && dailyChallenge && !hasCompletedDaily && (
        <View style={styles.challengeContainer}>
          <View style={styles.challengeModalHeader}>
            <Text style={styles.challengeTitle}>Daily Challenge 🎯</Text>
            <TouchableOpacity 
              onPress={() => setShowChallenge(false)}
              style={styles.closeButton}
            >
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <Text style={styles.challengeQuestion}>{dailyChallenge.question}</Text>
          <View style={styles.optionsContainer}>
            {dailyChallenge.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleDailyChallenge(index)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Features Grid */}
      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>Start Learning</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.featureCard, { width: width / 2 - 24 }]}
              onPress={feature.action}
            >
              <LinearGradient
                colors={[feature.color, `${feature.color}99`]}
                style={styles.featureGradient}
              >
                <Icon name={feature.icon} size={32} color="#FFF" />
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Quiz')}
        >
          <Icon name="play-arrow" size={24} color="#FFF" />
          <Text style={styles.actionButtonText}>Continue Learning</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    height: 300,
    justifyContent: 'flex-end',
  },
  gradient: {
    padding: 20,
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 24,
    color: '#FFF',
    marginBottom: 20,
  },
  userName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
  },
  featuresContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    height: 160,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  featureGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
  },
  quickActions: {
    padding: 16,
    paddingTop: 0,
  },
  actionButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  challengeCard: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
  },
  challengeGradient: {
    padding: 16,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  challengeCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  challengeCardSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  challengeCardPoints: {
    fontSize: 16,
    color: '#FFD700',
    marginTop: 8,
    fontWeight: 'bold',
  },
  challengeContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
  },
  challengeModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    padding: 4,
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  challengeQuestion: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
});

export default GeneralScreen; 
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../types/navigation';
import { useUser } from '../context/UserContext';
import { LinearGradient } from 'expo-linear-gradient';

const GeneralScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useUser();
  const { width } = useWindowDimensions();

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
      title: 'Multiple Languages',
      description: 'Learn various programming languages',
      icon: 'language',
      color: '#9C27B0',
      action: () => navigation.navigate('Quiz'),
    },
  ];

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
            Welcome back,{'\n'}
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
});

export default GeneralScreen; 
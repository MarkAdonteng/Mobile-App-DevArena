import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthScreenNavigationProp } from '../types/navigation';

type Props = {
  navigation: AuthScreenNavigationProp;
};

const HelpScreen: React.FC<Props> = ({ navigation }) => {
  const tutorials = [
    {
      title: 'Getting Started',
      content: [
        'Welcome to AIT Learning Hub!',
        '1. Start by exploring the different learning modules in the Quizzes section',
        '2. Play interactive coding games in the Games section',
        '3. Watch educational videos in the Videos section',
        '4. Track your progress in the Account section',
      ],
    },
    {
      title: 'Quizzes',
      content: [
        'Test your knowledge with our interactive quizzes:',
        '• Select a programming language module',
        '• Choose a quiz from the available options',
        '• Answer questions to earn points',
        '• Review explanations for correct answers',
      ],
    },
    {
      title: 'Games',
      content: [
        'Learn while having fun with our coding games:',
        '• Code Runner: Navigate through coding challenges',
        '• Algorithm Battle: Practice sorting algorithms',
        '• Debug Master: Find and fix code bugs',
        'Each game helps reinforce different programming concepts',
      ],
    },
    {
      title: 'Videos',
      content: [
        'Watch educational programming tutorials:',
        '• Browse through different topics',
        '• Learn at your own pace',
        '• Practice alongside the tutorials',
        '• Save videos for later viewing',
      ],
    },
  ];

  const contactSupport = async (method: 'email' | 'phone') => {
    try {
      if (method === 'email') {
        await Linking.openURL('mailto:support@aitlearning.com');
      } else {
        await Linking.openURL('tel:+1234567890');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open contact method');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="#2196F3" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Help & Support</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Tutorial</Text>
        {tutorials.map((tutorial, index) => (
          <View key={index} style={styles.tutorialCard}>
            <Text style={styles.tutorialTitle}>{tutorial.title}</Text>
            {tutorial.content.map((item, i) => (
              <Text key={i} style={styles.tutorialText}>{item}</Text>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Support</Text>
        <View style={styles.contactCard}>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => contactSupport('email')}
          >
            <Icon name="email" size={24} color="#2196F3" />
            <Text style={styles.contactText}>simplymark443@gmail.com</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => contactSupport('phone')}
          >
            <Icon name="phone" size={24} color="#2196F3" />
            <Text style={styles.contactText}>+233 592 7622 55</Text>
          </TouchableOpacity>

          <Text style={styles.supportHours}>
            Support Hours: Monday - Friday, 9:00 AM - 5:00 PM EST
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    color: '#2196F3',
    fontSize: 16,
    marginLeft: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2196F3',
  },
  tutorialCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tutorialTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  tutorialText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginBottom: 12,
  },
  contactText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#2196F3',
  },
  supportHours: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});

export default HelpScreen; 
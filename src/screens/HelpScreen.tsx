import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const HelpScreen = () => {
  const navigation = useNavigation();

  const helpSections = [
    {
      title: 'Getting Started',
      icon: 'play-circle-outline',
      items: [
        'Create an account or sign in',
        'Complete your profile',
        'Start with basic tutorials',
        'Track your progress',
      ],
    },
    {
      title: 'Quiz Help',
      icon: 'quiz',
      items: [
        'Answer questions to earn points',
        'Review explanations after each answer',
        'Earn badges for completing quizzes',
        'Track your quiz performance',
      ],
    },
    {
      title: 'Games & Practice',
      icon: 'sports-esports',
      items: [
        'Play coding games to learn',
        'Practice with interactive challenges',
        'Compete with other learners',
        'Improve your skills through gameplay',
      ],
    },
    {
      title: 'Account Settings',
      icon: 'settings',
      items: [
        'Update your profile information',
        'Change your password',
        'Manage notifications',
        'Privacy settings',
      ],
    },
  ];

  const handleContact = () => {
    Linking.openURL('mailto:support@codelearning.com');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2196F3', '#1976D2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & Support</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {helpSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name={section.icon} size={24} color="#2196F3" />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <View key={itemIndex} style={styles.helpItem}>
                  <Icon name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.helpText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Need More Help?</Text>
          <Text style={styles.contactText}>
            Our support team is always ready to assist you with any questions or concerns.
          </Text>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleContact}
          >
            <Icon name="mail" size={24} color="#fff" />
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#333',
  },
  sectionContent: {
    paddingLeft: 8,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  helpText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  contactSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 2,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  contactButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 2,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default HelpScreen; 
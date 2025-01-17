import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ProgrammingLanguage, DifficultyLevel } from '../types/quiz';
import { getQuizzes } from '../data/quizzes';
import { Header } from '../components/common/Header';
import { QuizInterface } from '../components/quiz/QuizInterface';

const languageIcons: Record<ProgrammingLanguage, string> = {
  Python: 'https://th.bing.com/th?q=Python+Logo.svg&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=en-WW&cc=GH&setlang=en&adlt=moderate&t=1&mw=247',
  JavaScript: 'https://th.bing.com/th?q=JavaScript+Coding+Logo&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=en-WW&cc=GH&setlang=en&adlt=moderate&t=1&mw=247',
  TypeScript: 'https://th.bing.com/th/id/OIP.maKe3jXsLd8flovNsX2_3QHaHa?w=178&h=180&c=7&r=0&o=5&pid=1.7',
  'C++': 'https://th.bing.com/th?id=OIF.%2bKjf%2f9OZ5Q%2b7dlNnGF1RFQ&w=149&h=180&c=7&r=0&o=5&pid=1.7',
  Java: 'https://th.bing.com/th/id/OIP.NzXXUsSZemMeiaBOmZ-HOQHaJ8?w=125&h=180&c=7&r=0&o=5&pid=1.7',
  React: 'https://th.bing.com/th/id/OIP.QdIrCNdF2ZVylABjjes1LAHaGq?w=196&h=180&c=7&r=0&o=5&pid=1.7',
  Swift: 'https://th.bing.com/th/id/OIP.lJ5Tfc80SRg5P8S8u1oG6wHaHa?w=177&h=180&c=7&r=0&o=5&pid=1.7',
  Kotlin: 'https://th.bing.com/th?q=Kotlin+Icon.png&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=en-WW&cc=GH&setlang=en&adlt=moderate&t=1&mw=247',
  Go: 'https://th.bing.com/th/id/OIP.6SKW_6Okr3_wSPkQEWHCJAHaFC?w=270&h=184&c=7&r=0&o=5&pid=1.7',
  Rust: 'https://th.bing.com/th?q=Rust+Programming+Language+White+SVG+Logo&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=en-WW&cc=GH&setlang=en&adlt=moderate&t=1&mw=247',
  PHP: 'https://th.bing.com/th/id/OIP.uBwDgv38KbxKZgPBhG8KzwHaHa?w=147&h=180&c=7&r=0&o=5&pid=1.7',
  'C#': 'https://th.bing.com/th/id/OIP._NVBTVdmjt3Qvq3CZOySXgHaEK?w=309&h=180&c=7&r=0&o=5&pid=1.7',
  Flutter: 'https://th.bing.com/th?q=Flutter+Icon+No+Background&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=en-WW&cc=GH&setlang=en&adlt=moderate&t=1&mw=247',
  'Next.js': 'data:image/jpeg;base64,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',
};

const difficultyColors: Record<DifficultyLevel, string> = {
  Beginner: '#4CAF50',
  Intermediate: '#FF9800',
  Advanced: '#F44336',
};

type TopicType = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

const topics: Record<ProgrammingLanguage, TopicType[]> = {
  'Python': [
    {
      id: 'basics',
      title: 'Python Basics',
      description: 'Variables, Data Types, and Basic Operations',
      icon: 'code'
    },
    {
      id: 'control-flow',
      title: 'Control Flow',
      description: 'If statements, Loops, and Conditional Logic',
      icon: 'alt-route'
    },
    {
      id: 'functions',
      title: 'Functions',
      description: 'Function Definition, Parameters, and Return Values',
      icon: 'functions'
    },
    {
      id: 'data-structures',
      title: 'Data Structures',
      description: 'Lists, Dictionaries, Sets, and Tuples',
      icon: 'data-array'
    },
    // Add more topics...
  ],
  'JavaScript': [],
  'TypeScript': [],
  'C++': [],
  'Java': [],
  'React': [
    {
      id: 'basics',
      title: 'React Basics',
      description: 'Components, Props, and State Management',
      icon: 'code'
    },
    {
      id: 'hooks',
      title: 'React Hooks',
      description: 'useState, useEffect, and Custom Hooks',
      icon: 'loop'
    },
    {
      id: 'routing',
      title: 'React Router',
      description: 'Navigation and Route Management',
      icon: 'alt-route'
    }
  ],
  'Swift': [],
  'Kotlin': [],
  'Go': [],
  'Rust': [],
  'PHP': [],
  'C#': [],
  'Flutter': [
    {
      id: 'basics',
      title: 'Flutter Basics',
      description: 'Widgets, Layout, and State Management',
      icon: 'widgets'
    },
    {
      id: 'navigation',
      title: 'Navigation',
      description: 'Routes and Navigation Patterns',
      icon: 'navigation'
    },
    {
      id: 'ui-components',
      title: 'UI Components',
      description: 'Material Design and Custom Widgets',
      icon: 'dashboard'
    }
  ],
  'Next.js': [
    {
      id: 'basics',
      title: 'Next.js Basics',
      description: 'Pages, Routing, and Data Fetching',
      icon: 'web'
    },
    {
      id: 'api-routes',
      title: 'API Routes',
      description: 'Building API Endpoints with Next.js',
      icon: 'api'
    },
    {
      id: 'optimization',
      title: 'Performance',
      description: 'Image Optimization and Static Generation',
      icon: 'speed'
    }
  ],
};

const QuizScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);

  const handleLanguageSelect = (language: ProgrammingLanguage) => {
    setSelectedLanguage(language);
    setSelectedTopic(null);
    setSelectedDifficulty(null);
  };

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    setSelectedDifficulty(null);
  };

  const renderLanguageCard = (language: ProgrammingLanguage) => (
    <TouchableOpacity
      key={language}
      style={[
        styles.languageCard,
        selectedLanguage === language && styles.selectedCard
      ]}
      onPress={() => handleLanguageSelect(language)}
    >
      <Image 
        source={{ uri: languageIcons[language] }} 
        style={styles.languageIcon}
        resizeMode="contain"
      />
      <Text style={styles.languageText}>{language}</Text>
    </TouchableOpacity>
  );

  const renderTopicCard = (topic: TopicType) => (
    <TouchableOpacity
      key={topic.id}
      style={styles.topicCard}
      onPress={() => handleTopicSelect(topic.id)}
    >
      <View style={styles.topicIcon}>
        <Icon name={topic.icon} size={24} color="#2196F3" />
      </View>
      <View style={styles.topicInfo}>
        <Text style={styles.topicTitle}>{topic.title}</Text>
        <Text style={styles.topicDescription}>{topic.description}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#666" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header 
        text={selectedLanguage ? `${selectedLanguage} Topics` : 'AIT Learning Hub'}
        showBack={!!selectedLanguage}
        onBack={() => setSelectedLanguage(null)}
        showProgress={false}
      />
      <ScrollView style={styles.content}>
        {!selectedLanguage ? (
          <>
            <Text style={styles.sectionTitle}>Choose a Programming Language</Text>
            <View style={styles.languagesGrid}>
              {Object.keys(languageIcons).map(lang => 
                renderLanguageCard(lang as ProgrammingLanguage)
              )}
            </View>
          </>
        ) : !selectedTopic ? (
          <View style={styles.topicsContainer}>
            {topics[selectedLanguage]?.map(topic => renderTopicCard(topic))}
          </View>
        ) : !selectedDifficulty ? (
          <View style={styles.difficultyContainer}>
            {['Beginner', 'Intermediate', 'Advanced'].map((difficulty) => (
              <TouchableOpacity
                key={difficulty}
                style={[styles.difficultyButton, { backgroundColor: difficultyColors[difficulty as DifficultyLevel] }]}
                onPress={() => setSelectedDifficulty(difficulty as DifficultyLevel)}
              >
                <Text style={styles.difficultyText}>{difficulty}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <QuizInterface
            language={selectedLanguage}
            difficulty={selectedDifficulty}
            onComplete={(score) => {
              // Handle quiz completion
              Alert.alert(
                'Quiz Completed!',
                `You scored ${score} out of 10`,
                [
                  {
                    text: 'Try Again',
                    onPress: () => setSelectedDifficulty(null),
                  },
                  {
                    text: 'Back to Topics',
                    onPress: () => {
                      setSelectedDifficulty(null);
                      setSelectedTopic(null);
                    },
                  },
                ]
              );
            }}
            onBack={() => setSelectedDifficulty(null)}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  languagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  languageCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedCard: {
    borderColor: '#2196F3',
    borderWidth: 2,
  },
  languageIcon: {
    width: 48,
    height: 48,
    marginBottom: 8,
  },
  languageText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  difficultySection: {
    marginTop: 24,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  difficultyButtons: {
    gap: 12,
  },
  difficultyButton: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quizCount: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  topicsContainer: {
    gap: 12,
  },
  topicCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  topicIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  topicInfo: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  topicDescription: {
    fontSize: 14,
    color: '#666',
  },
  difficultyContainer: {
    marginTop: 24,
  },
});

export default QuizScreen; 
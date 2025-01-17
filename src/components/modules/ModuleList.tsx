import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Module, Game } from '../../types';

type ModuleListProps = {
  onSelectGame: (game: Game) => void;
};

export const ModuleList: React.FC<ModuleListProps> = ({ onSelectGame }) => {
  // Sample learning modules data
  const learningModules: Module[] = [
    {
      id: '1',
      title: 'Python Basics',
      description: 'Learn Python through interactive games and challenges',
      difficulty: 'Beginner',
      language: 'Python',
      points: 100,
      completed: false,
      games: [
        {
          id: 'p1',
          title: 'Variables & Data Types Quiz',
          type: 'Quiz',
          points: 20,
          completed: false,
          content: {
            questions: [
              {
                id: 'q1',
                question: 'Which of the following is a valid Python variable name?',
                options: ['2myvar', '_myvar', 'my-var', 'my var'],
                correctAnswer: 1,
                explanation: '_myvar is valid. Variable names cannot start with numbers, contain spaces or hyphens.',
              },
              {
                id: 'q2',
                question: 'What is the output of: type(42)',
                options: ['int', 'float', 'number', 'integer'],
                correctAnswer: 0,
                explanation: 'In Python, whole numbers are of type int.',
              },
            ],
          },
        },
        {
          id: 'p2',
          title: 'Python Loops Challenge',
          type: 'CodeChallenge',
          points: 30,
          completed: false,
          content: {
            challenge: {
              instructions: 'Create a for loop that prints numbers from 1 to 10',
              initialCode: 'for i in range():',
              expectedOutput: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10',
              hints: ['Use range(1, 11)', 'Remember range end is exclusive'],
            },
          },
        },
      ],
    },
    {
      id: '2',
      title: 'JavaScript Fundamentals',
      description: 'Master JavaScript basics with interactive exercises',
      difficulty: 'Beginner',
      language: 'JavaScript',
      points: 120,
      completed: false,
      games: [
        {
          id: 'js1',
          title: 'JavaScript Data Types Quiz',
          type: 'Quiz',
          points: 25,
          completed: false,
          content: {
            questions: [
              {
                id: 'q1',
                question: 'What is the typeof null in JavaScript?',
                options: ['null', 'undefined', 'object', 'number'],
                correctAnswer: 2,
                explanation: 'In JavaScript, typeof null returns "object". This is a known language quirk.',
              },
              {
                id: 'q2',
                question: 'Which operator checks for both value and type equality?',
                options: ['==', '===', '=', '!='],
                correctAnswer: 1,
                explanation: 'The === operator checks both value and type equality.',
              },
            ],
          },
        },
      ],
    },
  ];

  const renderGameCard = (game: Game) => (
    <TouchableOpacity
      key={game.id}
      style={styles.gameCard}
      onPress={() => onSelectGame(game)}
    >
      <View style={styles.gameHeader}>
        <Text style={styles.gameTitle}>{game.title}</Text>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>{game.points} pts</Text>
        </View>
      </View>
      <View style={styles.gameType}>
        <Text style={styles.gameTypeText}>{game.type}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderModuleCard = (module: Module) => (
    <View key={module.id} style={styles.moduleCard}>
      <View style={styles.moduleHeader}>
        <Text style={styles.moduleTitle}>{module.title}</Text>
        <View style={styles.languageBadge}>
          <Text style={styles.languageText}>{module.language}</Text>
        </View>
      </View>
      <Text style={styles.moduleDescription}>{module.description}</Text>
      <View style={styles.difficultyBadge}>
        <Text style={styles.difficultyText}>{module.difficulty}</Text>
      </View>
      <View style={styles.gamesList}>
        {module.games.map(renderGameCard)}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {learningModules.map(renderModuleCard)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  moduleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  moduleDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  languageBadge: {
    backgroundColor: '#FFE0B2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  languageText: {
    color: '#F57C00',
    fontSize: 12,
    fontWeight: '500',
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 12,
  },
  difficultyText: {
    color: '#2196F3',
    fontSize: 12,
    fontWeight: '500',
  },
  gamesList: {
    gap: 8,
  },
  gameCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#424242',
    flex: 1,
    marginRight: 8,
  },
  pointsBadge: {
    backgroundColor: '#C8E6C9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '500',
  },
  gameType: {
    marginTop: 4,
  },
  gameTypeText: {
    color: '#757575',
    fontSize: 12,
  },
}); 
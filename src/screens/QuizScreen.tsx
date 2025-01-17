import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Header } from '../components/common/Header';
import { ModuleList } from '../components/modules/ModuleList';
import { Game } from '../types';

const QuizScreen = () => {
  const handleGameSelect = (game: Game) => {
    // Handle quiz selection
    console.log('Selected quiz:', game);
  };

  return (
    <View style={styles.container}>
      <Header userProgress={{ totalPoints: 0, level: 1, completedModules: [], achievements: [] }} />
      <ModuleList onSelectGame={handleGameSelect} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default QuizScreen; 
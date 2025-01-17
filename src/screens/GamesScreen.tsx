import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Header } from '../components/common/Header';
import { GameItem } from '../types';
import { useNavigation } from '@react-navigation/native';
import { GameScreenNavigationProp, RootStackParamList } from '../types/navigation';

type ValidRoutes = keyof RootStackParamList;

const games: GameItem[] = [
  {
    id: '1',
    title: 'Code Runner',
    description: 'Run through a maze while solving coding challenges',
    image: 'https://placeholder.com/150',
    routeName: 'CodeRunner' as ValidRoutes,
  },
  {
    id: '2',
    title: 'Algorithm Battle',
    description: 'Practice sorting algorithms in a fun battle game',
    image: 'https://placeholder.com/150',
    routeName: 'AlgorithmBattle' as ValidRoutes,
  },
  {
    id: '3',
    title: 'Debug Master',
    description: 'Find and fix bugs in the code to progress',
    image: 'https://placeholder.com/150',
    routeName: 'DebugMaster' as ValidRoutes,
  },
];

const GamesScreen = () => {
  const navigation = useNavigation<GameScreenNavigationProp>();

  const handleGamePress = (game: GameItem) => {
    if (isValidRoute(game.routeName)) {
      navigation.navigate(game.routeName);
    }
  };

  const isValidRoute = (route: string): route is ValidRoutes => {
    return ['GamesList', 'CodeRunner', 'AlgorithmBattle', 'DebugMaster'].includes(route);
  };

  const renderGameItem = ({ item }: { item: GameItem }) => (
    <TouchableOpacity 
      style={styles.gameCard}
      onPress={() => handleGamePress(item)}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.gameImage}
      />
      <View style={styles.gameInfo}>
        <Text style={styles.gameTitle}>{item.title}</Text>
        <Text style={styles.gameDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header userProgress={{ totalPoints: 0, level: 1, completedModules: [], achievements: [] }} />
      <FlatList<GameItem>
        data={games}
        renderItem={renderGameItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  gameCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gameImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#e0e0e0',
  },
  gameInfo: {
    padding: 16,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  gameDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default GamesScreen; 
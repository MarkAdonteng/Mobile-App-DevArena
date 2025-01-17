import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Header } from '../components/common/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { VideoItem } from '../types';

const videos: VideoItem[] = [
  {
    id: '1',
    title: 'Introduction to Python',
    duration: '10:30',
    thumbnail: 'https://placeholder.com/300x200',
    views: '1.2k',
  },
  {
    id: '2',
    title: 'JavaScript ES6 Features',
    duration: '15:45',
    thumbnail: 'https://placeholder.com/300x200',
    views: '856',
  },
  {
    id: '3',
    title: 'Data Structures Explained',
    duration: '20:15',
    thumbnail: 'https://placeholder.com/300x200',
    views: '2.1k',
  },
];

const VideosScreen = () => {
  const renderVideoItem = ({ item }: { item: VideoItem }) => (
    <TouchableOpacity style={styles.videoCard}>
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.thumbnail}
        />
        <View style={styles.duration}>
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle}>{item.title}</Text>
        <View style={styles.videoStats}>
          <Icon name="visibility" size={16} color="#666" />
          <Text style={styles.viewCount}>{item.views} views</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header userProgress={{ totalPoints: 0, level: 1, completedModules: [], achievements: [] }} />
      <FlatList<VideoItem>
        data={videos}
        renderItem={renderVideoItem}
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
  videoCard: {
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
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: '#e0e0e0',
  },
  duration: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  videoStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCount: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
  },
});

export default VideosScreen; 
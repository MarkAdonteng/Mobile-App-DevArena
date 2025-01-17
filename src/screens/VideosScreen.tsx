import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Share,
  Modal,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Header } from '../components/common/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { VideoPlayer } from '../components/video/VideoPlayer';

const CATEGORIES = [
  'Python',
  'JavaScript',
  'TypeScript',
  'C++',
  'Java',
  'React',
  'Swift',
  'Go',
  'Next.js',
  'Kotlin',
  'Rust',
  'PHP',
  'Flutter',
  'C#'
] as const;

type ProgrammingCategory = typeof CATEGORIES[number];

type VideoItem = {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  views: string;
  videoId: string;
  description: string;
  category: ProgrammingCategory;
};

const videos: VideoItem[] = [
  // Python Videos
  {
    id: 'py1',
    title: 'Python for Beginners - Full Course',
    duration: '4:26:52',
    thumbnail: 'https://img.youtube.com/vi/rfscVS0vtbw/maxresdefault.jpg',
    views: '10.2M',
    videoId: 'rfscVS0vtbw',
    description: 'Learn Python programming with this comprehensive course for beginners.',
    category: 'Python',
  },
  {
    id: 'py2',
    title: 'Python Project Tutorial - Web Scraper',
    duration: '1:56:21',
    thumbnail: 'https://img.youtube.com/vi/XVv6mJpFOb0/maxresdefault.jpg',
    views: '3.1M',
    videoId: 'XVv6mJpFOb0',
    description: 'Build a real-world web scraper using Python and Beautiful Soup.',
    category: 'Python',
  },

  // JavaScript Videos
  {
    id: 'js1',
    title: 'JavaScript Crash Course For Beginners',
    duration: '1:48:17',
    thumbnail: 'https://img.youtube.com/vi/W6NZfCO5SIk/maxresdefault.jpg',
    views: '4.8M',
    videoId: 'W6NZfCO5SIk',
    description: 'Learn JavaScript in this complete course for beginners.',
    category: 'JavaScript',
  },
  {
    id: 'js2',
    title: 'JavaScript DOM Manipulation',
    duration: '2:12:45',
    thumbnail: 'https://img.youtube.com/vi/5fb2aPlgoys/maxresdefault.jpg',
    views: '2.3M',
    videoId: '5fb2aPlgoys',
    description: 'Master DOM manipulation with JavaScript.',
    category: 'JavaScript',
  },

  // TypeScript Videos
  {
    id: 'ts1',
    title: 'TypeScript Tutorial for Beginners',
    duration: '1:34:28',
    thumbnail: 'https://img.youtube.com/vi/BwuLxPH8IDs/maxresdefault.jpg',
    views: '1.2M',
    videoId: 'BwuLxPH8IDs',
    description: 'Learn TypeScript from scratch with practical examples.',
    category: 'TypeScript',
  },
  {
    id: 'ts2',
    title: 'TypeScript Design Patterns',
    duration: '2:05:11',
    thumbnail: 'https://img.youtube.com/vi/tv-_1er1mWI/maxresdefault.jpg',
    views: '856K',
    videoId: 'tv-_1er1mWI',
    description: 'Advanced TypeScript patterns and best practices.',
    category: 'TypeScript',
  },

  // C++ Videos
  {
    id: 'cpp1',
    title: 'C++ Programming Course - Beginner to Advanced',
    duration: '4:12:57',
    thumbnail: 'https://img.youtube.com/vi/8jLOx1hD3_o/maxresdefault.jpg',
    views: '5.6M',
    videoId: '8jLOx1hD3_o',
    description: 'Complete C++ programming tutorial from basics to advanced topics.',
    category: 'C++',
  },
  {
    id: 'cpp2',
    title: 'C++ Data Structures and Algorithms',
    duration: '3:22:41',
    thumbnail: 'https://img.youtube.com/vi/RBSGKlAvoiM/maxresdefault.jpg',
    views: '2.1M',
    videoId: 'RBSGKlAvoiM',
    description: 'Master DSA concepts using C++.',
    category: 'C++',
  },

  // Java Videos
  {
    id: 'java1',
    title: 'Java Programming for Beginners',
    duration: '3:46:23',
    thumbnail: 'https://img.youtube.com/vi/eIrMbAQSU34/maxresdefault.jpg',
    views: '4.2M',
    videoId: 'eIrMbAQSU34',
    description: 'Complete Java course for beginners.',
    category: 'Java',
  },
  {
    id: 'java2',
    title: 'Spring Boot Tutorial',
    duration: '2:58:32',
    thumbnail: 'https://img.youtube.com/vi/9SGDpanrc8U/maxresdefault.jpg',
    views: '1.8M',
    videoId: '9SGDpanrc8U',
    description: 'Build enterprise applications with Spring Boot.',
    category: 'Java',
  },

  // React Videos
  {
    id: 'react1',
    title: 'React JS Course for Beginners',
    duration: '2:16:35',
    thumbnail: 'https://img.youtube.com/vi/bMknfKXIFA8/maxresdefault.jpg',
    views: '3.4M',
    videoId: 'bMknfKXIFA8',
    description: 'Learn React.js step by step.',
    category: 'React',
  },
  {
    id: 'react2',
    title: 'React Native Crash Course',
    duration: '2:42:15',
    thumbnail: 'https://img.youtube.com/vi/0-S5a0eXPoc/maxresdefault.jpg',
    views: '892K',
    videoId: '0-S5a0eXPoc',
    description: 'Build mobile apps with React Native.',
    category: 'React',
  },

  // Swift Videos
  {
    id: 'swift1',
    title: 'Swift Programming Tutorial',
    duration: '3:15:22',
    thumbnail: 'https://img.youtube.com/vi/comQ1-x2a1Q/maxresdefault.jpg',
    views: '1.1M',
    videoId: 'comQ1-x2a1Q',
    description: 'Learn iOS development with Swift.',
    category: 'Swift',
  },
  {
    id: 'swift2',
    title: 'SwiftUI Masterclass',
    duration: '2:34:18',
    thumbnail: 'https://img.youtube.com/vi/F2ojC6TNwws/maxresdefault.jpg',
    views: '724K',
    videoId: 'F2ojC6TNwws',
    description: 'Build modern iOS apps with SwiftUI.',
    category: 'Swift',
  },

  // Go Videos
  {
    id: 'go1',
    title: 'Go Programming Language Tutorial',
    duration: '2:58:43',
    thumbnail: 'https://img.youtube.com/vi/YS4e4q9oBaU/maxresdefault.jpg',
    views: '1.5M',
    videoId: 'YS4e4q9oBaU',
    description: 'Learn Go programming from scratch.',
    category: 'Go',
  },
  {
    id: 'go2',
    title: 'Building Microservices with Go',
    duration: '3:12:54',
    thumbnail: 'https://img.youtube.com/vi/VzBGi_n65iU/maxresdefault.jpg',
    views: '892K',
    videoId: 'VzBGi_n65iU',
    description: 'Create scalable microservices using Go.',
    category: 'Go',
  },

  // Next.js Videos
  {
    id: 'next1',
    title: 'Next.js Tutorial for Beginners',
    duration: '2:24:45',
    thumbnail: 'https://img.youtube.com/vi/mTz0GXj8NN0/maxresdefault.jpg',
    views: '982K',
    videoId: 'mTz0GXj8NN0',
    description: 'Learn Next.js from scratch.',
    category: 'Next.js',
  },
  {
    id: 'next2',
    title: 'Full Stack Next.js Project',
    duration: '3:45:21',
    thumbnail: 'https://img.youtube.com/vi/KjY94sAKLlw/maxresdefault.jpg',
    views: '654K',
    videoId: 'KjY94sAKLlw',
    description: 'Build a complete web application with Next.js.',
    category: 'Next.js',
  },

  // Kotlin Videos
  {
    id: 'kotlin1',
    title: 'Kotlin Programming Tutorial',
    duration: '2:36:52',
    thumbnail: 'https://img.youtube.com/vi/F9UC9DY-vIU/maxresdefault.jpg',
    views: '1.3M',
    videoId: 'F9UC9DY-vIU',
    description: 'Learn Kotlin for Android development.',
    category: 'Kotlin',
  },
  {
    id: 'kotlin2',
    title: 'Android App Development with Kotlin',
    duration: '4:12:33',
    thumbnail: 'https://img.youtube.com/vi/BBWyXo-3JGQ/maxresdefault.jpg',
    views: '987K',
    videoId: 'BBWyXo-3JGQ',
    description: 'Build Android apps using Kotlin.',
    category: 'Kotlin',
  },

  // Rust Videos
  {
    id: 'rust1',
    title: 'Rust Programming Course',
    duration: '3:36:24',
    thumbnail: 'https://img.youtube.com/vi/MsocPEZBd-M/maxresdefault.jpg',
    views: '756K',
    videoId: 'MsocPEZBd-M',
    description: 'Learn Rust programming language basics.',
    category: 'Rust',
  },
  {
    id: 'rust2',
    title: 'Advanced Rust Programming',
    duration: '2:58:15',
    thumbnail: 'https://img.youtube.com/vi/BpPEoZW5IiY/maxresdefault.jpg',
    views: '432K',
    videoId: 'BpPEoZW5IiY',
    description: 'Advanced concepts in Rust programming.',
    category: 'Rust',
  },

  // PHP Videos
  {
    id: 'php1',
    title: 'PHP For Beginners',
    duration: '4:05:39',
    thumbnail: 'https://img.youtube.com/vi/OK_JCtrrv-c/maxresdefault.jpg',
    views: '2.8M',
    videoId: 'OK_JCtrrv-c',
    description: 'Complete PHP tutorial for beginners.',
    category: 'PHP',
  },
  {
    id: 'php2',
    title: 'Laravel PHP Framework Course',
    duration: '3:22:48',
    thumbnail: 'https://img.youtube.com/vi/MFh0Fd7BsjE/maxresdefault.jpg',
    views: '1.2M',
    videoId: 'MFh0Fd7BsjE',
    description: 'Build web applications with Laravel.',
    category: 'PHP',
  },

  // Flutter Videos
  {
    id: 'flutter1',
    title: 'Flutter Course for Beginners',
    duration: '3:45:23',
    thumbnail: 'https://img.youtube.com/vi/x0uinJvhNxI/maxresdefault.jpg',
    views: '2.1M',
    videoId: 'x0uinJvhNxI',
    description: 'Learn Flutter app development.',
    category: 'Flutter',
  },
  {
    id: 'flutter2',
    title: 'Flutter State Management',
    duration: '2:12:56',
    thumbnail: 'https://img.youtube.com/vi/kJ4Kj1kPEuo/maxresdefault.jpg',
    views: '876K',
    videoId: 'kJ4Kj1kPEuo',
    description: 'Master state management in Flutter.',
    category: 'Flutter',
  },

  // C# Videos
  {
    id: 'csharp1',
    title: 'C# Tutorial For Beginners',
    duration: '4:28:13',
    thumbnail: 'https://img.youtube.com/vi/GhQdlIFylQ8/maxresdefault.jpg',
    views: '3.2M',
    videoId: 'GhQdlIFylQ8',
    description: 'Learn C# programming from scratch.',
    category: 'C#',
  },
  {
    id: 'csharp2',
    title: '.NET Core MVC Course',
    duration: '3:45:32',
    thumbnail: 'https://img.youtube.com/vi/C5cnZ-gZy2I/maxresdefault.jpg',
    views: '1.4M',
    videoId: 'C5cnZ-gZy2I',
    description: 'Build web applications with .NET Core MVC.',
    category: 'C#',
  },
];

const VideosScreen = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProgrammingCategory | null>(null);

  const handleShare = async (video: VideoItem) => {
    try {
      await Share.share({
        message: `Check out this awesome programming tutorial: https://youtu.be/${video.videoId}`,
        title: video.title,
      });
    } catch (error) {
      console.error('Error sharing video:', error);
    }
  };

  const filteredVideos = selectedCategory
    ? videos.filter(video => video.category === selectedCategory)
    : videos;

  const renderVideoItem = ({ item }: { item: VideoItem }) => (
    <TouchableOpacity
      style={styles.videoCard}
      onPress={() => setSelectedVideo(item)}
    >
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
          <View style={styles.statsLeft}>
            <Icon name="visibility" size={16} color="#666" />
            <Text style={styles.viewCount}>{item.views} views</Text>
          </View>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => handleShare(item)}
          >
            <Icon name="share" size={20} color="#2196F3" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategories = () => (
    <View style={styles.categoriesWrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
        snapToAlignment="center"
        decelerationRate="fast"
      >
        <TouchableOpacity
          style={[
            styles.categoryChip,
            !selectedCategory && styles.selectedCategory,
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[
            styles.categoryText,
            !selectedCategory && styles.selectedCategoryText
          ]}>
            All
          </Text>
        </TouchableOpacity>
        {CATEGORIES.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedCategoryText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.gradientOverlay} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <Header text="Video Tutorials" showProgress={false} /> */}
      {renderCategories()}
      <FlatList<VideoItem>
        data={filteredVideos}
        renderItem={renderVideoItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <Modal
        visible={!!selectedVideo}
        animationType="slide"
        onRequestClose={() => setSelectedVideo(null)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setSelectedVideo(null)}
              style={styles.closeButton}
            >
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          {selectedVideo && (
            <>
              <VideoPlayer videoId={selectedVideo.videoId} />
              <View style={styles.videoDetails}>
                <Text style={styles.modalTitle}>{selectedVideo.title}</Text>
                <Text style={styles.modalDescription}>
                  {selectedVideo.description}
                </Text>
                <TouchableOpacity
                  style={styles.shareButtonLarge}
                  onPress={() => handleShare(selectedVideo)}
                >
                  <Icon name="share" size={24} color="#fff" />
                  <Text style={styles.shareButtonText}>Share Video</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  categoriesWrapper: {
    position: 'relative',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoriesContainer: {
    maxHeight: 56,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  gradientOverlay: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 32,
    backgroundColor: 'transparent',
    // Create a gradient effect to indicate more content
    shadowColor: '#fff',
    shadowOffset: { width: -32, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 3,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedCategory: {
    backgroundColor: '#2196F3',
    borderColor: '#1976D2',
  },
  categoryText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#fff',
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCount: {
    marginLeft: 4,
    color: '#666',
  },
  shareButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    padding: 8,
  },
  videoDetails: {
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  shareButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default VideosScreen; 
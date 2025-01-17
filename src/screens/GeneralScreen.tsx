import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header } from '../components/common/Header';

const features = [
  {
    id: '1',
    title: 'Interactive Learning',
    description: 'Learn programming through hands-on quizzes and challenges',
    icon: 'school',
    color: '#2196F3',
  },
  {
    id: '2',
    title: 'Multiple Languages',
    description: 'Master popular programming languages from Python to React',
    icon: 'code',
    color: '#4CAF50',
  },
  {
    id: '3',
    title: 'Track Progress',
    description: 'Monitor your learning journey with detailed statistics',
    icon: 'trending-up',
    color: '#FF9800',
  },
  {
    id: '4',
    title: 'Learn by Playing',
    description: 'Enjoy coding games while improving your skills',
    icon: 'sports-esports',
    color: '#9C27B0',
  },
];

const GeneralScreen = () => {
  const { width } = useWindowDimensions();
  const fadeAnims = features.map(() => new Animated.Value(0));
  const slideAnims = features.map(() => new Animated.Value(50));

  useEffect(() => {
    const animations = features.map((_, index) => {
      const delay = index * 200;
      return Animated.parallel([
        Animated.timing(fadeAnims[index], {
          toValue: 1,
          duration: 1000,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnims[index], {
          toValue: 0,
          duration: 1000,
          delay,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.stagger(100, animations).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* <Header text="Welcome to AIT" showProgress={false} /> */}
      <ScrollView style={styles.content}>
        <View style={styles.heroSection}>
          <Image
            source={{ 
              uri: 'https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg'
            }}
            style={styles.heroImage}
            resizeMode="contain"
          />
          <Text style={styles.heroTitle}>Learn Programming the Fun Way</Text>
          <Text style={styles.heroSubtitle}>
            Interactive lessons, quizzes, and games to help you master coding and algorithms
          </Text>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why Choose AIT?</Text>
          {features.map((feature, index) => (
            <Animated.View
              key={feature.id}
              style={[
                styles.featureCard,
                {
                  opacity: fadeAnims[index],
                  transform: [{ translateY: slideAnims[index] }],
                },
              ]}
            >
              <View style={[styles.iconContainer, { backgroundColor: feature.color }]}>
                <Icon name={feature.icon} size={32} color="#fff" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </Animated.View>
          ))}
        </View>

        <View style={styles.ctaSection}>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Start Learning Now</Text>
            <Icon name="arrow-forward" size={24} color="#fff" />
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
  content: {
    flex: 1,
  },
  heroSection: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  heroImage: {
    width: '80%',
    height: 200,
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
  },
  featuresSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1a1a1a',
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  ctaSection: {
    padding: 24,
    alignItems: 'center',
  },
  ctaButton: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 12,
  },
});

export default GeneralScreen; 
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export type HeaderProps = {
  text?: string;
  showBack?: boolean;
  onBack?: () => void;
  showProgress?: boolean;
  userProgress?: {
    level: number;
    totalPoints: number;
  };
};

export const Header: React.FC<HeaderProps> = ({ 
  text = 'AIT Learning Hub',
  showBack,
  onBack,
  showProgress = false,
  userProgress = { level: 1, totalPoints: 0 }
}) => (
  <View style={styles.header}>
    <View style={styles.headerTop}>
      {showBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      )}
      <Text style={styles.headerTitle}>{text}</Text>
    </View>
    {showProgress && (
      <View style={styles.userStats}>
        <Text style={styles.levelText}>Level {userProgress.level}</Text>
        <Text style={styles.pointsTotal}>{userProgress.totalPoints} Points</Text>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#2196F3',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  levelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  pointsTotal: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
}); 
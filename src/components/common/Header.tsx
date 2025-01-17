import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserProgress } from '../../types';

type HeaderProps = {
  userProgress: UserProgress;
};

export const Header: React.FC<HeaderProps> = ({ userProgress }) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>AIT Learning Hub</Text>
    <View style={styles.userStats}>
      <Text style={styles.levelText}>Level {userProgress.level}</Text>
      <Text style={styles.pointsTotal}>{userProgress.totalPoints} Points</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
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
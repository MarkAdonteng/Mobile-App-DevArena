import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Item = {
  id: number;
  name: string;
  value: number;
  weight: number;
  selected: boolean;
  icon: string;
};

const KnapsackHunt = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [capacity, setCapacity] = useState(20);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [optimalValue, setOptimalValue] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [shake] = useState(new Animated.Value(0));

  useEffect(() => {
    generateItems();
  }, [level]);

  const generateItems = () => {
    const itemCount = 5 + level * 2;
    const newItems: Item[] = [];
    const itemTypes = [
      { name: 'Gold', icon: 'monetization-on' },
      { name: 'Gem', icon: 'diamond' },
      { name: 'Potion', icon: 'local-drink' },
      { name: 'Scroll', icon: 'description' },
      { name: 'Shield', icon: 'security' },
      { name: 'Sword', icon: 'gavel' },
      { name: 'Crown', icon: 'stars' },
      { name: 'Ring', icon: 'circle' },
    ];

    for (let i = 0; i < itemCount; i++) {
      const itemType = itemTypes[i % itemTypes.length];
      newItems.push({
        id: i,
        name: `${itemType.name} ${Math.floor(Math.random() * 100)}`,
        value: Math.floor(Math.random() * 20) + 10,
        weight: Math.floor(Math.random() * 10) + 1,
        selected: false,
        icon: itemType.icon,
      });
    }

    setItems(newItems);
    calculateOptimalValue(newItems, capacity);
  };

  const calculateOptimalValue = (items: Item[], maxCapacity: number) => {
    const n = items.length;
    const dp: number[][] = Array(n + 1)
      .fill(0)
      .map(() => Array(maxCapacity + 1).fill(0));

    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= maxCapacity; w++) {
        if (items[i - 1].weight <= w) {
          dp[i][w] = Math.max(
            items[i - 1].value + dp[i - 1][w - items[i - 1].weight],
            dp[i - 1][w]
          );
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }

    setOptimalValue(dp[n][maxCapacity]);
  };

  const toggleItem = (item: Item) => {
    if (item.selected) {
      // Deselect item
      setCurrentWeight(prev => prev - item.weight);
      setTotalValue(prev => prev - item.value);
    } else {
      // Check if adding item exceeds capacity
      if (currentWeight + item.weight > capacity) {
        shakeAnimation();
        return;
      }
      setCurrentWeight(prev => prev + item.weight);
      setTotalValue(prev => prev + item.value);
    }

    setItems(prev =>
      prev.map(i =>
        i.id === item.id ? { ...i, selected: !i.selected } : i
      )
    );
  };

  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shake, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const checkSolution = () => {
    const efficiency = (totalValue / optimalValue) * 100;
    let newScore = Math.floor(efficiency);
    
    if (efficiency >= 90) {
      newScore += 50; // Bonus for near-optimal solution
    }
    
    setScore(prev => prev + newScore);
    setShowResult(true);
  };

  const nextLevel = () => {
    setLevel(prev => prev + 1);
    setCapacity(prev => prev + 5);
    setCurrentWeight(0);
    setTotalValue(0);
    setShowResult(false);
  };

  const Tutorial = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showTutorial}
      onRequestClose={() => setShowTutorial(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.tutorialContainer}>
          <Text style={styles.tutorialTitle}>Knapsack Hunt</Text>
          
          <ScrollView style={styles.tutorialContent}>
            <View style={styles.tutorialSection}>
              <Text style={styles.tutorialSubtitle}>Goal:</Text>
              <Text style={styles.tutorialText}>
                • Fill your knapsack with the most valuable items{'\n'}
                • Stay within the weight capacity{'\n'}
                • Try to achieve the optimal solution{'\n'}
                • Progress through increasingly difficult levels
              </Text>
            </View>

            <View style={styles.tutorialSection}>
              <Text style={styles.tutorialSubtitle}>How to Play:</Text>
              <Text style={styles.tutorialText}>
                • Tap items to add/remove them from your knapsack{'\n'}
                • Watch your total weight and capacity{'\n'}
                • Submit your solution when ready{'\n'}
                • Score is based on how close you get to the optimal value
              </Text>
            </View>

            <View style={styles.tutorialSection}>
              <Text style={styles.tutorialSubtitle}>Tips:</Text>
              <Text style={styles.tutorialText}>
                • Consider value-to-weight ratios{'\n'}
                • Try different combinations{'\n'}
                • Higher levels have more items{'\n'}
                • Perfect solutions earn bonus points
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={styles.tutorialButton}
            onPress={() => setShowTutorial(false)}
          >
            <Text style={styles.tutorialButtonText}>Start Playing!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Tutorial />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.levelText}>Level {level}</Text>
          <Text style={styles.scoreText}>Score: {score}</Text>
        </View>
        <View style={styles.weightContainer}>
          <Text style={styles.weightText}>
            Weight: {currentWeight}/{capacity}
          </Text>
          <Text style={styles.valueText}>Value: {totalValue}</Text>
        </View>
        <TouchableOpacity 
          style={styles.helpButton}
          onPress={() => setShowTutorial(true)}
        >
          <Icon name="help" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <Animated.View 
        style={[
          styles.itemsContainer,
          { transform: [{ translateX: shake }] }
        ]}
      >
        <ScrollView contentContainerStyle={styles.itemsGrid}>
          {items.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.itemCard,
                item.selected && styles.selectedItem
              ]}
              onPress={() => toggleItem(item)}
            >
              <Icon name={item.icon} size={32} color="#333" />
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemStats}>
                Value: {item.value} | Weight: {item.weight}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      <View style={styles.bottomControls}>
        {!showResult ? (
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={checkSolution}
          >
            <Text style={styles.buttonText}>Submit Solution</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              Optimal Value: {optimalValue}{'\n'}
              Your Value: {totalValue}{'\n'}
              Efficiency: {Math.floor((totalValue / optimalValue) * 100)}%
            </Text>
            <TouchableOpacity 
              style={styles.nextButton}
              onPress={nextLevel}
            >
              <Text style={styles.buttonText}>Next Level</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scoreText: {
    fontSize: 18,
    color: '#666',
  },
  weightContainer: {
    alignItems: 'center',
  },
  weightText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#795548',
  },
  valueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  helpButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  itemsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    marginBottom: 16,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 8,
  },
  itemCard: {
    width: '45%',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    margin: 8,
    alignItems: 'center',
    elevation: 2,
  },
  selectedItem: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
    borderWidth: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
    textAlign: 'center',
  },
  itemStats: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  bottomControls: {
    padding: 16,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  resultText: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tutorialContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  tutorialTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#795548',
  },
  tutorialContent: {
    maxHeight: '60%',
  },
  tutorialSection: {
    marginBottom: 16,
  },
  tutorialSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  tutorialText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  tutorialButton: {
    backgroundColor: '#795548',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  tutorialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default KnapsackHunt; 
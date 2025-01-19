import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type TreeNode = {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x: number;
  y: number;
  highlighted: boolean;
  visited: boolean;
};

type TraversalType = 'inorder' | 'preorder' | 'postorder' | 'levelorder';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NODE_SIZE = 50;
const LEVEL_HEIGHT = 80;

const BinaryTree = () => {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [traversalType, setTraversalType] = useState<TraversalType>('inorder');
  const [userAnswer, setUserAnswer] = useState<number[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<number[]>([]);
  const [showTutorial, setShowTutorial] = useState(true);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shake] = useState(new Animated.Value(0));

  useEffect(() => {
    generateTree();
  }, [level]);

  const generateTree = () => {
    const nodeCount = 3 + level * 2;
    const values = Array.from({ length: nodeCount }, (_, i) => i + 1);
    shuffleArray(values);

    const newRoot = buildBalancedTree(values, 0, values.length - 1);
    if (newRoot) {
      calculateNodePositions(newRoot, SCREEN_WIDTH / 2, 60, SCREEN_WIDTH / 4);
    }
    setRoot(newRoot);
    resetTraversal();
  };

  const shuffleArray = (array: number[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const buildBalancedTree = (values: number[], start: number, end: number): TreeNode | null => {
    if (start > end) return null;

    const mid = Math.floor((start + end) / 2);
    const node: TreeNode = {
      value: values[mid],
      left: null,
      right: null,
      x: 0,
      y: 0,
      highlighted: false,
      visited: false,
    };

    node.left = buildBalancedTree(values, start, mid - 1);
    node.right = buildBalancedTree(values, mid + 1, end);

    return node;
  };

  const calculateNodePositions = (
    node: TreeNode,
    x: number,
    y: number,
    offset: number
  ) => {
    node.x = x;
    node.y = y;

    if (node.left) {
      calculateNodePositions(node.left, x - offset, y + LEVEL_HEIGHT, offset / 2);
    }
    if (node.right) {
      calculateNodePositions(node.right, x + offset, y + LEVEL_HEIGHT, offset / 2);
    }
  };

  const resetTraversal = () => {
    if (!root) return;

    const resetNode = (node: TreeNode) => {
      node.highlighted = false;
      node.visited = false;
      if (node.left) resetNode(node.left);
      if (node.right) resetNode(node.right);
    };

    resetNode(root);
    setUserAnswer([]);
    const answer = getTraversalOrder(root, traversalType);
    setCorrectAnswer(answer);
  };

  const getTraversalOrder = (node: TreeNode, type: TraversalType): number[] => {
    const result: number[] = [];

    switch (type) {
      case 'inorder':
        const inorder = (n: TreeNode) => {
          if (n.left) inorder(n.left);
          result.push(n.value);
          if (n.right) inorder(n.right);
        };
        inorder(node);
        break;

      case 'preorder':
        const preorder = (n: TreeNode) => {
          result.push(n.value);
          if (n.left) preorder(n.left);
          if (n.right) preorder(n.right);
        };
        preorder(node);
        break;

      case 'postorder':
        const postorder = (n: TreeNode) => {
          if (n.left) postorder(n.left);
          if (n.right) postorder(n.right);
          result.push(n.value);
        };
        postorder(node);
        break;

      case 'levelorder':
        const queue: TreeNode[] = [node];
        while (queue.length > 0) {
          const current = queue.shift()!;
          result.push(current.value);
          if (current.left) queue.push(current.left);
          if (current.right) queue.push(current.right);
        }
        break;
    }

    return result;
  };

  const handleNodePress = (node: TreeNode) => {
    if (!isPlaying) return;

    const newRoot = { ...root! };
    const updateNode = (n: TreeNode): TreeNode => {
      if (n.value === node.value) {
        if (n.visited) {
          shakeAnimation();
          return n;
        }
        return { ...n, highlighted: true, visited: true };
      }
      return {
        ...n,
        left: n.left ? updateNode(n.left) : null,
        right: n.right ? updateNode(n.right) : null,
      };
    };

    setRoot(updateNode(newRoot));
    setUserAnswer([...userAnswer, node.value]);

    if (userAnswer.length + 1 === correctAnswer.length) {
      checkAnswer([...userAnswer, node.value]);
    }
  };

  const checkAnswer = (answer: number[]) => {
    const isCorrect = answer.every((value, index) => value === correctAnswer[index]);
    if (isCorrect) {
      const bonus = Math.floor((level * 10) * (1 + level * 0.1));
      setScore(prev => prev + bonus);
      setLevel(prev => prev + 1);
      Alert.alert('Correct!', `+${bonus} points! Moving to next level...`);
    } else {
      shakeAnimation();
      Alert.alert('Incorrect', 'Try again!');
    }
    setIsPlaying(false);
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

  const renderNode = (node: TreeNode) => {
    if (!node) return null;

    return (
      <View key={node.value} style={styles.nodeContainer}>
        <TouchableOpacity
          style={[
            styles.node,
            node.highlighted && styles.highlightedNode,
            node.visited && styles.visitedNode,
          ]}
          onPress={() => handleNodePress(node)}
        >
          <Text style={styles.nodeText}>{node.value}</Text>
        </TouchableOpacity>
        {node.left && (
          <View
            style={[
              styles.edge,
              {
                width: Math.abs(node.x - node.left.x),
                height: LEVEL_HEIGHT,
                transform: [
                  { translateX: (node.left.x - node.x) / 2 },
                  { translateY: LEVEL_HEIGHT / 2 },
                ],
              },
            ]}
          />
        )}
        {node.right && (
          <View
            style={[
              styles.edge,
              {
                width: Math.abs(node.right.x - node.x),
                height: LEVEL_HEIGHT,
                transform: [
                  { translateX: (node.right.x - node.x) / 2 },
                  { translateY: LEVEL_HEIGHT / 2 },
                ],
              },
            ]}
          />
        )}
        {node.left && renderNode(node.left)}
        {node.right && renderNode(node.right)}
      </View>
    );
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
          <Text style={styles.tutorialTitle}>Binary Tree Traversal</Text>
          
          <ScrollView style={styles.tutorialContent}>
            <View style={styles.tutorialSection}>
              <Text style={styles.tutorialSubtitle}>Traversal Types:</Text>
              <Text style={styles.tutorialText}>
                • Inorder: Left → Root → Right{'\n'}
                • Preorder: Root → Left → Right{'\n'}
                • Postorder: Left → Right → Root{'\n'}
                • Level Order: Level by level, left to right
              </Text>
            </View>

            <View style={styles.tutorialSection}>
              <Text style={styles.tutorialSubtitle}>How to Play:</Text>
              <Text style={styles.tutorialText}>
                • Select a traversal type{'\n'}
                • Click nodes in the correct order{'\n'}
                • Complete the traversal to advance{'\n'}
                • Higher levels have larger trees
              </Text>
            </View>

            <View style={styles.tutorialSection}>
              <Text style={styles.tutorialSubtitle}>Tips:</Text>
              <Text style={styles.tutorialText}>
                • Visualize the path before starting{'\n'}
                • Remember the rules for each traversal{'\n'}
                • Watch for patterns in the tree structure{'\n'}
                • Practice all traversal types
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
        <View style={styles.traversalSelector}>
          {(['inorder', 'preorder', 'postorder', 'levelorder'] as TraversalType[]).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.traversalButton,
                traversalType === type && styles.selectedTraversal
              ]}
              onPress={() => {
                setTraversalType(type);
                resetTraversal();
              }}
            >
              <Text style={[
                styles.traversalButtonText,
                traversalType === type && styles.selectedTraversalText
              ]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
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
          styles.treeContainer,
          { transform: [{ translateX: shake }] }
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.treeContent}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <ScrollView
            contentContainerStyle={styles.treeContent}
            showsVerticalScrollIndicator={false}
          >
            {root && renderNode(root)}
          </ScrollView>
        </ScrollView>
      </Animated.View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            setIsPlaying(true);
            resetTraversal();
          }}
        >
          <Text style={styles.buttonText}>
            {isPlaying ? 'Reset' : 'Start Traversal'}
          </Text>
        </TouchableOpacity>
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
  traversalSelector: {
    flexDirection: 'column',
    gap: 8,
  },
  traversalButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  selectedTraversal: {
    backgroundColor: '#607D8B',
  },
  traversalButtonText: {
    fontSize: 14,
    color: '#666',
  },
  selectedTraversalText: {
    color: '#fff',
  },
  helpButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  treeContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  treeContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: SCREEN_WIDTH - 64,
    minHeight: 400,
  },
  nodeContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  highlightedNode: {
    backgroundColor: '#607D8B',
  },
  visitedNode: {
    backgroundColor: '#90A4AE',
  },
  nodeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  edge: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#90A4AE',
  },
  controls: {
    padding: 16,
  },
  startButton: {
    backgroundColor: '#607D8B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
    color: '#607D8B',
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
    backgroundColor: '#607D8B',
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

export default BinaryTree; 
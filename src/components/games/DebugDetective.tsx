import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Bug = {
  id: number;
  type: 'syntax' | 'logic' | 'performance';
  description: string;
  hint: string;
};

type Case = {
  id: number;
  title: string;
  description: string;
  language: 'python' | 'javascript' | 'cpp';
  buggyCode: string;
  correctCode: string;
  bugs: Bug[];
  solved: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  xp: number;
};

const DebugDetective = () => {
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [userCode, setUserCode] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [score, setScore] = useState(0);
  const [rank, setRank] = useState('Rookie Detective');
  const [showTutorial, setShowTutorial] = useState(true);
  const [cases, setCases] = useState<Case[]>([]);
  const [tools, setTools] = useState({
    syntaxHighlighter: true,
    debugger: false,
    profiler: false,
    aiAssistant: false,
  });

  const Tutorial = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showTutorial}
      onRequestClose={() => setShowTutorial(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.tutorialContainer}>
          <Text style={styles.tutorialTitle}>Debug Detective Guide</Text>
          
          <ScrollView style={styles.tutorialContent}>
            <View style={styles.tutorialSection}>
              <Text style={styles.tutorialSubtitle}>Welcome, Detective!</Text>
              <Text style={styles.tutorialText}>
                Your mission is to solve coding mysteries by finding and fixing bugs in the code. Each case presents a unique challenge that will test your debugging skills.
              </Text>
            </View>

            <View style={styles.tutorialSection}>
              <Text style={styles.tutorialSubtitle}>How to Play:</Text>
              <Text style={styles.tutorialText}>
                • Examine the buggy code carefully{'\n'}
                • Use your detective tools to analyze the code{'\n'}
                • Fix the bugs by editing the code{'\n'}
                • Submit your solution when ready{'\n'}
                • Use hints if you're stuck (costs XP)
              </Text>
            </View>

            <View style={styles.tutorialSection}>
              <Text style={styles.tutorialSubtitle}>Detective Tools:</Text>
              <Text style={styles.tutorialText}>
                • Syntax Highlighter: Helps identify syntax errors{'\n'}
                • Debugger: Step through code (unlock at 200 XP){'\n'}
                • Profiler: Find performance issues (unlock at 400 XP){'\n'}
                • AI Assistant: Get smart suggestions (unlock at 800 XP)
              </Text>
            </View>

            <View style={styles.tutorialSection}>
              <Text style={styles.tutorialSubtitle}>Ranks:</Text>
              <Text style={styles.tutorialText}>
                • Rookie Detective (0-199 XP){'\n'}
                • Detective (200-499 XP){'\n'}
                • Senior Detective (500-999 XP){'\n'}
                • Master Detective (1000+ XP)
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={styles.tutorialButton}
            onPress={() => setShowTutorial(false)}
          >
            <Text style={styles.tutorialButtonText}>Start Investigating!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  useEffect(() => {
    initializeCases();
    setUserCode(cases[0]?.buggyCode || '');
  }, []);

  const initializeCases = () => {
    const mysteryCases: Case[] = [
      {
        id: 1,
        title: 'The Missing Semicolon Mystery',
        description: 'A crucial web application has stopped working. The error log shows syntax errors, but the original developer has mysteriously disappeared...',
        language: 'javascript',
        buggyCode: `
function calculateTotal(items) {
  let total = 0
  for (let i = 0; i < items.length i++) {
    total += items[i].price
  }
  return total
}`,
        correctCode: `
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`,
        bugs: [
          {
            id: 1,
            type: 'syntax',
            description: 'Missing semicolons and syntax error in for loop',
            hint: 'JavaScript statements should end with semicolons, and the for loop is missing a semicolon after the condition.',
          },
        ],
        solved: false,
        difficulty: 'easy',
        xp: 100,
      },
      {
        id: 2,
        title: 'The Infinite Loop Investigation',
        description: 'Users report that the application freezes. Initial investigation suggests an infinite loop in the code...',
        language: 'javascript',
        buggyCode: `
function findElement(array, target) {
  let i = 0;
  while (array[i] !== target) {
    i++;
  }
  return i;
}`,
        correctCode: `
function findElement(array, target) {
  let i = 0;
  while (i < array.length && array[i] !== target) {
    i++;
  }
  return i < array.length ? i : -1;
}`,
        bugs: [
          {
            id: 1,
            type: 'logic',
            description: 'Infinite loop when element not found',
            hint: 'What happens when the target element is not in the array? Check array bounds.',
          },
        ],
        solved: false,
        difficulty: 'medium',
        xp: 150,
      },
    ];
    setCases(mysteryCases);
    setCurrentCase(mysteryCases[0]);
  };

  const checkSolution = () => {
    if (!currentCase) return;

    const normalizedUserCode = userCode.replace(/\s+/g, '');
    const normalizedCorrectCode = currentCase.correctCode.replace(/\s+/g, '');

    if (normalizedUserCode === normalizedCorrectCode) {
      const xpEarned = currentCase.xp - (hintsUsed * 20);
      setScore(prev => prev + xpEarned);
      updateRank(score + xpEarned);
      unlockRewards(score + xpEarned);
      
      Alert.alert(
        'Case Solved! 🎉',
        `You earned ${xpEarned} XP!\nNew tools might be available in your detective kit.`,
        [
          {
            text: 'Next Case',
            onPress: () => loadNextCase(),
          },
        ]
      );
    } else {
      Alert.alert(
        'Not Quite Right',
        'The bug is still lurking in the code. Keep investigating!',
        [
          {
            text: 'Try Again',
            style: 'cancel',
          },
          {
            text: 'Use Hint',
            onPress: () => setShowHint(true),
          },
        ]
      );
    }
  };

  const updateRank = (newScore: number) => {
    if (newScore >= 1000) setRank('Master Detective');
    else if (newScore >= 500) setRank('Senior Detective');
    else if (newScore >= 200) setRank('Detective');
    else setRank('Rookie Detective');
  };

  const unlockRewards = (newScore: number) => {
    if (newScore >= 800 && !tools.aiAssistant) {
      setTools(prev => ({ ...prev, aiAssistant: true }));
      Alert.alert('New Tool Unlocked! 🔍', 'AI Assistant is now available in your detective kit.');
    }
    if (newScore >= 400 && !tools.profiler) {
      setTools(prev => ({ ...prev, profiler: true }));
      Alert.alert('New Tool Unlocked! 🔍', 'Code Profiler is now available in your detective kit.');
    }
    if (newScore >= 200 && !tools.debugger) {
      setTools(prev => ({ ...prev, debugger: true }));
      Alert.alert('New Tool Unlocked! 🔍', 'Interactive Debugger is now available in your detective kit.');
    }
  };

  const loadNextCase = () => {
    if (!currentCase) return;
    
    const nextCase = cases.find(c => c.id === currentCase.id + 1);
    if (nextCase) {
      setCurrentCase(nextCase);
      setUserCode(nextCase.buggyCode);
      setHintsUsed(0);
      setShowHint(false);
    } else {
      Alert.alert('Congratulations! 🎉', 'You\'ve solved all available cases!');
    }
  };

  return (
    <View style={styles.container}>
      <Tutorial />
      <View style={styles.header}>
        <View>
          <Text style={styles.rankText}>{rank}</Text>
          <Text style={styles.scoreText}>XP: {score}</Text>
        </View>
        <TouchableOpacity 
          style={styles.helpButton}
          onPress={() => setShowTutorial(true)}
        >
          <Icon name="help" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {currentCase && (
        <ScrollView style={styles.content}>
          <View style={styles.caseCard}>
            <Text style={styles.caseTitle}>{currentCase.title}</Text>
            <Text style={styles.caseDescription}>{currentCase.description}</Text>
            <View style={styles.codeEditor}>
              <Text style={styles.editorLabel}>Debug the code:</Text>
              <TextInput
                style={[styles.codeInput, { fontFamily: 'monospace' }]}
                multiline
                value={userCode}
                onChangeText={setUserCode}
              />
            </View>
            <View style={styles.toolsBar}>
              {Object.entries(tools).map(([tool, unlocked]) => (
                <TouchableOpacity
                  key={tool}
                  style={[styles.tool, !unlocked && styles.toolLocked]}
                  disabled={!unlocked}
                >
                  <Icon 
                    name={
                      tool === 'syntaxHighlighter' ? 'code' :
                      tool === 'debugger' ? 'bug-report' :
                      tool === 'profiler' ? 'speed' :
                      'psychology'
                    }
                    size={24}
                    color={unlocked ? '#2196F3' : '#ccc'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.hintButton}
          onPress={() => setShowHint(true)}
        >
          <Text style={styles.buttonText}>Use Hint</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={checkSolution}
        >
          <Text style={styles.buttonText}>Submit Solution</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showHint}
        transparent
        animationType="fade"
        onRequestClose={() => setShowHint(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.hintContainer}>
            <Text style={styles.hintTitle}>Detective's Hint</Text>
            <Text style={styles.hintText}>
              {currentCase?.bugs[0].hint}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowHint(false);
                setHintsUsed(prev => prev + 1);
              }}
            >
              <Text style={styles.buttonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  rankText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  scoreText: {
    fontSize: 16,
    color: '#666',
  },
  helpButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  caseCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  caseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  caseDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  codeEditor: {
    marginVertical: 16,
  },
  editorLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  codeInput: {
    fontFamily: 'monospace',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    fontSize: 14,
    minHeight: 200,
  },
  toolsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  tool: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  toolLocked: {
    opacity: 0.5,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 4,
  },
  hintButton: {
    flex: 1,
    backgroundColor: '#FF9800',
    padding: 16,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  hintContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    elevation: 4,
  },
  hintTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  hintText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tutorialContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    elevation: 4,
  },
  tutorialTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  tutorialContent: {
    marginBottom: 20,
  },
  tutorialSection: {
    marginBottom: 16,
  },
  tutorialSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tutorialText: {
    fontSize: 14,
    lineHeight: 20,
  },
  tutorialButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tutorialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DebugDetective; 
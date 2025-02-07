import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

type Challenge = {
  title: string;
  description: string;
  template: string;
  solution: string;
  test: (userCode: string) => { passed: boolean; output: string };
};

export const CodeRunner = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const challenges: Challenge[] = [
    {
      title: 'FizzBuzz',
      description: 'Write a function that prints numbers from 1 to n. For multiples of 3, print "Fizz". For multiples of 5, print "Buzz". For numbers that are multiples of both 3 and 5, print "FizzBuzz".',
      template: `function fizzBuzz(n) {
  // Your code here
  let result = [];
  
  return result;
}

// Test with n = 15`,
      solution: `function fizzBuzz(n) {
  let result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 3 === 0 && i % 5 === 0) result.push("FizzBuzz");
    else if (i % 3 === 0) result.push("Fizz");
    else if (i % 5 === 0) result.push("Buzz");
    else result.push(i);
  }
  return result;
}`,
      test: (userCode: string) => {
        try {
          const fn = new Function(`
            ${userCode}
            return fizzBuzz(15);
          `);
          const result = fn();
          const expected = [1,2,"Fizz",4,"Buzz","Fizz",7,8,"Fizz","Buzz",11,"Fizz",13,14,"FizzBuzz"];
          const passed = JSON.stringify(result) === JSON.stringify(expected);
          return {
            passed,
            output: passed ? 
              'Success! All test cases passed!' : 
              `Expected: ${JSON.stringify(expected)}\nGot: ${JSON.stringify(result)}`
          };
        } catch (error) {
          return {
            passed: false,
            output: `Error: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
    },
    {
      title: 'Palindrome Check',
      description: 'Write a function that checks if a given string is a palindrome. Return true if it is, false otherwise. Ignore spaces and case.',
      template: `function isPalindrome(str) {
  // Your code here
  
  return true;
}

// Test with "A man a plan a canal Panama"`,
      solution: `function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}`,
      test: (userCode: string) => {
        try {
          const fn = new Function(`
            ${userCode}
            const testCases = [
              "A man a plan a canal Panama",
              "race a car",
              "Was it a car or a cat I saw?",
              "hello"
            ];
            return testCases.map(test => isPalindrome(test));
          `);
          const result = fn();
          const expected = [true, false, true, false];
          const passed = JSON.stringify(result) === JSON.stringify(expected);
          return {
            passed,
            output: passed ? 
              'Success! All test cases passed!' : 
              `Expected: ${JSON.stringify(expected)}\nGot: ${JSON.stringify(result)}`
          };
        } catch (error) {
          return {
            passed: false,
            output: `Error: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
    }
  ];

  const runCode = () => {
    setIsRunning(true);
    try {
      const result = challenges[currentChallenge].test(code);
      setOutput(result.output);
      if (result.passed) {
        Alert.alert(
          'Success! 🎉',
          'Would you like to try the next challenge?',
          [
            {
              text: 'Stay Here',
              style: 'cancel'
            },
            {
              text: 'Next Challenge',
              onPress: nextChallenge
            }
          ]
        );
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
    setIsRunning(false);
  };

  const loadTemplate = () => {
    setCode(challenges[currentChallenge].template);
    setOutput('');
  };

  const showSolution = () => {
    Alert.alert(
      'Show Solution?',
      'Are you sure you want to see the solution? Try solving it yourself first!',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Show Solution',
          onPress: () => {
            setCode(challenges[currentChallenge].solution);
            setOutput('');
          }
        }
      ]
    );
  };

  const nextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(prev => prev + 1);
      setCode(challenges[currentChallenge + 1].template);
      setOutput('');
    }
  };

  const prevChallenge = () => {
    if (currentChallenge > 0) {
      setCurrentChallenge(prev => prev - 1);
      setCode(challenges[currentChallenge - 1].template);
      setOutput('');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a237e', '#000']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Code Runner</Text>
        <Text style={styles.headerSubtitle}>Challenge your coding skills</Text>
      </LinearGradient>

      <View style={styles.challengeNav}>
        <TouchableOpacity 
          style={[styles.navButton, currentChallenge === 0 && styles.disabledButton]}
          onPress={prevChallenge}
          disabled={currentChallenge === 0}
        >
          <Icon name="chevron-left" size={24} color={currentChallenge === 0 ? '#ccc' : '#fff'} />
        </TouchableOpacity>
        <Text style={styles.challengeCount}>
          Challenge {currentChallenge + 1}/{challenges.length}
        </Text>
        <TouchableOpacity 
          style={[styles.navButton, currentChallenge === challenges.length - 1 && styles.disabledButton]}
          onPress={nextChallenge}
          disabled={currentChallenge === challenges.length - 1}
        >
          <Icon name="chevron-right" size={24} color={currentChallenge === challenges.length - 1 ? '#ccc' : '#fff'} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.challenge}>
          <Text style={styles.title}>{challenges[currentChallenge].title}</Text>
          <Text style={styles.description}>
            {challenges[currentChallenge].description}
          </Text>
        </View>

        <View style={styles.codeArea}>
          <TextInput
            style={styles.codeInput}
            multiline
            value={code}
            onChangeText={setCode}
            placeholder="Write your code here..."
            placeholderTextColor="#666"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.templateButton]} onPress={loadTemplate}>
            <Icon name="refresh" size={20} color="#fff" />
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.runButton]} 
            onPress={runCode}
            disabled={isRunning}
          >
            <Icon name="play-arrow" size={20} color="#fff" />
            <Text style={styles.buttonText}>Run Code</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.solutionButton]} onPress={showSolution}>
            <Icon name="lightbulb" size={20} color="#fff" />
            <Text style={styles.buttonText}>Solution</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.output}>
          <Text style={styles.outputTitle}>Output:</Text>
          <ScrollView style={styles.outputContent}>
            <Text style={styles.outputText}>{output || 'Run your code to see the output...'}</Text>
          </ScrollView>
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
  header: {
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
  },
  challengeNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1a237e',
  },
  navButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  disabledButton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  challengeCount: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  challenge: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  codeArea: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    minHeight: 200,
  },
  codeInput: {
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 14,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
  },
  templateButton: {
    backgroundColor: '#FF9800',
  },
  runButton: {
    backgroundColor: '#4CAF50',
  },
  solutionButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  output: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    minHeight: 150,
    elevation: 3,
  },
  outputTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 8,
  },
  outputContent: {
    maxHeight: 200,
  },
  outputText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#333',
  },
});

export default CodeRunner; 
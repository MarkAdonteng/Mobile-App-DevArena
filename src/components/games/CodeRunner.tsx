import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const CodeRunner = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [currentChallenge, setCurrentChallenge] = useState(0);

  const challenges = [
    {
      title: 'FizzBuzz',
      description: 'Write a function that prints numbers from 1 to n. For multiples of 3, print "Fizz". For multiples of 5, print "Buzz". For numbers that are multiples of both 3 and 5, print "FizzBuzz".',
      template: `function fizzBuzz(n) {\n  // Your code here\n}`,
      test: (code: string) => {
        // Add test logic here
      }
    },
    // Add more challenges
  ];

  const runCode = () => {
    try {
      // Add code execution logic here
      setOutput('Code executed successfully!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setOutput(`Error: ${errorMessage}`);
    }
  };

  return (
    <View style={styles.container}>
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
        />
      </View>

      <TouchableOpacity style={styles.runButton} onPress={runCode}>
        <Icon name="play-arrow" size={24} color="#fff" />
        <Text style={styles.buttonText}>Run Code</Text>
      </TouchableOpacity>

      <View style={styles.output}>
        <Text style={styles.outputTitle}>Output:</Text>
        <ScrollView style={styles.outputContent}>
          <Text>{output}</Text>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  challenge: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  codeArea: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  codeInput: {
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 16,
  },
  runButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  output: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  outputTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  outputContent: {
    flex: 1,
  },
});

export default CodeRunner; 
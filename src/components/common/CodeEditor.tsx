import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';

type Props = {
  code: string;
  language: string;
  readOnly?: boolean;
  onChangeText?: (text: string) => void;
};

const CodeEditor: React.FC<Props> = ({
  code,
  language,
  readOnly = false,
  onChangeText,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.editor}
        value={code}
        onChangeText={onChangeText}
        multiline
        editable={!readOnly}
        scrollEnabled
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
  },
  editor: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    color: '#fff',
    padding: 16,
    minHeight: 200,
    textAlignVertical: 'top',
  },
});

export default CodeEditor; 
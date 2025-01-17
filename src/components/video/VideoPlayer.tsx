import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

type Props = {
  videoId: string;
};

export const VideoPlayer: React.FC<Props> = ({ videoId }) => {
  return (
    <View style={styles.container}>
      <WebView
        style={styles.video}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        source={{
          uri: `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=0&showinfo=0&controls=1`
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 250,
  },
  video: {
    flex: 1,
  },
}); 
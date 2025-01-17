declare module 'react-native-vector-icons/MaterialIcons' {
  import { Component } from 'react';
  import { ImageSourcePropType, TextProps } from 'react-native';

  interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
    source?: ImageSourcePropType;
  }

  class Icon extends Component<IconProps> {}

  export default Icon;
} 
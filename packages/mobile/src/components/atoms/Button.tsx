import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import { Colors } from '@saku/shared';

import { Text } from '@atoms';

interface Props {
  title: string;
  onPress?: () => void;
  alternative?: boolean;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}

const Button = ({ title, onPress, textStyle, style, alternative }: Props) => {
  return (
    <TouchableOpacity
      style={[
        s.container,
        {
          backgroundColor: alternative ? Colors.GRAY : Colors.PINK,
        },
        style,
      ]}
      onPress={onPress}>
      <Text style={[s.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.PINK,
    height: 48,
    width: '86%',
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

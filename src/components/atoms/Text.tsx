import { StyleSheet, Text as RNText, TextProps } from 'react-native';
import React, { forwardRef } from 'react';
import { Colors } from '@constants/colors';

const Text = forwardRef<RNText, TextProps>(({ style, ...props }, ref) => {
  return <RNText style={[s.text, style]} {...props} ref={ref} />;
});

const s = StyleSheet.create({
  text: {
    color: Colors.WHITE,
    fontFamily: 'Quicksand',
  },
});

export default Text;

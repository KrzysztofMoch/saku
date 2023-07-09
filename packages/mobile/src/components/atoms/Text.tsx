import React, { forwardRef } from 'react';
import { StyleSheet, Text as RNText, TextProps } from 'react-native';

import { Colors } from '@saku/shared';

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

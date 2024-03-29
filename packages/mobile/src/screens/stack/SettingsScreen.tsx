import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@saku/shared';

import { Text } from '@atoms';

const SettingsScreen = () => {
  return (
    <View style={s.container}>
      <Text style={s.text}>SettingsScreen</Text>
    </View>
  );
};

export default SettingsScreen;

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.BLACK,
  },
  text: {
    color: Colors.WHITE,
  },
});

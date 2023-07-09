import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@saku/shared';

import { Text } from '@atoms';

const UpdatesScreen = () => {
  return (
    <View style={s.container}>
      <Text style={s.text}>UpdatesScreen</Text>
    </View>
  );
};

export default UpdatesScreen;

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

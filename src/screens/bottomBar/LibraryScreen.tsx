import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Colors } from '@constants/colors';
import { Text } from '@atoms';

const LibraryScreen = () => {
  return (
    <View style={s.container}>
      <Text style={s.text}>LibraryScreen</Text>
    </View>
  );
};

export default LibraryScreen;

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

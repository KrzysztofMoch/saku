import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colors } from '@constants/colors';

const HomeScreen = () => {
  return (
    <View style={s.container}>
      <Text style={s.text}>HomeScreen</Text>
    </View>
  );
};

export default HomeScreen;

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

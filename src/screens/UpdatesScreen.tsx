import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colors } from '@constants/colors';

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

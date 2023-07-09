import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppLogo, Colors } from '@saku/shared';

const PreAppLoadedScreen = () => {
  return (
    <View style={s.container}>
      <AppLogo width={'90%'} />
      <ActivityIndicator size={'large'} style={s.indicator} />
    </View>
  );
};

export default PreAppLoadedScreen;

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BLACK_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    marginTop: 20,
  },
});

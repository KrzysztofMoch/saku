import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from '@store';
import { authorize_user } from '@utils/auth';

const AuthScreen = () => {
  const handleAuth = async () => {
    console.log('Authenticating...');
    await authorize_user();
  };

  return (
    <View style={s.container}>
      <Text style={s.text}>Saku</Text>
      <TouchableOpacity onPress={handleAuth} style={s.button}>
        <Text style={s.authText}>Login with MangaDex</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.button}>
        <Text style={s.authText}>Continue without login</Text>
      </TouchableOpacity>
    </View>
  );
};

const App = () => {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthScreen />
      </PersistGate>
    </ReduxProvider>
  );
};

export default App;

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'black',
    fontSize: 30,
  },
  authText: {
    color: 'blue',
  },
  button: {
    marginVertical: 10,
  },
});

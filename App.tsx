import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import 'react-native-gesture-handler';

import { persistor, store } from '@store';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from '@navigation/stack-navigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  return (
    <SafeAreaProvider style={s.container}>
      <StatusBar barStyle={'light-content'} />
      <GestureHandlerRootView style={s.container}>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NavigationContainer>
              <StackNavigator />
            </NavigationContainer>
          </PersistGate>
        </ReduxProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
});

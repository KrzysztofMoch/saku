import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from '@navigation/stack-navigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  return (
    <SafeAreaProvider style={s.container}>
      <StatusBar barStyle={'light-content'} />
      <GestureHandlerRootView style={s.container}>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
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

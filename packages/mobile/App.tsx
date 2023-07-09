import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from '@navigation/stack-navigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';

import { useAuthStore } from '@store/auth';
import { useHydration } from '@saku/shared';
import { PreAppLoadedScreen } from '@screens';
import database from '@store/db';

const App = () => {
  const hydrated = useHydration(useAuthStore);
  const queryClient = new QueryClient();

  return (
    <GestureHandlerRootView style={s.container}>
      <SafeAreaProvider style={s.container}>
        <StatusBar barStyle={'light-content'} />
        <GestureHandlerRootView style={s.container}>
          <QueryClientProvider client={queryClient}>
            <DatabaseProvider database={database}>
              <NavigationContainer>
                {hydrated ? <StackNavigator /> : <PreAppLoadedScreen />}
              </NavigationContainer>
            </DatabaseProvider>
          </QueryClientProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
});

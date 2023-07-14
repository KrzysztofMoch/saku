import React from 'react';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';

import { Colors } from '@saku/shared';

import {
  AuthScreen,
  MangaDetailsScreen,
  ReaderScreen,
  SettingsScreen,
} from '@screens';
import { useAuthStore } from '@store/auth';

import { BottomTabNavigator } from './bottom-tab-navigator';
import { StackNavigatorParams, StackNavigatorRoutes } from './types';

const Stack = createStackNavigator<StackNavigatorParams>();

export const StackNavigator = () => {
  const { skipped } = useAuthStore();

  return (
    <Stack.Navigator
      screenOptions={screenOptions}
      initialRouteName={
        skipped
          ? StackNavigatorRoutes.BottomTabNavigator
          : StackNavigatorRoutes.Auth
      }>
      <Stack.Screen name={StackNavigatorRoutes.Auth} component={AuthScreen} />
      <Stack.Screen
        name={StackNavigatorRoutes.Settings}
        component={SettingsScreen}
      />
      <Stack.Screen
        name={StackNavigatorRoutes.BottomTabNavigator}
        component={BottomTabNavigator}
      />
      <Stack.Screen
        name={StackNavigatorRoutes.MangaDetails}
        component={MangaDetailsScreen}
      />
      <Stack.Screen
        name={StackNavigatorRoutes.Reader}
        component={ReaderScreen}
        options={{
          gestureEnabled: false,
          cardStyle: { backgroundColor: Colors.BLACK },
        }}
      />
    </Stack.Navigator>
  );
};

const screenOptions: StackNavigationOptions = {
  headerShown: false,
};

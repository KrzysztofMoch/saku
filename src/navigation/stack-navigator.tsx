import React from 'react';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import { AuthScreen, SettingsScreen } from '@screens';
import { BottomTabNavigator } from './bottom-tab-navigator';
import { StackNavigatorParams, StackNavigatorRoutes } from './types';

const Stack = createStackNavigator<StackNavigatorParams>();

export const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={screenOptions}
      initialRouteName={StackNavigatorRoutes.BottomTabNavigator}>
      <Stack.Screen name={StackNavigatorRoutes.Auth} component={AuthScreen} />
      <Stack.Screen
        name={StackNavigatorRoutes.Settings}
        component={SettingsScreen}
      />
      <Stack.Screen
        name={StackNavigatorRoutes.BottomTabNavigator}
        component={BottomTabNavigator}
      />
    </Stack.Navigator>
  );
};

const screenOptions: StackNavigationOptions = {
  headerShown: false,
};

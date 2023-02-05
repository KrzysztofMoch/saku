import React from 'react';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  HomeScreen,
  LibraryScreen,
  SearchScreen,
  UpdatesScreen,
} from '@screens';
import { BottomTabNavigatorRoutes, BottomTabNavigatorParams } from './types';
import { CustomBottomBar } from '@molecules';

const Tab = createBottomTabNavigator<BottomTabNavigatorParams>();

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={screenOptions}
      tabBar={props => <CustomBottomBar {...props} />}>
      <Tab.Screen name={BottomTabNavigatorRoutes.Home} component={HomeScreen} />
      <Tab.Screen
        name={BottomTabNavigatorRoutes.Updates}
        component={UpdatesScreen}
      />
      <Tab.Screen
        name={BottomTabNavigatorRoutes.Search}
        component={SearchScreen}
      />
      <Tab.Screen
        name={BottomTabNavigatorRoutes.Library}
        component={LibraryScreen}
      />
    </Tab.Navigator>
  );
};

const screenOptions: BottomTabNavigationOptions = {
  headerShown: false,
};

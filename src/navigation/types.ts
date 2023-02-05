import { NavigatorScreenParams } from '@react-navigation/native';

export enum BottomTabNavigatorRoutes {
  Home = 'Home',
  Search = 'Search',
  Updates = 'Updates',
  Library = 'Library',
}

export enum StackNavigatorRoutes {
  Auth = 'Auth',
  Settings = 'Settings',
  BottomTabNavigator = 'BottomTabNavigator',
}

export type BottomTabNavigatorParams = {
  [BottomTabNavigatorRoutes.Home]: undefined;
  [BottomTabNavigatorRoutes.Search]: undefined;
  [BottomTabNavigatorRoutes.Updates]: undefined;
  [BottomTabNavigatorRoutes.Library]: undefined;
};

export type StackNavigatorParams = {
  [StackNavigatorRoutes.Auth]: undefined;
  [StackNavigatorRoutes.Settings]: undefined;
  [StackNavigatorRoutes.BottomTabNavigator]: NavigatorScreenParams<BottomTabNavigatorParams>;
};

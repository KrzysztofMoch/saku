import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import {
  BottomTabNavigatorParams,
  BottomTabNavigatorRoutes,
  StackNavigatorParams,
  StackNavigatorRoutes,
} from '@navigation/types';

type StackScreenNavigationProp<T extends StackNavigatorRoutes> =
  StackScreenProps<StackNavigatorParams, T>;

type BottomTabScreenNavigationProp<T extends BottomTabNavigatorRoutes> =
  CompositeScreenProps<
    BottomTabScreenProps<BottomTabNavigatorParams, T>,
    StackScreenNavigationProp<StackNavigatorRoutes.BottomTabNavigator>
  >;

export type { BottomTabScreenNavigationProp, StackScreenNavigationProp };

import {
  StackNavigatorParams,
  StackNavigatorRoutes,
  BottomTabNavigatorParams,
  BottomTabNavigatorRoutes,
} from '@navigation/types';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

type StackScreenNavigationProp<T extends StackNavigatorRoutes> =
  StackScreenProps<StackNavigatorParams, T>;

type BottomTabScreenNavigationProp<T extends BottomTabNavigatorRoutes> =
  CompositeScreenProps<
    StackScreenNavigationProp<StackNavigatorRoutes.BottomTabNavigator>,
    BottomTabScreenProps<BottomTabNavigatorParams, T>
  >;

export type { StackScreenNavigationProp, BottomTabScreenNavigationProp };

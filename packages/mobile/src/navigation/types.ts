import { NavigatorScreenParams } from '@react-navigation/native';

import { MangaSearchFilters } from '@saku/shared';

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
  MangaDetails = 'MangaDetails',
  Reader = 'Reader',
}

export type BottomTabNavigatorParams = {
  [BottomTabNavigatorRoutes.Home]: undefined;
  [BottomTabNavigatorRoutes.Search]: Partial<MangaSearchFilters>;
  [BottomTabNavigatorRoutes.Updates]: undefined;
  [BottomTabNavigatorRoutes.Library]: undefined;
};

export type StackNavigatorParams = {
  [StackNavigatorRoutes.Auth]: undefined;
  [StackNavigatorRoutes.Settings]: undefined;
  [StackNavigatorRoutes.BottomTabNavigator]: NavigatorScreenParams<BottomTabNavigatorParams>;
  [StackNavigatorRoutes.MangaDetails]: {
    mangaId: string;
  };
  [StackNavigatorRoutes.Reader]: {
    chapterId: string;
    mangaId: string;
    page?: number;
    volume?: string;
  };
};

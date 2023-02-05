import { StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Colors } from '@constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ClockFilledIcon,
  ClockIcon,
  HomeFilledIcon,
  HomeIcon,
  LibraryFilledIcon,
  LibraryIcon,
  SearchFilledIcon,
  SearchIcon,
} from '@icons';
import { BottomBarButton } from '@atoms';
import { BottomTabNavigatorRoutes } from '@navigation/types';

const CustomBottomBar = ({ state, navigation }: BottomTabBarProps) => {
  const { bottom: bottomInset } = useSafeAreaInsets();

  const positionProps = useMemo(
    () => ({
      bottom: bottomInset,
    }),
    [bottomInset],
  );

  return (
    <View style={[s.container, positionProps]}>
      <BottomBarButton
        label={'Home'}
        onPress={() => navigation.navigate(BottomTabNavigatorRoutes.Home)}
        icon={<HomeIcon />}
        focusedIcon={<HomeFilledIcon />}
        focused={state.index === 0}
      />
      <BottomBarButton
        label={'Updates'}
        onPress={() => navigation.navigate(BottomTabNavigatorRoutes.Updates)}
        icon={<ClockIcon />}
        focusedIcon={<ClockFilledIcon />}
        focused={state.index === 1}
      />
      <BottomBarButton
        label={'Search'}
        onPress={() => navigation.navigate(BottomTabNavigatorRoutes.Search)}
        icon={<SearchIcon />}
        focusedIcon={<SearchFilledIcon />}
        focused={state.index === 2}
      />
      <BottomBarButton
        label={'Library'}
        onPress={() => navigation.navigate(BottomTabNavigatorRoutes.Library)}
        icon={<LibraryIcon />}
        focusedIcon={<LibraryFilledIcon />}
        focused={state.index === 3}
      />
    </View>
  );
};

export default CustomBottomBar;

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    position: 'absolute',
    left: 0,
    height: 54,
    width: '94%',
    marginHorizontal: '3%',
    borderRadius: 15,
    backgroundColor: Colors.PINK,
  },
  button: {
    marginTop: 8,
  },
});

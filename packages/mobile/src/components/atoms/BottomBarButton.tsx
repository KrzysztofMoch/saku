import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import React, { useCallback, useMemo } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BottomTabNavigatorRoutes } from '@navigation/types';
import {
  HomeFilledIcon,
  HomeIcon,
  ClockFilledIcon,
  ClockIcon,
  SearchFilledIcon,
  SearchIcon,
  LibraryFilledIcon,
  LibraryIcon,
  Colors,
} from '@saku/shared';
import { Text } from '@atoms';

interface Props {
  label: string;
  name: string;
  onPress: (key: string, isFocused: boolean) => void;
  isFocused: boolean;
  onLayout: (event: LayoutChangeEvent, name: string) => void;
}

const getIcon = (name: string, focused: boolean) => {
  switch (name) {
    case BottomTabNavigatorRoutes.Home:
      return focused ? <HomeFilledIcon color={Colors.PINK} /> : <HomeIcon />;
    case BottomTabNavigatorRoutes.Updates:
      return focused ? <ClockFilledIcon color={Colors.PINK} /> : <ClockIcon />;
    case BottomTabNavigatorRoutes.Search:
      return focused ? (
        <SearchFilledIcon color={Colors.PINK} />
      ) : (
        <SearchIcon />
      );
    case BottomTabNavigatorRoutes.Library:
      return focused ? (
        <LibraryFilledIcon color={Colors.PINK} />
      ) : (
        <LibraryIcon />
      );
    default:
      return focused ? <HomeFilledIcon color={Colors.PINK} /> : <HomeIcon />;
  }
};

const BottomBarButton = ({
  label,
  name,
  isFocused,
  onPress,
  onLayout,
}: Props) => {
  const onPressHandler = useCallback(() => {
    onPress(name, isFocused);
  }, [isFocused, name, onPress]);

  const onLayoutHandler = useCallback(
    (event: LayoutChangeEvent) => {
      onLayout(event, name);
    },
    [name, onLayout],
  );

  const Icon = useMemo(() => getIcon(name, isFocused), [isFocused, name]);

  return (
    <View style={s.container} onLayout={onLayoutHandler}>
      <TouchableOpacity onPress={onPressHandler} style={s.button}>
        {Icon}
        {!isFocused && <Text style={s.label}>{label}</Text>}
      </TouchableOpacity>
    </View>
  );
};

export default BottomBarButton;

const s = StyleSheet.create({
  container: {
    height: 54,
    width: 58,
  },
  button: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 12,
  },
});

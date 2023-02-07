import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import React, { useCallback, useMemo, useReducer } from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Colors } from '@constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomBarButton } from '@atoms';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface IconPos {
  name: string;
  x: number;
}

const CustomBottomBar = ({
  state,
  navigation,
  descriptors,
}: BottomTabBarProps) => {
  const { bottom: bottomInset } = useSafeAreaInsets();
  const [iconsPos, iconsPosDispatch] = useReducer<
    (prevState: IconPos[], action: IconPos) => IconPos[]
  >((prevState, { name, x }) => {
    const index = prevState.findIndex(item => item.name === name);

    if (index === -1) {
      return [...prevState, { name, x }];
    }

    return prevState.map((item, i) => {
      if (i === index) {
        return { name, x };
      }

      return item;
    });
  }, []);

  const positionProps = useMemo(
    () => ({
      bottom: bottomInset,
    }),
    [bottomInset],
  );

  const hoverTranslateX = useMemo(() => {
    const index = state.index;
    const { x } = iconsPos.find(
      ({ name }) => name === state.routeNames[index],
    ) || {
      x: -1,
    };

    return x;
  }, [iconsPos, state.index, state.routeNames]);

  const hoverStyle = useAnimatedStyle(() => {
    const x = hoverTranslateX;

    return {
      opacity: x === -1 ? 0 : 1,
      transform: [
        {
          translateX: withTiming(x - 25, {
            duration: 170,
          }),
        },
      ],
    };
  }, [iconsPos, state.index]);

  const onLayout = useCallback(
    (
      {
        nativeEvent: {
          layout: { x },
        },
      }: LayoutChangeEvent,
      name: string,
    ) => {
      iconsPosDispatch({ name, x });
    },
    [],
  );

  const onPress = useCallback(
    (key: string, isFocused: boolean) => {
      const event = navigation.emit({
        type: 'tabPress',
        target: key,
        canPreventDefault: true,
      });

      if (!event.defaultPrevented && !isFocused) {
        navigation.navigate(key);
      }
    },
    [navigation],
  );

  return (
    <View style={[s.container, positionProps]}>
      <Animated.View style={[s.hover, hoverStyle]} />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;
        const isFocused = state.index === index;

        return (
          <BottomBarButton
            key={route.key}
            label={label}
            name={route.name}
            isFocused={isFocused}
            onPress={onPress}
            onLayout={onLayout}
          />
        );
      })}
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
  hover: {
    position: 'absolute',
    bottom: 0,
    height: 54,
    width: 54,
    borderRadius: 15,
    backgroundColor: Colors.WHITE,
  },
});

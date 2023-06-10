import React, { useCallback, useEffect, useRef } from 'react';
import { Dimensions, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { snapPoint } from 'react-native-redash';

interface Card {
  width: number;
  spacing?: number;
}

interface CenterCardCarouselProps<T extends any[]> {
  data: T;
  renderItem: ({
    item,
    index,
  }: {
    item: T[number];
    index: number;
  }) => React.ReactNode;
  keyExtractor?: (item: T[number]) => string;
  card: Card;
  style?: StyleProp<ViewStyle>;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  scaleFirst?: boolean;
}

interface ItemWrapperProps extends Card {
  item: any;
  children: React.ReactNode;
  index: number;
  offset: SharedValue<number>;
  scaleFirst: boolean;
}

const getNextSnapPoint = (snapPoints: number[], offset: number) => {
  const currentSnapPoint = snapPoint(offset, 0, snapPoints);
  const currentIndex = snapPoints.indexOf(currentSnapPoint);

  if (currentIndex === snapPoints.length - 1) {
    return snapPoints[0];
  }

  return snapPoints[currentIndex + 1];
};

const SCREEN_WIDTH = Dimensions.get('window').width;

const ItemWrapper = ({
  children,
  index,
  offset,
  width,
  spacing = 0,
  scaleFirst,
}: ItemWrapperProps) => {
  const [visible, setVisible] = React.useState(false);

  const scale = useDerivedValue(() => {
    const distance = Math.abs(-offset.value - index * (width + spacing));

    if (!scaleFirst) {
      return 1;
    }

    return interpolate(
      distance,
      [0, width * 0.4, width],
      [1, 0.9, 0.8],
      'clamp',
    );
  }, [offset, index, scaleFirst]);

  const currentIndex = useDerivedValue(() => {
    return Math.round(Math.abs(-offset.value / (width + spacing)));
  }, [offset]);

  const itemsOnScreen = Math.ceil(SCREEN_WIDTH / (width + spacing));

  useAnimatedReaction(
    () => currentIndex.value,
    current => {
      runOnJS(setVisible)(
        current - itemsOnScreen + 1 <= index &&
          current + itemsOnScreen + 1 >= index,
      );
    },
    [currentIndex, index],
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  }, [scale]);

  return (
    <Animated.View style={[animatedStyle, { width, marginRight: spacing }]}>
      {visible ? children : null}
    </Animated.View>
  );
};

const CenterCardCarousel = <T extends any[] = any[]>({
  data,
  style,
  renderItem,
  keyExtractor,
  card: { width, spacing = 0 },
  autoScroll = false,
  autoScrollInterval = 7500,
  scaleFirst = false,
}: CenterCardCarouselProps<T>) => {
  const offset = useSharedValue(0);
  const isScrolling = useSharedValue(false);
  const autoScrollRef = useRef<null | number>(null);

  const _keyExtractor = useCallback(
    (item: T[number]) => {
      if (keyExtractor) {
        return keyExtractor(item);
      }

      if ('id' in item) {
        return item.id;
      }

      throw new Error('No key extractor provided and no id property found');
    },
    [keyExtractor],
  );

  const renderItemWrapper = useCallback(
    (item: (typeof data)[number], index: number) => {
      return (
        <ItemWrapper
          scaleFirst={scaleFirst}
          offset={offset}
          key={_keyExtractor(item)}
          index={index}
          item={item}
          width={width}
          spacing={spacing}>
          {renderItem({ item, index })}
        </ItemWrapper>
      );
    },
    [_keyExtractor, offset, renderItem, scaleFirst, spacing, width],
  );

  const snapPoints = data.map((_, index) => -index * (width + spacing));

  const autoScrollHandler = useCallback(() => {
    if (!isScrolling.value && autoScroll) {
      offset.value = withTiming(
        snapPoint(getNextSnapPoint(snapPoints, offset.value), 0, snapPoints),
      );
    }
  }, [autoScroll, isScrolling.value, offset, snapPoints]);

  const setAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }

    autoScrollRef.current = setInterval(autoScrollHandler, autoScrollInterval);
  }, [autoScrollHandler, autoScrollInterval]);

  const panGestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { offset: number }
  >({
    onStart: (_, ctx) => {
      ctx.offset = offset.value;
      isScrolling.value = true;
    },
    onActive: (event, ctx) => {
      offset.value = ctx.offset + event.translationX;
    },
    onEnd: event => {
      const { velocityX } = event;
      offset.value = withTiming(snapPoint(offset.value, velocityX, snapPoints));
      isScrolling.value = false;
      runOnJS(setAutoScroll)();
    },
  });

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: offset.value }],
    }),
    [offset],
  );

  useEffect(() => {
    setAutoScroll();

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [setAutoScroll]);

  return (
    <PanGestureHandler onGestureEvent={panGestureHandler}>
      <Animated.View style={[s.list, animatedStyle, style]}>
        {data.map(renderItemWrapper)}
      </Animated.View>
    </PanGestureHandler>
  );
};

export default CenterCardCarousel;

const s = StyleSheet.create({
  list: {
    flexDirection: 'row',
  },
});

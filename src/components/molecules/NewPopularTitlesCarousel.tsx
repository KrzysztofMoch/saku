import {
  Dimensions,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { MangaResponse } from '@api/manga-api';
import {
  NewPopularTitleCard,
  NEW_POPULAR_CARD_WIDTH,
  NEW_POPULAR_CARD_MARGIN,
} from '@atoms';
import { Colors } from '@constants/colors';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { snapPoint } from 'react-native-redash';

interface NewPopularTitlesCarouselProps {
  data: MangaResponse['data'];
  style?: StyleProp<ViewStyle>;
}

const getNextSnapPoint = (snapPoints: number[], offset: number) => {
  const currentSnapPoint = snapPoint(offset, 0, snapPoints);
  const currentIndex = snapPoints.indexOf(currentSnapPoint);

  if (currentIndex === snapPoints.length - 1) {
    return snapPoints[0];
  }

  return snapPoints[currentIndex + 1];
};

const NewPopularTitlesCarousel = ({
  data,
  style,
}: NewPopularTitlesCarouselProps) => {
  const offset = useSharedValue(0);
  const isScrolling = useSharedValue(false);

  const snapPoints = data.map((_, index) => {
    return index * -(NEW_POPULAR_CARD_WIDTH + NEW_POPULAR_CARD_MARGIN);
  });

  const autoScroll = useCallback(() => {
    if (!isScrolling.value) {
      offset.value = withTiming(
        snapPoint(getNextSnapPoint(snapPoints, offset.value), 0, snapPoints),
        undefined,
        isFinished => {
          if (isFinished) {
            isScrolling.value = false;
          }
        },
      );
    }
  }, [isScrolling, offset, snapPoints]);

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
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  }, [offset]);

  useEffect(() => {
    const autoScrollInterval = setInterval(autoScroll, 7500);

    return () => {
      clearInterval(autoScrollInterval);
    };
  }, [autoScroll]);

  return (
    <View style={style}>
      <View style={s.listHeader}>
        <Text style={s.listHeaderTitle}>New Popular Titles</Text>
      </View>
      <PanGestureHandler onGestureEvent={panGestureHandler}>
        <Animated.View style={[s.list, animatedStyle]}>
          {data.map((item, index) => (
            <NewPopularTitleCard
              {...item}
              offset={offset}
              number={index + 1}
              style={s.card}
              key={item.id}
            />
          ))}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const s = StyleSheet.create({
  listHeader: {
    flexDirection: 'row',
    paddingHorizontal: NEW_POPULAR_CARD_MARGIN + 10,
    marginBottom: 10,
  },
  listHeaderTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.WHITE,
  },
  list: {
    flexDirection: 'row',
    width: Dimensions.get('screen').width,
  },
  card: {
    marginLeft: NEW_POPULAR_CARD_MARGIN,
  },
});

export default NewPopularTitlesCarousel;

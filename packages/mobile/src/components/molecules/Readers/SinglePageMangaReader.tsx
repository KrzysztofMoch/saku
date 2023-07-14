import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { ImageLoaderState } from '@saku/shared';

import { ChapterPage, Zoom, ZoomRef } from '@atoms';
import { StackNavigatorParams, StackNavigatorRoutes } from '@navigation/types';

type Navigation = StackNavigationProp<
  StackNavigatorParams,
  StackNavigatorRoutes.Reader
>;

type Props = {
  pages: string[];
  toggleReaderMenu: () => void;
  onPageChange: (page: number) => void;
} & StackNavigatorParams[StackNavigatorRoutes.Reader];

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const SinglePageMangaReader = ({
  page: N_PAGE = 0,
  pages,
  toggleReaderMenu,
  onPageChange,
}: Props) => {
  const navigation = useNavigation<Navigation>();

  const [loaderState, setLoaderState] = useState<ImageLoaderState>('N_PAGE');
  const currentPage = useSharedValue(0);

  const flatListRef = useRef<FlatList<string>>(null);
  const zoomRefs = useSharedValue<
    {
      index: number;
      ref: ZoomRef;
    }[]
  >([]);

  const loaderStateTracker = useRef({
    N_PAGE: false,
    N_PLUS_1: false,
    N_PLUS_2: false,
    REST: false,
  });

  const onImageLoaded = useCallback(
    (index: number) => {
      if (index === N_PAGE) {
        loaderStateTracker.current.N_PAGE = true;
        setLoaderState('N_PLUS_1_2');
        return;
      }

      if (index === N_PAGE + 1) {
        loaderStateTracker.current.N_PLUS_1 = true;
      }

      if (index === N_PAGE + 2) {
        loaderStateTracker.current.N_PLUS_2 = true;
      }

      const { N_PLUS_1, N_PLUS_2 } = loaderStateTracker.current;

      if (N_PLUS_1 && N_PLUS_2) {
        setLoaderState('REST');
      }
    },
    [N_PAGE],
  );

  const addZoomRef = useCallback(
    (ref: ZoomRef | null, index: number) => {
      const exist = zoomRefs.value.find(({ index: i }) => i === index);

      if (!ref || exist) {
        return;
      }

      zoomRefs.value.push({ index, ref });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const renderItem = useCallback(
    ({ item: url, index }: { item: string; index: number }) => {
      const shouldLoadImage = () => {
        switch (loaderState) {
          case 'N_PAGE':
            // Load only N page
            return index === N_PAGE;
          case 'N_PLUS_1_2':
            // Load N + 1, N + 2 pages and keep loaded N page
            return (
              index === N_PAGE || index === N_PAGE + 1 || index === N_PAGE + 2
            );
          default:
            // Load rest of the pages
            return true;
        }
      };

      return (
        <View style={s.imageContainer}>
          <Zoom ref={ref => addZoomRef(ref, index)}>
            <ChapterPage
              pageUrl={url}
              index={index}
              onImageLoaded={onImageLoaded}
              shouldLoadImage={shouldLoadImage()}
            />
          </Zoom>
        </View>
      );
    },

    [onImageLoaded, loaderState, N_PAGE, addZoomRef],
  );

  const nextPage = useCallback(() => {
    if (pages && currentPage.value === pages?.length - 1) {
      navigation.goBack();
      return;
    }

    const newPage = currentPage.value + 1;
    currentPage.value = newPage;

    flatListRef.current?.scrollToIndex({
      index: newPage,
      animated: false,
    });

    onPageChange(newPage);
  }, [currentPage, navigation, onPageChange, pages]);

  const prevPage = useCallback(() => {
    if (pages && currentPage.value === 0) {
      navigation.goBack();
      return;
    }

    const newPage = currentPage.value + 1;
    currentPage.value = newPage;

    flatListRef.current?.scrollToIndex({
      index: newPage,
      animated: false,
    });

    onPageChange(newPage);
  }, [currentPage, navigation, onPageChange, pages]);

  const readerGestures = useMemo(() => {
    const tapGesture = Gesture.Tap()
      .onStart(e => {
        const { absoluteX } = e;

        const isZoomed = zoomRefs.value
          ?.find(({ index }) => index === currentPage.value)
          ?.ref.isZoomed();

        // If user zoomed we don't want to handle navigation
        if (isZoomed) {
          return;
        }

        // Left side of the screen
        if (absoluteX < SCREEN_WIDTH * 0.32) {
          runOnJS(prevPage)();
          return;
        }

        // Right side of the screen
        if (absoluteX > SCREEN_WIDTH * 0.68) {
          runOnJS(nextPage)();
          return;
        }

        runOnJS(toggleReaderMenu)();
      })
      .numberOfTaps(1);

    // Because Zoom`s GestureDetector tap gestures are overridden
    // we need to add zoom out gesture here
    const zoomOutGesture = Gesture.Tap()
      .onStart(_ => {
        zoomRefs.value
          ?.find(({ index }) => index === currentPage.value)
          ?.ref.zoomOut();
      })
      .numberOfTaps(2);

    return Gesture.Exclusive(zoomOutGesture, tapGesture);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextPage, prevPage, toggleReaderMenu]);

  console.log('render SinglePageMangaReader');

  return (
    <GestureDetector gesture={readerGestures}>
      <FlatList
        ref={flatListRef}
        data={pages}
        renderItem={renderItem}
        style={s.list}
        horizontal
        scrollEnabled={false}
      />
    </GestureDetector>
  );
};

export default memo(SinglePageMangaReader);

const s = StyleSheet.create({
  imageContainer: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

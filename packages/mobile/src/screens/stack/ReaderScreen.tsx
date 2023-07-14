import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Back, Colors, useChapterPages } from '@saku/shared';

import { Text } from '@atoms';
import { SinglePageMangaReader } from '@molecules';
import { StackNavigatorRoutes } from '@navigation/types';
import { StackScreenNavigationProp } from '@types';

type Props = StackScreenNavigationProp<StackNavigatorRoutes.Reader>;

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// NOTE: All views in reader should have transparent background
// for easy background color change. Background color is set in
// stack navigator in options for reader screen.
const ReaderScreen = ({ navigation, route }: Props) => {
  const { chapterId, page = 0, title, volume } = route.params;
  const { top: topInset } = useSafeAreaInsets();

  const uiState = useSharedValue<'visible' | 'hidden'>('visible');
  const [currentPage, setCurrentPage] = useState(page);

  const { data: pages, status: pageStatues } = useChapterPages(chapterId);

  const toggleUI = useCallback(() => {
    const state = uiState.value === 'visible' ? 'hidden' : 'visible';
    uiState.value = state;

    StatusBar.setHidden(state === 'hidden');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    // Maybe sync reading progress here in the future

    setCurrentPage(newPage);
  }, []);

  const handleGoBack = useCallback(() => {
    // Maybe sync reading progress here in the future

    navigation.goBack();
  }, [navigation]);

  const progressStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(uiState.value === 'visible' ? 1 : 0),
      bottom: withTiming(uiState.value === 'visible' ? 70 : 30),
    }),
    [],
  );

  const headerStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(uiState.value === 'visible' ? 1 : 0),
      paddingTop: withTiming(uiState.value === 'visible' ? topInset : 0),
      top: withTiming(uiState.value === 'visible' ? 0 : -60),
    }),
    [topInset],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      toggleUI();
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (pageStatues === 'loading' || pageStatues === 'error' || !pages) {
    return (
      <View style={s.loaderContainer}>
        {pageStatues === 'error' && <Text>Something went wrong</Text>}
        {(pageStatues === 'loading' || !pages) && (
          <ActivityIndicator size="large" color={Colors.WHITE} />
        )}
      </View>
    );
  }

  //TODO: Create reader component for manhwa

  return (
    <View style={s.container}>
      <Animated.View style={[s.header, headerStyle]}>
        <TouchableOpacity style={s.headerButton} onPress={handleGoBack}>
          <Back />
        </TouchableOpacity>
        <View style={s._flex}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={s.headerText}>
            {title + '\n'}
          </Text>
          <Text style={s.headerText}>{volume}</Text>
        </View>
        <View style={s.headerButton} />
      </Animated.View>
      <SinglePageMangaReader
        chapterId={chapterId}
        pages={pages}
        page={page}
        toggleReaderMenu={toggleUI}
        onPageChange={handlePageChange}
      />
      <Animated.View style={[s.progressContainer, progressStyle]}>
        <Text style={s.progressText}>
          {currentPage + 1}/{pages.length}
        </Text>
      </Animated.View>
    </View>
  );
};

export default ReaderScreen;

const s = StyleSheet.create({
  _flex: {
    flex: 1,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  header: {
    position: 'absolute',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.BLACK_LIGHT,
    width: SCREEN_WIDTH,
    height: 100,
    left: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    flexDirection: 'row',
    zIndex: 1,
  },
  headerButton: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loaderContainer: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.GRAY,
    width: 60,
    height: 32,
    borderRadius: 15,
    left: SCREEN_WIDTH / 2 - 30,
  },
  progressText: {
    fontSize: 16,
  },
});

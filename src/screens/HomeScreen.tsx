import React from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '@constants/colors';
import {
  LatestUpdatesList,
  NewPopularTitlesCarousel,
  SeasonalTitlesCarousel,
} from '@molecules';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

// TODO: create header component

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();

  return (
    <ScrollView
      style={[{ paddingTop: top }, s.container]}
      contentContainerStyle={s.contentContainer}>
      <NewPopularTitlesCarousel style={s.list} />
      <SeasonalTitlesCarousel style={s.list} />
      <LatestUpdatesList style={s.list} />
    </ScrollView>
  );
};

export default HomeScreen;

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BLACK,
  },
  contentContainer: {
    paddingBottom: 180,
  },
  text: {
    color: Colors.WHITE,
  },
  list: {
    marginTop: 10,
  },
});

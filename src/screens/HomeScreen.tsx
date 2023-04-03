import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@constants/colors';
import { useNewPopularTitles } from '@hooks';
import { NewPopularTitlesCarousel } from '@molecules';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// TODO: create a custom horizontal scroll view component for seasonal and recently added titles

// TODO: create a custom list component for recently updated chapters

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();

  const { data: newPopularTitles, status: newPopularTitlesStatus } =
    useNewPopularTitles();

  return (
    <View style={[s.container, { paddingTop: top }]}>
      {newPopularTitlesStatus === 'loading' && (
        <Text style={s.text}>Loading... (so far so good)</Text>
      )}
      {newPopularTitlesStatus === 'error' && <Text style={s.text}>Error</Text>}
      {newPopularTitlesStatus === 'success' &&
        newPopularTitles.ok &&
        newPopularTitles.data && (
          <NewPopularTitlesCarousel
            data={newPopularTitles.data.data}
            style={s.newPopularTitlesCarousel}
          />
        )}
    </View>
  );
};

export default HomeScreen;

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BLACK,
  },
  text: {
    color: Colors.WHITE,
  },
  newPopularTitlesCarousel: {
    marginTop: 10,
  },
});

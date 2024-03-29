import React, { memo, useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import withObservables from '@nozbe/with-observables';
import { useNavigation } from '@react-navigation/native';

import { MangaCard } from '@atoms';
import {
  BottomTabNavigatorRoutes,
  StackNavigatorRoutes,
} from '@navigation/types';
import { Manga } from '@store/db/models/manga';
import { BottomTabScreenNavigationProp, EnchantedComponent } from '@types';

interface Props {
  manga: Manga[];
}

type Navigation =
  BottomTabScreenNavigationProp<BottomTabNavigatorRoutes.Library>['navigation'];

const OBSERVABLES: [keyof Props] = ['manga'];

const enhance = withObservables(OBSERVABLES, ({ manga }) => ({
  manga,
}));

const LibraryMangaList = ({ manga }: Props) => {
  const navigation = useNavigation<Navigation>();

  const renderItem = useCallback(
    ({ item: { mangaId, coverUrl, title } }: { item: Manga }) => {
      const onPress = () => {
        navigation.push(StackNavigatorRoutes.MangaDetails, {
          mangaId,
        });
      };

      return (
        <MangaCard
          mangaId={mangaId}
          coverUrl={coverUrl}
          title={title}
          onPress={onPress}
          style={s.cardContainer}
          cacheCover
        />
      );
    },
    [navigation],
  );

  return (
    <FlatList
      style={s.list}
      contentContainerStyle={s.listContent}
      columnWrapperStyle={s.listWrapper}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="always"
      onEndReachedThreshold={0.5}
      numColumns={2}
      data={manga}
      renderItem={renderItem}
    />
  );
};

export default memo(enhance(LibraryMangaList)) as EnchantedComponent<
  Props,
  typeof OBSERVABLES
>;

const s = StyleSheet.create({
  cardContainer: {
    transform: [{ scale: 1.2 }],
  },
  list: {
    width: '100%',
  },
  listContent: {
    gap: 60,
    paddingTop: 50,
    paddingBottom: 120,
  },
  listWrapper: {
    justifyContent: 'space-evenly',
  },
});

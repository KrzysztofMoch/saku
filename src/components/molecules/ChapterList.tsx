import { FlatList, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import React, { forwardRef, useImperativeHandle, useMemo } from 'react';
import { Colors } from '@constants/colors';
import { useChapters } from '@hooks';
import { FetchNextPageOptions } from '@tanstack/react-query';
import { Text } from '@atoms';
import { ChapterExpansions, ChapterResponse } from '@api/chapter-api';
import { MergedByVolume, consumeMangaChapters } from '@utils';
import { ApiError } from '@types';
import VolumeListItem from '../atoms/VolumeListItem';

interface ChapterListProps {
  mangaId: string;
  chaptersPerPage: number;
  style: StyleProp<ViewStyle>;
}

export interface ChapterListRef {
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<unknown>;
}

const isChapterData = (
  data: ChapterResponse | ApiError | undefined,
): data is ChapterResponse => {
  return data?.result === 'ok' && data?.data !== undefined;
};

const renderItem = ({ item }: { item: MergedByVolume }) => {
  return <VolumeListItem data={item} />;
};

const keyExtractor = (item: MergedByVolume) => item.volume;

const ChapterList = forwardRef<ChapterListRef, ChapterListProps>(
  ({ mangaId, chaptersPerPage, style }, ref) => {
    const {
      data: chaptersResponse,
      hasNextPage,
      fetchNextPage,
      status,
    } = useChapters(mangaId, {
      limit: chaptersPerPage,
      order: {
        volume: 'desc',
        chapter: 'desc',
      },
      includeFutureUpdates: '0',
      includes: [ChapterExpansions.SCANLATION_GROUP],
    });

    const volumes = useMemo(() => {
      const dataWithSuccess = chaptersResponse?.pages.filter(isChapterData);

      if (!dataWithSuccess) {
        return [];
      }

      const flattedData = dataWithSuccess.flatMap(({ data }) => data);

      return consumeMangaChapters(flattedData);
    }, [chaptersResponse]);

    useImperativeHandle(
      ref,
      () => ({
        fetchNextPage: () => {
          if (hasNextPage && status === 'success') {
            return fetchNextPage();
          }

          return Promise.resolve();
        },
      }),
      [hasNextPage, status, fetchNextPage],
    );

    return (
      <View style={[s.container, style]}>
        <FlatList
          data={volumes}
          scrollEnabled={false}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          removeClippedSubviews
        />
        {status === 'loading' && <Text style={s.loader}>Loading more...</Text>}
      </View>
    );
  },
);

export default ChapterList;

const s = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: Colors.BLACK_LIGHT,
  },
  loader: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
    marginVertical: 6,
  },
  title: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    color: Colors.WHITE,
    fontSize: 16,
  },
  volume: {
    marginBottom: 20,
  },
  volumeTitle: {
    color: Colors.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

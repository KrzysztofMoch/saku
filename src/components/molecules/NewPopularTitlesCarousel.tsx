import { Dimensions, FlatList, StyleProp, ViewStyle } from 'react-native';
import React, { useCallback } from 'react';
import { MangaResponse } from '@api/manga-api';
import { NewPopularTitleCard } from '@atoms';

interface NewPopularTitlesCarouselProps {
  data: MangaResponse['data'];
  style?: StyleProp<ViewStyle>;
}

type Item = MangaResponse['data'][number];

const NewPopularTitlesCarousel = ({
  data,
  style,
}: NewPopularTitlesCarouselProps) => {
  const renderItem = useCallback(
    ({ item, index }: { item: Item; index: number }) => {
      return <NewPopularTitleCard index={index} {...item} />;
    },
    [],
  );

  const keyExtractor = useCallback((item: Item) => {
    return item.id;
  }, []);

  return (
    <FlatList
      horizontal
      style={style}
      decelerationRate={0}
      snapToInterval={Dimensions.get('screen').width * 0.9 + 20}
      snapToAlignment={'center'}
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
    />
  );
};

export default NewPopularTitlesCarousel;

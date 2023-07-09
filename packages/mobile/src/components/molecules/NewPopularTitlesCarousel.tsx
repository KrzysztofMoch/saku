import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { Colors, MangaResponse, useNewPopularTitles } from '@saku/shared';

import {
  CenterCardCarousel,
  NEW_POPULAR_CARD_MARGIN,
  NEW_POPULAR_CARD_WIDTH,
  NewPopularTitleCard,
  Text,
} from '@atoms';

interface NewPopularTitlesCarouselProps {
  style?: StyleProp<ViewStyle>;
}

const cardConfig = {
  width: NEW_POPULAR_CARD_WIDTH,
  spacing: NEW_POPULAR_CARD_MARGIN,
};

const renderItem = ({
  index,
  item,
}: {
  index: number;
  item: MangaResponse['data'][number];
}) => (
  <NewPopularTitleCard
    {...item}
    number={index + 1}
    style={s.card}
    key={item.id}
  />
);

const NewPopularTitlesCarousel = ({ style }: NewPopularTitlesCarouselProps) => {
  const { data, status } = useNewPopularTitles();

  return (
    <View style={style}>
      <View style={s.listHeader}>
        <Text style={s.listHeaderTitle}>New Popular Titles</Text>
      </View>
      {status === 'error' && <Text>Error</Text>}
      {status === 'loading' && (
        <View style={s.loader}>
          <ActivityIndicator />
        </View>
      )}
      {status === 'success' && data && data.result === 'ok' && (
        <CenterCardCarousel
          data={data.data}
          card={cardConfig}
          style={s.list}
          scaleFirst
          autoScroll
          autoScrollInterval={7500}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const s = StyleSheet.create({
  card: {
    marginLeft: NEW_POPULAR_CARD_MARGIN,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  listHeader: {
    flexDirection: 'row',
    paddingHorizontal: NEW_POPULAR_CARD_MARGIN,
    marginBottom: 10,
  },
  listHeaderTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.WHITE,
    marginLeft: 15,
  },
  list: {
    flexDirection: 'row',
    width: Dimensions.get('screen').width,
  },
});

export default NewPopularTitlesCarousel;

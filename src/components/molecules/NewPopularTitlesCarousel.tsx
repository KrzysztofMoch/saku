import {
  Dimensions,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { MangaResponse } from '@api/manga-api';
import {
  NewPopularTitleCard,
  NEW_POPULAR_CARD_WIDTH,
  NEW_POPULAR_CARD_MARGIN,
  CenterCardCarousel,
} from '@atoms';
import { Colors } from '@constants/colors';

interface NewPopularTitlesCarouselProps {
  data: MangaResponse['data'];
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

const NewPopularTitlesCarousel = ({
  data,
  style,
}: NewPopularTitlesCarouselProps) => {
  return (
    <View style={style}>
      <View style={s.listHeader}>
        <Text style={s.listHeaderTitle}>New Popular Titles</Text>
      </View>
      <CenterCardCarousel
        data={data}
        card={cardConfig}
        style={s.list}
        autoScroll
        autoScrollInterval={7500}
        renderItem={renderItem}
      />
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

import {
  ActivityIndicator,
  Dimensions,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { MangaResponse } from '@api/manga-api';
import { CenterCardCarousel, MANGA_CARD_WIDTH, MangaCard } from '@atoms';
import { Colors } from '@constants/colors';
import { useSeasonalList } from '@hooks';

interface SeasonalTitlesCarouselProps {
  style?: StyleProp<ViewStyle>;
}

const cardConfig = {
  width: MANGA_CARD_WIDTH,
  spacing: Dimensions.get('screen').width - MANGA_CARD_WIDTH * 3.25,
};

const renderItem = ({ item }: { item: MangaResponse['data'][number] }) => (
  <MangaCard {...item} style={s.card} key={item.id} />
);

const SeasonalTitlesCarousel = ({ style }: SeasonalTitlesCarouselProps) => {
  const { data, status } = useSeasonalList();

  return (
    <View style={style}>
      <View style={s.listHeader}>
        <Text style={s.listHeaderTitle}>Seasonal Series</Text>
      </View>
      {status === 'error' && <Text>Error</Text>}
      {status === 'loading' && (
        <View style={s.loader}>
          <ActivityIndicator />
        </View>
      )}
      {status === 'success' && data.data && data.ok && (
        <CenterCardCarousel
          data={data.data?.data}
          card={cardConfig}
          style={s.list}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default SeasonalTitlesCarousel;

const s = StyleSheet.create({
  card: {
    marginLeft: cardConfig.spacing,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  listHeader: {
    flexDirection: 'row',
    paddingHorizontal: cardConfig.spacing,
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
});

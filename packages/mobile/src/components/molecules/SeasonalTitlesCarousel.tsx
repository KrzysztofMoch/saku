import {
  ActivityIndicator,
  Dimensions,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CenterCardCarousel, MANGA_CARD_WIDTH, MangaCard, Text } from '@atoms';
import { Colors } from '@saku/shared';
import { useSeasonalList, MangaResponse } from '@saku/shared';
import {
  StackNavigatorRoutes,
  BottomTabNavigatorRoutes,
} from '@navigation/types';
import { BottomTabScreenNavigationProp } from '@types';

interface SeasonalTitlesCarouselProps {
  style?: StyleProp<ViewStyle>;
}

type Navigation =
  BottomTabScreenNavigationProp<BottomTabNavigatorRoutes.Home>['navigation'];

const cardConfig = {
  width: MANGA_CARD_WIDTH,
  spacing: Dimensions.get('screen').width - MANGA_CARD_WIDTH * 3.25,
};

const Item = ({ item }: { item: MangaResponse['data'][number] }) => {
  const navigation = useNavigation<Navigation>();

  const onPress = useCallback(() => {
    navigation.push(StackNavigatorRoutes.MangaDetails, {
      mangaId: item.id,
    });
  }, [item.id, navigation]);

  return (
    <TouchableOpacity onPress={onPress}>
      <MangaCard {...item} style={s.card} key={item.id} cacheCover />
    </TouchableOpacity>
  );
};

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
      {status === 'success' && data && data.result === 'ok' && (
        <CenterCardCarousel
          data={data.data}
          card={cardConfig}
          style={s.list}
          renderItem={Item}
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
    marginLeft: 5,
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

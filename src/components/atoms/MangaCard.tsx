import {
  Dimensions,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import React, { useMemo } from 'react';
import { MangaResponse } from '@api/manga-api';
import { getCoversLinks, extractRelationship, getTitle } from '@utils';
import { CachedImage, Text } from '@atoms';

type MangaCardProps = MangaResponse['data'][number] & {
  mode?: 'compact' | 'full';
  cacheCover?: boolean;
  style?: StyleProp<ViewStyle>;
};

const CARD_WIDTH = Dimensions.get('screen').width * 0.3;

const MangaCard = ({
  attributes,
  id: mangaId,
  relationships,
  cacheCover = false,
  style,
  mode = 'full',
}: MangaCardProps) => {
  const imageUrl = useMemo(() => {
    return getCoversLinks(
      mangaId,
      extractRelationship(relationships, 'cover_art'),
    )?.[0];
  }, [mangaId, relationships]);

  const textPosition = {
    bottom: mode === 'full' ? -CARD_WIDTH / 20 : 0,
  };

  return (
    <View style={[s.container, style]}>
      <View style={s.card}>
        <CachedImage
          height={CARD_WIDTH * 1.5}
          width={CARD_WIDTH}
          imageUrl={imageUrl}
          saveToCache={cacheCover}
        />
      </View>
      <Text
        style={[s.title, textPosition]}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.8}>
        {getTitle(attributes)}
      </Text>
    </View>
  );
};

export default MangaCard;
export { CARD_WIDTH };

const s = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.5,
    borderRadius: 5,
    overflow: 'hidden',
  },
  title: {
    color: 'white',
    fontSize: 12,
    left: 0,
    width: CARD_WIDTH,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

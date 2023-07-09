import React from 'react';
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import {
  extractRelationship,
  getCoversLinks,
  getTitle,
  MangaResponse,
} from '@saku/shared';

import { CachedImage, Text } from '@atoms';

type MangaCardPackedProps = MangaResponse['data'][number] & {
  mode?: 'compact' | 'full';
  cacheCover?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

type MangaCardProps = {
  mangaId: string;
  coverUrl?: string;
  title: string;
  mode?: 'compact' | 'full';
  cacheCover?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

const CARD_WIDTH = Dimensions.get('screen').width * 0.3;

const isMangaAltProps = (
  props: MangaCardPackedProps | MangaCardProps,
): props is MangaCardProps => {
  return 'mangaId' in props;
};

const extractProps = (
  props: MangaCardPackedProps | MangaCardProps,
): MangaCardProps => {
  if (isMangaAltProps(props)) {
    return props;
  }

  const { attributes, id: mangaId } = props;

  const title = getTitle(attributes);
  const coverUrl = getCoversLinks(
    mangaId,
    extractRelationship(props.relationships, 'cover_art'),
  )?.[0];

  return {
    mangaId,
    coverUrl,
    title,
    mode: props?.mode,
    cacheCover: props?.cacheCover,
    style: props?.style,
  };
};

const MangaCard = (props: MangaCardProps | MangaCardPackedProps) => {
  const {
    title,
    coverUrl,
    mode = 'full',
    cacheCover = false,
    onPress,
    style,
  } = extractProps(props);

  const textPosition = {
    bottom: mode === 'full' ? -CARD_WIDTH / 20 : 0,
  };

  return (
    <TouchableOpacity
      style={[s.container, style]}
      disabled={!onPress}
      onPress={onPress}>
      <View style={s.card}>
        <CachedImage
          height={CARD_WIDTH * 1.5}
          width={CARD_WIDTH}
          imageUrl={coverUrl}
          saveToCache={cacheCover}
        />
      </View>
      <Text
        style={[s.title, textPosition]}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.8}>
        {title}
      </Text>
    </TouchableOpacity>
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

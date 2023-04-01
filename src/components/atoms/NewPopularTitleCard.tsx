import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  extractRelationship,
  getColorFromImage,
  getCoversLinks,
  hexOpacity,
  hexToRgba,
} from '@utils';
import { MangaResponse } from '@api/manga-api';
import CachedImage from './CachedImage';

type NewPopularTitleCardProps = MangaResponse['data'][number] & {
  index: number;
};

const getGradientColors = (hex: string) => {
  return [
    hexToRgba(hex, 1.0),
    hexToRgba(hex, 0.6),
    hexToRgba(hex, 0.3),
    hexToRgba(hex, 0.0),
  ];
};

const getGradient = async (source: string) => {
  const dominantColor = await getColorFromImage(source, FALLBACK_COLOR, source);
  const gradientArray = getGradientColors(dominantColor);

  return gradientArray;
};

const FALLBACK_COLOR = '#1c1c1c';
const CARD_WIDTH = Dimensions.get('screen').width * 0.9;

const NewPopularTitleCard = ({
  attributes: { title, description, altTitles },
  id: mangaId,
  relationships,
  index,
}: NewPopularTitleCardProps) => {
  const [gradient, setGradient] = useState(getGradientColors(FALLBACK_COLOR));

  const number = index + 1;
  const imageUrl = getCoversLinks(
    mangaId,
    extractRelationship(relationships, 'cover_art'),
  )?.[0];

  const onImageCached = (base64: string) => {
    getGradient(base64).then(setGradient);
  };

  return (
    <LinearGradient style={s.container} colors={gradient}>
      <Text style={s.number}>No. {number < 10 ? `0${number}` : number}</Text>
      <View style={s.content}>
        <View style={s.imageContainer}>
          {imageUrl && (
            <CachedImage
              height={CARD_WIDTH * 0.5}
              width={CARD_WIDTH * 0.3}
              imageUrl={imageUrl}
              imageKey={imageUrl.split('/')[imageUrl.split('/').length - 1]}
              onImageCached={onImageCached}
            />
          )}
        </View>
        <View style={s.info}>
          <Text
            style={s.title}
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.8}>
            {title.en ?? altTitles.en}
          </Text>
          <Text style={s.description}>{description.en}</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default React.memo(NewPopularTitleCard);

const s = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 0.6,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  number: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    position: 'absolute',
    top: 8,
    left: 15,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  imageContainer: {
    width: CARD_WIDTH * 0.3,
    height: CARD_WIDTH * 0.45,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: hexOpacity('#fff', 0.3),
  },
  info: {
    flex: 1,
    height: '100%',
    marginLeft: 10,
    marginTop: 45,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    maxHeight: CARD_WIDTH * 0.35,
  },
});

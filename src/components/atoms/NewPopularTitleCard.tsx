import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
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
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import ReactNativeBlobUtil from 'react-native-blob-util';

type NewPopularTitleCardProps = MangaResponse['data'][number] & {
  number: number;
  offset: SharedValue<number>;
  style?: StyleProp<ViewStyle>;
};

const getGradientColors = (hex: string) => {
  return [
    hexToRgba(hex, 1.0),
    hexToRgba(hex, 0.6),
    hexToRgba(hex, 0.3),
    hexToRgba(hex, 0.0),
  ];
};

const getGradient = async (source: string, key: string) => {
  const base64 = (await ReactNativeBlobUtil.fs.readFile(
    source,
    'base64',
  )) as string;

  const dominantColor = await getColorFromImage(
    'data:image/png;base64,' + base64,
    FALLBACK_COLOR,
    key,
  );
  const gradientArray = getGradientColors(dominantColor);

  return gradientArray;
};

const FALLBACK_COLOR = '#1c1c1c';

const CARD_WIDTH = Dimensions.get('screen').width * 0.9;
const CARD_MARGIN = Dimensions.get('screen').width * 0.05;

const NewPopularTitleCard = ({
  attributes: { title, description, altTitles },
  id: mangaId,
  relationships,
  number,
  offset,
  style,
}: NewPopularTitleCardProps) => {
  const gradientLoaded = useRef(false);
  const [gradient, setGradient] = useState(getGradientColors(FALLBACK_COLOR));

  const scale = useDerivedValue(() => {
    const distance = Math.abs(
      -offset.value - (number - 1) * (CARD_WIDTH + CARD_MARGIN),
    );

    return interpolate(
      distance,
      [0, CARD_WIDTH * 0.4, CARD_WIDTH],
      [1, 0.9, 0.8],
      'clamp',
    );
  }, [offset, number]);

  const imageUrl = useMemo(() => {
    return getCoversLinks(
      mangaId,
      extractRelationship(relationships, 'cover_art'),
    )?.[0];
  }, [mangaId, relationships]);

  const onImageCached = useCallback(
    (filePath: string) => {
      if (imageUrl && !gradientLoaded.current) {
        gradientLoaded.current = true;
        getGradient(filePath, imageUrl).then(gradientArr =>
          setGradient(gradientArr),
        );
      }
    },
    [imageUrl],
  );

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: scale.value }],
    }),
    [scale],
  );

  return (
    <Animated.View style={[s.container, style, animatedStyle]}>
      <LinearGradient style={s.gradient} colors={gradient} key={number}>
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
            <Text
              style={s.description}
              ellipsizeMode="tail"
              numberOfLines={Math.round((CARD_WIDTH * 0.35) / 16)}>
              {description.en}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const s = StyleSheet.create({
  container: {
    overflow: 'hidden',
    width: CARD_WIDTH,
    height: CARD_WIDTH * 0.6,
    borderRadius: 20,
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
  gradient: {
    flex: 1,
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
    height: CARD_WIDTH * 0.35,
    width: CARD_WIDTH * 0.6,
  },
});

export default React.memo(NewPopularTitleCard);
export { CARD_WIDTH, CARD_MARGIN };

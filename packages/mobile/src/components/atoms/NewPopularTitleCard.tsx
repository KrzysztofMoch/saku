import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import {
  extractRelationship,
  getColorFromImage,
  getCoversLinks,
  getTitle,
  hexOpacity,
  hexToRgba,
  MangaResponse,
} from '@saku/shared';

import { CachedImage, Text } from '@atoms';
import {
  BottomTabNavigatorRoutes,
  StackNavigatorRoutes,
} from '@navigation/types';
import { BottomTabScreenNavigationProp } from '@types';

type NewPopularTitleCardProps = MangaResponse['data'][number] & {
  number: number;
  style?: StyleProp<ViewStyle>;
};

type Navigation =
  BottomTabScreenNavigationProp<BottomTabNavigatorRoutes.Home>['navigation'];

const getGradientColors = (hex: string) => {
  return [
    hexToRgba(hex, 1.0),
    hexToRgba(hex, 0.8),
    hexToRgba(hex, 0.4),
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
  attributes,
  id: mangaId,
  relationships,
  number,
  style,
}: NewPopularTitleCardProps) => {
  const { description } = attributes;

  const gradientLoaded = useRef(false);
  const [gradient, setGradient] = useState(getGradientColors(FALLBACK_COLOR));
  const navigation = useNavigation<Navigation>();

  const imageUrl = useMemo(() => {
    return getCoversLinks(
      mangaId,
      extractRelationship(relationships, 'cover_art'),
    )?.[0];
  }, [mangaId, relationships]);

  const onPress = useCallback(() => {
    navigation.push(StackNavigatorRoutes.MangaDetails, {
      mangaId,
    });
  }, [mangaId, navigation]);

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

  return (
    <TouchableOpacity style={[s.container, style]} onPress={onPress}>
      <LinearGradient style={s.gradient} colors={gradient} key={number}>
        <Text style={s.number}>No. {number < 10 ? `0${number}` : number}</Text>
        <View style={s.content}>
          <View style={s.imageContainer}>
            <CachedImage
              onImageCached={onImageCached}
              height={CARD_WIDTH * 0.5}
              width={CARD_WIDTH * 0.3}
              imageUrl={imageUrl}
              saveToCache
            />
          </View>
          <View style={s.info}>
            <Text
              style={s.title}
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.8}>
              {getTitle(attributes)}
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
    </TouchableOpacity>
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
export { CARD_MARGIN, CARD_WIDTH };

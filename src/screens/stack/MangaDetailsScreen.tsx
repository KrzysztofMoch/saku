import {
  ActivityIndicator,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigatorRoutes } from '@navigation/types';
import { Colors } from '@constants/colors';
import {
  extractRelationship,
  getColorFromImage,
  getCoversLinks,
  getTitle,
  hexToRgba,
} from '@utils';
import { CachedImage, Text } from '@atoms';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { Back } from '@svg';
import { ChapterList, ChapterListRef } from '@molecules';
import { useManga } from '@hooks';
import { StackScreenNavigationProp } from '@types';

type MangaDetailsScreenProps =
  StackScreenNavigationProp<StackNavigatorRoutes.MangaDetails>;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

const isCloseToBottom = ({
  nativeEvent: { layoutMeasurement, contentOffset, contentSize },
}: NativeSyntheticEvent<NativeScrollEvent>) => {
  const paddingToBottom = 140;

  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

const getSource = async (uri: string) => {
  if (uri.startsWith('http')) {
    return uri;
  }

  try {
    const base64 = (await ReactNativeBlobUtil.fs.readFile(
      uri,
      'base64',
    )) as string;

    return 'data:image/png;base64,' + base64;
  } catch (error) {
    return undefined;
  }
};

const getGradient = async (uri: string, key: string) => {
  const source = await getSource(uri);

  if (!source) {
    return;
  }

  const dominantColor = await getColorFromImage(source, '#1c1c1c', key);

  return [
    hexToRgba(dominantColor, 1.0),
    hexToRgba(dominantColor, 0.6),
    hexToRgba(dominantColor, 0.3),
    hexToRgba(dominantColor, 0.0),
  ];
};

const MangaDetailsScreen = ({ navigation, route }: MangaDetailsScreenProps) => {
  const { mangaId } = route.params;
  const { top } = useSafeAreaInsets();
  const { data, status } = useManga(mangaId);

  const chapterListRef = useRef<ChapterListRef>(null);

  const [gradient, setGradient] = useState<string[]>(['rgba(0,0,0,0)']);

  const handleBack = useCallback(() => {
    navigation.canGoBack() && navigation.goBack();
  }, [navigation]);

  const handleCoverLoad = useCallback(
    (uri: string) => {
      getGradient(uri, mangaId).then(colors =>
        setGradient(colors ?? ['rgba(0,0,0,0)']),
      );
    },
    [mangaId],
  );

  const onBottomReached = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!chapterListRef.current || !isCloseToBottom(event)) {
        return;
      }

      chapterListRef.current.fetchNextPage();
    },
    [],
  );

  useEffect(() => {
    return () => {
      setGradient([]);
    };
  }, []);

  if (status === 'loading') {
    return (
      <View style={[s.background, s.loader]}>
        <ActivityIndicator />
      </View>
    );
  }

  if (status === 'error' || data === undefined || data.result !== 'ok') {
    return (
      <View style={[s.background, s.loader]}>
        <Text>Error</Text>
      </View>
    );
  }

  const { attributes, relationships } = data.data[0];

  const covers = getCoversLinks(
    mangaId,
    extractRelationship(relationships, 'cover_art'),
  );

  const author = extractRelationship(relationships, 'author')[0].attributes;
  const artist = extractRelationship(relationships, 'artist')[0].attributes;
  // replace markdown links with plain text and bold text
  const description = attributes.description.en
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1');

  return (
    <View style={s.background}>
      <LinearGradient
        colors={gradient}
        style={[
          s.gradient,
          {
            marginTop: -top,
          },
        ]}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[{ paddingTop: top }, s.container]}
        onScroll={onBottomReached}
        scrollEventThrottle={400}
        contentContainerStyle={s.contentContainer}>
        <TouchableOpacity style={s.back} onPress={handleBack}>
          <Back />
        </TouchableOpacity>
        <CachedImage
          height={SCREEN_WIDTH * 0.7}
          width={SCREEN_WIDTH * 0.48}
          imageKey={mangaId}
          imageUrl={covers?.[0]}
          onImageCached={handleCoverLoad}
          activityIndicator={{
            color: Colors.WHITE,
            backgroundColor: Colors.BLACK_LIGHT,
          }}
          style={s.cover}
        />
        <Text
          selectable
          numberOfLines={3}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
          maxFontSizeMultiplier={2}
          style={s.title}>
          {getTitle(attributes)}
        </Text>
        <View style={s.buttonsContainer}>
          <TouchableOpacity style={s.button}>
            <Text style={s.buttonText}>Add to library</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.button}>
            <Text style={s.buttonText}>Read</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.miniButton}>
            <Text style={s.buttonText}>...</Text>
          </TouchableOpacity>
        </View>
        <Text style={[s.description]}>{description}</Text>
        <View style={s.infoContainer}>
          <View style={s.creators}>
            <Text style={s.creatorsText}>
              Author:{' '}
              <Text style={s.tagsTitle}>{author?.name ?? 'Unknow'}</Text>
            </Text>

            <Text style={s.creatorsText}>
              Artist:{' '}
              <Text style={s.tagsTitle}>{artist?.name ?? 'Unknow'}</Text>
            </Text>
          </View>
          <View style={s.tags}>
            <Text style={s.tagsTitle}>Genres: </Text>
            <View style={s.tagsContainer}>
              {attributes.tags.map(tag => (
                <Text key={tag.id} style={s.tag}>
                  {tag.attributes?.name.en}
                </Text>
              ))}
            </View>
          </View>
        </View>
        <ChapterList
          ref={chapterListRef}
          mangaId={mangaId}
          style={s.chapterList}
          chaptersPerPage={30}
        />
      </ScrollView>
    </View>
  );
};

export default MangaDetailsScreen;

const s = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.BLACK,
  },
  back: {
    position: 'absolute',
    top: 6,
    left: 6,
  },
  button: {
    backgroundColor: Colors.GRAY,
    borderRadius: 5,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    columnGap: 8,
    marginTop: 16,
    paddingHorizontal: 28,
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cover: {
    borderRadius: 10,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
    flexGrow: 1,
    alignItems: 'center',
  },
  creators: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 16,
  },
  creatorsText: {
    color: Colors.WHITE,
    fontSize: 14,
  },
  chapterList: {
    width: SCREEN_WIDTH - 30,
    marginTop: 16,
    backgroundColor: Colors.BLACK_LIGHT,
    opacity: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  description: {
    fontSize: 14,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  gradient: {
    height: SCREEN_HEIGHT * 0.6,
    width: SCREEN_WIDTH,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  infoContainer: {
    flexDirection: 'column',
    marginTop: 16,
    width: '100%',
    paddingHorizontal: 16,
  },
  title: {
    color: Colors.WHITE,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
    marginHorizontal: '9%',
  },
  tags: {
    marginTop: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  tagsTitle: {
    fontWeight: 'bold',
  },
  tag: {
    color: Colors.WHITE,
    fontSize: 14,
    marginRight: 8,
    marginBottom: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: Colors.GRAY,
    borderRadius: 4,
    overflow: 'hidden',
  },
  miniButton: {
    backgroundColor: Colors.GRAY,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  showMore: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 8,
  },
  showMoreText: {
    color: Colors.WHITE,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  showMoreIcon: {
    transform: [{ rotate: '-90deg' }],
  },
});

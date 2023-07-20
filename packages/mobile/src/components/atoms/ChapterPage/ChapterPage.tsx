import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  View,
} from 'react-native';

import { getChapterPage } from '@utils';

interface ChapterPageProps {
  mangaId: string;
  chapterId: string;
  pageUrl: string;
  index: number;
  shouldLoadImage?: boolean;
  onImageLoaded?: (index: number) => void;
  onChapterCached?: (filePath: string) => void;
}

const FILE_PREFIX = 'file://';
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const ChapterPage = ({
  pageUrl,
  onImageLoaded,
  index,
  chapterId,
  mangaId,
  onChapterCached,
  shouldLoadImage = true,
}: ChapterPageProps) => {
  const chapterLoaded = useRef(false);

  const [isLoading, setIsLoading] = useState(true);
  const [chapterUri, setChapterUri] = useState<string | null>(null);

  const onImageLoadEnd = useCallback(() => {
    setIsLoading(false);
    onImageLoaded && onImageLoaded(index);
  }, [index, onImageLoaded]);

  useEffect(() => {
    if (!shouldLoadImage || chapterLoaded.current) {
      return;
    }

    // TODO
    // - create progress bar for getting images
    // - create error handling for getting images

    getChapterPage({
      mode: 'cache',
      chapterId,
      mangaId,
      url: pageUrl,
      page: index,
      onChapterCached,
    })
      .then(path => setChapterUri(FILE_PREFIX + path))
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldLoadImage]);

  return (
    <View style={s.image}>
      {isLoading && (
        <View style={s.loaderContainer}>
          <ActivityIndicator size="large" style={s.loader} />
        </View>
      )}
      {chapterUri && (
        <Image
          source={{ uri: chapterUri, cache: 'reload' }}
          style={[s.image]}
          resizeMode="contain"
          onLoadEnd={onImageLoadEnd}
        />
      )}
    </View>
  );
};

export default memo(ChapterPage);

const s = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    backgroundColor: 'transparent',
  },
  loader: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
});

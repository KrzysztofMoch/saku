import React, { memo, useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  View,
} from 'react-native';

interface ChapterPageProps {
  pageUrl: string;
  index: number;
  shouldLoadImage?: boolean;
  onImageLoaded?: (index: number) => void;
}

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const ChapterPage = ({
  pageUrl,
  onImageLoaded,
  index,
  shouldLoadImage = true,
}: ChapterPageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const onImageLoadEnd = useCallback(() => {
    setIsLoading(false);
    onImageLoaded && onImageLoaded(index);
  }, [index, onImageLoaded]);

  return (
    <View style={s.image}>
      {isLoading && (
        <View style={s.loaderContainer}>
          <ActivityIndicator size="large" style={s.loader} />
        </View>
      )}
      {shouldLoadImage && (
        <Image
          source={{ uri: pageUrl, cache: 'reload' }}
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

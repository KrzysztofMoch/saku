import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
  ImageProps,
} from 'react-native';
import ReactNativeBlobUtil, {
  ReactNativeBlobUtilConfig,
} from 'react-native-blob-util';

interface CachedImageProps extends Omit<ImageProps, 'source'> {
  imageUrl: string;
  imageKey: string;
  width: number;
  height: number;
  activityIndicator?: {
    size?: 'small' | 'large';
    color?: string;
    backgroundColor?: string;
  };
  onImageCached?: (filePath: string) => void;
}

const FILE_PREFIX = 'file://';

// check if image is cached
const checkImage = async (
  localPath: string,
  onImageCached: CachedImageProps['onImageCached'],
) => {
  try {
    const fileExists = await ReactNativeBlobUtil.fs.exists(localPath);

    if (fileExists) {
      onImageCached?.(localPath);
      return localPath;
    }
  } catch (error) {
    console.log('checkImage error', error);
    return null;
  }
};

// save image to cache
const cacheImage = async (
  localPath: string,
  url: string,
  onImageCached: CachedImageProps['onImageCached'],
) => {
  const options: ReactNativeBlobUtilConfig = {
    fileCache: true,
    path: localPath,
  };

  try {
    const response = await ReactNativeBlobUtil.config(options).fetch(
      'GET',
      url,
    );

    const path = response.path();

    onImageCached?.(path);
    return path;
  } catch (error) {
    __DEV__ && console.log('cacheImage error', error);
    return url;
  }
};

// get image from cache or download it
const getImage = async (
  key: string,
  url: string,
  onImageCached: CachedImageProps['onImageCached'],
) => {
  const localPath = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/${key}`;

  const cachedImage = await checkImage(localPath, onImageCached);

  if (cachedImage) {
    return cachedImage;
  }

  return cacheImage(localPath, url, onImageCached);
};

const CachedImage = ({
  imageUrl,
  imageKey,
  width,
  height,
  activityIndicator,
  onImageCached,
  ...imageProps
}: CachedImageProps) => {
  const imageLoaded = React.useRef(false);

  const size = activityIndicator?.size || 'small';
  const color = activityIndicator?.color || 'white';
  const backgroundColor = activityIndicator?.backgroundColor || 'black';

  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    if (imageLoaded.current) {
      return;
    }

    imageLoaded.current = true;

    getImage(imageKey, imageUrl, onImageCached).then(result =>
      setImageUri(FILE_PREFIX + result),
    );

    return () => {
      setImageUri(null);
      imageLoaded.current = false;
    };
  }, [imageKey, imageUrl, onImageCached]);

  return (
    <View
      style={[
        { height, width, backgroundColor: backgroundColor },
        s.container,
      ]}>
      {imageUri ? (
        <Image
          {...imageProps}
          source={{
            uri: imageUri,
            width,
            height,
            cache: 'reload',
          }}
        />
      ) : (
        <>
          <ActivityIndicator size={size} color={color} />
        </>
      )}
    </View>
  );
};

export default CachedImage;

const s = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

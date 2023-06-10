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
  imageUrl: string | undefined;
  width: number;
  height: number;
  imageKey?: string;
  saveToCache?: boolean;
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
  saveToCache = false,
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
    if (imageLoaded.current || !imageUrl) {
      return;
    }

    const _imageKey =
      imageKey || imageUrl.split('/')[imageUrl.split('/').length - 1];

    imageLoaded.current = true;

    if (saveToCache) {
      getImage(_imageKey, imageUrl, onImageCached).then(result =>
        setImageUri(FILE_PREFIX + result),
      );
      return;
    }

    checkImage(imageUrl, onImageCached).then(result => {
      const uri = result ? FILE_PREFIX + result : imageUrl;
      setImageUri(uri);
      onImageCached?.(uri);
    });

    return () => {
      setImageUri(null);
      imageLoaded.current = false;
    };
  }, [imageKey, imageUrl, onImageCached, saveToCache]);

  return (
    <View
      style={[
        { height, width, backgroundColor: backgroundColor },
        s.container,
      ]}>
      {imageUri !== null ? (
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

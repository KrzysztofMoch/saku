import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
  ImageProps,
  Platform,
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
  onImageCached?: (base64: string) => void;
}

// check if image is cached
const checkImage = async (
  localPath: string,
  onImageCached?: (base64: string) => void,
) => {
  try {
    const fileExists = await ReactNativeBlobUtil.fs.exists(localPath);

    if (fileExists) {
      const base64 = (await ReactNativeBlobUtil.fs.readFile(
        localPath,
        'base64',
      )) as string;

      onImageCached?.(`data:image/png;base64,${base64}`);

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
  onImageCached?: (base64: string) => void,
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

    const base64 = (await response.base64()) as string;

    onImageCached?.(`data:image/png;base64,${base64}`);
  } catch (error) {
    console.log('cacheImage error', error);
  }
};

// get image from cache or download it
const getImage = async (
  key: string,
  url: string,
  onImageCached?: (base64: string) => void,
) => {
  const localPath = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/${key}`;

  const cachedImage = await checkImage(localPath, onImageCached);

  if (cachedImage) {
    return cachedImage;
  } else {
    cacheImage(localPath, url, onImageCached);
  }

  return url;
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
  const size = activityIndicator?.size || 'small';
  const color = activityIndicator?.color || 'white';
  const backgroundColor = activityIndicator?.backgroundColor || 'black';

  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    getImage(imageKey, imageUrl, onImageCached).then(result =>
      setImageUri(result),
    );
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
            uri: Platform.OS === 'android' ? `file://${imageUri}` : imageUri,
            width,
            height,
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

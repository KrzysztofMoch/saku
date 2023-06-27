import ImageColors from 'react-native-image-colors';

/**
 * @param source - The source of the image
 * @param fallbackColor - The fallback color to use if the image is not found or if there is an error
 * @param key - The key to use for caching
 * @returns The dominant color of the image
 */
const getColorFromImage = async (
  source: string,
  fallbackColor: string,
  key?: string,
) => {
  try {
    const colors = await ImageColors.getColors(source, {
      cache: true,
      key,
      fallback: fallbackColor,
    });

    switch (colors.platform) {
      case 'android':
        return colors.vibrant ?? fallbackColor;
      case 'ios':
        return colors.detail;
      default:
        __DEV__ && console.warn('getColorFromImage - Unknown platform');
        return fallbackColor;
    }
  } catch (error) {
    __DEV__ &&
      console.error('getColorFromImage -', source.substring(0, 20), error);
    return fallbackColor;
  }
};

export default getColorFromImage;

/**
 * @param hex - The hex color. (e.g. #000000 or #000)
 * @param opacity  - The opacity. (e.g. 0.5)
 * @returns The hex color with opacity. (e.g. #00000080)
 */
const hexOpacity = (hex: string, opacity: number) => {
  const hexWithoutHash = hex.replace('#', '');

  if (hexWithoutHash.length === 3) {
    const [r, g, b] = hexWithoutHash.split('');
    return `#${r}${r}${g}${g}${b}${b}${Math.round(opacity * 255).toString(16)}`;
  }

  if (hexWithoutHash.length === 6) {
    return `${hex}${Math.round(opacity * 255).toString(16)}`;
  }

  throw new Error('Invalid hex color');
};

export default hexOpacity;

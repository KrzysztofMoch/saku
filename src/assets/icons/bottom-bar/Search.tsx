import { Colors } from '@constants/colors';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../types';

const Search = ({ size, height, width, color }: IconProps) => {
  return (
    <Svg
      viewBox="0 0 512 512"
      height={height || size || 32}
      width={width || size || 32}
      stroke={color || Colors.WHITE}>
      <Path
        d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"
        fill="none"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
      <Path
        fill="none"
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={32}
        d="M338.29 338.29L448 448"
      />
    </Svg>
  );
};

export default Search;
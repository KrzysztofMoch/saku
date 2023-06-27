import { Colors } from '@constants';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../types';

const Clock = ({ size, height, width, color }: IconProps) => {
  return (
    <Svg
      viewBox="0 0 512 512"
      height={height || size || 32}
      width={width || size || 32}
      stroke={color || Colors.WHITE}>
      <Path
        d="M256 64C150 64 64 150 64 256s86 192 192 192 192-86 192-192S362 64 256 64z"
        fill="none"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
      <Path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M256 128v144h96"
      />
    </Svg>
  );
};

export default Clock;

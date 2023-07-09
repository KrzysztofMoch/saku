import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

import { Colors } from '@constants';

import { IconProps } from '../types';

const Library = ({ size, height, width, color }: IconProps) => {
  return (
    <Svg
      viewBox="0 0 512 512"
      height={height || size || 32}
      width={width || size || 32}
      stroke={color || Colors.WHITE}>
      <Rect
        x={32}
        y={96}
        width={64}
        height={368}
        rx={16}
        ry={16}
        fill="none"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <Path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M112 224h128M112 400h128"
      />
      <Rect
        x={112}
        y={160}
        width={128}
        height={304}
        rx={16}
        ry={16}
        fill="none"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <Rect
        x={256}
        y={48}
        width={96}
        height={416}
        rx={16}
        ry={16}
        fill="none"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <Path
        d="M422.46 96.11l-40.4 4.25c-11.12 1.17-19.18 11.57-17.93 23.1l34.92 321.59c1.26 11.53 11.37 20 22.49 18.84l40.4-4.25c11.12-1.17 19.18-11.57 17.93-23.1L445 115c-1.31-11.58-11.42-20.06-22.54-18.89z"
        fill="none"
        strokeLinejoin="round"
        strokeWidth={32}
      />
    </Svg>
  );
};

export default Library;

import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

import { Colors } from '@constants';

function SvgComponent({ color, width, height, ...props }: SvgProps) {
  return (
    <Svg
      width={width || 42}
      height={height || 42}
      viewBox="0 0 512 512"
      {...props}>
      <Path
        d="M328 112L184 256 328 400"
        fill="none"
        stroke={color || Colors.WHITE}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={48}
      />
    </Svg>
  );
}

export default SvgComponent;

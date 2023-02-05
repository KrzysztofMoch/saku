import { Colors } from '@constants/colors';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../types';

const ClockFilled = ({ size, height, width, color }: IconProps) => {
  return (
    <Svg
      viewBox="0 0 512 512"
      height={height || size || 32}
      width={width || size || 32}
      fill={color || Colors.WHITE}>
      <Path d="M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208 208-93.13 208-208S370.87 48 256 48zm96 240h-96a16 16 0 01-16-16V128a16 16 0 0132 0v128h80a16 16 0 010 32z" />
    </Svg>
  );
};

export default ClockFilled;

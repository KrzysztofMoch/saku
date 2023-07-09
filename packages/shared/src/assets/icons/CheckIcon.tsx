import * as React from 'react';
import Svg, { G, Path, SvgProps } from 'react-native-svg';

import { Colors } from '@constants';

interface Props extends SvgProps {
  size?: number;
  color?: string;
}

const CheckIcon = ({ size = 24, color = Colors.WHITE, ...props }: Props) => (
  <Svg
    width={props.width || size}
    height={props.height || size}
    viewBox="0 -2 24 24"
    fill="none"
    {...props}>
    <G stroke={props.fill || color} strokeWidth={2.4}>
      <Path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <Path
        d="M9 12l1.683 1.683v0c.175.175.459.175.634 0v0L15 10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
  </Svg>
);
export default CheckIcon;

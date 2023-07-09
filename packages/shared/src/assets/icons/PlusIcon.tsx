import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

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
    stroke={props.fill || color}
    {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 17a1 1 0 102 0v-4h4a1 1 0 100-2h-4V7a1 1 0 10-2 0v4H7a1 1 0 100 2h4v4z"
      fill={props.fill || color}
    />
  </Svg>
);
export default CheckIcon;

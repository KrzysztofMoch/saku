import { StyleSheet, Text } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from '@constants/colors';

interface Props {
  label: string;
  onPress: () => void;
  icon: JSX.Element;
  focusedIcon: JSX.Element;
  focused: boolean;
}

const BottomBarButton = ({
  onPress,
  label,
  icon,
  focusedIcon,
  focused,
}: Props) => {
  return (
    <TouchableOpacity style={s.container} onPress={onPress}>
      {focused ? focusedIcon : icon}
      <Text style={s.label}>{label}</Text>
    </TouchableOpacity>
  );
};

export default BottomBarButton;

const s = StyleSheet.create({
  container: {
    height: 54,
    width: 58,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: Colors.WHITE,
    fontFamily: 'Quicksand',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

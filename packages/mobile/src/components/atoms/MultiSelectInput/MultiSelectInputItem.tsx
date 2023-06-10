import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { MultiSelectInputData, QueryListItem } from './MultiSelectInput';
import { Text } from '@atoms';
import { Colors, hexOpacity } from '@saku/shared';

interface MultiSelectInputItemProps {
  height: number;
  item: QueryListItem;
  state: 'include' | 'exclude' | 'none';
  onPress: (item: MultiSelectInputData) => void;
}

const MultiSelectInputItem = ({
  height,
  item,
  state,
  onPress,
}: MultiSelectInputItemProps) => {
  const { label } = item;

  const handlePress = () => {
    onPress({ ...item, excluded: state === 'exclude' ? true : false });
  };

  return (
    <TouchableOpacity style={[s.container, { height }]} onPress={handlePress}>
      <Text style={s.text}>{label}</Text>
    </TouchableOpacity>
  );
};

export default MultiSelectInputItem;

const s = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: hexOpacity(Colors.WHITE, 0.4),
  },
  text: {
    color: Colors.WHITE,
    fontSize: 16,
  },
});

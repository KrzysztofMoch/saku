import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { Colors } from '@saku/shared';

import { MultiSelectInputData } from './MultiSelectInput';

interface MultiSelectInputBadgeProps {
  item: MultiSelectInputData;
  onPress: (item: MultiSelectInputData) => void;
}

const MultiSelectInputBadge = ({
  item,
  onPress,
}: MultiSelectInputBadgeProps) => {
  const handlePress = () => {
    onPress(item);
  };

  return (
    <TouchableOpacity
      key={item.value}
      style={[
        s.badge,
        {
          backgroundColor: item.excluded ? Colors.BLACK_LIGHT : Colors.PINK,
        },
      ]}
      onPress={handlePress}>
      <Text style={s.badgeText}>
        {item.excluded ? '-' : '+'} {item.label}
      </Text>
    </TouchableOpacity>
  );
};

export default MultiSelectInputBadge;

const s = StyleSheet.create({
  badge: {
    height: '70%',
    marginRight: 4,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  badgeText: {
    color: Colors.WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

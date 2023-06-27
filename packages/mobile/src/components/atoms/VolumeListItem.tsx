import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { ChapterListItem, Text } from '@atoms';
import { Back, Colors, MergedByVolume, MergedChapters } from '@saku/shared';

interface VolumeListItemProps {
  data: MergedByVolume;
}

const renderItem = ({ item: { data } }: { item: MergedChapters }) => {
  return <ChapterListItem data={data} />;
};

const keyExtractor = ({ key }: MergedChapters) => key;

const VolumeListItem = ({ data }: VolumeListItemProps) => {
  const { volume, data: chapters } = data;

  const [collapsed, setCollapsed] = useState(false);

  const chaptersRange = useMemo(() => {
    return `${chapters[chapters.length - 1].data[0].chapter} - ${
      chapters[0].data[0].chapter
    }`;
  }, [chapters]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);

  return (
    <View style={s.volume}>
      <TouchableOpacity style={s.volumeHeader} onPress={toggleCollapsed}>
        <Text style={s.volumeTitle}>
          Vol. {volume} (ch. {chaptersRange})
        </Text>
        <Back
          width={20}
          height={20}
          style={{
            transform: [{ rotate: collapsed ? '-90deg' : '90deg' }],
          }}
        />
      </TouchableOpacity>
      {collapsed ? null : (
        <FlatList
          data={chapters}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          scrollEnabled={false}
        />
      )}
    </View>
  );
};

export default memo(VolumeListItem);

const s = StyleSheet.create({
  volume: {
    marginBottom: 20,
  },
  volumeHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  volumeTitle: {
    color: Colors.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

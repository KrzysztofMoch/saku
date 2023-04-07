import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useMemo } from 'react';
import { ChapterWithCoverResponse } from '@api/chapter-api';
import { Colors } from '@constants/colors';
import { extractRelationship } from '@utils';

type ChapterListItemProps = ChapterWithCoverResponse['data'][number];

const ChapterListItem = ({
  attributes: { publishAt, chapter, volume },
  relationships,
  manga: { title, cover },
}: ChapterListItemProps) => {
  const minutesFromPublish = Math.floor(
    (new Date().getTime() - new Date(publishAt).getTime()) / 1000 / 60,
  );

  const groupName = useMemo(() => {
    const groupAttr = extractRelationship(relationships, 'scanlation_group')[0];

    return groupAttr?.attributes?.name || '[No group]';
  }, [relationships]);

  return (
    <View style={s.container}>
      <Image
        style={s.image}
        source={{
          uri: cover,
          width: 40,
          height: 60,
        }}
      />
      <View style={s.content}>
        <Text style={s.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={s.chapter}>
          {volume && 'Vol ' + volume + ' '}
          {chapter && 'Ch. ' + chapter}
        </Text>
        <Text>
          <Text style={s.groupName}>{groupName} - </Text>
          <Text style={s.time}>{minutesFromPublish} min ago</Text>
        </Text>
      </View>
    </View>
  );
};

export default React.memo(ChapterListItem);

const s = StyleSheet.create({
  container: {
    height: 60,
    width: '94%',
    marginTop: 16,
    marginHorizontal: 16,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    height: 60,
    width: 40,
    backgroundColor: 'grey',
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.WHITE,
  },
  chapter: {
    fontSize: 14,
    color: Colors.WHITE,
  },
  groupName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.WHITE,
  },
  time: {
    fontSize: 14,
    color: Colors.WHITE,
  },
});

import React, { useCallback, useMemo } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
  ChapterWithCoverResponse,
  Colors,
  extractRelationship,
} from '@saku/shared';

import { Text } from '@atoms';
import {
  BottomTabNavigatorRoutes,
  StackNavigatorRoutes,
} from '@navigation/types';
import { BottomTabScreenNavigationProp } from '@types';

type ChapterCardProps = ChapterWithCoverResponse['data'][number];
type Navigation = BottomTabScreenNavigationProp<BottomTabNavigatorRoutes.Home>;

const ChapterCard = ({
  id,
  attributes: { publishAt, chapter, volume },
  relationships,
  manga: { title, cover },
}: ChapterCardProps) => {
  const navigation = useNavigation<Navigation['navigation']>();

  const minutesFromPublish = Math.floor(
    (new Date().getTime() - new Date(publishAt).getTime()) / 1000 / 60,
  );

  const groupName = useMemo(() => {
    const groupAttr = extractRelationship(relationships, 'scanlation_group')[0];

    return groupAttr?.attributes?.name || '[No group]';
  }, [relationships]);

  const onPress = useCallback(() => {
    navigation.push(StackNavigatorRoutes.Reader, {
      chapterId: id,
      title,
      volume: `${volume ? `Vol. ${volume}.` : '' + ' '}Ch. ${chapter}`,
    });
  }, [chapter, id, navigation, title, volume]);

  return (
    <TouchableOpacity style={s.container} onPress={onPress}>
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
    </TouchableOpacity>
  );
};

export default React.memo(ChapterCard);

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

import React, { memo, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { COUNTRY_CODES, hexOpacity, MergedChaptersData } from '@saku/shared';
import { Colors } from '@saku/shared';

import { Text } from '@atoms';
import { StackNavigatorParams, StackNavigatorRoutes } from '@navigation/types';
import { StackScreenNavigationProp } from '@types';

interface ChapterListItemProps {
  data: MergedChaptersData[];
}

type Navigation =
  StackScreenNavigationProp<StackNavigatorRoutes.MangaDetails>['navigation'];

const formatDate = (date: string) => {
  const formatter = new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return formatter.format(new Date(date));
};

const codeToLanguage = (code: string) => {
  const language = COUNTRY_CODES.find(({ two_letter }) => two_letter === code);

  return language?.name ?? code;
};

const ChapterListItem = ({ data }: ChapterListItemProps) => {
  const navigation = useNavigation<Navigation>();

  const onPress = useCallback(
    (params: StackNavigatorParams[StackNavigatorRoutes.Reader]) => {
      return () => navigation.navigate(StackNavigatorRoutes.Reader, params);
    },
    [navigation],
  );

  if (data.length === 1) {
    const {
      chapter,
      translatedLanguage,
      title,
      createdAt,
      group,
      id,
      volume,
      mangaId,
    } = data[0];
    return (
      <TouchableOpacity
        style={s.container}
        onPress={onPress({
          chapterId: id,
          mangaId,
          volume: `${volume ? `Vol. ${volume}.` : '' + ' '}Ch. ${chapter}`,
        })}>
        <View style={s.row}>
          <Text style={s.title}>
            <Text style={s.bold}>{chapter} - </Text>
            <Text style={s.bold}>{codeToLanguage(translatedLanguage)} - </Text>
            <Text style={s.regular} numberOfLines={1} ellipsizeMode="tail">
              {title}
            </Text>
          </Text>
        </View>
        <View style={s.row}>
          <Text style={s.regular}>{group}</Text>
          <Text style={s.regular}>{formatDate(createdAt)}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={s.container}>
      <Text style={[s.title, s.bold]}>{data[0].chapter}</Text>
      {data.map(
        ({
          translatedLanguage,
          title,
          createdAt,
          group,
          id,
          chapter,
          volume,
          mangaId,
        }) => (
          <TouchableOpacity
            style={s.item}
            key={translatedLanguage + group}
            onPress={onPress({
              chapterId: id,
              mangaId,
              volume: `${volume ? `Vol. ${volume}.` : '' + ' '}Ch. ${chapter}`,
            })}>
            <View style={s.row}>
              <Text style={s.title}>
                <Text style={s.bold}>
                  {codeToLanguage(translatedLanguage)} -{' '}
                </Text>
                <Text style={s.regular} numberOfLines={1} ellipsizeMode="tail">
                  {title}
                </Text>
              </Text>
            </View>
            <View style={s.row}>
              <Text style={s.regular}>{group}</Text>
              <Text style={s.regular}>{formatDate(createdAt)}</Text>
            </View>
          </TouchableOpacity>
        ),
      )}
    </View>
  );
};

export default memo(ChapterListItem);

const s = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
  },
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: hexOpacity(Colors.WHITE, 0.7),
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    marginVertical: 5,
    marginLeft: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    width: '100%',
    height: 25,
  },
  regular: {
    fontWeight: 'normal',
    fontSize: 14,
  },
});

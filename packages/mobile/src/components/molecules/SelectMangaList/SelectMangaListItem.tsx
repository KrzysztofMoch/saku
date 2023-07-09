import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@atoms';
import React from 'react';
import withObservables from '@nozbe/with-observables';
import { EnchantedComponent } from '@types';
import { Manga } from '@store/db/models/manga';
import { Query } from '@nozbe/watermelondb';
import { MangaList } from '@store/db/models/manga-list';
import { CheckIcon, Colors, PlusIcon } from '@saku/shared';
import database from '@store/db';

const enhance = ({ mangaInList }: { mangaInList: Query<Manga> }) => ({
  mangaInList,
});

interface Props {
  mangaInList: Manga[];
  mangaList: MangaList;
  mangaId?: string;
  onPress: (listId: string) => void;
}

const SelectMangaListItem = ({
  mangaInList,
  mangaList,
  mangaId,
  onPress,
}: Props) => {
  const manga = mangaId
    ? mangaInList.find(({ mangaId: id }) => id === mangaId)
    : undefined;

  const _removeMangaFromList = () => {
    if (!mangaId || !manga) {
      return;
    }

    mangaList.removeMangaFromList(manga);
  };

  const _onPress = () => {
    if (!manga) {
      onPress(mangaList.id);
      return;
    }

    Alert.alert(
      'Remove manga from list',
      'Are you sure you want to remove this manga from the list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          onPress: _removeMangaFromList,
          style: 'destructive',
        },
      ],
    );
  };

  return (
    <TouchableOpacity style={s.container} onPress={_onPress}>
      <Text style={s.title} numberOfLines={2}>
        {mangaList.name}
      </Text>
      <Text>
        {manga ? (
          <CheckIcon size={26} style={s.icon} />
        ) : (
          <PlusIcon size={26} style={s.icon} />
        )}
      </Text>
    </TouchableOpacity>
  );
};

export default withObservables(
  ['mangaInList'],
  enhance,
)(SelectMangaListItem) as EnchantedComponent<Props, ['mangaInList']>;

const s = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.GRAY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 5,
  },
  title: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  icon: {
    width: 26,
  },
});

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import withObservables from '@nozbe/with-observables';

import { Colors, PlusIcon } from '@saku/shared';

import { OverlayRef, Text } from '@atoms';
import { CreateNewMangaList, LibraryMangaList } from '@molecules';
import database from '@store/db';
import { MangaList } from '@store/db/models/manga-list';
import { EnchantedComponent } from '@types';

const CARD_WIDTH = Dimensions.get('screen').width * 0.3;
const mangaListsQuery = database.collections.get<MangaList>('lists').query();

const getMangaLists = () => ({
  mangaLists: mangaListsQuery,
});

interface Props {
  mangaLists: MangaList[];
}

const getFirstMangaList = (lists: MangaList[]) => {
  if (!lists || lists.length === 0) {
    return undefined;
  }

  return lists[0];
};

const getOtherMangaList = (lists: MangaList[], oldListId: string) => {
  if (!lists || lists.length === 0) {
    return undefined;
  }

  return lists.find(({ id }) => id !== oldListId);
};

const getListById = (lists: MangaList[], id: string | null) => {
  if (!id) {
    return undefined;
  }

  const list = lists.find(({ id: listId }) => listId === id);

  // if list is undefined it means that the list was deleted
  // return other one available
  return list || getOtherMangaList(lists, id);
};

const LibraryScreen = ({ mangaLists }: Props) => {
  const { top } = useSafeAreaInsets();
  const createNewListRef = useRef<OverlayRef>(null);
  const [selectedListId, setSelectedListId] = useState<string | null>(
    getFirstMangaList(mangaLists)?.id || null,
  );

  const currentList = getListById(mangaLists, selectedListId);

  const createList = () => {
    if (!createNewListRef.current) {
      Alert.alert('Error', 'Something went wrong');
      return;
    }

    createNewListRef.current.open();
  };

  const renderSelectorItem = useCallback(
    ({ item }: { item: MangaList }) => {
      const isSelected = item.id === selectedListId;

      const onPress = () => {
        setSelectedListId(item.id);
      };

      const handleDelete = () => {
        database.write(async () => {
          await item.destroyPermanently();
        });

        if (selectedListId === item.id) {
          setSelectedListId(getOtherMangaList(mangaLists, item.id)?.id || null);
        }
      };

      const onLongPress = () => {
        Alert.alert('Delete', 'Are you sure you want to delete this list?', [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: handleDelete,
          },
        ]);
      };

      return (
        <TouchableOpacity
          onPress={onPress}
          onLongPress={onLongPress}
          style={[
            s.listSelectorItem,
            isSelected && s.listSelectorItemSelected,
          ]}>
          <Text>{item.name}</Text>
        </TouchableOpacity>
      );
    },
    [mangaLists, selectedListId],
  );

  useEffect(() => {
    if (mangaLists.length === 0) {
      return;
    }

    setSelectedListId(getFirstMangaList(mangaLists)?.id || null);
  }, [mangaLists]);

  return (
    <View style={s.container}>
      <View style={[{ paddingTop: top }, s.listSelectorContainer]}>
        <FlatList
          horizontal
          style={s.listSelector}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.contentContainer}
          data={mangaLists}
          renderItem={renderSelectorItem}
        />
        <TouchableOpacity style={s.add} onPress={createList}>
          <PlusIcon size={36} />
        </TouchableOpacity>
      </View>
      {currentList && <LibraryMangaList manga={currentList.manga} />}
      <CreateNewMangaList overlayRef={createNewListRef} />
    </View>
  );
};

export default withObservables(
  ['mangaLists'],
  getMangaLists,
)(LibraryScreen) as EnchantedComponent<Props, []>;

const s = StyleSheet.create({
  add: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.BLACK,
  },
  contentContainer: {
    alignItems: 'center',
    marginLeft: 10,
  },
  listSelector: {
    flex: 1,
  },
  listSelectorContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    backgroundColor: Colors.BLACK_LIGHT,
    flexDirection: 'row',
  },
  listSelectorItem: {
    marginHorizontal: 5,
    backgroundColor: Colors.BLACK,
    borderRadius: 15,
    padding: 10,
    paddingVertical: 8,
  },
  listSelectorItemSelected: {
    borderWidth: 2,
    borderColor: Colors.PINK,
  },
  text: {
    color: Colors.WHITE,
  },
  title: {
    color: 'white',
    fontSize: 12,
    left: 0,
    bottom: -6,
    width: CARD_WIDTH,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

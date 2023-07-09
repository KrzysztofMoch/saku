import React, { RefObject, useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import withObservables from '@nozbe/with-observables';

import { Button, Overlay, OverlayRef } from '@atoms';
import database from '@store/db';
import { MangaList } from '@store/db/models/manga-list';
import { EnchantedComponent } from '@types';

import SelectMangaListItem from './SelectMangaListItem';

interface Props {
  overlayRef?: RefObject<OverlayRef>;
  mangaId?: string;
  onClose?: () => void;
  onListSelected?: (listId: string) => void;
  mangaLists: MangaList[];
}

const observedMangaLists = database.collections.get<MangaList>('lists').query();
const observe = () => ({
  mangaLists: observedMangaLists,
});

const SelectMangaList = ({
  overlayRef,
  mangaId,
  mangaLists,
  onClose,
  onListSelected,
}: Props) => {
  const close = () => {
    overlayRef?.current?.close();
  };

  const _onClose = useCallback(() => {
    onClose && onClose();
  }, [onClose]);

  const onItemPress = useCallback(
    (listId: string) => {
      onListSelected && onListSelected(listId);
    },
    [onListSelected],
  );

  const renderItem = useCallback(
    ({ item }: { item: MangaList }) => {
      return (
        <SelectMangaListItem
          mangaInList={item.manga}
          mangaList={item}
          onPress={onItemPress}
          mangaId={mangaId}
        />
      );
    },
    [mangaId, onItemPress],
  );

  return (
    <Overlay onClose={_onClose} ref={overlayRef} style={s.container}>
      <FlatList renderItem={renderItem} data={mangaLists} style={s.list} />
      <View style={s.footer}>
        <Button title="Done" onPress={close} />
      </View>
    </Overlay>
  );
};

export default withObservables(
  ['mangaLists'],
  observe,
)(SelectMangaList) as EnchantedComponent<Omit<Props, 'mangaLists'>, []>;

const s = StyleSheet.create({
  container: {
    height: '72%',
    minHeight: 400,
  },
  footer: {
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
});

import React, { RefObject, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, StyleSheet, View } from 'react-native';

import { Colors, hexOpacity } from '@saku/shared';

import { Button, Overlay, OverlayRef, SwitchFormInput, Text } from '@atoms';
import { FormTextInput } from '@molecules';
import { createMangaList } from '@store/db/utils/manga-list';

interface Props {
  overlayRef: RefObject<OverlayRef>;
  onClose?: () => void;
}

interface FormValues {
  listName: string;
  isOnline: boolean;
}

const CreateNewMangaListModal = ({ onClose, overlayRef }: Props) => {
  const { control, handleSubmit, reset } = useForm<FormValues>();

  const close = () => {
    overlayRef.current?.close();
  };

  const _onClose = useCallback(() => {
    onClose && onClose();
    reset();
  }, [onClose, reset]);

  const onCreate = async ({ listName }: FormValues) => {
    try {
      await createMangaList(listName);
      close();
      _onClose();
    } catch (error) {
      __DEV__ && console.log(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <Overlay onClose={_onClose} style={s.container} ref={overlayRef}>
      <Text
        style={s.title}
        allowFontScaling
        minimumFontScale={0.5}
        maxFontSizeMultiplier={1.5}>
        Create New List
      </Text>
      <View style={s.form}>
        <FormTextInput
          control={control}
          name="listName"
          label="List Name"
          placeholder="Write list name"
          rules={{ required: true }}
        />
        <View style={s.switch}>
          <SwitchFormInput control={control} name="isOnline" disabled />
          <Text style={s.switchInfo}>Create on MangaDex (WIP)</Text>
        </View>
      </View>
      <View style={s.buttons}>
        <Button
          title="Create"
          onPress={handleSubmit(onCreate)}
          style={s.button}
        />
        <Button title="Cancel" alternative onPress={close} style={s.button} />
      </View>
    </Overlay>
  );
};

export default CreateNewMangaListModal;

const s = StyleSheet.create({
  buttons: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: '2%',
  },
  button: {
    flex: 1,
    height: 42,
    marginHorizontal: '2%',
  },
  container: {
    width: '86%',
    height: '40%',
    backgroundColor: Colors.BLACK_LIGHT,
    borderRadius: 15,
    padding: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  form: {
    width: '100%',
    bottom: 12,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: hexOpacity(Colors.BLACK, 0.7),
  },
  pressable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    width: '100%',
    textAlign: 'center',
  },
  switch: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    width: '90%',
  },
  switchInfo: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
});

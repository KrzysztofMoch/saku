import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { MangaSearchFilters, SCReducerAction } from '@hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@constants/colors';
import { useForm } from 'react-hook-form';
import {
  ArtistsSelectInput,
  AuthorsSelectInput,
  TagsSelectInput,
} from '@molecules';
import { MultiSelectInputData } from '@atoms';
import { convertFiltersToForm, convertFormToFilters } from '@utils';

interface AdvancedSearchPanelProps {
  params: Partial<MangaSearchFilters>;
  defaultValues: Partial<MangaSearchFilters>;
  dispatch: React.Dispatch<SCReducerAction<Partial<MangaSearchFilters>>>;
  onClose: () => void;
}

export interface AdvancedSearchForm {
  authors: MultiSelectInputData[];
  artists: MultiSelectInputData[];
  formats: MultiSelectInputData[];
  genres: MultiSelectInputData[];
  themes: MultiSelectInputData[];
}

const AdvancedSearchPanel = ({
  params,
  dispatch,
  onClose,
  defaultValues,
}: AdvancedSearchPanelProps) => {
  const { top } = useSafeAreaInsets();
  const { control, handleSubmit, clearErrors, reset } =
    useForm<AdvancedSearchForm>({
      defaultValues: async () => await convertFiltersToForm(params),
    });

  const onReset = async () => {
    const defaultFormValues = await convertFiltersToForm(defaultValues);

    reset({ ...defaultFormValues });
    clearErrors();
    dispatch({ type: 'clearAll' });
  };

  const onSubmit = (data: AdvancedSearchForm) => {
    const payload = convertFormToFilters(data, params);
    console.log('PAYLOAD', payload);

    dispatch({ type: 'setState', payload });
    onClose();
  };

  return (
    <View style={[s.container, { top: top }]}>
      <View style={s.header}>
        <TouchableOpacity style={s.headerButton} onPress={onReset}>
          <Text style={s.headerButtonText}>Reset</Text>
        </TouchableOpacity>
        <Text style={s.headerText}>Advanced Search</Text>
        <TouchableOpacity
          style={s.headerButton}
          onPress={handleSubmit(onSubmit)}>
          <Text style={s.headerButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
      {/* NOTE: Order of components is reversed for fixed render hierarchy */}
      <View style={s.inputs}>
        <TagsSelectInput tagType="genre" control={control} name="genres" />
        <TagsSelectInput tagType="theme" control={control} name="themes" />
        <TagsSelectInput tagType="format" control={control} name="formats" />
        <ArtistsSelectInput control={control} name="artists" />
        <AuthorsSelectInput control={control} name="authors" />
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    left: '3%',
    backgroundColor: Colors.BLACK_LIGHT,
    borderRadius: 10,
    width: '94%',
    height: '96%',
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
    width: '100%',
    paddingHorizontal: 16,
  },
  headerText: {
    color: Colors.WHITE,
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputs: {
    flex: 1,
    flexDirection: 'column-reverse',
    justifyContent: 'flex-end',
  },
});

export default AdvancedSearchPanel;

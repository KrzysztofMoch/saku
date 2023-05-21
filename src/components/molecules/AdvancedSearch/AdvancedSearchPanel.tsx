import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@constants/colors';
import { useForm } from 'react-hook-form';
import {
  ArtistsSelectInput,
  AuthorsSelectInput,
  FormTextInput,
  TagsSelectInput,
} from '@molecules';
import { MultiSelectInputData } from '@atoms';
import { convertFiltersToForm, convertFormToFilters } from '@utils';
import { useSearchFiltersStore } from '@store/search-filters';
import { INITIAL_PARAMS } from '@constants/default-search-filters';

interface AdvancedSearchPanelProps {
  onClose: () => void;
}

export interface AdvancedSearchForm {
  authors: MultiSelectInputData[];
  artists: MultiSelectInputData[];
  formats: MultiSelectInputData[];
  genres: MultiSelectInputData[];
  themes: MultiSelectInputData[];
  year: string;
}

const AdvancedSearchPanel = ({ onClose }: AdvancedSearchPanelProps) => {
  const { top } = useSafeAreaInsets();
  const { params, setParams, clearParams } = useSearchFiltersStore();

  const { control, handleSubmit, clearErrors, reset } =
    useForm<AdvancedSearchForm>({
      defaultValues: async () => await convertFiltersToForm(params),
    });

  const onReset = async () => {
    const defaultFormValues = await convertFiltersToForm(INITIAL_PARAMS);

    reset({ ...defaultFormValues });
    clearErrors();
    clearParams();
  };

  const onSubmit = (data: AdvancedSearchForm) => {
    const payload = convertFormToFilters(data, params);
    console.log('PAYLOAD', payload);

    setParams(payload);
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
        <TagsSelectInput tagType="format" control={control} name="formats" />
        <FormTextInput
          control={control}
          inputProps={{ keyboardType: 'number-pad' }}
          name="year"
          label="Years"
          placeholder="eg. 2010"
        />
        <TagsSelectInput tagType="genre" control={control} name="genres" />
        <TagsSelectInput tagType="theme" control={control} name="themes" />
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

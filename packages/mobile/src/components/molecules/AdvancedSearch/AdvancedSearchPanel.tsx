import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@saku/shared';
import {
  convertFiltersToForm,
  convertFormToFilters,
  INITIAL_PARAMS,
} from '@saku/shared';

import { MultiSelectInputData, SwitchFormInput } from '@atoms';
import {
  ArtistsSelectInput,
  AuthorsSelectInput,
  FormTextInput,
  TagsSelectInput,
} from '@molecules';
import { useSearchFiltersStore } from '@store/search-filters';

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
  excludeAndMode: boolean;
  includeAndMode: boolean;
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
      <TouchableWithoutFeedback style={s.inputs} onPress={Keyboard.dismiss}>
        <View style={s.inputs}>
          <FormTextInput
            control={control}
            inputProps={{ keyboardType: 'number-pad' }}
            name="year"
            label="Year"
            placeholder="eg. 2010"
          />
          <View style={s.switchesContainer}>
            <View style={s.switch}>
              <Text style={s.switchTitle}>Include mode</Text>
              <View style={s.switchContent}>
                <Text style={s.switchMode}>OR</Text>
                <SwitchFormInput control={control} name="includeAndMode" />
                <Text style={s.switchMode}>AND</Text>
              </View>
            </View>
            <View style={s.switch}>
              <Text style={s.switchTitle}>Exclude mode</Text>
              <View style={s.switchContent}>
                <Text style={s.switchMode}>OR</Text>
                <SwitchFormInput control={control} name="excludeAndMode" />
                <Text style={s.switchMode}>AND</Text>
              </View>
            </View>
          </View>
          <TagsSelectInput tagType="format" control={control} name="formats" />
          <TagsSelectInput tagType="genre" control={control} name="genres" />
          <TagsSelectInput tagType="theme" control={control} name="themes" />
          <ArtistsSelectInput control={control} name="artists" />
          <AuthorsSelectInput control={control} name="authors" />
        </View>
      </TouchableWithoutFeedback>
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
  switchesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 12,
  },
  switch: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  switchContent: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchTitle: {
    color: Colors.WHITE,
    fontSize: 13,
    fontWeight: 'bold',
    marginRight: 8,
  },
  switchMode: {
    color: Colors.WHITE,
    fontSize: 11,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
});

export default AdvancedSearchPanel;

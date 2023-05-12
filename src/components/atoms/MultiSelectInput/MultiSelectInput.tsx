import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Colors } from '@constants/colors';
import { hexOpacity } from '@utils';
import { Text } from '@atoms';

import MultiSelectInputItem from './MultiSelectInputItem';
import MultiSelectInputBadge from './MultiSelectInputBadge';

export interface MultiSelectInputData {
  value: string;
  label: string;
  excluded?: boolean;
}

export type QueryListItem = Omit<MultiSelectInputData, 'excluded'>;

interface MultiSelectInputProps {
  value: MultiSelectInputData[];
  label?: string;
  error?: string;
  allowExclude?: boolean;
  placeholder?: string;
  queryList: QueryListItem[];
  queryListStatus: 'loading' | 'error' | 'success';
  onValueChange: (value: MultiSelectInputData[]) => void;
  onQueryChange: (query: string) => void;
}

const MultiSelectInput = ({
  value: items,
  label,
  queryList,
  placeholder,
  allowExclude,
  onValueChange,
  onQueryChange,
  queryListStatus,
}: MultiSelectInputProps) => {
  const debounceTimeOut = useRef<number>();
  const scrollViewRef = useRef<ScrollView>(null);

  const [queryValue, setQueryValue] = useState<string>('');
  const [focused, setFocused] = useState<boolean>(false);

  const onFocus = () => {
    setFocused(true);
  };

  const onBlur = () => {
    setFocused(false);
  };

  const handleSubmit = () => {
    const firstItem = queryList[0];
    const index = items.findIndex(({ value }) => value === firstItem.value);

    if (index > -1) {
      return;
    }

    handleItemPress({ ...firstItem, excluded: false });
    handleQueryChange('');
  };

  const handleValueChange = useCallback(
    (newValue: MultiSelectInputData[]) => {
      onValueChange(newValue);
    },
    [onValueChange],
  );

  const handleItemPress = useCallback(
    (item: MultiSelectInputData) => {
      const newItems = [...items];
      const index = newItems.findIndex(({ value }) => value === item.value);

      if (index === -1) {
        newItems.push(item);
      }

      if (item.excluded || (!allowExclude && index !== -1)) {
        newItems.splice(index, 1);
      }

      if (!item.excluded && index !== -1 && allowExclude) {
        newItems[index] = { ...item, excluded: true };
      }

      handleValueChange(newItems);
    },
    [items, allowExclude, handleValueChange],
  );

  const getQueryListItemState = useCallback(
    (item: QueryListItem) => {
      const index = items.findIndex(({ value }) => value === item.value);

      if (index === -1) {
        return 'none';
      }

      return items[index].excluded ? 'exclude' : 'include';
    },
    [items],
  );

  const handleQueryChange = (newQuery: string) => {
    if (debounceTimeOut.current) {
      clearTimeout(debounceTimeOut.current);
    }

    setQueryValue(newQuery);

    debounceTimeOut.current = setTimeout(() => {
      onQueryChange(newQuery);
    }, 400);
  };

  const scrollToEnd = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const Badges = useMemo(
    () =>
      items.map(item => (
        <MultiSelectInputBadge
          item={item}
          key={item.value}
          onPress={handleItemPress}
        />
      )),
    [handleItemPress, items],
  );

  const QueryList = useMemo(
    () =>
      queryList.map(item => (
        <MultiSelectInputItem
          height={35}
          key={item.value}
          item={item}
          state={getQueryListItemState(item)}
          onPress={handleItemPress}
        />
      )),
    [getQueryListItemState, handleItemPress, queryList],
  );

  return (
    <View style={s.container}>
      <Text style={s.label}>{label}</Text>
      <ScrollView
        ref={scrollViewRef}
        style={s.textInputContainer}
        contentContainerStyle={s.textInputContainerContent}
        horizontal
        bounces={false}
        onContentSizeChange={scrollToEnd}
        showsHorizontalScrollIndicator={false}>
        {Badges}
        <TextInput
          autoComplete="off"
          autoCorrect={false}
          onFocus={onFocus}
          onBlur={onBlur}
          style={[s.textInput]}
          placeholder={placeholder}
          placeholderTextColor={s.placeholder.color}
          value={queryValue}
          onChangeText={handleQueryChange}
          onSubmitEditing={handleSubmit}
        />
      </ScrollView>
      {focused && queryValue !== '' && (
        <View
          style={[
            s.queryableList,
            (queryListStatus !== 'success' || queryList.length === 0) &&
              s.flexCenter,
          ]}>
          {queryListStatus === 'loading' && (
            <ActivityIndicator size="small" color={Colors.WHITE} />
          )}
          {queryListStatus === 'error' && (
            <Text style={s.queryableListError}>Error loading list</Text>
          )}
          {queryListStatus === 'success' && (
            <>
              {queryList.length === 0 ? (
                <Text style={s.queryableListError}>No results found</Text>
              ) : (
                QueryList
              )}
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default MultiSelectInput;

const s = StyleSheet.create({
  container: {
    width: '90%',
    marginHorizontal: '5%',
    marginBottom: 12,
  },
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: hexOpacity(Colors.PINK, 0.9),
    backgroundColor: hexOpacity(Colors.WHITE, 0.12),
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  textInputContainerContent: {
    alignItems: 'center',
  },
  textInput: {
    height: '100%',
    minWidth: '80%',
    maxWidth: '100%',
    marginRight: 50,
    color: Colors.WHITE,
  },
  placeholder: {
    color: Colors.WHITE,
  },
  label: {
    color: Colors.WHITE,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    marginLeft: 4,
  },
  queryableList: {
    position: 'absolute',
    top: 65,
    left: 0,
    width: '100%',
    minHeight: 70,
    maxHeight: 215,
    paddingBottom: 2,
    opacity: 1,
    backgroundColor: Colors.GRAY,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  queryableListError: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

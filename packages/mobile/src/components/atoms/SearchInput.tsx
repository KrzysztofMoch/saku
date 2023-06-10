import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputSubmitEditingEventData,
  View,
  ViewStyle,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Colors, hexOpacity, SearchIcon } from '@saku/shared';

interface SearchInputProps {
  onSubmit: (value: string) => void;
  onTextChange?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

const SearchInput = ({ style, onSubmit, onTextChange }: SearchInputProps) => {
  const timeout = useRef<number>();
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  const onFocus = () => {
    setFocused(true);
  };

  const onBlur = () => {
    setFocused(false);
  };

  const onSubmitEditing = useCallback(
    ({
      nativeEvent: { text },
    }: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      onSubmit(text);

      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    },
    [onSubmit],
  );

  const _onTextChange = useCallback(
    (text: string) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }

      timeout.current = setTimeout(() => {
        onTextChange?.(text);
      }, 500);
    },
    [onTextChange],
  );

  return (
    <View style={[s.container, style]}>
      {!focused && <SearchIcon size={23} />}
      <TextInput
        style={s.input}
        onFocus={onFocus}
        onBlur={onBlur}
        onChangeText={_onTextChange}
        onSubmitEditing={onSubmitEditing}
        autoCorrect={false}
        clearButtonMode="unless-editing"
        placeholder="Search"
        placeholderTextColor={Colors.GRAY}
        returnKeyType="search"
        numberOfLines={1}
        spellCheck={false}
        blurOnSubmit
      />
    </View>
  );
};

export default SearchInput;

const s = StyleSheet.create({
  container: {
    backgroundColor: hexOpacity(Colors.WHITE, 0.5),
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 5,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    marginLeft: 4,
    color: Colors.WHITE,
    fontSize: 16,
    paddingVertical: 2,
    fontFamily: 'Quicksand',
    flex: 1,
  },
});

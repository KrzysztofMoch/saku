import {
  StyleSheet,
  Text,
  View,
  TextInput as RNTextInput,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { Colors, hexOpacity } from '@saku/shared';

interface TextInputProps {
  value: string;
  info?: string;
  label?: string;
  error?: string;
  style?: ViewStyle;
  placeholder?: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmit?: () => void;
  textInputProps?: RNTextInput['props'];
}

const TextInput = ({
  info,
  style,
  value,
  label,
  error,
  placeholder,
  onChange,
  onFocus,
  onBlur,
  onSubmit,
  textInputProps,
}: TextInputProps) => {
  return (
    <View style={[s.container, style]}>
      <Text style={s.label}>{label}</Text>
      <View style={s.textInputContainer}>
        <RNTextInput
          value={value}
          style={s.textInput}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          onChangeText={onChange}
          onSubmitEditing={onSubmit}
          placeholderTextColor={s.placeholder.color}
          {...textInputProps}
        />
      </View>
      {info && <Text style={s.info}>{info}</Text>}
      {error && <Text style={s.error}>{error}</Text>}
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    width: '90%',
    marginHorizontal: '5%',
    marginBottom: 12,
  },
  info: {
    color: hexOpacity(Colors.WHITE, 0.6),
    fontSize: 12,
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
  textInputContainer: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: hexOpacity(Colors.PINK, 0.9),
    backgroundColor: hexOpacity(Colors.WHITE, 0.12),
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  textInput: {
    flex: 1,
    color: Colors.WHITE,
  },
  error: {
    color: Colors.ERROR,
    fontSize: 12,
  },
});

export default TextInput;

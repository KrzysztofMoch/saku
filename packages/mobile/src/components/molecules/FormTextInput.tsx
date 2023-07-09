import React, { ComponentProps } from 'react';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
} from 'react-hook-form';
import { ViewStyle } from 'react-native';

import { FormInputRule } from '@saku/shared';

import { TextInput } from '@atoms';

type TextInputProps = ComponentProps<typeof TextInput>['textInputProps'];

interface FormTextInputProps<T extends FieldValues> {
  control: Control<T, any>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  info?: string;
  inputProps?: TextInputProps;
  inputStyle?: ViewStyle;
  defaultValue?: PathValue<T, Path<T>>;
  rules?: FormInputRule<T>;
}

const FormTextInputProps = <T extends FieldValues>({
  info,
  name,
  rules,
  label,
  control,
  inputProps,
  inputStyle,
  placeholder,
  defaultValue,
}: FormTextInputProps<T>) => {
  return (
    <Controller
      rules={rules}
      defaultValue={defaultValue}
      control={control}
      name={name}
      render={({
        field: { value, onBlur, onChange },
        fieldState: { error },
      }) => (
        <TextInput
          info={info}
          label={label}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          error={error?.message}
          style={inputStyle}
          textInputProps={inputProps}
        />
      )}
    />
  );
};

export default FormTextInputProps;

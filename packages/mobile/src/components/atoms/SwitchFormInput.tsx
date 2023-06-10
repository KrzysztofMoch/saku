import { Switch } from 'react-native';
import React from 'react';
import { FieldValues, Path, Control, Controller } from 'react-hook-form';
import { Colors } from '@saku/shared';

interface SwitchFormInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T, any>;
}

const colorConfig = {
  false: Colors.GRAY,
  true: Colors.PINK,
};

const SwitchFormInput = <T extends FieldValues>({
  control,
  name,
}: SwitchFormInputProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <Switch
          value={value}
          onValueChange={onChange}
          trackColor={colorConfig}
          thumbColor={Colors.WHITE}
        />
      )}
    />
  );
};

export default SwitchFormInput;

import { FieldValues, Path, RegisterOptions } from 'react-hook-form';

type FormInputRule<T extends FieldValues> = Omit<
  RegisterOptions<T, Path<T>>,
  'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
>;

export type { FormInputRule };

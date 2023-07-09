import React, { useCallback, useMemo, useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import { useAuthorQuery } from '@saku/shared';

import { MultiSelectInput } from '@atoms';

interface AuthorsSelectInputProps<T extends FieldValues> {
  control: Control<T, any>;
  name: Path<T>;
}

const AuthorsSelectInput = <T extends FieldValues>({
  control,
  name,
}: AuthorsSelectInputProps<T>) => {
  const [query, setQuery] = useState<string>('');

  const { data, status } = useAuthorQuery(
    {
      limit: 6,
      name: query,
    },
    query !== '',
  );

  const queryList = useMemo(() => {
    const authors = data;

    if (authors?.result !== 'ok') {
      return [];
    }

    return authors.data.map(({ id, attributes: { name: label } }) => ({
      value: id,
      label,
    }));
  }, [data]);

  const onQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <MultiSelectInput
          value={value || []}
          queryList={queryList}
          onQueryChange={onQueryChange}
          onValueChange={onChange}
          label={'Authors'}
          placeholder={'Search for authors'}
          allowExclude={false}
          queryListStatus={status}
        />
      )}
    />
  );
};

export default AuthorsSelectInput;

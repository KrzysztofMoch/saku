import React, { useCallback, useMemo, useState } from 'react';
import { MultiSelectInput } from '@atoms';
import { useAuthorQuery } from '@saku/shared';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface ArtistsSelectInputProps<T extends FieldValues> {
  control: Control<T, any>;
  name: Path<T>;
}

const ArtistsSelectInput = <T extends FieldValues>({
  control,
  name,
}: ArtistsSelectInputProps<T>) => {
  const [query, setQuery] = useState<string>('');

  const { data, status } = useAuthorQuery(
    {
      limit: 6,
      name: query,
    },
    query !== '',
  );

  const queryList = useMemo(() => {
    const artists = data;

    if (artists?.result !== 'ok') {
      return [];
    }

    return artists.data.map(({ id, attributes: { name: label } }) => ({
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
          label={'Artists'}
          placeholder={'Search for artists'}
          allowExclude={false}
          queryListStatus={status}
        />
      )}
    />
  );
};

export default ArtistsSelectInput;

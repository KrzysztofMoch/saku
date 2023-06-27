import React, { useCallback, useMemo, useState } from 'react';
import { MultiSelectInput } from '@atoms';
import { useMangaTags, capitalize } from '@saku/shared';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface TagsSelectInputProps<T extends FieldValues> {
  control: Control<T, any>;
  name: Path<T>;
  tagType: 'format' | 'genre' | 'theme' | 'content';
}

const TagsSelectInput = <T extends FieldValues>({
  name,
  control,
  tagType,
}: TagsSelectInputProps<T>) => {
  const [query, setQuery] = useState<string>('');

  const { data, status } = useMangaTags();

  const queryList = useMemo(() => {
    if (data?.result !== 'ok') {
      return [];
    }

    const tags = data.data[tagType].map(({ id, name: label }) => ({
      value: id,
      label,
    }));

    // return 6 tags that match the query
    return tags.filter(({ label }) => label.includes(query)).slice(0, 6);
  }, [data, query, tagType]);

  const onQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <MultiSelectInput
          allowExclude
          value={value || []}
          queryList={queryList}
          onQueryChange={onQueryChange}
          onValueChange={onChange}
          label={capitalize(tagType)}
          placeholder={`Search for ${tagType} tags`}
          queryListStatus={status}
        />
      )}
    />
  );
};

export default TagsSelectInput;

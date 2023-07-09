import { useQuery } from '@tanstack/react-query';

import { getTags, TagsResponse } from '@api';

export interface Tag {
  id: string;
  name: string;
}
export interface MangaTags {
  content: Tag[];
  format: Tag[];
  genre: Tag[];
  theme: Tag[];
}

const isResponseValid = (response: any): response is TagsResponse => {
  return (
    response !== undefined && response !== null && response.result === 'ok'
  );
};

const transformTags: (tags: TagsResponse) => MangaTags = tags => {
  const content: Tag[] = [];
  const format: Tag[] = [];
  const genre: Tag[] = [];
  const theme: Tag[] = [];

  tags.data.forEach(({ id, attributes: { group, name } }) => {
    switch (group) {
      case 'content':
        content.push({
          id,
          name: name.en,
        });
        break;
      case 'format':
        format.push({
          id,
          name: name.en,
        });
        break;
      case 'genre':
        genre.push({
          id,
          name: name.en,
        });
        break;
      case 'theme':
        theme.push({
          id,
          name: name.en,
        });
        break;
    }
  });

  return {
    content,
    format,
    genre,
    theme,
  };
};

const useMangaTags = () => {
  const fetchTags = async () => {
    const result = await getTags();

    if (!isResponseValid(result)) {
      return result;
    }

    return {
      result: 'ok',
      data: transformTags(result),
    };
  };

  const query = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
  });

  return query;
};

export { useMangaTags };

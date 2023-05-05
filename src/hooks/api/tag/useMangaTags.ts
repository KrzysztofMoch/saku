import { TagsResponse, getTags } from '@api/tag-api';
import { useQuery } from '@tanstack/react-query';

export interface MangaTags {
  content: string[];
  format: string[];
  genre: string[];
  theme: string[];
}

const isResponseValid = (response: any): response is TagsResponse => {
  return (
    response !== undefined && response !== null && response.result === 'ok'
  );
};

const transformTags: (tags: TagsResponse) => MangaTags = tags => {
  const content: string[] = [];
  const format: string[] = [];
  const genre: string[] = [];
  const theme: string[] = [];

  tags.data.forEach(({ attributes: { group, name } }) => {
    switch (group) {
      case 'content':
        content.push(name.en);
        break;
      case 'format':
        format.push(name.en);
        break;
      case 'genre':
        genre.push(name.en);
        break;
      case 'theme':
        theme.push(name.en);
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

    return transformTags(result);
  };

  const query = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
  });

  return query;
};

export { useMangaTags };

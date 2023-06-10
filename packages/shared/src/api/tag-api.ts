import { ApiError, TagAttributes } from 'src/types';
import { get } from './network';

const PATH = '/manga/tag';

export interface TagsResponse {
  result: 'ok';
  response: 'collection';
  data: {
    id: string;
    type: 'tag';
    attributes: TagAttributes;
  }[];
  limit: number;
  offset: number;
  total: number;
}

interface TagsResponseGroupedByType {
  result: 'ok';
  response: 'collection';
  data: {
    [key in TagAttributes['group']]: {
      id: string;
      type: 'tag';
      attributes: TagAttributes;
    }[];
  };
  limit: number;
  offset: number;
  total: number;
}

type TagsGroupedByType<T extends boolean> =
  | (T extends true ? TagsResponseGroupedByType : TagsResponse)
  | ApiError
  | undefined;

const getTags = async <T extends boolean = false>(
  groupByType?: T,
): Promise<TagsGroupedByType<T>> => {
  const response = await get<TagsResponse | ApiError>(PATH);

  if (!response || response.result !== 'ok') {
    return response as TagsGroupedByType<T>;
  }

  if (groupByType) {
    const data = response.data.reduce(
      (acc, tag) => {
        if (!acc[tag.attributes.group]) {
          acc[tag.attributes.group] = [];
        }

        acc[tag.attributes.group].push(tag);

        return acc;
      },
      {
        content: [],
        format: [],
        genre: [],
        theme: [],
      } as TagsResponseGroupedByType['data'],
    );

    return {
      ...response,
      data,
    } as TagsGroupedByType<T>;
  }

  return response as TagsGroupedByType<T>;
};

export { getTags };

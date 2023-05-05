import { ApiError, TagAttributes } from '@types';
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

const getTags = async () => {
  const result = await get<TagsResponse | ApiError>(PATH);

  return result;
};

export { getTags };

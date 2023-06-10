import { ApiError, CustomListAttributes, MangaRelationship } from 'src/types';
import { get } from './network';

const PATH = '/list';

interface CustomListResponse {
  result: 'ok';
  response: 'entity';
  data: {
    id: string;
    type: 'custom_list';
    attributes: CustomListAttributes;
    relationships: MangaRelationship[];
  };
}

const getCustomListById = async (
  listId: string,
): Promise<CustomListResponse | ApiError | undefined> => {
  return get<CustomListResponse, ApiError>(`${PATH}/${listId}`);
};

export { getCustomListById };

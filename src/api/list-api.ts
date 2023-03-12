import { ApiError, CustomListAttributes, MangaRelationship } from '@types';
import { ApiResponse } from 'apisauce';
import { network } from './network';

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
): Promise<ApiResponse<CustomListResponse, ApiError>> => {
  return network.get(`${PATH}/${listId}`);
};

export { getCustomListById };

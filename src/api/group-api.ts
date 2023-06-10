import { ApiError, GetRelationship, ScanlationGroupAttributes } from '@types';
import { get } from './network';
import { convertParamsToUrl } from '@utils';

const PATH = '/group';

export interface GroupOrderBy {
  latestUploadedChapter: 'asc' | 'desc';
}

export enum GroupExpansions {
  LEADER = 'leader',
  MEMBER = 'member',
}

export interface GroupParams {
  limit: number;
  offset: number;
  ids: string[];
  name: string;
  focusedLanguage: string;
  includes: GroupExpansions[];
  order: Partial<GroupOrderBy>;
}

export interface GroupResponse {
  result: 'ok';
  response: 'collection';
  data: {
    id: string;
    type: 'scanlation_group';
    attributes: ScanlationGroupAttributes;
    relationships: GetRelationship<'scanlation_group'>;
  }[];
  limit: number;
  offset: number;
  total: number;
}

const getGroups = async (params: Partial<GroupParams>) => {
  const urlParams = params ? convertParamsToUrl(params) : '';

  const result = await get<GroupResponse | ApiError>(PATH + urlParams);

  return result;
};

const getGroup = async (id: string) => {
  const result = await get<GroupResponse | ApiError>(`${PATH}/${id}`);

  return result;
};

export { getGroups, getGroup };

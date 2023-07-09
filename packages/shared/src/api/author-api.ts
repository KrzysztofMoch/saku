import { ApiError, AuthorAttributes, GetRelationship } from '@types';
import { convertParamsToUrl } from '@utils';

import { get } from './network';

const PATH = '/author';

export interface AuthorOrderBy {
  name: 'asc' | 'desc';
}

export enum AuthorExpansions {
  MANGA = 'manga',
}

export interface AuthorParams {
  limit: number;
  offset: number;
  ids: string[];
  name: string;
  order: Partial<AuthorOrderBy>;
  includes: AuthorExpansions[];
}

export interface AuthorResponse {
  result: 'ok';
  response: 'collection';
  data: {
    id: string;
    type: 'author';
    attributes: AuthorAttributes;
    relationships: GetRelationship<'manga'>[];
  }[];
  limit: number;
  offset: number;
  total: number;
}

const getAuthors = async (params: Partial<AuthorParams>) => {
  const urlParams = params ? convertParamsToUrl(params) : '';

  const result = await get<AuthorResponse | ApiError>(PATH + urlParams);

  return result;
};

const getAuthor = async (id: string) => {
  const result = await get<AuthorResponse | ApiError>(`${PATH}/${id}`);

  return result;
};

export { getAuthor, getAuthors };

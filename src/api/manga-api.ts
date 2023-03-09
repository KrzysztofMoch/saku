import {
  TagMode,
  MangaAttributes,
  GetRelationship,
  ApiError,
  ContentRating,
} from '@types';
import { convertParamsToUrl } from '@utils';
import { ApiResponse } from 'apisauce';
import { network } from '.';

const PATH = '/manga';

interface MangaOrderBy {
  title: 'asc' | 'desc';
  year: 'asc' | 'desc';
  createdAt: 'asc' | 'desc';
  updatedAt: 'asc' | 'desc';
  latestUploadedChapter: 'asc' | 'desc';
  followedCount: 'asc' | 'desc';
  relevance: 'asc' | 'desc';
  rating: 'asc' | 'desc';
}

export enum MangaExpansions {
  MANGA = 'manga',
  COVER = 'cover_art',
  AUTHOR = 'author',
  ARTIST = 'artist',
  TAG = 'tag',
}

interface MangaParams {
  limit: number;
  offset: number;
  title: string;
  authors: string[];
  artists: string[];
  year: number;
  includedTags: string[];
  includedTagsMode: TagMode;
  excludedTags: string[];
  excludedTagsMode: TagMode;
  status: string[];
  availableTranslatedLanguages: string[];
  order: Partial<MangaOrderBy>;
  includes: MangaExpansions[];
  contentRating: ContentRating[];
  hasAvailableChapters: boolean;
  createdAtSince: string;
  group: string;
}

export interface MangaResponse {
  result: 'ok';
  response: 'collection';
  data: {
    id: string;
    type: 'manga';
    attributes: MangaAttributes;
    relationships: GetRelationship<
      'manga' | 'cover_art' | 'author' | 'artist'
    >[];
  }[];
  limit: number;
  offset: number;
  total: number;
}

const getManga: (
  params?: Partial<MangaParams>,
) => Promise<ApiResponse<MangaResponse, ApiError>> = async params => {
  const urlParams = params ? convertParamsToUrl(params) : '';

  console.log(PATH + urlParams);
  const result = await network.get<MangaResponse, ApiError>(PATH + urlParams);

  return result;
};

export { getManga };

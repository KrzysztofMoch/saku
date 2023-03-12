import {
  ApiError,
  ChapterAttributes,
  ContentRating,
  GetRelationship,
} from '@types';
import { convertParamsToUrl } from '@utils';
import { network } from './network';

interface ChapterOrderBy {
  createdAt: 'asc' | 'desc';
  updatedAt: 'asc' | 'desc';
  publishAt: 'asc' | 'desc';
  volume: 'asc' | 'desc';
  chapter: 'asc' | 'desc';
}

export enum ChapterExpansions {
  MANGA = 'manga',
  SCANLATION_GROUP = 'scanlation_group',
}

interface ChapterParams {
  limit: number;
  offset: number;
  ids: string[];
  title: string;
  groups: string[];
  translatedLanguage: string[];
  originalLanguage: string[];
  excludedOriginalLanguage: string[];
  contentRating: ContentRating[];
  excludedGroups: string[];
  includeFutureUpdates: '0' | '1';
  includeEmptyPages: '0' | '1';
  includeFuturePublishAt: '0' | '1';
  includeExternalUrl: '0' | '1';
  createdAtSince: string;
  order: Partial<ChapterOrderBy>;
  includes: ChapterExpansions[];
}

interface ChapterResponse {
  result: 'ok';
  response: 'collection';
  data: {
    id: string;
    type: 'chapter';
    attributes: ChapterAttributes;
    relationships: GetRelationship<'manga' | 'scanlation_group'>;
  }[];
  limit: number;
  offset: number;
  total: number;
}

const getChapter = async (params?: Partial<ChapterParams>) => {
  const urlParams = params ? convertParamsToUrl(params) : '';

  return await network.get<ChapterResponse, ApiError>('/chapter' + urlParams);
};

const getMangaChapters = async (
  mangaId: string,
  params?: Partial<ChapterParams>,
) => {
  const urlParams = params ? convertParamsToUrl(params) : '';

  return await network.get<ChapterResponse, ApiError>(
    `/manga/${mangaId}/feed` + urlParams,
  );
};

const getCustomListChapters = async (
  listId: string,
  params?: Partial<ChapterParams>,
) => {
  const urlParams = params ? convertParamsToUrl(params) : '';

  return await network.get<ChapterResponse, ApiError>(
    `/list/${listId}/feed` + urlParams,
  );
};

export { getChapter, getMangaChapters, getCustomListChapters };

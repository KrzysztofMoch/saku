import {
  ApiError,
  ChapterAttributes,
  ContentRating,
  GetRelationship,
} from '@types';
import {
  arrayToObject,
  convertParamsToUrl,
  extractRelationship,
  getCoversLinks,
  getTitle,
} from '@utils';
import { network } from './network';
import { MangaExpansions, getManga } from './manga-api';
import { ApiResponse } from 'apisauce';

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

export interface ChapterParams {
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

export interface ChapterResponse {
  result: 'ok';
  response: 'collection';
  data: {
    id: string;
    type: 'chapter';
    attributes: ChapterAttributes;
    relationships: GetRelationship<'manga' | 'scanlation_group'>[];
  }[];
  limit: number;
  offset: number;
  total: number;
}

export interface ChapterWithCoverResponse extends ChapterResponse {
  data: {
    id: string;
    type: 'chapter';
    attributes: ChapterAttributes;
    relationships: GetRelationship<'manga' | 'scanlation_group'>[];
    manga: {
      mangaId: string;
      title: string;
      cover: string | undefined;
    };
  }[];
}

const getChapter = async (params?: Partial<ChapterParams>) => {
  const urlParams = params ? convertParamsToUrl(params) : '';

  return await network.get<ChapterResponse, ApiError>('/chapter' + urlParams);
};

const getChapterWithCover = async (params?: Partial<ChapterParams>) => {
  const chapters = await getChapter(params);

  if (!chapters.ok || !chapters.data) {
    return chapters as ApiResponse<ChapterWithCoverResponse, ApiError>;
  }

  const mangaIdsMap = arrayToObject(
    chapters.data.data,
    ({ id }) => id,
    ({ relationships }) => {
      const mangaRelationship = extractRelationship(relationships, 'manga');

      return mangaRelationship[0].id;
    },
  );

  const mangaIds = Object.values(mangaIdsMap);

  const manga = await getManga({
    ids: mangaIds,
    includes: [MangaExpansions.COVER],
  });

  if (!manga.ok || !manga.data) {
    return manga as ApiResponse<ChapterWithCoverResponse, ApiError>;
  }

  const mangaData = manga.data.data.map(({ attributes, id, relationships }) => {
    const covers = getCoversLinks(
      id,
      extractRelationship(relationships, 'cover_art'),
    );

    return {
      mangaId: id,
      title: getTitle(attributes),
      cover: covers ? covers[0] : undefined,
    };
  });

  const result = chapters.data.data.map(chapter => {
    const pairId = mangaIdsMap[chapter.id];
    const pairManga = mangaData.find(({ mangaId }) => pairId === mangaId);

    if (!pairManga) {
      // this should never be called
      throw new Error('Missing mangaId');
    }

    return {
      ...chapter,
      manga: pairManga,
    };
  });

  return {
    ...chapters,
    data: {
      ...chapters.data,
      data: result,
    },
  } as ApiResponse<ChapterWithCoverResponse, ApiError>;
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

export {
  getChapter,
  getChapterWithCover,
  getMangaChapters,
  getCustomListChapters,
};

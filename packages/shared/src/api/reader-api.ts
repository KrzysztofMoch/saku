// NOTE: MangaDex AtHome is volunteer CDN service that store manga images and serve them to users.

import { ApiError } from '@types';

import { get } from './network';

const PATH = '/at-home/server/';

interface PagesMetadata {
  baseUrl: string;
  chapter: {
    hash: string;
    data: string[];
    dataSaver: string[];
  };
}

export interface AtHomeParams {
  chapterId: string;
  forcePort443: boolean;
}

export interface AtHomeResponse extends PagesMetadata {
  result: 'ok';
}

export interface ChapterPagesParams extends PagesMetadata {
  useDataSaver: boolean;
}

const requestChapterAtHome = async ({
  chapterId,
  forcePort443 = false,
}: AtHomeParams): Promise<AtHomeResponse | ApiError | undefined> => {
  return await get<AtHomeResponse | ApiError>(
    PATH + chapterId + '?forcePort443=' + forcePort443,
  );
};

const getChapterPages = async ({
  baseUrl,
  chapter: { hash, data, dataSaver },
  useDataSaver,
}: ChapterPagesParams) => {
  const pages = useDataSaver ? dataSaver : data;
  const saver = useDataSaver ? 'data-saver' : 'data';

  // baseUrl/saver/hash/page
  return pages.map(page => [baseUrl, saver, hash, page].join('/'));
};

export { getChapterPages, requestChapterAtHome };

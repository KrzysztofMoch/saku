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

export interface AtHomeReportParams {
  url: string;
  success: boolean;
  cached: boolean;
  bytes: number;
  duration: number;
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

const reportAtHomeHealth = async (params: AtHomeReportParams) => {
  // https://api.mangadex.org/docs/retrieving-chapter/ - The MangaDex@Home report endpoint

  if (__DEV__) {
    // Disable reporting in development because
    // it may cause false positives in the health check.
    return;
  }

  const response = await fetch('https://api.mangadex.network/report', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response;
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

export { getChapterPages, reportAtHomeHealth, requestChapterAtHome };

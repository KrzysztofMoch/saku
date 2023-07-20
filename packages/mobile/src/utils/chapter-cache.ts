import ReactNativeBlobUtil, {
  ReactNativeBlobUtilConfig,
} from 'react-native-blob-util';

import { reportAtHomeHealth } from '@saku/shared';

type DownloadChapterMode = 'cache' | 'download';

interface Params {
  mode?: DownloadChapterMode;
  chapterId: string;
  mangaId: string;
  url: string;
  page: number;
  onChapterCached?: (filePath: string) => void;
}

// Cache directory is used when user is reading manga
// Download directory is used when user WANTS to download manga
const PATHS = {
  cache: {
    root: ReactNativeBlobUtil.fs.dirs.CacheDir,
    home: 'ch-tmp',
  },
  download: {
    root: ReactNativeBlobUtil.fs.dirs.DocumentDir,
    home: 'saku',
  },
} as const;

const isExists = async (path: string) => {
  try {
    return await ReactNativeBlobUtil.fs.exists(path);
  } catch (error) {
    __DEV__ && console.log('isExists error', error);
    return false;
  }
};

const createDirectory = async (path: string) => {
  try {
    return await ReactNativeBlobUtil.fs.mkdir(path);
  } catch (error) {
    __DEV__ && console.log('createDirectory error', error);
    return false;
  }
};

export const checkIfChapterExists = async (
  localPath: string,
  callback: Params['onChapterCached'],
) => {
  try {
    const fileExists = await ReactNativeBlobUtil.fs.exists(localPath);

    if (!fileExists) {
      return null;
    }

    callback?.(localPath);
    return localPath;
  } catch (error) {
    __DEV__ && console.log('checkIfChapterExists error', error);
    return null;
  }
};

export const downloadChapterPage = async (
  localPath: string,
  url: string,
  callback: Params['onChapterCached'],
) => {
  const options: ReactNativeBlobUtilConfig = {
    fileCache: true,
    path: localPath,
  };

  const startTime = Date.now();
  let receivedBytes = 0;
  let path: string | null = null;
  let serverCached = false;

  try {
    const response = await ReactNativeBlobUtil.config(options)
      .fetch('GET', url)
      .progress((received, _) => {
        receivedBytes = received;
      });

    path = response.path();
    serverCached = response.respInfo.headers['x-cache'] === 'HIT';
    callback?.(path);
  } catch (error) {
    __DEV__ && console.log('cacheImage error', error);
  }

  reportAtHomeHealth({
    url,
    success: true,
    cached: serverCached,
    bytes: receivedBytes,
    duration: Date.now() - startTime,
  }).catch(err => {
    __DEV__ && console.log('reportAtHomeHealth error', err);
  });

  return path || url;
};

/**
 * Download chapter page
 * @param mode - cache or download
 * @param chapterId - chapter id
 * @param mangaId - manga id
 * @param url - url to page
 * @param onChapterCached - callback when chapter is cached
 * @param page - page number
 * @returns path to image
 */
export const getChapterPage = async ({
  mode = 'cache',
  chapterId,
  mangaId,
  url,
  page,
  onChapterCached,
}: Params) => {
  const { root, home } = PATHS[mode];
  const homePath = `${root}/${home}`;
  const mangaPath = `${homePath}/${mangaId}`;
  const chapterPath = `${mangaPath}/${chapterId}`;

  // Folder for (many) manga
  if (!(await isExists(homePath))) {
    await createDirectory(homePath);
  }

  // Folder for manga - mangaId
  if (!(await isExists(mangaPath))) {
    await createDirectory(mangaPath);
  }

  // Folder for chapter - chapterId
  if (!(await isExists(chapterPath))) {
    await createDirectory(chapterPath);
  }

  // Absolute path to image
  const localPath = `${chapterPath}/${page}.png`;

  // Check if image exists
  const cachedImage = await checkIfChapterExists(localPath, onChapterCached);

  // Download image
  return cachedImage || downloadChapterPage(localPath, url, onChapterCached);
};

export const removeChapter = async (
  mangaId: string,
  chapterId: string,
  source: DownloadChapterMode = 'cache',
) => {
  const { root, home } = PATHS[source];
  const homePath = `${root}/${home}`;
  const mangaPath = `${homePath}/${mangaId}`;
  const chapterPath = `${mangaPath}/${chapterId}`;

  if (!(await isExists(chapterPath))) {
    return;
  }

  try {
    await ReactNativeBlobUtil.fs.unlink(chapterPath);
  } catch (error) {
    __DEV__ && console.log('removeChapter error', error);
  }
};

export const removeManga = async (
  mangaId: string,
  source: DownloadChapterMode = 'cache',
) => {
  const { root, home } = PATHS[source];
  const homePath = `${root}/${home}`;
  const mangaPath = `${homePath}/${mangaId}`;

  if (!(await isExists(mangaPath))) {
    return;
  }

  try {
    await ReactNativeBlobUtil.fs.unlink(mangaPath);
  } catch (error) {
    __DEV__ && console.log('removeManga error', error);
  }
};

export const clearChapters = async (source: DownloadChapterMode = 'cache') => {
  const { root, home } = PATHS[source];
  const homePath = `${root}/${home}`;

  if (!(await isExists(homePath))) {
    return;
  }

  try {
    await ReactNativeBlobUtil.fs.unlink(homePath);
  } catch (error) {
    __DEV__ && console.log('clearChapters error', error);
  }
};

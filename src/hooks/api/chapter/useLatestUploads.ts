import {
  ChapterExpansions,
  ChapterResponse,
  getChapter,
  getChapterWithCover,
} from '@api/chapter-api';
import { useQuery } from '@tanstack/react-query';
import { arrayToObject, extractRelationship } from '@utils';
import {
  MinimalMangaData,
  getMangaDataFromCovers,
} from 'src/utils/api/get-manga-data-from-covers';

export type LatestUploads = ChapterResponse['data'][number] & {
  manga: MinimalMangaData;
};

const useLatestUploads = () => {
  const query = useQuery({
    queryKey: ['latest-chapter'],
    queryFn: async () =>
      await getChapterWithCover({
        limit: 6,
        order: { createdAt: 'desc' },
        includes: [ChapterExpansions.MANGA, ChapterExpansions.SCANLATION_GROUP],
      }),
  });

  return query;
};

export { useLatestUploads };

import { ChapterParams, getMangaChapters } from '@api/chapter-api';
import { useInfiniteQuery } from '@tanstack/react-query';

const DEFAULT_LIMIT = 20;

const useChapters = (
  mangaId: string,
  options: Partial<Omit<ChapterParams, 'ids' | 'offset'>>,
) => {
  const fetchChapters = async ({ pageParam = 0 }) => {
    return await getMangaChapters(mangaId, {
      offset: pageParam,
      limit: options.limit || DEFAULT_LIMIT,
      ...options,
    });
  };

  const query = useInfiniteQuery({
    keepPreviousData: true,
    queryKey: ['chapters-' + mangaId],
    queryFn: fetchChapters,
    getNextPageParam: lastPage => {
      if (!lastPage.ok || !lastPage.data) {
        return undefined;
      }

      const { limit, offset, total } = lastPage.data;

      const newOffset = offset + limit > total ? total : offset + limit;

      // If the offset is the same as the new offset, we've reached the end
      if (newOffset === offset) {
        return undefined;
      }

      return newOffset;
    },
  });

  return query;
};

export { useChapters };
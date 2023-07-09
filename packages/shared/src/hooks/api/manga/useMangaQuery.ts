import { useInfiniteQuery } from '@tanstack/react-query';

import { getManga, MangaExpansions } from '@api';
import { MangaSearchFilters } from '@types';

interface Options {
  limit: number;
  includes: MangaExpansions[];
}

const DEFAULT_LIMIT = 12;

const useMangaQuery = (
  params: Partial<MangaSearchFilters>,
  options: Partial<Options>,
) => {
  const fetchManga = async ({ pageParam = 0 }) => {
    return await getManga({
      offset: pageParam,
      limit: options?.limit || DEFAULT_LIMIT,
      includes: options?.includes,
      ...params,
    });
  };

  const query = useInfiniteQuery({
    keepPreviousData: true,
    queryKey: ['manga-query-' + JSON.stringify(params)],
    queryFn: fetchManga,
    getNextPageParam: lastPage => {
      if (lastPage === undefined || lastPage.result !== 'ok') {
        return undefined;
      }

      const { limit, offset, total } = lastPage;

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

export { useMangaQuery };

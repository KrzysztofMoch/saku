import { useQuery } from '@tanstack/react-query';
import { getManga, MangaExpansions } from '@api'
import { ContentRating } from '@types';

const useRecentlyAddedTitles = (enabled?: boolean) => {
  const query = useQuery({
    enabled,
    queryKey: ['recently-added'],
    queryFn: () =>
      getManga({
        limit: 15,
        hasAvailableChapters: true,
        includes: [MangaExpansions.COVER],
        order: { createdAt: 'desc' },
        contentRating: [
          ContentRating.EROTICA,
          ContentRating.SUGGESTIVE,
          ContentRating.SAFE,
        ],
      }),
  });

  return query;
};

export { useRecentlyAddedTitles };

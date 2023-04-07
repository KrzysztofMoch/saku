import { useQuery } from '@tanstack/react-query';
import { getManga, MangaExpansions } from '@api/manga-api';
import { ContentRating } from '@types';
import { convertDate, manipulateDate } from '@utils';

const useNewPopularTitles = (enabled?: boolean) => {
  const createdAtSince = convertDate(manipulateDate(new Date(), { days: -30 }));

  const query = useQuery({
    enabled,
    queryKey: ['new-popular-titles'],
    queryFn: () =>
      getManga({
        limit: 10,
        hasAvailableChapters: true,
        createdAtSince,
        includes: [
          MangaExpansions.COVER,
          MangaExpansions.AUTHOR,
          MangaExpansions.ARTIST,
        ],
        order: { followedCount: 'desc' },
        contentRating: [
          ContentRating.EROTICA,
          ContentRating.SUGGESTIVE,
          ContentRating.SAFE,
        ],
      }),
  });

  return query;
};

const useRecentlyAdded = (enabled?: boolean) => {
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

export { useNewPopularTitles, useRecentlyAdded };

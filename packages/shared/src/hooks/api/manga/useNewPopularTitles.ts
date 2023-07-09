import { useQuery } from '@tanstack/react-query';

import { getManga, MangaExpansions } from '@api';
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

export { useNewPopularTitles };

import { getCustomListById, getManga, MangaExpansions } from '@api';
import { useQuery } from '@tanstack/react-query';

const useSeasonalList = (enabled?: boolean) => {
  const SEASONAL_LIST_ID = '77430796-6625-4684-b673-ffae5140f337';

  const queryFn = async () => {
    const data = await getCustomListById(SEASONAL_LIST_ID);

    if (data === undefined || data.result !== 'ok') {
      throw new Error('No data found');
    }

    const ids = data?.data?.relationships?.map(({ id }) => id) ?? [];

    if (ids.length === 0) {
      throw new Error('No ids found');
    }

    return await getManga({
      ids: ids,
      includes: [
        MangaExpansions.COVER,
        MangaExpansions.AUTHOR,
        MangaExpansions.ARTIST,
      ],
      limit: 100,
    });
  };

  const query = useQuery({
    queryFn,
    queryKey: ['seasonal-list'],
    enabled,
  });

  return query;
};

export { useSeasonalList };

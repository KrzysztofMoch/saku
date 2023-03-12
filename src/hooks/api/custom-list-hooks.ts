import { getCustomListById } from '@api/list-api';
import { getManga, MangaExpansions } from '@api/manga-api';
import { useQuery } from '@tanstack/react-query';

const useSeasonalList = () => {
  const SEASONAL_LIST_ID = '44224004-1fad-425e-b416-45b46b74d3d1';

  const queryFn = async () => {
    const { data, problem } = await getCustomListById(SEASONAL_LIST_ID);

    if (problem) {
      throw new Error(problem);
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
    queryKey: ['seasonal'],
    queryFn,
  });

  return query;
};

export { useSeasonalList };

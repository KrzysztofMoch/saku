import { MangaExpansions, getManga } from '@api/manga-api';
import { useQuery } from '@tanstack/react-query';

const useManga = (mangaId: string) => {
  const query = useQuery({
    queryKey: [mangaId],
    queryFn: () =>
      getManga({
        ids: [mangaId],
        limit: 1,
        includes: [
          MangaExpansions.ARTIST,
          MangaExpansions.AUTHOR,
          MangaExpansions.COVER,
          MangaExpansions.MANGA,
          MangaExpansions.TAG,
        ],
      }),
  });

  return query;
};

export { useManga };

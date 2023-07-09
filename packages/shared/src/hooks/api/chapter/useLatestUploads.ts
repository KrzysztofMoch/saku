import { useQuery } from '@tanstack/react-query';

import { ChapterExpansions, getChapterWithCover } from '@api';

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

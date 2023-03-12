import { getChapter } from '@api/chapter-api';
import { useQuery } from '@tanstack/react-query';

const useLatestUploads = () => {
  const query = useQuery({
    queryKey: ['chapter'],
    queryFn: () => getChapter({ limit: 15, order: { createdAt: 'desc' } }),
  });

  return query;
};

export { useLatestUploads };

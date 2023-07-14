import { useQuery } from '@tanstack/react-query';

import { getChapterPages, requestChapterAtHome } from '@api';

const fetchChapterPages = async (
  chapterId: string,
  useDataSaver: boolean = false,
  forcePort443: boolean = false,
) => {
  const metadata = await requestChapterAtHome({
    chapterId,
    forcePort443,
  });

  if (!metadata || metadata.result !== 'ok') {
    return undefined;
  }

  return await getChapterPages({
    ...metadata,
    useDataSaver,
  });
};

const useChapterPages = (
  chapterId: string,
  useDataSaver: boolean = false,
  forcePort443: boolean = false,
) => {
  const query = useQuery({
    queryKey: ['chapter-pages-' + chapterId + '-' + useDataSaver],
    queryFn: () => fetchChapterPages(chapterId, useDataSaver, forcePort443),
  });

  return query;
};

export { useChapterPages };

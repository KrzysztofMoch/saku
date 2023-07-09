import { useQuery } from '@tanstack/react-query';

import { AuthorParams, getAuthors } from '@api';

type Params = Omit<AuthorParams, 'offset'>;

const DEFAULT_LIMIT = 6;

const useAuthorQuery = (params: Partial<Params>, enabled: boolean) => {
  const query = useQuery({
    enabled,
    queryKey: ['author-query-' + JSON.stringify(params)],
    queryFn: () =>
      getAuthors({
        limit: params.limit || DEFAULT_LIMIT,
        ...params,
      }),
  });

  return query;
};

export { useAuthorQuery };

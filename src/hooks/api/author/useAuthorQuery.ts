import { AuthorParams, getAuthors } from '@api/author-api';
import { useQuery } from '@tanstack/react-query';

type Params = Omit<AuthorParams, 'offset'>;

const DEFAULT_LIMIT = 6;

const useAuthorQuery = (params: Partial<Params>) => {
  const query = useQuery({
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

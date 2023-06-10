import { GroupParams, getGroups } from '@api/group-api';
import { useQuery } from '@tanstack/react-query';

type Params = Omit<GroupParams, 'offset'>;

const DEFAULT_LIMIT = 6;

const useGroupQuery = (params: Partial<Params>) => {
  const query = useQuery({
    queryKey: ['group-query-' + JSON.stringify(params)],
    queryFn: () =>
      getGroups({
        limit: params.limit || DEFAULT_LIMIT,
        ...params,
      }),
  });

  return query;
};

export { useGroupQuery };

import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { RootState } from '..';
import { is_user_authorized, logout_user } from '@utils/auth';

const ENDPOINTS_WITH_REQ_AUTH: string[] = [];

const CACHE_TAGS: string[] = [];

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://api.mangadex.org',
  prepareHeaders: async (headers, api) => {
    if (!ENDPOINTS_WITH_REQ_AUTH.includes(api.endpoint)) {
      return headers;
    }

    const authorized = await is_user_authorized();
    const { access_token } = (api.getState() as RootState).auth;

    if (authorized) {
      headers.set('Authorization', `Bearer ${access_token}`);
    } else {
      __DEV__ && console.warn('User could not be authorized');
      logout_user(true);
    }

    return headers;
  },
});

const baseQueryWrapper: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const { status } = result.error;

    if (status === 401) {
      // Unauthorized - should be called only when refreshing access token expired
      logout_user(true);
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWrapper,
  endpoints: () => ({}),
  tagTypes: CACHE_TAGS,
});

import { MangaSearchFilters } from '@types';

export const INITIAL_PARAMS: Partial<MangaSearchFilters> = {
  title: '',
  order: {
    relevance: 'desc',
  },
} as const;

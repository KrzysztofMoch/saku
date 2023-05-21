import { MangaSearchFilters } from '@hooks';

export const INITIAL_PARAMS: Partial<MangaSearchFilters> = {
  title: '',
  order: {
    relevance: 'desc',
  },
} as const;

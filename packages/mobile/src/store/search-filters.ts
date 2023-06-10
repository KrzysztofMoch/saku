import { INITIAL_PARAMS, MangaSearchFilters } from '@saku/shared';
import { create } from 'zustand';

interface SearchFiltersStore {
  params: Partial<MangaSearchFilters>;
  setParams: (state: Partial<MangaSearchFilters>) => void;
  clearParams: () => void;
}

export const useSearchFiltersStore = create<SearchFiltersStore>((set, get) => ({
  params: INITIAL_PARAMS,
  setParams: newParams =>
    set({
      params: {
        ...get().params,
        ...newParams,
      },
    }),
  clearParams: () => set({ params: INITIAL_PARAMS }),
}));

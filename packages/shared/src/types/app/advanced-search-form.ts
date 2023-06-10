export interface MultiSelectInputData {
  value: string;
  label: string;
  excluded?: boolean;
}

export interface AdvancedSearchForm {
  authors: MultiSelectInputData[];
  artists: MultiSelectInputData[];
  formats: MultiSelectInputData[];
  genres: MultiSelectInputData[];
  themes: MultiSelectInputData[];
  year: string;
  excludeAndMode: boolean;
  includeAndMode: boolean;
}
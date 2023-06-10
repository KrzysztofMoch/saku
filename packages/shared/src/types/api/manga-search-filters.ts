import { MangaOrderBy } from "@api";
import { ContentRating, TagMode } from "@types";

export interface MangaSearchFilters {
  title: string;
  authors: string[];
  artists: string[];
  year: number;
  includedTags: string[];
  includedTagsMode: TagMode;
  excludedTags: string[];
  excludedTagsMode: TagMode;
  status: string[];
  availableTranslatedLanguages: string[];
  order: Partial<MangaOrderBy>;
  contentRating: ContentRating[];
  hasAvailableChapters: boolean;
  createdAtSince: string;
  group: string;
}
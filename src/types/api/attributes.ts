import { ContentRating } from './content-rating';
import { MangaRelationType } from './manga-relation';
import { PublicationDemographic } from './publication-demographic';
import { PublicationStatus } from './publication-status';
import { Relationship } from './relationship';

type LocalizedString = {
  en: string;
  [key: string]: string;
};

interface ChapterAttributes {
  title: string | null;
  volume: string | null;
  chapter: string | null;
  pages: string | null;
  translatedLanguage: string[];
  uploader: string | null;
  externalUrl: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
  publishAt: string;
  readableAt: string;
}

interface MangaAttributes {
  title: LocalizedString;
  altTitles: LocalizedString;
  description: LocalizedString;
  isLocked: boolean;
  originalLanguage: string;
  lastVolume: string | null;
  lastChapter: string | null;
  publicationDemographic: PublicationDemographic | null;
  status: PublicationStatus;
  year: number | null;
  contentRating: ContentRating;
  chapterNumbersResetOnNewVolume: boolean;
  availableTranslatedLanguages: LocalizedString;
  latestUploadedChapter: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  tags: Relationship<'tag', TagAttributes>[];
}

interface TagAttributes {
  name: LocalizedString;
  description: LocalizedString;
  group: 'content' | 'format' | 'genre' | 'theme';
  version: number;
}

interface ScanlationGroupAttributes {
  name: string;
  website: string | null;
  discord: string | null;
  contactEmail: string | null;
  description: string | null;
  twitter: string | null;
  mangaUpdates: string | null;
  focusedLanguage: string | null;
  official: boolean;
  inactive: boolean;
  publishDelay: number;
  version: number;
  createdAt: string;
  updatedAt: string;
}

interface CoverAttributes {
  volume: string | null;
  fileName: string;
  description: string | null;
  locale: string | null;
  version: 1;
  createdAt: string;
  updatedAt: string;
}

interface MangaRelationAttributes {
  relation: MangaRelationType;
}

interface CustomListAttributes {
  name: string;
  visibility: 'public' | 'private';
  version: number;
}

interface AuthorAttributes {
  name: string;
  imageUrl: string;
  biography: LocalizedString;
}

export type {
  ChapterAttributes,
  MangaAttributes,
  TagAttributes,
  ScanlationGroupAttributes,
  CoverAttributes,
  MangaRelationAttributes,
  AuthorAttributes,
  CustomListAttributes,
};

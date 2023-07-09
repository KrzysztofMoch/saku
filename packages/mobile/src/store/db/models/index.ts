// list of models to be imported in the database
import { Chapter } from './chapter';
import { Manga } from './manga';
import { MangaList, MangaListManga } from './manga-list';

export const models = [MangaList, Chapter, Manga, MangaListManga];

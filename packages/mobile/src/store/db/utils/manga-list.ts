import database from '@store/db/';

import { MangaList } from '../models/manga-list';

export const createMangaList = async (name: string) => {
  await database.write(async () => {
    await database.get<MangaList>('lists').create(list => {
      list.name = name;
    });
  });
};

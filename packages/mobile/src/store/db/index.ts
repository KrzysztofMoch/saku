import { librarySchemaV1 } from '@store/db/schema';
import { models } from '@store/db/models';
import Database from '@nozbe/watermelondb/Database';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { Manga } from './models/manga';
import { MangaList, MangaListManga } from './models/manga-list';

const adapter = new SQLiteAdapter({
  schema: librarySchemaV1,
  migrations: undefined,
  jsi: true,
  onSetUpError: error => {
    console.log(
      '[WatermelonDB]: There was en error while set up database ->',
      error,
    );
  },
});

const database = new Database({
  adapter,
  modelClasses: models,
});

// THIS CLEAR THE DATABASE - DON'T USE IT IN PRODUCTION
// database.write(async () => {
//   await database.unsafeResetDatabase();
// });

database.get<Manga>('manga').query().then(manga => {
  console.log(manga.map(m => `${m.title} (${m.id})`));
});

// display all lists in the database (map to name)
database.get<MangaList>('lists').query().then(lists => {
  console.log(lists.map(l => `${l.name} (${l.id})`));
});

// display all manga relations in the database (map to manga title)
database.get<MangaListManga>('lists_manga').query().then(relations => {
  console.log(relations.map(r => `${r.manga.id} - ${r.list.id}`));
});

export default database;
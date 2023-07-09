import { Model, Q, Relation } from '@nozbe/watermelondb';
import {
  field,
  immutableRelation,
  lazy,
  reader,
  text,
  writer,
} from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';

import { Manga } from './manga';

export class MangaList extends Model {
  static table = 'lists';

  @text('name') name!: string;
  @field('external_id') externalId?: string;
  @field('last_synced_at') lastSyncedAt?: number;
  @field('last_updated_at') lastUpdatedAt?: number;

  static associations: Associations = {
    lists_manga: { type: 'has_many', foreignKey: 'list_id' },
  };

  @lazy manga = this.collections
    .get<Manga>('manga')
    .query(Q.on('lists_manga', 'list_id', this.id));

  @writer async addMangaToList(manga: Manga): Promise<void> {
    await this.collections
      .get<MangaListManga>('lists_manga')
      .create(listManga => {
        listManga.list.set(this);
        listManga.manga.set(manga);
      });
  }

  @writer async removeMangaFromList(manga: Manga): Promise<void> {
    await this.collections
      .get<MangaListManga>('lists_manga')
      .query(Q.where('list_id', this.id), Q.where('manga_id', manga.id))
      .destroyAllPermanently();

    await this.callWriter(() => this.cleanUpManga());
  }

  @writer async removeAllMangaFromList(): Promise<void> {
    await this.collections
      .get<MangaListManga>('lists_manga')
      .query(Q.where('list_id', this.id))
      .destroyAllPermanently();

    await this.callWriter(() => this.cleanUpManga());
  }

  @writer async cleanUpManga(): Promise<void> {
    const relations = await this.collections
      .get<MangaListManga>('lists_manga')
      .query();
    const mangaIds = relations.map(relation => relation.manga.id);

    if (mangaIds.length === 0) {
      return;
    }

    const mangaToRemove = await this.collections
      .get<Manga>('manga')
      .query(Q.where('id', Q.notIn(mangaIds)));

    this.batch(
      ...mangaToRemove.map(manga => manga.prepareDestroyPermanently()),
    );
  }

  @reader async hasManga(mangaId: string): Promise<boolean> {
    const relations = await this.collections
      .get<MangaListManga>('lists_manga')
      .query(Q.where('list_id', this.id), Q.where('manga_id', mangaId));

    return relations.length > 0;
  }

  async destroyPermanently(): Promise<void> {
    // remove manga - manga list relations
    await this.callWriter(() => this.removeAllMangaFromList());
    await this.callWriter(() => this.cleanUpManga());
    await super.destroyPermanently();
  }
}

export class MangaListManga extends Model {
  static table = 'lists_manga';

  @immutableRelation('lists', 'list_id') list!: Relation<MangaList>;
  @immutableRelation('manga', 'manga_id') manga!: Relation<Manga>;

  static associations: Associations = {
    manga: { type: 'belongs_to', key: 'manga_id' },
    list: { type: 'belongs_to', key: 'list_id' },
  };
}

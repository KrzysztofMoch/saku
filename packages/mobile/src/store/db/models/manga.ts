import { Model, Q, Query } from '@nozbe/watermelondb';
import {
  children,
  field,
  lazy,
  text,
  writer,
} from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';

import { Chapter } from './chapter';
import { MangaListManga } from './manga-list';

export class Manga extends Model {
  static table = 'manga';

  @field('manga_id') mangaId!: string;
  @text('title') title!: string;
  @text('description') description!: string;
  @field('author') author!: string;
  @field('artist') artist!: string;
  @field('cover_url') coverUrl?: string;
  @field('last_synced_at') lastSyncedAt?: number;
  @field('last_updated_at') lastUpdatedAt?: number;

  static associations: Associations = {
    lists_manga: { type: 'has_many', foreignKey: 'manga_id' },
    chapters: { type: 'has_many', foreignKey: 'manga_id' },
  };

  @lazy inList = this.collections
    .get<MangaListManga>('lists_manga')
    .query(Q.on('lists_manga', 'manga_id', this.id));

  @children('chapters') chapters!: Query<Chapter>;

  @lazy chaptersToRead = this.chapters.extend(Q.where('is_read', false));

  @writer async removeFromAllLists(): Promise<void> {
    const relations = await this.collections
      .get<MangaListManga>('lists_manga')
      .query(Q.where('manga_id', this.id));

    if (relations.length > 0 && __DEV__) {
      console.warn(`Manga ${this.id} was still in ${relations.length} lists`);
    }

    await this.batch(
      ...relations.map(relation => relation.prepareDestroyPermanently()),
    );
  }

  async destroyPermanently(): Promise<void> {
    await this.callWriter(() => this.removeFromAllLists());
    super.destroyPermanently();
  }
}

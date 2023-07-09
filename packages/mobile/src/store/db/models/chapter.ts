import { Model, Relation } from "@nozbe/watermelondb";
import { Associations } from "@nozbe/watermelondb/Model";
import { field, text, immutableRelation, writer } from "@nozbe/watermelondb/decorators";
import { Manga } from "./manga";

export class Chapter extends Model {
  static table = 'chapters';

  @field('chapter_id') chapterId!: string;
  @field('is_read') isRead!: boolean;
  @text('title') title?: string;
  @text('volume') volume?: string;
  @text('chapter') chapter?: string;
  @immutableRelation('manga', 'manga_id') manga!: Relation<Manga>;

  static associations: Associations = {
    manga: { type: 'belongs_to', key: 'manga_id' }
  };

  @writer async markAsRead() {
    await this.update(chapter => {
      chapter.isRead = true;
    });
  }
}
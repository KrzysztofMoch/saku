import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const librarySchemaV1 = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'lists',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'external_id', type: 'string', isOptional: true },
        { name: 'last_synced_at', type: 'number', isOptional: true },
        { name: 'last_updated_at', type: 'number', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'lists_manga',
      columns: [
        { name: 'list_id', type: 'string' },
        { name: 'manga_id', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'manga',
      columns: [
        { name: 'manga_id', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'author', type: 'string' },
        { name: 'artist', type: 'string' },
        { name: 'cover_url', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'last_synced_at', type: 'number', isOptional: true },
        { name: 'last_updated_at', type: 'number', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'chapters',
      columns: [
        { name: 'chapter_id', type: 'string' },
        { name: 'manga_id', type: 'string' },
        { name: 'is_read', type: 'boolean' },
        { name: 'title', type: 'string', isOptional: true },
        { name: 'volume', type: 'string', isOptional: true },
        { name: 'chapter', type: 'string', isOptional: true },
      ],
    }),
  ],
});

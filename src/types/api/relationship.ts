import {
  AuthorAttributes,
  ChapterAttributes,
  CoverAttributes,
  ListAttributes as CustomListAttributes,
  MangaAttributes,
  MangaRelationAttributes,
  ScanlationGroupAttributes,
  TagAttributes,
} from './attributes';
import { MangaRelationType } from './manga-relation';

export type MangaRelationship = {
  id: string;
  type: 'manga';
  related: MangaRelationType;
  attributes?: MangaAttributes;
};

export type Relationship<Type, Attributes> = {
  id: string;
  type: Type;
  attributes?: Attributes;
};

export type TagRelationship = Relationship<'tag', TagAttributes>;

export type ScanlationGroupRelationship = Relationship<
  'scanlation_group',
  ScanlationGroupAttributes
>;

export type CoverRelationship = Relationship<'cover_art', CoverAttributes>;

export type ChapterRelationship = Relationship<'chapter', ChapterAttributes>;

export type MangaRelationRelationship = Relationship<
  'manga_relation',
  MangaRelationAttributes
>;

export type CustomListRelationship = Relationship<
  'custom_list',
  CustomListAttributes
>;

export type AuthorRelationship = Relationship<'author', AuthorAttributes>;

export type ArtistRelationship = Relationship<'artist', AuthorAttributes>;

export type AnyRelationship =
  | TagRelationship
  | ScanlationGroupRelationship
  | CoverRelationship
  | ChapterRelationship
  | MangaRelationRelationship
  | MangaRelationship
  | CustomListRelationship
  | AuthorRelationship
  | ArtistRelationship;

export type RelationshipKeys = AnyRelationship['type'];

export type GetRelationship<Type extends RelationshipKeys> = Extract<
  AnyRelationship,
  { type: Type }
>;

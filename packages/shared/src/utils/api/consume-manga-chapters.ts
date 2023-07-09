import { ChapterResponse } from '@api';
import { ChapterAttributes } from '@types';

import { extractRelationship } from '../extract-relationship';

export type MergedChaptersData = ChapterAttributes & {
  group: string;
  id: string;
};

export interface MergedChapters {
  key: string;
  data: MergedChaptersData[];
}

export interface MergedByVolume {
  volume: string;
  data: MergedChapters[];
}

const consumeMangaChapters = (data: ChapterResponse['data']) => {
  const mergedChapters: MergedChapters[] = [];
  const mergedByVolume: MergedByVolume[] = [];

  for (const { attributes, relationships, id } of data) {
    const { volume, chapter } = attributes;

    if (!chapter && !volume) {
      continue;
    }

    const key = `${volume || 'None'}-${chapter || 0}`;
    const group =
      extractRelationship(relationships, 'scanlation_group').map(
        ({ attributes: attr }) => attr?.name,
      )[0] ?? '[No Group]';

    const existing = mergedChapters.find(({ key: k }) => k === key);

    if (existing) {
      existing.data.push({
        ...attributes,
        group,
        id,
      });
      continue;
    }

    mergedChapters.push({
      key: key,
      data: [
        {
          ...attributes,
          group,
          id,
        },
      ],
    });
  }

  for (const chapter of mergedChapters) {
    const [volume, _] = chapter.key.split('-');

    const existing = mergedByVolume.find(({ volume: v }) => v === volume);

    if (existing) {
      existing.data.push(chapter);
      continue;
    }

    mergedByVolume.push({
      volume,
      data: [chapter],
    });
  }

  return mergedByVolume;
};

export default consumeMangaChapters;

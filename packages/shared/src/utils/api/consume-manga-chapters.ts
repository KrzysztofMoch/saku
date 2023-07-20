import { ChapterResponse } from '@api';
import { ChapterAttributes } from '@types';

import { extractRelationship } from '../extract-relationship';

export type MergedChaptersData = ChapterAttributes & {
  mangaId: string;
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

interface ConsumeMangaChaptersParams {
  mangaId: string;
  chapters: ChapterResponse['data'];
}

const consumeMangaChapters = (data: ConsumeMangaChaptersParams) => {
  const { chapters, mangaId } = data;

  const mergedChapters: MergedChapters[] = [];
  const mergedByVolume: MergedByVolume[] = [];

  for (const { attributes, relationships, id } of chapters) {
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
        mangaId,
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
          mangaId,
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

import { LINKS } from '@constants';
import { CoverRelationship } from '@types';

const getCoversLinks = (
  mangaId: string,
  coverRel: CoverRelationship[],
  size: '256' | '512' | 'original' = '256',
) => {
  if (coverRel.length === 0) {
    return null;
  }

  const withAttributes = coverRel.filter(rel => rel.attributes);

  if (withAttributes.length === 0) {
    __DEV__ && console.log('No cover attributes');
    return null;
  }

  const links = withAttributes.map(({ attributes }) => {
    const { fileName } = attributes!;

    if (size === 'original') {
      return `${LINKS.COVER}/${mangaId}/${fileName}`;
    }

    // for 'main' covers api provides 256px nad 512px images
    return `${LINKS.COVER}/${mangaId}/${fileName}.${size}.jpg`;
  });

  return links;
};

export default getCoversLinks;

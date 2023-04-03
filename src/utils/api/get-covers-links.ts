import LINKS from '@constants/links';
import { CoverRelationship } from '@types';

const getCoversLinks = (
  mangaId: string,
  coverRel: CoverRelationship[],
  art: boolean = false,
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

    if (art) {
      return `${LINKS.COVER}/${mangaId}/${fileName}`;
    }

    // for 'main' covers api provides 256px images
    return `${LINKS.COVER}/${mangaId}/${fileName}.256.jpg`;
  });

  return links;
};

export default getCoversLinks;

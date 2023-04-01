import LINKS from '@constants/links';
import { CoverRelationship } from '@types';

const getCoversLinks = (mangaId: string, coverRel: CoverRelationship[]) => {
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

    return `${LINKS.COVER}/${mangaId}/${fileName}`;
  });

  return links;
};

export default getCoversLinks;

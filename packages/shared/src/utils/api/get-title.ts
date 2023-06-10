import { MangaAttributes } from 'src/types';

const getTitle = (attr: MangaAttributes) => {
  const { title, altTitles } = attr;

  if (title.en) {
    return title.en;
  }

  if (altTitles.en) {
    return altTitles.en;
  }

  const any = Object.values(title)[0];

  if (any) {
    return any;
  }

  const anyAlt = Object.values(altTitles)[0];

  if (anyAlt) {
    return anyAlt;
  }

  return '[NO TITLE]';
};

export default getTitle;

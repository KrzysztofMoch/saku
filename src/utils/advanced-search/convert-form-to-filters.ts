import { MangaSearchFilters } from '@hooks';
import { AdvancedSearchForm } from '@molecules';
import { TagMode } from '@types';

const convertFormToFilters = (
  form: AdvancedSearchForm,
  defaultValues: Partial<MangaSearchFilters>,
) => {
  const {
    authors,
    artists,
    formats,
    genres,
    themes,
    year,
    excludeAndMode,
    includeAndMode,
  } = form;

  const params: Partial<MangaSearchFilters> = {
    ...defaultValues,
  };

  if (authors.length > 0) {
    Object.assign(params, {
      authors: authors.map(({ value }) => value),
    });
  } else {
    delete params.authors;
  }

  if (artists.length > 0) {
    Object.assign(params, {
      artists: artists.map(({ value }) => value),
    });
  } else {
    delete params.artists;
  }

  if (formats.length > 0 || genres.length > 0 || themes.length > 0) {
    // if exclude is true, then we want to add tag to excluded list else add to included list
    const tags = [...formats, ...genres, ...themes];

    const includedTags = tags
      .filter(({ excluded }) => !excluded)
      .map(({ value }) => value);
    const excludedTags = tags
      .filter(({ excluded }) => excluded)
      .map(({ value }) => value);

    if (includedTags.length > 0) {
      Object.assign(params, {
        includedTags,
      });
    } else {
      delete params.includedTags;
    }

    if (excludedTags.length > 0) {
      Object.assign(params, {
        excludedTags,
      });
    } else {
      delete params.excludedTags;
    }
  }

  if (year !== '' && !isNaN(parseInt(year, 10))) {
    Object.assign(params, {
      year: parseInt(year, 10),
    });
  } else {
    delete params.year;
  }

  if (excludeAndMode) {
    Object.assign(params, {
      excludedTagsMode: TagMode.AND,
    });
  } else {
    delete params.excludedTagsMode;
  }

  if (includeAndMode) {
    Object.assign(params, {
      includedTagsMode: TagMode.AND,
    });
  } else {
    delete params.includedTagsMode;
  }

  return params;
};

export { convertFormToFilters };

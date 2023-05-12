import { getAuthors } from '@api/author-api';
import { getTags } from '@api/tag-api';
import { MangaSearchFilters } from '@hooks';
import { AdvancedSearchForm } from '@molecules';

const extractAuthors = async (
  authors: Partial<MangaSearchFilters>['authors'],
  filters: any,
) => {
  const authorsData = await getAuthors({
    ids: authors,
  });

  if (!authorsData || authorsData.result !== 'ok') {
    Object.assign(filters, {
      authors: [],
    });

    return;
  }

  Object.assign(filters, {
    authors: authorsData.data.map(({ id, attributes: { name } }) => ({
      value: id,
      label: name,
    })),
  });
};

const extractTags = async (
  includedTags: Partial<MangaSearchFilters>['includedTags'],
  excludedTags: Partial<MangaSearchFilters>['excludedTags'],
  filters: any,
) => {
  const tagsData = await getTags(true);

  Object.assign(filters, {
    formats: [],
    genres: [],
    themes: [],
  });

  if (!tagsData || tagsData.result !== 'ok') {
    Object.assign(filters, {
      formats: [],
      genres: [],
      themes: [],
    });
    return;
  }

  const formats = tagsData.data.content
    .map(({ id, attributes: { name } }) => ({
      value: id,
      label: name.en,
      excluded: excludedTags?.includes(id),
    }))
    .filter(
      ({ value }) =>
        includedTags?.includes(value) || excludedTags?.includes(value),
    );

  const genres = tagsData.data.genre
    .map(({ id, attributes: { name } }) => ({
      value: id,
      label: name.en,
      excluded: excludedTags?.includes(id),
    }))
    .filter(
      ({ value }) =>
        includedTags?.includes(value) || excludedTags?.includes(value),
    );

  const themes = tagsData.data.theme
    .map(({ id, attributes: { name } }) => ({
      value: id,
      label: name.en,
      excluded: excludedTags?.includes(id),
    }))
    .filter(
      ({ value }) =>
        includedTags?.includes(value) || excludedTags?.includes(value),
    );

  Object.assign(filters, {
    formats,
    genres,
    themes,
  });
};

const convertFiltersToForm = async (params: Partial<MangaSearchFilters>) => {
  const filters = {};

  const filterKeys = Object.keys(params);

  if (filterKeys.includes('authors')) {
    await extractAuthors(params.authors, filters);
  } else {
    Object.assign(filters, {
      authors: [],
    });
  }

  if (filterKeys.includes('artists')) {
    await extractAuthors(params.artists, filters);
  } else {
    Object.assign(filters, {
      artists: [],
    });
  }

  if (
    filterKeys.includes('includedTags') ||
    filterKeys.includes('excludedTags')
  ) {
    await extractTags(params.includedTags, params.excludedTags, filters);
  } else {
    Object.assign(filters, {
      formats: [],
      genres: [],
      themes: [],
    });
  }

  return filters as AdvancedSearchForm;
};

export { convertFiltersToForm };

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

  if (!tagsData || tagsData.result !== 'ok') {
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
  const filters: AdvancedSearchForm = {
    authors: [],
    artists: [],
    formats: [],
    genres: [],
    themes: [],
    year: '',
  };

  if ('authors' in params) {
    await extractAuthors(params.authors, filters);
  }

  if ('artists' in params) {
    await extractAuthors(params.artists, filters);
  }

  if ('includedTags' in params || 'excludedTags' in params) {
    await extractTags(params.includedTags, params.excludedTags, filters);
  }

  if ('year' in params && params.year) {
    Object.assign(filters, {
      year: params.year.toString(),
    });
  }

  return filters;
};

export { convertFiltersToForm };

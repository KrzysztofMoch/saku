const convertParamsToUrl = (params: object) => {
  const result: string[] = [];

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(element => {
        if (element === null || element === undefined) {
          return;
        }

        if (element instanceof Object && 'id' in element) {
          result.push(`${key}[]=${element.id}`);
          return;
        }

        result.push(`${key}[]=${element}`);
      });
      return;
    }

    if (value instanceof Object) {
      Object.entries(value).forEach(([subKey, subValue]) => {
        if (subValue === null || subValue === undefined) {
          return;
        }

        result.push(`${key}[${subKey}]=${subValue}`);
      });
      return;
    }

    result.push(`${key}=${value}`);
  });

  if (result.length === 0) {
    return '';
  }

  return '?' + result.join('&');
};

export default convertParamsToUrl;

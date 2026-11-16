export const formatQuery = (value: string) => {
  return Number(value?.replaceAll(',', ''));
};

export const queryStringFormat = (data: Record<string, string>) => {
  return Object.keys(data)
    .map((key) => {
      return `${key}=${encodeURIComponent(data && key ? data[key] : '')}`;
    })
    .join('&');
};

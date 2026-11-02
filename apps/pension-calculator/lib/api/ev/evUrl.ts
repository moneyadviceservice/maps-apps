export const evUrl = (path: string): string => {
  const base = process.env.EV_API;
  if (!base) {
    throw new Error('Missing EV_API');
  }

  const normalisedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalisedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalisedBase}${normalisedPath}`;
};

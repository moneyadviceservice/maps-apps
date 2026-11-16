export const stripTrailingSlash = (path: string) =>
  path.endsWith('/') ? path.slice(0, -1) : path;

export const normalisePath = (path: string) =>
  stripTrailingSlash(path.split(/[?#]/)[0]);

const isWithinSection = (path: string, section: string) =>
  path === section || path.startsWith(`${section}/`);

export const isItemActive = (
  href: string,
  currentPath: string,
  sections: string[],
  lang: string,
) => {
  if (href === currentPath) {
    return true;
  }

  return sections.some((section) =>
    isWithinSection(currentPath, `/${lang}${section}`),
  );
};

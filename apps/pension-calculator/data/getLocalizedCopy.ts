export type LocalizedCopy = {
  readonly en: string;
  readonly cy: string;
};

export const getLocalizedCopy = (copy: LocalizedCopy, lang: string): string => {
  if (lang === 'cy' && copy.cy) {
    return copy.cy;
  }
  return copy.en;
};

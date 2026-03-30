import { setCanonicalUrl } from 'utils/setCanonicalUrl';

export const getCanonicalUrl = (lang: string): string => {
  return setCanonicalUrl(`/${lang}`);
};

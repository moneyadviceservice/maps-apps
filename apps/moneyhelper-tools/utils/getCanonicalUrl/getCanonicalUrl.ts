import { setCanonicalUrl } from 'utils/setCanonicalUrl';

export const getCanonicalUrl = (asPath: string, lang: string): string => {
  const pathSegments = asPath.split('/');
  const path = pathSegments[2] ?? '';
  return setCanonicalUrl(`/${lang}/${path}`) ?? '';
};

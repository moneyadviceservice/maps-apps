import { createContext, use } from 'react';

import { useRouter } from 'next/router';

const locales = new Set(['en', 'cy']);

export const LanguageContext = createContext<string>('en');

export const useLanguage = (): string => {
  const router = useRouter();

  const cleanPath = (router.asPath || '').split('?')[0].split('#')[0];
  const firstSegment = cleanPath.split('/')[1];

  const queryLang = Array.isArray(router.query.language)
    ? router.query.language[0]
    : router.query.language;

  if (locales.has(queryLang as string)) {
    return queryLang as string;
  }

  if (locales.has(firstSegment)) {
    return firstSegment;
  }

  return 'en';
};

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const language = useLanguage();

  return <LanguageContext value={language}>{children}</LanguageContext>;
};

export const useContextLanguage = (): string => {
  return use(LanguageContext);
};

export default useLanguage;

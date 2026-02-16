import { useRouter } from 'next/router';

export const useLanguage = () => {
  const router = useRouter();
  const locales = ['en', 'cy'];
  const langFromQuery =
    (Array.isArray(router?.query.language)
      ? router.query.language[0]
      : router.query.language) ?? '';
  const langFromPath = router.asPath ? router.asPath.slice(1, 3) : '';
  const language = locales.includes(langFromQuery)
    ? langFromQuery
    : locales.includes(langFromPath)
    ? langFromPath
    : 'en';

  return language;
};

export default useLanguage;

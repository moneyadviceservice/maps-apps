import { useRouter } from 'next/router';

export const useLanguage = () => {
  const router = useRouter();
  const language =
    (Array.isArray(router?.query.language)
      ? router.query.language[0]
      : router?.query.language) ?? 'en';
  return ['en', 'cy'].includes(language) ? language : 'en';
};

export default useLanguage;

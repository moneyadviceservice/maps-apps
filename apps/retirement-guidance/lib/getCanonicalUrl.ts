import { getLanguage, type Language } from '@maps-react/utils/language';

export const getCanonicalUrl = (language: Language): string => {
  const urlLang = getLanguage(language);

  return `https://www.moneyhelper.org.uk/${urlLang}/pensions-and-retirement/pensions-basics/get-retirement-guidance`;
};

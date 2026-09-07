import { isStringLocale, type Locale } from 'data/navigationData';

export const getCanonicalUrl = (lang: Locale): string => {
  const urlLang = isStringLocale(lang) ? lang : 'en';

  return `https://www.moneyhelper.org.uk/${urlLang}/pensions-and-retirement/pensions-basics/retirement-budget-planner`;
};

import type { Translate } from 'types/translation';

export const pensionCalculatorAppTitle = (z: Translate) =>
  z({
    en: 'Pension calculator',
    cy: 'Cyfrifiannell Pensiwn',
  });

export const pensionCalculatorPageTitle = (
  pageHeading: string,
  z: Translate,
  hasError = false,
) => {
  const title = `${pageHeading} - ${pensionCalculatorAppTitle(z)}`;
  if (!hasError) {
    return title;
  }

  return `${z({ en: 'Error:', cy: 'Gwall:' })} ${title}`;
};

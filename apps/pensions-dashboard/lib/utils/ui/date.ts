import { NO_DATA } from '../../constants';

const MONTHS = {
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  cy: [
    'Ionawr',
    'Chwefror',
    'Mawrth',
    'Ebrill',
    'Mai',
    'Mehefin',
    'Gorffennaf',
    'Awst',
    'Medi',
    'Hydref',
    'Tachwedd',
    'Rhagfyr',
  ],
};

export const formatDate = (
  dateString: string,
  locale?: 'cy' | 'en',
): string => {
  const date = new Date(dateString);
  const lang = locale === 'cy' ? 'cy' : 'en';

  if (Number.isNaN(date.getTime())) return NO_DATA;

  const day = date.getDate();
  const month = MONTHS[lang][date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

export const getYearFromDate = (dateString: string): string | undefined => {
  const date = new Date(dateString);
  const returnDate = date.toLocaleDateString('en-GB', {
    year: 'numeric',
  });

  return returnDate === 'Invalid Date' ? undefined : returnDate;
};

import { NO_DATA } from '../constants';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const returnDate = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return returnDate === 'Invalid Date' ? NO_DATA : returnDate;
};

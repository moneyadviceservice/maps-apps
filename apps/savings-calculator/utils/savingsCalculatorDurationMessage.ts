import { useTranslation } from '@maps-react/hooks/useTranslation';

export const durationMessage = (
  z: ReturnType<typeof useTranslation>['z'],
  duration: { years: number; months: number },
) => {
  const { years, months } = duration;
  function getYearAlmost(year: number) {
    return z({
      en: `almost ${year} year${year > 1 ? 's' : ''} sooner`,
      cy: `bron i ${year} flynedd yn gynt`,
    });
  }
  function getYearSooner() {
    return z({
      en: `over ${years} year${years > 1 ? 's' : ''} sooner`,
      cy: `dros ${years} ${years > 1 ? 'bron i' : ''}${years} flwyddyn yn gynt`,
    });
  }

  function getMonthSooner() {
    return z({
      en: `${months} month${months > 0 ? 's' : ''} sooner`,
      cy: `${months} ${months > 0 ? 'mis' : 'fis'} yn gynt`,
    });
  }

  if (years > 0) {
    const nextYearClose = months > 6;
    if (nextYearClose) {
      return getYearAlmost(years + 1);
    } else {
      return getYearSooner();
    }
  } else {
    return getMonthSooner();
  }
};

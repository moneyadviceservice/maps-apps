import useTranslation from '@maps-react/hooks/useTranslation';

const unitTranslationMap = {
  pounds: {
    en: 'pounds',
    cy: 'bunnoedd',
  },
  years: {
    en: 'years',
    cy: 'blynyddoedd',
  },
  percent: {
    en: 'percent',
    cy: 'y cant',
  },
};

export const addUnitToAriaLabel = (
  label: string,
  unit: 'pounds' | 'years' | 'percent',
  z: ReturnType<typeof useTranslation>['z'],
) => {
  const trimmedLabel = label.trim();
  const lowerInTranslation = z({ en: 'in', cy: 'yn' });
  const upperInTranslation = z({ en: 'In', cy: 'Yn' });
  const translatedUnit = z(unitTranslationMap[unit]);

  if (trimmedLabel.endsWith('.') || trimmedLabel.endsWith('?')) {
    return `${trimmedLabel} ${upperInTranslation} ${translatedUnit}.`;
  } else if (trimmedLabel.endsWith(':')) {
    return `${trimmedLabel.slice(
      0,
      -1,
    )}, ${lowerInTranslation} ${translatedUnit}.`;
  } else {
    return `${trimmedLabel}, ${lowerInTranslation} ${translatedUnit}`;
  }
};

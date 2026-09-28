import useTranslation from '@maps-react/hooks/useTranslation';

export const generatePageTitle = (
  title: string,
  z: ReturnType<typeof useTranslation>['z'],
) => {
  return `${title} - ${z({
    en: 'Money Adviser Network',
    cy: 'Rhwydwaith Cynghorwyr Arian',
  })}`;
};

import useTranslation from '@maps-react/hooks/useTranslation';

export const generatePageTitle = (
  title: string,
  z: ReturnType<typeof useTranslation>['z'],
) => {
  return `${z({
    en: 'Money Adviser Network',
    cy: 'Rhwydwaith Cynghorwyr Arian',
  })}: ${title} - ${z({
    en: 'MoneyHelper Tools',
    cy: 'Teclynnau HelpwrArian',
  })}`;
};

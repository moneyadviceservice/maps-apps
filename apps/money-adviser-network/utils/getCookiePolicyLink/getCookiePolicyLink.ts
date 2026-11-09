import { useTranslation } from '@maps-react/hooks/useTranslation';

type Translation = ReturnType<typeof useTranslation>['z'];

export const getCookiePolicyLink = (z: Translation) => {
  const cookiePolicyLink = z({
    en: '/en/cookie-policy',
    cy: '/cy/cookie-policy',
  });

  return cookiePolicyLink;
};

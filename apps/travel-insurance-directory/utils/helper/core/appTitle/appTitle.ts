import { useTranslation } from '@maps-react/hooks/useTranslation';

/**
 * @param z
 * @returns App name in en or cy
 */
export const appTitle = (z: ReturnType<typeof useTranslation>['z']) => {
  return z({
    en: 'Travel Insurance Directory',
    cy: 'Cyfeirlyfr yswiriant teithio',
  });
};

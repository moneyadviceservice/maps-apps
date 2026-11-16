import { useTranslation } from '@maps-react/hooks/useTranslation';

import { appTitle } from '../appTitle';

/**
 * @param pageHeading
 * @param z
 * @returns Browser title in en or cy
 */
export const pageTitle = (
  pageHeading: string,
  z: ReturnType<typeof useTranslation>['z'],
) => {
  return `${pageHeading} - ${appTitle(z)}`;
};

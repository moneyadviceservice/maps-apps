/**
 * Builds the full form path including the locale and base path.
 * @param {string} locale - The locale to include in the path.
 * @param {string} step - The current step of the form.
 * @returns {string} - The full form path.
 */
import type { Language } from '@maps-react/utils/language';

export function buildFormPath(
  locale: Language,
  step: string,
  basePath = '',
): string {
  const normalizedBasePath = basePath.split('/').filter(Boolean).join('/');

  return `/${locale}${
    normalizedBasePath ? `/${normalizedBasePath}` : ''
  }/${step}`;
}

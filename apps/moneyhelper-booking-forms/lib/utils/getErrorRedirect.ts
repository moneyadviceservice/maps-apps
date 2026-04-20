import { GetServerSidePropsContext } from 'next';

import { StepName } from '../constants';

const LANGUAGES_SUPPORTED = new Set(['en', 'cy']);

/**
 * Generates the error redirect URL based on the language parameter in the context.
 * If the language is not supported or not provided, it defaults to English ('en').
 * @param context - The server-side props context containing route parameters.
 * @returns The URL to redirect to in case of an error, formatted as '/{language}/error'.
 */
export function getErrorRedirect(context: GetServerSidePropsContext): string {
  const lang = (context.params?.language as string) || 'en';
  const selectedLang = LANGUAGES_SUPPORTED.has(lang) ? lang : 'en';
  return `/${selectedLang}/${StepName.ERROR}`;
}

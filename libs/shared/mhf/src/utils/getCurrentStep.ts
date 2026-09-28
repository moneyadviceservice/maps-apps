import { GetServerSidePropsContext } from 'next';

/**
 * Extracts the step from the resolved URL in the context.
 * @param context - The server-side props context.
 * @returns {string} - The extracted step.
 * @throws {Error} - If the step cannot be determined.
 */
export function getCurrentStep(
  context: GetServerSidePropsContext,
  basePath = '',
): string {
  const { resolvedUrl } = context;

  const pathSegments = (resolvedUrl || '').split(/[?#]/)[0].split('/');
  const basePathSegments = basePath
    ? basePath.split('/').filter(Boolean).length
    : 0;
  const stepIndex = 2 + basePathSegments;

  return pathSegments[stepIndex] || '';
}

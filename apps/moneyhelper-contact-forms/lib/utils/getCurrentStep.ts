import { GetServerSidePropsContext } from 'next';

/**
 * Extracts the step from the resolved URL in the context.
 * @param context - The server-side props context.
 * @returns {string} - The extracted step.
 * @throws {Error} - If the step cannot be determined.
 */
export function getCurrentStep(context: GetServerSidePropsContext): string {
  const { resolvedUrl } = context;

  const url = resolvedUrl || '';
  // Use RegExp.exec() instead of match
  const stepRegex = /^\/([a-z]{2})\/([^/?#]+)/;
  const execResult = stepRegex.exec(url);
  if (execResult) {
    return execResult[2];
  }
  // Fallbacks for error/unknown cases
  return '';
}

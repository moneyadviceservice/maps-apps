import { GetServerSidePropsContext } from 'next';

/**
 * Extracts the step from the resolved URL in the context.
 * @param context - The server-side props context.
 * @returns {string} - The extracted step.
 * @throws {Error} - If the step cannot be determined.
 */
export function getCurrentStep(context: GetServerSidePropsContext): string {
  const { resolvedUrl } = context;

  // Extract the step dynamically from the resolved URL (strip query parameters)
  const path = resolvedUrl.split('?')[0];
  const segments = path.split('/').filter(Boolean);

  // If there are only language segments (e.g., '/en/'), throw an error
  if (segments.length <= 1) {
    throw new Error('Current step could not be determined from the URL');
  }

  // Otherwise, return the last segment as the step
  return segments.pop()!;
}

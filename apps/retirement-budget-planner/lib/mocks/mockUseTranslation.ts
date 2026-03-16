/**
 * mockUseTranslation
 *
 * Factory function to create a jest mock implementation of the useTranslation
 * hook for testing.
 */
export const mockUseTranslation = (
  mapping: Record<string, string | string[]>,
  locale?: string,
) => ({
  __esModule: true,
  default: () => ({
    t: (key: string) => mapping[key] ?? key,
    z: (obj: { en: string }) => obj.en,
    tList: (key: string) => mapping[key] ?? key,
    locale: locale ?? 'en',
  }),
});

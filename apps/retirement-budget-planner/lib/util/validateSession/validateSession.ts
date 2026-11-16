import { PAGES_NAMES } from 'lib/constants/pageConstants';
import { type Partner } from 'lib/types/aboutYou';

/**
 * Check if any property of the about you/partner data object is empty
 * Returns false for valid, true for invalid session
 */
export const validateSession = (
  aboutyouData: Partner | null,
  tabName: string,
): boolean => {
  if (!aboutyouData) return true;

  return (
    tabName !== PAGES_NAMES.ABOUTYOU &&
    Object.values(aboutyouData).some(
      (aboutyouValue) =>
        aboutyouValue === '' ||
        (typeof aboutyouValue === 'object' &&
          Object.values(aboutyouValue).includes('')),
    )
  );
};

export const redirectToAboutYouPage = (language: string) => ({
  redirect: {
    destination: `/${language}/${PAGES_NAMES.ABOUTYOU}`,
    permanent: true,
  },
});

import { PAGES_NAMES } from 'lib/constants/pageConstants';
import { Partner } from 'lib/types/aboutYou';

export const validateSession = (aboutyouData: Partner[], tabName: string) => {
  return (
    tabName !== PAGES_NAMES.ABOUTYOU &&
    aboutyouData.every((t: Partner) => Object.values(t).includes(''))
  );
};

export const redirectToAboutYouPage = (language: string) => ({
  redirect: {
    destination: `/${language}/${PAGES_NAMES.ABOUTYOU}`,
    permanent: true,
  },
});

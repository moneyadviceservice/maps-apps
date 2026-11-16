import { PAGES_NAMES } from 'lib/constants/pageConstants';
import { type Partner } from 'lib/types/aboutYou';

import { redirectToAboutYouPage, validateSession } from './validateSession';

const validPartner: Partner = {
  id: 1,
  dob: { day: '1', month: '1', year: '1980' },
  gender: 'female',
  retireAge: '67',
};

describe('validateSession helper utils', () => {
  describe('validateSession function', () => {
    test.each`
      scenario                                            | aboutyouData                                                    | tabName                 | expected
      ${'valid – complete session not on about-you tab'}  | ${validPartner}                                                 | ${PAGES_NAMES.INCOME}   | ${false}
      ${'valid – complete session on about-you tab'}      | ${validPartner}                                                 | ${PAGES_NAMES.ABOUTYOU} | ${false}
      ${'valid – empty top-level param on about-you tab'} | ${{ ...validPartner, gender: '' }}                              | ${PAGES_NAMES.ABOUTYOU} | ${false}
      ${'invalid – null session'}                         | ${null}                                                         | ${PAGES_NAMES.INCOME}   | ${true}
      ${'invalid – empty top-level param'}                | ${{ ...validPartner, gender: '' }}                              | ${PAGES_NAMES.INCOME}   | ${true}
      ${'invalid – empty nested param'}                   | ${{ ...validPartner, dob: { ...validPartner.dob, month: '' } }} | ${PAGES_NAMES.INCOME}   | ${true}
    `(
      'returns $expected for scenario $scenario',
      ({
        aboutyouData,
        tabName,
        expected,
      }: {
        aboutyouData: Partner | null;
        tabName: string;
        expected: boolean;
      }) => {
        expect(validateSession(aboutyouData, tabName)).toBe(expected);
      },
    );
  });

  describe('redirectToAboutYouPage function', () => {
    test.each`
      language | expected
      ${'en'}  | ${{ redirect: { destination: '/en/about-you', permanent: true } }}
      ${'cy'}  | ${{ redirect: { destination: '/cy/about-you', permanent: true } }}
    `(
      'returns the expected permanent redirect for $language',
      ({ language, expected }) => {
        expect(redirectToAboutYouPage(language)).toEqual(expected);
      },
    );
  });
});

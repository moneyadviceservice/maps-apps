import { useTranslation } from '@maps-react/hooks/useTranslation';

import { pageTitle } from './pageTitle';

describe('appTitle', () => {
  const en = jest.fn(({ en }) => en);
  const cy = jest.fn(({ cy }) => cy);

  it.each`
    pageHeading      | translation | returnString
    ${'Hello World'} | ${en}       | ${'Hello World - Travel Insurance Directory'}
    ${'helo fyd'}    | ${cy}       | ${'helo fyd - Cyfeirlyfr yswiriant teithio'}
  `('returns $returnString', ({ pageHeading, translation, returnString }) => {
    const result = pageTitle(
      pageHeading,
      translation as ReturnType<typeof useTranslation>['z'],
    );

    expect(result).toBe(returnString);
  });
});

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { appTitle } from './appTitle';

describe('appTitle', () => {
  const zEn = jest.fn(({ en }) => en);
  const zCy = jest.fn(({ cy }) => cy);

  it.each`
    translation | expected
    ${zEn}      | ${'Travel Insurance Directory'}
    ${zCy}      | ${'Cyfeirlyfr yswiriant teithio'}
  `('returns $expected', ({ translation, expected }) => {
    const result = appTitle(
      translation as ReturnType<typeof useTranslation>['z'],
    );

    expect(result).toBe(expected);

    expect(translation).toHaveBeenCalledWith({
      en: 'Travel Insurance Directory',
      cy: 'Cyfeirlyfr yswiriant teithio',
    });
  });
});

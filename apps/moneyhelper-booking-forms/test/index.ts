import useLanguage from '@maps-react/hooks/useLanguage';

const languages = ['en', 'cy'] as const;
type Language = (typeof languages)[number];

export const describeEachLanguage = (
  title: string,
  defineTests: (locale: Language) => void,
) => {
  describe.each(languages)(`${title} (%s)`, (locale) => {
    beforeEach(() => {
      jest.mocked(useLanguage).mockReturnValue(locale);
    });

    defineTests(locale);
  });
};

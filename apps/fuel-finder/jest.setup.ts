const translationMock = () => ({
  z: (obj: { en: string; cy: string }) => obj.en,
  locale: 'en',
});

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: translationMock,
  useTranslation: translationMock,
}));

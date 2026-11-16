import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { Navigation } from './Navigation';

jest.mock('@maps-react/hooks/useTranslation');

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
    asPath: '/',
  }),
}));

const mockUseTranslation = useTranslation as jest.Mock;

const links = [
  {
    linkTo: '/what-is-the-sfs',
    text: 'What is the Standard Financial Statement?',
    description: null,
  },
  {
    linkTo: '/what-is-the-sfs/find-free-debt-advice',
    text: 'Find debt advice',
    description: null,
  },
];

describe('Navigation component', () => {
  const setupTranslationMock = (languageCode: 'en' | 'cy') => {
    mockUseTranslation.mockReturnValue({
      z: (dictionary: Record<'en' | 'cy', string>) =>
        dictionary[languageCode as 'en' | 'cy'],
    });
  };

  it('renders unnested nav correctly', () => {
    setupTranslationMock('en');

    const { container } = render(
      <Navigation language="en" links={links} slug={['/what-is-the-sfs']} />,
    );

    expect(container).toMatchSnapshot();
  });

  it.each([
    ['en', 'Standard Financial Statement section navigation'],
    ['cy', 'Llywio adrannau’r Datganiad Ariannol Safonol'],
  ])(
    'renders unnested nav with the expected aria-label for language "%s"',
    (languageCode, expectedAriaLabel) => {
      setupTranslationMock(languageCode as 'en' | 'cy');

      const { getByRole } = render(
        <Navigation
          language={languageCode}
          links={links}
          slug={['/what-is-the-sfs']}
        />,
      );

      const nav = getByRole('navigation');

      expect(nav).toHaveAttribute('aria-label', expectedAriaLabel);
    },
  );
});

import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { NestedNavigation } from './NestedNavigation';

jest.mock('@maps-react/hooks/useTranslation');

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
    asPath: '/',
  }),
}));

const mockUseTranslation = useTranslation as jest.Mock;

export const sideNavigationGroups = [
  {
    title: null,
    childLinks: [
      {
        text: 'Use the SFS',
        linkTo: '/use-the-sfs',
        description: null,
      },
    ],
  },
  {
    title: 'Spending Guidelines',
    childLinks: [
      {
        text: 'Spending Guidelines 2024/25',
        linkTo: '/use-the-sfs/spending-guidelines',
        description: null,
      },
      {
        text: 'Commentary for 2024/25',
        linkTo: '/use-the-sfs/commentary-for',
        description: null,
      },
    ],
  },
];

describe('NestedNavigation component', () => {
  const setupTranslationMock = (languageCode: 'en' | 'cy') => {
    mockUseTranslation.mockReturnValue({
      z: (dictionary: Record<'en' | 'cy', string>) =>
        dictionary[languageCode as 'en' | 'cy'],
    });
  };

  it('renders nested nav correctly', () => {
    setupTranslationMock('en');

    const { container } = render(
      <NestedNavigation
        language="en"
        sideNavigationGroups={sideNavigationGroups}
        slug={['/use-the-nested-sfs']}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it.each([
    ['en', 'Standard Financial Statement section navigation'],
    ['cy', 'Llywio adrannau’r Datganiad Ariannol Safonol'],
  ])(
    'renders nested nav with the expected aria-label for language "%s"',
    (languageCode, expectedAriaLabel) => {
      setupTranslationMock(languageCode as 'en' | 'cy');

      const { getByRole } = render(
        <NestedNavigation
          language={languageCode}
          sideNavigationGroups={sideNavigationGroups}
          slug={['/use-the-nested-sfs']}
        />,
      );

      const nav = getByRole('navigation');

      expect(nav).toHaveAttribute('aria-label', expectedAriaLabel);
    },
  );
});

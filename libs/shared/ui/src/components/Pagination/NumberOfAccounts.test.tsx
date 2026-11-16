import { render } from '@testing-library/react';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { NumberOfAccounts } from './NumberOfAccounts';

import '@testing-library/jest-dom';

type TranslationKey = {
  en: string;
  cy: string;
};

type TranslationValues = {
  a: string;
  b: string;
  c: string;
};

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn().mockReturnValue({
    z: (key: TranslationKey, values: TranslationValues): string =>
      key.en
        .replace('{a}', values.a)
        .replace('{b}', values.b)
        .replace('{c}', values.c),
  }),
}));

const mockUseTranslation = (language: 'en' | 'cy') => {
  (useTranslation as jest.Mock).mockReturnValue({
    z: (key: TranslationKey, values: TranslationValues): string =>
      key[language]
        .replace('{a}', values.a)
        .replace('{b}', values.b)
        .replace('{c}', values.c),
  });
};

describe('NumberOfAccounts Component', () => {
  it('renders correct string in English', () => {
    mockUseTranslation('en');

    const { getByText } = render(
      <NumberOfAccounts
        classes="test-class"
        startIndex={0}
        endIndex={10}
        totalItems={100}
      />,
    );

    expect(getByText('1 - 10 of 100')).toBeInTheDocument();
  });

  it('renders correct string in Welsh', () => {
    mockUseTranslation('cy');

    const { getByText } = render(
      <NumberOfAccounts
        classes="test-class"
        startIndex={0}
        endIndex={10}
        totalItems={100}
      />,
    );

    expect(getByText('1 - 10 o 100')).toBeInTheDocument();
  });

  it('renders correctly with other values', () => {
    mockUseTranslation('en');

    const { getByText } = render(
      <NumberOfAccounts
        classes="test-class"
        startIndex={15}
        endIndex={25}
        totalItems={100}
      />,
    );

    expect(getByText('16 - 25 of 100')).toBeInTheDocument();
  });
});

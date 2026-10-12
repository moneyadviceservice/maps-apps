import { useRouter } from 'next/router';

import { render, screen } from '@testing-library/react';

import {
  LanguageProvider,
  useContextLanguage,
  useLanguage,
} from './useLanguage';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockUseRouter = useRouter as jest.Mock;

describe('useLanguage', () => {
  const TestComponent = () => {
    const language = useLanguage();

    return <div>{language}</div>;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    ['returns language from path when it is valid', '/en/anypage', {}, 'en'],
    [
      'returns the language from the query when it is a valid locale',
      '/en/example',
      { language: 'cy' },
      'cy',
    ],
    [
      'returns the first language when the query language is an array',
      '/en/example',
      { language: ['cy', 'en'] },
      'cy',
    ],
    ['invalid query language', '/cy/example', { language: 'invalid' }, 'cy'],
    ['missing query language', '/cy/example', {}, 'cy'],
    ['query parameters in the path', '/cy/example?foo=bar', {}, 'cy'],
    ['hash fragments in the path', '/cy/example#section', {}, 'cy'],
    ['no valid locale in either source', '/invalid/example', {}, 'en'],
    ['returns en when asPath is empty', '', {}, 'en'],
  ])(
    'returns the expected language for %s',
    (_description, asPath, query, expectedLanguage) => {
      mockUseRouter.mockReturnValue({ asPath, query });

      render(<TestComponent />);

      expect(screen.getByText(expectedLanguage)).toBeInTheDocument();
    },
  );
});

describe('LanguageProvider', () => {
  const ContextConsumer = () => {
    const language = useContextLanguage();

    return <div>{language}</div>;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides the language returned by useLanguage to its children', () => {
    mockUseRouter.mockReturnValue({
      asPath: '/cy/example',
      query: {},
    });

    render(
      <LanguageProvider>
        <ContextConsumer />
      </LanguageProvider>,
    );

    expect(screen.getByText('cy')).toBeInTheDocument();
  });

  it('prioritises the query language over the language in the path', () => {
    mockUseRouter.mockReturnValue({
      asPath: '/en/example',
      query: {
        language: 'cy',
      },
    });

    render(
      <LanguageProvider>
        <ContextConsumer />
      </LanguageProvider>,
    );

    expect(screen.getByText('cy')).toBeInTheDocument();
  });
});

describe('useContextLanguage', () => {
  const ContextConsumer = () => {
    const language = useContextLanguage();

    return <div>{language}</div>;
  };

  it('returns en by default when rendered without a LanguageProvider', () => {
    render(<ContextConsumer />);

    expect(screen.getByText('en')).toBeInTheDocument();
  });
});

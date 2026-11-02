import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { ErrorPensionsCallout } from './ErrorPensionsCallout';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

describe('ErrorPensionsCallout', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => {
        const translations: Record<string, string> = {
          'pages.your-pension-search-results.error.title-single':
            'Single title',
          'pages.your-pension-search-results.error.text-single': 'Single text',
          'pages.your-pension-search-results.error.title': 'Multiple title',
          'pages.your-pension-search-results.error.text': 'Multiple text',
        };
        return translations[key];
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with a single error pension', () => {
    const { getByRole, getByTestId } = render(
      <ErrorPensionsCallout count={1} />,
    );
    expect(
      getByRole('heading', { name: 'Single title', level: 2 }),
    ).toBeInTheDocument();
    expect(getByTestId('error-text')).toHaveTextContent('Single text');
  });

  it('renders correctly with multiple error pensions', () => {
    const { getByRole, getByTestId } = render(
      <ErrorPensionsCallout count={3} />,
    );
    expect(
      getByRole('heading', { name: 'Multiple title', level: 2 }),
    ).toBeInTheDocument();
    expect(getByTestId('error-text')).toHaveTextContent('Multiple text');
  });

  it('does not render when count is zero', () => {
    const { queryByTestId } = render(<ErrorPensionsCallout count={0} />);
    const callout = queryByTestId('error-pensions-callout');
    expect(callout).toBeNull();
  });
});

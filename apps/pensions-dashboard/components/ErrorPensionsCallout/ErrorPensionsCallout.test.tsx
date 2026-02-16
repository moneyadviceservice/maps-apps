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
          'pages.your-pension-search-results.channels.error.title-single':
            'Single title',
          'pages.your-pension-search-results.channels.error.text-single':
            'Single text',
          'pages.your-pension-search-results.channels.error.title':
            'Multiple title',
          'pages.your-pension-search-results.channels.error.text':
            'Multiple text',
        };
        return translations[key];
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with a single error pension', () => {
    const { getByTestId } = render(<ErrorPensionsCallout count={1} />);
    const text = getByTestId('error-text');
    const title = getByTestId('error-title');
    expect(title).toContainHTML('Single title');
    expect(text).toContainHTML('Single text');
  });

  it('renders correctly with multiple error pensions', () => {
    const { getByTestId } = render(<ErrorPensionsCallout count={3} />);
    const text = getByTestId('error-text');
    const title = getByTestId('error-title');
    expect(title).toContainHTML('Multiple title');
    expect(text).toContainHTML('Multiple text');
  });

  it('does not render when count is zero', () => {
    const { queryByTestId } = render(<ErrorPensionsCallout count={0} />);
    const callout = queryByTestId('error-pensions-callout');
    expect(callout).toBeNull();
  });
});

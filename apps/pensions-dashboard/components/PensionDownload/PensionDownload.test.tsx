import { render, screen } from '@testing-library/react';

import { PensionDownload } from './PensionDownload';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    locale: 'en',
    t: (key: string) =>
      key === 'site.download-pension-information-link-text'
        ? 'Download pension information'
        : key,
  }),
}));

describe('PensionDownload', () => {
  it('links to the feature not available page', () => {
    render(<PensionDownload />);

    expect(
      screen.getByTestId('download-pension-information-link'),
    ).toHaveAttribute('href', '/en/feature-not-available');
  });
});

import { render, screen } from '@testing-library/react';

import { PensionDownload } from './PensionDownload';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) =>
      key === 'site.download-pension-information-link-text'
        ? 'Download pension information'
        : key,
  }),
}));

describe('PensionDownload', () => {
  it('renders a pension information download link', () => {
    render(<PensionDownload href="/en/download-pension-information" />);

    expect(
      screen.getByTestId('download-pension-information-link'),
    ).toHaveAttribute('href', '/en/download-pension-information');
  });
});

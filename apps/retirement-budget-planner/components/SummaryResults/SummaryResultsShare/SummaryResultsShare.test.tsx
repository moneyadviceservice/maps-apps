import { render, screen } from '@testing-library/react';

import { SummaryResultsShare } from './SummaryResultsShare';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => {
  const mapping: Record<string, string | string[]> = {
    'summaryPage.share.title': 'Share this calculator',
    'summaryPage.share.subject': 'Example subject',
    'summaryPage.share.xTitle': 'Example X title',
  };
  return {
    __esModule: true,
    default: () => ({
      t: (key: string) => mapping[key] ?? key,
      z: (obj: { en: string }) => obj.en,
      tList: (key: string) => mapping[key] ?? key,
      locale: 'en',
    }),
  };
});

describe('test SummaryResultsShare component', () => {
  it('should render the component', () => {
    render(<SummaryResultsShare />);

    // Title
    expect(
      screen.getByRole('heading', { name: /share this calculator/i }),
    ).toBeInTheDocument();

    // Email button
    const emailButton = screen.getByRole('link', { name: /email/i });
    expect(emailButton).toBeInTheDocument();
    expect(emailButton).toHaveAttribute(
      'href',
      expect.stringContaining('mailto:?subject=Example subject'),
    );

    // Facebook button
    const facebookButton = screen.getByRole('link', { name: /facebook/i });
    expect(facebookButton).toBeInTheDocument();
    expect(facebookButton).toHaveAttribute(
      'href',
      expect.stringContaining('https://www.facebook.com/sharer.php?u=#'),
    );

    // X button
    const xButton = screen.getByRole('link', { name: /x/i });
    expect(xButton).toBeInTheDocument();
    expect(xButton).toHaveAttribute(
      'href',
      expect.stringContaining(
        'https://twitter.com/intent/tweet?text=Example X title&url=#',
      ),
    );
  });
});

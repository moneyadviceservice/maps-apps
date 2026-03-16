import { render, screen } from '@testing-library/react';

import { BASE_URL } from 'lib/constants/constants';
import { mockUseTranslation } from 'lib/mocks/mockUseTranslation';

import { SummaryResultsShare } from './SummaryResultsShare';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () =>
  mockUseTranslation({
    'summaryPage.share.title': 'Share this calculator',
    'summaryPage.share.subject': 'Example subject',
    'summaryPage.share.emailBodyText': 'Example email body text',
    'summaryPage.share.xTitle': 'Example X title',
  }),
);

describe('test SummaryResultsShare component', () => {
  it('should render the component', () => {
    const { container } = render(<SummaryResultsShare />);
    expect(container).toMatchSnapshot();

    // Title
    expect(
      screen.getByRole('heading', { name: /share this calculator/i }),
    ).toBeInTheDocument();

    // All buttons
    const allButtons = screen.getAllByRole('link');
    expect(allButtons).toHaveLength(3);

    // Email button
    const emailButton = screen.getByRole('link', { name: /email/i });
    expect(emailButton).toBeInTheDocument();
    expect(emailButton).toHaveAttribute(
      'href',
      expect.stringContaining(
        'mailto:?subject=Example subject&body=Example email body text',
      ),
    );

    // Facebook button
    const facebookButton = screen.getByRole('link', { name: /facebook/i });
    expect(facebookButton).toBeInTheDocument();
    expect(facebookButton).toHaveAttribute(
      'href',
      expect.stringContaining(
        `https://www.facebook.com/sharer.php?u=${BASE_URL}`,
      ),
    );

    // X button
    const xButton = screen.getByRole('link', { name: /x/i });
    expect(xButton).toBeInTheDocument();
    expect(xButton).toHaveAttribute(
      'href',
      expect.stringContaining(
        `https://twitter.com/intent/tweet?text=Example X title&url=${BASE_URL}`,
      ),
    );
  });
});

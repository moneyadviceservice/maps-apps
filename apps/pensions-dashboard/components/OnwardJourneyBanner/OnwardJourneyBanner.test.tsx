import { render, screen } from '@testing-library/react';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { OnwardJourneyBanner } from './OnwardJourneyBanner';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;

describe('OnwardJourneyBanner', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  it('renders correctly', () => {
    const { container } = render(<OnwardJourneyBanner />);
    expect(container).toMatchSnapshot();
  });

  it('renders section with banner test id and labelled heading', () => {
    render(<OnwardJourneyBanner />);

    const banner = screen.getByTestId('onward-journey-banner');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveAttribute('aria-labelledby', 'onward-journey-heading');

    expect(screen.getByTestId('onward-journey-banner-heading')).toHaveAttribute(
      'id',
      'onward-journey-heading',
    );
  });

  it('renders body copy from translations', () => {
    render(<OnwardJourneyBanner />);

    expect(screen.getByTestId('onward-journey-banner-body')).toHaveTextContent(
      'pages.your-pension-breakdown.onward-journey.body',
    );
  });

  it('renders CTA link with href from translation key, target, and rel', () => {
    render(<OnwardJourneyBanner />);

    const cta = screen.getByTestId('onward-journey-banner-cta');
    expect(cta).toHaveAttribute(
      'href',
      'pages.your-pension-breakdown.onward-journey.cta-href',
    );
    expect(cta).toHaveAttribute('target', '_blank');
    expect(cta).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('merges optional className onto the section', () => {
    render(<OnwardJourneyBanner className="mt-8 md:mt-16" />);

    expect(screen.getByTestId('onward-journey-banner')).toHaveClass(
      'mt-8',
      'md:mt-16',
    );
  });
});

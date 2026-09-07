import type { ComponentProps, ReactNode } from 'react';

import { render, screen } from '@testing-library/react';

import { useContextLanguage } from '@maps-react/hooks/useLanguage';
import useTranslation from '@maps-react/hooks/useTranslation';

import { HeadingSection } from './HeadingSection';

jest.mock('@maps-react/hooks/useLanguage', () => ({
  useContextLanguage: jest.fn(),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock next/image to avoid routing/hydration issues in standard Jest environments
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: ComponentProps<'img'>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock the UI components if they are complex, otherwise let them render normally.
// Assuming they pass standard HTML attributes like 'href' down to the DOM.
jest.mock('@maps-react/common/components/Button', () => ({
  Button: ({ children, href }: { children: ReactNode; href?: string }) => (
    <a href={href} data-testid="mock-button">
      {children}
    </a>
  ),
}));

describe('HeadingSection', () => {
  const mockUseContextLanguage = useContextLanguage as jest.Mock;
  const mockUseTranslation = useTranslation as jest.Mock;

  const setupComponent = (lang: 'en' | 'cy' = 'en') => {
    mockUseContextLanguage.mockReturnValue(lang);
    mockUseTranslation.mockReturnValue({
      z: (translations: { en: string; cy: string }) =>
        translations[lang] || translations.en,
    });

    return render(<HeadingSection />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the heading, paragraph, and time estimate correctly', () => {
    setupComponent();

    expect(screen.getByText('Pension calculator')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Find out how much retirement income your pensions could give you and how much you might need.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('20 minutes to complete')).toBeInTheDocument();
  });

  it('generates the correct start button URL for English (en)', () => {
    setupComponent('en');

    const startButton = screen.getByTestId('mock-button');
    expect(startButton).toHaveAttribute('href', 'en/about-you');
    expect(startButton).toHaveTextContent('Start Pension calculator');
  });

  it('generates the correct start button URL for Welsh (cy)', () => {
    setupComponent('cy');

    const startButton = screen.getByTestId('mock-button');
    expect(startButton).toHaveAttribute('href', 'cy/about-you');
  });

  it('renders both mobile and desktop images with correct alt text', () => {
    setupComponent();

    const images = screen.getAllByAltText('Pension calculator banner');

    expect(images).toHaveLength(2);

    images.forEach((img) => {
      expect(img).toHaveAttribute('src', '/homepage/heading-banner.png');
    });
  });

  it('renders the internal anchor link correctly', () => {
    setupComponent();

    const anchorLink = screen.getByText('Read more about the calculator below');
    expect(anchorLink.closest('a')).toHaveAttribute(
      'href',
      '#information-section',
    );
  });
});

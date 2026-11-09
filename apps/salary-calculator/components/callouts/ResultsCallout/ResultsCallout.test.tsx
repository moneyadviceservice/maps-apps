import { render, screen } from '@testing-library/react';

import { ResultsCallout } from './ResultsCallout';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    z: ({ en }: { en: string; cy: string }) => en,
  }),
  useTranslation: () => ({
    z: ({ en }: { en: string; cy: string }) => en,
  }),
}));

describe('ResultsCallout', () => {
  beforeEach(() => {
    const useRouter = require('next/router').useRouter;
    useRouter.mockReturnValue({
      asPath: '/en',
      query: { language: 'en' },
    });
  });

  it('renders the title and children content', () => {
    render(
      <ResultsCallout title="Test Title">
        <p>Test content</p>
      </ResultsCallout>,
    );

    expect(
      screen.getByRole('heading', { name: 'Test Title' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders heading element', () => {
    render(
      <ResultsCallout title="Test">
        <p>Content</p>
      </ResultsCallout>,
    );

    const heading = screen.getByRole('heading', { name: 'Test' });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H3');
  });

  it('renders skip link when showSkipToContent is enabled', () => {
    render(
      <ResultsCallout title="Test" showSkipToContent>
        <p>Content</p>
      </ResultsCallout>,
    );

    expect(
      screen.getByRole('link', { name: 'Skip to results' }),
    ).toHaveAttribute('href', '#single-results-heading');
  });

  it('omits skip link by default', () => {
    render(
      <ResultsCallout title="Test">
        <p>Content</p>
      </ResultsCallout>,
    );

    expect(
      screen.queryByRole('link', { name: 'Skip to results' }),
    ).not.toBeInTheDocument();
  });

  it('applies mb-4 class to heading', () => {
    render(
      <ResultsCallout title="Test">
        <p>Content</p>
      </ResultsCallout>,
    );

    const heading = screen.getByRole('heading', { name: 'Test' });
    expect(heading).toHaveClass('mb-4');
  });

  it('renders children content', () => {
    render(
      <ResultsCallout title="Test">
        <div data-testid="custom-content">Custom content here</div>
      </ResultsCallout>,
    );

    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.getByText('Custom content here')).toBeInTheDocument();
  });

  it('handles multiple children elements', () => {
    render(
      <ResultsCallout title="Test">
        <p>First paragraph</p>
        <p>Second paragraph</p>
      </ResultsCallout>,
    );

    expect(screen.getByText('First paragraph')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph')).toBeInTheDocument();
  });
});

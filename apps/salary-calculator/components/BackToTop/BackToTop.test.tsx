import { render, screen, fireEvent } from '@testing-library/react';
import { BackToTop } from './BackToTop';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: (label: { en: string; cy: string }) => label.en,
  }),
}));

describe('BackToTop', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  it('renders default label and icon', () => {
    render(<BackToTop />);
    expect(screen.getByText(/Back to top/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Back to top/i })).toHaveAttribute(
      'href',
      '#main',
    );
  });

  it('renders custom label if provided', () => {
    render(<BackToTop label={{ en: 'Scroll up', cy: 'Sgrolio i fyny' }} />);
    expect(screen.getByText(/Scroll up/i)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<BackToTop className="custom-class" />);
    expect(screen.getByRole('link', { name: /Back to top/i })).toHaveClass(
      'custom-class',
    );
  });

  it('calls window.scrollTo with correct parameters on click', () => {
    render(<BackToTop />);
    const link = screen.getByRole('link', { name: /Back to top/i });

    fireEvent.click(link);

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });
});

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { BackToTop } from './BackToTop';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@maps-react/common/index', () => ({
  Icon: () => <svg data-testid="icon" />,
  IconType: { ARROW_UP: 'ARROW_UP' },
  Link: ({
    href,
    className,
    children,
    'data-testid': testId,
  }: {
    href: string;
    className: string;
    children: React.ReactNode;
    'data-testid': string;
  }) => (
    <a href={href} className={className} data-testid={testId}>
      {children}
    </a>
  ),
}));

describe('BackToTop', () => {
  it('renders with the correct data-testid from testId prop', () => {
    render(<BackToTop testId="my-section" />);

    expect(screen.getByTestId('back-to-top-my-section')).toBeInTheDocument();
  });

  it('renders the translated back-to-top text', () => {
    render(<BackToTop testId="my-section" />);

    expect(screen.getByText('back-to-top')).toBeInTheDocument();
  });

  it('applies a custom className when provided', () => {
    render(<BackToTop testId="my-section" className="mt-10" />);

    expect(screen.getByTestId('back-to-top-my-section')).toHaveClass('mt-10');
  });

  it('renders with href pointing to #top', () => {
    render(<BackToTop testId="my-section" />);

    expect(screen.getByTestId('back-to-top-my-section')).toHaveAttribute(
      'href',
      '#top',
    );
  });
});

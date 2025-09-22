import { render, screen } from '@testing-library/react';

import { IconType } from '@maps-react/common/components/Icon';
import { LinkComponentProps } from '@maps-react/common/components/Link';

import { BackToTop } from './BackToTop';

import '@testing-library/jest-dom';

jest.mock('@maps-react/common/components/Icon', () => ({
  Icon: ({ type, fill }: { type: string; fill: string }) => (
    <svg data-testid="icon" data-type={type} data-fill={fill}></svg>
  ),
  IconType: {
    ARROW_UP: 'arrow_up',
  },
}));

jest.mock('@maps-react/common/components/Link', () => ({
  Link: ({ href, className, children }: LinkComponentProps) => (
    <a href={href as string} className={className}>
      {children}
    </a>
  ),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    z: (textMap: { en: string; cy: string }) => textMap.en,
  }),
}));

describe('BackToTop', () => {
  it('renders link with correct href', () => {
    render(<BackToTop />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '#top');
  });

  it('renders the translated text', () => {
    render(<BackToTop />);
    expect(screen.getByText('Back to top')).toBeInTheDocument();
  });

  it('renders the Icon with correct props', () => {
    render(<BackToTop />);
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('data-type', IconType.ARROW_UP);
  });
});

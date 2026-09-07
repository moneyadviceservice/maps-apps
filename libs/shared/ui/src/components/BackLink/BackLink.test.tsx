import { render, screen } from '@testing-library/react';

import { BackLink } from './BackLink';

import '@testing-library/jest-dom';

jest.mock('../Icon', () => ({
  Icon: () => <svg data-testid="icon" />,
  IconType: {
    CHEVRON_LEFT: 'CHEVRON_LEFT',
  },
}));

describe('BackLink', () => {
  it('renders children correctly', () => {
    render(<BackLink href="/test">Go back</BackLink>);
    expect(screen.getByText('Go back')).toBeInTheDocument();
  });

  it('renders as a link with correct href', () => {
    render(<BackLink href="/test">Go back</BackLink>);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test');
  });

  it('renders as a link with correct href, supplied as a URL object', () => {
    render(
      <BackLink
        href={{
          pathname: '/test',
          query: { sessionId: 'mock-session-id' },
        }}
      >
        Go back
      </BackLink>,
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test?sessionId=mock-session-id');
  });

  it('passes title prop to link', () => {
    render(
      <BackLink href="/test" title="Back title">
        Go back
      </BackLink>,
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('title', 'Back title');
  });

  it('passes target and rel props', () => {
    render(
      <BackLink
        href="https://example.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        External
      </BackLink>,
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders the icon', () => {
    render(<BackLink href="/test">Go back</BackLink>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies BackLink layout classes on the link element', () => {
    render(<BackLink href="/test">Go back</BackLink>);

    const link = screen.getByRole('link', { name: 'Go back' });
    expect(link).toHaveClass('inline-flex', 'items-center');
  });

  it('includes interactive hover and focus classes from shared Link styles', () => {
    render(<BackLink href="/test">Go back</BackLink>);

    const link = screen.getByRole('link', { name: 'Go back' });
    expect(link).toHaveClass('hover:no-underline');
    expect(link).toHaveClass('focus:bg-yellow-400');
  });
});

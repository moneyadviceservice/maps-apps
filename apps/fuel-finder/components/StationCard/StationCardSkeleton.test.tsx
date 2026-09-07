import { render, screen } from '@testing-library/react';

import { StationCardSkeleton } from './StationCardSkeleton';

describe('StationCardSkeleton', () => {
  it('renders pulse placeholder blocks', () => {
    const { container } = render(<StationCardSkeleton />);
    const tile = screen.getByTestId('station-card-skeleton');
    expect(tile).toBeInTheDocument();
    expect(tile).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(
      0,
    );
  });

  it('matches snapshot', () => {
    const { container } = render(<StationCardSkeleton />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

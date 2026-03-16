import { render, screen } from '@testing-library/react';

import { FirmSummarySkeleton } from './FirmSummarySkeleton';

import '@testing-library/jest-dom';

jest.mock('@maps-react/common/components/InformationCallout', () => ({
  InformationCallout: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="information-callout" className={className}>
      {children}
    </div>
  ),
}));

describe('FirmSummarySkeleton', () => {
  it('renders without crashing', () => {
    render(<FirmSummarySkeleton />);
    expect(screen.getByTestId('information-callout')).toBeInTheDocument();
  });

  it('renders skeleton layout with pulse placeholders', () => {
    const { container } = render(<FirmSummarySkeleton />);
    const pulseElements = container.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it('renders two grid sections (3 columns each)', () => {
    const { container } = render(<FirmSummarySkeleton />);
    const grids = container.querySelectorAll('.grid');
    expect(grids.length).toBe(2);
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { PhaseBanner, PhaseType } from '.';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('Phase banner component', () => {
  it('renders beta correctly', () => {
    render(<PhaseBanner />);
    const betaBanner = screen.getByTestId('phase-banner');
    expect(betaBanner).toMatchSnapshot();
  });

  it('renders alpha correctly', () => {
    render(<PhaseBanner phase={PhaseType.ALPHA} />);
    const betaBanner = screen.getByTestId('phase-banner');
    expect(betaBanner).toMatchSnapshot();
  });
});

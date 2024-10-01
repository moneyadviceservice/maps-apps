import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProgressBar, VariantType } from '.';

describe('ProgressBar component', () => {
  it('renders the default correctly', () => {
    render(<ProgressBar value={30} max={100} label="30% complete" />);
    const container = screen.getByTestId('progress');
    expect(container).toMatchSnapshot();
  });

  it('renders the blue variant correctly', () => {
    render(
      <ProgressBar
        value={30}
        max={100}
        label="30% complete"
        testId="progress-component"
        variant={VariantType.BLUE}
      />,
    );
    const container = screen.getByTestId('progress-component');
    expect(container).toMatchSnapshot();
  });
});

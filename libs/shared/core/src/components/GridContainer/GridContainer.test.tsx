import { render, screen } from '@testing-library/react';

import { GridContainer } from './GridContainer';

import '@testing-library/jest-dom';

describe('GridContainer', () => {
  it('renders children and applies grid classes', () => {
    render(
      <GridContainer>
        <div data-testid="child">Child</div>
      </GridContainer>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByTestId('child').parentElement).toHaveClass('grid');
  });
});

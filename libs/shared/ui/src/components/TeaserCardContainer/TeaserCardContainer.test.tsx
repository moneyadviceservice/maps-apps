import React from 'react';

import { render } from '@testing-library/react';

import { TeaserCardContainer } from './TeaserCardContainer';

import '@testing-library/jest-dom';

describe('TeaserCardContainer', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <TeaserCardContainer>
        <div>Child Content</div>
      </TeaserCardContainer>,
    );

    expect(getByText('Child Content')).toBeInTheDocument();
  });

  it('applies the correct grid class based on gridCols prop', () => {
    const { container } = render(
      <TeaserCardContainer gridCols={3}>
        <div>Child Content</div>
      </TeaserCardContainer>,
    );

    const gridDiv = container.querySelector('div > div.grid');
    expect(gridDiv).toHaveClass('md:grid-cols-3');
  });

  it('defaults to gridCols of 3 if not provided', () => {
    const { container } = render(
      <TeaserCardContainer>
        <div>Child Content</div>
      </TeaserCardContainer>,
    );

    const gridDiv = container.querySelector('div > div.grid');
    expect(gridDiv).toHaveClass('md:grid-cols-3');
  });
});

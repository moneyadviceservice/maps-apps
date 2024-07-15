import React from 'react';
import { render, screen } from '@testing-library/react';
import { Hero } from '.';

describe('Hero component', () => {
  it('renders correctly', () => {
    render(
      <Hero testId="test-component" title="test title">
        Test content
      </Hero>,
    );
    const container = screen.getByTestId('test-component');
    expect(container).toMatchSnapshot();
  });
});

import React from 'react';

import { render, screen } from '@testing-library/react';

import { Paragraph } from '.';

import '@testing-library/jest-dom';

describe('Paragraph component', () => {
  it('renders correctly', () => {
    render(<Paragraph>Text goes here</Paragraph>);
    const paragraph = screen.getByTestId('paragraph');
    expect(paragraph).toMatchSnapshot();
  });

  it('renders with secondary variant', () => {
    render(<Paragraph variant="secondary">Text in blue colour</Paragraph>);
    const paragraph = screen.getByTestId('paragraph');
    expect(paragraph).toHaveClass('text-blue-700');
  });
});

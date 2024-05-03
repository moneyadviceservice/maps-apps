import React from 'react';
import { render, screen } from '@testing-library/react';
import { Paragraph } from '.';

describe('Paragraph component', () => {
  it('renders correctly', () => {
    render(<Paragraph>Text goes here</Paragraph>);
    const paragraph = screen.getByTestId('paragraph');
    expect(paragraph).toMatchSnapshot();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { RichSection } from '.';
import mockData from './RichSection.mock.json';

describe('RichSection component', () => {
  it('renders correctly', () => {
    render(<RichSection testId="test-component" {...mockData} />);
    const container = screen.getByTestId('test-component');
    expect(container).toMatchSnapshot();
  });
});

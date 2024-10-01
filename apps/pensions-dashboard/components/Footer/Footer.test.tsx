import React from 'react';
import { render } from '@testing-library/react';
import { Footer } from '.';

describe('CommonLinks', () => {
  it('renders correctly', () => {
    const { container } = render(<Footer />);
    expect(container).toMatchSnapshot();
  });
});

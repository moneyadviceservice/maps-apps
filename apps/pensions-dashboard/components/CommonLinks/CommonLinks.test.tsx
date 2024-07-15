import React from 'react';
import { render } from '@testing-library/react';
import { CommonLinks } from '.';

describe('CommonLinks', () => {
  it('renders correctly', () => {
    const { container } = render(<CommonLinks />);
    expect(container).toMatchSnapshot();
  });
});

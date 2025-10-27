import React from 'react';

import { render } from '@testing-library/react';

import { Checkbox } from './Checkbox';

describe('Checkbox component', () => {
  it('renders correctly', () => {
    const { container } = render(
      <Checkbox id="test-id" name="test-name" value="">
        Lorem Ipsum
      </Checkbox>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it('applies error styles when hasError is true', () => {
    const { container } = render(
      <Checkbox id="error-id" name="error-name" hasError value="">
        Error Checkbox
      </Checkbox>,
    );

    const checkboxDiv = container.querySelector('div');
    expect(checkboxDiv?.className).toMatch(/border-red-700/);

    expect(container.firstChild).toMatchSnapshot();
  });
});

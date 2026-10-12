import React from 'react';

import { render } from '@testing-library/react';

import { PercentInput } from './PercentInput';

describe('PercentInput component', () => {
  it('renders correctly', () => {
    const { container } = render(
      <PercentInput
        id="test-id"
        name="test-name"
        defaultValue=""
        onChange={() => {
          // no-op for test
        }}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

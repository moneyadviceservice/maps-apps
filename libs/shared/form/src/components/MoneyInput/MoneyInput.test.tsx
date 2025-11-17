import React from 'react';

import { render } from '@testing-library/react';

import { MoneyInput } from './MoneyInput';

const onChange = jest.fn();
describe('MoneyInput component', () => {
  it('renders correctly', () => {
    const { container } = render(
      <MoneyInput
        id="test-id"
        name="test-name"
        defaultValue=""
        onChange={onChange}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with addon', () => {
    const { container } = render(
      <MoneyInput
        id="test-id"
        name="test-name"
        defaultValue=""
        onChange={onChange}
        addon="£"
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

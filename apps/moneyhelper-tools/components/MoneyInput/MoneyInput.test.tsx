import { render } from '@testing-library/react';
import { MoneyInput } from './MoneyInput';

describe('MoneyInput component', () => {
  it('renders correctly', () => {
    const { container } = render(
      <MoneyInput
        id="test-id"
        name="test-name"
        defaultValue=""
        onChange={() => {}}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

import { render } from '@testing-library/react';

import { PercentInput } from './PercentInput';

describe('PercentInput component', () => {
  it('renders correctly', () => {
    const { container } = render(
      <PercentInput
        id="test-id"
        name="test-name"
        defaultValue=""
        onChange={() => {}}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

import { render } from '@testing-library/react';

import { Tool } from './Tool';

jest.mock('copy-to-clipboard', () => () => true);

describe('Select component', () => {
  it('renders correctly', () => {
    const { container } = render(
      <Tool name="Test" title="test one" description="test" />,
    );
    expect(container).toMatchSnapshot();
  });
});

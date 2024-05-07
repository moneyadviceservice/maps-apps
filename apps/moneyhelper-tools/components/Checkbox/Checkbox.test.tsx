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
});

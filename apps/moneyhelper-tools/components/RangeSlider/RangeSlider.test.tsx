import { render } from '@testing-library/react';
import { RangeSlider } from '.';

describe('RangeSlider component', () => {
  it('renders correctly', () => {
    const { container } = render(<RangeSlider />);
    expect(container).toMatchSnapshot();
  });
  it('renders with label', () => {
    const { container } = render(<RangeSlider label="Select a value" />);
    expect(container).toMatchSnapshot();
  });
});

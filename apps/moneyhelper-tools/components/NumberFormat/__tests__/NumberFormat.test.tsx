import { render } from '@testing-library/react';

import NumberFormat from '../NumberFormat';

describe('NumberFormat component', () => {
  it('renders correctly', () => {
    const { container } = render(
      <NumberFormat id="id" name="name" defaultValue="" onChange={() => {}} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with a custom className', () => {
    const { container } = render(
      <NumberFormat
        className="rounded-lg"
        id="id"
        name="name"
        defaultValue=""
        onChange={() => {}}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with direction and position props', () => {
    const { container } = render(
      <NumberFormat
        id="id"
        name="name"
        defaultValue=""
        onChange={() => {}}
        direction="decrease"
        position="right"
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

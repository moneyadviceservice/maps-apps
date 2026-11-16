import { render } from '@testing-library/react';

import Label from './Label';

describe('Label', () => {
  it('renders correctly with simple text children', () => {
    const { container } = render(<Label htmlFor="email">Email address</Label>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with JSX children', () => {
    const { container } = render(
      <Label htmlFor="postcode">
        Postcode <span>(required)</span>
      </Label>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

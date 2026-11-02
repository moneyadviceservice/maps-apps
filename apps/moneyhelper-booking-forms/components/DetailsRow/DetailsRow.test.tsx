import { render } from '@testing-library/react';

import { DetailsRow } from '.';

describe('DetailsRow Component', () => {
  it('renders a basic row', () => {
    const { container } = render(
      <DetailsRow label="Email address" value="hello@example.com" />,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders a row with a change link', () => {
    const { container } = render(
      <DetailsRow
        label="Phone number"
        value="01234567890"
        changehref="contact-details"
        changeLabel="Change"
        locale="en"
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders a row without a change link', () => {
    const { container } = render(
      <DetailsRow
        label="Phone number"
        value="01234567890"
        changehref="contact-details"
      />,
    );

    expect(container).toMatchSnapshot();
  });
});

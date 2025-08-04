import { render } from '@testing-library/react';

import { Footer } from './Footer';

describe('Footer', () => {
  it('renders Footer and matches snapshot', () => {
    const { container } = render(<Footer />);

    expect(container).toMatchSnapshot();
  });
});

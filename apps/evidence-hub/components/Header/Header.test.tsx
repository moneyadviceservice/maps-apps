import { render } from '@testing-library/react';

import { Header } from './Header';

describe('Header', () => {
  it('renders Header and matches snapshot', () => {
    const { container } = render(<Header />);

    expect(container).toMatchSnapshot();
  });
});

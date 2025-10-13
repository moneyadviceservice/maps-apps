import { render } from '@testing-library/react';

import { Breadcrumbs } from './Breadcrumbs';

describe('Breadcrumbs', () => {
  it('renders Breadcrumbs and matches snapshot', () => {
    const { container } = render(<Breadcrumbs />);

    expect(container).toMatchSnapshot();
  });
});

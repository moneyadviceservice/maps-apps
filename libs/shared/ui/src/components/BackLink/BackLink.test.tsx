import React from 'react';

import { render } from '@testing-library/react';

import { BackLink } from './BackLink';

import '@testing-library/jest-dom/extend-expect';

describe('BackLink', () => {
  it('renders correctly', () => {
    const props = {
      href: '/some-link',
      scroll: true,
      title: 'Back to Previous Page',
      rel: 'noopener',
      target: '_blank',
    };

    const { getByText } = render(<BackLink {...props}>Go Back</BackLink>);

    expect(getByText('Go Back')).toBeInTheDocument();

    const link = getByText('Go Back');
    expect(link).toHaveAttribute('href', '/some-link');
    expect(link).toHaveAttribute('title', 'Back to Previous Page');
    expect(link).toHaveAttribute('rel', 'noopener');
    expect(link).toHaveAttribute('target', '_blank');
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import { BasePageLayout } from '.';

describe('BasePageLayout', () => {
  it('renders correctly', () => {
    const { container } = render(<BasePageLayout>test content</BasePageLayout>);
    expect(container).toMatchSnapshot();
  });
});

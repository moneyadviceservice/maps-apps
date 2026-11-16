import React from 'react';

import { render, screen } from '@testing-library/react';

import { Icon, IconType } from '.';

describe('Icon component', () => {
  it('renders correctly', () => {
    render(
      <Icon
        data-testid="icon"
        className="test-class"
        type={IconType.CHEVRON}
      />,
    );
    const icon = screen.getByTestId('icon');
    expect(icon).toMatchSnapshot();
  });
});

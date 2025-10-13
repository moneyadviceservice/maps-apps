import React from 'react';

import { render, screen } from '@testing-library/react';

import { Breadcrumb } from '.';

import '@testing-library/jest-dom';

let breadcrumb: HTMLElement | null;
const crumbs = [
  {
    label: 'Crumb 1',
    link: 'https://www.moneyhelper.org.uk/en',
  },
  {
    label: 'Crumb 2',
    link: 'https://www.moneyhelper.org.uk/en',
  },
];

describe('Breadcrumb component', () => {
  it('renders desktop version correctly', () => {
    render(<Breadcrumb crumbs={crumbs} />);
    breadcrumb = screen.getByTestId('breadcrumb-desktop');
    expect(breadcrumb).toMatchSnapshot();
  });

  it('renders mobile version correctly', () => {
    render(<Breadcrumb crumbs={crumbs} />);
    breadcrumb = screen.getByTestId('breadcrumb-mobile');
    expect(breadcrumb).toMatchSnapshot();
  });

  it('should return null when no crumbs are passed', () => {
    render(<Breadcrumb crumbs={[]} />);
    breadcrumb = screen.queryByTestId('breadcrumb-desktop');
    expect(breadcrumb).toBeNull();
  });
});

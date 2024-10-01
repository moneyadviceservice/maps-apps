import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Breadcrumb } from '.';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

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
    const breadcrumb = screen.getByTestId('breadcrumb-desktop');
    expect(breadcrumb).toMatchSnapshot();
  });

  it('renders mobile version correctly', () => {
    render(<Breadcrumb crumbs={crumbs} />);
    const breadcrumb = screen.getByTestId('breadcrumb-mobile');
    expect(breadcrumb).toMatchSnapshot();
  });
});

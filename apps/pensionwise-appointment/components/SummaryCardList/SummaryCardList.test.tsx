import React from 'react';
import { render, screen } from '@testing-library/react';
import { SummaryCardList } from '.';
import mockData from './SummaryCardList.mock.json';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('SummaryCardList component', () => {
  it('renders correctly', () => {
    render(<SummaryCardList data={mockData} />);
    const container = screen.getByTestId('summary-card-list');
    expect(container).toMatchSnapshot();
  });
});

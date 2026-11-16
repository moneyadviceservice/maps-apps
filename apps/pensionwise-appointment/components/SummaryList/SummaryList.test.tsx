import { render, screen } from '@testing-library/react';

import { SummaryList } from '.';
import mockData from './SummaryList.mock.json';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('SummaryList component', () => {
  it('renders correctly', () => {
    render(<SummaryList items={mockData} title="Test title" />);
    const container = screen.getByTestId('summary-list');
    expect(container).toMatchSnapshot();
  });
});

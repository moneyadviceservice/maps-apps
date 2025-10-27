import { useRouter } from 'next/router';

import { fireEvent, render, waitFor } from '@testing-library/react';

import { PaginatedTable } from './PaginatedTable';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn();

const mockData = {
  data: [
    {
      id: '1',
      name: 'Test Org 1',
      licence_number: '12345',
      type: { title: 'Type A' },
      licence_status: 'active',
    },
    {
      id: '2',
      name: 'Test Org 2',
      licence_number: '67890',
      type: { title: 'Type B' },
      licence_status: 'Pending',
    },
  ],
  totalPages: 2,
  continuationToken: '',
};

describe('PaginatedTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      query: {},
    });

    (fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    });
  });

  it('renders table and search input', async () => {
    const { queryByTestId, getByText } = render(<PaginatedTable />);

    expect(queryByTestId('search-label')).toBeInTheDocument();

    await waitFor(() => {
      getByText('Test Org 1');
    });

    expect(getByText(/Organisation Name/i)).toBeInTheDocument();
    expect(getByText(/Membership Code/i)).toBeInTheDocument();
    expect(getByText(/Organisation Type/i)).toBeInTheDocument();
    expect(getByText(/License Status/i)).toBeInTheDocument();
  });

  it('updates search input and triggers search', async () => {
    const { getByPlaceholderText } = render(<PaginatedTable />);

    const searchInput = getByPlaceholderText(/Search by name or number/i);

    fireEvent.change(searchInput, { target: { value: 'Test Org 1' } });

    await waitFor(() =>
      expect((searchInput as HTMLInputElement).value).toBe('Test Org 1'),
    );
  });

  it('handles pagination - next and previous buttons', async () => {
    const { getByText } = render(<PaginatedTable />);

    await waitFor(() => getByText('Page 1 of 2'));

    fireEvent.click(getByText(/Next/i));

    await waitFor(() => getByText('Page 2 of 2'));

    fireEvent.click(getByText(/Previous/i));

    await waitFor(() => getByText('Page 1 of 2'));
  });

  it('displays error when fetch fails', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('API Error'));

    const { getByText } = render(<PaginatedTable />);

    await waitFor(() => getByText(/Failed to load data/i));
  });
});

import { useRouter } from 'next/router';

import { fireEvent, render, waitFor } from '@testing-library/react';

import { PaginatedTable } from './PaginatedTable';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn();

type MockResultItem = {
  id: string;
  name: string;
  licence_number: string;
  type: { title: string };
  licence_status: string;
};

const getMockData = (results: MockResultItem[]) => ({
  data: [...results],
  totalPages: 2,
  totalRecords: results.length,
  continuationToken: '',
});

const mockResultsData = [
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
];

const mockDataMultipleResults = getMockData([...mockResultsData]);
const mockDataSingleResult = getMockData([mockResultsData[0]]);
const mockDataNoResults = getMockData([]);

const resetMocks = (fetchMockReturnValue: any) => {
  jest.clearAllMocks();
  (useRouter as jest.Mock).mockReturnValue({
    push: jest.fn(),
    query: {},
  });
  (fetch as jest.Mock).mockResolvedValue({
    json: jest.fn().mockResolvedValue(fetchMockReturnValue),
  });
};

describe('PaginatedTable', () => {
  beforeEach(() => {
    resetMocks(mockDataMultipleResults);
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

  it('displays expected status message while search results are loading', async () => {
    const { getByPlaceholderText, getByRole } = render(<PaginatedTable />);

    const searchInput = getByPlaceholderText(/Search by name or number/i);
    const statusRegion = getByRole('status');

    fireEvent.change(searchInput, { target: { value: 'Test Org' } });

    await waitFor(() =>
      expect(statusRegion.textContent).toBe('Searching organisations'),
    );
  });

  it('displays expected status message for multiple results', async () => {
    const { getByPlaceholderText, getByRole } = render(<PaginatedTable />);

    const searchInput = getByPlaceholderText(/Search by name or number/i);
    const statusRegion = getByRole('status');

    fireEvent.change(searchInput, { target: { value: 'Test Org' } });

    await waitFor(() =>
      expect(statusRegion.textContent).toBe('Showing 2 organisations'),
    );
  });

  it('displays expected status message for a single result', async () => {
    resetMocks(mockDataSingleResult);
    const { getByPlaceholderText, getByRole } = render(<PaginatedTable />);

    const searchInput = getByPlaceholderText(/Search by name or number/i);
    const statusMessageRegion = getByRole('status');

    fireEvent.change(searchInput, { target: { value: 'Test Org 1' } });

    await waitFor(() =>
      expect(statusMessageRegion.textContent).toBe('Showing 1 organisation'),
    );
  });

  it('displays expected status message for no results', async () => {
    resetMocks(mockDataNoResults);
    const { getByPlaceholderText, getByRole } = render(<PaginatedTable />);

    const searchInput = getByPlaceholderText(/Search by name or number/i);
    const statusMessageRegion = getByRole('status');

    fireEvent.change(searchInput, { target: { value: 'Non existent org' } });

    await waitFor(() =>
      expect(statusMessageRegion.textContent).toBe('0 organisations found'),
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

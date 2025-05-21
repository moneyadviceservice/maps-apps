import { ChangeEvent } from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react';

import { Organisation } from '../../types/Organisations';
import { Organisations } from './Organisations';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => () => ({
  z: ({ en }: { en: string; cy: string }) => en,
}));

jest.mock('./SearchOrgInput', () => ({
  SearchOrgInput: ({
    onChangeHandler,
    value,
  }: {
    onChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
    value: string;
  }) => (
    <input
      data-testid="search-input"
      value={value}
      onChange={onChangeHandler}
    />
  ),
}));

jest.mock('./SelectOrgType', () => ({
  SelectOrgType: ({
    onClickHandler,
    defaultVal,
  }: {
    onClickHandler: (e: ChangeEvent<HTMLSelectElement>) => void;
    defaultVal: string;
  }) => (
    <select
      data-testid="select-input"
      value={defaultVal}
      onChange={onClickHandler}
    >
      <option value="">Select</option>
      <option value="type1">Type 1</option>
    </select>
  ),
}));

const mockData: Organisation[] = [
  {
    id: '1',
    name: 'Test Org',
    type: { title: 'Test Type' },
    licence_number: '123',
    licence_status: '',
    uuid: 'mock-uuid-123',
    sfs_live: 1,
    created: '',
    modified: '',
  },
];

const renderComponent = (props = {}) =>
  render(
    <Organisations
      data={mockData}
      currentPage={1}
      totalRecords={1}
      totalPages={1}
      lang="en"
      name=""
      type=""
      {...props}
    />,
  );

const mockFetch = (
  response = {
    data: mockData,
    continuationToken: null,
    totalPages: 1,
    totalRecords: 1,
  },
) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(response),
    }),
  ) as jest.Mock;
};

describe('Organisations component', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('renders search input, select, and table', () => {
    const { container, getByTestId, getByRole, getAllByRole } =
      renderComponent();

    expect(getByTestId('search-input')).toBeInTheDocument();
    expect(getByTestId('select-input')).toBeInTheDocument();
    expect(getByRole('table')).toBeInTheDocument();
    expect(getAllByRole('row')).toHaveLength(2);

    expect(container).toMatchSnapshot();
  });

  it('renders table with default filter and page set', () => {
    const { getByTestId, getByText } = renderComponent({
      currentPage: 3,
      totalRecords: 75,
      totalPages: 5,
      name: 'Test Org',
      type: 'type1',
    });

    expect(getByTestId('search-input')).toHaveValue('Test Org');
    expect(getByTestId('select-input')).toHaveValue('type1');
    expect(getByText('Page 3 of 5')).toBeInTheDocument();
    expect(getByText('75 organisations')).toBeInTheDocument();
  });

  it('renders empty message when no data', () => {
    const { getByTestId } = renderComponent({
      data: [],
      totalRecords: 0,
      totalPages: 0,
    });

    expect(getByTestId('no-results')).toBeInTheDocument();
  });

  it('triggers fetch on search input change', async () => {
    mockFetch();

    const { getByTestId } = renderComponent();
    fireEvent.change(getByTestId('search-input'), {
      target: { value: 'SearchTerm' },
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('triggers fetch on select change', async () => {
    mockFetch();

    const { getByTestId } = renderComponent();
    fireEvent.change(getByTestId('select-input'), {
      target: { value: 'type1' },
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('disables Previous button on first page', () => {
    const { getByRole } = renderComponent({ currentPage: 1, totalPages: 3 });

    const prevButton = getByRole('button', { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });

  it('disables Next button on last page', () => {
    const { getByRole } = renderComponent({ currentPage: 3, totalPages: 3 });

    const nextButton = getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('displays error UI if fetch fails', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('API Error')),
    ) as jest.Mock;

    const { getByText, getByTestId } = renderComponent();
    fireEvent.change(getByTestId('search-input'), {
      target: { value: 'fail' },
    });

    await waitFor(() => {
      expect(getByText('Failed to load data')).toBeInTheDocument();
    });
  });

  it('calls searchByTextInput and resets before fetch', async () => {
    mockFetch();

    const { getByTestId } = renderComponent();
    fireEvent.change(getByTestId('search-input'), {
      target: { value: 'Search Text' },
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('calls searchBySelectInput and fetches filtered data', async () => {
    mockFetch({
      data: mockData,
      continuationToken: null,
      totalPages: 2,
      totalRecords: 30,
    });

    const { getByTestId } = renderComponent({
      totalRecords: 30,
      totalPages: 2,
    });
    fireEvent.change(getByTestId('select-input'), {
      target: { value: 'type1' },
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('calls fetch when clicking next page', async () => {
    mockFetch({
      data: mockData,
      continuationToken: null,
      totalPages: 3,
      totalRecords: 30,
    });

    const { getByTestId } = renderComponent({
      totalRecords: 30,
      totalPages: 3,
    });
    fireEvent.click(getByTestId('next-button'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('handles pagination with continuation token', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            data: mockData,
            continuationToken: 'next-token',
            totalPages: 3,
            totalRecords: 30,
          }),
      }),
    ) as jest.Mock;

    const { getByTestId } = renderComponent({
      totalRecords: 30,
      totalPages: 3,
      currentPage: 2,
    });
    fireEvent.click(getByTestId('next-button'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('resets state when resetBeforeNewSearch is called', async () => {
    mockFetch();

    const { getByTestId } = renderComponent({
      currentPage: 2,
      totalRecords: 10,
      totalPages: 2,
      name: 'something',
      type: 'some-type',
    });
    fireEvent.change(getByTestId('search-input'), { target: { value: '' } });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});

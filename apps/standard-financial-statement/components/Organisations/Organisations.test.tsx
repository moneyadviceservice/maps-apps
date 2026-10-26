import { ChangeEvent } from 'react';

import { act, fireEvent, render, waitFor } from '@testing-library/react';

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
    licence_status: 'Pending' as const,
    sfs_live: true,
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

    const table = getByRole('table');

    expect(getByTestId('search-input')).toBeInTheDocument();
    expect(getByTestId('select-input')).toBeInTheDocument();
    expect(table).toBeInTheDocument();
    expect(table).not.toHaveAttribute('aria-live');
    expect(getAllByRole('row')).toHaveLength(2);

    expect(container).toMatchSnapshot();
  });

  it('renders name and type inputs with expected default values if corresponding optional props are not provided', () => {
    const { container } = render(
      <Organisations
        data={mockData}
        currentPage={1}
        totalRecords={1}
        totalPages={1}
        lang="en"
      />,
    );

    const nameInput = container.querySelector('input[name="name"]');
    const typeInput = container.querySelector('input[name="type"]');

    expect(nameInput).toHaveValue('');
    expect(typeInput).toHaveValue('');
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

  it('renders results status text with expected content and attributes', async () => {
    const { getByTestId } = renderComponent();
    const statusElement = getByTestId('search-results-status');

    expect(statusElement.textContent).toBe('1 organisations');
    expect(statusElement).toHaveAttribute('role', 'status');
    expect(statusElement).toHaveAttribute('aria-live', 'polite');
    expect(statusElement).toHaveAttribute('aria-atomic', 'true');
  });

  it('renders empty message when no data', () => {
    const { getByTestId } = renderComponent({
      data: [],
      totalRecords: 0,
      totalPages: 0,
    });

    expect(getByTestId('no-results')).toBeInTheDocument();
  });

  it('triggers fetch on search input change with 500ms debounce', async () => {
    mockFetch();

    jest.useFakeTimers();

    const { getByTestId } = renderComponent();

    fireEvent.change(getByTestId('search-input'), {
      target: { value: 'SearchTerm' },
    });

    expect(fetch).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      '/api/organisations?page=1&searchQuery=SearchTerm',
    );

    jest.useRealTimers();
  });

  it('calls clearTimeout if the search input value changes within 500ms of a previous change', async () => {
    mockFetch();

    jest.useFakeTimers();

    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const { getByTestId } = renderComponent();

    fireEvent.change(getByTestId('search-input'), {
      target: { value: 'FirstSearchTerm' },
    });

    expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(clearTimeoutSpy).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(499);
    });

    fireEvent.change(getByTestId('search-input'), {
      target: { value: 'SecondSearchTerm' },
    });

    expect(setTimeoutSpy).toHaveBeenCalledTimes(2);
    expect(clearTimeoutSpy).toHaveBeenCalled();

    jest.useRealTimers();
  });

  it('updates results status text on search input change', async () => {
    mockFetch({
      data: [
        ...mockData,
        {
          id: '2',
          name: 'Test Org 2',
          type: { title: 'Test Type' },
          licence_number: '234',
          licence_status: 'Pending' as const,
          sfs_live: true,
          created: '',
          modified: '',
        },
      ],
      continuationToken: null,
      totalPages: 1,
      totalRecords: 2,
    });

    const { getByTestId } = renderComponent();

    expect(getByTestId('search-results-status').textContent).toBe(
      '1 organisations',
    );

    fireEvent.change(getByTestId('search-input'), {
      target: { value: 'SearchTerm' },
    });

    await waitFor(() => {
      expect(getByTestId('search-results-status').textContent).toBe(
        '2 organisations',
      );
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

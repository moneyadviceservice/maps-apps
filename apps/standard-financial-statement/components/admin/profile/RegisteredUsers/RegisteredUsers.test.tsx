import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { Organisation } from '../../../../types/Organisations';
import { UserData } from '../../../../types/Users';
import { RegisteredUsers } from './RegisteredUsers';

import '@testing-library/jest-dom';

const mockFetch = jest.fn();
global.fetch = mockFetch;

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-v4-id'),
}));

const mockFetchedUsers: UserData[] = [
  {
    id: 'user2-id',
    userPrincipalName: 'zoe@example.com',
    givenName: 'Zoe',
    surname: 'Anderson',
    jobTitle: 'Engineer',
    createdDateTime: '2023-03-10T00:00:00Z',
    signInActivity: { lastSuccessfulSignInDateTime: '2024-04-01T00:00:00Z' },
  },
  {
    id: 'user1-id',
    userPrincipalName: 'alice@example.com',
    givenName: 'Alice',
    surname: 'Brown',
    jobTitle: 'Designer',
    createdDateTime: '2023-06-15T00:00:00Z',
    signInActivity: { lastSuccessfulSignInDateTime: '2024-03-12T00:00:00Z' },
  },
];

const mockOrgData: Organisation = {
  id: '1',
  name: 'Mock Organisation',
  users: ['alice@example.com', 'zoe@example.com'],
} as Organisation;

describe('RegisteredUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ users: mockFetchedUsers }),
    });
  });

  it('renders loading state initially', () => {
    mockFetch.mockReturnValueOnce(new Promise(() => undefined));

    render(<RegisteredUsers data={mockOrgData} />);

    expect(screen.getByText('Loading registered users...')).toBeInTheDocument();
  });

  it('renders user details correctly after successful fetch', async () => {
    render(<RegisteredUsers data={mockOrgData} />);

    await waitFor(() => {
      expect(screen.getAllByTestId('user-first-name')[0]).toHaveTextContent(
        'Alice',
      );
      expect(screen.getAllByTestId('user-email')[1]).toHaveTextContent(
        'zoe@example.com',
      );
      expect(screen.getAllByTestId('user-job-title')[0]).toHaveTextContent(
        'Designer',
      );
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('user-join-date')[0]).toHaveTextContent(
        '15 Jun 2023',
      );
      expect(screen.getAllByTestId('user-last-login')[0]).toHaveTextContent(
        '12 Mar 2024',
      );
    });
  });

  it('sorts users by first name when header is clicked', async () => {
    render(<RegisteredUsers data={mockOrgData} />);

    await waitFor(() => {
      expect(screen.getAllByTestId('user-first-name')[0]).toHaveTextContent(
        'Alice',
      );
    });

    const toggleButton = screen.getByText(/First name/i);
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getAllByTestId('user-first-name')[0]).toHaveTextContent(
        'Zoe',
      );
      expect(screen.getAllByTestId('user-first-name')[1]).toHaveTextContent(
        'Alice',
      );
    });
  });

  it('renders "No registered users found" message when data.users is empty', async () => {
    const emptyOrgData = { ...mockOrgData, users: [] };

    render(<RegisteredUsers data={emptyOrgData} />);

    await waitFor(() => {
      expect(
        screen.queryByText('Loading registered users...'),
      ).not.toBeInTheDocument();
      expect(
        screen.getByText('No registered users found for this organization.'),
      ).toBeInTheDocument();
    });
  });

  it('renders "No registered users found" message if fetch returns an empty array', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ users: [] }),
    });

    render(<RegisteredUsers data={mockOrgData} />);

    await waitFor(() => {
      expect(
        screen.queryByText('Loading registered users...'),
      ).not.toBeInTheDocument();
      expect(
        screen.getByText('No registered users found for this organization.'),
      ).toBeInTheDocument();
    });
  });

  it('renders error message if fetch fails', async () => {
    const errorMessage = 'Failed to fetch users: Network Error';
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: errorMessage }),
    });

    render(<RegisteredUsers data={mockOrgData} />);

    await waitFor(() => {
      expect(
        screen.queryByText('Loading registered users...'),
      ).not.toBeInTheDocument();
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  it('renders error message for unexpected fetch errors', async () => {
    const networkError = new Error('Failed to connect');
    mockFetch.mockRejectedValueOnce(networkError);

    render(<RegisteredUsers data={mockOrgData} />);

    await waitFor(() => {
      expect(
        screen.queryByText('Loading registered users...'),
      ).not.toBeInTheDocument();
      expect(
        screen.getByText(`Error: ${networkError.message}`),
      ).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { container } = render(<RegisteredUsers data={mockOrgData} />);

    await waitFor(() => {
      expect(
        screen.queryByText('Loading registered users...'),
      ).not.toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });
});

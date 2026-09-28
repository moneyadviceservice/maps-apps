import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

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
    mail: 'zoe@example.com',
    givenName: 'Zoe',
    surname: 'Anderson',
    jobTitle: 'Engineer',
    createdDateTime: '2023-03-10T00:00:00Z',
    signInActivity: { lastSuccessfulSignInDateTime: '2024-04-01T00:00:00Z' },
  },
  {
    id: 'user1-id',
    userPrincipalName: 'alice@example.com',
    mail: 'alice@example.com',
    givenName: 'Alice',
    surname: 'Brown',
    jobTitle: 'Designer',
    createdDateTime: '2023-06-15T00:00:00Z',
    signInActivity: { lastSuccessfulSignInDateTime: '2024-03-12T00:00:00Z' },
  },
];

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

    render(<RegisteredUsers users={[]} loading={true} error={null} />);

    expect(screen.getByText('Loading registered users...')).toBeInTheDocument();
  });

  it('renders user details correctly after successful fetch', async () => {
    render(
      <RegisteredUsers users={mockFetchedUsers} loading={false} error={null} />,
    );

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
    render(
      <RegisteredUsers users={mockFetchedUsers} loading={false} error={null} />,
    );

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
    render(<RegisteredUsers users={[]} loading={false} error={null} />);

    await waitFor(() => {
      expect(
        screen.queryByText('Loading registered users...'),
      ).not.toBeInTheDocument();
      expect(
        screen.getByText('No registered users found for this organization.'),
      ).toBeInTheDocument();
    });
  });

  it('renders error message for unexpected fetch errors', async () => {
    const networkError = new Error('Failed to connect');
    mockFetch.mockRejectedValueOnce(networkError);
    const error = `Error: ${networkError.message}`;

    render(
      <RegisteredUsers
        users={[]}
        loading={false}
        error={networkError.message}
      />,
    );

    await waitFor(() => {
      expect(
        screen.queryByText('Loading registered users...'),
      ).not.toBeInTheDocument();
      expect(screen.getByText(error)).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { container } = render(
      <RegisteredUsers users={mockFetchedUsers} loading={false} error={null} />,
    );

    await waitFor(() => {
      expect(
        screen.queryByText('Loading registered users...'),
      ).not.toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });
});

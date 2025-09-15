import { UserData } from 'types/Users';

import { getGraphToken } from './getGraphToken';
import { getUsersInBulk } from './getUsersInBulk';

jest.mock('./getGraphToken', () => ({
  getGraphToken: jest.fn(),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

interface MockUserData extends UserData {
  id: string;
  userPrincipalName: string;
  givenName?: string;
  surname?: string;
  displayName?: string;
  mail?: string;
  jobTitle?: string;
  createdDateTime?: string;
}

describe('getUsersInBulk', () => {
  const mockGetGraphToken = getGraphToken as jest.MockedFunction<
    typeof getGraphToken
  >;

  const BATCH_SELECT_USER_PROPERTIES =
    'id,userPrincipalName,givenName,surname,displayName,mail,jobTitle,createdDateTime';

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetGraphToken.mockResolvedValue('mock-graph-token');
  });

  it('should return an error if emailOrIds array is empty', async () => {
    const emailOrIds: string[] = [];

    const result = await getUsersInBulk(emailOrIds);

    expect(result).toEqual([
      new Error('At least one user id or email must be provided'),
    ]);
    expect(mockGetGraphToken).not.toHaveBeenCalled();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should return an error if emailOrIds array is null', async () => {
    const emailOrIds = null;

    const result = await getUsersInBulk(emailOrIds as unknown as string[]);

    expect(result).toEqual([
      new Error('At least one user id or email must be provided'),
    ]);
    expect(mockGetGraphToken).not.toHaveBeenCalled();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should fetch a single user successfully', async () => {
    const emailOrIds = ['user1@example.com'];
    const mockUser: MockUserData = {
      id: 'user1-id',
      userPrincipalName: 'user1@example.com',
      mail: 'user1@example.com',
      givenName: 'User',
      surname: 'One',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          responses: [
            { id: '1', status: 200, headers: {}, body: { value: [mockUser] } },
          ],
        }),
    });

    const result = await getUsersInBulk(emailOrIds);

    expect(mockGetGraphToken).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://graph.microsoft.com/v1.0/$batch',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-graph-token',
        },
        body: JSON.stringify({
          requests: [
            {
              id: '1',
              method: 'GET',
              url: `/users?$filter=mail eq 'user1%40example.com'&$select=${BATCH_SELECT_USER_PROPERTIES}`,
            },
          ],
        }),
      }),
    );
    expect(result).toEqual([mockUser]);
  });

  it('should fetch multiple users successfully within a single batch', async () => {
    const emailOrIds = ['user1@example.com', 'user2@example.com'];
    const mockUser1: MockUserData = {
      id: 'user1-id',
      userPrincipalName: 'user1@example.com',
    };
    const mockUser2: MockUserData = {
      id: 'user2-id',
      userPrincipalName: 'user2@example.com',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          responses: [
            { id: '1', status: 200, headers: {}, body: { value: [mockUser1] } },
            { id: '2', status: 200, headers: {}, body: { value: [mockUser2] } },
          ],
        }),
    });

    const result = await getUsersInBulk(emailOrIds);

    expect(mockGetGraphToken).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual([mockUser1, mockUser2]);
  });

  it('should handle partial user lookup failures in a batch', async () => {
    const emailOrIds = ['user1@example.com', 'user2@example.com'];
    const mockUser1: MockUserData = {
      id: 'user1-id',
      userPrincipalName: 'user1@example.com',
    };
    const mockErrorBody = {
      error: { code: 'Request_ResourceNotFound', message: 'User not found' },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          responses: [
            { id: '1', status: 200, headers: {}, body: { value: [mockUser1] } },
            {
              id: '2',
              status: 404,
              headers: {},
              body: mockErrorBody,
            },
          ],
        }),
    });

    const result = await getUsersInBulk(emailOrIds);

    expect(result.length).toBe(2);
    expect(result[0]).toEqual(mockUser1);
    expect(result[1]).toBeInstanceOf(Error);
    expect(result[1]).toHaveProperty(
      'message',
      `User lookup failed for ID 2: ${JSON.stringify(mockErrorBody)}`,
    );
  });

  it('should handle complete user lookup failures in a batch', async () => {
    const emailOrIds = ['user1@example.com', 'user2@example.com'];
    const mockErrorBody1 = {
      error: { code: 'Request_ResourceNotFound', message: 'User 1 not found' },
    };
    const mockErrorBody2 = {
      error: { code: 'Request_ResourceNotFound', message: 'User 2 not found' },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          responses: [
            { id: '1', status: 404, headers: {}, body: mockErrorBody1 },
            { id: '2', status: 404, headers: {}, body: mockErrorBody2 },
          ],
        }),
    });

    const result = await getUsersInBulk(emailOrIds);

    expect(result.length).toBe(2);
    expect(result[0]).toBeInstanceOf(Error);
    expect(result[0]).toHaveProperty(
      'message',
      `User lookup failed for ID 1: ${JSON.stringify(mockErrorBody1)}`,
    );
    expect(result[1]).toBeInstanceOf(Error);
    expect(result[1]).toHaveProperty(
      'message',
      `User lookup failed for ID 2: ${JSON.stringify(mockErrorBody2)}`,
    );
  });

  it('should handle getGraphToken failure', async () => {
    mockGetGraphToken.mockRejectedValueOnce(
      new Error('Token acquisition failed'),
    );
    const emailOrIds = ['user1@example.com'];

    const result = await getUsersInBulk(emailOrIds);

    expect(result).toEqual([
      new Error('An unexpected error occurred while fetching users in bulk'),
    ]);
    expect(mockGetGraphToken).toHaveBeenCalledTimes(1);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should handle unexpected errors during fetch', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    const emailOrIds = ['user1@example.com'];

    const result = await getUsersInBulk(emailOrIds);

    expect(result).toEqual([
      new Error('An unexpected error occurred while fetching users in bulk'),
    ]);
    expect(mockGetGraphToken).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple batches correctly', async () => {
    const largeEmailList: string[] = Array.from(
      { length: 25 },
      (_, i) => `user${i + 1}@example.com`,
    );
    const mockUsersBatch1: MockUserData[] = Array.from(
      { length: 20 },
      (_, i) => ({
        id: `id${i + 1}`,
        userPrincipalName: `user${i + 1}@example.com`,
      }),
    );
    const mockUsersBatch2: MockUserData[] = Array.from(
      { length: 5 },
      (_, i) => ({
        id: `id${21 + i}`,
        userPrincipalName: `user${21 + i}@example.com`,
      }),
    );

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          responses: mockUsersBatch1.map((user, index) => ({
            id: `${index + 1}`,
            status: 200,
            headers: {},
            body: { value: [user] },
          })),
        }),
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          responses: mockUsersBatch2.map((user, index) => ({
            id: `${21 + index}`,
            status: 200,
            headers: {},
            body: { value: [user] },
          })),
        }),
    });

    const result = await getUsersInBulk(largeEmailList);

    expect(mockGetGraphToken).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(result.length).toBe(25);
    expect(result[0]).toEqual(mockUsersBatch1[0]);
    expect(result[19]).toEqual(mockUsersBatch1[19]);
    expect(result[20]).toEqual(mockUsersBatch2[0]);
    expect(result[24]).toEqual(mockUsersBatch2[4]);
  });
});

import { deleteUsersInBulk } from './deleteUsersInBulk';
import { getGraphToken } from './getGraphToken';

interface MockUserData {
  id: string;
  userPrincipalName: string;
}

jest.mock('./getGraphToken', () => ({
  getGraphToken: jest.fn(),
}));

export const mockFetch = jest.fn();
global.fetch = mockFetch;

export const createMockUser = (id: string) => ({
  id,
  userPrincipalName: `${id}@example.com`,
});

export const createMockUsers = (count: number) =>
  Array.from({ length: count }, (_, i) => createMockUser(`user${i + 1}-id`));

export const mockBatchResponse = (responses: any[]) =>
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ responses }),
  });

export const expectError = (result: any, message: string) => {
  expect(result.length).toBe(1);
  expect(result[0]).toBeInstanceOf(Error);
  expect(result[0]).toHaveProperty('message', message);
};

describe('deleteUsersInBulk', () => {
  const mockGetGraphToken = getGraphToken as jest.MockedFunction<
    typeof getGraphToken
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetGraphToken.mockResolvedValue('mock-token');
  });

  it('should return an error if the users array is empty', async () => {
    const users: MockUserData[] = [];
    const result = await deleteUsersInBulk(users);
    expect(result).toEqual([
      new Error('At least one user must be provided for deletion'),
    ]);
    expect(mockGetGraphToken).not.toHaveBeenCalled();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should return an error if the users array is null', async () => {
    const users = null;
    const result = await deleteUsersInBulk(users as unknown as MockUserData[]);
    expect(result).toEqual([
      new Error('At least one user must be provided for deletion'),
    ]);
    expect(mockGetGraphToken).not.toHaveBeenCalled();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should return success for a single user deletion', async () => {
    const users = [createMockUser('user1-id')];
    mockBatchResponse([{ id: '1', status: 204, headers: {}, body: null }]);
    const result = await deleteUsersInBulk(users);
    expect(mockGetGraphToken).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://graph.microsoft.com/v1.0/$batch',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-token',
        },
        body: JSON.stringify({
          requests: [
            { id: '1', method: 'DELETE', url: '/users/user1-id', headers: {} },
          ],
        }),
      }),
    );
    expect(result).toEqual([
      { message: 'User user1-id deleted successfully', userId: 'user1-id' },
    ]);
  });

  it('should return success for multiple user deletions within one batch', async () => {
    const users = [createMockUser('user1-id'), createMockUser('user2-id')];
    mockBatchResponse([
      { id: '1', status: 204, headers: {}, body: null },
      { id: '2', status: 204, headers: {}, body: null },
    ]);
    const result = await deleteUsersInBulk(users);
    expect(mockGetGraphToken).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual([
      { message: 'User user1-id deleted successfully', userId: 'user1-id' },
      { message: 'User user2-id deleted successfully', userId: 'user2-id' },
    ]);
  });

  it('should handle partial failures in a batch', async () => {
    const users = [createMockUser('user1-id'), createMockUser('user2-id')];
    mockBatchResponse([
      { id: '1', status: 204, headers: {}, body: null },
      { id: '2', status: 404, headers: {}, body: { error: 'User not found' } },
    ]);
    const result = await deleteUsersInBulk(users);
    expect(mockGetGraphToken).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(result.length).toBe(2);
    expect(result[0]).toEqual({
      message: 'User user1-id deleted successfully',
      userId: 'user1-id',
    });
    expect(result[1]).toBeInstanceOf(Error);
    expect(result[1]).toHaveProperty(
      'message',
      'Failed to delete user user2-id: {"error":"User not found"}',
    );
  });

  it('should handle complete failures in a batch', async () => {
    const users = [createMockUser('user1-id'), createMockUser('user2-id')];
    mockBatchResponse([
      { id: '1', status: 403, headers: {}, body: { error: 'Forbidden' } },
      { id: '2', status: 404, headers: {}, body: { error: 'User not found' } },
    ]);
    const result = await deleteUsersInBulk(users);
    expect(mockGetGraphToken).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(result.length).toBe(2);
    expect(result[0]).toBeInstanceOf(Error);
    expect(result[0]).toHaveProperty(
      'message',
      'Failed to delete user user1-id: {"error":"Forbidden"}',
    );
    expect(result[1]).toBeInstanceOf(Error);
    expect(result[1]).toHaveProperty(
      'message',
      'Failed to delete user user2-id: {"error":"User not found"}',
    );
  });

  it('should handle getGraphToken failure', async () => {
    const users = [createMockUser('user1-id')];
    mockGetGraphToken.mockRejectedValueOnce(
      new Error('Token acquisition failed'),
    );
    const result = await deleteUsersInBulk(users);
    expect(mockGetGraphToken).toHaveBeenCalledTimes(1);
    expect(mockFetch).not.toHaveBeenCalled();
    expectError(
      result,
      'An unexpected error occurred while performing bulk deletion',
    );
  });

  it('should handle unexpected errors during fetch (e.g., network error)', async () => {
    const users = [createMockUser('user1-id')];
    mockFetch.mockRejectedValueOnce(new Error('Network offline'));
    const result = await deleteUsersInBulk(users);
    expect(mockGetGraphToken).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expectError(
      result,
      'An unexpected error occurred while performing bulk deletion',
    );
  });

  it('should handle more than batchSize users across multiple batches', async () => {
    const largeUserList = createMockUsers(25);
    mockBatchResponse(
      Array.from({ length: 20 }, (_, i) => ({
        id: `${i + 1}`,
        status: 204,
        headers: {},
        body: null,
      })),
    );
    mockBatchResponse(
      Array.from({ length: 5 }, (_, i) => ({
        id: `${21 + i}`,
        status: 204,
        headers: {},
        body: null,
      })),
    );
    const result = await deleteUsersInBulk(largeUserList);
    expect(mockGetGraphToken).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(result.length).toBe(25);
    expect(result[0]).toEqual({
      message: 'User user1-id deleted successfully',
      userId: 'user1-id',
    });
    expect(result[24]).toEqual({
      message: 'User user25-id deleted successfully',
      userId: 'user25-id',
    });
  });

  it('should ensure userId is "unknown" if original request is not found in batch', async () => {
    const users = [createMockUser('user1-id')];
    mockBatchResponse([
      {
        id: '99',
        status: 404,
        headers: {},
        body: { error: 'Unknown ID' },
      },
    ]);
    const result = await deleteUsersInBulk(users);
    expect(result.length).toBe(1);
    expect(result[0]).toBeInstanceOf(Error);
    expect(result[0]).toHaveProperty(
      'message',
      'Failed to delete user unknown: {"error":"Unknown ID"}',
    );
  });
});

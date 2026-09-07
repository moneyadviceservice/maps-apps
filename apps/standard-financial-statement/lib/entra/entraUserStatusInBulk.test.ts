import {
  createMockUser,
  createMockUsers,
  expectError,
  mockBatchResponse,
  mockFetch as sharedMockFetch,
} from './deleteUsersInBulk.test';
import { entraUserStatusInBulk } from './entraUserStatusInBulk';
import { getGraphToken } from './getGraphToken';

jest.mock('./getGraphToken', () => ({
  getGraphToken: jest.fn(),
}));

const mockFetch = sharedMockFetch;

describe('entraUserStatusInBulk', () => {
  const mockGraphToken = getGraphToken as jest.MockedFunction<
    typeof getGraphToken
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGraphToken.mockResolvedValue('mock-token');
  });

  it('should return an error if the users array is empty', async () => {
    const users: Array<{ id: string; userPrincipalName: string }> = [];
    const resultStatus = await entraUserStatusInBulk(users, false);
    expect(resultStatus).toEqual([
      new Error('At least one user must be provided for disabling'),
    ]);
    expect(mockGraphToken).not.toHaveBeenCalled();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should return an error if the users array is null', async () => {
    const users: any = null;
    const resultStatus = await entraUserStatusInBulk(
      users as unknown as Array<{ id: string; userPrincipalName: string }>,
      false,
    );
    expect(resultStatus).toEqual([
      new Error('At least one user must be provided for disabling'),
    ]);
    expect(mockGraphToken).not.toHaveBeenCalled();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should return success for multiple user disabling within one batch', async () => {
    const users = [createMockUser('user1-id'), createMockUser('user2-id')];
    mockBatchResponse([
      { id: '1', status: 204, headers: {}, body: null },
      { id: '2', status: 204, headers: {}, body: null },
    ]);
    const resultStatus = await entraUserStatusInBulk(users, false);
    expect(mockGraphToken).toHaveBeenCalledTimes(1);
    expect(resultStatus).toEqual([
      { message: 'User user1-id disabled successfully', userId: 'user1-id' },
      { message: 'User user2-id disabled successfully', userId: 'user2-id' },
    ]);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should return success for a single user disabling', async () => {
    const users = [createMockUser('user1-id')];
    mockBatchResponse([{ id: '1', status: 204, headers: {}, body: null }]);
    const resultStatus = await entraUserStatusInBulk(users, false);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockGraphToken).toHaveBeenCalledTimes(1);
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
            {
              id: '1',
              method: 'PATCH',
              url: '/users/user1-id',
              headers: { 'Content-Type': 'application/json' },
              body: { accountEnabled: false },
            },
          ],
        }),
      }),
    );
    expect(resultStatus).toEqual([
      { message: 'User user1-id disabled successfully', userId: 'user1-id' },
    ]);
  });

  it('should handle partial failures in a batch', async () => {
    const users = [createMockUser('user1-id'), createMockUser('user2-id')];
    mockBatchResponse([
      { id: '1', status: 204, headers: {}, body: null },
      { id: '2', status: 404, headers: {}, body: { error: 'User not found' } },
    ]);
    const resultStatus = await entraUserStatusInBulk(users, false);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockGraphToken).toHaveBeenCalledTimes(1);
    expect(resultStatus.length).toBe(2);
    expect(resultStatus[0]).toEqual({
      message: 'User user1-id disabled successfully',
      userId: 'user1-id',
    });
    expect(resultStatus[1]).toBeInstanceOf(Error);
    expect(resultStatus[1]).toHaveProperty(
      'message',
      'Failed to disable user user2-id: {"error":"User not found"}',
    );
  });

  it('should handle complete failures in a batch', async () => {
    const users = [createMockUser('user1-id'), createMockUser('user2-id')];
    mockBatchResponse([
      { id: '1', status: 403, headers: {}, body: { error: 'Forbidden' } },
      { id: '2', status: 404, headers: {}, body: { error: 'User not found' } },
    ]);
    const resultStatus = await entraUserStatusInBulk(users, false);
    expect(mockGraphToken).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(resultStatus.length).toBe(2);
    expect(resultStatus[0]).toBeInstanceOf(Error);
    expect(resultStatus[0]).toHaveProperty(
      'message',
      'Failed to disable user user1-id: {"error":"Forbidden"}',
    );
    expect(resultStatus[1]).toBeInstanceOf(Error);
    expect(resultStatus[1]).toHaveProperty(
      'message',
      'Failed to disable user user2-id: {"error":"User not found"}',
    );
  });

  it('should handle getGraphToken failure', async () => {
    const users = [createMockUser('user1-id')];
    mockGraphToken.mockRejectedValueOnce(new Error('Token acquisition failed'));
    const resultStatus = await entraUserStatusInBulk(users, false);
    expect(mockGraphToken).toHaveBeenCalledTimes(1);
    expect(mockFetch).not.toHaveBeenCalled();
    expectError(
      resultStatus,
      'An unexpected error occurred while performing bulk disable',
    );
  });

  it('should handle unexpected errors during fetch (e.g., network error)', async () => {
    const users = [createMockUser('user1-id')];
    mockFetch.mockRejectedValueOnce(new Error('Network offline'));
    const resultStatus = await entraUserStatusInBulk(users, false);
    expect(mockGraphToken).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expectError(
      resultStatus,
      'An unexpected error occurred while performing bulk disable',
    );
  });

  it('should handle more than batchSize users across multiple batches', async () => {
    const userList = createMockUsers(22);
    mockBatchResponse(
      Array.from({ length: 20 }, (_, i) => ({
        id: `${i + 1}`,
        status: 204,
        headers: {},
        body: null,
      })),
    );
    mockBatchResponse(
      Array.from({ length: 2 }, (_, i) => ({
        id: `${21 + i}`,
        status: 204,
        headers: {},
        body: null,
      })),
    );
    const resultStatus = await entraUserStatusInBulk(userList, false);
    expect(mockGraphToken).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(resultStatus.length).toBe(22);
    expect(resultStatus[0]).toEqual({
      message: 'User user1-id disabled successfully',
      userId: 'user1-id',
    });
    expect(resultStatus[21]).toEqual({
      message: 'User user22-id disabled successfully',
      userId: 'user22-id',
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
    const resultStatus = await entraUserStatusInBulk(users, false);
    expect(resultStatus.length).toBe(1);
    expect(resultStatus[0]).toBeInstanceOf(Error);
    expect(resultStatus[0]).toHaveProperty(
      'message',
      'Failed to disable user unknown: {"error":"Unknown ID"}',
    );
  });
});

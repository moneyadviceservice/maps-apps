import { NextApiRequest, NextApiResponse } from 'next';

import handler from './delete';
import { handleCommonUserLookup } from 'lib/entra/commonUserOperations';
import { deleteUsersInBulk } from 'lib/entra/deleteUsersInBulk';

jest.mock('lib/entra/commonUserOperations', () => ({
  handleCommonUserLookup: jest.fn(),
}));
jest.mock('lib/entra/deleteUsersInBulk', () => ({
  deleteUsersInBulk: jest.fn(),
}));

export const commonError = {
  status: 403,
  message: 'Forbidden',
  details: ['Not authorized'],
};

const deleteHandler = handler;

describe('DELETE /api/users/delete', () => {
  let mockReq: NextApiRequest;
  let mockRes: NextApiResponse;

  const mockHandleCommonUserLookup =
    handleCommonUserLookup as jest.MockedFunction<
      typeof handleCommonUserLookup
    >;
  const mockDeleteUsersInBulk = deleteUsersInBulk as jest.MockedFunction<
    typeof deleteUsersInBulk
  >;

  beforeEach(() => {
    mockReq = {
      method: 'DELETE',
      body: { users: ['test@example.com'] },
    } as NextApiRequest;
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse;

    jest.clearAllMocks();

    mockHandleCommonUserLookup.mockResolvedValue({
      validUsers: [{ id: 'user1-id', userPrincipalName: 'test@example.com' }],
    });

    mockDeleteUsersInBulk.mockResolvedValue([
      { message: 'User user1-id deleted successfully', userId: 'user1-id' },
    ]);
  });

  const expectJsonResponse = (statusCode: number, body: object) => {
    expect(mockRes.status).toHaveBeenCalledWith(statusCode);
    expect(mockRes.json).toHaveBeenCalledWith(body);
  };

  it('should return 405 if method is not DELETE', async () => {
    mockReq.method = 'POST';

    await deleteHandler(mockReq, mockRes);

    expectJsonResponse(405, { message: 'Method Not Allowed' });
    expect(mockHandleCommonUserLookup).not.toHaveBeenCalled();
  });

  it('should return error response from handleCommonUserLookup if lookup fails', async () => {
    mockHandleCommonUserLookup.mockResolvedValue({
      validUsers: [],
      errorResponse: commonError,
    });

    await deleteHandler(mockReq, mockRes);

    expectJsonResponse(commonError.status, {
      message: commonError.message,
      details: commonError.details,
    });
    expect(mockDeleteUsersInBulk).not.toHaveBeenCalled();
  });

  it('should return 200 and success message if all users are deleted successfully', async () => {
    await deleteHandler(mockReq, mockRes);

    expect(mockHandleCommonUserLookup).toHaveBeenCalledWith(mockReq, mockRes);
    expect(mockDeleteUsersInBulk).toHaveBeenCalledWith([
      { id: 'user1-id', userPrincipalName: 'test@example.com' },
    ]);
    expectJsonResponse(200, {
      message: 'All specified users deleted successfully.',
    });
  });

  it('should return 200 with partial success if some deletions fail', async () => {
    const validUsers = [
      { id: 'user1-id', userPrincipalName: 'user1@example.com' },
      { id: 'user2-id', userPrincipalName: 'user2@example.com' },
    ];
    mockHandleCommonUserLookup.mockResolvedValue({ validUsers });
    mockDeleteUsersInBulk.mockResolvedValue([
      { message: 'User user1-id deleted successfully', userId: 'user1-id' },
      new Error('Failed to delete user user2-id: User not found'),
    ]);

    await deleteHandler(mockReq, mockRes);

    expectJsonResponse(200, {
      message: 'Some users were deleted successfully, but others failed.',
      successful: [
        { message: 'User user1-id deleted successfully', userId: 'user1-id' },
      ],
      failed: ['Failed to delete user user2-id: User not found'],
    });
  });

  it('should return 500 if all deletions fail', async () => {
    const validUsers = [
      { id: 'user1-id', userPrincipalName: 'user1@example.com' },
    ];
    mockHandleCommonUserLookup.mockResolvedValue({ validUsers });
    mockDeleteUsersInBulk.mockResolvedValue([
      new Error('Failed to delete user user1-id: Forbidden'),
    ]);

    await deleteHandler(mockReq, mockRes);

    expectJsonResponse(500, {
      message: 'All specified users failed to delete.',
      details: ['Failed to delete user user1-id: Forbidden'],
    });
  });

  it('should return 500 for unexpected errors during deletion', async () => {
    const unexpectedError = new Error('Database connection lost');
    mockDeleteUsersInBulk.mockRejectedValue(unexpectedError);

    await deleteHandler(mockReq, mockRes);

    expectJsonResponse(500, {
      message:
        'An unexpected server error occurred during the deletion process.',
      error: 'Database connection lost',
    });
  });
});

import { NextApiRequest, NextApiResponse } from 'next';

import handler from './fetch';
import { handleCommonUserLookup } from 'lib/entra/commonUserOperations';
import { commonError } from './delete.test';

jest.mock('lib/entra/commonUserOperations', () => ({
  handleCommonUserLookup: jest.fn(),
}));

const fetchHandler = handler;

describe('POST /api/users/fetch', () => {
  let mockReq: NextApiRequest;
  let mockRes: NextApiResponse;

  const mockHandleCommonUserLookup =
    handleCommonUserLookup as jest.MockedFunction<
      typeof handleCommonUserLookup
    >;

  beforeEach(() => {
    mockReq = {
      method: 'POST',
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
  });

  const expectJsonResponse = (statusCode: number, body: object) => {
    expect(mockRes.status).toHaveBeenCalledWith(statusCode);
    expect(mockRes.json).toHaveBeenCalledWith(body);
  };

  it('should return 405 if method is not POST', async () => {
    mockReq.method = 'GET';

    await fetchHandler(mockReq, mockRes);

    expectJsonResponse(405, { message: 'Method Not Allowed' });
    expect(mockHandleCommonUserLookup).not.toHaveBeenCalled();
  });

  it('if lookup fails handleCommonUserLookup should return error response', async () => {
    mockHandleCommonUserLookup.mockResolvedValue({
      validUsers: [],
      errorResponse: commonError,
    });

    await fetchHandler(mockReq, mockRes);

    expectJsonResponse(commonError.status, {
      message: commonError.message,
      details: commonError.details,
    });
  });

  it('should return 200 with fetched users if lookup is successful', async () => {
    const fetchedUsers = [
      { id: 'user1-id', userPrincipalName: 'test@example.com' },
    ];
    mockHandleCommonUserLookup.mockResolvedValue({
      validUsers: fetchedUsers,
    });

    await fetchHandler(mockReq, mockRes);

    expectJsonResponse(200, {
      message: 'Users fetched successfully.',
      users: fetchedUsers,
    });
  });
});

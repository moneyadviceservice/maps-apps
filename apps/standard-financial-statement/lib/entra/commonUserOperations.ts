import { NextApiRequest, NextApiResponse } from 'next';

import { getIronSession, IronSessionData } from 'iron-session';
import { sessionCookieConfig } from 'lib/auth/sessionCookieConfig';
import { getUsersInBulk } from 'lib/entra/getUsersInBulk';
import { UserData } from 'types/Users';

interface CommonOperationResult {
  validUsers: UserData[];
  errorResponse?: {
    status: number;
    message: string;
    details?: string[];
  };
}

/**
 * Shared util for batching user operations (delete, disable, etc.)
 * @param users - Array of UserData
 * @param makeRequest - Function to map (user, index) => GraphBatchRequest
 * @param handleResponse - Function to map (response, originalRequest) => SuccessResult | Error
 * @param batchSize - Number of requests per batch (default 20)
 * @returns Array of SuccessResult | Error
 */
export async function batchUserOperation<
  T extends { userId: string; message: string },
>(
  users: UserData[],
  makeRequest: (user: UserData, index: number) => any,
  handleResponse: (response: any, originalRequest: any) => T | Error,
  batchSize = 20,
  options?: {
    tokenErrorMessage?: string;
    unexpectedErrorMessage?: string;
    emptyUsersErrorMessage?: string;
  },
): Promise<Array<T | Error>> {
  if (!users || users.length === 0) {
    return [
      new Error(
        options?.emptyUsersErrorMessage ||
          'At least one user must be provided for this operation',
      ),
    ];
  }

  try {
    // Lazy import to avoid circular deps if needed
    const { getGraphToken } = await import('./getGraphToken');
    const { executeGraphBatchRequest } = await import('./graphBatchExecutor');

    const token: string | Error = await getGraphToken();
    if (token instanceof Error) {
      return [
        new Error(
          options?.tokenErrorMessage ||
            'An unexpected error occurred while performing bulk operation',
        ),
      ];
    }

    const requests = users.map(makeRequest);
    const batchedResults: Array<T | Error> = [];

    for (let i = 0; i < requests.length; i += batchSize) {
      const batchRequests = requests.slice(i, i + batchSize);
      const responses = await executeGraphBatchRequest(token, batchRequests);

      for (const response of responses) {
        const originalRequest = batchRequests.find(
          (req: any) => req.id === response.id,
        );
        batchedResults.push(handleResponse(response, originalRequest));
      }
    }
    return batchedResults;
  } catch (error) {
    console.error('Error in batchUserOperation:', error);
    return [
      new Error(
        options?.unexpectedErrorMessage ||
          'An unexpected error occurred while performing bulk operation',
      ),
    ];
  }
}

/**
 * Helper to extract userId from a batch request object
 */
export function extractUserIdFromRequest(request: { url: string }): string {
  return request?.url ? request.url.split('/').pop() ?? 'unknown' : 'unknown';
}

/**
 * Helper to format a bulk operation error message
 */
export function formatBulkUserError(
  action: string,
  userId: string,
  errorBody: unknown,
): Error {
  return new Error(
    `Failed to ${action} user ${userId}: ${JSON.stringify(errorBody)}`,
  );
}

export async function handleCommonUserLookup(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<CommonOperationResult> {
  const session = await getIronSession<IronSessionData>(
    req,
    res,
    sessionCookieConfig,
  );

  if (!session.isAuthenticated || !session.isAdmin) {
    console.warn(
      'Unauthorized access attempt: User is not authenticated or not an admin.',
    );
    return {
      validUsers: [],
      errorResponse: { status: 403, message: 'Forbidden' },
    };
  }

  let userEmailArray: string[];
  try {
    const { users } = req.body;
    if (!Array.isArray(users) || users.length === 0) {
      return {
        validUsers: [],
        errorResponse: {
          status: 400,
          message:
            'Invalid request body: "users" must be a non-empty array of email addresses or IDs.',
        },
      };
    }
    userEmailArray = users.map((user) => user.email);
  } catch (parseError) {
    console.error('Failed to parse request body:', parseError);
    return {
      validUsers: [],
      errorResponse: { status: 400, message: 'Invalid JSON body.' },
    };
  }

  try {
    const fetchedUsers = await getUsersInBulk(userEmailArray);

    const validUsers: UserData[] = fetchedUsers.filter(
      (user): user is UserData => !(user instanceof Error),
    );

    const lookupErrors = fetchedUsers.filter(
      (user) => user instanceof Error,
    ) as [Error];
    if (lookupErrors.length > 0) {
      console.error('User lookup failed for some users:', lookupErrors);

      return {
        validUsers: validUsers,
        errorResponse: {
          status: validUsers.length === 0 ? 404 : 400,
          message:
            validUsers.length === 0
              ? 'No valid users found.'
              : 'One or more user lookups failed.',
          details: lookupErrors.map((err) => err.message),
        },
      };
    }

    return { validUsers, errorResponse: undefined };
  } catch (error) {
    console.error('Unexpected error during user lookup:', error);
    return {
      validUsers: [],
      errorResponse: {
        status: 500,
        message:
          'An unexpected server error occurred during the lookup process.',
        details: [(error as Error)?.message ?? 'Unknown error'],
      },
    };
  }
}

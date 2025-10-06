import { UserData } from 'types/Users';
import {
  batchUserOperation,
  extractUserIdFromRequest,
  formatBulkUserError,
} from './commonUserOperations';

export type DisableResponse = { message: string; userId: string };

export const entraUserStatusInBulk = async (
  users: UserData[],
  accountEnabled: boolean,
): Promise<Array<DisableResponse | Error>> => {
  return batchUserOperation<DisableResponse>(
    users,
    (user, index) => ({
      id: (index + 1).toString(),
      method: 'PATCH',
      url: `/users/${user.id}`,
      headers: { 'Content-Type': 'application/json' },
      body: { accountEnabled: accountEnabled },
    }),
    (response, originalRequest) => {
      const userId = extractUserIdFromRequest(originalRequest);
      if (response.status === 204) {
        return {
          message: `User ${userId} disabled successfully`,
          userId: `${userId}`,
        };
      } else {
        return formatBulkUserError('disable', userId, response.body);
      }
    },
    20,
    {
      tokenErrorMessage:
        'An unexpected error occurred while performing bulk disable',
      unexpectedErrorMessage:
        'An unexpected error occurred while performing bulk disable',
      emptyUsersErrorMessage:
        'At least one user must be provided for disabling',
    },
  );
};

import { UserData } from 'types/Users';
import {
  batchUserOperation,
  extractUserIdFromRequest,
  formatBulkUserError,
} from './commonUserOperations';

type DeleteResponse = { message: string; userId: string };

export const deleteUsersInBulk = async (
  users: UserData[],
): Promise<Array<DeleteResponse | Error>> => {
  return batchUserOperation<DeleteResponse>(
    users,
    (user, index) => ({
      id: (index + 1).toString(),
      method: 'DELETE',
      url: `/users/${user.id}`,
      headers: {},
    }),
    (response, originalRequest) => {
      const userId = extractUserIdFromRequest(originalRequest);
      if (response.status === 204) {
        return {
          message: `User ${userId} deleted successfully`,
          userId: `${userId}`,
        };
      } else {
        return formatBulkUserError('delete', userId, response.body);
      }
    },
    20,
    {
      tokenErrorMessage:
        'An unexpected error occurred while performing bulk deletion',
      unexpectedErrorMessage:
        'An unexpected error occurred while performing bulk deletion',
      emptyUsersErrorMessage: 'At least one user must be provided for deletion',
    },
  );
};

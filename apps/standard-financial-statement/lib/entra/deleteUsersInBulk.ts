import { UserData } from 'types/Users';

import { getGraphToken } from './getGraphToken';
import { executeGraphBatchRequest } from './graphBatchExecutor';

type DeleteResponse = { message: string; userId: string };

export const deleteUsersInBulk = async (
  users: UserData[],
): Promise<Array<DeleteResponse | Error>> => {
  if (!users || users.length === 0) {
    return [new Error('At least one user must be provided for deletion')];
  }

  try {
    const token = await getGraphToken();

    if (token instanceof Error) {
      return [token];
    }

    const requests = users.map((user, index) => ({
      id: (index + 1).toString(),
      method: 'DELETE',
      url: `/users/${user.id}`,
      headers: {},
    }));

    const batchSize = 20;
    const batchedResults: Array<DeleteResponse | Error> = [];

    for (let i = 0; i < requests.length; i += batchSize) {
      const batchRequests = requests.slice(i, i + batchSize);

      const responses = await executeGraphBatchRequest(token, batchRequests);

      for (const response of responses) {
        const originalRequest = batchRequests.find(
          (req) => req.id === response.id,
        );
        const userId = originalRequest
          ? originalRequest.url.split('/').pop()
          : 'unknown';

        if (response.status === 204) {
          batchedResults.push({
            message: `User ${userId} deleted successfully`,
            userId: `${userId}`,
          });
        } else {
          const errorBody = response.body;
          batchedResults.push(
            new Error(
              `Failed to delete user ${userId}: ${JSON.stringify(errorBody)}`,
            ),
          );
        }
      }
    }

    return batchedResults;
  } catch (error) {
    console.error('Error in deleteUsersInBulk function: ', error);
    return [
      new Error('An unexpected error occurred while performing bulk deletion'),
    ];
  }
};

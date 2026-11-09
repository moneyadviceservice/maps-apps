import { UserData } from 'types/Users';

import { getGraphToken } from './getGraphToken';
import { executeGraphBatchRequest } from './graphBatchExecutor';

const BATCH_SELECT_USER_PROPERTIES = [
  'id',
  'userPrincipalName',
  'givenName',
  'surname',
  'displayName',
  'mail',
  'jobTitle',
  'createdDateTime',
  //'signInActivity', // Only available with a P1/P2 licence. If this does not exist the whole call will fail.
].join(',');

type ODataResponse = {
  value: UserData[];
};

export const getUsersInBulk = async (
  userEmails: string[],
): Promise<Array<UserData | Error>> => {
  if (!userEmails || userEmails.length === 0) {
    return [new Error('At least one user id or email must be provided')];
  }

  try {
    const token = await getGraphToken();

    if (token instanceof Error) {
      return [token];
    }

    const requests = userEmails.map((email, index) => {
      const encodedEmail = encodeURIComponent(email);

      return {
        id: (index + 1).toString(),
        method: 'GET',
        url: `/users?$filter=mail eq '${encodedEmail}'&$select=${BATCH_SELECT_USER_PROPERTIES}`,
      };
    });

    const batchSize = 20;
    const batchedResults: Array<UserData | Error> = [];

    for (let i = 0; i < requests.length; i += batchSize) {
      const batchRequests = requests.slice(i, i + batchSize);

      const responses = await executeGraphBatchRequest(token, batchRequests);

      for (const response of responses) {
        if (response.status >= 400) {
          batchedResults.push(
            new Error(
              `User lookup failed for ID ${response.id}: ${JSON.stringify(
                response.body,
              )}`,
            ),
          );
        } else {
          batchedResults.push(...(response.body as ODataResponse).value);
        }
      }
    }

    return batchedResults;
  } catch (error) {
    console.error('Error in getUsersInBulk function: ', error);
    return [
      new Error('An unexpected error occurred while fetching users in bulk'),
    ];
  }
};

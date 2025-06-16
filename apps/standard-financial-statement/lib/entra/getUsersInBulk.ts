import { IronSessionData } from 'iron-session';
import { UserData } from 'types/Users';
import { isUserAdmin } from 'utils/admin/isAdmin';
import { isUserAuthenticated } from 'utils/auth/isUserAuthenticated';

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
  // 'signInActivity', // Only available with a P1/P2 licence - to uncomment later when this is setup.
].join(',');

export const getUsersInBulk = async (
  session: IronSessionData,
  emailOrIds: string[],
): Promise<Array<UserData | Error>> => {
  const isAuthenticated = isUserAuthenticated(session);
  const isAdmin = isUserAdmin(session);

  if (!isAuthenticated || !isAdmin) {
    return [new Error('Forbidden')];
  }

  if (!emailOrIds || emailOrIds.length === 0) {
    return [new Error('At least one user id or email must be provided')];
  }

  try {
    const token = await getGraphToken();

    if (token instanceof Error) {
      return [token];
    }

    const requests = emailOrIds.map((emailOrId, index) => ({
      id: (index + 1).toString(),
      method: 'GET',
      url: `/users/${emailOrId}?$select=${BATCH_SELECT_USER_PROPERTIES}`,
    }));

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
          batchedResults.push(response.body as UserData);
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

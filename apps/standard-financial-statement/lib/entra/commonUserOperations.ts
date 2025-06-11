import { NextApiRequest, NextApiResponse } from 'next';

import { getIronSession, IronSessionData } from 'iron-session';
import { sessionOptions } from 'lib/auth/sessionOptions';
import { getUsersInBulk } from 'lib/entra/getUsersInBulk';
import { UserData } from 'types/Users';
import { isUserAdmin } from 'utils/admin/isAdmin';
import { isUserAuthenticated } from 'utils/auth/isUserAuthenticated';

interface CommonOperationResult {
  validUsers: UserData[];
  errorResponse?: {
    status: number;
    message: string;
    details?: string[];
  };
}

export async function handleCommonUserLookup(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<CommonOperationResult> {
  const session = await getIronSession<IronSessionData>(
    req,
    res,
    sessionOptions,
  );

  const isAuthenticated = isUserAuthenticated(session);
  const isAdmin = isAuthenticated && isUserAdmin(session);

  if (!isAuthenticated || !isAdmin) {
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
    userEmailArray = users;
  } catch (parseError) {
    console.error('Failed to parse request body:', parseError);
    return {
      validUsers: [],
      errorResponse: { status: 400, message: 'Invalid JSON body.' },
    };
  }

  try {
    const fetchedUsers = await getUsersInBulk(session, userEmailArray);

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

import type { NextApiRequest, NextApiResponse } from 'next';

import { handleCommonUserLookup } from 'lib/entra/commonUserOperations';
import { deleteUsersInBulk } from 'lib/entra/deleteUsersInBulk';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (typeof req.body === 'string' && req.body.length > 0) {
    const parsedBody = JSON.parse(req.body);
    req.body = parsedBody;
  }

  const { validUsers, errorResponse } = await handleCommonUserLookup(req, res);

  if (errorResponse) {
    return res.status(errorResponse.status).json({
      message: errorResponse.message,
      details: errorResponse.details,
    });
  }

  try {
    const deleteResults = await deleteUsersInBulk(validUsers);

    const deletionErrors = deleteResults.filter(
      (result) => result instanceof Error,
    );

    if (deletionErrors.length > 0) {
      console.error('User deletion failed for some users:', deletionErrors);

      if (deletionErrors.length === deleteResults.length) {
        return res.status(500).json({
          message: 'All specified users failed to delete.',
          details: deletionErrors.map((err) => err.message),
        });
      } else {
        const successfulDeletions = deleteResults.filter(
          (result) => !(result instanceof Error),
        );
        return res.status(200).json({
          message: 'Some users were deleted successfully, but others failed.',
          successful: successfulDeletions,
          failed: deletionErrors.map((err) => err.message),
        });
      }
    }

    return res
      .status(200)
      .json({ message: 'All specified users deleted successfully.' });
  } catch (error) {
    console.error('Unexpected error during user deletion:', error);
    return res.status(500).json({
      message:
        'An unexpected server error occurred during the deletion process.',
      error: (error as Error).message ?? 'Unknown error',
    });
  }
}

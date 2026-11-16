import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  // If a user tries to access the site via an existing SBL link we want to check if they have a beaconId (already accessed)
  const hasBeaconId = request.cookies?.beaconId !== undefined;

  // If they have a beaconId, redirect to the homepage as they already have access
  if (hasBeaconId) {
    response.redirect(302, '/');
    return;
  }

  // If they do not have a beaconId, redirect to the sign-up update page
  response.redirect(302, '/en/taking-part/sign-up-update');
}

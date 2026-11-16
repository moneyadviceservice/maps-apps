import type { NextApiRequest, NextApiResponse } from 'next';

interface ResponseData {
  image_sha: string;
}

// This file is used to check the health of the app and to determine when a new deploy has finished

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse<ResponseData>,
) {
  response.status(200).json({ image_sha: process.env.IMAGE_SHA ?? 'no sha' });
}

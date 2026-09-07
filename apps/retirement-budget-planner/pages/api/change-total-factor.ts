import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { language, summaryOptions, sessionId, stepsEnabled } = request.body;
  const params = new URLSearchParams();
  params.set('sessionId', sessionId);
  params.set('stepsEnabled', stepsEnabled);
  params.set('divisor', summaryOptions);

  response.status(303).redirect(`/${language}/summary?${params.toString()}`);
}

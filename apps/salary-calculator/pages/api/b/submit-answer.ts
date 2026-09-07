import type { NextApiRequest, NextApiResponse } from 'next';

import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    const { language, isEmbed } = request.body;

    const isEmbedBool = isEmbed === 'true';

    const { calculationType } = getCalculationType(request);

    const queryParams = new URLSearchParams();
    queryParams.set('ab_source', 'b');
    queryParams.set('calculationType', calculationType);

    const nextPage = '';

    response.redirect(
      302,
      `/${language}/${nextPage}?${queryParams.toString()}${addEmbedQuery(
        isEmbedBool,
        '&',
      )}`,
    );
  } catch (error) {
    console.error('Error in submit-answer API:', error);
    response.status(500).json({ error: 'Error in submit-answer API' });
  }
}

function getCalculationType(response: NextApiRequest) {
  const { savedData, answer } = response.body;

  const data: DataFromQuery = { ...(savedData && JSON.parse(savedData)) };
  const calculationType = answer ?? data['q-1'];

  return { calculationType };
}

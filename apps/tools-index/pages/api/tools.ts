import { NextApiRequest, NextApiResponse } from 'next';

import {
  monoRepoTools,
  rubyTools,
  tools,
  ToolsIndexType,
} from '../../data/tools-index-data';

type ToolsApiResponse = {
  tools: ToolsIndexType[];
  count: number;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ToolsApiResponse | { error: string }>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type } = req.query;

  let responseData: ToolsIndexType[];

  switch (type) {
    case 'monorepo':
      responseData = monoRepoTools;
      break;
    case 'ruby':
      responseData = rubyTools;
      break;
    case 'all':
    default:
      responseData = tools;
      break;
  }

  return res.status(200).json({
    tools: responseData,
    count: responseData.length,
  });
}

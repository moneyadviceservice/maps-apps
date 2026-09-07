import { NextApiRequest, NextApiResponse } from 'next';

import { getOrganisations } from '../../lib/organisations';

type QueryProps = {
  page?: string;
  itemsPerPage?: string;
  searchQuery?: string;
  continuationToken?: string;
  type?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const {
      page = '1',
      itemsPerPage = '15',
      searchQuery,
      continuationToken,
      type,
    }: QueryProps = req.query;

    const queryParams: { name: string; value: string }[] = [];
    const queryOptions: { maxItemCount: number; continuationToken?: string } = {
      maxItemCount: Number(itemsPerPage),
    };

    if (continuationToken) {
      try {
        queryOptions.continuationToken = decodeURIComponent(continuationToken);
      } catch (err) {
        console.warn('Invalid continuationToken provided', err);
      }
    }

    const isAdmin = true;

    const response = await getOrganisations({
      page,
      queryParams,
      queryOptions,
      searchQuery,
      type,
      isAdmin,
    });

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}

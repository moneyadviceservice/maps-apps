import { NextApiRequest, NextApiResponse } from 'next';

import { stringify } from 'csv-stringify';

import { dbConnect } from '../../lib/database/dbConnect';
import { Organisation } from '../../types/Organisations';

interface FlattenedOrganisation {
  id: string;
  name: string;
  licence_status: string;
  declined_reason: string;
  licence_number: string;
  sfs_live: number;
  created: string;
  modified: string;
  uuid: string;
  delivery_channel: string;
  geo_regions: string;
  organisation_membership: string;
  type_title: string;
  type_other: string;
}

const flattenRecord = (doc: Organisation): FlattenedOrganisation => ({
  id: doc.id,
  name: doc.name,
  licence_status: doc.licence_status,
  declined_reason: doc.declined_reason ?? '',
  licence_number: doc.licence_number,
  sfs_live: doc.sfs_live ?? 0,
  created: doc.created,
  modified: doc.modified,
  uuid: doc.uuid,
  delivery_channel: doc.delivery_channel?.map((d) => d.title).join(', ') ?? '',
  geo_regions: doc.geo_regions?.map((r) => r.title).join(', ') ?? '',
  organisation_membership:
    doc.organisation_membership?.map((m) => m.title).join(', ') ?? '',
  type_title: doc.type?.title ?? '',
  type_other:
    (doc.type?.type_other && doc.type?.type_other !== '0'
      ? doc.type?.type_other
      : '') ?? '',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { container } = await dbConnect();

    const queryIterator = container.items
      .query('SELECT * FROM c')
      .getAsyncIterator();

    const csvStream = stringify({
      header: true,
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="organisations.csv"',
    );

    csvStream.pipe(res);

    for await (const item of queryIterator) {
      for (const doc of item.resources as Organisation[]) {
        csvStream.write(flattenRecord(doc));
      }
    }

    csvStream.end();
  } catch (err) {
    console.error('Export failed', err);
    res.status(500).json({ error: 'Failed to export organisations' });
  }
}

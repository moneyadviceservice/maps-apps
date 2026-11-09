import { dbConnect } from 'lib/database/dbConnect';

export async function firmExistsByFcaNumber(
  fcaNumber: string,
): Promise<boolean> {
  const fcaNumberString = String(fcaNumber).trim();
  if (!fcaNumberString) {
    return false;
  }

  const fcaNumberNumeric = Number(fcaNumberString);
  const { container } = await dbConnect();

  const querySpec = {
    query: `
      SELECT VALUE c.id FROM c
      WHERE c.type = 'main'
        AND (
          c.fca_number = @fcaNumberNumeric
          OR c.fca_number = @fcaNumberString
        )
    `,
    parameters: [
      {
        name: '@fcaNumberNumeric',
        value: Number.isFinite(fcaNumberNumeric) ? fcaNumberNumeric : null,
      },
      {
        name: '@fcaNumberString',
        value: fcaNumberString,
      },
    ],
  };

  const { resources } = await container.items.query(querySpec).fetchAll();
  return resources.length > 0;
}

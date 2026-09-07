import { dbConnect } from 'lib/database/dbConnect';

export async function firmExistsByFcaNumber(
  fcaNumber: string,
): Promise<boolean> {
  const { container } = await dbConnect();

  const querySpec = {
    query: 'SELECT VALUE c.id FROM c WHERE c.fca_number = @fcaNumber',
    parameters: [
      {
        name: '@fcaNumber',
        value: fcaNumber,
      },
    ],
  };

  const { resources } = await container.items.query(querySpec).fetchAll();
  return resources.length > 0;
}

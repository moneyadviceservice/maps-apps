import { dbConnect } from 'lib/database/dbConnect';

export const getOrganisationStatus = async (
  email: string | undefined,
): Promise<boolean> => {
  const { container } = await dbConnect();

  if (!email) {
    return false;
  }

  try {
    const querySpec = {
      query: `SELECT * FROM c WHERE c.email = @email OR EXISTS (SELECT VALUE u FROM u IN c.users WHERE u.email = @email)`,
      parameters: [{ name: '@email', value: email }],
    };

    const { resources } = await container.items.query(querySpec).fetchAll();

    if (!resources.length) {
      return false;
    }

    return resources?.length > 0 && resources[0]?.licence_status === 'active';
  } catch (error) {
    console.error(error);
    return false;
  }
};

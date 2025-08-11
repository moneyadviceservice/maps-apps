import { dbConnect } from 'lib/database/dbConnect';

export const getOrganisationStatus = async (email: string) => {
  const { container } = await dbConnect();

  try {
    const querySpec = {
      query: `SELECT * FROM c WHERE c.email = @email`,
      parameters: [{ name: '@email', value: email }],
    };

    const { resources } = await container.items.query(querySpec).fetchAll();

    if (!resources.length) {
      return { error: 'Organisation not found' };
    }

    return resources?.length > 0 && resources[0]?.licence_status === 'active';
  } catch (error) {
    console.error(error);
    return { error: 'Failed to fetch organisation' };
  }
};

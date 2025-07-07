import { dbConnect } from '../database/dbConnect';

export const getOrganisation = async (licenceNumber: number) => {
  const { container } = await dbConnect();

  try {
    const querySpec = {
      query: `SELECT * FROM c WHERE c.licence_number = @licenceNumber`,
      parameters: [{ name: '@licenceNumber', value: licenceNumber }],
    };

    const { resources } = await container.items.query(querySpec).fetchAll();

    if (!resources.length) {
      return { error: 'Organisation not found' };
    }

    return resources[0];
  } catch (error) {
    console.error(error);
    return { error: 'Failed to fetch organisation' };
  }
};

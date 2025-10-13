import { dbConnect } from '../database/dbConnect';

export const deleteOrganisation = async (licence_number: string) => {
  const { container } = await dbConnect();

  try {
    const querySpec = {
      query: `SELECT * FROM c WHERE c.licence_number = @licenceNumber`,
      parameters: [{ name: '@licenceNumber', value: licence_number }],
    };

    const { resources } = await container.items.query(querySpec).fetchAll();

    if (!resources.length) {
      return { error: 'Organisation not found' };
    }

    const organisationToDelete = resources[0];

    await container
      .item(organisationToDelete.id, organisationToDelete.id)
      .delete();

    return { success: true, message: 'Organisation deleted successfully' };
  } catch (error) {
    console.error('Delete failed:', error);
    return { error: 'Failed to delete organisation' };
  }
};

import { Organisation } from '../../types/Organisations';
import { dbConnect } from '../database/dbConnect';

interface OrganisationUpdates {
  licence_number: string;
  payload: Partial<Organisation>;
}

export const updateOrganisation = async ({
  licence_number,
  payload,
}: OrganisationUpdates) => {
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

    const existingOrg = resources[0];

    const updatedOrg = {
      ...existingOrg,
      ...payload,
      modified: new Date().toISOString(),
    };

    const { resource } = await container
      .item(existingOrg.id, existingOrg.id)
      .replace(updatedOrg);

    return resource;
  } catch (error) {
    console.error('Update failed:', error);
    return { error: 'Failed to update organisation' };
  }
};

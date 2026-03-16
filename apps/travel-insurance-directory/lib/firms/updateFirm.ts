import { dbConnect } from 'lib/database/dbConnect';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

export const updateFirm = async (
  id: string,
  updates: Partial<TravelInsuranceFirmDocument>,
) => {
  try {
    const { container } = await dbConnect();

    const patchOperations = Object.entries(updates).map(([key, value]) => ({
      op: 'set' as const,
      path: `/${key}`,
      value: value,
    }));

    patchOperations.push({
      op: 'set',
      path: '/updated_at',
      value: new Date().toISOString(),
    });

    const { resource } = await container.item(id, id).patch(patchOperations);
    return { success: true, response: resource };
  } catch (error) {
    console.error('Update failed:', error);
    return { error: 'Failed to update progress' };
  }
};

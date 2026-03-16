import { dbConnect } from 'lib/database/dbConnect';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

export const fetchFirm = async (id: string) => {
  try {
    const { container } = await dbConnect();
    const { resource } = await container.item(id, id).read();

    if (!resource) {
      return { error: 'Firm not found', success: false };
    }

    return {
      success: true,
      response: resource as TravelInsuranceFirmDocument,
    };
  } catch (error) {
    console.error('Fetch failed:', error);
    return { error: 'Failed to fetch firm data', success: false };
  }
};

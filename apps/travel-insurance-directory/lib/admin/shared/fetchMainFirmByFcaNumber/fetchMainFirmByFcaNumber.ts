import { dbConnect } from 'lib/database/dbConnect';
import type { MainTravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

export type MainFirmResponse = {
  success: boolean;
  response?: MainTravelInsuranceFirmDocument;
  error?: string;
};

export async function fetchMainFirmByFcaNumber(
  fcaNumber: number,
): Promise<MainFirmResponse> {
  try {
    const { container } = await dbConnect();
    const querySpec = {
      query: `SELECT * FROM c WHERE c.type = 'main' AND c.fca_number = @fcaNumber`,
      parameters: [{ name: '@fcaNumber', value: fcaNumber }],
    };
    const { resources } = await container.items.query(querySpec).fetchAll();
    const firms = (resources ?? []) as MainTravelInsuranceFirmDocument[];
    if (firms.length === 0) {
      return { success: false, error: 'Main firm not found' };
    }
    return { success: true, response: firms[0] };
  } catch (error) {
    console.error('Fetch main firm failed:', error);
    return { success: false, error: 'Failed to fetch main firm' };
  }
}

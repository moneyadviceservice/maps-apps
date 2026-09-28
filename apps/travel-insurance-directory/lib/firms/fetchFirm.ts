import { IronSessionData } from 'iron-session';
import { getAdminCiFixtureFirmById } from 'lib/admin/dashboard/ciFixture/ciFixture';
import { dbConnect } from 'lib/database/dbConnect';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';
import type { Container } from '@azure/cosmos';

export type FetchFirmSession = Pick<IronSessionData, 'db_id' | 'firmData'>;

export type FetchFirmResult = {
  success: boolean;
  response?: TravelInsuranceFirmDocument;
  error?: string;
};

async function readFirmDocumentById(
  container: Container,
  id: string,
): Promise<TravelInsuranceFirmDocument | null> {
  try {
    const { resource } = await container.item(id, id).read();
    if (resource) {
      return resource as TravelInsuranceFirmDocument;
    }
  } catch {
    console.error(
      'Failed to fetch resource. Partition key is not the document id.',
    );
  }

  const { resources } = await container.items
    .query({
      query: 'SELECT * FROM c WHERE c.id = @id',
      parameters: [{ name: '@id', value: id }],
    })
    .fetchAll();

  const firm = resources?.[0];
  return firm ? (firm as TravelInsuranceFirmDocument) : null;
}

/** Firm from session.firmData (CI registration mocks). Never hits Cosmos. */
export function getSessionFirm(
  session: FetchFirmSession,
  id?: string,
): FetchFirmResult {
  const firmData = session.firmData ?? {};
  return {
    success: true,
    response: {
      ...firmData,
      type: 'main',
      ...(id ? { id } : {}),
    } as TravelInsuranceFirmDocument,
  };
}

/**
 * Firm by document id.
 * CI: admin fixture if present, otherwise Cosmos.
 */
export async function getFirmById(id: string): Promise<FetchFirmResult> {
  const trimmedId = id.trim();
  if (!trimmedId) {
    return { error: 'No firm ID provided', success: false };
  }

  if (process.env.CI === 'true') {
    const fixtureFirm = getAdminCiFixtureFirmById(trimmedId);
    if (fixtureFirm) {
      return { success: true, response: fixtureFirm };
    }
  }

  try {
    const { container } = await dbConnect();
    const firm = await readFirmDocumentById(container, trimmedId);

    if (!firm) {
      return { error: 'Firm not found', success: false };
    }

    return {
      success: true,
      response: firm,
    };
  } catch (error) {
    console.error('Fetch failed:', error);
    return { error: 'Failed to fetch firm data', success: false };
  }
}

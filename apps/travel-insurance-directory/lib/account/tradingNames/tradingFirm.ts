import { dbConnect } from 'lib/database/dbConnect';
import {
  buildSearchableFields,
  emptyMedicalSpecialisms,
  emptyServiceDetails,
} from 'lib/firms/firmDefaults';
import type {
  CreateTradingFirmPayload,
  TradingTravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';

export type TradingFirmResponse = {
  success: boolean;
  response?: TradingTravelInsuranceFirmDocument;
  error?: string;
};

export type TradingFirmsListResponse = {
  success: boolean;
  response?: TradingTravelInsuranceFirmDocument[];
  error?: string;
};

function normalizeTradingName(name: string): string {
  return name.trim().toLowerCase();
}

export async function fetchTradingDocsByMainFirmId(
  mainFirmId: string,
): Promise<TradingFirmsListResponse> {
  try {
    const { container } = await dbConnect();
    const querySpec = {
      query: `SELECT * FROM c WHERE c.type = 'trading' AND c.main_firm_id = @mainFirmId`,
      parameters: [{ name: '@mainFirmId', value: mainFirmId }],
    };
    const { resources } = await container.items.query(querySpec).fetchAll();
    const firms = (resources ?? []) as TradingTravelInsuranceFirmDocument[];
    return { success: true, response: firms };
  } catch (error) {
    console.error('Fetch trading firms failed:', error);
    return { success: false, error: 'Failed to fetch trading firms' };
  }
}

export async function fetchTradingDocByMainAndName(
  mainFirmId: string,
  name: string,
): Promise<TradingFirmResponse> {
  try {
    const { container } = await dbConnect();
    const querySpec = {
      query: `SELECT * FROM c WHERE c.type = 'trading' AND c.main_firm_id = @mainFirmId AND LOWER(c.registered_name) = @nameLower`,
      parameters: [
        { name: '@mainFirmId', value: mainFirmId },
        { name: '@nameLower', value: normalizeTradingName(name) },
      ],
    };
    const { resources } = await container.items.query(querySpec).fetchAll();
    const firms = (resources ?? []) as TradingTravelInsuranceFirmDocument[];
    if (firms.length === 0) {
      return { success: false, error: 'Trading firm not found' };
    }
    return { success: true, response: firms[0] };
  } catch (error) {
    console.error('Fetch trading firm by name failed:', error);
    return { success: false, error: 'Failed to fetch trading firm' };
  }
}

export async function fetchTradingFirmById(
  tradingFirmId: string,
): Promise<TradingFirmResponse> {
  try {
    const { container } = await dbConnect();
    const { resource } = await container
      .item(tradingFirmId, tradingFirmId)
      .read();
    if (resource?.type !== 'trading') {
      return { success: false, error: 'Trading firm not found' };
    }
    return {
      success: true,
      response: resource as TradingTravelInsuranceFirmDocument,
    };
  } catch (error) {
    console.error('Fetch trading firm by id failed:', error);
    return { success: false, error: 'Failed to fetch trading firm' };
  }
}

/** Query by id + FRN so delete works even when main_firm_id was backfilled to a legacy main id. */
export async function fetchTradingDocForMainById(
  tradingFirmId: string,
  mainFrn: number,
): Promise<TradingFirmResponse> {
  try {
    const { container } = await dbConnect();
    const querySpec = {
      query: `SELECT * FROM c WHERE c.id = @id AND c.type = 'trading' AND c.fca_number = @mainFrn`,
      parameters: [
        { name: '@id', value: tradingFirmId },
        { name: '@mainFrn', value: mainFrn },
      ],
    };
    const { resources } = await container.items.query(querySpec).fetchAll();
    const firms = (resources ?? []) as TradingTravelInsuranceFirmDocument[];
    if (firms.length === 0) {
      return { success: false, error: 'Trading firm not found' };
    }
    return { success: true, response: firms[0] };
  } catch (error) {
    console.error('Fetch trading firm for main failed:', error);
    return { success: false, error: 'Failed to fetch trading firm' };
  }
}

export function buildTradingFirmPayload({
  name,
  mainFrn,
  mainFirmId,
}: {
  name: string;
  mainFrn: number;
  mainFirmId: string;
}): CreateTradingFirmPayload {
  const nowIso = new Date().toISOString();

  return {
    type: 'trading',
    main_firm_id: mainFirmId,
    fca_number: mainFrn,
    registered_name: name,
    website_address: null,
    created_at: nowIso,
    updated_at: nowIso,
    approved_at: null,
    hidden_at: null,
    status: 'hidden',
    service_details: emptyServiceDetails(),
    trip_covers: [],
    medical_specialisms: emptyMedicalSpecialisms(),
    office: null,
    searchable: buildSearchableFields(name, mainFrn),
  };
}

export async function createTradingFirm(
  payload: CreateTradingFirmPayload,
): Promise<TradingFirmResponse> {
  try {
    const { container } = await dbConnect();
    const existing = await fetchTradingDocByMainAndName(
      payload.main_firm_id,
      payload.registered_name,
    );
    if (existing.success && existing.response) {
      return { success: false, error: 'Trading firm already exists' };
    }

    const response = await container.items.create(payload);
    return {
      success: true,
      response: response.resource as TradingTravelInsuranceFirmDocument,
    };
  } catch (error) {
    console.error('Create trading firm failed:', error);
    return { success: false, error: 'Failed to create trading firm' };
  }
}

export async function deleteTradingFirm(
  id: string,
): Promise<TradingFirmResponse> {
  try {
    const { container } = await dbConnect();
    await container.item(id, id).delete();
    return { success: true };
  } catch (error) {
    console.error('Delete trading firm failed:', error);
    return { success: false, error: 'Failed to delete trading firm' };
  }
}

export async function deleteTradingFirmDocument(
  doc: TradingTravelInsuranceFirmDocument,
): Promise<TradingFirmResponse> {
  const { container } = await dbConnect();
  const partitionKeyCandidates = [doc.id, String(doc.fca_number)];

  for (const partitionKey of partitionKeyCandidates) {
    try {
      await container.item(doc.id, partitionKey).delete();
      return { success: true };
    } catch (error) {
      console.error(
        `Delete trading firm ${doc.id} failed (partition ${partitionKey}):`,
        error,
      );
    }
  }

  return { success: false, error: 'Failed to delete trading firm' };
}

export async function upsertTradingFirm({
  name,
  mainFrn,
  mainFirmId,
}: {
  name: string;
  mainFrn: number;
  mainFirmId: string;
}): Promise<TradingFirmResponse> {
  const existing = await fetchTradingDocByMainAndName(mainFirmId, name);
  if (existing.success && existing.response?.id) {
    const { updateFirm } = await import('lib/firms/updateFirm');
    const searchable = buildSearchableFields(name, mainFrn);
    const updateResult = await updateFirm(existing.response.id, {
      registered_name: name,
      searchable,
    });
    if (!updateResult.success) {
      return { success: false, error: 'Failed to update trading firm' };
    }
    return {
      success: true,
      response: updateResult.response as TradingTravelInsuranceFirmDocument,
    };
  }

  return createTradingFirm(
    buildTradingFirmPayload({ name, mainFrn, mainFirmId }),
  );
}

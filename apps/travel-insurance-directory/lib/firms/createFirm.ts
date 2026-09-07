import { dbConnect } from 'lib/database/dbConnect';
import {
  buildPrincipalPayload,
  buildSearchableFields,
  emptyMedicalSpecialisms,
  emptyServiceDetails,
  emptySpecificConditions,
  type PrincipalInitialFields,
} from 'lib/firms/firmDefaults';
import type {
  CreateMainFirmPayload,
  MainTravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';

export type Response = {
  success: boolean;
  response?: MainTravelInsuranceFirmDocument;
  error?: string;
};

type InitialDataProps = {
  frnNumber?: string;
  firmName?: string;
  principal?: Partial<PrincipalInitialFields>;
};

export const createFirm = async (
  initialData: InitialDataProps,
): Promise<Response> => {
  const fcaNumber = initialData.frnNumber;
  if (!fcaNumber) {
    return {
      error: 'frnNumber is required to create a new firm',
      success: false,
    };
  }

  const firmName =
    typeof initialData.firmName === 'string' ? initialData.firmName.trim() : '';

  const nowIso = new Date().toISOString();
  const fcaNum = Number(fcaNumber);

  const payload: CreateMainFirmPayload = {
    type: 'main',
    fca_number: fcaNum,
    registered_name: firmName,
    website_address: null,
    created_at: nowIso,
    updated_at: nowIso,
    approved_at: null,
    hidden_at: null,
    reregistered_at: null,
    reregister_approved_at: null,
    renewal_draft: null,
    renewal_resume_href: null,
    pending_add_to_directory: false,
    pending_add_to_directory_until: null,
    status: 'hidden',
    confirmed_disclaimer: false,
    covered_by_ombudsman_question: null,
    medical_coverage: {
      specific_conditions: emptySpecificConditions(),
    } as CreateMainFirmPayload['medical_coverage'],
    service_details: emptyServiceDetails(),
    trip_covers: [],
    medical_specialisms: emptyMedicalSpecialisms(),
    office: null,
    searchable: buildSearchableFields(firmName, fcaNum),
    principal: buildPrincipalPayload(initialData.principal, nowIso),
  };

  try {
    const { container } = await dbConnect();

    const response = await container.items.create(payload);

    return {
      success: true,
      response: response.resource as MainTravelInsuranceFirmDocument,
    };
  } catch (error) {
    console.error('Create failed:', error);

    return { error: 'Failed to create organisation', success: false };
  }
};

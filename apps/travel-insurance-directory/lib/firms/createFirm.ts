import { dbConnect } from 'lib/database/dbConnect';
import {
  MedicalCoverage,
  SpecificConditions,
  TravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';

export type Response = {
  success: boolean;
  response?: TravelInsuranceFirmDocument;
  error?: string;
};

type InitialDataProps = {
  frnNumber?: string;
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

  const payload: Partial<TravelInsuranceFirmDocument> = {
    fca_number: Number(fcaNumber),
    registered_name: '',

    website_address: null,

    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),

    approved_at: null,
    hidden_at: null,
    reregistered_at: null,
    reregister_approved_at: null,

    confirmed_disclaimer: false,
    status: 'hidden',
    covered_by_ombudsman_question: null,

    medical_coverage: {
      specific_conditions: {} as SpecificConditions,
    } as MedicalCoverage,
    service_details: null,
    trip_covers: [],
    medical_specialisms: null,
  };

  try {
    const { container } = await dbConnect();

    const querySpec = {
      query: 'SELECT VALUE c.id FROM c WHERE c.fca_number = @fcaNumber',
      parameters: [
        {
          name: '@fcaNumber',
          value: fcaNumber,
        },
      ],
    };

    const { resources } = await container.items.query(querySpec).fetchAll();

    if (resources.length > 0) {
      return { error: 'Firm already registered', success: false };
    }

    const response = await container.items.create(payload);

    return {
      success: true,
      response: response.resource as TravelInsuranceFirmDocument,
    };
  } catch (error) {
    console.error('Create failed:', error);

    return { error: 'Failed to create organisation', success: false };
  }
};

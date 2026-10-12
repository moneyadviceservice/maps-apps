import { createMockFirm } from 'components/FirmSummary/mockFirm';
import { createEligibleAdminFirm } from 'lib/admin/shared/testing/adminFirmFixtures';
import { buildSearchableFields } from 'lib/firms/firmDefaults';
import type {
  FirmStatus,
  MainTravelInsuranceFirmDocument,
  Principal,
} from 'types/travel-insurance-firm';

export type AdminE2eFirmKey = 'A' | 'B' | 'C';

type AdminE2eFirmConfig = {
  key: AdminE2eFirmKey;
  id: string;
  fca: number;
  fcaString: string;
  registeredName: string;
  principal: {
    first: string;
    last: string;
    emailLocal: string;
    irn: string;
  };
  status: FirmStatus;
  /** Successful registration approval (`approved_at` set). */
  registrationComplete: boolean;
  selfServe: 'complete' | 'incomplete';
};

/**
 * Stable Cosmos admin e2e firm metadata.
 * Keep in sync with e2e `adminCosmosE2eConstants.data.ts`.
 * These ids must NOT appear in the admin CI dashboard fixture so
 * `getFirmById` falls through to Cosmos under `CI=true`.
 */
const ADMIN_E2E_FIRM_REGISTRY: Record<AdminE2eFirmKey, AdminE2eFirmConfig> = {
  A: {
    key: 'A',
    id: 'tid-e2e-cosmos-admin-firm-a',
    fca: 620_001,
    fcaString: '620001',
    registeredName: 'E2E Cosmos Admin Firm A',
    principal: {
      first: 'Ada',
      last: 'Admin',
      emailLocal: 'ada.admin',
      irn: 'IRN-E2E-A',
    },
    status: 'hidden',
    registrationComplete: true,
    selfServe: 'complete',
  },
  B: {
    key: 'B',
    id: 'tid-e2e-cosmos-admin-firm-b',
    fca: 620_002,
    fcaString: '620002',
    registeredName: 'E2E Cosmos Admin Firm B',
    principal: {
      first: 'Ben',
      last: 'Admin',
      emailLocal: 'ben.admin',
      irn: 'IRN-E2E-B',
    },
    status: 'active',
    registrationComplete: true,
    selfServe: 'complete',
  },
  C: {
    key: 'C',
    id: 'tid-e2e-cosmos-admin-firm-c',
    fca: 620_003,
    fcaString: '620003',
    registeredName: 'E2E Cosmos Admin Firm C',
    principal: {
      first: 'Cara',
      last: 'Admin',
      emailLocal: 'cara.admin',
      irn: 'IRN-E2E-C',
    },
    status: 'hidden',
    registrationComplete: false,
    selfServe: 'incomplete',
  },
};

export const adminE2eFirmConstants = {
  firmA: {
    key: ADMIN_E2E_FIRM_REGISTRY.A.key,
    id: ADMIN_E2E_FIRM_REGISTRY.A.id,
    fca: ADMIN_E2E_FIRM_REGISTRY.A.fca,
    fcaString: ADMIN_E2E_FIRM_REGISTRY.A.fcaString,
    registeredName: ADMIN_E2E_FIRM_REGISTRY.A.registeredName,
    principalFullName: 'Ada Admin',
  },
  firmB: {
    key: ADMIN_E2E_FIRM_REGISTRY.B.key,
    id: ADMIN_E2E_FIRM_REGISTRY.B.id,
    fca: ADMIN_E2E_FIRM_REGISTRY.B.fca,
    fcaString: ADMIN_E2E_FIRM_REGISTRY.B.fcaString,
    registeredName: ADMIN_E2E_FIRM_REGISTRY.B.registeredName,
    principalFullName: 'Ben Admin',
  },
  firmC: {
    key: ADMIN_E2E_FIRM_REGISTRY.C.key,
    id: ADMIN_E2E_FIRM_REGISTRY.C.id,
    fca: ADMIN_E2E_FIRM_REGISTRY.C.fca,
    fcaString: ADMIN_E2E_FIRM_REGISTRY.C.fcaString,
    registeredName: ADMIN_E2E_FIRM_REGISTRY.C.registeredName,
    principalFullName: 'Cara Admin',
  },
} as const;

const SEED_TIMESTAMP = '2024-01-15T00:00:00Z';

function principalForFirm(config: AdminE2eFirmConfig['principal']): Principal {
  return {
    first_name: config.first,
    last_name: config.last,
    job_title: 'Director',
    email_address: `${config.emailLocal}@e2e-admin-cosmos.maps.test`,
    telephone_number: '01634 200 001',
    confirmed_disclaimer: true,
    senior_manager_name: null,
    individual_reference_number: config.irn,
    created_at: SEED_TIMESTAMP,
    updated_at: SEED_TIMESTAMP,
  };
}

/**
 * Cosmos document seeds:
 * - A: registration complete + self-serve complete + hidden (Add to Directory)
 * - B: registration complete + self-serve complete + active (Hide from Directory)
 * - C: registration incomplete + self-serve incomplete (no admin actions)
 */
export function buildAdminE2eFirmSeed(
  firm: AdminE2eFirmKey,
): MainTravelInsuranceFirmDocument {
  const config = ADMIN_E2E_FIRM_REGISTRY[firm];
  const hidden_at = config.status === 'hidden' ? SEED_TIMESTAMP : null;

  const shared = {
    id: config.id,
    fca_number: config.fca,
    registered_name: config.registeredName,
    status: config.status,
    hidden_at,
    hidden_reason: null,
    approved_at: config.registrationComplete ? SEED_TIMESTAMP : null,
    created_at: SEED_TIMESTAMP,
    updated_at: SEED_TIMESTAMP,
    reregistered_at: null,
    reregister_approved_at: null,
    renewal_draft: null,
    renewal_resume_href: null,
    pending_add_to_directory: false,
    pending_add_to_directory_until: null,
    self_serve_edit_draft: null,
    principal: principalForFirm(config.principal),
    searchable: buildSearchableFields(config.registeredName, config.fca),
  };

  if (config.selfServe === 'incomplete') {
    return createMockFirm({
      ...shared,
      cover_service_confirmed_at: null,
      customer_contact_confirmed_at: null,
      trip_covers: [],
    });
  }

  return createEligibleAdminFirm(shared);
}

export function getAdminE2eFirmMeta(firm: AdminE2eFirmKey) {
  const config = ADMIN_E2E_FIRM_REGISTRY[firm];
  return {
    key: config.key,
    id: config.id,
    fca: config.fca,
    fcaString: config.fcaString,
    registeredName: config.registeredName,
  };
}

export function parseAdminE2eFirmQuery(
  value: string | string[] | undefined,
): AdminE2eFirmKey | 'all' | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw == null) {
    return null;
  }
  const normalized = String(raw).trim().toUpperCase();
  if (normalized === 'A' || normalized === 'B' || normalized === 'C') {
    return normalized;
  }
  if (normalized === 'ALL') {
    return 'all';
  }
  return null;
}

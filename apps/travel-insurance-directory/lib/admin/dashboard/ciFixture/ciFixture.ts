/**
 * Deterministic admin firms for E2E when `process.env.CI === 'true'` (no Cosmos).
 * Keep {@link adminCiE2eConstants} in sync with Playwright assertions.
 *
 * List semantics (filter + Cosmos ORDER BY + in-memory pipeline) come from
 * {@link filterDocumentsMatchingAdminCosmosWhere}, {@link orderDocumentsLikeAdminCosmosQuery},
 * and {@link processAdminFirmListForPage} — this file only defines static documents and id lookups.
 */

import {
  filterDocumentsMatchingAdminCosmosWhere,
  orderDocumentsLikeAdminCosmosQuery,
} from 'lib/admin/dashboard/cosmosSemantics/cosmosSemantics';
import type {
  AdminSearchParams,
  GetAllFirmsResult,
} from 'lib/admin/dashboard/firmListPipeline';
import { processAdminFirmListForPage } from 'lib/admin/dashboard/firmListPipeline';
import {
  createMockFirm,
  createMockTradingFirm,
} from 'components/FirmSummary/mockFirm';
import type {
  MainTravelInsuranceFirmDocument,
  Principal,
  TravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';

const principal = (
  first: string,
  last: string,
  irn: string,
  email_address: string,
  telephone_number: string,
): Principal => ({
  first_name: first,
  last_name: last,
  job_title: null,
  email_address,
  telephone_number,
  confirmed_disclaimer: true,
  senior_manager_name: null,
  individual_reference_number: irn,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
});

/** Stable ids / FCAs for Playwright — keep in sync with e2e `adminCiE2eConstants.data.ts`. */
export const adminCiE2eConstants = {
  /** Total firms in fixture (mains + trading). */
  firmRowCount: 16,
  mainAlpha: {
    id: 'tid-e2e-admin-main-alpha',
    fca: 610_001,
    fcaString: '610001',
    registeredName: 'Alpha Insurance Ltd',
    principalFullName: 'Amy Adams',
    principalSearchToken: 'Amy',
  },
  mainBeta: {
    id: 'tid-e2e-admin-main-beta',
    fca: 610_002,
    fcaString: '610002',
    registeredName: 'Beta Brokers Ltd',
    principalFullName: 'Bob Brown',
    principalSearchToken: 'Bob',
  },
  mainGamma: {
    id: 'tid-e2e-admin-main-gamma',
    fca: 610_003,
    principalFullName: 'Chris Cole',
    principalSearchToken: 'Chris',
  },
  tradingAlpha: {
    id: 'tid-e2e-admin-trading-alpha',
    fca: 610_001,
    registeredName: 'alphatrade.com',
  },
} as const;

function buildCiFixtureDocuments(): TravelInsuranceFirmDocument[] {
  const { mainAlpha, mainBeta, mainGamma, tradingAlpha } = adminCiE2eConstants;

  const mainAlphaDoc = createMockFirm({
    id: mainAlpha.id,
    fca_number: mainAlpha.fca,
    registered_name: mainAlpha.registeredName,
    created_at: '2024-08-20T12:00:00Z',
    principal: principal(
      'Amy',
      'Adams',
      'IRN-AA',
      'amy.adams@e2e-fixture.maps.test',
      '01634 100 001',
    ),
  });

  const tradingAlphaDoc = createMockTradingFirm({
    id: tradingAlpha.id,
    fca_number: tradingAlpha.fca,
    registered_name: tradingAlpha.registeredName,
    main_firm_id: mainAlpha.id,
    created_at: '2024-08-18T12:00:00Z',
  });

  const mainBetaDoc = createMockFirm({
    id: mainBeta.id,
    fca_number: mainBeta.fca,
    registered_name: mainBeta.registeredName,
    created_at: '2024-05-10T12:00:00Z',
    principal: principal(
      'Bob',
      'Brown',
      'IRN-BB',
      'bob.brown@e2e-fixture.maps.test',
      '01634 100 002',
    ),
  });

  const mainGammaDoc = createMockFirm({
    id: mainGamma.id,
    fca_number: mainGamma.fca,
    registered_name: 'Gamma Cover Ltd',
    created_at: '2024-06-01T12:00:00Z',
    principal: principal(
      'Chris',
      'Cole',
      'IRN-CC',
      'chris.cole@e2e-fixture.maps.test',
      '01634 100 003',
    ),
  });

  const mainDelta = createMockFirm({
    id: 'tid-e2e-admin-main-delta',
    fca_number: 610_004,
    registered_name: 'Delta Direct Ltd',
    created_at: '2024-03-01T12:00:00Z',
    principal: principal(
      'Dana',
      'Drew',
      'IRN-DD',
      'dana.drew@e2e-fixture.maps.test',
      '01634 100 004',
    ),
  });

  const mainEpsilon = createMockFirm({
    id: 'tid-e2e-admin-main-epsilon',
    fca_number: 610_005,
    registered_name: 'Epsilon Edge Ltd',
    created_at: '2024-02-01T12:00:00Z',
    principal: principal(
      'Evan',
      'Evans',
      'IRN-EE',
      'evan.evans@e2e-fixture.maps.test',
      '01634 100 005',
    ),
  });

  const mainZeta = createMockFirm({
    id: 'tid-e2e-admin-main-zeta',
    fca_number: 999_003,
    registered_name: 'Zeta Zone Ltd',
    created_at: '2024-07-01T12:00:00Z',
    principal: principal(
      'Zoe',
      'Zed',
      'IRN-ZZ',
      'zoe.zed@e2e-fixture.maps.test',
      '01634 100 006',
    ),
  });

  const tradingBeta = createMockTradingFirm({
    id: 'tid-e2e-admin-trading-beta',
    fca_number: mainBeta.fca,
    registered_name: 'betatrade.com',
    main_firm_id: mainBeta.id,
    created_at: '2024-05-11T12:00:00Z',
  });

  const mainEta = createMockFirm({
    id: 'tid-e2e-admin-main-eta',
    fca_number: 610_006,
    registered_name: 'Eta Assurance Ltd',
    created_at: '2024-01-15T12:00:00Z',
    principal: principal(
      'Ella',
      'East',
      'IRN-ET',
      'ella.east@e2e-fixture.maps.test',
      '01634 100 007',
    ),
  });

  const mainTheta = createMockFirm({
    id: 'tid-e2e-admin-main-theta',
    fca_number: 610_007,
    registered_name: 'Theta Travel Ltd',
    created_at: '2024-01-20T12:00:00Z',
    principal: principal(
      'Tom',
      'Tate',
      'IRN-TH',
      'tom.tate@e2e-fixture.maps.test',
      '01634 100 008',
    ),
  });

  const mainIota = createMockFirm({
    id: 'tid-e2e-admin-main-iota',
    fca_number: 610_008,
    registered_name: 'Iota Insurance Ltd',
    created_at: '2024-01-25T12:00:00Z',
    principal: principal(
      'Ivy',
      'Ingram',
      'IRN-IO',
      'ivy.ingram@e2e-fixture.maps.test',
      '01634 100 009',
    ),
  });

  const mainKappa = createMockFirm({
    id: 'tid-e2e-admin-main-kappa',
    fca_number: 610_009,
    registered_name: 'Kappa Cover Ltd',
    created_at: '2024-02-05T12:00:00Z',
    principal: principal(
      'Kai',
      'Kent',
      'IRN-KA',
      'kai.kent@e2e-fixture.maps.test',
      '01634 100 010',
    ),
  });

  const mainLambda = createMockFirm({
    id: 'tid-e2e-admin-main-lambda',
    fca_number: 610_010,
    registered_name: 'Lambda Lines Ltd',
    created_at: '2024-02-10T12:00:00Z',
    principal: principal(
      'Leo',
      'Lane',
      'IRN-LA',
      'leo.lane@e2e-fixture.maps.test',
      '01634 100 011',
    ),
  });

  const mainMu = createMockFirm({
    id: 'tid-e2e-admin-main-mu',
    fca_number: 610_011,
    registered_name: 'Mu Mutual Ltd',
    created_at: '2024-02-15T12:00:00Z',
    principal: principal(
      'Mia',
      'Marsh',
      'IRN-MU',
      'mia.marsh@e2e-fixture.maps.test',
      '01634 100 012',
    ),
  });

  const mainNu = createMockFirm({
    id: 'tid-e2e-admin-main-nu',
    fca_number: 610_012,
    registered_name: 'Nu Nominees Ltd',
    created_at: '2024-02-20T12:00:00Z',
    principal: principal(
      'Noah',
      'Nash',
      'IRN-NU',
      'noah.nash@e2e-fixture.maps.test',
      '01634 100 013',
    ),
  });

  const mainXi = createMockFirm({
    id: 'tid-e2e-admin-main-xi',
    fca_number: 610_013,
    registered_name: 'Xi Excess Ltd',
    created_at: '2024-02-25T12:00:00Z',
    principal: principal(
      'Xena',
      'Xu',
      'IRN-XI',
      'xena.xu@e2e-fixture.maps.test',
      '01634 100 014',
    ),
  });

  return [
    mainZeta,
    mainGammaDoc,
    tradingAlphaDoc,
    mainAlphaDoc,
    mainBetaDoc,
    tradingBeta,
    mainDelta,
    mainEpsilon,
    mainEta,
    mainTheta,
    mainIota,
    mainKappa,
    mainLambda,
    mainMu,
    mainNu,
    mainXi,
  ];
}

const firmById = new Map<string, TravelInsuranceFirmDocument>();

function ensureFirmIndex(): void {
  if (firmById.size > 0) return;
  for (const f of buildCiFixtureDocuments()) {
    if (f.id) firmById.set(f.id, f);
  }
}

export function getAdminCiFixtureFirmById(
  id: string,
): TravelInsuranceFirmDocument | null {
  ensureFirmIndex();
  return firmById.get(id) ?? null;
}

export function getAdminCiFixtureMainByFca(
  fca: number,
): MainTravelInsuranceFirmDocument | null {
  const doc = buildCiFixtureDocuments().find(
    (f) => f.type === 'main' && f.fca_number === fca,
  );
  if (doc?.type !== 'main') return null;
  return doc;
}

export function getAdminDashboardCiFixtureResult(
  params: AdminSearchParams,
  page: number,
  limit: number,
): GetAllFirmsResult {
  const raw = buildCiFixtureDocuments();
  const filtered = filterDocumentsMatchingAdminCosmosWhere(raw, params);
  const ordered = orderDocumentsLikeAdminCosmosQuery(filtered, params);
  return processAdminFirmListForPage(ordered, params, page, limit);
}

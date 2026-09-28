import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import type { MainReregistrationDates } from 'lib/admin/shared/firmInheritance/firmInheritance';
import { getAdminSession } from 'lib/auth/sessionManagement';
import {
  type AdminSearchParams,
  getAllFirmsFromCosmos,
} from 'lib/firms/getAllFirmsFromCosmos';
import type {
  Principal,
  TravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';
import { parseAdminDashboardListQuery } from 'utils/query/queryHelpers';

import type { Pagination as PaginationType } from '@maps-react/utils/pagination';

export const ADMIN_DASHBOARD_ITEMS_PER_PAGE = 15;

export type AdminDashboardPageProps = {
  firms: TravelInsuranceFirmDocument[];
  pagination: PaginationType;
  search: AdminSearchParams;
  mainPrincipalByFirmId: Record<string, Principal>;
  mainRegisteredNameByFirmId: Record<string, string>;
  mainApprovedAtByFirmId: Record<string, string | null>;
  mainReregistrationByFirmId: Record<string, MainReregistrationDates>;
};

export async function loadDashboardPageProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<AdminDashboardPageProps>> {
  if (process.env.CI !== 'true') {
    const session = await getAdminSession(context, true);

    if ('redirect' in session) {
      return session;
    }
  }

  const { search, page } = parseAdminDashboardListQuery(context.query);

  const {
    firms,
    pagination,
    mainPrincipalByFirmId,
    mainRegisteredNameByFirmId,
    mainApprovedAtByFirmId,
    mainReregistrationByFirmId,
  } = await getAllFirmsFromCosmos(search, page, ADMIN_DASHBOARD_ITEMS_PER_PAGE);

  return {
    props: {
      firms: structuredClone(firms),
      pagination,
      search,
      mainPrincipalByFirmId: structuredClone(mainPrincipalByFirmId),
      mainRegisteredNameByFirmId: structuredClone(mainRegisteredNameByFirmId),
      mainApprovedAtByFirmId: structuredClone(mainApprovedAtByFirmId),
      mainReregistrationByFirmId: structuredClone(mainReregistrationByFirmId),
    },
  };
}

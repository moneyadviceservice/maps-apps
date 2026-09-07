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
  mainPrincipalByFca: Record<string, Principal>;
  mainRegisteredNameByFca: Record<string, string>;
  mainApprovedAtByFca: Record<string, string | null>;
  mainReregistrationByFca: Record<string, MainReregistrationDates>;
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
    mainPrincipalByFca,
    mainRegisteredNameByFca,
    mainApprovedAtByFca,
    mainReregistrationByFca,
  } = await getAllFirmsFromCosmos(search, page, ADMIN_DASHBOARD_ITEMS_PER_PAGE);

  return {
    props: {
      firms: structuredClone(firms),
      pagination,
      search,
      mainPrincipalByFca: structuredClone(mainPrincipalByFca),
      mainRegisteredNameByFca: structuredClone(mainRegisteredNameByFca),
      mainApprovedAtByFca: structuredClone(mainApprovedAtByFca),
      mainReregistrationByFca: structuredClone(mainReregistrationByFca),
    },
  };
}

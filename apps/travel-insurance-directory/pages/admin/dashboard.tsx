import { GetServerSideProps } from 'next';

import { FirmsTable, FirmsTableSearch } from 'components/FirmsTable';
import { AdminLayout } from 'layouts/AdminLayout';
import { getAdminSession } from 'lib/auth/sessionManagement';
import {
  type AdminSearchParams,
  getAllFirmsFromCosmos,
} from 'lib/firms/getAllFirmsFromCosmos';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import { Heading } from '@maps-react/common/components/Heading';
import Pagination from '@maps-react/common/components/Pagination';
import { Container } from '@maps-react/core/components/Container';
import { type Pagination as PaginationType } from '@maps-react/utils/pagination';

type Props = {
  userName?: string;
  userEmail?: string;
  firms: TravelInsuranceFirmDocument[];
  pagination: PaginationType;
  search: AdminSearchParams;
};

const ITEMS_PER_PAGE = 15;

const Dashboard = ({
  userName,
  userEmail,
  firms,
  pagination,
  search,
}: Props) => (
  <AdminLayout userName={userName} userEmail={userEmail}>
    <Container>
      <div className="space-y-6 py-8">
        <Heading level="h4" className="mb-8 text-blue-700">
          Travel Insurance Directory - Self service administration
        </Heading>
        <FirmsTableSearch
          principalName={search?.principalName}
          fcaNumber={search?.fcaNumber}
          firmName={search?.firmName}
        />

        <FirmsTable
          firms={firms}
          sortBy={search?.sortBy}
          sortDir={search?.sortDir}
        />

        {pagination.totalPages > 1 && (
          <div className="max-w-[740px] mx-auto">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              startIndex={pagination.startIndex}
              endIndex={pagination.endIndex}
              totalItems={pagination.totalItems}
            />
          </div>
        )}
      </div>
    </Container>
  </AdminLayout>
);

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const requireAdmin = true;
  const session = await getAdminSession(context, requireAdmin);

  if ('redirect' in session) {
    return session;
  }

  const query = context.query;

  const search: AdminSearchParams = {
    principalName:
      typeof query?.principalName === 'string' ? query.principalName : null,
    fcaNumber: typeof query?.fcaNumber === 'string' ? query.fcaNumber : null,
    firmName: typeof query?.firmName === 'string' ? query.firmName : null,
    sortBy: typeof query?.sortBy === 'string' ? query.sortBy : null,
    sortDir: query?.sortDir === 'desc' ? 'desc' : 'asc',
  };

  const page = query?.p ? Math.max(1, Number(query.p)) : 1;

  const { firms, pagination } = await getAllFirmsFromCosmos(
    search,
    page,
    ITEMS_PER_PAGE,
  );

  return {
    props: {
      userName: session.name ?? null,
      userEmail: session.username ?? null,
      firms: structuredClone(firms),
      pagination,
      search,
    },
  };
};

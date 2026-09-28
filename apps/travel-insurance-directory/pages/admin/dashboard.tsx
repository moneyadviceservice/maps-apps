import { GetServerSideProps } from 'next';

import { FirmsTable, FirmsTableSearch } from 'components/FirmsTable';
import { TravelInsuranceDirectoryPageLayout } from 'layouts/TravelInsuranceDirectoryPageLayout';
import {
  type AdminDashboardPageProps,
  loadDashboardPageProps,
} from 'lib/admin/dashboard/gssp/loadDashboardPageProps/loadDashboardPageProps';
import { ADMIN_SIGN_OUT_URL } from 'lib/auth/routes';

import { Button } from '@maps-react/common/components/Button';
import Pagination from '@maps-react/common/components/Pagination';
import { Container } from '@maps-react/core/components/Container';

type Props = AdminDashboardPageProps;

const Dashboard = ({
  firms,
  pagination,
  search,
  mainPrincipalByFirmId,
  mainRegisteredNameByFirmId,
  mainApprovedAtByFirmId,
  mainReregistrationByFirmId,
}: Props) => (
  <TravelInsuranceDirectoryPageLayout
    pageTitle="Travel Insurance Directory - Self service administration"
    title="Travel Insurance Directory - Self service administration"
    titleTag={'span'}
    noMargin={true}
    showLanguageSwitcher={false}
    headerEndSlot={
      <Button
        variant="link"
        as="a"
        href={ADMIN_SIGN_OUT_URL}
        className="text-white visited:text-white hover:text-white"
      >
        Sign out
      </Button>
    }
    mainClassName="my-8 text-gray-800"
    className="pt-8 mb-4"
  >
    <Container>
      <div className="space-y-6">
        <FirmsTableSearch
          principalName={search?.principalName}
          fcaNumber={search?.fcaNumber}
          firmName={search?.firmName}
          sortBy={search?.sortBy}
          sortDir={search?.sortDir}
        />

        <FirmsTable
          firms={firms}
          mainPrincipalByFirmId={mainPrincipalByFirmId}
          mainRegisteredNameByFirmId={mainRegisteredNameByFirmId}
          mainApprovedAtByFirmId={mainApprovedAtByFirmId}
          mainReregistrationByFirmId={mainReregistrationByFirmId}
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
  </TravelInsuranceDirectoryPageLayout>
);

export default Dashboard;

export const getServerSideProps: GetServerSideProps<Props> = (context) =>
  loadDashboardPageProps(context);

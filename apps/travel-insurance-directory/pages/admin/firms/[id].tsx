import { GetServerSideProps } from 'next';

import { FirmDetail } from 'components/FirmDetail';
import {
  loadFirmDetailPageProps,
  type FirmDetailPageProps,
} from 'lib/admin/detail/gssp/loadFirmDetailPageProps/loadFirmDetailPageProps';
import { ADMIN_SIGN_OUT_URL } from 'lib/auth/routes';

import { Button } from '@maps-react/common/components/Button';
import { Container } from '@maps-react/core/components/Container';
import { TravelInsuranceDirectoryPageLayout } from 'layouts/TravelInsuranceDirectoryPageLayout';

type Props = FirmDetailPageProps;

const FirmDetailPage = ({
  firm,
  mainFirm,
  showApproveButton,
  showHideButton,
  showReregisterButton,
  approveButtonLabel,
}: Props) => (
  <TravelInsuranceDirectoryPageLayout
    pageTitle="Travel Insurance Directory - Self service administration"
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
    mainClassName="text-gray-800"
    className="mb-4"
  >
    <Container>
      <FirmDetail
        firm={firm}
        mainFirm={mainFirm}
        showApproveButton={showApproveButton}
        showHideButton={showHideButton}
        showReregisterButton={showReregisterButton}
        approveButtonLabel={approveButtonLabel}
      />
    </Container>
  </TravelInsuranceDirectoryPageLayout>
);

export default FirmDetailPage;

export const getServerSideProps: GetServerSideProps<Props> = (context) =>
  loadFirmDetailPageProps(context);

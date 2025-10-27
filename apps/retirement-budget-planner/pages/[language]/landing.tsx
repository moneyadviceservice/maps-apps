import {
  HowRBPWorks,
  LandingHeading,
  RBPInformationCallout,
} from 'components/Landing';
import { PAGES_NAMES } from 'lib/constants/pageConstants';

import { Container } from '@maps-react/core/components/Container';
import useTranslation from '@maps-react/hooks/useTranslation';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

const Landing = () => {
  const { locale } = useTranslation();

  return (
    <ToolPageLayout>
      <Container className="-mt-4">
        <LandingHeading nextPageLink={`/${locale}/${PAGES_NAMES.ABOUTYOU}`} />
        <HowRBPWorks />
        <RBPInformationCallout />
      </Container>
    </ToolPageLayout>
  );
};

export default Landing;

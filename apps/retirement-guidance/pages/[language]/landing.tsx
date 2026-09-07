import {
  BETA_FEEDBACK_LINKS,
  PAGE_NAME_PREFIX,
  PAGE_TITLE_PREFIX,
} from 'lib/constants';

import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';
import { PhaseType } from '@maps-react/core/components/PhaseBanner';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

import { useRetirementGuidanceAnalytics } from '../../lib/hooks';

const Landing = () => {
  const { t, tList, locale } = useTranslation();

  useRetirementGuidanceAnalytics({
    pageName: `${PAGE_NAME_PREFIX}landing`,
    pageTitle: `${PAGE_TITLE_PREFIX}Landing Page`,
    toolStep: '1',
    stepName: 'Landing Page',
    fireToolStart: true,
  });

  return (
    <ToolPageLayout
      pageTitle={t('landingPage.heading')}
      phase={PhaseType.BETA}
      phaseFeedbackLink={
        locale === 'cy' ? BETA_FEEDBACK_LINKS.cy : BETA_FEEDBACK_LINKS.en
      }
    >
      <Container className="mt-4 ">
        <section className="max-w-[800px]" data-testid="landing-heading">
          <Heading
            level="h1"
            variant="secondary"
            className="text-[38px] mb-8 mt-2"
            data-testid="landing-page-heading"
          >
            {t('landingPage.heading')}
          </Heading>
          <Paragraph className="text-[24px] " testId="landing-page-paragraph">
            {t('landingPage.paragraph')}
          </Paragraph>
          <section data-testid="what-you-get" className="mt-8">
            <Heading
              level="h2"
              variant="secondary"
              className="text-[38px] mb-8 mt-2"
              data-testid="what-you-get-heading"
            >
              {t('landingPage.whatYouGetHeading')}
            </Heading>
            <Paragraph data-testid="what-you-get-description">
              {t('landingPage.whatYouGetDescription')}
            </Paragraph>
            <ListElement
              items={tList('landingPage.whatYouGetList')}
              color="blue"
              variant="unordered"
              className="pb-4 pl-2 text-[18px] list-inside "
              dataTestId="what-you-get-list"
            />
            <Paragraph
              className="pt-4 pb-4"
              data-testid="what-you-get-additional-info"
            >
              {t('landingPage.whatYouGetAdditionalInfo')}
            </Paragraph>
          </section>
          <section data-testid="how-it-works" className="mt-4">
            <Heading
              level="h2"
              variant="secondary"
              className="text-[38px] mb-8 mt-2"
              data-testid="how-it-works-heading"
            >
              {t('landingPage.howItWorksHeading')}
            </Heading>
            <Paragraph data-testid="how-it-works-description">
              {t('landingPage.howItWorksDescription')}
            </Paragraph>
            <ListElement
              items={tList('landingPage.howItWorksList')}
              color="blue"
              variant="unordered"
              className="pb-8 pl-2 text-[18px] list-inside "
              dataTestId="how-it-works-list"
            />
          </section>
          <Link
            data-testid="start-button"
            className="my-4"
            asButtonVariant="primary"
            id="submit"
            href={`/${locale}/question-1`}
          >
            {t('landingPage.startButton')}
          </Link>
          <Paragraph data-testid="completion-time" className="mt-4">
            {t('landingPage.completionTime')}
          </Paragraph>
        </section>
      </Container>
    </ToolPageLayout>
  );
};

export default Landing;

export { getServerSidePropsDefault as getServerSideProps } from '.';

import { GetServerSideProps } from 'next';

import { AboutYouForm } from 'components/about-you/AboutYouForm';
import { aboutYouCopy } from 'data/about-you';
import { JOURNEY_PAGES, journeyCopy } from 'data/journey';
import { useAboutYouForm } from 'hooks/useAboutYouForm';
import { PensionCalculatorBase } from 'layouts/PensionCalculatorBase';
import { getJourneyContext } from 'lib/getJourneyContext';
import { getAboutYouFromSession } from 'lib/session/aboutYouSession';
import { validateAboutYou } from 'lib/validation/aboutYou';
import type { AboutYouData, AboutYouErrors } from 'types/aboutYou';
import { landingPath } from 'utils/journeyPath';
import { ensureAboutYouDefaults } from 'utils/parseAboutYouForm';

import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { useTranslation } from '@maps-react/hooks/useTranslation';

type Props = {
  sessionId: string;
  language: string;
  data: AboutYouData;
  errors: AboutYouErrors;
};

const AboutYouPage = ({ sessionId, language, data, errors }: Props) => {
  const { z } = useTranslation();
  const copy = aboutYouCopy(z);
  const shared = journeyCopy(z);
  const form = useAboutYouForm({
    sessionId,
    initialData: data,
    initialErrors: errors,
  });

  return (
    <PensionCalculatorBase
      pageHeading={copy.heading}
      hasError={form.hasErrors}
      backHref={landingPath(language)}
      sectionLabel={shared.sectionProgress(JOURNEY_PAGES.ABOUT_YOU)}
      intro={copy.intro}
      pageErrors={
        form.hasErrors ? (
          <ErrorSummary
            ref={form.errorSummaryRef}
            title={form.copy.errorSummaryTitle}
            errors={form.errors}
            classNames="mb-2"
          />
        ) : null
      }
    >
      <AboutYouForm form={form} />
    </PensionCalculatorBase>
  );
};

export default AboutYouPage;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
  params,
}) => {
  const context = getJourneyContext(query, params, JOURNEY_PAGES.ABOUT_YOU);
  if ('redirect' in context) {
    return context;
  }

  const { language, sessionId } = context;
  const stored = await getAboutYouFromSession(sessionId);
  const data = ensureAboutYouDefaults(stored);
  const errors = query.error === 'true' ? validateAboutYou(data, language) : {};

  return {
    props: {
      sessionId,
      language,
      data,
      errors,
    },
  };
};

import { GetServerSideProps } from 'next';

import { AboutYouForm } from 'components/about-you/AboutYouForm';
import { aboutYouCopy } from 'data/about-you';
import { JOURNEY_PAGES, journeyCopy } from 'data/journey';
import { PensionCalculatorBase } from 'layouts/PensionCalculatorBase';
import { getJourneyContext } from 'lib/getJourneyContext';
import { getAboutYouFromSession } from 'lib/session/aboutYouSession';
import { hasAboutYouErrors, validateAboutYou } from 'lib/validation/aboutYou';
import type { AboutYouData, AboutYouErrors } from 'types/aboutYou';
import { landingPath } from 'utils/journeyPath';
import { ensureAboutYouDefaults } from 'utils/parseAboutYouForm';

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

  return (
    <PensionCalculatorBase
      pageHeading={copy.heading}
      hasError={hasAboutYouErrors(errors)}
      backHref={landingPath(language)}
      sectionLabel={shared.sectionProgress(JOURNEY_PAGES.ABOUT_YOU)}
      intro={copy.intro}
    >
      <AboutYouForm
        sessionId={sessionId}
        initialData={data}
        initialErrors={errors}
      />
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

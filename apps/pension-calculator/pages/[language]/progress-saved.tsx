import { GetServerSideProps } from 'next';

import { JOURNEY_PAGES } from 'data/journey';
import { saveCopy } from 'data/save';
import { PensionCalculatorBase } from 'layouts/PensionCalculatorBase';
import { getJourneyContext } from 'lib/getJourneyContext';
import { requireJourneyAccess } from 'lib/requireJourneyAccess';
import { firstString } from 'utils/formValue';
import { journeyPath, safeReturnTo } from 'utils/journeyPath';

import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

type Props = {
  backHref: string;
  returnHref: string;
  resendHref: string;
};

const ProgressSavedPage = ({ backHref, returnHref, resendHref }: Props) => {
  const { z } = useTranslation();
  const copy = saveCopy(z);

  return (
    <PensionCalculatorBase pageHeading={copy.savedHeading} backHref={backHref}>
      <Heading level="h3" className="mb-8">
        {copy.savedSubheading}
      </Heading>
      <Paragraph className="mt-4">{copy.savedSent}</Paragraph>
      <Paragraph className="mt-4">{copy.savedSpam}</Paragraph>
      <div className="mt-10 flex flex-col items-start gap-6 md:flex-row">
        <Link href={returnHref} asButtonVariant="primary">
          {copy.returnToProgress}
        </Link>
        <Link href={resendHref} asButtonVariant="secondary">
          {copy.resend}
        </Link>
      </div>
    </PensionCalculatorBase>
  );
};

export default ProgressSavedPage;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
  params,
}) => {
  const context = getJourneyContext(
    query,
    params,
    JOURNEY_PAGES.PROGRESS_SAVED,
  );
  if ('redirect' in context) {
    return context;
  }

  const access = await requireJourneyAccess({
    page: JOURNEY_PAGES.PROGRESS_SAVED,
    language: context.language,
    sessionId: context.sessionId,
  });
  if ('redirect' in access) {
    return access;
  }

  const returnHref = safeReturnTo(
    firstString(query.returnTo),
    context.language,
    context.sessionId,
  );

  const saveHref = journeyPath(
    context.language,
    JOURNEY_PAGES.SAVE,
    context.sessionId,
    { returnTo: returnHref },
  );

  return {
    props: {
      returnHref,
      backHref: saveHref,
      resendHref: saveHref,
    },
  };
};

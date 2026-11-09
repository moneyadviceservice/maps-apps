import { GetServerSideProps } from 'next';

import { JOURNEY_PAGES } from 'data/journey';
import {
  SAVE_EMAIL_ERROR,
  SAVE_EMAIL_ID,
  SAVE_SEND_ERROR,
  saveCopy,
} from 'data/save';
import { PensionCalculatorBase } from 'layouts/PensionCalculatorBase';
import { getJourneyContext } from 'lib/getJourneyContext';
import { requireJourneyAccess } from 'lib/requireJourneyAccess';
import { firstString } from 'utils/formValue';
import { safeReturnTo } from 'utils/journeyPath';

import { Button } from '@maps-react/common/components/Button';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { TextInput } from '@maps-react/form/components/TextInput';
import { useTranslation } from '@maps-react/hooks/useTranslation';

type Props = {
  sessionId: string;
  language: string;
  backHref: string;
  error?: typeof SAVE_EMAIL_ERROR | typeof SAVE_SEND_ERROR;
};

const SavePage = ({ sessionId, language, backHref, error }: Props) => {
  const { z } = useTranslation();
  const copy = saveCopy(z);
  let message: string | undefined;
  if (error === SAVE_SEND_ERROR) {
    message = copy.sendFailed;
  } else if (error === SAVE_EMAIL_ERROR) {
    message = copy.emailInvalid;
  }
  const fieldError = error === SAVE_EMAIL_ERROR ? message : undefined;

  return (
    <PensionCalculatorBase
      pageHeading={copy.heading}
      hasError={Boolean(error)}
      backHref={backHref}
      intro={copy.intro}
      pageErrors={
        message ? (
          <ErrorSummary
            title={copy.errorSummaryTitle}
            errors={
              error === SAVE_EMAIL_ERROR
                ? { [SAVE_EMAIL_ID]: [message] }
                : { value: [message] }
            }
          />
        ) : null
      }
    >
      <form
        className="max-w-[624px]"
        method="POST"
        action="/api/save"
        noValidate
      >
        <input type="hidden" name="language" value={language} />
        <input type="hidden" name="sessionId" value={sessionId} />
        <input type="hidden" name="returnTo" value={backHref} />
        <TextInput
          id={SAVE_EMAIL_ID}
          name={SAVE_EMAIL_ID}
          type="email"
          label={copy.emailLabel}
          containerClassName="[&_label]:font-medium"
          hint={copy.emailHint}
          error={fieldError}
          defaultValue=""
          autoComplete="email"
        />
        <Button className="mt-8" variant="primary" type="submit">
          {copy.button}
        </Button>
      </form>
    </PensionCalculatorBase>
  );
};

export default SavePage;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
  params,
}) => {
  const context = getJourneyContext(query, params, JOURNEY_PAGES.SAVE);
  if ('redirect' in context) {
    return context;
  }

  const access = await requireJourneyAccess({
    page: JOURNEY_PAGES.SAVE,
    language: context.language,
    sessionId: context.sessionId,
  });
  if ('redirect' in access) {
    return access;
  }

  const error = firstString(query.error);
  const backHref = safeReturnTo(
    firstString(query.returnTo),
    context.language,
    context.sessionId,
  );

  return {
    props: {
      sessionId: context.sessionId,
      language: context.language,
      backHref,
      ...(error === SAVE_EMAIL_ERROR || error === SAVE_SEND_ERROR
        ? { error }
        : {}),
    },
  };
};

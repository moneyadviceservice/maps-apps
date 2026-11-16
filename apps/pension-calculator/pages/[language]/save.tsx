import { GetServerSideProps } from 'next';
import { SubmitEvent, useState } from 'react';

import { JOURNEY_PAGES } from 'data/journey';
import {
  SAVE_EMAIL_ERROR,
  SAVE_EMAIL_ID,
  SAVE_SEND_ERROR,
  saveCopy,
} from 'data/save';
import { PensionCalculatorBase } from 'layouts/PensionCalculatorBase';
import { getJourneyContext } from 'lib/getJourneyContext';
import type { SaveEmailError, SaveResponse } from 'lib/handleSaveEmail';
import { requireJourneyAccess } from 'lib/requireJourneyAccess';
import { firstString } from 'utils/formValue';
import { safeReturnTo } from 'utils/journeyPath';

import { Button } from '@maps-react/common/components/Button';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { TextInput } from '@maps-react/form/components/TextInput';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { validateEmail } from '@maps-react/utils/validateEmail';

type Props = {
  sessionId: string;
  language: string;
  backHref: string;
  error?: SaveEmailError;
};

const SavePage = ({
  sessionId,
  language,
  backHref,
  error: initialError,
}: Props) => {
  const { z } = useTranslation();
  const copy = saveCopy(z);
  const [address, setAddress] = useState('');
  const [error, setError] = useState(initialError);
  const [pending, setPending] = useState(false);
  const formatInvalid = error === SAVE_EMAIL_ERROR;
  let message: string | undefined;
  if (error === SAVE_SEND_ERROR) {
    message = copy.sendFailed;
  } else if (formatInvalid) {
    message = copy.emailInvalid;
  }
  const fieldError = formatInvalid ? message : undefined;

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submittedEmail = address.trim();

    if (!validateEmail(submittedEmail)) {
      setError(SAVE_EMAIL_ERROR);
      return;
    }

    setError(undefined);
    setPending(true);

    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: submittedEmail,
          language,
          sessionId,
          returnTo: backHref,
        }),
      });
      const body = (await response.json()) as SaveResponse;

      if (body.success && body.redirectPath) {
        window.location.assign(body.redirectPath);
        return;
      }

      if (typeof body.email === 'string') {
        setAddress(body.email);
      }
      setError(
        body.error === SAVE_EMAIL_ERROR ? SAVE_EMAIL_ERROR : SAVE_SEND_ERROR,
      );
    } catch {
      setError(SAVE_SEND_ERROR);
    } finally {
      setPending(false);
    }
  };

  return (
    <PensionCalculatorBase
      pageHeading={copy.heading}
      hasError={Boolean(message)}
      backHref={backHref}
      intro={copy.intro}
      pageErrors={
        message ? (
          <ErrorSummary
            title={copy.errorSummaryTitle}
            errors={
              formatInvalid
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
        onSubmit={handleSubmit}
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
          hasErrorWrapper={Boolean(fieldError)}
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          autoComplete="email"
        />
        <Button
          className="mt-8"
          variant="primary"
          type="submit"
          disabled={pending}
        >
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

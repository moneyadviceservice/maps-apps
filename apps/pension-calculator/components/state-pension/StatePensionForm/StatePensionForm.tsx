import Head from 'next/head';

import {
  STATE_PENSION_FORECAST_URL,
  STATE_PENSION_WEEKLY_AMOUNT_ID,
  statePensionCopy,
} from 'data/state-pension';
import {
  STATE_PENSION_API,
  useStatePensionForm,
} from 'hooks/useStatePensionForm';
import type { StatePensionErrors } from 'types/statePension';

import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { MoneyInput } from '@maps-react/form/components/MoneyInput';
import { useTranslation } from '@maps-react/hooks/useTranslation';

type Props = {
  sessionId: string;
  initialWeeklyAmount: string;
  maxWeeklyAmount: string;
  initialErrors: StatePensionErrors;
};

export const StatePensionIntro = ({
  maxWeeklyAmount,
}: {
  maxWeeklyAmount: string;
}) => {
  const { z } = useTranslation();
  const copy = statePensionCopy(z, maxWeeklyAmount);

  return (
    <>
      {copy.introBefore}
      <Link
        href={STATE_PENSION_FORECAST_URL}
        target="_blank"
        rel="noopener noreferrer"
        asInlineText
        withIcon={false}
      >
        {copy.forecastLink}
      </Link>
      {copy.introAfter}
    </>
  );
};

export const StatePensionForm = ({
  sessionId,
  initialWeeklyAmount,
  maxWeeklyAmount,
  initialErrors,
}: Props) => {
  const {
    copy,
    shared,
    lang,
    weeklyAmount,
    setWeeklyAmount,
    errors,
    hasErrors,
    pageTitle,
    errorSummaryRef,
    handleContinue,
    handleSave,
  } = useStatePensionForm({
    sessionId,
    initialWeeklyAmount,
    maxWeeklyAmount,
    initialErrors,
  });
  const amountError = errors[STATE_PENSION_WEEKLY_AMOUNT_ID]?.[0];

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <form
        id="state-pension-form"
        method="POST"
        action={`${STATE_PENSION_API}?action=continue`}
        onSubmit={handleContinue}
        noValidate
        className="space-y-8"
      >
        <input type="hidden" name="language" value={lang} />
        <input type="hidden" name="sessionId" value={sessionId} />

        {hasErrors && (
          <ErrorSummary
            ref={errorSummaryRef}
            title={copy.errorSummaryTitle}
            errors={errors}
            classNames="mb-2"
          />
        )}

        <div>
          <Errors errors={amountError ? [amountError] : []}>
            <label htmlFor={STATE_PENSION_WEEKLY_AMOUNT_ID} className="sr-only">
              {copy.amountLabel}
            </label>
            {amountError && <p className="mb-2 text-red-700">{amountError}</p>}
            <MoneyInput
              id={STATE_PENSION_WEEKLY_AMOUNT_ID}
              name={STATE_PENSION_WEEKLY_AMOUNT_ID}
              value={weeklyAmount}
              onChange={(event) => setWeeklyAmount(event.target.value)}
              aria-invalid={!!amountError}
              containerClassName="w-full md:w-[270px]"
              inputClassName="w-full"
            />
          </Errors>
        </div>

        <Paragraph className="mb-0">{copy.assumption}</Paragraph>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Button variant="primary" type="submit">
            {shared.continue}
          </Button>
          <Button
            variant="link"
            formAction={`${STATE_PENSION_API}?action=save`}
            onClick={handleSave}
            iconLeft={<Icon type={IconType.BOOKMARK} />}
          >
            {shared.saveAndComeBack}
          </Button>
        </div>
      </form>
    </>
  );
};

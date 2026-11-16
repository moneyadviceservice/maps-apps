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

import { Button } from '@maps-react/common/components/Button';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { AffixInput } from '@maps-react/form/components/AffixInput';
import { useTranslation } from '@maps-react/hooks/useTranslation';

type Props = {
  form: ReturnType<typeof useStatePensionForm>;
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

export const StatePensionForm = ({ form }: Props) => {
  const {
    copy,
    shared,
    lang,
    sessionId,
    submitting,
    weeklyAmount,
    setWeeklyAmount,
    errors,
    pageTitle,
    handleContinue,
    handleSave,
  } = form;
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

        <AffixInput
          variant="money"
          id={STATE_PENSION_WEEKLY_AMOUNT_ID}
          name={STATE_PENSION_WEEKLY_AMOUNT_ID}
          label={copy.amountLabel}
          labelClassName="sr-only"
          value={weeklyAmount}
          onChange={(event) => setWeeklyAmount(event.target.value)}
          error={amountError}
          hasErrorWrapper
          containerClassName="w-full md:w-[270px]"
          inputClassName="h-[40px] w-full"
          className="h-[40px]"
        />

        <Paragraph className="mb-0">{copy.assumption}</Paragraph>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Button variant="primary" type="submit" disabled={submitting}>
            {shared.continue}
          </Button>
          <Button
            variant="link"
            formAction={`${STATE_PENSION_API}?action=save`}
            onClick={handleSave}
            disabled={submitting}
            iconLeft={<Icon type={IconType.BOOKMARK} />}
          >
            {shared.saveAndComeBack}
          </Button>
        </div>
      </form>
    </>
  );
};

import Head from 'next/head';

import { PENSIONS_API, usePensionsForm } from 'hooks/usePensionsForm';
import type { PensionStep } from 'lib/handlePensionsAction';
import type { PotsOfMoneyData, PotsOfMoneyErrors } from 'types/pensions';
import { POT_COUNT_NAME } from 'utils/pensionFieldIds';

import { Button } from '@maps-react/common/components/Button';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';

import { Contributions } from '../Contributions';
import { PotDetails } from '../PotDetails';
import { Screening } from '../Screening';

export const PensionsForm = ({
  step,
  sessionId,
  initialData,
  initialErrors,
}: {
  step: PensionStep;
  sessionId: string;
  initialData: PotsOfMoneyData;
  initialErrors: PotsOfMoneyErrors;
}) => {
  const form = usePensionsForm({ step, sessionId, initialData, initialErrors });
  const { copy, shared, lang, data, errors, hasErrors } = form;
  return (
    <>
      <Head>
        <title>{form.pageTitle}</title>
      </Head>
      <form
        method="POST"
        action={`${PENSIONS_API}?action=continue&step=${step}`}
        onSubmit={form.handleContinue}
        noValidate
        className="space-y-8"
      >
        <input
          type="hidden"
          data-testid="language"
          name="language"
          value={lang}
        />
        <input
          type="hidden"
          data-testid="sessionId"
          name="sessionId"
          value={sessionId}
        />
        <input
          type="hidden"
          data-testid="potCount"
          name={POT_COUNT_NAME}
          value={data.pots.length}
        />
        {hasErrors && (
          <ErrorSummary
            ref={form.errorSummaryRef}
            title={copy.errorSummaryTitle}
            errors={errors}
          />
        )}
        {step === 'screening' && <Screening {...form} />}
        {step === 'details' && <PotDetails {...form} />}
        {step === 'contributions' && <Contributions {...form} />}
        <div className="flex flex-col gap-4 md:flex-row">
          <Button variant="primary" type="submit">
            {shared.continue}
          </Button>
          <Button
            variant="link"
            formAction={`${PENSIONS_API}?step=${step}&action=save`}
            onClick={form.handleSave}
            iconLeft={<Icon type={IconType.BOOKMARK} />}
          >
            {shared.saveAndComeBack}
          </Button>
        </div>
      </form>
    </>
  );
};

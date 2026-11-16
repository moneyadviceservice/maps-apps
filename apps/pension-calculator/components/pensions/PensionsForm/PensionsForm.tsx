import Head from 'next/head';
import { useRouter } from 'next/navigation';

import { JOURNEY_PAGES } from 'data/journey';
import { PENSIONS_API, usePensionsForm } from 'hooks/usePensionsForm';
import type {
  DefinedIncomeData,
  DefinedIncomeErrors,
  PotsOfMoneyData,
  PotsOfMoneyErrors,
} from 'types/pensions';
import { PensionsFlow, PensionStep } from 'types/pensions/pensions';
import { journeyPath } from 'utils/journeyPath/journeyPath';
import {
  ADD_PENSION_ID,
  POT_COUNT_NAME,
  potNameId,
} from 'utils/pensionFieldIds';

import { Button } from '@maps-react/common/components/Button';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';

import { PotDetails } from '../PotDetails';
import { Screening } from '../Screening';
import { Summary } from '../Summary';

export const PensionsForm = ({
  step,
  flow,
  sessionId,
  initialData,
  initialErrors,
  formSpacing = 'space-y-8',
  displayPageErrors = true,
  submitButtonCopy,
}: {
  step: PensionStep;
  flow: PensionsFlow;
  sessionId: string;
  initialData: PotsOfMoneyData | DefinedIncomeData;
  initialErrors?: PotsOfMoneyErrors | DefinedIncomeErrors;
  formSpacing?: string;
  displayPageErrors?: boolean;
  submitButtonCopy?: string;
}) => {
  const form = usePensionsForm({
    step,
    flow,
    sessionId,
    initialData,
    initialErrors,
  });
  const router = useRouter();

  const { copy, shared, lang, data, errors, hasErrors, handleAdd } = form;

  const addHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await handleAdd(event);
    router.push(
      journeyPath(
        lang,
        JOURNEY_PAGES.POT_DETAILS,
        sessionId,
        undefined,
        `${potNameId(data.pots.length)}`,
      ),
    );
  };

  return (
    <>
      <Head>
        <title>{form.pageTitle}</title>
      </Head>
      <form
        method="POST"
        action={`${PENSIONS_API}?action=continue&step=${step}&flow=${flow}`}
        onSubmit={form.handleContinue}
        noValidate
        className={formSpacing}
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
        <input type="hidden" data-testid="flow" name="flow" value={flow} />
        {hasErrors && displayPageErrors && (
          <ErrorSummary
            ref={form.errorSummaryRef}
            title={copy.errorSummaryTitle}
            errors={errors}
          />
        )}
        {step === 'screening' && <Screening {...form} />}
        {step === 'details' && <PotDetails {...form} />}
        {step === 'summary' && (
          <Summary
            data={data}
            sessionId={sessionId}
            handleRemove={form.handleRemove}
          />
        )}
        <div className="flex flex-col gap-4 md:flex-row">
          <Button variant="primary" type="submit">
            {submitButtonCopy ?? shared.continue}
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
        {step === 'summary' && (
          <Button
            key={ADD_PENSION_ID}
            variant="secondary"
            id={ADD_PENSION_ID}
            formAction={`${PENSIONS_API}?step=details&action=add`}
            onClick={addHandler}
            className="mt-4 mb-8"
          >
            {copy.addPension}
          </Button>
        )}
      </form>
    </>
  );
};

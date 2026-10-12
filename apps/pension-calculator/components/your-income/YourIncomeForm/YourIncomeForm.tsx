import Head from 'next/head';

import { AmountFrequencyField } from 'components/your-income/AmountFrequencyField';
import { OtherIncomeRowFields } from 'components/your-income/OtherIncomeRowFields';
import { useYourIncomeForm, YOUR_INCOME_API } from 'hooks/useYourIncomeForm';
import type { YourIncomeData, YourIncomeErrors } from 'types/income';
import {
  ADD_ANOTHER_INCOME_ID,
  GROSS_PAY_FREQUENCY_ID,
  GROSS_PAY_ID,
  OTHER_INCOME_COUNT_NAME,
  OTHER_INCOME_LIST_ID,
  otherIncomeAmountId,
  otherIncomeNameId,
} from 'utils/incomeFieldIds';

import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';

type Props = {
  sessionId: string;
  initialData: YourIncomeData;
  initialErrors: YourIncomeErrors;
};

export const YourIncomeForm = ({
  sessionId,
  initialData,
  initialErrors,
}: Props) => {
  const {
    copy,
    shared,
    options,
    lang,
    data,
    errors,
    showRemove,
    showAdd,
    hasErrors,
    pageTitle,
    errorSummaryRef,
    otherIncomeHeading,
    namePlaceholder,
    handleContinue,
    handleSave,
    handleAdd,
    handleRemove,
    updateRow,
    onGrossPayChange,
    onGrossPayFrequencyChange,
  } = useYourIncomeForm({ sessionId, initialData, initialErrors });

  const grossPayError = errors[GROSS_PAY_ID]?.[0];

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <form
        id="your-income-form"
        method="POST"
        action={`${YOUR_INCOME_API}?action=continue`}
        onSubmit={handleContinue}
        noValidate
        className="space-y-8"
      >
        <input type="hidden" name="language" value={lang} />
        <input type="hidden" name="sessionId" value={sessionId} />
        <input
          type="hidden"
          name={OTHER_INCOME_COUNT_NAME}
          value={data.otherIncome.length}
        />

        {hasErrors && (
          <ErrorSummary
            ref={errorSummaryRef}
            title={copy.errorSummaryTitle}
            errors={errors}
            classNames="mb-2"
          />
        )}

        <Errors errors={grossPayError ? [grossPayError] : []}>
          <AmountFrequencyField
            amountId={GROSS_PAY_ID}
            amountName={GROSS_PAY_ID}
            amountValue={data.grossPay}
            amountLabel={copy.amountLabel}
            frequencyId={GROSS_PAY_FREQUENCY_ID}
            frequencyName={GROSS_PAY_FREQUENCY_ID}
            frequencyValue={data.grossPayFrequency}
            frequencyLabel={copy.frequencyLabel}
            frequencyOptions={options}
            legend={copy.grossPayLabel}
            legendClassName="text-4xl font-semibold text-gray-800"
            hint={copy.grossPayHint}
            error={grossPayError}
            hasError={!!grossPayError}
            onAmountChange={onGrossPayChange}
            onFrequencyChange={onGrossPayFrequencyChange}
          />
        </Errors>

        <div id={OTHER_INCOME_LIST_ID} tabIndex={-1}>
          <h2 className="text-4xl font-semibold text-gray-800">
            {copy.otherIncomeLabel}
          </h2>
          <p className="my-4 text-base font-medium leading-[1.6] tracking-[0.18px] text-gray-800">
            {copy.otherIncomeHint}
          </p>
          {data.otherIncome.map((row, index) => (
            <OtherIncomeRowFields
              key={otherIncomeNameId(index)}
              index={index}
              row={row}
              heading={otherIncomeHeading(index)}
              nameLabel={copy.nameLabel}
              namePlaceholder={namePlaceholder(index)}
              amountLabel={copy.amountLabel}
              frequencyLabel={copy.frequencyLabel}
              frequencyOptions={options}
              removeLabel={copy.remove}
              showRemove={showRemove}
              nameError={errors[otherIncomeNameId(index)]?.[0]}
              amountError={errors[otherIncomeAmountId(index)]?.[0]}
              removeFormAction={`${YOUR_INCOME_API}?action=remove&index=${index}`}
              onNameChange={(value) => updateRow(index, 'name', value)}
              onAmountChange={(value) => updateRow(index, 'amount', value)}
              onFrequencyChange={(value) =>
                updateRow(index, 'frequency', value)
              }
              onRemove={(event) => handleRemove(event, index)}
            />
          ))}
        </div>

        {showAdd && (
          <Button
            variant="secondary"
            id={ADD_ANOTHER_INCOME_ID}
            formAction={`${YOUR_INCOME_API}?action=add`}
            onClick={handleAdd}
          >
            {copy.addAnotherIncome}
          </Button>
        )}

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Button variant="primary" type="submit">
            {shared.continue}
          </Button>
          <Button
            variant="link"
            formAction={`${YOUR_INCOME_API}?action=save`}
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

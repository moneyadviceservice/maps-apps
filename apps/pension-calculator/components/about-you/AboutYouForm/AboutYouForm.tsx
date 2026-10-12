import Head from 'next/head';

import { RetirementAgeField } from 'components/about-you/RetirementAgeField';
import {
  DAY_ID,
  RETIRE_AGE_ID,
  SEX_MALE_ID,
  SEX_NAME,
} from 'data/aboutYouFieldIds';
import { ABOUT_YOU_API, useAboutYouForm } from 'hooks/useAboutYouForm';
import {
  type AboutYouData,
  type AboutYouErrors,
  SEX_FEMALE,
  SEX_MALE,
} from 'types/aboutYou';
import { toDateInputDefaultValues } from 'utils/parseAboutYouForm';

import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { DateInput } from '@maps-react/form/components/DateInput';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { QuestionRadioButton } from '@maps-react/form/components/QuestionRadioButton';

type Props = {
  sessionId: string;
  initialData: AboutYouData;
  initialErrors: AboutYouErrors;
};

export const AboutYouForm = ({
  sessionId,
  initialData,
  initialErrors,
}: Props) => {
  const {
    copy,
    shared,
    lang,
    data,
    errors,
    hasErrors,
    pageTitle,
    errorSummaryRef,
    handleContinue,
  } = useAboutYouForm({ sessionId, initialData, initialErrors });

  const dobError = errors[DAY_ID]?.[0];
  const sexError = errors[SEX_MALE_ID]?.[0];
  const retireAgeError = errors[RETIRE_AGE_ID]?.[0];
  const hasDobError = !!dobError;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <form
        id="about-you-form"
        method="POST"
        action={`${ABOUT_YOU_API}?action=continue`}
        onSubmit={handleContinue}
        noValidate
        className="space-y-4"
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

        <DateInput
          key={toDateInputDefaultValues(data)}
          showDayField
          hideLegend={false}
          legend={copy.dobLabel}
          hintText={copy.dobHint}
          defaultValues={toDateInputDefaultValues(data)}
          error={dobError}
          errorMessageId={`${DAY_ID}-error`}
          hasErrorWrapper={hasDobError}
          fieldErrors={{
            day: hasDobError,
            month: hasDobError,
            year: hasDobError,
          }}
          className="[&_legend]:text-2xl [&_legend]:font-medium [&_legend]:text-gray-800"
        />

        <Errors errors={sexError ? [sexError] : []}>
          <fieldset>
            <legend className="text-2xl font-medium text-gray-800">
              {copy.sexLabel}
            </legend>
            {sexError && (
              <p id={`${SEX_MALE_ID}-error`} className="mt-2 mb-2 text-red-700">
                {sexError}
              </p>
            )}
            <QuestionRadioButton
              key={data.sex || 'empty'}
              name={SEX_NAME}
              options={[
                { text: copy.sexMale, value: SEX_MALE },
                { text: copy.sexFemale, value: SEX_FEMALE },
              ]}
              defaultChecked={data.sex}
              horizontalLayout
              hasError={!!sexError}
              className="mt-4"
            />
          </fieldset>
        </Errors>

        <RetirementAgeField
          key={data.retireAge || 'empty'}
          label={copy.retireAgeLabel}
          hint={copy.retireAgeHint}
          suffix={copy.retireAgeSuffix}
          defaultValue={data.retireAge}
          error={retireAgeError}
        />

        <ExpandableSection
          variant="hyperlink"
          title={copy.accordionTitle}
          className="!mt-2"
        >
          <p className="mb-4 text-gray-800">{copy.intro}</p>
        </ExpandableSection>

        <Button variant="primary" type="submit">
          {shared.continue}
        </Button>
      </form>
    </>
  );
};

import { usePensionsForm } from 'hooks/usePensionsForm';
import { POT_SCREENING_ID, POT_SCREENING_NAME } from 'utils/pensionFieldIds';

import { Details } from '@maps-react/common/components/Details';
import { Errors } from '@maps-react/common/components/Errors';
import { QuestionRadioButton } from '@maps-react/form/components/QuestionRadioButton';

export const Screening = ({
  copy,
  data,
  errors,
  setData,
}: ReturnType<typeof usePensionsForm>) => (
  <>
    <Errors errors={errors[POT_SCREENING_ID]}>
      <fieldset>
        <QuestionRadioButton
          key={data.hasPotOfMoneyPension || 'empty'}
          name={POT_SCREENING_NAME}
          options={[
            { text: copy.yes, value: 'yes' },
            { text: copy.no, value: 'no' },
          ]}
          defaultChecked={data.hasPotOfMoneyPension}
          hasError={!!errors[POT_SCREENING_ID]}
          error={errors[POT_SCREENING_ID]?.[0]}
          hasErrorWrapper
          onChange={(event) =>
            setData((current) => ({
              ...current,
              hasPotOfMoneyPension: event.target.value as 'yes' | 'no',
            }))
          }
        >
          {copy.screeningQuestion}
        </QuestionRadioButton>
      </fieldset>
    </Errors>
    <Details title={copy.screeningGuidanceTitle}>
      <p>{copy.screeningGuidance}</p>
    </Details>
    <p>{copy.screeningSignpost}</p>
  </>
);

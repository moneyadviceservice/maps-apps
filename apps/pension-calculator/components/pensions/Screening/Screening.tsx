import { usePensionsForm } from 'hooks/usePensionsForm';
import {
  INCOME_SCREENING_ID,
  INCOME_SCREENING_NAME,
  POT_SCREENING_ID,
  POT_SCREENING_NAME,
} from 'utils/pensionFieldIds';

import { Details } from '@maps-react/common/components/Details';
import { Link } from '@maps-react/common/components/Link';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { QuestionRadioButton } from '@maps-react/form/components/QuestionRadioButton';

export const Screening = ({
  copy,
  pensionPotsCopyData,
  flow,
  data,
  errors,
  setData,
}: ReturnType<typeof usePensionsForm>) => {
  const isPotsOfMoney = flow === 'pots-of-money';
  const key = `${flow}-yes-no`;
  const id = isPotsOfMoney ? POT_SCREENING_ID : INCOME_SCREENING_ID;

  let value = undefined;
  if (isPotsOfMoney) {
    value =
      'hasPotOfMoneyPension' in data ? data.hasPotOfMoneyPension : undefined;
  } else if (flow === 'income-pensions') {
    value = 'hasIncomePension' in data ? data.hasIncomePension : undefined;
  }

  const setStateValue = (newValue: 'yes' | 'no') => {
    if (isPotsOfMoney) {
      setData((current) => ({
        ...current,
        hasPotOfMoneyPension: newValue,
      }));
    } else if (flow === 'income-pensions') {
      setData((current) => ({
        ...current,
        hasIncomePension: newValue,
      }));
    }
  };

  return (
    <>
      <fieldset>
        <QuestionRadioButton
          key={key || 'empty'}
          name={
            flow === 'pots-of-money'
              ? POT_SCREENING_NAME
              : INCOME_SCREENING_NAME
          }
          options={[
            { text: copy.yes, value: 'yes' },
            { text: copy.no, value: 'no' },
          ]}
          defaultChecked={value}
          hasError={!!errors[id]}
          error={errors[id]?.[0]}
          hasErrorWrapper
          onChange={(event) =>
            setStateValue(event.target.value as 'yes' | 'no')
          }
          horizontalLayout={true}
        >
          {copy.screeningQuestion}
        </QuestionRadioButton>
      </fieldset>
      <Details title={copy.screeningGuidanceTitle} className="max-w-[400px]" testID="expandable-section">
        <Paragraph>{copy.screeningGuidance}</Paragraph>
        {isPotsOfMoney && (
          <>
            <ListElement
              variant="unordered"
              items={pensionPotsCopyData.screeningGuidanceList}
              color="blue"
              className="pt-4 pb-8 pl-4 pr-8"
            />
            {pensionPotsCopyData.screeningSignpostParagraphs.map(
              (content: string) => (
                <Paragraph key={content.replaceAll(' ', '')}>
                  {content}
                </Paragraph>
              ),
            )}
            <Paragraph data-testid="p-different-p-type" className="mb-0">
              {pensionPotsCopyData.screeningDifferentPensionType}{' '}
              <Link
                href={pensionPotsCopyData.screeningDifferentPensionTypeLinkHref}
              >
                {pensionPotsCopyData.screeningDifferentPensionTypeLinkTitle}
              </Link>
              .
            </Paragraph>
          </>
        )}
      </Details>
    </>
  );
};

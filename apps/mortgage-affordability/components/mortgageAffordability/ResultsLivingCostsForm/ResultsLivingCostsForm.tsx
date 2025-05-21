import { ChangeEvent, useEffect, useState } from 'react';

import {
  ResultFieldKeys,
  resultPrefix,
  resultsContent,
} from 'data/mortgage-affordability/results';
import { ChildFormData } from 'pages/[language]/results';
import {
  calculateLeftOver,
  calculateMonthlyPayment,
} from 'utils/MortgageAffordabilityCalculator/calculateResultValues';

import { Button } from '@maps-react/common/components/Button';
import { H2 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { NumberInput } from '@maps-react/form/components/NumberInput';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { JsOnly } from '@maps-react/pension-tools/components/JsOnly';
import { RangeSlider } from '@maps-react/pension-tools/components/RangeSlider';
import { addUnitToAriaLabel } from '@maps-react/pension-tools/utils/addUnitToAriaLabel';
import { convertStringToNumber } from '@maps-react/pension-tools/utils/convertStringToNumber';
import { formatCurrency } from '@maps-react/pension-tools/utils/formatCurrency';

const keyPrefix = resultPrefix;

type Props = {
  resultData: ChildFormData;
  livingCosts: number;
  monthlyIncome: number;
  fixedAndCommittedCosts: number;
  searchQuery: string;
};

export const ResultsLivingCostsForm = ({
  resultData,
  livingCosts,
  monthlyIncome,
  fixedAndCommittedCosts,
  searchQuery,
}: Props) => {
  const { z } = useTranslation();
  const d = resultsContent(z, searchQuery);

  const [hasHydrated, setHasHydrated] = useState(false);
  const [uLivingCosts, setULivingCosts] = useState<number>(
    resultData?.[ResultFieldKeys.LIVING_COSTS] ?? livingCosts,
  );
  const [bounds, setBounds] = useState({
    lower: (resultData?.[ResultFieldKeys.LIVING_COSTS] ?? livingCosts) / 5 || 0,
    upper:
      (resultData?.[ResultFieldKeys.LIVING_COSTS] ?? livingCosts) * 2 || 500,
  });

  const handleLivingCostsInputChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const val = convertStringToNumber(event.target.value);
    if (val !== undefined) {
      setULivingCosts(val);
      setBounds({ lower: val / 5, upper: val * 2 });
    }
  };

  const handleLivingCostsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const val = convertStringToNumber(event.target.value);
    if (val !== undefined) {
      setULivingCosts(val);
    }
  };

  useEffect(() => setHasHydrated(true), []);

  const isServer = typeof window === 'undefined';

  const monthlyPayment = calculateMonthlyPayment(
    resultData[ResultFieldKeys.BORROW_AMOUNT],
    resultData[ResultFieldKeys.INTEREST],
    resultData[ResultFieldKeys.TERM],
  );

  const monthlyPaymentWithRise = calculateMonthlyPayment(
    resultData[ResultFieldKeys.BORROW_AMOUNT],
    resultData[ResultFieldKeys.INTEREST] + 3,
    resultData[ResultFieldKeys.TERM],
  );

  const leftOver = calculateLeftOver(
    monthlyIncome,
    fixedAndCommittedCosts,
    uLivingCosts,
    monthlyPayment,
  );

  const leftOverWithRise = calculateLeftOver(
    monthlyIncome,
    fixedAndCommittedCosts,
    uLivingCosts,
    monthlyPaymentWithRise,
  );

  return (
    <>
      <H2 className="mb-8 md:text-[38px] text-blue-800 pt-8 mt-8 border-t border-slate-400">
        {d.whatsLeft}
      </H2>
      {livingCosts === 0 && (
        <Paragraph className="mb-8">{d.youHeaventEnteredLiving}</Paragraph>
      )}
      <div className={`flex flex-wrap lg:flex-nowrap mb-8`}>
        <div className="mb-4">
          <label
            htmlFor={`${keyPrefix}${ResultFieldKeys.LIVING_COSTS}`}
            className={`block text-2xl mb-2`}
          >
            {d.yourEstimated}
          </label>
          <div className={'flex border rounded border-gray-400'}>
            <NumberInput
              name={`${keyPrefix}${ResultFieldKeys.LIVING_COSTS}`}
              className={'border-0 rounded'}
              value={uLivingCosts}
              onChange={handleLivingCostsInputChange}
              id={`${keyPrefix}${ResultFieldKeys.LIVING_COSTS}`}
              aria-label={addUnitToAriaLabel(d.yourEstimated, 'pounds', z)}
            />
            <span
              aria-hidden
              className="px-3 py-2 bg-gray-100 border-l border-gray-400 rounded-r text-nowrap"
            >
              per month
            </span>
          </div>
          <JsOnly>
            <RangeSlider
              name={`s-${ResultFieldKeys.LIVING_COSTS}`}
              divClasses="mt-8 sr"
              onChange={handleLivingCostsChange}
              min={bounds.lower}
              max={bounds.upper}
              value={uLivingCosts}
              aria-hidden="true"
              tab-index="-1"
            />
          </JsOnly>
          {(!hasHydrated || isServer) && (
            <Button
              className="mt-16 mb-8 place-self-start"
              variant="secondary"
              type="submit"
              name="action"
              value="recalculate-living"
              form="mortgage-affordability-calculator"
              data-testid="mac-recalculate-living-costs-nojs"
            >
              {z({
                en: 'Recalculate',
                cy: 'Ailgyfrifwch',
              })}
            </Button>
          )}
        </div>
      </div>
      <Paragraph className="mb-8">{d.theAmountYou}</Paragraph>
      <Paragraph
        className="mb-8 font-bold text-[32px]"
        data-testid="amount-left-over"
      >
        {formatCurrency(leftOver)}
      </Paragraph>
      <Paragraph className="mb-8">
        {leftOver > 0 ? d.whatsLeftSuccessText : d.whatsLeftErrorText}
      </Paragraph>
      <H2 className="mb-8 md:text-[38px] text-blue-800 pt-8 border-t border-slate-400">
        {d.whatIf}
      </H2>
      <Paragraph className="mb-8">{d.ifInterestRatesRise}</Paragraph>
      <Paragraph className="mb-8 font-bold text-[32px]">
        {formatCurrency(monthlyPaymentWithRise, 2)}
      </Paragraph>
      <Paragraph className="mb-8">{d.yourRemainingBudgetWillBe}</Paragraph>
      <Paragraph className="mb-8 font-bold text-[32px]">
        {formatCurrency(leftOverWithRise, 2)}
      </Paragraph>
    </>
  );
};

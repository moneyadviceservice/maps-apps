import { useState } from 'react';

import Head from 'next/head';

import { type FrequencyValue, parseFrequency } from 'data/frequency';
import { JOURNEY_PAGES } from 'data/journey';
import {
  RETIREMENT_INCOME_API,
  useRetirementIncomeForm,
} from 'hooks/useRetirementIncomeForm';
import {
  displayedTarget,
  formatPounds,
  SALARY_BANDS,
  salaryBandLabel,
} from 'utils/targetRetirementIncome';

import { Button } from '@maps-react/common/components/Button';
import { Callout } from '@maps-react/common/components/Callout';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Select } from '@maps-react/form/components/Select';

type Props = {
  sessionId: string;
  language: string;
  annualTarget: number;
  initialFrequency: FrequencyValue;
};

const FREQUENCY_ID = 'targetFrequency';

export const RetirementIncomeForm = ({
  sessionId,
  language,
  annualTarget,
  initialFrequency,
}: Props) => {
  const {
    copy,
    shared,
    frequencies,
    lang,
    pageTitle,
    handleContinue,
    handleSave,
  } = useRetirementIncomeForm(sessionId);
  const [frequency, setFrequency] = useState(initialFrequency);
  const amount = formatPounds(displayedTarget(annualTarget, frequency));

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Callout variant="warning" border="teal" hideIcon>
        <form
          method="get"
          action={`/${language}/${JOURNEY_PAGES.RETIREMENT_INCOME}`}
        >
          <input type="hidden" name="sessionId" value={sessionId} />
          <div>
            <Heading level="h2" className="mt-0 text-blue-700 mb-6">
              {copy.resultBefore}{' '}
              <span data-testid="target-amount">{amount}</span>
            </Heading>
            <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
              <div className="w-full max-w-[220px]">
                <Select
                  id={FREQUENCY_ID}
                  name="frequency"
                  label={copy.frequencyLabel}
                  hideLabel
                  hideEmptyItem
                  options={frequencies}
                  value={frequency}
                  onChange={(event) =>
                    setFrequency(parseFrequency(event.target.value))
                  }
                />
              </div>
              <noscript>
                <Button variant="primary" type="submit">
                  {copy.apply}
                </Button>
              </noscript>
            </div>
            <Paragraph className="mb-6">{copy.calculated}</Paragraph>
            <Paragraph>{copy.changeLater}</Paragraph>
            <ExpandableSection
              variant="hyperlink"
              title={copy.howCalculated}
              className="mb-4"
            >
              <p>{copy.howCalculatedText}</p>
              <table className="mt-4 w-full text-left">
                <caption className="sr-only">{copy.howCalculated}</caption>
                <thead>
                  <tr className="border-b border-gray-300">
                    <th scope="col" className="py-3 pr-4 font-bold">
                      {copy.salaryHeading}
                    </th>
                    <th scope="col" className="py-3 font-bold">
                      {copy.percentageHeading}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SALARY_BANDS.map((band) => (
                    <tr key={band.rate} className="border-b border-gray-300">
                      <td className="py-3 pr-4">
                        {salaryBandLabel(band, {
                          upTo: copy.upTo,
                          to: copy.to,
                          andAbove: copy.andAbove,
                        })}
                      </td>
                      <td className="py-3 font-bold">{band.rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ExpandableSection>
            <ExpandableSection variant="hyperlink" title={copy.livingCosts}>
              <p>{copy.livingCostsText}</p>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>{copy.livingCostsMortgage}</li>
                <li>{copy.livingCostsTravel}</li>
                <li>{copy.livingCostsContributions}</li>
              </ul>
            </ExpandableSection>
          </div>
        </form>
      </Callout>
      <form
        id="retirement-income-form"
        method="POST"
        action={`${RETIREMENT_INCOME_API}?action=continue`}
        onSubmit={handleContinue}
        className="mt-8"
      >
        <input type="hidden" name="language" value={lang} />
        <input type="hidden" name="sessionId" value={sessionId} />
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Button variant="primary" type="submit">
            {shared.continue}
          </Button>
          <Button
            variant="link"
            formAction={`${RETIREMENT_INCOME_API}?action=save`}
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

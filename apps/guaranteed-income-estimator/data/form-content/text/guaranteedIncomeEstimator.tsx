import { NumericFormat } from 'react-number-format';
import useTranslation from '@maps-react/hooks/useTranslation';
import { PensionPotCalculatorType } from '@maps-react/pension-tools/types';
import { Link } from '@maps-react/common/components/Link/Link';
import { ListElement } from '@maps-react/common/components/ListElement/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';

const sharedText = {
  textLine1: `Amcangyfrif yw hwn — mae'r union swm o dreth a dalwch yn dibynnu ar gyfanswm eich incwm ar gyfer y flwyddyn a'ch cyfradd treth.`,
  textLine2: 'Os ydych yn yr Alban bydd eich cyfrifiad yn wahannol.',
};

const defaults = (
  t: ReturnType<typeof useTranslation>['z'],
): PensionPotCalculatorType => {
  return {
    title: t({
      en: 'Estimate how much you could get',
      cy: 'Amcangyfrif o faint allwch chi ei gael',
    }),
    errorTitle: t({
      en: 'Unable to submit the form',
      cy: 'Methu anfon y ffurflen',
    }),
    buttonText: t({
      en: 'Calculate',
      cy: 'Cyfrifo',
    }),
    submittedButtonText: t({
      en: 'Recalculate',
      cy: 'Ailgyfrifo',
    }),
    resultsButtonText: t({
      en: 'Apply changes',
      cy: 'Gwneud newidiadau',
    }),
    resultTitle: t({
      en: 'Your results',
      cy: 'Eich canlyniadau',
    }),
  };
};

export const guaranteedIncomeEstimatorText = (
  t: ReturnType<typeof useTranslation>['z'],
): PensionPotCalculatorType => {
  return {
    ...defaults(t),
    title: t({
      en: 'Estimate how much guaranteed income you could get',
      cy: 'Amcangyfrif faint o incwm gwarantedig gallwch chi ei gael',
    }),
    calloutMessageResults: t({
      en: (
        <>
          <div>This estimate assumes:</div>
          <ListElement
            variant="unordered"
            color="dark"
            className="pt-6 pb-4 pl-10 pr-8 list-inside"
            items={[
              '25% of your pension is taken as a tax-free lump sum first and',
              'the fixed income will stop when you die, called a single-life annuity.',
            ]}
          />
        </>
      ),
      cy: (
        <>
          <div>Mae’r amcangyfrif hwn yn tybio:</div>
          <ListElement
            variant="unordered"
            color="dark"
            className="pt-6 pb-4 pl-10 pr-8 list-inside"
            items={[
              'bod 25% o’ch pensiwn yn cael ei gymryd fel cyfandaliad di-dreth yn gyntaf ac',
              'Bydd yr incwm sefydlog yn dod i ben pan fyddwch chi’n marw, a elwir yn flwydd-dal un bywyd.',
            ]}
          />
        </>
      ),
    }),
  };
};

export const SharedResultsHeading = ({
  pot,
  taxFreeLumpSum,
  text,
}: {
  pot: number;
  taxFreeLumpSum: number;
  text: string;
}) => {
  const { z } = useTranslation();
  return (
    <>
      <dt className="mb-2 font-medium">
        {z({
          en: 'Converting a pension worth',
          cy: `Gallai trosi pensiwn gwerth`,
        })}{' '}
        <NumericFormat
          value={pot}
          prefix="£"
          thousandSeparator=","
          displayType="text"
        />{' '}
        {text}
      </dt>
      <dd className="mb-4 text-4xl font-bold">
        <NumericFormat
          value={taxFreeLumpSum}
          prefix="£"
          thousandSeparator=","
          displayType="text"
        />{' '}
        {z({
          en: 'as a one-off tax-free lump sum',
          cy: 'fel cyfandaliad di-dreth untro',
        })}
      </dd>
    </>
  );
};

export const ResultsText = () => {
  const { z } = useTranslation();
  return z({
    en: (
      <>
        <Paragraph className="mt-4 text-base">
          It does not consider the effect of inflation or any Income Tax you
          might pay on the income.
        </Paragraph>
        <Paragraph className="mt-4 text-base">
          You can usually take up to 25% from each of your pensions as tax-free
          lump sums, provided the total is less than the{' '}
          <Link
            href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/tax-and-pensions/lump-sum-allowances-for-pensions"
            target="_blank"
            rel="noopener noreferrer"
            withIcon={false}
          >
            lump sum allowance(LSA).
          </Link>{' '}
          The LSA is £268,275 for most.
        </Paragraph>
        <Paragraph className="mt-4 text-base">
          This means your estimated tax-free lump sum might be lower if all your
          pensions are worth more than £1,073,100. A{' '}
          <Link
            href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/find-a-retirement-adviser"
            target="_blank"
            rel="noopener noreferrer"
            withIcon={false}
          >
            regulated financial adviser
          </Link>{' '}
          can explain the rules that apply to you.
        </Paragraph>
        <Paragraph className="mt-4 text-base">
          When you buy an annuity, you can usually choose different options –
          such as a joint-life annuity that pays an income to your dependents
          after you die. An enhanced annuity might also give you a higher income
          if you smoke or have a medical condition.
        </Paragraph>
      </>
    ),
    cy: (
      <>
        <Paragraph className="mt-4 text-base">
          Nid yw’n ystyried effaith chwyddiant nac unrhyw Dreth Incwm y gallech
          ei thalu ar yr incwm.
        </Paragraph>
        <Paragraph className="mt-4 text-base">
          Fel arfer, gallwch gymryd hyd at 25% o bob un o’ch pensiynau fel
          cyfandaliad di-dreth, ar yr amod bod y cyfanswm yn llai na’r{' '}
          <Link
            href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/tax-and-pensions/lump-sum-allowances-for-pensions"
            target="_blank"
            rel="noopener noreferrer"
            withIcon={false}
          >
            lwfans cyfandaliad (LSA)
          </Link>
          . Mae’r LSA yn £268,275 i’r rhan fwyaf.
        </Paragraph>
        <Paragraph className="mt-4 text-base">
          Mae hyn yn golygu y gallai eich swm cyfandaliad di-dreth
          amcangyfrifedig fod yn is os yw cyfanswm eich pensiynau werth mwy na
          £1,073,100. Gall{' '}
          <Link
            href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/find-a-retirement-adviser"
            target="_blank"
            rel="noopener noreferrer"
            withIcon={false}
          >
            ymgynghorydd ariannol rheoleiddiedig
          </Link>{' '}
          esbonio’r rheolau sy’n berthnasol i chi.
        </Paragraph>
        <Paragraph className="mt-4 text-base">
          Pan fyddwch chi’n prynu blwydd-dal, fel arfer gallwch ddewis gwahanol
          opsiynau - fel blwydd-dal ar y cyd sy’n talu incwm i’ch dibynyddion ar
          ôl i chi farw. Gallai blwydd-dal uwch hefyd roi incwm uwch i chi os
          ydych chi’n ysmygu neu os oes gennych chi gyflwr meddygol.
        </Paragraph>
      </>
    ),
  });
};

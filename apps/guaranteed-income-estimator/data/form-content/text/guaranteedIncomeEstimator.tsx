import { NumericFormat } from 'react-number-format';

import { Link } from '@maps-react/common/components/Link';
import useTranslation from '@maps-react/hooks/useTranslation';
import { PensionPotCalculatorType } from '@maps-react/pension-tools/types';

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
    calloutMessage: t({
      en: (
        <p>
          If the total value of your pensions, including those you’ve already
          taken money from, is close to or more than £1 million, your tax-free
          amount might be different. If you’re in this situation, it’s important
          to get regulated financial advice before you access your pension.{' '}
          <Link
            asInlineText
            target="_blank"
            withIcon={false}
            href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/find-a-retirement-adviser"
          >
            Find a retirement adviser (opens in new tab)
          </Link>
        </p>
      ),
      cy: (
        <p>
          Os yw cyfanswm gwerth eich pensiynau, gan gynnwys y rhai yr ydych
          eisoes wedi cymryd arian ohonynt, yn agos at neu’n fwy na £1 miliwn,
          gallai eich swm di-dreth fod yn wahanol. Os ydych chi yn y sefyllfa
          hon, mae’n bwysig cael cyngor ariannol wedi’i reoleiddio cyn i chi
          gael mynediad i’ch pensiwn.{' '}
          <Link
            asInlineText
            target="_blank"
            withIcon={false}
            href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/find-a-retirement-adviser"
          >
            Dewch o hyd i gynghorydd ymddeoliad (yn agor mewn tab newydd)
          </Link>
        </p>
      ),
    }),
    resultTitle: t({
      en: 'Your results',
      cy: 'Eich canlyniadau',
    }),
    calloutMessageResults: t({
      en: (
        <p>
          This is an estimate — the exact amount of tax you pay depends on your
          total income for the year and your tax rate
        </p>
      ),
      cy: (
        <ul className="list-disc pl-6">
          <li className="mb-2">{sharedText.textLine1}</li>
          <li>{sharedText.textLine2}</li>
        </ul>
      ),
    }),
  };
};

export const guaranteedIncomeEstimatorText = (
  t: ReturnType<typeof useTranslation>['z'],
): PensionPotCalculatorType => {
  return {
    ...defaults(t),
    title: t({
      en: 'Estimate how much your guaranteed income could be',
      cy: 'Amcangyfrif o faint allai eich incwm gwarantedig fod',
    }),
    calloutMessageResults: t({
      en: (
        <ul className="list-disc pl-6">
          <li className="mb-2">
            This estimate is for a single-life non-escalating annuity.
          </li>
          <li>
            You may wish to choose a joint-life annuity that pays your spouse or
            partner after you die, or an enhanced annuity which pays more if you
            smoke or have a medical condition.
          </li>
        </ul>
      ),
      cy: (
        <ul className="list-disc pl-6">
          <li className="mb-2">
            Mae hwn yn amcangyfrif ar gyfer blwydd-dal bywyd sengl.
          </li>
          <li className="mb-2">
            Efallai yr hoffech ddewis blwydd-dal cydfywyd sy’n talu’ch priod
            neu’ch partner ar ôl i chi farw, neu flwydd-dal uwch sy’n talu mwy
            os ydych yn ysmygu neu os oes gennych gyflwr meddygol.
          </li>
          <li>{sharedText.textLine2}</li>
        </ul>
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
          en: 'Based on what you’ve told us, if you use your',
          cy: `Yn seiliedig ar beth rydych wedi'i ddweud wrthym, os byddwch yn defnyddio eich cronfa bensiwn`,
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
          en: 'tax free',
          cy: 'yn ddi-dreth',
        })}
      </dd>
    </>
  );
};

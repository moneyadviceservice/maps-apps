import { Link } from '@maps-react/common/components/Link';
import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionPotCalculatorType } from '../types';

export const sharedText = {
  textLine1: `Amcangyfrif yw hwn — mae'r union swm o dreth a dalwch yn dibynnu ar gyfanswm eich incwm ar gyfer y flwyddyn a'ch cyfradd treth.`,
  textLine2: 'Os ydych yn yr Alban bydd eich cyfrifiad yn wahannol.',
};

export const pensionToolsContent = (
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

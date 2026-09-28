import { Link } from '@maps-react/common/components/Link';
import useTranslation from '@maps-react/hooks/useTranslation';
import { pensionToolsContent } from '@maps-react/pension-tools/data/pensionToolsContent';
import { PensionPotCalculatorType } from '@maps-react/pension-tools/types';

export const cashInChunksText = (
  t: ReturnType<typeof useTranslation>['z'],
): PensionPotCalculatorType => {
  return {
    ...pensionToolsContent(t),
    title: t({
      en: 'Estimate how much tax you’ll pay on a lump sum',
      cy: 'Amcangyfrif o faint o dreth byddwch chi’n ei dalu ar gyfandaliad',
    }),
    calloutMessageResults: t({
      en: (
        <>
          <p>
            This is an estimate and assumes 25% of your lump sum will be paid
            tax-free.
          </p>
          <p>
            If all your pensions are worth more than £1,073,100, you might have
            to pay more tax than we’ve estimated.
          </p>
          <p>
            This is because the{' '}
            <Link href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/tax-and-pensions/lump-sum-allowances-for-pensions">
              lump sum allowance (LSA)
            </Link>{' '}
            limits the amount of tax-free cash you can take from all your
            pensions to £268,275 for most.
          </p>
          <p>
            If you’re affected, a{' '}
            <Link href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/find-a-retirement-adviser">
              regulated financial adviser
            </Link>{' '}
            can explain the rules that apply to you.
          </p>
        </>
      ),
      cy: (
        <>
          <p>
            Amcangyfrif yw hwn ac mae’n tybio y bydd 25% o’ch cyfandaliad yn
            cael ei dalu’n ddi-dreth.
          </p>
          <p>
            Os yw eich holl bensiynau werth mwy na £1,073,100, efallai y bydd yn
            rhaid i chi dalu mwy o dreth nag yr ydym wedi’i amcangyfrif.
          </p>
          <p>
            Mae hyn oherwydd bod y{' '}
            <Link href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/tax-and-pensions/lump-sum-allowances-for-pensions">
              lwfans cyfandaliad (LSA)
            </Link>{' '}
            yn cyfyngu ar faint o arian parod di-dreth y gallwch ei gymryd o’ch
            holl bensiynau i £268,275 i’r rhan fwyaf.
          </p>
          <p>
            Os yw hyn yn effeithio arnoch, gall{' '}
            <Link href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/find-a-retirement-adviser">
              ymgynghorydd ariannol rheoleiddiedig
            </Link>{' '}
            esbonio’r rheolau sy’n berthnasol i chi.
          </p>
        </>
      ),
    }),
  };
};

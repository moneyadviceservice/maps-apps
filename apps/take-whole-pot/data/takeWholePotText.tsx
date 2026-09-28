import { Link } from '@maps-react/common/components/Link';
import useTranslation from '@maps-react/hooks/useTranslation';
import {
  pensionToolsContent,
  sharedText,
} from '@maps-react/pension-tools/data/pensionToolsContent';
import { PensionPotCalculatorType } from '@maps-react/pension-tools/types';

export const takeWholePotText = (
  t: ReturnType<typeof useTranslation>['z'],
): PensionPotCalculatorType => {
  return {
    ...pensionToolsContent(t),
    title: t({
      en: 'Estimate the tax you’ll pay to take your pension in one go',
      cy: 'Amcangyfrif o’r dreth byddwch chi’n ei dalu i gymryd eich pensiwn cyfan mewn un tro',
    }),
    calloutMessageResults: t({
      en: (
        <ul className="pl-6 list-disc">
          <li className="mb-2">
            This is an estimate and assumes 25% of your pension will be paid
            tax-free.
          </li>
          <li className="mb-2">
            If all your pensions are worth more than £1,073,100, you might have
            to pay more tax than we’ve estimated.
          </li>
          <li className="mb-2">
            This is because the{' '}
            <Link href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/tax-and-pensions/lump-sum-allowances-for-pensions">
              lump sum allowance (LSA)
            </Link>{' '}
            limits the amount of tax-free cash you can take from all your
            pensions to £268,275 for most.
          </li>
          <li className="mb-2">
            If you’re affected, a{' '}
            <Link href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/find-a-retirement-adviser">
              regulated financial adviser
            </Link>{' '}
            can explain the rules that apply to you.
          </li>
        </ul>
      ),
      cy: (
        <ul className="pl-6 list-disc">
          <li className="mb-2">{sharedText.textLine1}</li>
          <li className="mb-2">{sharedText.textLine2}</li>
          <li className="mb-2">
            Mae hyn oherwydd bod y{' '}
            <Link href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/tax-and-pensions/lump-sum-allowances-for-pensions">
              lwfans cyfandaliad (LSA)
            </Link>{' '}
            yn cyfyngu ar faint o arian parod di-dreth y gallwch ei gymryd o’ch
            holl bensiynau i £268,275 i’r rhan fwyaf.
          </li>
          <li className="mb-2">
            Os yw hyn yn effeithio arnoch, gall{' '}
            <Link href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/find-a-retirement-adviser">
              ymgynghorydd ariannol rheoleiddiedig
            </Link>{' '}
            esbonio’r rheolau sy’n berthnasol i chi.
          </li>
        </ul>
      ),
    }),
  };
};

import { Question } from '@maps-react/form/types';
import useTranslation from '@maps-react/hooks/useTranslation';
import { pensionToolsContent } from '@maps-react/pension-tools/data/pensionToolsContent';
import {
  ageInput,
  monthUpdateInput,
  potInput,
} from '@maps-react/pension-tools/data/pensionToolsFormContent';
import { PensionPotCalculatorType } from '@maps-react/pension-tools/types';
import { Link } from '@maps-react/common/components/Link';

export const getAjustableIncomeText = (
  t: ReturnType<typeof useTranslation>['z'],
): PensionPotCalculatorType => {
  return {
    ...pensionToolsContent(t),
    calloutMessageResults: t({
      en: (
        <>
          <p>This estimate assumes:</p>
          <ul className="pl-6 list-disc">
            <li>25% of your pension is taken as a tax-free lump sum first</li>
            <li>your invested pension grows around 3% per year.</li>
          </ul>
          <p>
            It does not consider the effect of inflation or any Income Tax you
            might pay on the income.
          </p>
          <p>
            If all your pensions are worth more than £1,073,100, you might get a
            lower tax-free lump sum than we’ve estimated.
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
          <p>Mae’r amcangyfrif hwn yn tybio:</p>
          <ul className="pl-6 list-disc">
            <li>
              bod 25% o’ch pensiwn yn cael ei gymryd fel cyfandaliad di-dreth yn
              gyntaf
            </li>
            <li>bod eich pensiwn a fuddsoddwyd yn tyfu tua 3% y flwyddyn.</li>
          </ul>
          <p>
            Nid yw’n ystyried effaith chwyddiant nac unrhyw Dreth Incwm y
            gallech ei thalu ar yr incwm.
          </p>
          <p>
            Os yw eich holl bensiynau werth mwy na £1,073,100, efallai y byddwch
            yn cael cyfandaliad di-dreth is nag yr ydym wedi’i amcangyfrif.
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

export const getAdjustableIncomeContent = (
  z: ReturnType<typeof useTranslation>['z'],
): Question[] => {
  const pot = potInput(1, z);
  const age = ageInput(2, z);
  return [
    {
      ...pot,
      errors: {
        ...pot.errors,
        max: z({
          en: 'Amount must be less than £5,000,000',
          cy: `Mae'n rhaid i'r swm fod yn llai na £5,000,000`,
        }),
      },
    },
    {
      ...age,
      errors: {
        min: z({
          en: 'Enter the age you’d like to retire, from 55 to 99',
          cy: `Rhowch yr oedran yr hoffech chi ymddeol, o 55 i 99 oed`,
        }),
        max: z({
          en: 'Enter the age you’d like to retire, from 55 to 99',
          cy: `Rhowch yr oedran yr hoffech chi ymddeol, o 55 i 99 oed`,
        }),
      },
    },
    {
      ...monthUpdateInput(3, z),
      title: z({
        en: 'See how long your pension would last if you take more or less each month:',
        cy: 'Gweler pa mor hir gallai eich pensiwn para os ydych chi’n cymryd mwy neu lai bob mis:',
      }),
    },
  ];
};

import { ReactNode } from 'react';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';

export const expandableContentMap: Record<
  string,
  (z: (arg: { en: ReactNode; cy: ReactNode }) => ReactNode) => ReactNode
> = {
  grossIncome: (z) =>
    z({
      en: (
        <Paragraph className="text-[16px]">
          Gross income is your salary before anything else is taken out. It is
          not your take home pay.
        </Paragraph>
      ),
      cy: (
        <Paragraph className="text-[16px]">
          Incwm gros yw eich cyflog cyn i unrhyw beth arall gael ei gymryd
          allan. Nid yw&apos;n eich cyflog mynd adref.
        </Paragraph>
      ),
    }),
  personalAllowance: (z) =>
    z({
      en: (
        <>
          <Paragraph className="text-[16px]">
            Personal allowance is the amount you can earn before tax is taken
            from your gross income, find out more about how this works at{' '}
            <Link
              href="https://www.moneyhelper.org.uk/en/work/employment/how-income-tax-and-personal-allowance-works"
              target="_blank"
              asInlineText
              withIcon={false}
            >
              Moneyhelper
            </Link>
            .
          </Paragraph>
          <Paragraph className="text-[16px]">
            {' '}
            <strong>More about personal allowances:</strong> If you’re married
            or in a civil partnership, you could look to boost your personal
            allowance with the{' '}
            <Link
              href="https://www.moneyhelper.org.uk/en/work/employment/marriage-and-married-couples-allowance"
              target="_blank"
              asInlineText
              withIcon={false}
            >
              Marriage Allowance
            </Link>
            .
          </Paragraph>
        </>
      ),
      cy: (
        <>
          <Paragraph>
            Lwfans personol yw&apos;r swm y gallwch ei ennill cyn i dreth gael
            ei chymryd o&apos;ch incwm gros, darganfyddwch fwy am sut mae hyn yn
            gweithio yn{' '}
            <Link
              href="https://www.moneyhelper.org.uk/cy/work/employment/how-income-tax-and-personal-allowance-works"
              target="_blank"
              asInlineText
              withIcon={false}
            >
              HelpwrArian
            </Link>
            .
          </Paragraph>
          <Paragraph>
            <strong>Mwy am lwfansau personol:</strong> Os ydych chi&apos;n briod
            neu mewn partneriaeth sifil, gallech edrych i roi hwb i&apos;ch
            lwfans personol gyda&apos;r{' '}
            <Link
              href="https://www.moneyhelper.org.uk/cy/work/employment/marriage-and-married-couples-allowance"
              target="_blank"
              asInlineText
              withIcon={false}
            >
              Lwfans Priodas
            </Link>
            .
          </Paragraph>
        </>
      ),
    }),
  incomeTax: (z) =>
    z({
      en: (
        <Paragraph className="text-[16px]">
          Usually, HMRC will update your tax code when your income changes. They
          get this information from your employer. If there is a delay or some
          information is missing, you might be put on an emergency tax code.
          Here’s{' '}
          <Link
            href="https://www.gov.uk/tax-codes/emergency-tax-codes"
            target="_blank"
            asInlineText
            withIcon={false}
          >
            what to do if you’re on an emergency tax code
          </Link>
          .
        </Paragraph>
      ),
      cy: (
        <Paragraph className="text-[16px]">
          Fel arfer, bydd CThEF yn diweddaru eich cod treth pan fydd eich incwm
          yn newid. Maen nhw&apos;n cael y wybodaeth hon gan eich cyflogwr. Os
          oes oedi neu os oes rhywfaint o wybodaeth ar goll, efallai y cewch
          eich rhoi ar god treth brys. Dyma{' '}
          <Link
            href="https://www.gov.uk/tax-codes/emergency-tax-codes"
            target="_blank"
            asInlineText
            withIcon={false}
          >
            beth i&apos;w wneud os ydych chi ar god treth brys
          </Link>
          .
        </Paragraph>
      ),
    }),
};

import { ExpandableContainerProps } from 'components/ExpandableContainer';
import { TeaserCardParentProps } from 'components/TeaserCardParent';
import TwoMenWithBaby from 'public/teaser-card-images/two-men-with-baby.jpg';
import WomanWalkingWithKids from 'public/teaser-card-images/woman-walking-with-two-children-carrying-bag-between-them.jpg';

import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';

interface AdditionalContent {
  recommendedReading: ExpandableContainerProps;
  otherTools: TeaserCardParentProps;
  shareToolContent: {
    title: string;
  };
}

export const additionalContent = (
  z: ReturnType<typeof useTranslation>['z'],
): AdditionalContent => {
  return {
    recommendedReading: {
      heading: z({
        en: 'Recommended reading',
        cy: 'Awgrymiadau darllen',
      }),
      items: [
        {
          title: z({
            en: "Benefits you can get while you're pregnant",
            cy: 'Budd-daliadau y gallwch eu cael tra rydych yn feichiog',
          }),
          text: z({
            en: (
              <>
                Help is available when you&apos;re pregnant or have a baby. Make
                sure you&apos;re{' '}
                <Link href="https://www.moneyhelper.org.uk/en/benefits/benefits-if-you-have-children/benefits-and-entitlements-to-claim-when-you-have-a-baby">
                  {' '}
                  getting everything you&apos;re entitled to.
                </Link>
              </>
            ),
            cy: (
              <>
                Mae cymorth ar gael pan fyddwch yn feichiog neu&apos;n cael
                babi.{' '}
                <Link href="https://www.moneyhelper.org.uk/cy/benefits/benefits-if-you-have-children/benefits-and-entitlements-to-claim-when-you-have-a-baby">
                  {' '}
                  Gwnewch yn siŵr eich bod yn cael popeth y mae gennych hawl
                  iddo.
                </Link>
              </>
            ),
          }),
        },
        {
          title: z({
            en: 'Start saving for your baby',
            cy: 'Dechreuwch gynilo ar gyfer eich babi',
          }),
          text: z({
            en: (
              <>
                Build up savings for unexpected expenses and childcare, which
                can be expensive. Putting{' '}
                <Link href="https://www.moneyhelper.org.uk/en/savings/how-to-save/getting-into-the-savings-habit">
                  aside a little each month
                </Link>{' '}
                can help manage lower income during childcare.
              </>
            ),
            cy: (
              <>
                Cynilwch ar gyfer costau annisgwyl a gofal plant, a all fod yn
                ddrud. Gall rhoi{' '}
                <Link href="https://www.moneyhelper.org.uk/cy/savings/how-to-save/getting-into-the-savings-habit">
                  ychydig o&apos;r neilltu bob mis
                </Link>{' '}
                helpu i reoli incwm is yn ystod gofal plant.
              </>
            ),
          }),
        },
        {
          title: z({
            en: 'Get help with childcare costs',
            cy: 'Cael help gyda chostau gofal plant',
          }),
          text: z({
            en: (
              <>
                Childcare can be expensive. Learn{' '}
                <Link href="https://www.moneyhelper.org.uk/en/family-and-care/becoming-a-parent/childcare-costs">
                  how much it might cost and what help you can get.
                </Link>
              </>
            ),
            cy: (
              <>
                Gall gofal plant fod yn ddrud. Dysgwch{' '}
                <Link href="https://www.moneyhelper.org.uk/cy/family-and-care/becoming-a-parent/childcare-costs">
                  faint y gallai ei gostio a pha gymorth y gallwch ei gael.
                </Link>
              </>
            ),
          }),
        },
      ],
    },
    otherTools: {
      heading: z({
        en: 'Other tools to try',
        cy: 'Teclynnau eraill i roi cynnig arnynt',
      }),
      target: '_blank',
      items: [
        {
          title: z({
            en: 'Budget planner',
            cy: 'Cynllunydd cyllideb',
          }),
          description: z({
            en: "Get in control of your household spending to help you see where your money's going.",
            cy: "Cymerwch reolaeth dros wariant eich cartref i'ch helpu i weld i ble mae'ch arian yn mynd.",
          }),
          href: z({
            en: 'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner',
            cy: 'https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/budget-planner',
          }),
          headingLevel: 'h2',
          image: WomanWalkingWithKids,
        },
        {
          title: z({
            en: 'Baby money timeline',
            cy: 'Llinell amser arian babi',
          }),
          description: z({
            en: 'Find out important dates for things like maternity leave, free NHS prescriptions and dental care, plus more, based on your due date.',
            cy: "Darganfyddwch ddyddiadau pwysig ar gyfer pethau fel absenoldeb mamolaeth, presgripsiynau'r GIG am ddim a gofal deintyddol, ynghyd â mwy, yn seiliedig ar y dyddiad y mae disgwyl i'ch babi gael ei eni.",
          }),
          href: z({
            en: 'https://www.moneyhelper.org.uk/en/family-and-care/becoming-a-parent/baby-money-timeline',
            cy: 'https://www.moneyhelper.org.uk/cy/family-and-care/becoming-a-parent/baby-money-timeline',
          }),
          headingLevel: 'h2',
          image: TwoMenWithBaby,
        },
      ],
    },
    shareToolContent: {
      title: z({
        en: 'Share this calculator',
        cy: 'Rhannwch yr offeryn hwn',
      }),
    },
  };
};

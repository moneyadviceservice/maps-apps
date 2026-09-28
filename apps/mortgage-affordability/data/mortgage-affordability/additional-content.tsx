import { ExpandableContainerProps } from '@maps-react/pension-tools/components/ExpandableContainer';
import { TeaserCardParentProps } from '@maps-react/pension-tools/components/TeaserCardParent';
import ManHoldingMobilePhoneLaughing from 'public/images/teaser-card-images/man-holding-mobile-laughing.jpg';
import TwoChildrenWithBubbles from 'public/images/teaser-card-images/two-children-with-bubbles.jpg';

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
            en: 'Mortgage repayment calculator',
            cy: 'Cyfrifiannell ad-daliad morgais',
          }),
          description: z({
            en: "This gives you a guide to how much you'd pay each month on a mortgage.",
            cy: 'Mae hyn yn rhoi canllaw i chi faint rydych yn ei dalu bob mis ar forgais.',
          }),
          href: z({
            en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/mortgage-calculator',
            cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/mortgage-calculator',
          }),
          image: ManHoldingMobilePhoneLaughing,
        },
        {
          title: z({
            en: 'Stamp Duty Calculator',
            cy: 'Cyfrifiannell Treth Stamp',
          }),
          description: z({
            en: 'Calculate the Stamp Duty on your new property.',
            cy: 'Cyfrifwch y Dreth Stamp ar eich eiddo newydd.',
          }),
          href: z({
            en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/stamp-duty-calculator',
            cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/stamp-duty-calculator',
          }),
          image: TwoChildrenWithBubbles,
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

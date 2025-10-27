import { ReactNode } from 'react';

import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export type LandingProps = {
  title: string;
  intro: ReactNode;
  action: {
    actionLink: string;
    actionText: string;
    actionButton: string;
  }[];
  className?: string;
};

export const landingContent = (
  z: ReturnType<typeof useTranslation>['z'],
): LandingProps => {
  return {
    title: z({
      en: 'Savings calculator',
      cy: 'Cyfrifiannell Cynilo',
    }),
    intro: z({
      en: (
        <Paragraph>
          Are you saving for a future bill? A new TV or car? Or just to have a
          bit in the bank? The calculator can help you understand how long it
          will take to save a specific amount,{' '}
          <span className="font-semibold">or</span> how much you need to save to
          have enough by a particular date.
        </Paragraph>
      ),
      cy: (
        <Paragraph>
          A ydych yn cynilo ar gyfer bil yn y dyfodol? Teledu neu gar newydd?
          Neu dim ond i gael ychydig yn y banc? Gall yr offeryn hwn eich helpu i
          ddeall faint o amser fydd yn cymryd i gynilo swm penodol,{' '}
          <span className="font-semibold">neu</span> faint fydd angen ichi
          gynilo i gael digon erbyn dyddiad neilltuol.
        </Paragraph>
      ),
    }),
    action: [
      {
        actionLink: z({
          en: '/how-long',
          cy: '/how-long',
        }),
        actionText: z({
          en: 'Know how much you want to save, but not sure how long it will take?',
          cy: 'Faint o amser y bydd yn ei gymryd i gynilo fy swm fy nod?',
        }),
        actionButton: z({
          en: 'Calculate',
          cy: 'Cyfrifwch',
        }),
      },
      {
        actionLink: z({
          en: '/how-much',
          cy: '/how-much',
        }),
        actionText: z({
          en: 'Know when you need your savings and want to see how much you need to save regularly?',
          cy: 'Faint sydd angen i mi gynilo bob wythnos/mis i gyrraedd swm fy nod?',
        }),
        actionButton: z({
          en: 'Calculate',
          cy: 'Cyfrifwch',
        }),
      },
    ],
  };
};

export const pageData = (z: ReturnType<typeof useTranslation>['z']) => {
  return {
    title: z({
      en: 'Savings Calculator - Work out your monthly savings and interest payments',
      cy: `Cyfrifiannell Cynilo - Cyfrifwch eich cynilion a'ch taliadau llog misol - Y Gwasanaeth Cynghori Ariannol`,
    }),
  };
};

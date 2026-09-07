import { ReactNode } from 'react';

import { H2, Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export type LandingProps = {
  intro: ReactNode;
  actionLink: string;
  actionButton: string;
  className?: string;
};

export const landingContent = (
  z: ReturnType<typeof useTranslation>['z'],
): LandingProps => {
  return {
    intro: z({
      en: (
        <>
          <Heading level="h1" className="mb-8 md:text-6xl">
            All your baby dates in one place
          </Heading>
          <Paragraph className="text-lg">
            This timeline lists important money-related dates from arranging
            your maternity leave to claiming benefits, so you can focus on
            welcoming your little one.
          </Paragraph>
          <H2 className="my-8 text-5xl text-blue-700">
            What is your baby’s due date?{' '}
          </H2>
          <Paragraph className="text-lg">
            Tell us your baby’s due date and get a full personalised timeline
            for your pregnancy and beyond.{' '}
            <span className="font-bold">Don’t know your due date?</span> Just
            click on ‘Continue’ and you’ll get a timeline starting from today.
          </Paragraph>
        </>
      ),
      cy: (
        <>
          <Heading level="h1" className="mb-8 md:text-6xl">
            Eich holl ddyddiadau arian babi mewn un lle
          </Heading>
          <Paragraph className="text-lg">
            Mae’r amserlen yn rhestri dyddiadau pwysig sy’n ymwneud ag arian o
            drefnu eich absenoldeb mamolaeth i wneud cais am fudd-daliadau,
            felly gallwch chi ganolbwyntio ar groesawu aelod newydd y teulu.
          </Paragraph>
          <Paragraph className="text-lg">
            Mae’n cwmpasu popeth o drefnu eich absenoldeb mamolaeth i fynd i
            siopa am bethau i’r baban a hawlio Budd-dal Plentyn.
          </Paragraph>
          <H2 className="my-8 text-5xl text-blue-700">
            Beth yw dyddiad disgwyl eich babi?
          </H2>
          <Paragraph className="text-lg">
            Dywedwch ddyddiad disgwyl eich babi wrthym a chewch amserlen
            bersonol llawn ar gyfer eich beichiogrwydd a thu hwnt.{' '}
            <span className="font-bold">
              Ddim yn gwybod eich dyddiad disgwyl?
            </span>{' '}
            Cliciwch ar ‘Parhau’ a chewch amserlen yn dechrau o heddiw.
          </Paragraph>
        </>
      ),
    }),
    actionLink: '/baby-money-timeline/1',
    actionButton: z({
      en: 'Continue',
      cy: 'Parhau',
    }),
  };
};

export const pageData = (z: ReturnType<typeof useTranslation>['z']) => {
  return {
    title: z({
      en: 'Baby money timeline',
      cy: 'Llinell amser arian babi',
    }),
  };
};

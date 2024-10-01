import { useTranslation } from '@maps-react/hooks/useTranslation';
import { H2, Heading, Paragraph } from '@maps-digital/shared/ui';
import {
  getDayOptions,
  getMonthOptions,
  getYearOptions,
} from 'data/form-content/questions/savings-calculator';
import { ReactNode } from 'react';

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
            So many things to do and dates to remember…
          </Heading>
          <Paragraph className="text-lg">
            This baby money timeline lists all of the money-related dates to do
            with your pregnancy and new baby. It covers everything from
            arranging your maternity leave to going shopping for baby things and
            claiming Child Benefit.
          </Paragraph>
          <H2 className="text-blue-800 my-8 text-5xl">Tell us your due date</H2>
          <Paragraph className="text-lg">
            Select your baby’s due date from the dropdown menu and get a full
            personalised timeline for your pregnancy and beyond.{' '}
            <span className="font-bold">Don’t know your due date?</span> Just
            click on ‘Continue’ and you’ll get a timeline starting from today.
          </Paragraph>
        </>
      ),
      cy: (
        <>
          <Heading level="h1" className="mb-8 md:text-6xl">
            Cymaint o bethau i’w gwneud a dyddiadau i’w cofio...
          </Heading>
          <Paragraph className="text-lg">
            Mae’r llinell amser Arian Babi hwn yn rhestru’r holl ddyddiadau
            cysylltiedig ag arian sy’n berthnasol i’ch beichiogrwydd a baban
            newydd.
          </Paragraph>
          <Paragraph className="text-lg">
            Mae’n cwmpasu popeth o drefnu eich absenoldeb mamolaeth i fynd i
            siopa am bethau i’r baban a hawlio Budd-dal Plentyn.
          </Paragraph>
          <H2 className="text-blue-800 my-8 text-5xl">
            Beth yw eich dyddiad genedigaeth disgwyliedig?
          </H2>
          <Paragraph className="text-lg">
            Dewiswch ddyddiad genedigaeth disgwyliedig eich baban o’r gwymplen i
            gael llinell amser lawn bersonol i chi ar gyfer eich beichiogrwydd a
            thu hwnt.{' '}
            <span className="font-bold">
              Ddim yn gwybod beth yw eich dyddiad disgwyliedig?
            </span>{' '}
            Cliciwch ar ‘Mynd’ a byddwch yn cael llinell amser yn dechrau
            heddiw.
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
      en: 'Baby Money Timeline',
      cy: `Llinell amser ariannol babi`,
    }),
  };
};

export const babyMoneyTimelineDate = (
  z: ReturnType<typeof useTranslation>['z'],
) => {
  const currentDate = new Date();
  const getLastFiveYears = currentDate.getFullYear() - 5;
  const months = getMonthOptions(z);
  const days = getDayOptions();
  const years = getYearOptions(new Date(`${getLastFiveYears}-01-01`), 30);

  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 8);
  futureDate.setDate(futureDate.getDate() + 10);

  const defaultDay = futureDate.getDate().toString();
  const defaultMonth = futureDate.getMonth().toString();
  const defaultYear = futureDate.getFullYear().toString();

  return [
    {
      label: z({
        en: 'Day',
        cy: 'Dydd',
      }),
      name: 'day',
      id: 'day',
      options: days,
      ariaLabel: z({
        en: 'Day',
        cy: 'Dydd',
      }),
      defaultValue: defaultDay,
    },
    {
      label: z({
        en: 'Month',
        cy: 'Mis',
      }),
      name: 'month',
      id: 'month',
      options: months,
      ariaLabel: z({
        en: 'Month',
        cy: 'Mis',
      }),
      defaultValue: defaultMonth,
    },
    {
      label: z({
        en: 'Year',
        cy: 'Blwyddyn',
      }),
      name: 'year',
      id: 'year',
      options: years,
      ariaLabel: z({
        en: 'Year',
        cy: 'Blwyddyn',
      }),
      defaultValue: defaultYear,
    },
  ];
};

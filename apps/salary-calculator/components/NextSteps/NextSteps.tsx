import { H1, H2 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { GridContainer } from '@maps-react/core/components/GridContainer';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import type { SalaryData } from '../ResultsSingleSalary';

interface NextStepsProps {
  salary1: SalaryData;
  salary2?: SalaryData;
}

export const NextSteps: React.FC<NextStepsProps> = ({ salary1, salary2 }) => {
  const { z } = useTranslation();

  const incomes = [
    Number(salary1?.grossIncome),
    salary2 ? Number(salary2.grossIncome) : undefined,
  ].filter(Number.isFinite);

  const isBelowThreshold = incomes.every(
    (income) => income !== undefined && income <= 37430,
  );

  const isOverStatePensionAge =
    !!salary1.isOverStatePensionAge || !!salary2?.isOverStatePensionAge;

  const isBlindPerson = !!salary1.isBlindPerson || !!salary2?.isBlindPerson;

  // Main sections
  const mainSections = [
    {
      key: 'manageMoney',
      heading: { en: 'Manage your money', cy: 'Rheoli eich arian' },
      content: {
        en: (
          <>
            Now you’ve seen your take home pay, learn how making a budget or
            reviewing your pension can pay off in our{' '}
            <Link
              href="https://www.moneyhelper.org.uk/en/everyday-money/budgeting/beginners-guide-to-managing-your-money"
              target="_blank"
              asInlineText
              withIcon={false}
            >
              Managing your money
            </Link>{' '}
            guide.
          </>
        ),
        cy: (
          <>
            Nawr eich bod wedi gweld eich cyflog i lawr, dysgwch sut mae gwneud
            cyllideb neu adolygu eich pensiwn yn gallu bod o fudd yn ein{' '}
            <Link
              href="https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/beginners-guide-to-managing-your-money"
              target="_blank"
              asInlineText
              withIcon={false}
            >
              Canllaw Rheoli eich arian
            </Link>
            .
          </>
        ),
      },
    },
    {
      key: 'costOfLiving',
      heading: {
        en: 'Get help with the cost of living',
        cy: 'Cymorth gyda chostau byw',
      },
      content: {
        en: (
          <>
            Even if your pay has gone up, the cost of everyday essentials has
            been rising too. Find{' '}
            <Link
              href="https://www.moneyhelper.org.uk/en/money-troubles/cost-of-living"
              target="_blank"
              asInlineText
              withIcon={false}
            >
              ways to tackle the cost of living
            </Link>
            , as well as the extra support you can claim.
          </>
        ),
        cy: (
          <>
            Hyd yn oed os yw eich cyflog wedi codi, mae costau nwyddau bob dydd
            wedi codi hefyd. Dewch o hyd i{' '}
            <Link
              href="https://www.moneyhelper.org.uk/cy/money-troubles/cost-of-living"
              target="_blank"
              asInlineText
              withIcon={false}
            >
              ffyrdd o ddelio â chostau byw
            </Link>
            , yn ogystal â’r cymorth ychwanegol y gallwch ei hawlio.
          </>
        ),
      },
    },
    {
      key: 'savings',
      heading: { en: 'Look at your savings', cy: 'Edrychwch ar eich arbedion' },
      content: {
        en: (
          <>
            When you know your take home pay you can see if there’s room to
            start saving. Find out{' '}
            <Link
              href="https://www.moneyhelper.org.uk/en/savings/how-to-save/getting-into-the-savings-habit"
              target="_blank"
              asInlineText
              withIcon={false}
            >
              why it’s a good idea to save
            </Link>{' '}
            regularly and the saving options available to you.
          </>
        ),
        cy: (
          <>
            Pan fyddwch yn gwybod eich cyflog i lawr, gallwch weld a oes modd
            dechrau arbed. Dysgwch{' '}
            <Link
              href="https://www.moneyhelper.org.uk/cy/savings/how-to-save/getting-into-the-savings-habit"
              target="_blank"
              asInlineText
              withIcon={false}
            >
              pam ei bod yn syniad da arbed yn rheolaidd
            </Link>{' '}
            a’r opsiynau arbed sydd ar gael i chi.
          </>
        ),
      },
    },
    {
      key: 'pension',
      heading: { en: 'Save into a pension', cy: 'Arbedwch mewn pensiwn' },
      content: {
        en: (
          <>
            Retirement might feel like a long way off while you’re working, but
            it’s a good idea to start thinking about your pension. Find out{' '}
            <Link
              href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/why-save-into-a-pension"
              target="_blank"
              asInlineText
              withIcon={false}
            >
              about saving into a pension
            </Link>
            .
          </>
        ),
        cy: (
          <>
            Efallai y bydd ymddeol yn ymddangos yn bell i ffwrdd tra byddwch yn
            gweithio, ond mae’n syniad da dechrau meddwl am eich pensiwn.
            Dysgwch fwy am{' '}
            <Link
              href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/why-save-into-a-pension"
              target="_blank"
              asInlineText
              withIcon={false}
            >
              arbed mewn pensiwn
            </Link>
            .
          </>
        ),
      },
    },
  ];

  // Conditional sections
  const conditionalSections = [
    {
      key: 'statePension',
      heading: {
        en: 'Understand the State Pension',
        cy: 'Deall y Pensiwn Gwladol',
      },
      content: {
        en: (
          <>
            If you’re over State Pension age you can find out{' '}
            <Link
              href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/state-pension"
              target="_blank"
              asInlineText
              withIcon={false}
            >
              how to boost your income, how to claim and how it is taxed
            </Link>
            .
          </>
        ),
        cy: (
          <>
            Os ydych dros oed Pensiwn Gwladol gallwch{' '}
            <Link
              href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/state-pension"
              target="_blank"
              asInlineText
              withIcon={false}
            >
              sut i gynyddu eich incwm, sut i’w hawlio a sut mae’n cael ei
              drethu
            </Link>
            .
          </>
        ),
      },
      condition: () => isOverStatePensionAge,
    },
    {
      key: 'blindAllowance',
      heading: {
        en: "Help if you're living with an illness or disability",
        cy: 'Cymorth os ydych yn byw gydag afiechyd neu anabledd',
      },
      content: {
        en: (
          <>
            Find{' '}
            <Link
              href="https://www.moneyhelper.org.uk/en/family-and-care/illness-and-disability"
              target="_blank"
              asInlineText
              withIcon={false}
            >
              guidance about grants and financial support available
            </Link>{' '}
            to help you lead a more independent life by adapting your home or
            making travel easier.
          </>
        ),
        cy: (
          <>
            Dewch o hyd i{' '}
            <Link
              href="https://www.moneyhelper.org.uk/cy/family-and-care/illness-and-disability"
              target="_blank"
              asInlineText
              withIcon={false}
            >
              ganllawiau am grantiau a chymorth ariannol sydd ar gael
            </Link>{' '}
            i’ch helpu i fyw bywyd mwy annibynnol trwy addasu’ch cartref neu
            wneud teithio’n haws.
          </>
        ),
      },
      condition: () => isBlindPerson,
    },
  ];

  // Order main sections by gross salary
  const orderedMain = isBelowThreshold
    ? mainSections
    : [
        mainSections.find((s) => s.key === 'savings'),
        mainSections.find((s) => s.key === 'pension'),
        mainSections.find((s) => s.key === 'manageMoney'),
        mainSections.find((s) => s.key === 'costOfLiving'),
      ].filter(
        (section): section is (typeof mainSections)[number] =>
          section !== undefined,
      );

  // Add conditional sections
  const allSections = [
    ...orderedMain,
    ...conditionalSections.filter((s) => s.condition()),
  ];

  return (
    <div className="mt-6 lg:mt-8">
      <GridContainer>
        <div className="col-span-12 xl:col-span-10">
          <H1 className="text-blue-700">
            {z({ en: 'Next steps', cy: 'Camau nesaf' })}
          </H1>
        </div>

        {allSections.map((section) => (
          <section
            key={section.key}
            className="col-span-12 mt-4 lg:mt-6 xl:col-span-10"
          >
            <H2 variant="primary" className="mb-4">
              {z(section.heading)}
            </H2>
            <Paragraph className="mt-2 mb-2">{z(section.content)}</Paragraph>
          </section>
        ))}
      </GridContainer>
    </div>
  );
};

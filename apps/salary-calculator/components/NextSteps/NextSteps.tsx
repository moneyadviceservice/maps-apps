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
            Nawr eich bod wedi gweld eich tâl mynd adref, dysgwch sut y gall
            gwneud cyllideb neu adolygu eich pensiwn dalu ar ei ganfed yn ein
            canllaw{' '}
            <Link
              href="https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/beginners-guide-to-managing-your-money"
              target="_blank"
              asInlineText
              withIcon={false}
            >
              Rheoli eich arian
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
        cy: 'Cael help gyda chostau byw',
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
            Hyd yn oed os yw&apos;ch cyflog wedi codi, mae cost hanfodion bob
            dydd wedi bod yn codi hefyd. Dewch o hyd i{' '}
            <Link
              href="https://www.moneyhelper.org.uk/cy/money-troubles/cost-of-living"
              target="_blank"
              asInlineText
              withIcon={false}
            >
              ffyrdd o fynd i&apos;r afael â chostau byw
            </Link>
            , yn ogystal â&apos;r cymorth ychwanegol y gallwch ei hawlio.
          </>
        ),
      },
    },
    {
      key: 'savings',
      heading: { en: 'Look at your savings', cy: 'Edrychwch ar eich cynilion' },
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
            Pan fyddwch chi&apos;n gwybod eich cyflog mynd adref gallwch weld a
            oes lle i ddechrau cynilo. Darganfyddwch{' '}
            <Link
              href="https://www.moneyhelper.org.uk/cy/savings/how-to-save/getting-into-the-savings-habit"
              target="_blank"
              asInlineText
              withIcon={false}
            >
              pam ei bod yn syniad da cynilo&apos;n
            </Link>{' '}
            rheolaidd a&apos;r opsiynau cynilo sydd ar gael i chi.
          </>
        ),
      },
    },
    {
      key: 'pension',
      heading: { en: 'Save into a pension', cy: 'Cynilo i mewn i bensiwn' },
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
            Efallai y bydd ymddeol yn teimlo&apos;n bell i ffwrdd tra byddwch
            chi&apos;n gweithio, ond mae&apos;n syniad da i ddechrau meddwl am
            eich pensiwn. Darganfyddwch{' '}
            <Link
              href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/why-save-into-a-pension"
              target="_blank"
              asInlineText
              withIcon={false}
            >
              am gynilo i mewn i bensiwn
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
        cy: 'Deall Pensiwn y Wladwriaeth',
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
            Os ydych chi dros oedran Pensiwn y Wladwriaeth, gallwch ddysgu sut{' '}
            <Link
              href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/state-pension"
              target="_blank"
              asInlineText
              withIcon={false}
            >
              i roi hwb i&apos;ch incwm, sut i hawlio a sut mae&apos;n cael ei
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
        cy: "Help os ydych chi'n byw gyda salwch neu anabledd",
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
              arweiniad am grantiau a chymorth ariannol sydd ar gael
            </Link>{' '}
            i&apos;ch helpu i fyw bywyd mwy annibynnol trwy addasu eich cartref
            neu wneud teithio yn haws.
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

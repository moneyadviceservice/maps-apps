import { useTranslation } from '@maps-digital/shared/hooks';
import { ExpandableSection, Link } from '@maps-digital/shared/ui';
import { ReactNode } from 'react';
import { PensionInput, Step, StepName, frequencyOptions } from './pension-data';

export type ResultData = {
  resultFrequency: {
    [key: string]: Record<string, string>;
  };
  description: string;
  resultContributionType: {
    [key: string]: string;
  };
  links: {
    [key: string]: string;
  };
  qualifiedEarnings: ReactNode;
  taxReliefEarningMessage: ReactNode;
  taxReliefMessage: ReactNode;
  nextStep: {
    title: string;
    content: ReactNode[];
  };
};

export const pensionResults = (
  t: ReturnType<typeof useTranslation>['z'],
): Record<string, Step> => {
  return {
    [StepName.RESULTS]: {
      stepNumber: 3,
      title: t({
        en: '3. Your results',
        cy: '3. Eich canlyniadau',
      }),
      buttonText: t({
        en: 'Recalculate',
        cy: 'Ailgyfrifwch',
      }),
      fields: [
        {
          name: PensionInput.FREQUENCY,
          options: frequencyOptions(t),
          information: null,
          defaultValue: '12',
          errors: {},
          label: t({
            en: 'Show my contributions',
            cy: 'Dangos fy nghyfraniadau',
          }),
        },
      ],
    },
  };
};

export const resultsData = (
  t: ReturnType<typeof useTranslation>['z'],
): ResultData => {
  return {
    resultFrequency: {
      1: {
        employee: t({
          en: 'Your yearly contribution',
          cy: 'Eich cyfraniad blynyddol',
        }),
        employer: t({
          en: 'Employers yearly contribution',
          cy: 'Cyfraniad blynyddol y cyflogwr',
        }),
        total: t({
          en: 'Total yearly contributions',
          cy: 'Cyfanswm y cyfraniad blynyddol',
        }),
        taxRelief: t({
          en: 'includes tax relief',
          cy: 'yn cynnwys gostyngiad treth o',
        }),
      },
      12: {
        employee: t({
          en: 'Your monthly contribution',
          cy: 'Eich cyfraniad misol',
        }),
        employer: t({
          en: 'Employers monthly contribution',
          cy: 'Cyfraniad misol y cyflogwr',
        }),
        total: t({
          en: 'Total monthly contributions',
          cy: 'Cyfanswm y cyfraniad misoln',
        }),
        taxRelief: t({
          en: 'includes tax relief',
          cy: 'yn cynnwys gostyngiad treth o',
        }),
      },
      13: {
        employee: t({
          en: 'Your 4 weeks contribution',
          cy: 'Eich cyfraniad bob 4 wythnos',
        }),
        employer: t({
          en: 'Employers 4 weeks contribution',
          cy: 'Cyfraniad bob 4 wythnos y cyflogwr',
        }),
        total: t({
          en: 'Total 4 weeks contributions',
          cy: 'Cyfanswm y cyfraniad bob 4 wythnos',
        }),
        taxRelief: t({
          en: 'includes tax relief',
          cy: 'yn cynnwys gostyngiad treth o',
        }),
      },
      52: {
        employee: t({
          en: 'Your weekly contribution',
          cy: 'Eich cyfraniad wythnosol',
        }),
        employer: t({
          en: 'Employers weekly contribution',
          cy: 'Cyfraniad wythnosol y cyflogwr',
        }),
        total: t({
          en: 'Total weekly contributions',
          cy: 'Cyfanswm y cyfraniad wythnosol',
        }),
        taxRelief: t({
          en: 'includes tax relief',
          cy: 'yn cynnwys gostyngiad treth o',
        }),
      },
    },
    description: t({
      en: 'per year',
      cy: 'y flwyddyn',
    }),
    resultContributionType: {
      part: t({
        en: 'Contributions will be based on your qualifying earnings of',
        cy: 'Bydd cyfraniadau yn seiliedig ar eich enillion cymwys',
      }),
      full: t({
        en: 'Contributions will be based on your salary of',
        cy: 'Bydd cyfraniadau yn seiliedig ar eich cyflog o',
      }),
    },
    links: {
      print: t({
        en: 'Print your results',
        cy: 'Argraffu eich canlyniadau',
      }),
      email: t({
        en: 'Email your results',
        cy: 'E-bostio eich canlyniadau',
      }),
      reset: t({
        en: 'Reset the calculator',
        cy: 'Ailosod y gyfrifiannell',
      }),
    },
    taxReliefMessage: t({
      en: (
        <ExpandableSection title="Tax relief on pension contributions">
          <p className="text-gray-800">
            You get tax relief on pension contributions which means some of the
            money from your pay that would have gone to the government as tax
            goes towards your pension instead.{' '}
            <Link
              href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/tax-and-pensions/tax-relief-and-your-pension"
              target="_blank"
            >
              Read more about how you get tax relief{' '}
            </Link>
          </p>
        </ExpandableSection>
      ),
      cy: (
        <ExpandableSection title="Gostyngiad treth ar gyfraniadau pensiwn">
          <p className="text-gray-800">
            Byddwch yn cael gostyngiad treth ar eich cyfraniadau pensiwn sy'n
            golygu y rhoddir peth o’r arian o'ch cyflog a fyddai wedi mynd i’r
            llywodraeth fel treth tuag at eich pensiwn yn hytrach.
            <Link
              href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/tax-and-pensions/tax-relief-and-your-pension"
              target="_blank"
            >
              Darllenwch fwy am sut i gael gostyngiad treth (Yn agor mewn
              ffenestr newydd).{' '}
            </Link>
          </p>
        </ExpandableSection>
      ),
    }),
    taxReliefEarningMessage: t({
      en: (
        <>
          If you don’t pay income tax on your earnings, you will only receive
          tax relief on your pension contributions if your pension scheme
          collects contributions using a method known as tax relief at source.
          We have assumed your scheme does.{' '}
          <Link
            href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/tax-and-pensions/tax-relief-and-your-pension"
            target="_blank"
          >
            Read more in our guide about tax relief and your workplace pension
          </Link>
        </>
      ),
      cy: (
        <>
          Os nad ydych chi'n talu treth incwm ar eich enillion, cewch ostyngiad
          treth yn unig ar eich cyfraniadau pensiwn os bydd eich cynllun pensiwn
          yn casglu cyfraniadau yn defnyddio’r hyn a elwir yn ostyngiad treth ar
          y cychwyn. Rydym wedi tybio bod eich cynllun yn gwneud hyn.
          <Link
            href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/tax-and-pensions/tax-relief-and-your-pension"
            target="_blank"
          >
            Darllenwch ragor yn ein canllaw am ostyngiadau treth ar eich pensiwn
            gweithle
          </Link>
        </>
      ),
    }),
    qualifiedEarnings: t({
      en: (
        <ExpandableSection title="What are qualifying earnings?">
          <p className="text-gray-800">
            This is the part of your annual pay that will be used to calculate
            your pension contribution under automatic enrolment. It is your
            earnings before tax (up to a maximum limit of £50,270 per year) –
            less the lower earnings threshold of £6,240.
          </p>
        </ExpandableSection>
      ),
      cy: (
        <ExpandableSection title="Beth yw enillion cymhwyso?">
          <p className="text-gray-800">
            Dyma’r rhan o’ch cyflog blynyddol fydd yn cael ei defnyddio i
            gyfrifo eich cyfraniad pensiwn dan gofrestru awtomatig. Sef eich
            enillion cyn treth (hyd at derfyn uchafswm o £50,270 y flwyddyn) -
            tynnu’r trothwy enillion isaf o £6,240.
          </p>
        </ExpandableSection>
      ),
    }),
    nextStep: {
      title: t({
        en: 'Next steps',
        cy: 'Camau nesaf',
      }),
      content: [
        t({
          en: (
            <>
              Use our{' '}
              <Link
                className="inline visited:text-pink-600"
                href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/use-our-pension-calculator"
              >
                Pension Calculator
              </Link>{' '}
              to see how much pension pot you will build over time.
            </>
          ),
          cy: (
            <>
              Defnyddiwch ein{' '}
              <Link
                className="inline visited:text-pink-600"
                href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/use-our-pension-calculator"
              >
                Cyfrifiannell Pensiwn
              </Link>{' '}
              Yn agor mewn ffenestr newydd)i weld faint o bensiwn y bydd eich
              cronfa yn ei chronni dros amser.
            </>
          ),
        }),
        t({
          en: (
            <>
              Find out more about workplace{' '}
              <Link
                className="inline visited:text-pink-600"
                href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/auto-enrolment"
              >
                workplace pensions
              </Link>{' '}
            </>
          ),
          cy: (
            <>
              Dysgwch ragor am{' '}
              <Link
                className="inline"
                href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/auto-enrolment"
              >
                bensiynau gweithle.
              </Link>{' '}
            </>
          ),
        }),
        t({
          en: (
            <>
              Use our{' '}
              <Link
                className="inline visited:text-pink-600"
                href="https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner"
              >
                Pension Calculator
              </Link>{' '}
              to see what effect your contributions will have on your income.
            </>
          ),
          cy: (
            <>
              Defnyddiwch ein{' '}
              <Link
                className="inline"
                href="https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner"
              >
                cynllunydd cyllideb
              </Link>{' '}
              i weld pa effaith y bydd eich cyfraniadau yn eu cael ar eich
              incwm.
            </>
          ),
        }),
      ],
    },
  };
};

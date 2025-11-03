import { TranslationGroupString } from '@maps-react/form/types';
import { TranslationGroup } from '@maps-react/hooks/types';

import { H2, H4 } from '@maps-react/common/components/Heading';
import {
  Icon,
  IconType,
  InformationCallout,
  Link,
  LinkComponentProps,
} from '@maps-react/common/index';

import { formatNumber } from '../../../utils/parseStoredData';

import useTranslation from '@maps-react/hooks/useTranslation';
import {
  MAXIMUM_STATUTORY_REDUNDANCY_PAY,
  MAXIMUM_STATUTORY_REDUNDANCY_PAY_NI,
  MAXIMUM_STATUTORY_REDUNDANCY_PAY_NI_PRE_APRIL_2025,
  MAXIMUM_STATUTORY_REDUNDANCY_PAY_PRE_APRIL_2025,
  MAXIMUM_YEARS_OF_EMPLOYMENT,
  MAXIMUM_YEARS_OF_EMPLOYMENT_NI,
  WEEKLY_PAY_CAP,
  WEEKLY_PAY_CAP_NI,
  WEEKLY_PAY_CAP_NI_PRE_2025,
  WEEKLY_PAY_CAP_PRE_2025,
} from '../../../CONSTANTS';
import { ReactNode } from 'react';
import { Salary } from '../../../utils/calculateStatutoryRedundancyPay';
import { Checklist } from '../../../components/Results/Checklist';
import Image from 'next/image';

type StatutoryLimits = {
  base: TranslationGroup[];
  NorthernIreland: TranslationGroup[];
  basePreApril25: TranslationGroup[];
  NorthernIrelandPreApril25: TranslationGroup[];
};

type Copy = {
  title: TranslationGroupString;
  howIsThisCalculated: TranslationGroupString;
  rates: TranslationGroup[];
  ratesIntro: TranslationGroup;
  minimumYearsWorked: TranslationGroup;
  minimumYearsWorkedAndUnknownContractual: TranslationGroup;
  additionalInfo: {
    nextFinancialYear: TranslationGroupString;
    contractualUnknownOrLessThanStatutory: TranslationGroupString;
  };
  contractualRedunacyPay(amount: number): TranslationGroup;
  minimumEntitlement(amount: number): TranslationGroup;
  statutoryEntitlement(amount: number): TranslationGroup;
  contractualStatutoryRedunacyPay(
    contractualAmount: number,
    statutoryAmount: number,
  ): TranslationGroup;
  entitlementWeeks(weeks: number, isMinimum: boolean): TranslationGroup[];
  statutoryLimits: StatutoryLimits;
  redundancyForecastTitle: TranslationGroupString;
  redundancyForecast(
    salary: Salary,
    redundancyPay: number,
    monthsWorthOfSalary: number,
  ): TranslationGroup;
  preparingForRedundancy: TranslationGroup;
  lastDayChecklist: TranslationGroup;
  printedGuide: TranslationGroup;
};

const ExternalLink = ({ children, href }: LinkComponentProps) => {
  return (
    <Link href={href} target="_blank" withIcon={false}>
      {children}
    </Link>
  );
};

type UsefulContact = {
  title: string;
  intro?: ReactNode;
  items: ReactNode[];
};

export const usefulContacts = (
  z: ReturnType<typeof useTranslation>['z'],
): Record<number, UsefulContact> => {
  return {
    1: {
      title: z({
        en: 'Speak to a debt and money specialist',
        cy: 'Siaradwch ag arbenigwr dyled ac arian',
      }),
      intro: z({
        en: 'Our experts can give you independent and impartial money guidance.',
        cy: 'Gall ein harbenigwyr rhoi arweiniad arian annibynnol a diduedd i chi.',
      }),
      items: z({
        en: [
          <>
            Call <Link href="tel:08001387777">0800 138 7777</Link> -
            Monday-Friday, 8am-6pm. Closed on weekends and bank holidays
          </>,
        ],
        cy: [
          <>
            Ffoniwch <Link href="tel:08001380555">0800 138 0555</Link> - Dydd
            Llun-Dydd Gwener, 8am-6pm. Ar gau ar benwythnosau a gwyliau banc
          </>,
        ],
      }),
    },
    2: {
      title: z({
        en: 'Acas - workplace guidance (England, Scotland and Wales)',
        cy: "Acas - canllaw gweithle (Cymru, Lloegr a'r Alban)",
      }),
      intro: z({
        en: 'Free confidential guidance about workplace issues and disputes',
        cy: 'Canllawiau cyfrinachol am ddim ar faterion ac anghydfodau yn y gweithle',
      }),
      items: z({
        en: [
          <>
            Call <Link href="tel:0800123110">0300 123 1100</Link> -
            Monday-Friday, 8am-8pm and Saturday, 9am-1pm
          </>,
          <>
            Visit{' '}
            <ExternalLink href="https://www.acas.org.uk/">
              acas.org.uk
            </ExternalLink>
          </>,
        ],
        cy: [
          <>
            Ffoniwch <Link href="tel:0800123110">0300 123 1100</Link> - Dydd
            Llun i ddydd Gwener, 8am-8pm a dydd Sadwrn, 9am-1pm
          </>,
          <>
            Ymweld ag{' '}
            <ExternalLink href="https://www.acas.org.uk/">
              acas.org.uk
            </ExternalLink>
          </>,
        ],
      }),
    },
    3: {
      title: z({
        en: 'Acas - Redundancy Payments Service (England, Scotland and Wales)',
        cy: "Acas - Redundancy Payment Service (Cymru, Lloegr a'r Alban)",
      }),
      intro: z({
        en: 'Information and advice on statutory redundancy pay',
        cy: 'Gwybodaeth a chyngor ar dâl diswyddo statudol',
      }),
      items: z({
        en: [
          <>
            Call <Link href="tel:08451450004">0845 145 0004</Link> -
            Monday-Friday, 9am-5pm
          </>,
        ],
        cy: [
          <>
            Ffoniwch <Link href="tel:08451450004">0845 145 0004</Link> - Dydd
            Llun-Dydd Gwener, 9am-5pm
          </>,
        ],
      }),
    },
    4: {
      title: z({ en: 'Citizens Advice', cy: 'Cyngor ar Bopeth' }),
      intro: z({
        en: "Advice and guidance if you're facing redundancy",
        cy: "Cyngor ac arweiniad os ydych chi'n wynebu diswyddiad",
      }),
      items: z({
        en: [
          <>
            Visit{' '}
            <ExternalLink href="https://www.citizensadvice.org.uk/">
              Citizens Advice
            </ExternalLink>{' '}
            to find contact details for your local branch.
          </>,
        ],
        cy: [
          <>
            Ewch i{' '}
            <ExternalLink href="https://www.citizensadvice.org.uk/">
              Gyngor ar Bopeth
            </ExternalLink>{' '}
            i ddod o hyd i fanylion cyswllt ar gyfer eich cangen leol.
          </>,
        ],
      }),
    },
    5: {
      title: z({
        en: 'Employment tribunal service (England, Scotland and Wales)',
        cy: "Gwasanaeth tribiwnlys cyflogaeth (Cymru, Lloegr a'r Alban)",
      }),
      intro: z({
        en: 'If you think your employer has treated you unfairly.',
        cy: "Os ydych chi'n meddwl bod eich cyflogwr wedi eich trin yn annheg.",
      }),
      items: z({
        en: [
          <>
            In England and Wales - call{' '}
            <Link href="tel:03003230196">0300 323 0196</Link>
          </>,
          <>
            In Scotland - call <Link href="tel:03007906234">0300 790 6234</Link>
          </>,
          <>
            Visit the{' '}
            <ExternalLink href="https://www.gov.uk/courts-tribunals/employment-tribunal">
              Employment Tribunal service on GOV.UK
            </ExternalLink>
          </>,
        ],
        cy: [
          <>
            Yng Nghymru a Lloegr - ffoniwch{' '}
            <Link href="tel:03003230196">0300 323 0196</Link>
          </>,
          <>
            Yn yr Alban - ffoniwch{' '}
            <Link href="tel:03007906234">0300 790 6234</Link>
          </>,
          <>
            Ewch i wasanaeth{' '}
            <ExternalLink href="https://www.gov.uk/courts-tribunals/employment-tribunal">
              Employment Tribunal ar GOV.UK
            </ExternalLink>
          </>,
        ],
      }),
    },
    6: {
      title: z({
        en: 'Jobcentre Plus (England, Scotland and Wales)',
        cy: "Canolfan Byd Gwaith (Cymru, Lloegr a'r Alban)",
      }),
      intro: z({
        en: "For help claiming Jobseeker's Allowance",
        cy: 'Am help i wneud cais am Lwfans Ceisio Gwaith',
      }),
      items: z({
        en: [
          <>
            Call <Link href="tel:08000556688">0800 055 6688</Link> -
            Monday-Friday, 8am-6pm
          </>,
        ],
        cy: [
          <>
            Ffoniwch <Link href="tel:08000556688">0800 055 6688</Link> - Dydd
            Dydd Llun-Dydd Gwener, 8am-6pm
          </>,
        ],
      }),
    },
    7: {
      title: z({
        en: 'Jobs and Benefits Office (Northern Ireland)',
        cy: 'Jobs and Benefit Office (Gogledd Iwerddon)',
      }),
      items: z({
        en: [
          <>
            Search for jobs and benefits on{' '}
            <ExternalLink href="https://www.nidirect.gov.uk/">
              nidirect.gov.uk
            </ExternalLink>
          </>,
          <>
            Or view job vacancies on{' '}
            <ExternalLink href="https://www.jobapplyni.com/">
              Jobcentre Online NI
            </ExternalLink>
          </>,
        ],
        cy: [
          <>
            Chwilio am swyddi a budd-daliadau ar{' '}
            <ExternalLink href="https://www.nidirect.gov.uk/">
              nidirect.gov.uk
            </ExternalLink>
          </>,
          <>
            Neu edrychwch ar swyddi gwag ar{' '}
            <ExternalLink href="https://www.jobapplyni.com/">
              Jobcentre Online NI
            </ExternalLink>
          </>,
        ],
      }),
    },
    8: {
      title: z({
        en: 'Labour Relations Agency (Northern Ireland)',
        cy: 'Labour Relations Agency (Gogledd Iwerddon) ',
      }),
      intro: z({
        en: 'Free, impartial and confidential employment relations service',
        cy: 'Gwasanaeth cysylltiadau cyflogaeth am ddim, diduedd a chyfrinachol ',
      }),
      items: z({
        en: [
          <>
            Call <Link href="tel:03300555300">03300 555 300</Link>
          </>,
          <>
            Visit the{' '}
            <ExternalLink href="https://www.lra.org.uk/">
              Labour Relations Agency
            </ExternalLink>
          </>,
        ],
        cy: [
          <>
            Gwasanaeth cysylltiadau cyflogaeth am ddim, diduedd a chyfrinachol
          </>,
          <>
            Ewch i'r{' '}
            <ExternalLink href="https://www.lra.org.uk/">
              Labour Relations Agency
            </ExternalLink>
          </>,
        ],
      }),
    },
    9: {
      title: z({ en: 'mygov.scot', cy: 'mygov.scot' }),
      intro: z({
        en: "For help if you're made redundant",
        cy: "Am help os ydych chi'n cael eich diswyddo",
      }),
      items: z({
        en: [
          <>
            Visit{' '}
            <ExternalLink href="https://www.mygov.scot/help-redundancy">
              mygov.scot
            </ExternalLink>
          </>,
        ],
        cy: [
          <>
            Ewch i{' '}
            <ExternalLink href="https://www.mygov.scot/help-redundancy">
              mygov.scot
            </ExternalLink>
          </>,
        ],
      }),
    },
    10: {
      title: z({
        en: 'PACE Redundancy Support Service (Scotland)',
        cy: 'PACE Redundancy Support Servcie (Yr Alban)',
      }),
      intro: z({
        en: 'Free and impartial advice for everyone affected by redundancy',
        cy: 'Cyngor am ddim a diduedd i bawb yr effeithir arnynt gan ddiswyddiad',
      }),
      items: z({
        en: [
          <>
            Call <Link href="tel:08009178000">0800 917 8000</Link>
          </>,
          <>
            Learn more about{' '}
            <ExternalLink href="https://www.skillsdevelopmentscotland.co.uk/what-we-do/employability-skills/partnership-action-for-continuing-employment-pace">
              PACE on Skills Development Scotland
            </ExternalLink>
          </>,
        ],
        cy: [
          <>
            Ffoniwch <Link href="tel:08009178000">0800 917 8000</Link>
          </>,
          <>
            Dysgu mwy am{' '}
            <ExternalLink href="https://www.skillsdevelopmentscotland.co.uk/what-we-do/employability-skills/partnership-action-for-continuing-employment-pace">
              PACE ar Skills Development Scotland
            </ExternalLink>
          </>,
        ],
      }),
    },
  };
};

export const whatToDo = (z: ReturnType<typeof useTranslation>['z']) => {
  return {
    heading: z({
      en: 'What to do when you get your redundancy pay',
      cy: "Beth i'w wneud pan fyddwch chi'n cael eich tâl diswyddo",
    }),
    items: [
      {
        heading: z({
          en: 'Check you’ve paid the right amount of tax',
          cy: "Gwiriwch eich bod wedi talu'r swm cywir o dreth",
        }),
        content: z({
          en: (
            <>
              If you’re getting more than £30,000 in redundancy pay,{' '}
              <Link
                href="https://www.moneyhelper.org.uk/en/work/losing-your-job/do-you-have-to-pay-tax-on-your-redundancy-payout"
                target="_blank"
                rel="noreferrer"
                withIcon={false}
              >
                you’ll need to pay tax on some of it.
              </Link>{' '}
              Your employer will usually have deducted the tax but often won’t
              take the right amount, so check and leave money aside if you need
              to.
            </>
          ),
          cy: (
            <>
              Os ydych chi'n cael mwy na £30,000 o dâl diswyddo, bydd{' '}
              <Link
                href="https://www.moneyhelper.org.uk/cy/work/losing-your-job/do-you-have-to-pay-tax-on-your-redundancy-payout"
                target="_blank"
                rel="noreferrer"
                withIcon={false}
              >
                angen i chi dalu treth ar rywfaint ohono
              </Link>{' '}
              . Bydd eich cyflogwr fel arfer wedi didynnu'r dreth ond yn aml ni
              fydd yn cymryd y swm cywir, felly gwiriwch a gadewch arian i'r
              neilltu os oes angen.
            </>
          ),
        }),
      },
      {
        heading: z({
          en: 'Do a quick budget',
          cy: 'Gwnewch gyllideb gyflym',
        }),
        content: z({
          en: (
            <>
              If you don’t already have a budget listing all your income and
              spending, now is the time to do it.{' '}
              <Link
                href="https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner"
                target="_blank"
                rel="noreferrer"
                withIcon={false}
              >
                Try our free and easy-to-use Budget Planner
              </Link>
              <span>.</span>
            </>
          ),
          cy: (
            <>
              Os nad oes gennych gyllideb eisoes sy'n rhestru'ch holl incwm a'ch
              gwariant, nawr yw'r amser i'w wneud.{' '}
              <Link
                href="https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/budget-planner"
                target="_blank"
                rel="noreferrer"
                withIcon={false}
              >
                Rhowch gynnig ar ein Cynllunydd cyllideb sydd am ddim a’n hawdd
                i'w ddefnyddio
              </Link>
              <span>.</span>
            </>
          ),
        }),
      },
      {
        heading: z({
          en: 'See what benefits you could claim',
          cy: 'Gweld pa fudd-daliadau y gallech eu hawlio',
        }),
        content: z({
          en: (
            <>
              It’s important to get everything you’re entitled to.{' '}
              <Link
                href="https://www.moneyhelper.org.uk/en/benefits/benefits-calculator"
                target="_blank"
                rel="noreferrer"
                withIcon={false}
              >
                Use our Benefits calculator
              </Link>{' '}
              to find out what benefits are available and how to claim them.
            </>
          ),
          cy: (
            <>
              Mae'n bwysig cael popeth y mae gennych hawl iddo.{' '}
              <Link
                href="https://www.moneyhelper.org.uk/cy/benefits/benefits-calculator"
                target="_blank"
                rel="noreferrer"
                withIcon={false}
              >
                Defnyddiwch ein Cyfrifiannell budd-daliadau
              </Link>{' '}
              i ddarganfod pa fudd-daliadau sydd ar gael a sut i wneud cais
              amdanynt.
            </>
          ),
        }),
      },
      {
        heading: z({
          en: 'Review your debts',
          cy: 'Adolygu eich dyledion',
        }),
        content: z({
          en: (
            <>
              If you have debts, you might want to think about using your
              redundancy pay to help with repayments. Our guide{' '}
              <Link
                href="https://www.moneyhelper.org.uk/en/everyday-money/credit/how-to-prioritise-your-debts"
                target="_blank"
                rel="noreferrer"
                withIcon={false}
              >
                How to prioritise your debts
              </Link>{' '}
              can help you understand which debts to target first.
            </>
          ),
          cy: (
            <>
              Os oes gennych ddyledion, efallai yr hoffech feddwl am ddefnyddio
              eich taliad diswyddo i helpu gydag ad-daliadau. Gall ein canllaw{' '}
              <Link
                href="https://www.moneyhelper.org.uk/cy/everyday-money/credit/how-to-prioritise-your-debts"
                target="_blank"
                rel="noreferrer"
                withIcon={false}
              >
                Sut i flaenoriaethu eich dyledion
              </Link>{' '}
              eich helpu i ddeall pa ddyledion i'w delio gyda’n gyntaf.
            </>
          ),
        }),
      },
      {
        heading: z({
          en: 'Set some aside for emergency savings',
          cy: "Rhowch peth arian i'r neilltu argyfer cynilion brys",
        }),
        content: z({
          en: (
            <>
              Your redundancy pay could give you an emergency savings fund. This
              will help you deal with any unexpected costs you might face. Learn
              more in our guide{' '}
              <Link
                href="https://www.moneyhelper.org.uk/en/savings/types-of-savings/emergency-savings-how-much-is-enough"
                target="_blank"
                rel="noreferrer"
                withIcon={false}
              >
                Emergency savings – how much is enough? 
              </Link>{' '}
            </>
          ),
          cy: (
            <>
              Gallai eich tâl diswyddo roi cronfa gynilo brys i chi. Bydd hyn yn
              eich helpu i ddelio ag unrhyw gostau annisgwyl y gallech eu
              hwynebu. Dysgwch fwy yn ein canllaw{' '}
              <Link
                href="https://www.moneyhelper.org.uk/cy/savings/types-of-savings/emergency-savings-how-much-is-enough"
                target="_blank"
                rel="noreferrer"
                withIcon={false}
              >
                Cynilion ar gyfer Argyfwng – faint sy'n ddigon?
              </Link>
            </>
          ),
        }),
      },
      {
        heading: z({
          en: 'Think about tax-free savings and investments',
          cy: 'Meddyliwch am gynilion a buddsoddiadau di-dreth',
        }),
        content: z({
          en: (
            <>
              There are a lot of options that can help you make the most of your
              redundancy pay if you don’t need it straight away. Our guides{' '}
              <Link
                href="https://www.moneyhelper.org.uk/en/savings/types-of-savings/isas-and-other-tax-efficient-ways-to-save-or-invest"
                target="_blank"
                rel="noreferrer"
                withIcon={false}
              >
                ISAs and other tax-efficient ways to save or invest
              </Link>{' '}
              and{' '}
              <Link
                href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/building-your-retirement-pot"
                target="_blank"
                rel="noreferrer"
                withIcon={false}
              >
                Building your retirement pot
              </Link>{' '}
              tell you more.
            </>
          ),
          cy: (
            <>
              Mae yna lawer o opsiynau a all eich helpu i wneud y gorau o'ch tâl
              diswyddo os nad oes ei angen arnoch ar unwaith. Mae ein canllawiau{' '}
              <Link
                href="https://www.moneyhelper.org.uk/cy/savings/types-of-savings/isas-and-other-tax-efficient-ways-to-save-or-invest"
                target="_blank"
                rel="noreferrer"
                withIcon={false}
              >
                ISAs a ffyrdd treth-effeithlon eraill o gynilo neu fuddsoddi
              </Link>{' '}
              ac{' '}
              <Link
                href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/building-your-retirement-pot"
                target="_blank"
                rel="noreferrer"
                withIcon={false}
              >
                Mae adeiladu eich pot ymddeol
              </Link>{' '}
              yn dweud mwy wrthych.
            </>
          ),
        }),
      },
    ],
  };
};

const copy: Copy = {
  title: {
    en: 'Your results',
    cy: 'Eich canlyniadau ',
  },
  howIsThisCalculated: {
    en: 'How is this calculated?',
    cy: 'Sut mae hyn yn cael ei gyfrifo?',
  },
  minimumYearsWorked: {
    en: (
      <>
        <H4 className="mb-4">
          You could be entitled to statutory redundancy pay of:
        </H4>
        <H2 className="mb-4">£0,00</H2>
        <div className="flex items-center">
          <Icon
            data-testid="icon-error"
            className="min-w-[50px]"
            type={IconType.WARNING}
          ></Icon>
          <p>
            Only employees who have worked at least two years are eligible for
            statutory redundancy pay.
          </p>
        </div>
      </>
    ),
    cy: (
      <>
        <H4 className="mb-4">
          Gallech fod â hawl i dâl diswyddo statudol gwerth:
        </H4>
        <H2 className="mb-4">£0,00</H2>
        <div className="flex items-center">
          <Icon
            data-testid="icon-error"
            className="min-w-[50px]"
            type={IconType.WARNING}
          ></Icon>
          <p>
            Dim ond gweithwyr sydd wedi gweithio am o leiaf ddwy flynedd sy'n
            gymwys i gael tâl diswyddo statudol. 
          </p>
        </div>
      </>
    ),
  },
  minimumYearsWorkedAndUnknownContractual: {
    en: (
      <>
        <H4 className="mb-4">
          You could be entitled to a minimum redundancy pay of:
        </H4>
        <H2 className="mb-4">£0,00</H2>
        <div className="flex items-center">
          <Icon
            data-testid="icon-error"
            className="min-w-[50px]"
            type={IconType.WARNING}
          ></Icon>
          <p>
            Only employees who have worked at least two years are eligible for
            statutory redundancy pay.
          </p>
        </div>
      </>
    ),
    cy: (
      <>
        <H4 className="mb-4">Gallech fod â hawl i isafswm tâl diswyddo o:</H4>
        <H2 className="mb-4">£0,00</H2>
        <div className="flex items-center">
          <Icon
            data-testid="icon-error"
            className="min-w-[50px]"
            type={IconType.WARNING}
          ></Icon>
          <p>
            Dim ond gweithwyr sydd wedi gweithio am o leiaf ddwy flynedd sy'n
            gymwys i gael tâl diswyddo statudol. 
          </p>
        </div>
      </>
    ),
  },
  additionalInfo: {
    nextFinancialYear: {
      en: "We don't have figures for the date that you selected. This estimate is based on the current financial year. Your actual statutory pay may vary.",
      cy: `Nid oes gennym ffigurau ar gyfer y dyddiad a ddewisoch chi. Mae'r amcangyfrif hwn yn seiliedig ar y flwyddyn ariannol presennol. Nid oes gennym ffigurau ar gyfer y dyddiad a ddewiswyd gennych, felly gall eich tâl diswyddo statudol gwirioneddol amrywio.`,
    },
    contractualUnknownOrLessThanStatutory: {
      en: 'Check your employment contract or staff handbook to find out about your contractual pay. You can also ask your employer for the amount.',
      cy: `Edrychwch ar eich contract cyflogaeth neu'ch llawlyfr staff i gael gwybod am eich tâl diswyddo cytundebol. Gallwch hefyd ofyn i'ch cyflogwr am y swm.`,
    },
  },
  contractualRedunacyPay: (amount: number): TranslationGroup => {
    return {
      en: (
        <>
          <H4 className="mb-4">
            You've told us your contractual redundancy pay will be:
          </H4>
          <H2 className="mb-4">£{formatNumber(amount)}</H2>
        </>
      ),
      cy: (
        <>
          <H4 className="mb-4">
            Rydych wedi dweud wrthym mai eich tâl diswyddo cytundebol fydd:
          </H4>
          <H2 className="mb-4">£{formatNumber(amount)}</H2>
        </>
      ),
    };
  },
  statutoryEntitlement: (amount: number): TranslationGroup => {
    return {
      en: (
        <>
          <H4 className="mb-4">
            You could be entitled to statutory redundancy pay of:
          </H4>
          <H2 className="mb-4">£{formatNumber(amount)}</H2>
          <p className="mb-4">
            This figure is based on what you've told us. Your actual redundancy
            pay may vary depending on exact dates.
          </p>
        </>
      ),
      cy: (
        <>
          <H4 className="mb-4">
            Gallech fod â hawl i dâl diswyddo statudol gwerth:
          </H4>
          <H2 className="mb-4">£{formatNumber(amount)}</H2>
          <p className="mb-4">
            Mae'r ffigur hwn yn seiliedig ar yr hyn rydych chi wedi'i ddweud
            wrthym. Gall eich tâl diswyddo gwirioneddol amrywio yn dibynnu ar
            union ddyddiadau.
          </p>
        </>
      ),
    };
  },
  minimumEntitlement: (amount: number): TranslationGroup => {
    return {
      en: (
        <>
          <H4 className="mb-4">
            You could be entitled to a minimum redundancy pay of:
          </H4>
          <H2 className="mb-4">£{formatNumber(amount)}</H2>
          <p className="mb-4">
            This figure is based on what you've told us. Your actual redundancy
            pay may vary depending on exact dates.
          </p>
        </>
      ),
      cy: (
        <>
          <H4 className="mb-4">Gallech fod â hawl i isafswm tâl diswyddo o:</H4>
          <H2 className="mb-4">£{formatNumber(amount)}</H2>
          <p className="mb-4">
            Mae'r ffigur hwn yn seiliedig ar yr hyn rydych chi wedi'i ddweud
            wrthym. Gall eich tâl diswyddo gwirioneddol amrywio yn dibynnu ar
            union ddyddiadau.
          </p>
        </>
      ),
    };
  },
  contractualStatutoryRedunacyPay: (
    contractualAmount: number,
    statutoryAmount: number,
  ): TranslationGroup => {
    return {
      en: (
        <>
          <H4 className="mb-4">
            You've told us your contractual redundancy pay will be:
          </H4>
          <H2 className="mb-4">£{formatNumber(contractualAmount)}</H2>
          <H4 className="mb-4">
            But based on your answers you could be entitled to a minimum of:
          </H4>
          <H2 className="mb-4">£{formatNumber(statutoryAmount)}</H2>
          <p className="mb-4">
            This figure is based on what you've told us. Your actual redundancy
            pay may vary depending on exact dates.
          </p>
        </>
      ),
      cy: (
        <>
          <H4 className="mb-4">
            Rydych wedi dweud wrthym mai cyfanswm eich tâl diswyddo cytundebol
            fydd:
          </H4>
          <H2 className="mb-4">£{formatNumber(contractualAmount)}</H2>
          <H4 className="mb-4">
            Ond yn seiliedig ar eich atebion gallech fod â hawl i leiafswm o:
          </H4>
          <H2 className="mb-4">£{formatNumber(statutoryAmount)}</H2>
          <p className="mb-4">
            Mae'r ffigur hwn yn seiliedig ar yr hyn rydych chi wedi'i ddweud
            wrthym. Gall eich tâl diswyddo gwirioneddol amrywio yn dibynnu ar
            union ddyddiadau.  
          </p>
        </>
      ),
    };
  },
  entitlementWeeks: (weeks: number, isMinimum: boolean): TranslationGroup[] => {
    let copy: TranslationGroup[] = new Array();

    if (isMinimum) {
      copy.push({
        en: (
          <>
            The minimum you're entitled to is the amount you'd get as statutory
            redundancy pay
          </>
        ),
        cy: (
          <>
            Yr isafswm y mae gennych hawl iddo yw'r swm y byddech chi'n ei gael
            fel tâl diswyddo statudol
          </>
        ),
      });
    }
    copy.push({
      en: (
        <>
          Your entitlement is{' '}
          <b>
            {weeks} {weeks > 1 ? 'weeks' : 'week'}
          </b>
        </>
      ),
      cy: (
        <>
          Eich hawl yw{' '}
          <b>
            {weeks} {weeks > 1 ? 'wythnosau' : 'wythnos'}
          </b>
        </>
      ),
    });

    return copy;
  },
  ratesIntro: {
    en: <>You get:</>,
    cy: <>Rydych chi'n cael:</>,
  },
  rates: [
    {
      en: (
        <>
          <b>0.5 week's pay</b> for each full year worked when you were{' '}
          <b>under 22</b>
        </>
      ),
      cy: (
        <>
          <b>0.5 wythnos o dâl </b> am bob blwyddyn lawn a weithiwyd pan oeddech
          o <b>dan 22 oed</b>
        </>
      ),
    },
    {
      en: (
        <>
          <b>1 week's pay</b> for each full year worked when you're between{' '}
          <b>22 and 41</b>
        </>
      ),
      cy: (
        <>
          <b>1 wythnos o dâl</b> bob blwyddyn lawn a weithiwyd pan oeddech rhwng{' '}
          <b>22 and 41</b>
        </>
      ),
    },
    {
      en: (
        <>
          <b>1.5 week's pay</b> for each full year worked when you're{' '}
          <b>41 or older</b>
        </>
      ),
      cy: (
        <>
          <b>1.5 wythnos o dâl</b> am bob blwyddyn lawn a weithiwyd pan oeddech
          chi'n <b>41 oed neu'n hŷn.</b>
        </>
      ),
    },
  ],
  statutoryLimits: {
    base: [
      {
        en: (
          <>
            Pay is capped at <b>£{formatNumber(WEEKLY_PAY_CAP)}</b> per week
          </>
        ),
        cy: (
          <>
            Mae'r tâl wedi'i gapio ar <b>£{formatNumber(WEEKLY_PAY_CAP)} </b>yr
            wythnos
          </>
        ),
      },
      {
        en: (
          <>
            Length of service is capped at{' '}
            <b>{MAXIMUM_YEARS_OF_EMPLOYMENT} years</b>
          </>
        ),
        cy: (
          <>
            Mae hyd y gwasanaeth wedi'i gapio ars{' '}
            <b>{MAXIMUM_YEARS_OF_EMPLOYMENT} mlynedd</b>
          </>
        ),
      },
      {
        en: (
          <>
            The maximum amount of statutory redundancy pay is{' '}
            <b>£{formatNumber(MAXIMUM_STATUTORY_REDUNDANCY_PAY)}</b>
          </>
        ),
        cy: (
          <>
            Uchafswm tâl diswyddo statudol yw{' '}
            <b>£{formatNumber(MAXIMUM_STATUTORY_REDUNDANCY_PAY)}</b>
          </>
        ),
      },
    ],
    NorthernIreland: [
      {
        en: (
          <>
            Pay is capped at <b>£{formatNumber(WEEKLY_PAY_CAP_NI)}</b> per week
          </>
        ),
        cy: (
          <>
            Mae'r tâl wedi'i gapio ar <b>£{formatNumber(WEEKLY_PAY_CAP_NI)}</b>{' '}
            yr wythnos
          </>
        ),
      },
      {
        en: (
          <>
            Length of service is capped at{' '}
            <b>{MAXIMUM_YEARS_OF_EMPLOYMENT_NI} years</b>
          </>
        ),
        cy: (
          <>
            Mae hyd y gwasanaeth wedi'i gapio ars{' '}
            <b>{MAXIMUM_YEARS_OF_EMPLOYMENT_NI} mlynedd</b>
          </>
        ),
      },
      {
        en: (
          <>
            The maximum amount of statutory redundancy pay is{' '}
            <b>£{formatNumber(MAXIMUM_STATUTORY_REDUNDANCY_PAY_NI)}</b>
          </>
        ),
        cy: (
          <>
            Uchafswm tâl diswyddo statudol yw{' '}
            <b>£{formatNumber(MAXIMUM_STATUTORY_REDUNDANCY_PAY_NI)}</b>
          </>
        ),
      },
    ],
    basePreApril25: [
      {
        en: (
          <>
            Pay is capped at <b>£{formatNumber(WEEKLY_PAY_CAP_PRE_2025)}</b> per
            week
          </>
        ),
        cy: (
          <>
            Mae'r tâl wedi'i gapio ar{' '}
            <b>£{formatNumber(WEEKLY_PAY_CAP_PRE_2025)} </b>yr wythnos
          </>
        ),
      },
      {
        en: (
          <>
            Length of service is capped at{' '}
            <b>{MAXIMUM_YEARS_OF_EMPLOYMENT} years</b>
          </>
        ),
        cy: (
          <>
            Mae hyd y gwasanaeth wedi'i gapio ars{' '}
            <b>{MAXIMUM_YEARS_OF_EMPLOYMENT} mlynedd</b>
          </>
        ),
      },
      {
        en: (
          <>
            The maximum amount of statutory redundancy pay is{' '}
            <b>
              £{formatNumber(MAXIMUM_STATUTORY_REDUNDANCY_PAY_PRE_APRIL_2025)}
            </b>
          </>
        ),
        cy: (
          <>
            Uchafswm tâl diswyddo statudol yw{' '}
            <b>
              £{formatNumber(MAXIMUM_STATUTORY_REDUNDANCY_PAY_PRE_APRIL_2025)}
            </b>
          </>
        ),
      },
    ],
    NorthernIrelandPreApril25: [
      {
        en: (
          <>
            Pay is capped at <b>£{formatNumber(WEEKLY_PAY_CAP_NI_PRE_2025)}</b>{' '}
            per week
          </>
        ),
        cy: (
          <>
            Mae'r tâl wedi'i gapio ar{' '}
            <b>£{formatNumber(WEEKLY_PAY_CAP_NI_PRE_2025)} </b>yr wythnos
          </>
        ),
      },
      {
        en: (
          <>
            Length of service is capped at{' '}
            <b>{MAXIMUM_YEARS_OF_EMPLOYMENT_NI} years</b>
          </>
        ),
        cy: (
          <>
            Mae hyd y gwasanaeth wedi'i gapio ars{' '}
            <b>{MAXIMUM_YEARS_OF_EMPLOYMENT_NI} mlynedd</b>
          </>
        ),
      },
      {
        en: (
          <>
            The maximum amount of statutory redundancy pay is{' '}
            <b>
              £
              {formatNumber(MAXIMUM_STATUTORY_REDUNDANCY_PAY_NI_PRE_APRIL_2025)}
            </b>
          </>
        ),
        cy: (
          <>
            Uchafswm tâl diswyddo statudol yw{' '}
            <b>
              £
              {formatNumber(MAXIMUM_STATUTORY_REDUNDANCY_PAY_NI_PRE_APRIL_2025)}
            </b>
          </>
        ),
      },
    ],
  },
  redundancyForecastTitle: {
    en: 'How long will your money last?',
    cy: 'Pa mor hir fydd eich arian yn para?',
  },
  redundancyForecast: (
    salary: Salary,
    redundancyPay: number,
    monthsWorthOfSalary: number,
  ): TranslationGroup => {
    return {
      en: (
        <>
          Based on your{' '}
          <b>
            £{formatNumber(salary.amount)}{' '}
            {['yearly', 'monthly', 'weekly'][salary.frequency]}
          </b>{' '}
          salary, your <b>£{formatNumber(redundancyPay)}</b> redundancy money is
          roughly equivalent to <b>{monthsWorthOfSalary.toFixed(1)}</b> months
          of salary.
        </>
      ),
      cy: (
        <>
          Yn seiliedig ar eich cyflog{' '}
          <b>
            {['blynyddol', 'misol', 'wythnosol'][salary.frequency]} £
            {formatNumber(salary.amount)}
          </b>
          {', '}mae eich arian diswyddo <b>£{formatNumber(redundancyPay)}</b> yn
          cyfateb yn fras i <b>{monthsWorthOfSalary.toFixed(1)}</b> mis o
          gyflog.
        </>
      ),
    };
  },
  preparingForRedundancy: {
    en: (
      <>
        <H2 className="mb-8 text-blue-700 md:text-5xl">
          Preparing for redundancy
        </H2>
        <div className="grid grid-cols-1 lg:grid-cols-10 lg:gap-x-6 xl:grid-cols-8">
          <div className="mb-8 lg:mb-0 lg:col-span-5 xl:col-span-4">
            <InformationCallout
              variant="default"
              testId=""
              className="flex flex-col h-full"
            >
              <div>
                <h3 className="text-[20px] font-bold lg:text-[22px] pt-6 lg:pt-8 pl-6 lg:pl-8">
                  Understanding your rights
                </h3>
              </div>
              <div>
                <p className="pl-6 pr-4 my-4 lg:pl-8 lg:pr-8 text-md">
                  When facing redundancy, you have legal rights that ensure
                  you’re treated fairly by your employer. Learn more about{' '}
                  <Link
                    href="https://www.moneyhelper.org.uk/en/work/losing-your-job/your-legal-rights-when-facing-redundancy"
                    target="_blank"
                    rel="noreferrer"
                    withIcon={false}
                  >
                    your legal rights
                  </Link>
                  .
                </p>
              </div>
              <div className="flex-grow" />
              <p className="pb-6 pr-4 text-end text-md">
                (approximately <strong>6 minute</strong>&nbsp;read)
              </p>
            </InformationCallout>
          </div>
          <div className="lg:col-span-5 xl:col-span-4">
            <InformationCallout
              variant="default"
              testId=""
              className="flex flex-col h-full"
            >
              <div>
                <h3 className="text-[20px] font-bold lg:text-[22px] pt-6 lg:pt-8 pl-6 lg:pl-8">
                  Check to see if you are insured
                </h3>
              </div>
              <div>
                <p className="pl-6 pr-4 my-4 lg:pl-8 lg:pr-8 text-md">
                  You may have taken insurance out to protect you in case of a
                  job loss. It is always worth checking{' '}
                  <Link
                    href="https://www.moneyhelper.org.uk/en/work/losing-your-job/can-you-insure-yourself-against-redundancy"
                    target="_blank"
                    rel="noreferrer"
                    withIcon={false}
                  >
                    what insurance policies you have
                  </Link>{' '}
                  as job loss protection might be included.
                </p>
              </div>
              <p className="pb-6 pr-4 text-end text-md">
                (approximately <strong>3 minute</strong>&nbsp;read)
              </p>
            </InformationCallout>
          </div>
        </div>
      </>
    ),
    cy: (
      <>
        <H2 className="mb-8 text-blue-700">Paratoi ar gyfer diswyddo </H2>
        <div className="grid grid-cols-1 lg:grid-cols-10 lg:gap-x-6">
          <div className="lg:col-span-5">
            <InformationCallout
              variant="default"
              testId=""
              className="flex flex-col h-full"
            >
              <div>
                <h3 className="text-[20px] font-bold lg:text-[22px] pt-6 lg:pt-8 pl-6 lg:pl-8">
                  Deall eich hawliau 
                </h3>
              </div>
              <div>
                <p className="pl-6 pr-4 my-4 lg:pl-8 lg:pr-8 text-md">
                  Pan fyddwch chi'n wynebu diswyddiad, mae gennych hawliau
                  cyfreithiol sy'n sicrhau eich bod yn cael eich trin yn deg gan
                  eich cyflogwr. Dysgwch fwy am{' '}
                  <Link
                    href="https://www.moneyhelper.org.uk/cy/work/losing-your-job/your-legal-rights-when-facing-redundancy"
                    target="_blank"
                    rel="noreferrer"
                    withIcon={false}
                  >
                    eich hawliau cyfreithiol
                  </Link>
                  .{' '}
                </p>
              </div>
              <div className="flex-grow" />
              <p className="pb-6 pr-4 text-end text-md">
                (tua <strong>6 munud</strong>&nbsp;i ddarllen)
              </p>
            </InformationCallout>
          </div>
          <div className="lg:col-span-5">
            <InformationCallout
              variant="default"
              testId=""
              className="flex flex-col h-full"
            >
              <div>
                <h3 className="text-[20px] font-bold lg:text-[22px] pt-6 lg:pt-8 pl-6 lg:pl-8">
                  Gwiriwch a ydych chi'n cael eich yswirio 
                </h3>
              </div>
              <div>
                <p className="pl-6 pr-4 my-4 lg:pl-8 lg:pr-8 text-md">
                  Efallai eich bod wedi cymryd yswiriant i'ch diogelu rhag ofn
                  colli swydd. Mae bob amser yn werth gwirio{' '}
                  <Link
                    href="https://www.moneyhelper.org.uk/cy/work/losing-your-job/can-you-insure-yourself-against-redundancy"
                    target="_blank"
                    rel="noreferrer"
                    withIcon={false}
                  >
                    pa bolisïau yswiriant sydd gennych
                  </Link>{' '}
                  fel y gallai diogelwch colli swydd gael eu cynnwys.
                </p>
              </div>
              <p className="pb-6 pr-4 text-end text-md">
                (tua <strong>3 munud</strong>&nbsp;i ddarllen)
              </p>
            </InformationCallout>
          </div>
        </div>
      </>
    ),
  },
  lastDayChecklist: {
    en: (
      <Checklist
        title="On your last day at work you should receive the following:"
        items={[
          <>
            Any redundancy pay, wages, holiday pay and other money due to you
          </>,
          <>Job reference from your employer</>,
          <>A letter stating the date of your redundancy</>,
          <>Your P45</>,
          <>Details of your pension arrangements</>,
        ]}
      />
    ),
    cy: (
      <Checklist
        title="Ar eich diwrnod olaf yn y gwaith, dylech gael y pethau canlynol:"
        items={[
          <>
            Unrhyw dâl dileu swydd, cyflog, tâl gwyliau ac arian arall sy'n
            ddyledus i chi
          </>,
          <>Tystlythyr swydd gan eich cyflogwr</>,
          <>Llythyr sy'n nodi dyddiad dileu eich swydd</>,
          <>Eich P45</>,
          <>Manylion eich trefniadau pensiwn</>,
        ]}
      />
    ),
  },
  printedGuide: {
    en: (
      <>
        <H2 className="text-blue-700 md:text-5xl">Read our printed guide</H2>
        <span>
          <p>
            <Link
              href="/files/RH_Apr25_Ed1_Eng.pdf"
              target="_blank"
              withIcon={false}
              className="my-[32px]"
            >
              Download the Redundancy handbook
              <Icon type={IconType.DOWNLOAD} />
            </Link>{' '}
            (PDF, 947 KB)
          </p>
        </span>
        <Image
          src="/images/pdf-preview.png"
          alt="PDF Preview"
          width={201}
          height={272}
          className="border border-solid border-slate-400"
        />
      </>
    ),
    cy: (
      <>
        <H2 className="text-blue-700">Darllenwch ein canllaw printiedig</H2>
        <span>
          <p>
            <Link
              href="/files/RH_Apr25_Ed1_Eng.pdf"
              target="_blank"
              withIcon={false}
              className="my-[32px]"
            >
              Lawrlwythwch y llawlyfr diswyddo
              <Icon type={IconType.DOWNLOAD} />
            </Link>{' '}
            (PDF, 947 KB)
          </p>
        </span>
        <Image
          src="/images/pdf-preview.png"
          alt="PDF Preview"
          width={201}
          height={272}
          className="border border-solid border-slate-400"
        />
      </>
    ),
  },
};

export default copy;

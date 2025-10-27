import Facebook from '@maps-react/common/assets/images/facebook.svg';
import Mail from '@maps-react/common/assets/images/mail.svg';
import Twitter from '@maps-react/common/assets/images/twitter.svg';

import GetHelpWithYourBills from '../public/images/laughing-elderly-couple.png';
import BenefitsCalculator from '../public/images/smiling-young-man-and-woman-looking-at-mobile-phone.png';
import DebtAdvice from '../public/images/woman-with-laptop-reading-a-bill.jpg';
import SavingsCalculator from '../public/images/womans-hands-opening-red-purse.jpg';
import { TranslationGroup } from './types';

const MONTHLY_FREQUENCY = 30.416666666666668;

export type Fields = {
  readonly name: string;
  readonly title?: TranslationGroup;
  readonly information?: TranslationGroup;
  readonly group: string;
  createAdditionalItems?: (section: string) => object;
  defaultFactorValue: number;
};

type Tabs = {
  readonly name: string;
  readonly title: TranslationGroup;
  readonly colour?: string;
  readonly nextTab?: string;
  readonly submit?: TranslationGroup;
  readonly function?: (value: number, total?: number) => number;
  readonly fields?: Fields[];
};

type Groups = {
  readonly [key: string]: TranslationGroup;
};

type Select = {
  readonly name: string;
  readonly welshName: string;
  readonly value: number;
  title: TranslationGroup;
};

type SelectName =
  | 'day'
  | 'week'
  | '2-weeks'
  | '4-weeks'
  | 'month'
  | 'quarter'
  | '6-months'
  | 'year';

export const select: Select[] = [
  {
    name: 'day',
    welshName: 'Dydd',
    value: MONTHLY_FREQUENCY,
    title: {
      en: 'Per day',
      cy: 'Fesul dydd',
    },
  },
  {
    name: 'week',
    welshName: 'Wythnos',
    value: MONTHLY_FREQUENCY / 7,
    title: {
      en: 'Per week',
      cy: 'Fesul wythnos',
    },
  },
  {
    name: '2-weeks',
    welshName: '2 wythnos',
    value: MONTHLY_FREQUENCY / 14,
    title: {
      en: 'Per 2 weeks',
      cy: 'Fesul 2 wythnos',
    },
  },
  {
    name: '4-weeks',
    welshName: '4 wythnos',
    value: MONTHLY_FREQUENCY / 28,
    title: {
      en: 'Per 4 weeks',
      cy: 'Fesul 4 wythnos',
    },
  },
  {
    name: 'month', // @note: Standard unit, 30 days.
    welshName: 'Mis',
    value: 1,
    title: {
      en: 'Per month',
      cy: 'Fesul mis',
    },
  },
  {
    name: 'quarter',
    welshName: 'Chwarter',
    value: 1 / 3,
    title: {
      en: 'Per quarter',
      cy: 'Fesul chwarter',
    },
  },
  {
    name: '6-months',
    welshName: '6 mis',
    value: 1 / 6,
    title: {
      en: 'Per 6 months',
      cy: 'Fesul 6 mis',
    },
  },
  {
    name: 'year',
    welshName: 'Blwyddyn',
    value: 1 / 12,
    title: {
      en: 'Per year',
      cy: 'Fesul blwyddn',
    },
  },
];

function add(value: number, total?: number) {
  return (total || 0) + value;
}

function subtract(value: number, total?: number) {
  return (total || 0) - value;
}

function getFactorValue(selectName: SelectName): number {
  const result = select.find((item) => item.name === selectName);
  return result?.value ?? 1;
}

export const API_ENDPOINT = '/api';
const ADDITIONAL_ITEMS = 5;
export const ENCODED_SHARE_LINK_TITLE =
  'Budget%20Planner%20%E2%80%93%20Free%20online%20daily%2C%20monthly%20and%20yearly%20budget%20planning%20tool';
export const ENCODED_BODY = {
  en: 'Copy%20and%20paste%20the%20below%20URL%20in%20your%20browser.',
  cy: 'Copïwch%20a%20gludiwch%20yr%20URL%20isod%20i’ch%20porwr.',
};
export const ENCODED_NEW_LINE = '%0D%0A';

export const createAdditionalItems = (section: string) =>
  Array.from({ length: ADDITIONAL_ITEMS }, (_, index) => ({
    group: 'additional',
    type: 'text',
    name: `${section}-additional-field-${index}`,
    title: {
      en: 'Your additional item',
      cy: 'Eich eitemau ychwanegol',
    },
    defaultFactorValue: 1,
  }));

const tabs: Tabs[] = [
  {
    name: 'income',
    title: {
      en: 'Income',
      cy: 'Incwm',
    },
    nextTab: `household-bills`,
    submit: {
      en: 'Household bills',
      cy: "Biliau'r cartref",
    },
    function: add,
    fields: [
      // PAY
      {
        defaultFactorValue: 1,
        name: 'pay',
        title: {
          en: 'Pay (after tax)',
          cy: 'Tâl (ar ôl treth)',
        },
        information: {
          en: (
            <>
              <p>
                You can find this on your payslip or bank statement. Enter the
                exact amount you get paid after tax, National Insurance and
                other deductions (such as pension contributions, student loan
                repayments and so on) have been taken off.
              </p>
              <p>{`Can't make sense of your payslip?`}</p>
              <p>
                See our guide:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/work/employment/understanding-your-payslip"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Understanding your payslip
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Cewch hyd i hwn ar eich slip cyflog neu gyfriflen banc. Rhowch
                yr union gyfanswm a gewch wedi i chi dalu treth, Yswiriant
                Gwladol ac wedi i ddidyniadau eraill (megis cyfraniadau pensiwn,
                ad-daliadau benthyciad myfyriwr ac ati) gael eu tynnu.
              </p>
              <p>
                Cael trafferth deall eich slip cyflog? Darllenwch ein canllaw:{' '}
                <a
                  href="https://www.moneyadviceservice.org.uk/cy/articles/deall-eich-slip-cyflog"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Deall eich slip cyflog
                </a>
              </p>
            </>
          ),
        },
        group: 'pay',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'self-employment',
        title: {
          en: 'Income from self-employment',
          cy: 'Incwm o hunangyflogaeth',
        },
        information: {
          en: "Enter your expected 'net profit' (your business income minus your expenses) for this year. Be sure to use the dropdown menu to show that this is your yearly income.",
          cy: "Rhowch eich 'elw net' disgwyliedig (incwm eich busnes minws eich costau) am y flwyddyn hon. Sicrhewch eich bod yn defnyddio'r gwymplen i ddangos mai hwn yw eich incwm blynyddol.",
        },
        group: 'pay',
      },
      {
        defaultFactorValue: 1,
        name: 'statutory-pay-sick',
        title: {
          en: 'Statutory Sick Pay',
          cy: 'Tâl Salwch Statudol',
        },
        information: {
          en: 'This should be listed as a separate item on your payslip. If you also qualify for occupational sick pay, this should be shown as a separate figure, in which case, add the two together.',
          cy: 'Dylai hwn gael ei restru fel eitem ar wahân ar eich slip cyflog. Os ydych yn gymwys ar gyfer tâl salwch galwedigaethol, dylid dangos hwn fel ffigwr ar wahân, ac os felly, adiwch y ddau gyda’i gilydd.',
        },
        group: 'pay',
      },
      {
        defaultFactorValue: 1,
        name: 'statutory-maternity-pay',
        title: {
          en: 'Statutory Maternity Pay or Statutory Adoption Pay',
          cy: 'Tâl Mamolaeth Statudol neu Dâl Mabwysiadu Statudol ',
        },
        information: {
          en: (
            <>
              <p>
                {`The amount you get depends on how much you earn and how long
                you've been off work. It should be listed as a separate item on
                your payslip.`}
              </p>
              <p>
                {`You can find more details on maternity pay, including how much you're entitled to, on`}{' '}
                <a
                  href="https://www.gov.uk/maternity-pay-leave"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  GOV.UK
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                {`Mae'r swm a gewch yn dibynnu ar faint yr ydych yn ei ennill
                ac ers faint y buoch i ffwrdd o'ch gwaith. Dylai hwn gael
                ei restru fel eitem ar wahân ar eich slip cyflog.`}
              </p>
              <p>
                Gallwch gael rhagor o fanylion am dâl mamolaeth, gan gynnwys
                faint allwch chi ei hawlio, ar{' '}
                <a
                  href="https://www.gov.uk/maternity-pay-leave"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  GOV.UK
                </a>
              </p>
            </>
          ),
        },
        group: 'pay',
      },
      // BENEFITS AND TAX CREDITS
      {
        defaultFactorValue: 1,
        name: 'universal-credit',
        title: {
          en: 'Universal Credit',
          cy: 'Credyd Cynhwysol',
        },
        information: {
          en: 'Universal Credit is being introduced in stages. The amount you get depends on your circumstances, so check the paperwork from the office that pays you, or look at your bank statement. Universal Credit is normally paid monthly.',
          cy: 'Mae Credyd Cynhwysol yn cael ei gyflwyno mewn camau. Mae’r swm rydych yn ei gael yn dibynnu ar eich amgylchiadau, felly gwiriwch y gwaith papur o’r swyddfa sy’n eich talu, neu edrychwch ar eich datganiad banc. Fel arfer caiff Credyd Cynhwysol ei dalu’n fisol.',
        },
        group: 'benefits-and-tax-credits',
      },
      {
        defaultFactorValue: getFactorValue('4-weeks'),
        name: 'working-tax-credit',
        title: {
          en: 'Working Tax Credit',
          cy: 'Credyd Treth Gwaith',
        },
        information: {
          en: "You can find this on your tax credits award notice or on your bank statement. It's normally paid either every week or every four weeks.",
          cy: 'Gallwch ddod o hyd i hwn ar eich hysbysiad dyfarniad credydau treth neu ar eich datganiad banc. Fel arfer caiff ei dalu naill ai bob wythnos neu bob pedwar wythnos',
        },
        group: 'benefits-and-tax-credits',
      },
      {
        defaultFactorValue: getFactorValue('4-weeks'),
        name: 'child-tax-credit',
        title: {
          en: 'Child Tax Credit',
          cy: 'Credyd Treth Plant',
        },
        information: {
          en: "You can find this on your tax credits award notice or on your bank statement. It's normally paid either every week or every four weeks.",
          cy: 'Cewch hyd i hwn ar eich rhybudd dyfarniad credydau treth neu gyfriflen banc. Fel arfer caiff ei dalu un ai bob wythnos neu bob pedair wythnos.',
        },
        group: 'benefits-and-tax-credits',
      },
      {
        defaultFactorValue: getFactorValue('4-weeks'),
        name: 'child-benefit',
        title: {
          en: 'Child Benefit',
          cy: 'Budd-dal Plant',
        },
        information: {
          en: (
            <>
              <p>
                You are usually entitled to Child Benefit for children you’re
                responsible for.
              </p>
              <p>
                You can find more information, including Child Benefit Rates, on
                the{' '}
                <a
                  href="https://www.gov.uk/child-benefit"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  GOV.UK
                </a>{' '}
                website
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Fel arfer mae gennych hawl i Fudd-dal Plant am blant rydych yn
                gyfrifol amdanynt.
              </p>
              <p>
                Gallwch ddod o hyd i ragor o wybodaeth, gan gynnwys Cyfraddau
                Budd-dal Plant, ar wefan{' '}
                <a
                  href="https://www.gov.uk/child-benefit"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  GOV.UK
                </a>
              </p>
            </>
          ),
        },
        group: 'benefits-and-tax-credits',
      },
      {
        defaultFactorValue: getFactorValue('2-weeks'),
        name: 'support',
        title: {
          en: 'Income Support',
          cy: 'Cymhorthdal Incwm',
        },
        information: {
          en: "Check your Income Support award notice, or look at your bank statement. The amount you get varies depending on things like how old you are and whether you have children. It's normally paid every two weeks.",
          cy: 'Gwiriwch eich hysbysiad dyfarniad Cymhorthdal Incwm, neu edrychwch ar eich datganiad banc. Mae’r swm a gewch yn amrywio yn dibynnu ar bethau fel eich oedran ac os oes gennych blant. Fel arfer caiff ei dalu bob pythefnos.',
        },
        group: 'benefits-and-tax-credits',
      },
      {
        defaultFactorValue: getFactorValue('2-weeks'),
        name: 'jobseekers-allowance',
        title: {
          en: "Jobseeker's Allowance",
          cy: 'Lwfans Ceisio Gwaith',
        },
        information: {
          en: "Check the paperwork from the office that pays your benefit, or look at your bank statement. The amount you get varies depending on things like how old you are and whether you have children. It's normally paid every two weeks.",
          cy: 'Gwiriwch y gwaith papur o’r swyddfa sy’n talu eich budd-dal, neu edrychwch ar eich datganiad banc. Mae’r swm a gewch yn amrywio yn dibynnu ar bethau fel eich oedran ac os oes gennych blant. Fel arfer caiff ei dalu bob pythefnos.',
        },
        group: 'benefits-and-tax-credits',
      },
      {
        defaultFactorValue: getFactorValue('2-weeks'),
        name: 'esa-or-incapacity-benefit',
        title: {
          en: 'Employment and Support Allowance (ESA) or Incapacity Benefit',
          cy: 'Lwfans Cyflogaeth a Chymorth (ESA) neu Fudd-dal Analluogrwydd',
        },
        information: {
          en: "Check your award notice, or look at your bank statement. The amount you get varies depending on how old you are and how long you're been claiming it. It's normally paid every two weeks.",
          cy: 'Gwiriwch eich hysbysiad dyfarniad, neu edrychwch ar eich datganiad banc. Mae’r swm a gewch yn amrywio yn dibynnu ar bethau fel eich oedran ac os oes gennych blant. Fel arfer caiff ei dalu bob pythefnos.',
        },
        group: 'benefits-and-tax-credits',
      },
      {
        defaultFactorValue: getFactorValue('4-weeks'),
        name: 'independence-payment',
        title: {
          en: 'Personal Independence Payment, Disability Living Allowance or Adult Disability Payment',
          cy: 'Taliad Annibyniaeth Personol, Lwfans Byw i’r Anabl neu Daliad Anabledd Oedolion',
        },
        information: {
          en: "Check your award notice, or look at your bank statement. The amount you get varies depending on the nature of your disability and how much help you need. It's normally paid every four weeks",
          cy: 'Gwiriwch eich rhybudd o ddyfarniad, neu edrychwch ar eich cyfriflen banc. Bydd y swm a gewch yn amrywio gan ddibynnu ar natur eich anabledd a faint o gymorth sydd ei angen arnoch. Fel arfer caiff ei dalu bob pedair wythnos.',
        },
        group: 'benefits-and-tax-credits',
      },
      {
        defaultFactorValue: 1,
        name: 'pension-credit',
        title: {
          en: 'Pension Credit',
          cy: 'Credyd Pensiwn',
        },
        information: {
          en: "Check your award notice or bank statement to see exactly how much you get. The amount varies according to your other income and whether you're single or in a couple. Pension Credit is paid either: every week, every two weeks, or every four weeks.",
          cy: 'Gwiriwch eich hysbysiad dyfarniad, neu edrychwch ar eich datganiad banc. Mae’r swm a gewch yn amrywio yn ôl eich incwm arall ac os ydych yn sengl neu mewn cwpl. Caiff Credyd Pensiwn ei dalu naill ai: bob wythnos, bob pythefnos, neu bob pedwar wythnos.',
        },
        group: 'benefits-and-tax-credits',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'attendance-allowance',
        title: {
          en: 'Attendance Allowance',
          cy: 'Lwfans Gweini',
        },
        information: {
          en: "Check your award notice, or look at your bank statement. The amount you get varies depending on how much help you need. It's normally paid weekly.",
          cy: 'Gwiriwch eich rhybudd o ddyfarniad, neu edrychwch ar eich cyfriflen banc. Bydd y swm a gewch yn amrywio gan ddibynnu ar faint o gymorth sydd ei angen arnoch. Fel arfer caiff ei dalu bob wythnos.',
        },
        group: 'benefits-and-tax-credits',
      },
      {
        defaultFactorValue: getFactorValue('4-weeks'),
        name: 'carers-allowance',
        title: {
          en: "Carer's Allowance",
          cy: 'Lwfans Gofalydd',
        },
        information: {
          en: (
            <>
              <p>
                {`You can apply for Carer's Allowance if you care for someone at
                least 35 hours a week and they get certain benefits.`}
              </p>
              <p>
                You can find out more, including rates, on the{' '}
                <a
                  href="https://www.gov.uk/carers-allowance"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  GOV.UK
                </a>{' '}
                website.
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Gallwch ymgeisio am Lwfans Gofalwr os ydych yn gofalu am rywun
                am 35 awr yr wythnos o leiaf a bod yr unigolyn yn cael rhai
                budd-daliadau penodol.
              </p>
              <p>
                Gallwch ganfod rhagor, gan gynnwys y cyfraddau, ar wefan{' '}
                <a
                  href="https://www.gov.uk/carers-allowance"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  GOV.UK
                </a>
              </p>
            </>
          ),
        },
        group: 'benefits-and-tax-credits',
      },
      {
        defaultFactorValue: 1,
        name: 'housing-benefit',
        title: {
          en: 'Housing Benefit',
          cy: 'Budd-dal Tai',
        },
        information: {
          en: 'Check your award notice to find out how much you get. Housing Benefit can be paid weekly, fortnightly, four-weekly or monthly.\nIf your Housing Benefit goes directly to your landlord leave this box blank. \nIf you receive the Housing Benefit and pay your landlord yourself enter the amount you get here.',
          cy: "Gwiriwch eich rhybudd o ddyfarniad i gael gwybod faint a gewch. Gellir talu Budd-dal Tai yn wythnosol, bob pythefnos, bob pedair wythnos neu'n fisol\nOs yw eich Budd-dal Tai yn cael ei dalu'n uniongyrchol i'ch landlord yna gadewch y blwch hwn yn wag.\nOs ydych yn cael Budd-dal Tai ac yn talu eich landlord eich hun rhowch y swm a gewch yma.",
        },
        group: 'benefits-and-tax-credits',
      },
      // PENSIONS
      {
        defaultFactorValue: getFactorValue('4-weeks'),
        name: 'state-pension',
        title: {
          en: 'State pension',
          cy: 'Pensiwn y wladwriaeth',
        },
        information: {
          en: (
            <>
              <p>
                {`If you're getting the State Pension it will show on your bank
                statement as being paid by DWP (the Department for Work and
                Pensions) and alongside your National Insurance number.`}
              </p>
              <p>
                You can find more information, including rates, on{' '}
                <a
                  href="https://www.gov.uk/state-pension"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  GOV.UK
                </a>{' '}
                website.
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Os ydych yn cael Pensiwn y Wladwriaeth bydd yn ymddangos ar eich
                cyfriflen banc fel taliad gan y DWP (yr Adran Gwaith a
                Phensiynau) ac wrth ochr eich rhif Yswiriant Gwladol.
              </p>
              <p>
                Gallwch gael rhagor o wybodaeth, gan gynnwys y cyfraddau ar
                wefan{' '}
                <a
                  href="https://www.gov.uk/state-pension"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  GOV.UK
                </a>
              </p>
            </>
          ),
        },
        group: 'pension',
      },
      {
        defaultFactorValue: 1,
        name: 'workplace-pension',
        title: {
          en: 'Workplace pension - Defined benefit ',
          cy: 'Pensiwn gweithle – Budd-dal wedi’u diffinio',
        },
        information: {
          en: "If you're being paid a workplace pension you can find the exact amount on your payslip or bank statement. Enter the amount you get paid after tax has been taken off. Your workplace pension is usually paid monthly.",
          cy: "Os ydych yn cael taliad pensiwn gweithle cewch hyd i'r union swm ar eich slip cyflog neu gyfriflen banc. Rhowch y swm a gewch wedi i dreth gael ei ddidynnu. Fel arfer telir eich pensiwn gweithle'n fisol.",
        },
        group: 'pension',
      },
      {
        defaultFactorValue: 1,
        name: 'self-investment-pension',
        title: {
          en: 'Self-invested personal pension',
          cy: 'Pensiwn Buddsoddi Personol',
        },
        information: {
          en: 'Your pension provider will send you annual statements, telling you how much your fund is worth. From the age of 55 (rising to 57 in 2028), you can choose to begin taking money from your pension pot.',
          cy: 'Bydd eich darparwr pensiwn yn anfon datganiadau blynyddol, yn dweud wrthych beth yw gwerth eich cronfa. O’r oedran 55 (yn cynyddu i 57 yn 2028), gallwch benderfynu cymryd arian o’ch cronfa bensiwn. ',
        },
        group: 'pension',
      },
      {
        defaultFactorValue: 1,
        name: 'annuity',
        title: {
          en: 'Annuity income',
          cy: 'Incwm blwydd-dal',
        },
        information: {
          en: 'You can use your pension pot to buy a lifetime annuity, a guaranteed income for life. Or you can buy an income for a fixed term, also known as a fixed term annuity. You can usually choose to take up to 25% of your pot as a one-off tax-free lump sum at the start.',
          cy: 'Gallwch ddefnyddio’ch cronfa bensiwn i brynu blwydd-dal gydol oes, incwm gwarantedig am fywyd. Neu gallwch brynu incwm am gyfnod sefydlog, a elwir hefyd yn flwydd-dal cyfnod sefydlog. Gallwch fel arfer dewis cymryd hyd at 25% o’ch cronfa fel cyfandaliad untro di-dreth ar y dechrau. ',
        },
        group: 'pension',
      },
      {
        defaultFactorValue: 1,
        name: 'drawdown',
        title: {
          en: 'Income drawdown',
          cy: 'Tynnu Incwm',
        },
        information: {
          en: 'Flexible retirement income is often referred to as pension drawdown, or flexi-access drawdown and is a way of taking money out of your pension pot to live on in retirement.',
          cy: "Cyfeirir at incwm ymddeol hyblyg yn aml fel tynnu pensiwn, neu dynnu mynediad hyblyg ac mae'n ffordd o dynnu arian allan o'ch cronfa bensiwn i fyw arno ar ôl ymddeol.",
        },
        group: 'pension',
      },
      {
        defaultFactorValue: 1,
        name: 'pension-other',
        title: {
          en: 'Other',
          cy: 'Arall',
        },
        // @todo finalised content spreadsheet is still missing other content in pension category
        information: {
          en: 'TBC',
          cy: 'TBC',
        },
        group: 'pension',
      },
      // OTHER INCOME
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'savings-investments',
        title: {
          en: 'Income from savings & investments',
          cy: 'Incwm o gynilion a buddsoddiadau',
        },
        information: {
          en: 'If you have savings accounts check your savings statements to see how much interest you earn. If you have investments such as shares or bonds, check your paperwork to see how much of a return you make.\nWhether or not you owe any tax will depend on the type of investments you have and will be paid via your tax return.',
          cy: 'Os oes gennych gyfrifon cynilo gwiriwch eich cyfriflenni cynilo i weld faint o log gallwch ei ennilll. Os oes gennych fuddsoddiadau megis cyfranddaliadau neu fondiau, gwiriwch eich gwaith papur i ganfod faint fydd eich elw.\nBydd unrhyw dreth sydd yn ddyledus gennych yn dibynnu ar y math o fuddsoddiadau sydd gennych a byddwch yn talu drwy eich ffurflen dreth.',
        },
        group: 'other-income',
      },
      {
        defaultFactorValue: 1,
        name: 'rent-or-board',
        title: {
          en: 'Rent or board',
          cy: 'Rhentu neu breswylio',
        },
        information: {
          en: (
            <>
              <p>
                If you have a lodger or a grown-up child who lives at home and
                pays you rent, enter the amount here.
              </p>
              <p>
                To find out more about private renting, including tax rates,
                visit{' '}
                <a
                  href="https://www.gov.uk/private-renting"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  GOV.UK
                </a>
                .
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Os oes gennych letywr neu blentyn hŷn sy&apos;n byw adref ac yn
                talu rhent, rhowch y swm yma.
              </p>
              <p>
                I ddysgu rhagor am rentu preifat, gan gynnwys cyfraddau treth,
                ewch i{' '}
                <a
                  href="https://www.gov.uk/private-renting"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  GOV.UK
                </a>
              </p>
            </>
          ),
        },
        group: 'other-income',
      },
      {
        defaultFactorValue: 1,
        name: 'child-maintenance',
        title: {
          en: 'Child maintenance',
          cy: 'Cynhaliaeth plant',
        },
        information: {
          en: (
            <>
              <p>
                {`Enter the full amount of child maintenance or child support that
                you get from your ex. If the amount varies, add up everything
                you received last year and enter that, selecting 'year' from the
                dropdown menu. That way, the calculator will work out an average
                monthly amount for you.`}
              </p>
              <p>
                If you want to know more about your right to child maintenance,
                see our guide:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/family-and-care/divorce-and-separation/how-do-i-arrange-child-maintenance"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  How do I arrange child maintenance?
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Rhowch y swm llawn o gynhaliaeth plant neu gostau cynnal plant a
                gewch gan eich cynbriod neu gynbartner. Os yw&apos;r swm yn
                amrywio, cyfrifwch bopeth a gawsoch y flwyddyn ddiwethaf a
                rhowch y ffigwr hwn, gan ddewis &apos;blynyddol&apos; o&apos;r
                gwymplen. Drwy wneud hynny, bydd y cyfrifiannell yn cyfrifo swm
                misol cyfartalog i chi.
              </p>
              <p>
                Os byddwch am gael gwybod rhagor ynglŷn â&apos;ch hawl i gael
                cynhaliaeth plant, darllenwch ein canllaw:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/cy/family-and-care/divorce-and-separation/how-do-i-arrange-child-maintenance"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Hawlio cynhaliaeth plant oddi wrth eich cynbartner
                </a>
              </p>
            </>
          ),
        },
        group: 'other-income',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'student-loans-and-grants',
        title: {
          en: 'Student loans & grants',
          cy: 'Benthyciadau a grantiau myfyrwyr',
        },
        information: {
          en: "If you're in education and receiving a student loan or grant, enter the amount here. Don't enter your tuition fee loan, just the maintenance loan and anything else you get to help with living costs. Make sure you add the amount you get for all three terms together and select 'year' from the dropdown menu.",
          cy: "Os ydych mewn addysg ac yn cael benthyciad neu grant myfyriwr, rhowch y swm yma. Peidiwch â rhoi eich benthyciad ffioedd dysgu, dim ond y benthyciad cynhaliaeth ac unrhyw beth arall a gewch i roi cymorth i chi gyda chostau byw. Sicrhewch eich bod yn adio'r swm a gewch ar gyfer y tair elfen gyda'i gilydd ac yna dewis 'blynyddol' o'r gwymplen.",
        },
        group: 'other-income',
      },
      {
        defaultFactorValue: 1,
        name: 'other-financial-support',
        title: {
          en: 'Other financial support',
          cy: 'Cymorth ariannol arall',
        },
        information: {
          en: 'If you have any other money coming in regularly, perhaps money from a charity or other organisation, enter it here.',
          cy: 'Os oes gennych unrhyw arian arall a gewch fel incwm rheolaidd, arian gan elusen efallai neu gan sefydliad arall, rhowch hynny yma.',
        },
        group: 'other-income',
      },
      {
        defaultFactorValue: 1,
        name: 'gifts',
        title: {
          en: 'Gifts from family & friends',
          cy: 'Rhoddion gan deulu a ffrindiau',
        },
        information: {
          en: 'If your parents - or anyone else - regularly give you money to live on, enter the amount here.',
          cy: "Os yw eich rhieni - neu unrhyw un arall - yn rhoi arian i chi'n rheolaidd fel costau byw, rhowch y swm yma.",
        },
        group: 'other-income',
      },
      ...createAdditionalItems('income'),
    ],
  },
  {
    name: 'household-bills',
    title: {
      en: 'Household bills',
      cy: "Biliau'r cartref",
    },
    colour: '#00788E',
    nextTab: `living-costs`,
    submit: {
      en: 'Living costs',
      cy: 'Costau byw',
    },
    function: subtract,
    fields: [
      // MORTGAGE & RENT
      {
        defaultFactorValue: 1,
        name: 'mortgage',
        title: {
          en: 'Mortgage repayment',
          cy: 'Ad-daliad morgais',
        },
        information: {
          en: (
            <>
              <p>Enter your monthly mortgage repayment here.</p>
              <p>
                {`If you have an interest-only mortgage plus an endowment (or
                something similar) - put the interest payment here and the other
                figure in the 'Mortgage endowment' box below.`}
              </p>
              <p>
                See if you can save yourself some money on your mortgage:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/homes/buying-a-home/remortgaging-to-cut-costs"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Remortgaging to cut costs
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>Rhowch eich ad-daliad morgais misol yma.</p>
              <p>
                {`Os oes gennych forgais llog yn unig yn ogystal â morgais gwaddol (neu rywbeth cyffelyb) – rhowch y taliad llog yma a'r ffigwr arall yn y blwch 'morgais gwaddol' isod.`}{' '}
              </p>
              <p>
                Gwiriwch i weld a allwch arbed ychydig o arian ar eich morgais:
                <a
                  href="https://www.moneyhelper.org.uk/cy/homes/buying-a-home/remortgaging-to-cut-costs"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Ailforgeisio i dorri costau
                </a>
              </p>
            </>
          ),
        },
        group: 'mortgage-rent',
      },
      {
        defaultFactorValue: 1,
        name: 'rent',
        title: {
          en: 'Rent',
          cy: 'Rhent',
        },
        information: {
          en: (
            <>
              <p>
                Enter your rent here and make sure you select the correct
                frequency (for example monthly or weekly).
              </p>
              <p>
                - If your rent is covered by Housing Benefit which goes directly
                to your landlord leave this box blank.
              </p>
              <p>
                - If you pay some or all of your rent yourself enter the amount
                you pay here.
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Rhowch eich rhent yma a sicrhewch eich bod yn dewis yr amledd
                cywir (misol neu wythnosol er enghraifft).
              </p>
              <p>
                {`Os yw rhent yn cael ei dalu gan Fudd-dal Tai yn uniongyrchol
                i'ch landlord yna gadewch y blwch hwn yn wag.`}
              </p>
              <p>
                {`Os ydych yn talu rhan o'ch rhent eich hun, neu'r cyfan, rhowch y
                swm hynny yma.`}
              </p>
            </>
          ),
        },
        group: 'mortgage-rent',
      },
      {
        defaultFactorValue: 1,
        name: 'endowment',
        title: {
          en: 'Mortgage endowment',
          cy: 'Gwaddol morgais',
        },
        information: {
          en: (
            <>
              <p>
                A mortgage endowment is an investment product that is set up as
                a regular savings plan which pays out a lump sum at the end of
                your mortgage term. You might have one of these if you have an
                interest-only mortgage.
              </p>
              <p>
                Just enter here the amount you pay into the endowment. Put the
                interest payment in the box above.
              </p>
              <p>
                {`If you're worried that your endowment might not cover the amount
                owed at the end of your mortgage term you should act now. See
                our guide:`}{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/homes/buying-a-home/dealing-with-an-endowment-shortfall"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Dealing with an endowment shortfall
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                {`Mae morgais gwaddol yn gynnyrch buddsoddiad sydd yn gynllun
                cynilo rheolaidd sy'n rhyddhau cyfandaliad ar ddiwedd cyfnod
                eich morgais. Efallai bod gennych un o'r rhain os oes gennych
                forgais llog yn unig.`}
              </p>
              <p>
                {`Rhowch y swm yr ydych yn ei dalu i mewn i'r morgais gwaddol.
                Rhowch y taliad llog yn y blwch uchod.`}
              </p>
              <p>
                {`Os ydych yn bryderus na fydd eich morgais gwaddol yn cwrdd â'r hyn fydd yn ddyledus ar ddiwedd cyfnod eich morgais dylech ddelio â hyn yn syth. Gweler ein canllaw:`}{' '}
                <a
                  href="https://www.moneyhelper.org.uk/cy/homes/buying-a-home/dealing-with-an-endowment-shortfall"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Delio gyda diffyg gwaddol
                </a>
              </p>
            </>
          ),
        },
        group: 'mortgage-rent',
      },
      {
        defaultFactorValue: 1,
        name: 'insurance',
        title: {
          en: 'Mortgage life insurance',
          cy: 'Yswiriant bywyd morgais',
        },
        information: {
          en: (
            <>
              <p>
                Mortgage life insurance pays out a lump sum to cover your
                outstanding mortgage debt if you die.
              </p>
              <p>
                Check your policy details or your bank statement to find out
                exactly what your monthly premiums are.
              </p>
              <p>
                {`If you haven't checked your policy lately you might find that
                it's worth shopping around. Find out more in our guide:`}{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/insurance/what-is-life-insurance"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  How and where to buy life insurance
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Mae morgais yswiriant bywyd yn talu cyfandaliad i dalu unrhyw
                ddyled morgais sydd ar ôl gennych os ydych yn marw.
              </p>
              <p>
                Gwiriwch fanylion eich polisi neu eich datganiad banc i
                ddarganfod yn union beth yw eich premiymau misol.
              </p>
              <p>
                Os nad ydych wedi gwirio’ch polisi yn ddiweddar efallai byddwch
                yn darganfod ei fod yn werth siopa o gwmpas. Darganfyddwch fwy
                yn ein canllaw:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/cy/everyday-money/insurance/what-is-life-insurance"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Sut a ble i brynu yswiriant bywyd
                </a>
              </p>
            </>
          ),
        },
        group: 'mortgage-rent',
      },
      // OTHER PROPERTY CHARGES
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'ground-rent',
        title: {
          en: 'Ground rent',
          cy: 'Rhent tir',
        },
        information: {
          en: (
            <>
              <p>
                This is an annual amount that you pay if you own a leasehold
                property. Most flats and maisonettes are leasehold properties.
              </p>
              <p>
                {`It's usually a small amount (such as £100 or £200 a year). If
                you're not sure how much you pay, check your lease for the
                amount.`}
              </p>
              <p>(This does not apply in Scotland.)</p>
            </>
          ),
          cy: (
            <>
              <p>
                {`Dyma swm blynyddol yr ydych yn ei dalu os ydych yn berchen ar
                eiddo lesddaliad. Mae'r rhan fwyaf o fflatiau a maisonettes yn
                eiddo lesddaliad.`}
              </p>
              <p>
                {`Mae'n swm bychan fel arfer (£100 neu £200 y flwyddyn). Os ydych
                yn ansicr faint yr ydych yn ei dalu, gwiriwch y les am y swm.`}
              </p>
              <p>(Nid yw hyn yn berthnasol yn yr Alban.)</p>
            </>
          ),
        },
        group: 'other-property',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'service-charge',
        title: {
          en: 'Service charge',
          cy: 'Tâl gwasanaeth',
        },
        information: {
          en: (
            <>
              <p>
                {`You pay this to the freeholder of your leasehold property or to
                a managing agent to cover the upkeep of communal areas in a
                block of flats. (It's known as factoring charge in Scotland.)`}
              </p>
              <p>
                {`If you're not sure how much your service charge is, check your
                lease for the amount.`}
              </p>
              <p>
                {`If you're renting, the service charge is normally included in the rent.`}
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                {`Rydych yn talu hyn i rydd-ddeiliad eich eiddo lesddaliad neu i
                asiant rheoli i dalu am gynnal a chadw mannau cymunedol mewn
                bloc o fflatiau. (Fe'i gelwir yn dâl ffactoreiddio yn yr Alban.)`}
              </p>
              <p>
                Os ydych yn ansicr faint yw swm eich ffi gwasanaeth, gwiriwch y
                les am y swm.
              </p>
              <p>
                {`Os ydych yn rhentu, yna mae'r ffi gwasanaeth yn cael ei gynnwys
                yn y rhent fel arfer.`}
              </p>
            </>
          ),
        },
        group: 'other-property',
      },
      // HOME INSURANCE
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'buildings-insurance',
        title: {
          en: 'Buildings insurance',
          cy: 'Yswiriant adeiladau',
        },
        information: {
          en: (
            <>
              <p>
                Buildings insurance covers the bricks and mortar of your home
                plus permanent fixtures and fittings like kitchens and
                bathrooms.
              </p>
              <p>
                If you pay a single premium for buildings and contents
                insurance, enter that amount once and leave the other box blank.
              </p>
              <p>
                {`If you're renting you can leave this box blank. Buildings
                insurance is your landlord's responsibility.`}
              </p>
              <p>
                Find out whether you could save on your home insurance:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/insurance/home-insurance-how-to-get-the-best-deal"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Home insurance - how to get the best deal
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                {`Mae yswiriant adeiladau yn diogelu adeiladwaith eich cartref yn
                ogystal â'r celfi sefydlog, fel ceginau ac ystafelloedd ymolchi.`}
              </p>
              <p>
                Os ydych yn talu premiwm sengl ar gyfer yswiriant adeiladau a
                chynnwys, rhowch y swm unwaith gan adael y blwch arall yn wag.
              </p>
              <p>
                Os ydych yn rhentu cewch adael y blwch hwn yn wag. Cyfrifoldeb
                eich landlord yw yswiriant adeiladau.
              </p>
              <p>
                Gwiriwch a allech chi gael bargen well ar gyfer eich yswiriant
                cartref:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/cy/everyday-money/insurance/home-insurance-how-to-get-the-best-deal"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Yswiriant cartref - sut i gael y fargen orau
                </a>
              </p>
            </>
          ),
        },
        group: 'home-insurance',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'contents-insurance',
        title: {
          en: 'Contents insurance',
          cy: 'Yswiriant cynnwys',
        },
        information: {
          en: (
            <>
              <p>
                Contents insurance covers the things you keep in your home, like
                furniture, TVs and personal belongings.
              </p>
              <p>
                If you pay a single premium for buildings and contents
                insurance, enter that amount once and leave the other box blank.
              </p>
              <p>
                Find out whether you could save on your home insurance:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/insurance/home-insurance-how-to-get-the-best-deal"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Home insurance - how to get the best deal
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                {`Mae yswiriant cynnwys yn diogelu'r pethau sydd yn eich cartref,
                fel dodrefn, setiau teledu ac eitemau personol.`}
              </p>
              <p>
                Os ydych yn talu premiwm sengl ar gyfer yswiriant adeiladau a
                chynnwys, rhowch y swm unwaith gan adael y blwch arall yn wag.
              </p>
              <p>
                Gwiriwch a allech chi gael bargen well ar gyfer eich yswiriant
                cartref:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/cy/everyday-money/insurance/home-insurance-how-to-get-the-best-deal"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Yswiriant cartref - sut i gael y fargen orau
                </a>
              </p>
            </>
          ),
        },
        group: 'home-insurance',
      },
      // UTILITIES
      {
        defaultFactorValue: 1,
        name: 'council-tax',
        title: {
          en: 'Council Tax or Rates',
          cy: 'Y Dreth Gyngor neu Ardrethi',
        },
        information: {
          en: (
            <p>
              {`Check your Council Tax bill (or Rates bill if you're in Northern
              Ireland) to find out the annual amount you pay. If you pay by
              Direct Debit, this is probably in 12 monthly payments, but some
              councils will bill you for 10 payments per year so check this
              before you enter the amount.`}
            </p>
          ),
          cy: (
            <p>
              {`Gwiriwch eich bil Treth Gyngor (neu bil Ardrethi os ydych yng
              Ngogledd Iwerddon) i ganfod faint yr ydych yn ei dalu'n
              flynyddol. Os ydych yn talu trwy Ddebyd Uniongyrchol, mae'n
              debyg y gwnewch 12 taliad misol, ond bydd rhai cynghorau yn eich
              bilio am 10 taliad y flwyddyn felly gwiriwch hyn cyn i chi
              roi'r swm.`}
            </p>
          ),
        },
        group: 'utilities',
      },
      {
        defaultFactorValue: 1,
        name: 'gas',
        title: {
          en: 'Gas',
          cy: 'Nwy',
        },
        information: {
          en: (
            <>
              <p>
                Check your bill or bank statement to see how much you spend on
                gas each month.
              </p>
              <p>
                If you pay for gas and electricity together, enter that amount
                once and leave the other box blank.
              </p>
              <p>
                {`If you have a prepay meter you'll need to add up how much you
                spend per year. If you put the yearly amount in, the calculator
                will work out an average monthly amount for you. That way, you
                can be sure you've taken into account both your winter and
                summer usage.`}
              </p>
              <p>
                Find out whether you could save yourself some money:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/credit/struggling-to-pay-your-gas-or-electricity-bill"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Save money on your gas and electricity bills
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Gwiriwch eich bil neu gyfriflen banc i ganfod faint wariwch chi
                ar nwy bob mis.
              </p>
              <p>
                {`Os ydych yn talu am nwy a thrydan gyda'i gilydd, rhowch y swm
                unwaith gan adael y blwch arall yn wag.`}
              </p>
              <p>
                {`Os oes gennych fesurydd rhagdalu bydd angen i chi gyfrifo faint
                wariwch chi bob blwyddyn. Os rhowch y swm blynyddol, bydd y
                cyfrifiannell yn cyfrifo swm misol cyfartalog i chi. Drwy wneud
                hynny, byddwch yn sicr o fod wedi ystyried eich defnydd gaeaf
                a'r haf.`}
              </p>
              <p>
                Gwiriwch a allech chi arbed arian:
                <a
                  href="https://www.moneyhelper.org.uk/cy/everyday-money/credit/struggling-to-pay-your-gas-or-electricity-bill"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Arbedwch arian ar eich biliau nwy a thrydan
                </a>
              </p>
            </>
          ),
        },
        group: 'utilities',
      },
      {
        defaultFactorValue: 1,
        name: 'electricity',
        title: {
          en: 'Electricity',
          cy: 'Trydan',
        },
        information: {
          en: (
            <>
              <p>
                Check your bill or bank statement to see how much you spend on
                gas each month.
              </p>
              <p>
                If you pay for gas and electricity together, enter that amount
                once and leave the other box blank.
              </p>
              <p>
                {`If you have a prepay meter you'll need to add up how much you
                spend per year. If you put the yearly amount in, the calculator
                will work out an average monthly amount for you. That way, you
                can be sure you've taken into account both your winter and
                summer usage.`}
              </p>
              <p>
                Find out whether you could save yourself some money:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/credit/struggling-to-pay-your-gas-or-electricity-bill"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Save money on your gas and electricity bills
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Gwiriwch eich bil neu gyfriflen banc i ganfod faint wariwch chi
                ar nwy bob mis.
              </p>
              <p>
                {`Os ydych yn talu am nwy a thrydan gyda'i gilydd, rhowch y swm
                unwaith gan adael y blwch arall yn wag.`}
              </p>
              <p>
                {`Os oes gennych fesurydd rhagdalu bydd angen i chi gyfrifo faint
                wariwch chi bob blwyddyn. Os rhowch y swm blynyddol, bydd y
                cyfrifiannell yn cyfrifo swm misol cyfartalog i chi. Drwy wneud
                hynny, byddwch yn sicr o fod wedi ystyried eich defnydd gaeaf
                a'r haf.`}
              </p>
              <p>
                Gwiriwch a allech chi arbed arian:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/cy/everyday-money/credit/struggling-to-pay-your-gas-or-electricity-bill"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Arbedwch arian ar eich biliau nwy a thrydan
                </a>
              </p>
            </>
          ),
        },
        group: 'utilities',
      },
      {
        defaultFactorValue: 1,
        name: 'other-fuel',
        title: {
          en: 'Other household fuel',
          cy: "Tanwydd arall i'r cartref",
        },
        information: {
          en: (
            <p>
              {`If you use oil, coal, wood, or any other type of fuel, enter the
                amount you spend here. If you add up how much you spend per
                year, the calculator will work out an average monthly amount for
                you. That way, you can be sure you've taken into account both
                your winter and summer fuel usage.`}
            </p>
          ),
          cy: (
            <p>
              {`Os ydych yn defnyddio olew, glo, coed neu unrhyw fath arall o
              danwydd, rhowch y swm wariwch chi yma. Os cyfrifwch faint wariwch
              chi bob blwyddyn, bydd y cyfrifiannell yn cyfrifo swm misol
              cyfartalog i chi. Drwy wneud hynny, byddwch yn sicr o fod wedi
              ystyried eich defnydd gaeaf a'r haf o danwydd.`}
            </p>
          ),
        },
        group: 'utilities',
      },
      {
        defaultFactorValue: 1,
        name: 'water',
        title: {
          en: 'Water',
          cy: 'Dŵr',
        },
        information: {
          en: (
            <>
              <p>
                Check your bill or bank statement to see how much you spend on
                water each month.
              </p>
              <p>
                {`If you have a water meter, add up how much you spend per year.
                The calculator will work out an average monthly amount for you.
                That way, you can be sure you've taken into account things like
                watering the garden in the summer.`}
              </p>
              <p>
                Find out whether you could get a better deal:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/credit/struggling-to-pay-your-gas-or-electricity-bill"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Save money on your water bills
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Gwiriwch eich bil neu gyfriflen banc i ganfod faint wariwch chi
                ar ddŵr bob mis.
              </p>
              <p>
                {`Os oes gennych fesurydd dŵr cyfrifwch faint wariwch chi bob
                blwyddyn. Bydd y cyfrifiannell yn cyfrifo swm misol cyfartalog i
                chi. Drwy wneud hynny, byddwch yn sicr o fod wedi ystyried
                pethau fel dyfrio'r ardd yn yr haf. `}
              </p>
              <p>
                Gwiriwch a allech chi gael bargen well:
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/credit/struggling-to-pay-your-gas-or-electricity-bill"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Arbed arian ar eich bil dŵr
                </a>
              </p>
            </>
          ),
        },
        group: 'utilities',
      },
      {
        defaultFactorValue: 1,
        name: 'home-phone',
        title: {
          en: 'Home phone and broadband',
          cy: 'Ffôn cartref a band eang',
        },
        information: {
          en: (
            <>
              <p>
                Check your bill or bank statement to see how much you spend. If
                you pay separately for your line rental and calls, make sure you
                include both here.
              </p>
              <p>
                If you pay for your landline, TV and broadband as a package
                enter that amount once and leave the other boxes blank.
              </p>
              <p>
                Find out whether you could you could get a better deal:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/credit/struggling-to-pay-your-gas-or-electricity-bill"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Save money on your home phone and broadband
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                {`Gwiriwch eich bil neu gyfriflen banc i ganfod faint wariwch chi.
                Os ydych yn talu am rentu'ch llinell a'r galwadau ar wahân,
                sicrhewch eich bod yn cynnwys y ddau yma.`}
              </p>
              <p>
                {`Os ydych yn talu am eich llinell dir, teledu a band eang gyda'i
                gilydd, rhowch y swm unwaith gan adael y blychau eraill yn wag. `}
              </p>
              <p>
                Gwiriwch a allech chi gael bargen well:
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/credit/struggling-to-pay-your-gas-or-electricity-bill"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Arbedwch arian ar eich ffôn cartref a band eang
                </a>
              </p>
            </>
          ),
        },
        group: 'utilities',
      },
      {
        defaultFactorValue: 1,
        name: 'mobile',
        title: {
          en: 'Mobile phone',
          cy: 'Ffôn symudol', // @todo Still "Mobile phones"
        },
        information: {
          en: (
            <>
              <p>
                {`If you're on a contract check your bill or your bank statement
                to see how much you spend each month.`}
              </p>
              <p>
                {`If you're on a pay-as-you-go deal, enter the amount you top up
                and how often. And don't forget to include the cost of your
                handset. If you get a new phone every year, put this in as a
                yearly expense.`}
              </p>
              <p>
                Find out whether you could get a better deal:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/credit/struggling-to-pay-your-gas-or-electricity-bill"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Save money on your mobile phone
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Os ydych ar gontract gwiriwch eich bil neu gyfriflen banc i
                ganfod faint wariwch chi bob mis.
              </p>
              <p>
                Os ydych ar gontract talu wrth alw, rhowch y swm y byddwch yn ei
                wario bob tro a pha mor aml. A pheidiwch ag anghofio cost y ffôn
                ei hun. Os cewch ffôn newydd bob blwyddyn, rhowch hwn fel cost
                blynyddol.
              </p>
              <p>
                Gwiriwch a allech chi gael bargen well:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/credit/struggling-to-pay-your-gas-or-electricity-bill"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Arbed arian ar eich ffôn symudol
                </a>
              </p>
            </>
          ),
        },
        group: 'utilities',
      },
      {
        defaultFactorValue: 1,
        name: 'tv-licence',
        title: {
          en: 'TV licence',
          cy: 'Trwydded deledu',
        },
        information: {
          en: (
            <p>
              You can find out how much a TV Licence costs on the{' '}
              <a
                href="https://www.tvlicensing.co.uk/"
                target="_blank"
                rel="noreferrer"
                className="text-magenta-500 underline"
              >
                tvlicensing.co.uk
              </a>{' '}
              website.
            </p>
          ),
          cy: (
            <p>
              Gallwch ganfod beth yw pris trwydded deledu ar wefan{' '}
              <a
                href="https://www.tvlicensing.co.uk/"
                target="_blank"
                rel="noreferrer"
                className="text-magenta-500 underline"
              >
                tvlicensing.co.uk
              </a>
            </p>
          ),
        },
        group: 'utilities',
      },
      {
        defaultFactorValue: 1,
        name: 'cabel-or-satellite-tv',
        title: {
          en: 'Cable or satellite TV',
          cy: 'Teledu cebl neu loeren',
        },
        information: {
          en: (
            <>
              <p>
                Check your bill or bank statement to find out how much you spend
                on your TV subscription.
              </p>
              <p>
                If you pay for your landline, TV and broadband together, enter
                the amount once leaving the other boxes blank.
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Gwiriwch eich bil neu gyfriflen banc i ganfod faint wariwch chi
                ar eich tanysgrifiad teledu.
              </p>
              <p>
                Os ydych yn talu am eich llinell dir, teledu a band eang
                gyda&apos;i gilydd, rhowch y swm unwaith gan adael y blychau
                eraill yn wag.
              </p>
            </>
          ),
        },
        group: 'utilities',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'home-maintenance',
        title: {
          en: 'Home maintenance',
          cy: 'Cynhaliaeth cartref',
        },
        information: {
          en: (
            <>
              <p>
                Try to work out what you spend across an average year on
                household maintenance. This might include painting and
                decorating, or repairs to a leaking roof or a blocked gutter.
                Make sure you include any DIY materials you buy plus whatever
                you pay for plumbers, electricians or builders.
              </p>
              <p>
                Even if the work is covered by your insurance, make sure you
                include the excess here.
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                {` Ceisiwch gyfrifo faint a wariwch ar gynnal a chadw yn y cartref
                ar gyfartaledd mewn blwyddyn. Gall hyn gynnwys peintio ac
                addurno, neu drwsio to sy'n gollwng neu gafnau sydd wedi eu
                blocio. Sicrhewch eich bod yn cynnwys unrhyw ddeunyddiau DIY a
                brynwch yn ogystal â'ch taliadau i blymwyr, trydanwyr neu
                adeiladwyr.`}
              </p>
              <p>
                Hyd yn oed os diogelir y gwaith gan eich yswiriant, sicrhewch
                eich bod yn cynnwys y tâl dros ben yma.
              </p>
            </>
          ),
        },
        group: 'utilities',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'garden-maintenance',
        title: {
          en: 'Garden maintenance',
          cy: "Cynnal a chadw'r ardd",
        },
        information: {
          en: (
            <>
              <p>
                Try to work out what you spend in an average year on looking
                after your garden. This might include things like buying plants
                and seeds, compost, manure, or petrol for your lawn mower.
              </p>
              <p>
                If you pay someone to mow your lawn or do other gardening jobs
                for you, include it here.
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Ceisiwch gyfrifo faint a wariwch ar eich gardd ar gyfartaledd
                mewn blwyddyn. Gall hyn gynnwys prynu pethau fel planhigion a
                hadau, compost, gwrtaith, neu betrol ar gyfer eich peiriant
                torri gwair.
              </p>
              <p>
                Os ydych yn talu rywun dorri eich gwair neu i wneud unrhyw waith
                arall yn yr ardd i chi, rhowch hynny yma.
              </p>
            </>
          ),
        },
        group: 'utilities',
      },
      {
        defaultFactorValue: 1,
        name: 'appliance-rental',
        title: {
          en: 'Appliance rental',
          cy: 'Rhentu offer',
        },
        information: {
          en: (
            <p>
              If you rent any appliances, such as a washing machine, fridge or
              TV, enter the weekly or monthly rental here.
            </p>
          ),
          cy: (
            <p>
              Os ydych yn llogi unrhyw beiriannau, megis peiriant golchi,
              oergell neu deledu, rhowch y pris rhent wythnosol neu fisol yma.
            </p>
          ),
        },
        group: 'utilities',
      },
      {
        defaultFactorValue: 1,
        name: 'boiler-cover',
        title: {
          en: 'Boiler cover',
          cy: 'Yswiriant boeler',
        },
        information: {
          en: (
            <p>
              {`If you've taken out insurance to cover you in case your boiler
                breaks down, enter the amount you pay here.`}
            </p>
          ),
          cy: (
            <p>
              {`Os ydych wedi cymryd yswiriant i'ch diogelu rhag i'ch boeler
              dorri, rhowch y swm yr ydych yn ei dalu yma.`}
            </p>
          ),
        },
        group: 'utilities',
      },
      ...createAdditionalItems('householdbills'),
    ],
  },
  {
    name: 'living-costs',
    title: {
      en: 'Living costs',
      cy: 'Costau byw',
    },
    colour: '#E67032',
    nextTab: `finance-insurance`,
    submit: {
      en: 'Finance & insurance',
      cy: 'Cyllid ac Yswiriant',
    },
    function: subtract,
    fields: [
      // FOOD & DRINK
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'grocery-shopping',
        title: {
          en: 'Grocery shopping',
          cy: 'Siopa am fwydydd',
        },
        information: {
          en: (
            <>
              <p>
                {`This is a tricky figure to get right, but it's really important
                that you are as accurate as possible. Bear in mind that your
                weekly shop probably includes more than just food - you might
                buy things like toiletries and cleaning products too. And
                remember to include all those extras you buy throughout the
                week, like milk, bread and snacks.`}
              </p>
              <p>
                Why not try saving money on your shopping bill:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/blog/supermarket-savings/five-ways-to-save-at-the-supermarket"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Top money saving tips to help you shop smarter
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                {`Mae hwn yn ffigwr anodd i'w gael yn gywir ond mae'n wir bwysig i
                chi fod mor gywir â phosibl. Cofiwch fod eich siopa wythnosol yn
                debygol o gynnwys mwy na bwyd yn unig - mae'n bosib y byddwch yn
                prynu pethau fel nwyddau ymolchi a glanhau hefyd. A chofiwch
                gynnwys y pethau ychwanegol hynny y prynwch yn ystod yr wythnos,
                megis llefrith, bara a byrbrydau.`}
              </p>
              <p>
                Rhowch gynnig ar geisio arbed arian ar eich bil siopa:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/blog/supermarket-savings/five-ways-to-save-at-the-supermarket"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  {`Awgrymiadau da ar arbed arian i'ch helpu i siopa'n fwy clyfar`}
                </a>
              </p>
            </>
          ),
        },
        group: 'food-drink',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'takeaways',
        title: {
          en: 'Takeaways',
          cy: 'Pryd mynd allan',
        },
        information: {
          en: "Include the cost of any takeaways you buy at home and also any money you give to older children to buy their own takeaway food when they are out and about.\nGoing out for meals is covered under 'Leisure' so there's no need to include that here.",
          cy: "Cofiwch gynnwys cost unrhyw fwyd tecawê y byddwch yn eu prynu gartref ac unrhyw arian rowch i blant hŷn i brynu eu bwyd tecawê eu hunain pan fyddant allan yn crwydro.\nMae mynd allan am fwyd yn cael ei gynnwys dan 'Hamdden' felly nid oes angen cynnwys hynny yma.",
        },
        group: 'food-drink',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'alcohol-at-home',
        title: {
          en: 'Alcohol at home',
          cy: 'Alcohol yn y cartref',
        },
        information: {
          en: "Don't include this if you've already counted it in your weekly shop. But if you buy alcohol from the off-licence or any other outlet, and you haven't already counted it, make sure you include it here.\nSeeing the amount you spend per month on alcohol might even motivate you to cut down a bit!",
          cy: 'Peidiwch â chynnwys hyn os ydych wedi ei gynnwys yn eich siopa wythnosol eisoes. Ond os prynwch alcohol o siop drwyddedig neu unrhyw siop arall, ac nid ydych wedi ei gynnwys eisoes, cofiwch ei gynnwys yma.\nBydd gweld faint a wariwch bob mis ar alcohol yn eich ysgogi i yfed llai efallai!',
        },
        group: 'food-drink',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'smoking-and-vaping',
        title: {
          en: 'Smoking and vaping',
          cy: 'Ysmygu a defnyddio e-sigaréts',
        },
        information: {
          en: (
            <>
              <p>
                {`Don't include this if you've already counted it in your weekly
                shop. But if you buy cigarettesor vapes separately, make sure
                you include the cost here. Don't forget to include any extra you
                might buy when you're on a night out.`}
              </p>
              <p>
                Seeing the amount you spend per month on smoking might even
                motivate you to kick the habit!
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Peidiwch â chynnwys hwn os ydych wedi’i ystyried yn eich siop
                wythnosol. Ond os ydych yn prynu sigaréts neu e-sigaréts ar
                wahân, sicrhewch eich bod yn cynnwys y gost yma. Peidiwch ag
                anghofio cynnwys unrhyw beth ychwanegol efallai byddwch yn prynu
                pan rydych ar noson allan.
              </p>
              <p>
                Efallai bydd gweld y swm rydych yn ei wario ar ysmygu bob mis
                hyd yn oed yn eich annog i roi’r gorau i’r arfer.
              </p>
            </>
          ),
        },
        group: 'food-drink',
      },
      // WORK
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'lunches-snacks',
        title: {
          en: 'Lunches & snacks',
          cy: 'Cinio a byrbrydau',
        },
        information: {
          en: (
            <>
              <p>
                {`Don't include the cost of packed lunches if you buy the
                ingredients as part of your weekly shop. And if you never buy
                any snacks then you can leave this one blank.`}
              </p>
              <p>
                {`For the rest of us, this will probably come as a bit of a shock
                once we've added up sandwiches, crisps and all those other
                treats we buy to make the working day that little bit brighter!`}
              </p>
              <p>
                If you want to see how much you spend on snacks and sandwiches,
                try our{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/budgeting/beginners-guide-to-managing-your-money"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  {`Beginner's guide to managing your money`}
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                {`Peidiwch â chynnwys cost unrhyw becynnau bwyd os yw'r cynhwysion
                wedi eu prynu fel rhan o'ch siopa wythnosol. Ac os nad ydych yn
                prynu unrhyw fyrbrydau gallwch adael y blwch hwn yn wag`}
              </p>
              <p>
                {`I'r gweddill ohonom, gallwn gael tipyn o sioc unwaith y byddwn
                wedi cyfrifo'r brechdanau, y creision a'r holl bethau da yr ydym
                yn eu prynu i fywiogi diwrnod yn y gwaith!`}
              </p>
              <p>
                Os hoffech weld faint a wariwch ar fyrbrydau a brechdanau,
                rhowch gynnig ar ein{' '}
                <a
                  href="https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/beginners-guide-to-managing-your-money"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  {`Awgrymiadau da ar arbed arian i'ch helpu i siopa'n fwy clyfar`}
                </a>
              </p>
            </>
          ),
        },
        group: 'work',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'takeaway-coffees',
        title: {
          en: 'Takeaway coffees',
          cy: 'Coffi cludfwyd',
        },
        information: {
          en: (
            <>
              <p>
                If you want to know how much you spend each week on takeaway
                coffees and other hot drinks, try our{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/budgeting/beginners-guide-to-managing-your-money"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  {`Beginner's guide to managing your money`}
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Os hoffech weld faint a wariwch ar goffi tecawê, a diodydd poeth
                eraill, rhowch gynnig ar ein{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/budgeting/beginners-guide-to-managing-your-money"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  {`Cyfrifiannell torri'n ôl`}
                </a>
              </p>
            </>
          ),
        },
        group: 'work',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'union-professional-fees',
        title: {
          en: 'Union/professional fees',
          cy: 'Ffioedd undeb/proffesiynol',
        },
        information: {
          en: 'Include here the cost of your union membership and any other professional bodies you belong to and pay for yourself.',
          cy: "Cofiwch gynnwys yma gost eich aelodaeth o undeb ac unrhyw gyrff proffesiynol eraill yr ydych yn perthyn iddynt ac yn talu amdanynt o'ch poced eich hun",
        },
        group: 'work',
      },
      // CLOTHES & SHOES
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'clothes',
        title: {
          en: 'Clothes',
          cy: 'Dillad',
        },
        information: {
          en: "The only way to get an accurate picture here is to work out what you (and your partner if you have one) spend in a year on clothes and enter that amount. Then you can sure you've taken into account big items like a winter coat or a new suit. Only include clothes for work if you haven't entered them separately in the box above.",
          cy: "Yr unig ffordd i gael darlun cywir yma yw cyfrifo’r hyn rydych chi (a'ch partner os oes un gennych) yn ei wario mewn blwyddyn ar ddillad a rhoi’r swm hwnnw. Yna gallwch sicrhau eich bod wedi ystyried eitemau mawr fel cot aeaf neu siwt newydd. Dylech ond cynnwys dillad ar gyfer gwaith os nad ydych wedi eu nodi ar wahân yn y blwch uchod.",
        },
        group: 'clothes-shoes',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'shoes',
        title: {
          en: 'Shoes',
          cy: 'Esgidiau',
        },
        information: {
          en: "This is one of those figures that you need to work out across the year. Count up the cost of every last pair of shoes, boots and flip flops that you've bought for the whole family in the past year. Only include school shoes, football boots, and so on if you haven't counted them under school uniform.",
          cy: "Dyma un o'r ffigurau hynny y mae angen i chi gyfrifo dros y flwyddyn. Cyfrifwch gost bob pâr o esgidiau, bŵts a fflip -fflops rydych chi wedi'u prynu ar gyfer y teulu cyfan yn ystod y flwyddyn ddiwethaf. Dylech ond cynnwys esgidiau ysgol, esgidiau pêl -droed, ac ati os nad ydych wedi eu cyfrif o dan wisg ysgol.",
        },
        group: 'clothes-shoes',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'work-clothes',
        title: {
          en: 'Work clothes',
          cy: 'Dillad gwaith',
        },
        information: {
          en: "Depending on your job, this is where you need to include: overalls and work clothes that you buy yourself, any uniform that's not provided with the job, and suits and other smart clothes that you buy just for work.",
          cy: "Yn dibynnu ar eich swydd, dyma le mae angen i chi gynnwys: oferôls a dillad gwaith rydych chi'n eu prynu'ch hun, unrhyw wisg nad yw'n cael ei darparu gan y swydd, a siwtiau a dillad craff eraill rydych chi'n eu prynu ar gyfer gwaith yn unig.",
        },
        group: 'clothes-shoes',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'childrens-clothes',
        title: {
          en: 'Children’s clothes',
          cy: 'Dillad plant',
        },
        information: {
          en: (
            <>
              <p>
                The only way to get an accurate picture here is to work out what
                you spend in a year and enter that amount. Then you can be sure
                you&apos;ve budgeted for big items like a winter coat or a
                football kit. Remember to take into account hand-me-downs when
                calculating the amount you spend on the younger ones.
              </p>
              <p>
                There&apos;s a separate box for school uniform so no need to
                include that here.
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Yr unig ffordd i gael darlun cywir yma yw cyfrifo’r hyn rydych
                chi’n ei wario mewn blwyddyn a rhoi’r swm hwnnw. Yna gallwch
                sicrhau eich bod wedi ystyried eitemau mawr fel cot aeaf neu git
                pêl droed. Cofiwch ystyried dillad ail-law wrth gyfrifo’r swm
                rydych yn ei wario ar y rhai ifancach.
              </p>
              <p>
                Mae yna flwch ar wahân ar gyfer gwisg ysgol felly nid oes angen
                ei chynnwys yma.
              </p>
            </>
          ),
        },
        group: 'clothes-shoes',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'school-uniform',
        title: {
          en: 'School uniform',
          cy: 'Gwisg ysgol',
        },
        information: {
          en: (
            <>
              <p>
                You might do one main school uniform shop just before the start
                of the school year, but you should also include things that you
                buy at other times of year like socks, tights and summer dresses
                or shorts.
              </p>
              <p>
                Things like blazers probably last more than one year so you can
                divide that cost by two or three (or more).
              </p>
              <p>
                Oh, and don&apos;t forget to include the PE kit – that can
                sometimes be the most expensive part of a school uniform.
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Efallai y byddwch chi&apos;n gwneud un brif siop wisg ysgol
                ychydig cyn dechrau&apos;r flwyddyn ysgol, ond dylech chi hefyd
                gynnwys pethau rydych chi&apos;n eu prynu ar adegau eraill
                o&apos;r flwyddyn fel sanau, teits a ffrogiau haf neu siorts.
              </p>
              <p>
                Mae&apos;n debyg bod pethau fel blasers yn para mwy na blwyddyn
                felly gallwch rannu&apos;r gost honno â dwy neu dri (neu fwy).
              </p>
              <p>
                O, a pheidiwch ag anghofio gynnwys y cit AG - gall hynny
                weithiau fod y rhan drytaf o wisg ysgol.
              </p>
            </>
          ),
        },
        group: 'clothes-shoes',
      },
      {
        defaultFactorValue: 1,
        name: 'laundry-and-dry-cleaning',
        title: {
          en: 'Laundry and dry cleaning',
          cy: 'Golchi dillad a sychlanhau',
        },
        information: {
          en: "Enter everything you spend in the launderette or at the dry cleaners.\nOnly include the money you spend on washing powder, etc if you haven't included it under grocery shopping.",
          cy: 'Rhowch bopeth a wariwch yn y golchdy neu yn y siop glanhau dillad.\nRhowch yr arian a wariwch ar bowdwr golchi ac ati yn unig, os nad ydych wedi ei gynnwys yn eich siopa groser.',
        },
        group: 'clothes-shoes',
      },
      // HEALTH & BEAUTY
      {
        defaultFactorValue: getFactorValue('quarter'),
        name: 'hairdressing',
        title: {
          en: 'Hairdressing',
          cy: 'Trin gwallt',
        },
        information: {
          en: "Add up here what you spend on haircuts for the whole family. If some of you get your hair cut more often than others you should add up how much you spend across a longer period. For example, if you and the children get your hair cut every three months and your husband gets his done every month, just add up what you spend on one haircut for you and the kids and three haircuts for him and select 'quarter' from the dropdown menu.",
          cy: "Cyfrifwch yma yr hyn a wariwch ar dorri gwallt ar gyfer yr holl deulu. Os oes rhai ohonoch yn torri eich gwallt yn amlach na'ch gilydd yna dylech gyfrifo faint wariwch dros gyfnod hirach. Er enghraifft, os ydych chi a'r plant yn torri eich gwallt bob tri mis a'ch gŵr yn ei dorri bob mis, cyfrifwch yr hyn a wariwch ar eich cyfer chi a'r plant a thri ymweliad ar ei gyfer ef a dewiswch yn 'chwarterol' o'r gwymplen.",
        },
        group: 'health-beauty',
      },
      {
        defaultFactorValue: getFactorValue('quarter'),
        name: 'beauty-treatments',
        title: {
          en: 'Beauty treatments',
          cy: 'Triniaethau harddwch',
        },
        information: {
          en: "Enter anything that you spend on having your eyebrows or nails done or any other beauty treatments.\nOnly include make-up products if you're not going to include them as part of toiletries in the next box.",
          cy: "Nodwch unrhyw beth a wariwch ar gyfer trin eich aeliau neu eich ewinedd neu unrhyw driniaethau prydferthwch eraill.\nPeidiwch â chynnwys cynnyrch colur os ydych am eu cynnwys fel rhan o'r deunydd ymolchi yn y blwch nesaf.",
        },
        group: 'health-beauty',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'toiletries',
        title: {
          en: 'Toiletries',
          cy: 'Pethau ymolchi',
        },
        information: {
          en: "Leave this blank if you've already counted toiletries in your weekly shop. But if you buy toiletries separately, and/or you haven't already counted them, make sure you include your spend here.",
          cy: 'Gadewch hwn yn wag os ydych wedi cynnwys deunydd ymolchi yn eich siopa wythnosol eisoes. Ond os prynwch ddeunydd ymolchi ar wahân, ac/neu nad ydych wedi eu cyfrifo eisoes, gwnewch yn siŵr eich bod yn eu cynnwys yma.',
        },
        group: 'health-beauty',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'eye-care',
        title: {
          en: 'Eye care',
          cy: 'Gofal llygaid',
        },
        information: {
          en: 'This is where you should add up anything you spend on eye tests, glasses, contact lenses, solutions, etc.\nEye tests for the under 16s and over 60s are free.',
          cy: 'Dyma lle y dylech gyfrifo unrhyw beth a wariwch ar brofion llygaid, sbectolau, lensys cyffwrdd, toddiannau ac ati.\nMae profion llygaid ar gyfer y rhai dan 16 oed a thros 60 oed yn rhad ac am ddim.',
        },
        group: 'health-beauty',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'dental-care',
        title: {
          en: 'Dental care',
          cy: 'Gofal deintyddol',
        },
        information: {
          en: "If you never need dental treatment you are probably OK to just budget for routine check-ups here. But if you frequently need to pay for treatment you should add up how much you've spent at the dentist over the past year.\nIf you have dental insurance, or you pay a monthly amount towards a dental plan, you can leave this box blank and fill in the amount you pay in the insurance section on the next page.\nRemember, children under the age of 18 get free dental treatment.\nOnly include the cost of toothpaste, floss, etc if you haven't already entered them under toiletries or as part of your grocery shopping.",
          cy: "Os nad oes arnoch fyth angen triniaeth ddeintyddol, gwell i chi gyllido ar gyfer triniaeth gwirio dannedd gyffredinol yn unig. Ond, os oes arnoch angen talu am driniaeth yn aml dylech gyfrifo faint yr ydych wedi ei dalu i'r deintydd dros y flwyddyn ddiwethaf.\nOs oes gennych yswiriant deintyddol, neu eich bod yn talu swm misol tuag at gynllun deintyddol, gallwch adael y blwch hwn yn wag a chwblhau'r swm yr ydych yn ei dalu yn y rhan yswiriant ar y dudalen nesaf.\nCofiwch, mae plant dan 18 oed yn cael triniaeth ddeintyddol yn rhad ac am ddim.\nPeidiwch â chynnwys cost pâst dannedd, edau ac ati os ydych wedi eu cynnwys eisoes dan ddeunydd ymolchi neu fel rhan o'ch siopa groser.",
        },
        group: 'health-beauty',
      },
      {
        defaultFactorValue: 1,
        name: 'prescriptions-medicines',
        title: {
          en: 'Prescriptions & medicines',
          cy: 'Presgripsiynau a moddion',
        },
        information: {
          en: (
            <>
              <p>
                For prescriptions costs in England visit the{' '}
                <a
                  href="https://www.nhs.uk/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  NHS Choices
                </a>{' '}
                website.
              </p>
              <p>
                Remember to include things you buy over the counter like
                painkillers and treatments for coughs and colds, etc.
                Prescriptions are free in Scotland, Wales and Northern Ireland.
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                I ganfod costau presgripsiwn yn Lloegr, ewch i wefan{' '}
                <a
                  href="https://www.nhs.uk/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  NHS Choices
                </a>
                website.
              </p>
              <p>
                Cofiwch gynnwys pethau a brynwch dros y cownter megis tabledi
                lladd poen a thriniaethau ar gyfer pesychiadau ac anwydau, ac
                ati. Mae presgripsiynau am ddim yng Nghymru, yr Alban a Gogledd
                Iwerddon.nd.
              </p>
            </>
          ),
        },
        group: 'health-beauty',
      },
      ...createAdditionalItems('living-costs'),
    ],
  },
  {
    name: 'finance-insurance',
    title: {
      en: 'Finance & insurance',
      cy: 'Cyllid ac Yswiriant',
    },
    colour: '#AD0060',
    nextTab: `family-friends`,
    submit: {
      en: 'Family & friends',
      cy: 'Teulu a Ffrindiau',
    },
    function: subtract,
    fields: [
      {
        defaultFactorValue: 1,
        name: 'life-insurance',
        title: {
          en: 'Life insurance',
          cy: 'Yswiriant bywyd',
        },
        information: {
          en: (
            <>
              <p>
                Mortgage life insurance pays out a lump sum to cover your
                outstanding mortgage debt if you die.
              </p>
              <p>
                Check your policy details or your bank statement to find out
                exactly what your monthly premiums are.
              </p>
              <p>
                {`If you haven't checked your policy lately you might find that
                it's worth shopping around. Find out more in our guide: `}
              </p>
              <p>
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/insurance/what-is-life-insurance"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  What is life insurance?
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                {`Mae yswiriant bywyd yn talu cyfandaliad neu daliadau rheolaidd
                i'ch dibynyddion petaech chi'n marw.`}
              </p>
              <p>
                {`Gwiriwch fanylion eich polisi neu eich cyfriflen banc i ganfod
                faint yn union yw eich premiymau misol.`}
              </p>
              <p>
                {`Os oes gennych yswiriant bywyd fel rhan o'ch pecyn buddion o'ch
                gwaith nid oes angen i chi gynnwys ffigwr yma gan nad yw eich
                cyflogwr yn talu eich premiwm.`}
              </p>
              <p>
                {`Os nad ydych wedi gwirio eich polisi'n ddiweddar efallai y
                gwelwch y fantais o siopa o gwmpas. Dowch o hyd i ragor o
                wybodaeth yn ein canllaw: `}
                <a
                  href="https://www.moneyhelper.org.uk/cy/everyday-money/insurance/what-is-life-insurance"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Sut a ble i brynu yswiriant bywyd
                </a>
              </p>
            </>
          ),
        },
        group: 'insurance',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'protection-insurance',
        title: {
          en: 'Income protection insurance',
          cy: 'Yswiriant diogelu incwm',
        },
        information: {
          en: (
            <>
              <p>
                {`Income protection insurance pays a percentage of your income if
                you can't work because you're ill or injured.`}
              </p>
              <p>
                Check your policy details or your bank statement to find out
                exactly what your monthly premiums are.
              </p>
              <p>
                {`If you're not sure whether the policy you have is right for you
                or good value for money, see our guide:`}{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/insurance/what-is-protection-insurance"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  What is income protection insurance?
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                {`Mae yswiriant diogelu incwm yn talu canran o'ch incwm os byddwch
                yn methu gweithio oherwydd salwch neu anaf.`}
              </p>
              <p>
                Gwiriwch fanylion eich polisi neu eich cyfriflen banc i ganfod
                faint yn union yw eich premiymau misol.
              </p>
              <p>
                {`Os ydych yn ansicr a yw'r polisi yn addas ar eich cyfer chi
                neu'n werth da am arian, gweler ein canllaw:`}{' '}
                <a
                  href="https://www.moneyhelper.org.uk/cy/everyday-money/insurance/what-is-protection-insurance"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Sut a ble i brynu yswiriant diogelu incwm
                </a>
              </p>
            </>
          ),
        },
        group: 'insurance',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'critical-illness-insurance',
        title: {
          en: 'Critical illness insurance',
          cy: 'Yswiriant salwch difrifol',
        },
        information: {
          en: (
            <>
              <p>
                Critical illness insurance pays out a lump sum if you get one of
                the specific medical conditions or injuries listed on your
                policy.
              </p>
              <p>{`It's often sold alongside your mortgage.`}</p>
              <p>
                Check your policy details or your bank statement to find out
                exactly what your monthly premiums are.
              </p>
              <p>
                {`If you're not sure whether the policy you have is right for you
                or good value for money, see our guide:`}{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/insurance/what-is-critical-illness-cover"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  What is critical illness cover?
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                {`Mae yswiriant salwch critigol yn talu cyfandaliad os dioddefwch
                un o'r cyflyrau neu'r anafiadau meddygol penodol a restrir ar
                eich polisi.`}
              </p>
              <p>{`Yn aml fe'i gwerthir ochr yn ochr â'ch morgais.`}</p>
              <p>
                Gwiriwch fanylion eich polisi neu eich cyfriflen banc i ganfod
                faint yn union yw eich premiymau misol.
              </p>
              <p>
                {`Os ydych yn ansicr a yw'r polisi yn addas ar eich cyfer chi
                neu'n werth da am arian, gweler ein canllaw:`}{' '}
                <a
                  href="https://www.moneyhelper.org.uk/cy/everyday-money/insurance/what-is-critical-illness-cover"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Sut a ble i brynu yswiriant salwch difrifol
                </a>
              </p>
            </>
          ),
        },
        group: 'insurance',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'health-insurance',
        title: {
          en: 'Health insurance',
          cy: 'Yswiriant iechyd',
        },
        information: {
          en: (
            <>
              <p>This is sometimes known as private medical insurance.</p>
              <p>
                Check your policy details or your bank statement to find out
                exactly what your monthly premiums are.
              </p>
              <p>
                If you have health insurance as part of your benefits package
                from work there is no need to include a figure here because your
                employer pays your premium for you.
              </p>
            </>
          ),
          cy: (
            <>
              <p>Weithiau gelwir hyn yn yswiriant meddygol preifat.</p>
              <p>
                Gwiriwch fanylion eich polisi neu eich cyfriflen banc i ganfod
                faint yn union yw eich premiymau misol.
              </p>
              <p>
                Os oes gennych yswiriant iechyd fel rhan o becyn buddion eich
                swydd nid oes angen cynnwys ffigwr yma gan fod eich cyflogwr yn
                talu eich premiwm ar eich rhan.
              </p>
            </>
          ),
        },
        group: 'insurance',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'dental-insurance',
        title: {
          en: 'Dental insurance',
          cy: 'Yswiriant deintyddol',
        },
        information: {
          en: (
            <>
              <p>
                {`This could be either an insurance policy or what's known as a
                'capitation plan' (eg Denplan, which spreads the cost of
                treatment over the year).`}
              </p>
              <p>
                Check your paperwork or your bank statement to find out exactly
                what your monthly payments are.
              </p>
              <p>
                {`Double check 'Dental care' on the Living costs page to make sure
                you haven't entered the same figure twice.`}
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                {`Gall hwn fod yn un ai bolisi yswiriant neu'r hyn sy'n cael ei
                alw'n 'gynllun yn ôl y pen', (ee Denplan, sy'n lledaenu cost
                triniaeth dros y flwyddyn).`}
              </p>
              <p>
                Gwiriwch fanylion eich polisi neu eich cyfriflen banc i ganfod
                faint yn union yw eich premiymau misol.
              </p>
              <p>
                {`Gwiriwch yn ofalus 'Gofal deintyddol' ar y dudalen Costau byw i
                sicrhau nad ydych wedi rhoi'r un ffigwr ddwywaith.`}
              </p>
            </>
          ),
        },
        group: 'insurance',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'overdraft-charges-interest',
        title: {
          en: 'Overdraft charges & interest',
          cy: 'Ffioedd gorddrafft & llog',
        },
        information: {
          en: (
            <>
              <p>
                You should be able to see the monthly interest and fees charged
                on your overdraft by checking your bank statements.
              </p>
              <p>
                {`Look at what you've been charged over the past few months and
                select the correct frequency from the dropdown so that the tool
                calculates your monthly average for you.`}
              </p>
              <p>
                If you often go overdrawn you should consider switching to an
                account that has a fee-free overdraft and/or a low interest
                rate. Find out more:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/banking/how-to-choose-the-right-bank-account"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  How to choose the right bank account
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                {`Dylech fedru gweld y llog misol a'r ffioedd a godir ar eich
                gorddrafft drwy wirio eich cyfriflenni banc.`}
              </p>
              <p>
                {`Edrychwch faint a godwyd arnoch dros yr ychydig fisoedd diwethaf
                a dewiswch yr amledd cywir o'r gwymplen fel bod y teclyn yn
                cyfrifo'r cyfartaledd misol i chi.`}
              </p>
              <p>
                {`Os ydych yn mynd i orddrafft yn aml dylech ystyried newid i
                gyfrif sy'n cynnig gorddrafft am ddim a/neu gyfradd llog isel.
                Cewch fwy o wybodaeth yn:`}{' '}
                <a
                  href="https://www.moneyadviceservice.org.uk/cy/articles/sut-mae-dewis-y-cyfrif-banc-cywir"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Sut mae dewis y cyfrif banc cywir
                </a>
              </p>
            </>
          ),
        },
        group: 'banking',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'bank-account-fees',
        title: {
          en: 'Bank account fees',
          cy: 'Ffioedd cyfrif banc',
        },
        information: {
          en: (
            <>
              <p>
                If you have an account that charges a monthly or an annual fee,
                enter the amount here.
              </p>
              <p>
                If this seems high and you want to shop around for an account
                that is more suitable for you, see our guide:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/banking/how-to-choose-the-right-bank-account"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  How to choose the right bank account
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                {`Os oes gennych gyfrif sy'n codi ffi misol neu flynyddol, rhowch
                y swm yma.`}
              </p>
              <p>
                Os yw hyn yn ymddangos yn uchel a hoffech chwilio am fargen well
                a mwy addas ar gyfer eich cyfrif, edrychwch ar ein canllaw:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/cy/everyday-money/banking/how-to-choose-the-right-bank-account"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Sut mae dewis y cyfrif banc cywir
                </a>
              </p>
            </>
          ),
        },
        group: 'banking',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'penalties',
        title: {
          en: 'Penalties',
          cy: 'Cosbau',
        },
        information: {
          en: (
            <>
              <p>
                {`You might be charged penalties for an unauthorised overdraft or
                for refused payments (for example if there's not enough money in
                your account to cover a payment).`}
              </p>
              <p>
                {`Look at what you've been charged over the past few months and
                select the correct frequency from the dropdown so that the tool
                calculates your monthly average for you.`}
              </p>
              <p>
                If you have a lot of penalties to pay you could consider
                switching to an account that is more suited to your situation.
                Find out more in our guide:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/banking/how-to-choose-the-right-bank-account"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  How to choose the right bank account
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                {`Mae'n bosib y codir tâl cosb arnoch am fynd i orddrafft heb
                ganiatâd neu am daliadau a wrthodwyd (er enghraifft os nad oes
                digon o arian yn eich cyfrif i wneud y taliad).`}
              </p>
              <p>
                {`Edrychwch faint a godwyd arnoch dros yr ychydig fisoedd diwethaf
                a dewiswch yr amledd cywir o'r gwymplen fel bod y teclyn yn
                cyfrifo'r cyfartaledd misol i chi.`}
              </p>
              <p>
                {`Os oes gennych lawer o daliadau cosb i'w gwneud gallech ystyried
                newid i gyfrif sy'n fwy addas i chi. Dowch o hyd i ragor o
                wybodaeth yn ein canllaw:`}{' '}
                <a
                  href="https://www.moneyhelper.org.uk/cy/everyday-money/banking/how-to-choose-the-right-bank-account"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Sut mae dewis y cyfrif banc cywir
                </a>
              </p>
            </>
          ),
        },
        group: 'banking',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'loan-repayments',
        title: {
          en: 'Loan repayments',
          cy: 'Ad-daliadau benthyciad',
        },
        information: {
          en: (
            <>
              <p>
                Check your loan paperwork or your bank statement to find out
                exactly what your monthly repayments are.
              </p>
              <p>
                {`If you pay for loan insurance (eg PPI) make sure you either put
                the amount in this box or under 'Insurance' but not in both.`}
              </p>
              <p>
                Why not see if you could cut the cost of your borrowing by
                repaying early or switching lenders:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/credit/personal-loans"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Personal loans
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Gwiriwch fanylion eich polisi neu eich cyfriflen banc i ganfod
                faint yn union yw eich premiymau misol.
              </p>
              <p>
                {`Os ydych yn talu am yswiriant benthyciad (ee PPI) sicrhewch eich
                bod yn rhoi'r swm hwn un ai yn y blwch hwn neu dan 'Yswiriant'
                ond nid y ddau.`}
              </p>
              <p>
                {`Rhowch gynnig i weld a allech chi leihau cost benthyciadau drwy
                ad-dalu'n gynnar neu newid darparwyr:`}{' '}
                <a
                  href="https://www.moneyhelper.org.uk/cy/everyday-money/credit/personal-loans"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Sut i leihau cost eich benthyciadau personol
                </a>
              </p>
            </>
          ),
        },
        group: 'credit',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'student-loan-repayments',
        title: {
          en: 'Student loan repayments',
          cy: 'Ad-daliadau benthyciad myfyriwr',
        },
        information: {
          en: (
            <>
              <p>
                Check your loan paperwork or your bank statement to find out
                exactly what your monthly repayments are.
              </p>
              <p>
                If you pay for loan insurance (eg PPI) make sure you either put
                the amount in this box or under &apos;Insurance&apos; but not in
                both.
              </p>
              <p>
                Why not see if you could cut the cost of your borrowing by
                repaying early or switching lenders: How to reduce the cost of
                your personal loans
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Gwiriwch waith papur eich benthyciad neu eich datganiad banc i
                ddarganfod yn union beth yw eich ad-daliadau misol.
              </p>
              <p>
                Os ydych yn talu am yswiriant benthyciad (e.e. PPI) sicrhewch
                eich bod naill ai’n rhoi’r swm yn y blwch hwn neu o dan
                ‘yswiriant’ ond nid yn y ddau.
              </p>
              <p>
                Pam nad ydych yn gweld os gallwch dorri cost eich benthyg gan
                ad-dalu’n gynnar neu newid benthycwyr: Sut i leihau cost eich
                benthyciadau personol.
              </p>
            </>
          ),
        },
        group: 'credit',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'credit-card-repayments',
        title: {
          en: 'Credit card repayments',
          cy: 'Ad-daliadau cerdyn credyd',
        },
        information: {
          en: (
            <>
              <p>
                If you clear your balance every month you can leave this box
                blank. Otherwise, check your credit card statements to see what
                your monthly repayments are.
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                {`Os ydych yn setlo'r hyn sy'n ddyledus gennych bob mis cewch
                adael y blwch hwn yn wag. Fel arall, gwiriwch eich cyfriflenni
                cerdyn credyd i ganfod faint yn union yw eich ad-daliadau misol.`}
              </p>
            </>
          ),
        },
        group: 'credit',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'car-hire-payments',
        title: {
          en: 'Car hire purchase payments',
          cy: 'Ad-daliadau hurbwrcasu a chatalog (RENAME)',
        },
        information: {
          en: (
            <>
              <p>
                Check your paperwork or your bank statement to find out exactly
                what your monthly repayments are.
              </p>
              <p>
                Why not see if you could cut the cost of your borrowing? See our
                guide:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/money-troubles/cost-of-living/bill-prioritiser"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Bill prioritiser
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Gwiriwch fanylion eich polisi neu eich cyfriflen banc i ganfod
                faint yn union yw eich ad-daliadau misol.
              </p>
              <p>
                Pam nad ewch chi ati i weld a allech chi leihau eich costau
                benthyca? Gweler ein canllaw:{' '}
                <a
                  href="https://www.moneyadviceservice.org.uk/cy/articles/ceisiwch-leihau-ar-gostau-cyllid-car-hurbryniant-a-chostau-cyllid-eraill"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  {`Lleihau costau sy'n gysylltiedig â phrynu car, hurbwrcas a
                  chostau cyllid eraill`}
                </a>
              </p>
            </>
          ),
        },
        group: 'credit',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'buy-now-pay-later',
        title: {
          en: 'Buy now, pay later payments',
          cy: 'Taliadau prynu nawr, talu wedyn',
        },
        information: {
          en: <></>,
          cy: <></>,
        },
        group: 'credit',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'other-credit-repayments',
        title: {
          en: 'Other credit repayments',
          cy: 'Ad-daliadau credyd eraill',
        },
        information: {
          en: <></>,
          cy: <></>,
        },
        group: 'credit',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'regular-saving',
        title: {
          en: 'Regular saving',
          cy: 'Cynilo rheolaidd',
        },
        information: {
          en: (
            <>
              <p>
                Enter the amount here that you regularly put aside either weekly
                or monthly into a savings account or similar.
              </p>
              <p>
                {`If you regularly put money into a savings account in someone
                else's name - for example your children - include that here too.`}
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                {`Yma, rhowch y swm yr ydych yn ei neilltuo'n rheolaidd un ai'n
                wythnosol neu'n fisol i mewn i gyfrif cynilo neu gyfrif tebyg.`}
              </p>
              <p>
                {`Os ydych yn rhoi arian i mewn i gyfrif cynilo yn rheolaidd, sydd
                yn enw rhywun arall - er enghraifft eich plant - cofiwch gynnwys
                hynny yma hefyd.`}
              </p>
            </>
          ),
        },
        group: 'savings-investments',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'lump-sum-savings',
        title: {
          en: 'Lump sum savings',
          cy: 'Cynilo cyfandaliad',
        },
        information: {
          en: (
            <p>
              Enter here any amounts that you put into an ISA account. Be sure
              to choose the correct frequency – eg year or month – from the
              dropdown menu. If you put money into a Junior ISA for your child,
              include that here too.
            </p>
          ),
          cy: (
            <p>
              Rhowch unrhyw symiau rydych wedi eu rhoi mewn cyfrif ISA fan hyn.
              Sicrhewch eich bod yn dewis yr amlder cywir – e.e. blwyddyn neu
              fis – o’r ddewislen. Os ydych yn rhoi arian mewn ISA Iau am eich
              plentyn, dylech gynnwys hynny yma hefyd.
            </p>
          ),
        },
        group: 'savings-investments',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'payments-isas',
        title: {
          en: 'Payments into ISAs',
          cy: 'Taliadau i ISAs',
        },
        information: {
          en: (
            <p>
              {`Enter here any amounts that you put into an ISA account. Be sure
                to choose the correct frequency - eg year or month - from the
                dropdown menu. If you put money into a Junior ISA for your
                child, include that here too.`}
            </p>
          ),
          cy: (
            <p>
              {`Rhowch yma unrhyw symiau y rhowch i mewn i gyfrif ISA. Cofiwch
                ddewis yr amledd cywir - ee yn flynyddol neu'n fisol - o'r
                gwymplen. Os ydych yn rhoi arian i mewn i ISA Iau ar gyfer eich
                plentyn, dylech gynnwys hynny yma hefyd.`}
            </p>
          ),
        },
        group: 'savings-investments',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'buying-shares',
        title: {
          en: 'Buying shares & other investments',
          cy: 'Prynu cyfranddaliadau a buddsoddiadau eraill',
        },
        information: {
          en: (
            <p>
              {`If you put money into investments, for example shares or bonds,
                enter the amount you invest here. Be sure to choose the correct
                frequency - eg year or month - from the dropdown menu.`}
            </p>
          ),
          cy: (
            <p>
              {`Os ydych yn rhoi eich arian mewn buddsoddiadau, er enghraifft
                cyfranddaliadau neu fondiau, rhowch yr hyn a fuddsoddir gennych
                yma. Cofiwch ddewis yr amledd cywir - ee yn flynyddol neu'n
                fisol - o'r gwymplen.`}
            </p>
          ),
        },
        group: 'savings-investments',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'private-pensions',
        title: {
          en: 'Private pension contributions ',
          cy: 'Cyfraniadau pensiwn preifat',
        },
        information: {
          en: (
            <p>
              {`If your pension contributions are deducted from your pay then
                you should leave this box blank. However, if you're investing in
                your own private pension scheme, this is where you should put
                your contributions.`}
            </p>
          ),
          cy: (
            <p>
              {`Os didynnir eich cyfraniadau pensiwn o'ch cyflog yna dylech
                adael y blwch hwn yn wag. Fodd bynnag, os ydych yn buddsoddi yn
                eich cynllun pensiwn preifat eich hunan, dylech nodi eich
                cyfraniadau yma.`}
            </p>
          ),
        },
        group: 'savings-investments',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'long-term-care',
        title: {
          en: 'Long term care plan',
          cy: 'Cynllun gofal hirdymor',
        },
        information: {
          en: (
            <p>
              {`If you're paying a fixed monthly payment into an insurance
                policy to fund your future long-term care then enter the premium
                here.`}
            </p>
          ),
          cy: (
            <p>
              {`Os didynnir eich cyfraniadau pensiwn o'ch cyflog yna dylech
                adael y blwch hwn yn wag. Fodd bynnag, os ydych yn buddsoddi yn
                eich cynllun pensiwn preifat eich hunan, dylech nodi eich
                cyfraniadau yma.`}
            </p>
          ),
        },
        group: 'future-plans',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'funeral-plan',
        title: {
          en: 'Funeral plan',
          cy: 'Cynllun angladd',
        },
        information: {
          en: (
            <p>
              {`If you're paying regular instalments or a fixed monthly payment
                into a funeral plan enter the amount you pay here.`}
            </p>
          ),
          cy: (
            <p>
              Os ydych yn talu mewn rhandaliadau rheolaidd neu daliad misol
              sefydlog i mewn i gynllun angladd, rhowch y swm a delir gennych
              yma.
            </p>
          ),
        },
        group: 'future-plans',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'financial-advice',
        title: {
          en: 'Financial & legal advice',
          cy: 'Cyngor ariannol a chyfreithiol',
        },
        information: {
          en: (
            <p>
              If you pay fees for a financial adviser, or a legal professional,
              enter the amount here.
            </p>
          ),
          cy: (
            <p>
              Os ydych yn talu ffioedd am gynghorydd ariannol, neu weithiwr
              proffesiynol cyfreithiol, nodwch y swm yma.
            </p>
          ),
        },
        group: 'financial-advice',
      },
      ...createAdditionalItems('finance-insurance'),
    ],
  },
  {
    name: 'family-friends',
    title: {
      en: 'Family & friends',
      cy: 'Teulu a Ffrindiau',
    },
    colour: '#7F992F',
    nextTab: `travel`,
    submit: {
      en: 'Travel',
      cy: 'Teithio',
    },
    function: subtract,
    fields: [
      // CHILDREN
      {
        name: 'childcare',
        title: {
          en: 'Childcare',
          cy: 'Gofal plant',
        },
        defaultFactorValue: 1,
        information: {
          en: (
            <>
              <p>
                Enter here the amount you spend on your nursery, childminder or
                nanny. If you pay different amounts each week or month, add up
                everything you&apos;ve spent over the past year and enter that
                figure as a yearly amount.
              </p>
              <p>
                If you&apos;re not sure you&apos;re getting all the help
                you&apos;re entitled to, see our guides{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/benefits/benefits-if-you-have-children/benefits-and-entitlements-to-claim-when-you-have-a-baby"
                  rel="noreferrer"
                  target="_blank"
                  className="text-magenta-500 underline"
                >
                  Benefits you can claim when you&apos;re pregnant or have a
                  baby.
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Rhowch y swm a wariwch ar feithrinfa, gwarchodwr plant neu
                famaeth, yma. Os ydych yn talu symiau gwahanol bob wythnos neu
                bob mis, cyfrifwch bopeth yr ydych wedi ei wario dros y flwyddyn
                ddiwethaf a rhowch y ffigwr hwn fel swm blynyddol.
              </p>
              <p>
                Os ydych yn ansicr a ydych yn cael yr holl help sy&apos;n
                ddyledus i chi, gweler ein canllawiau:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/cy/benefits/benefits-if-you-have-children/benefits-and-entitlements-to-claim-when-you-have-a-baby"
                  rel="noreferrer"
                  target="_blank"
                  className="text-magenta-500 underline"
                >
                  Budd-daliadau y gallwch eu hawlio tra byddwch yn feichiog neu
                  wedi cael babi
                </a>
              </p>
            </>
          ),
        },
        group: 'children',
      },
      {
        name: 'nappies',
        title: {
          en: 'Nappies and baby items',
          cy: "Clytiau ac eitemau i'r babi",
        },
        defaultFactorValue: 1,
        information: {
          en: (
            <p>
              Use our{' '}
              <a
                href="https://www.moneyhelper.org.uk/en/family-and-care/becoming-a-parent/baby-costs-calculator"
                rel="noreferrer"
                target="_blank"
                className="text-magenta-500 underline"
              >
                Baby costs calculator
              </a>{' '}
              to work out the cost of formula, nappies, wipes, baby food and
              other baby items.
            </p>
          ),
          cy: (
            <p>
              Defnyddiwch ein{' '}
              <a
                href="https://www.moneyhelper.org.uk/cy/family-and-care/becoming-a-parent/baby-costs-calculator"
                target="_blank"
                rel="noreferrer"
                className="text-magenta-500 underline"
              >
                Cyfrifiannell costau babis
              </a>
              i gyfrifo&apos;r gost o fwyd a diod babi, cewynnau, cadachau, bwyd
              babi ac unrhyw eitemau eraill i fabis.
            </p>
          ),
        },
        group: 'children',
      },
      {
        name: 'activities',
        title: {
          en: 'Activities & clubs',
          cy: 'Gweithgareddau a chlybiau',
        },
        defaultFactorValue: 1,
        information: {
          en: (
            <p>
              Enter here the amount you spend on playgroups, clubs and other
              activities you pay for your children to do.
            </p>
          ),
          cy: (
            <p>
              Rhowch yma y swm a wariwch ar ysgol feithrin, clybiau ac unrhyw
              weithgareddau eraill ar gyfer eich plant.
            </p>
          ),
        },
        group: 'children',
      },
      {
        name: 'treats',
        title: {
          en: 'Toys & treats',
          cy: 'Teganau a phethau neis',
        },
        defaultFactorValue: 1,
        information: {
          en: (
            <p>
              If you buy things like sweets, comics and toys for your kids, add
              up the cost and enter it here. There&apos;s no need to include
              birthday presents - this is covered on the &quot;Leisure&quot;
              page. If you give your children pocket money so they can buy their
              own treats enter this amount in the next box instead.
            </p>
          ),
          cy: (
            <p>
              Os prynwch bethau da, cylchgronau a theganau i&apos;ch plant,
              cyfrifwch y gost a&apos;i roi yma. Nid oes angen cynnwys anrhegion
              penblwydd - mae hynny&apos;n cael ei gynnwys ar y dudalen
              &quot;Hamdden&quot;. Os rhowch arian poced i&apos;ch plant er mwyn
              iddynt gael prynu pethau da, rhowch hyn yn y blwch nesaf yn
              hytrach.
            </p>
          ),
        },
        group: 'children',
      },
      {
        name: 'pocket-money',
        title: {
          en: 'Pocket money',
          cy: 'Arian poced',
        },
        defaultFactorValue: getFactorValue('week'),
        information: {
          en: (
            <p>
              If you agree to give your children a certain amount of pocket
              money each week enter the amount here. Don&apos;t include anything
              you put into a savings account for them - this should go under
              &quot;Regular savings&quot; instead.
            </p>
          ),
          cy: (
            <p>
              Os cytunwch i roi swm o arian i&apos;ch plentyn bob wythnos yn
              arian poced, rhowch y swm hwn yma. Peidiwch â chynnwys unrhyw beth
              a rowch mewn cyfrifon cynilo ar eu cyfer - dylai hyn gael ei roi
              dan &quot;Cynilion rheolaidd&quot; yn hytrach.
            </p>
          ),
        },
        group: 'children',
      },
      {
        name: 'babysitting',
        title: {
          en: 'Babysitting',
          cy: 'Gwarchod y babi',
        },
        defaultFactorValue: 1,
        information: {
          en: (
            <p>
              Unless you have a regular arrangement with your babysitter where
              you pay the same amount each week (or month), you&apos;ll probably
              need to look at your diary and see how often you&apos;ve used a
              babysitter in the past few months and work out how much
              you&apos;ve paid them.
            </p>
          ),
          cy: (
            <p>
              Os nad oes gennych chi drefniant rheolaidd gyda&apos;ch gwarchodwr
              plant drwy dalu&apos;r un swm bob wythnos (neu bob mis),
              mae&apos;n debyg y bydd angen i chi edrych drwy eich dyddiadur a
              nodi pa mor aml y bu i chi ddefnyddio gwarchodwr plant yn ystod yr
              ychydig fisoedd diwethaf a chyfrifo faint daloch chi iddynt.
            </p>
          ),
        },
        group: 'children',
      },
      {
        name: 'maintenance',
        title: {
          en: 'Maintenance or child support',
          cy: 'Cynhaliaeth neu gymorth i blant',
        },
        defaultFactorValue: 1,
        information: {
          en: (
            <p>
              Enter the full amount of child maintenance or child support that
              you pay your ex. If the amount varies, add up everything you paid
              last year and enter that, selecting &quot;year&quot; from the
              dropdown menu. That way, the calculator will work out an average
              monthly amount for you.
            </p>
          ),
          cy: (
            <p>
              Rhowch y swm llawn o gynhaliaeth plant neu gostau cynnal plant yr
              ydych yn ei dalu i&apos;ch cynbriod neu gynbartner. Os yw&apos;r
              swm yn amrywio, cyfrifwch bopeth a gawsoch y flwyddyn ddiwethaf a
              rhowch y ffigwr hwn, gan ddewis &quot;blynyddol&quot; o&apos;r
              gwymplen. Drwy wneud hynny, bydd y cyfrifiannell yn cyfrifo swm
              misol cyfartalog i chi.
            </p>
          ),
        },
        group: 'children',
      },
      // SCHOOL
      {
        name: 'school-fees',
        title: {
          en: 'School fees',
          cy: 'Ffioedd ysgol',
        },
        defaultFactorValue: getFactorValue('year'),
        information: {
          en: (
            <p>
              Add up what you spend each year and enter that amount. Be sure to
              use the dropdown menu to show that this is the yearly amount.
            </p>
          ),
          cy: (
            <p>
              Cyfrifwch yr hyn a wariwch bob blwyddyn a&apos;i roi yma.
              Sicrhewch eich bod yn defnyddio&apos;r gwymplen i ddangos mai hwn
              yw&apos;r swm blynyddol.
            </p>
          ),
        },
        group: 'school',
      },
      {
        name: 'school-trips',
        title: {
          en: 'School trips',
          cy: 'Tripiau ysgol',
        },
        defaultFactorValue: getFactorValue('year'),
        information: {
          en: (
            <p>
              Because these can vary so much - both in frequency and cost - the
              only way to get an accurate picture is to add up what you spent
              last year and enter that amount. If you pay for trips using a
              cashless system like ParentPay, for example, you can look at your
              payment history to see how much you&apos;ve spent. Be sure to use
              the dropdown menu to show that this is the yearly amount.
            </p>
          ),
          cy: (
            <p>
              Gan fod y rhain yn medru amrywio cymaint - mewn amledd a chost -
              yr unig ffordd i gael darlun cywir yw i gyfrifo faint y bu i chi
              ei wario y llynedd a rhoi&apos;r swm hwn. Os ydych yn talu am
              deithiau drwy ddefnyddio system sy&apos;n rhydd o arian parod
              megis ParentPay, er enghraifft, gallwch edrych ar archif eich
              taliadau i weld faint a wariwyd. Sicrhewch eich bod yn
              defnyddio&apos;r gwymplen i ddangos mai hwn yw&apos;r swm
              blynyddol.
            </p>
          ),
        },
        group: 'school',
      },
      {
        name: 'school-dinners',
        title: {
          en: 'School dinners',
          cy: 'Cinio ysgol',
        },
        defaultFactorValue: getFactorValue('year'),
        information: {
          en: (
            <>
              <p>
                Don&apos;t forget to take into account school holidays when
                working out how much you spend on school dinners. Many schools
                have 13 weeks&apos; holiday each year, so you could multiply
                your weekly spend by 39 to get a yearly amount.
              </p>
              <p>
                If you think you might qualify for help with school meals, see
                our guide:
              </p>
              <p>
                <a
                  href="https://www.moneyhelper.org.uk/en/blog/benefits-entitlements/free-school-meals-eligibility-and-how-to-apply"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Make sure you&apos;re getting the right entitlements
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Peidiwch ag anghofio ystyried gwyliau ysgol wrth gyfrifo faint
                wariwch chi ar ginio ysgol. Mae gan nifer o ysgolion 13 wythnos
                o wyliau bob blwyddyn, felly gallech luosi eich gwariant
                wythnosol gyda 39 i gael swm blynyddol.
              </p>
              <p>
                Os credwch eich bod yn gymwys i gael cymorth i dalu am brydau
                bwyd ysgol, darllenwch ein canllaw:
              </p>
              <p>
                <a
                  href="https://www.moneyhelper.org.uk/cy/blog/benefits-entitlements/free-school-meals-eligibility-and-how-to-apply"
                  target="_blank"
                  rel="noreferrer"
                  className="text-magenta-500 underline"
                >
                  Sicrhewch eich bod yn cael yr hawliadau cywir
                </a>
              </p>
            </>
          ),
        },
        group: 'school',
      },
      {
        name: 'school-clubs',
        title: {
          en: 'After-school clubs',
          cy: 'Clybiau ar ôl ysgol',
        },
        defaultFactorValue: getFactorValue('year'),
        information: {
          en: (
            <>
              <p>
                Don&apos;t forget to take into account term time and school
                holidays when working out how much you spend on after-school
                clubs. Many schools have 13 weeks&apos; holiday each year, so
                you could multiply your weekly spend by 39 to get a term-time
                yearly amount.
              </p>
              <p>
                And if your children go to school holiday clubs you could
                multiply the weekly amount by 13 (or however many weeks they go)
                and enter that amount here too.
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Peidiwch ag anghofio ystyried cyfnod y tymor a gwyliau ysgol
                wrth gyfrifo faint wariwch chi ar glybiau ar ôl ysgol. Mae gan
                nifer o ysgolion 13 wythnos o wyliau bob blwyddyn, felly gallech
                luosi eich gwariant wythnosol gyda 39 i gael swm blynyddol
                cyfnod tymor ysgol.
              </p>
              <p>
                Ac os aiff eich plant i glybiau gwyliau ysgol gallech
                luosi&apos;r swm wythnosol gyda 13 (neu&apos;r nifer o wythnosau
                priodol) a rhoi&apos;r swm hwnnw yma hefyd.
              </p>
            </>
          ),
        },
        group: 'school',
      },
      // SUPPORT FOR STUDENT CHILDREN
      {
        name: 'support-student',
        title: {
          en: 'Support for student children',
          cy: 'Cefnogaeth i blant myfyrwyr',
        },
        defaultFactorValue: 1,
        information: {
          en: (
            <p>
              If your older children are students and you help them out
              financially, enter the amount you pay them here.
            </p>
          ),
          cy: (
            <p>
              Os yw eich plant hŷn yn fyfyrwyr a&apos;ch bod yn rhoi cymorth
              ariannol iddynt, rhowch y swm a delir iddynt yma.
            </p>
          ),
        },
        group: 'support-student',
      },
      // SUPPORT FOR OTHER RELATIVES
      {
        name: 'support-relatives',
        title: {
          en: 'Support for other relatives',
          cy: 'Cefnogaeth i berthnasau eraill',
        },
        defaultFactorValue: 1,
        information: {
          en: (
            <p>
              If you provide any financial help for other family members enter
              the amount here.
            </p>
          ),
          cy: (
            <p>
              Os ydych yn rhoi cymorth ariannol i aelodau eraill o&apos;r teulu
              rhowch y swm yma.
            </p>
          ),
        },
        group: 'support-relatives',
      },
      // PETS
      {
        name: 'pet-food',
        title: {
          en: 'Food',
          cy: 'Bwyd',
        },
        defaultFactorValue: getFactorValue('week'),
        information: {
          en: (
            <p>
              Don&apos;t include this if you&apos;ve already counted it in your
              weekly shop. But if you buy pet food separately, and you
              haven&apos;t already counted it, make sure you include it here.
            </p>
          ),
          cy: (
            <p>
              Peidiwch â chynnwys hyn os ydych wedi ei gynnwys yn eich siopa
              wythnosol eisoes. Ond os prynwch fwyd anifeilaid anwes ar wahân,
              ac nid ydych wedi ei gynnwys eisoes, cofiwch ei gynnwys yma.
            </p>
          ),
        },
        group: 'pets',
      },
      {
        name: 'vet-bills',
        title: {
          en: 'Vet bills',
          cy: 'Biliau milfeddyg',
        },
        defaultFactorValue: getFactorValue('year'),
        information: {
          en: (
            <>
              <p>
                This is a tricky one to budget for since you don&apos;t know
                what&apos;s going to happen with your pet&apos;s health in the
                future.
              </p>
              <p>
                If your pet is young and healthy you are probably OK to just
                budget for routine care here. But if your pet has an existing
                condition and you frequently pay for treatment you should add up
                how much you&apos;ve spent at the vet over the past year and
                enter that amount.
              </p>
              <p>
                If you have pet insurance you should put the amount you pay in
                the box below. Remember though to include the excess (the amount
                you pay yourself towards any treatment you claim for).
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Mae hwn yn un anodd i&apos;w gyllidebu ar ei gyfer gan nad ydych
                yn gwybod beth sy&apos;n mynd i ddigwydd ymghylch iechyd eich
                anifail anwes yn y dyfodol.
              </p>
              <p>
                Os yw eich anifail anwes yn ifanc ac yn iach yna mae&apos;n
                debyg mai dim ond gofal arferol y dylech chi gyllido ar ei
                gyfer. Ond os oes gan eich anifail anwes gyflwr eisoes a&apos;ch
                bod yn talu am driniaeth yn aml dylech gyfrifo faint yr ydych
                wedi ei dalu i&apos;r milfeddyg dros y flwyddyn ddiwethaf a
                rhoi&apos;r swm hwn.
              </p>
              <p>
                Os oes gennych yswiriant anifeiliaid anwes dylech roi&apos;r swm
                hwn yn y blwch isod. Cofiwch gynnwys y tâl dros ben (y swm a
                dalwch eich hun tuag at y gost a hawliwch).
              </p>
            </>
          ),
        },
        group: 'pets',
      },
      {
        name: 'pet-insurance',
        title: {
          en: 'Pet insurance',
          cy: 'Yswiriant anifeiliaid anwes',
        },
        defaultFactorValue: 1,
        information: {
          en: (
            <p>
              Check your policy details or your bank statement to find out
              exactly what your monthly premiums are.
            </p>
          ),
          cy: (
            <p>
              Gwiriwch fanylion eich polisi neu eich cyfriflen banc i ganfod
              faint yn union yw eich premiymau misol.
            </p>
          ),
        },
        group: 'pets',
      },
      // DONATIONS
      {
        name: 'donations',
        title: {
          en: 'Donations & sponsorships',
          cy: 'Rhoddion a nawdd',
        },
        defaultFactorValue: 1,
        information: {
          en: (
            <p>
              If you have any Direct Debits set up with charities, enter the
              total amount here. Also include any ad hoc donations you make to
              charity, or fundraising events. Don&apos;t forget to include
              raffle tickets, and money spent at school or church fairs, etc.
            </p>
          ),
          cy: (
            <p>
              Os oes gennych Ddebydau Uniongyrchol wedi eu sefydlu gydag
              elusennau, rhowch y swm yma. Rhowch unrhyw gyfraniadau achlysurol
              i elusen, neu ddigwyddiadau codi arian. Peidiwch ag anghofio
              cynnwys tocynnau raffl, ac arian a warir mewn ffeiriau ysgol neu
              eglwys ac ati.
            </p>
          ),
        },
        group: 'donations',
      },
      // FAMILY LOAN
      {
        name: 'loan',
        title: {
          en: 'Loan repayment to family/friend',
          cy: 'Ad-dalu benthyciad i deulu/ffrind',
        },
        defaultFactorValue: 1,
        information: {
          en: (
            <p>
              If you&apos;ve borrowed money from a family member or a friend
              enter the amount you have agreed to repay here.
            </p>
          ),
          cy: (
            <p>
              Os ydych wedi benthyca arian gan aelod o&apos;r teulu neu ffrind
              rhowch y swm y cytunoch i&apos;w ad-dalu yma.
            </p>
          ),
        },
        group: 'family-loan',
      },
      ...createAdditionalItems('family-friends'),
    ],
  },
  {
    name: 'travel',
    title: {
      en: 'Travel',
      cy: 'Teithio',
    },
    colour: '#000B3A',
    nextTab: `leisure`,
    submit: {
      en: 'Leisure',
      cy: 'Hamdden',
    },
    function: subtract,
    fields: [
      {
        defaultFactorValue: 1,
        name: 'petrol-diesel',
        title: {
          en: 'Petrol/diesel/electric charging ports',
          cy: 'Petrol/diesel/pyrth gwefru cerbyd trydan',
        },
        information: {
          en: (
            <>
              <p>
                Check your bank statements to see how much you spend on fuel or
                charging ports for your car.
              </p>
              <p>
                If you want to find out more about saving money on fuel, see:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/buying-and-running-a-car/cut-your-car-and-train-costs?source=mas"
                  rel="noreferrer"
                  target="_blank"
                  className="text-magenta-500 underline"
                >
                  Cut down on car and travel costs
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Gwiriwch eich datganiad banc i weld faint rydych yn ei wario ar
                danwydd neu byrth gwefru am eich car.
              </p>
              <p>
                Os ydych am ddarganfod fwy am arbed arian ar danwydd, edrychwch
                ar:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/cy/everyday-money/buying-and-running-a-car/cut-your-car-and-train-costs?source=mas"
                  rel="noreferrer"
                  target="_blank"
                  className="text-magenta-500 underline"
                >
                  Torri costau car a theithio
                </a>
              </p>
            </>
          ),
        },
        group: 'car-costs',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'car-insurance',
        title: {
          en: 'Car insurance',
          cy: 'Yswiriant car',
        },
        information: {
          en: (
            <>
              <p>
                Check your policy details or your bank statement to find out
                exactly what your monthly or yearly premiums are.
              </p>
              <p>
                If your policy is coming up for renewal you might find that
                it&apos;s worth shopping around. Find out more:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/insurance/car-insurance-what-you-need-to-know?source=mas"
                  rel="noreferrer"
                  target="_blank"
                  className="text-magenta-500 underline"
                >
                  Car insurance - how to get the best deal
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Gwiriwch fanylion eich polisi neu eich cyfriflen banc i ganfod
                faint yn union yw eich premiymau misol neu flynyddol.
              </p>
              <p>
                Os yw eich polisi ar fin cael ei adnewyddu efallai y byddai o
                fantais ichi siopa o gwmpas. Cewch fwy o wybodaeth yn:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/cy/everyday-money/insurance/car-insurance-what-you-need-to-know?source=mas"
                  rel="noreferrer"
                  target="_blank"
                  className="text-magenta-500 underline"
                >
                  Yswiriant car - sut i gael y ddêl orau
                </a>
              </p>
            </>
          ),
        },
        group: 'car-costs',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'breakdown-cover',
        title: {
          en: 'Breakdown cover',
          cy: 'Yswiriant torri i lawr',
        },
        information: {
          en: (
            <p>
              Enter the amount you spend on breakdown cover. If this is included
              as part of your car insurance policy you can leave this box blank.
            </p>
          ),
          cy: (
            <p>
              Rhowch y swm a wariwch ar ddiogelwch car yn torri i lawr. Os yw
              hyn wedi ei gynnwys fel rhan o&apos;ch polisi yswiriant car cewch
              adael y blwch hwn yn wag.
            </p>
          ),
        },
        group: 'car-costs',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'car-tax',
        title: {
          en: 'Car tax',
          cy: 'Treth cerbyd',
        },
        information: {
          en: (
            <>
              <p>
                The price of car tax varies depending on the type of car you
                drive and its engine size. If you&apos;re not sure how much you
                pay, see the{' '}
                <a
                  href="https://www.gov.uk/check-tax-rates-new-unregistered-cars"
                  rel="noreferrer"
                  target="_blank"
                  className="text-magenta-500 underline"
                >
                  Gov.uk website
                </a>{' '}
                to find out.
              </p>
              <p>
                It works out more cost effective to buy a 12-month tax disc
                rather than a 6-month one, so if you can budget for a yearly
                payment it will save you a bit of cash.
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Mae pris treth car yn amrywio gan ddibynnu ar y math o gar sydd
                gennych a maint yr injan. Os ydych yn ansicr faint yr ydych yn
                ei dalu, ewch i wefan{' '}
                <a
                  href="https://www.gov.uk/check-tax-rates-new-unregistered-cars"
                  rel="noreferrer"
                  target="_blank"
                  className="text-magenta-500 underline"
                >
                  Gov.uk
                </a>{' '}
                i gael y wybodaeth.
              </p>
              <p>
                Mae&apos;n fwy costeffeithiol i brynu disg dreth 12 mis yn
                hytrach nag un 6 mis, felly os y gallwch fforddio taliad
                blynyddol byddwch yn arbed ychydig o arian.
              </p>
            </>
          ),
        },
        group: 'car-costs',
      },
      {
        defaultFactorValue: 1,
        name: 'car-finance',
        title: {
          en: 'Car finance or loan repayment',
          cy: 'Ad-dalu cyllid neu fenthyciad car',
        },
        information: {
          en: (
            <>
              <p>
                Check your paperwork or your bank statement to find out exactly
                what your monthly repayments are.
              </p>
              <p>
                Why not see if you could cut the cost of your car finance
                agreement or personal loan. See our guides:
              </p>
              <p>
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/buying-and-running-a-car/cut-your-car-finance-hire-purchase-and-other-finance-costs?source=mas"
                  rel="noreferrer"
                  target="_blank"
                  className="text-magenta-500 underline"
                >
                  Cut car finance, hire purchase and other finance costs
                </a>{' '}
                and{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/money-troubles/cost-of-living/bill-prioritiser"
                  rel="noreferrer"
                  target="_blank"
                  className="text-magenta-500 underline"
                >
                  How to reduce the cost of your personal loans
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Gwiriwch fanylion eich polisi neu eich cyfriflen banc i ganfod
                faint yn union yw eich ad-daliadau misol.
              </p>
              <p>
                Pam nad ewch chi ati i weld a allech chi leihau cost eich
                cytundeb benthyciad talu am gar neu fenthyciad personol. Gweler
                ein canllawiau:
              </p>
              <p>
                <a
                  href="https://www.moneyhelper.org.uk/cy/everyday-money/buying-and-running-a-car/cut-your-car-finance-hire-purchase-and-other-finance-costs?source=mas"
                  rel="noreferrer"
                  target="_blank"
                  className="text-magenta-500 underline"
                >
                  Lleihau costau sy&apos;n gysylltiedig â phrynu car, hurbwrcas
                  a chostau cyllid eraill
                </a>{' '}
                a{' '}
                <a
                  href="https://www.moneyhelper.org.uk/cy/money-troubles/cost-of-living/bill-prioritiser"
                  rel="noreferrer"
                  target="_blank"
                  className="text-magenta-500 underline"
                >
                  Sut i leihau cost eich benthyciadau personol
                </a>
              </p>
            </>
          ),
        },
        group: 'car-costs',
      },
      {
        defaultFactorValue: 1,
        name: 'loan-insurance',
        title: {
          en: 'Loan insurance',
          cy: 'Yswiriant benthyciad',
        },
        information: {
          en: (
            <>
              <p>
                Loan insurance (or payment protection) covers your car finance
                or loan repayments if you are ill, have an accident or are made
                redundant.
              </p>
              <p>
                If you have a stand-alone policy, check your policy details or
                bank statement to find out exactly what your monthly premiums
                are.
              </p>
              <p>
                If you pay for the cover alongside your repayments, it might be
                easier to leave this box blank and enter the total amount under
                &apos;Car finance or loan repayment&apos; above.
              </p>
              <p>
                If you think you might have been mis-sold the policy, see:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/insurance?source=mas"
                  rel="noreferrer"
                  target="_blank"
                  className="text-magenta-500 underline"
                >
                  How to claim for mis-sold payment protection insurance (PPI)
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Mae yswiriant diogelu taliadau benthyca yn diogelu eich
                ad-daliadau prynu car neu fenthyciadau os ydych yn sâl, wedi
                cael damwain neu yn colli eich swydd.
              </p>
              <p>
                Os oes gennych bolisi unigol, gwiriwch fanylion y polisi hwn neu
                eich cyfriflen banc i ganfod faint yn union yw eich premiymau
                misol.
              </p>
              <p>
                Os ydych yn talu am eich yswiriant ochr yn ochr â&apos;ch
                ad-daliadau, gall fod yn haws i chi adael y blwch hwn yn wag a
                rhoi&apos;r swm dan &apos;Ad-dalu prynu car neu fenthyciad&apos;
                uchod.
              </p>
              <p>
                Os ydych o&apos;r farn bod y polisi wedi ei gam-werthu i chi,
                ewch i:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/cy/everyday-money/insurance?source=mas"
                  rel="noreferrer"
                  target="_blank"
                  className="text-magenta-500 underline"
                >
                  Sut i hawlio yswiriant gwarchod taliadau a gamwerthwyd (PPI).
                </a>
              </p>
            </>
          ),
        },
        group: 'car-costs',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'mot',
        title: {
          en: 'MOT',
          cy: 'MOT',
        },
        information: {
          en: (
            <>
              <p>
                Check MOT fees on the{' '}
                <a
                  href="https://www.gov.uk/getting-an-mot/mot-test-fees"
                  rel="noreferrer"
                  target="_blank"
                  className="text-magenta-500 underline"
                >
                  GOV.UK
                </a>{' '}
                website.
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Gwiriwch ffioedd MOT ar wefan{' '}
                <a
                  href="https://www.gov.uk/getting-an-mot/mot-test-fees"
                  rel="noreferrer"
                  target="_blank"
                  className="text-magenta-500 underline"
                >
                  GOV.UK
                </a>
              </p>
            </>
          ),
        },
        group: 'car-costs',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'maintenance',
        title: {
          en: 'Maintenance & repairs',
          cy: 'Cynnal a chadw a thrwsio',
        },
        information: {
          en: (
            <>
              <p>
                This is a tricky one to budget for since you don&apos;t know
                what&apos;s going to go wrong with your car in the future.
              </p>
              <p>
                If your car is fairly new and problem-free you are probably OK
                to just budget for routine maintenance here. But if you
                frequently break down you should add up how much you&apos;ve
                spent on repairs over the past year and enter that amount.
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Mae hwn yn un anodd i&apos;w gyllidebu ar ei gyfer gan nad ydych
                yn gwybod beth fydd yn mynd o chwith gyda&apos;ch car yn y
                dyfodol.
              </p>
              <p>
                Os yw eich car yn eithaf newydd ac yn rhydd o unrhyw broblemau
                yna mae&apos;n debyg mai dim ond gofal arferol y dylech chi
                gyllido ar ei gyfer yma. Ond os yw eich car yn torri i lawr yn
                aml dylech gyfrifo faint warioch chi arno wrth ei drwsio dros y
                flwyddyn ddiwethaf a rhoi&apos;r swm hwnnw.
              </p>
            </>
          ),
        },
        group: 'car-costs',
      },
      {
        defaultFactorValue: 1,
        name: 'parking',
        title: {
          en: 'Parking & tolls',
          cy: 'Parcio a thollau',
        },
        information: {
          en: (
            <p>
              Enter the amount you pay to use car parks, and also work out the
              cost of any parking tickets you get, over the time period you
              select in the dropdown menu.
            </p>
          ),
          cy: (
            <p>
              Rhowch y swm a wariwch i ddefnyddio meysydd parcio, a chyfrifwch
              hefyd gost unrhyw daliadau cosb parcio dros y cyfnod o amser a
              ddewiswch yn y gwymplen.
            </p>
          ),
        },
        group: 'car-costs',
      },
      {
        defaultFactorValue: 1,
        name: 'bus',
        title: {
          en: 'Bus, tube & tram fares',
          cy: 'Tocynnau bws, trên tanddaearol a thram',
        },
        information: {
          en: (
            <>
              <p>
                Enter the cost of your daily commute on public transport plus
                any travelling around that you do at evenings and weekends.
              </p>
              <p>
                Want to find out more about saving money on public transport?
                See our guide:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/buying-and-running-a-car/cut-your-car-and-train-costs?source=mas"
                  rel="noreferrer"
                  target="_blank"
                  className="text-magenta-500 underline"
                >
                  Cut down on car and travel costs
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Rhowch gost eich teithio dyddiol ar drafnidiaeth gyhoeddus yn
                ogystal ag unhryw deithiau gyda&apos;r nos neu ar benwythnosau.
              </p>
              <p>
                Hoffech chi gael gwybod rhagor ynglŷn ag arbed arian ar
                drafnidiaeth gyhoeddus? Gweler ein canllaw:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/cy/everyday-money/buying-and-running-a-car/cut-your-car-and-train-costs?source=mas"
                  rel="noreferrer"
                  target="_blank"
                  className="text-magenta-500 underline"
                >
                  Cwtogwch ar gostau car a theithio
                </a>
              </p>
            </>
          ),
        },
        group: 'public-transport',
      },
      {
        defaultFactorValue: 1,
        name: 'trains',
        title: {
          en: 'Trains',
          cy: 'Trenau',
        },
        information: {
          en: (
            <>
              <p>Enter the cost of train travel here.</p>
              <p>
                If you want to find out more about saving money on train
                tickets, see our guide:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/buying-and-running-a-car/cut-your-car-and-train-costs?source=mas"
                  rel="noreferrer"
                  target="_blank"
                  className="text-magenta-500 underline"
                >
                  Cut down on car and travel costs
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>Rhowch y gost o deithio ar drên yma.</p>
              <p>
                Os hoffech ddarganfod rhagor ynglŷn ag arbed arian ar docynnau
                trên, darllenwch ein canllaw:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/cy/everyday-money/buying-and-running-a-car/cut-your-car-and-train-costs?source=mas"
                  rel="noreferrer"
                  target="_blank"
                  className="text-magenta-500 underline"
                >
                  Cwtogwch ar gostau car a theithio
                </a>
              </p>
            </>
          ),
        },
        group: 'public-transport',
      },
      {
        defaultFactorValue: 1,
        name: 'taxis',
        title: {
          en: 'Taxis',
          cy: 'Tacsis',
        },
        information: {
          en: (
            <p>
              Enter the amount you spend on taxi fares here. Remember to include
              taxis to and from work, taxis you get as part of your social life
              and taxis as part of longer journeys, for example to and from the
              station or airport.
            </p>
          ),
          cy: (
            <p>
              Rhowch y swm a wariwch ar gostau tacsi yma. Cofiwch gynnwys tacsi
              i&apos;r gwaith ac yn ôl, tacsis fel rhan o&apos;ch bywyd
              cymdeithasol a thacsis fel rhan o deithiau hirach, i&apos;r
              stesion neu i&apos;r maes awyr ac yn ôl er enghraifft.
            </p>
          ),
        },
        group: 'public-transport',
      },
      {
        defaultFactorValue: 1,
        name: 'air',
        title: {
          en: 'Air travel',
          cy: 'Hedfan',
        },
        information: {
          en: (
            <p>
              {`Enter the amount you spend on air travel here. There's no need to
              include holiday flights here - these are covered on the 'Leisure'
              page.`}
            </p>
          ),
          cy: (
            <p>
              {`Rhowch y swm a wariwch ar hedfan yma. Nid oes angen cynnwys
              hediadau gwyliau yma - mae'r rhain yn cael eu cynnwys ar y dudalen
              'Hamdden'.`}
            </p>
          ),
        },
        group: 'public-transport',
      },
      ...createAdditionalItems('travel'),
    ],
  },
  {
    name: 'leisure',
    title: {
      en: 'Leisure',
      cy: 'Hamdden',
    },
    colour: '#8E2A9E',
    nextTab: `summary`,
    submit: {
      en: 'Summary',
      cy: 'Crynodeb',
    },
    function: subtract,
    fields: [
      {
        name: 'cinema-theatre-trips',
        title: {
          en: 'Cinema, festivals & theatre',
          cy: 'Sinema, gwyliau & theatr',
        },
        defaultFactorValue: 1,
        information: {
          en: (
            <p>
              Check your diary or bank statements to see how much you spend on
              trips to the cinema, festivals and theatre. You should also
              include any music events here. You may find it more accurate to
              work this out over a year, especially if you go irregularly.
              Remember to include all the extras as well as the ticket price:
              drinks, popcorn, merchandise, parking, etc.
            </p>
          ),
          cy: (
            <p>
              Gwiriwch eich dyddiadur neu’ch datganiadau banc i weld faint
              rydych yn ei wario ar deithiau i’r sinema, gwyliau a theatr.
              Dylech hefyd gynnwys unrhyw ddigwyddiadau cerddoriaeth yma.
              Efallai wnewch chi ei chael yn haws i gyfrifo hwn dros flwyddyn,
              yn enwedig os nad ydych yn mynd yn rheolaidd. cofiwch gynnwys yr
              holl bethau ychwanegol yn ogystal â phris y tocyn: diodydd,
              popcorn, nwyddau, parcio, ayyb.
            </p>
          ),
        },
        group: 'entertainment',
      },
      {
        name: 'days-out',
        title: {
          en: 'Days out',
          cy: 'Dyddiau allan',
        },
        defaultFactorValue: 1,
        information: {
          en: (
            <p>
              Check your diary or bank statements to see how much you spend on
              days out. You might find it more accurate to work this out over a
              year. Remember the cost of a day out is more than just the
              entrance fee to wherever you go. You need to include: parking,
              lunch, ice creams and anything else.
            </p>
          ),
          cy: (
            <p>
              Gwiriwch eich dyddiadur neu gyfriflenni banc i ganfod faint
              wariwch chi ar ddyddiau hamdden. Efallai y byddai&apos;n fwy cywir
              os cyfrifwch hyn dros gyfnod o flwyddyn. Cofiwch fod y gost o fynd
              allan am y dydd i hamddena yn fwy na dim ond pris mynediad yr
              atyniad. Bydd angen i chi gynnwys: parcio, cinio, hufen iâ ac
              unrhyw beth arall.
            </p>
          ),
        },
        group: 'entertainment',
      },
      {
        name: 'books-etc',
        title: {
          en: 'TV, music, media and gaming subscriptions',
          cy: 'Tanysgrifiadau teledu, cerddoriaeth, cyfryngau a gêmio',
        },
        defaultFactorValue: 1,
        information: {
          en: (
            <p>
              Remember to include the cost of streaming and gaming
              subscriptions, downloads as well as physical books.Your bank
              statements should be a help.
            </p>
          ),
          cy: (
            <p>
              Cofiwch gynnwys costau tanysgrifiadau ffrydio a gêmio,
              lawrlwythiadau yn ogystal â llyfrau corfforol. Dylai eich
              datganiadau banc helpu.
            </p>
          ),
        },
        group: 'entertainment',
      },
      {
        name: 'hobbies',
        title: {
          en: 'Hobbies',
          cy: 'Diddordebau',
        },
        defaultFactorValue: 1,
        information: {
          en: (
            <p>
              Check your diary or bank statements to see how much you (and the
              rest of the family) spend on hobbies. For the kids, there&apos;s
              no need to include anything that you&apos;ve already put in under
              &apos;Activities & clubs&apos;. You may find it more accurate to
              work this out over a year, especially if you spend money
              irregularly. Remember to include all the extras too such as the
              cost of travel, parking, accommodation and equipment.
            </p>
          ),
          cy: (
            <p>
              Gwiriwch eich dyddiadur neu gyfriflenni banc i ganfod faint
              wariwch chi (a gweddill y teulu) ar ddiddordebau. Ar gyfer y
              plant, nid oes angen cynnwys unrhyw beth yr ydych wedi ei roi
              eisoes dan &apos;Gweithgareddau a chlybiau&apos;. Efallai y
              byddai&apos;n fwy cywir os cyfrifwch hyn dros gyfnod o flwyddyn,
              yn enwedig os nad ydych yn gwario&apos;n rheolaidd. Cofiwch
              gynnwys yr holl bethau ychwanegol hefyd megis y gost o deithio,
              parcio, llety ac offer.
            </p>
          ),
        },
        group: 'entertainment',
      },
      {
        name: 'eating-out',
        title: {
          en: 'Eating out & drinking',
          cy: 'Bwyta allan & yfed',
        },
        defaultFactorValue: 1,
        information: {
          en: (
            <p>
              Check your bank statements to see how much this comes to over a
              period of a few months. Remember after-work drinks as well as
              going to the pub with friends and family. If you leave a cash tip
              you&apos;ll need to add a bit extra as this won&apos;t show up on
              your bank statement. Only include extras such as parking, taxis,
              babysitters, and so on if you haven&apos;t already counted these
              in &apos;Travel&apos; and &apos;Family & friends&apos;.
            </p>
          ),
          cy: (
            <p>
              Gwiriwch eich datganiadau banc i weld faint yw cyfanswm hyn dros
              gyfnod o ychydig fisoedd. Cofiwch ddiodydd ar ôl gwaith yn ogystal
              â mynd i’r dafarn gyda ffrindiau a theulu. Os ydych yn gadael tip
              arian parod bydd angen ychwanegu swm bach ychwanegol gan na fydd
              hwn yn ymddangos ar eich datganiad banc. Dylech ond cynnwys pethau
              ychwanegol fel parcio, tacsis, gwarchodwr plant, ac yn y blaen os
              nad ydych yn barod wedi’u cynnwys yn ‘Teithio’ a ‘Teulu a
              ffrindiau’.
            </p>
          ),
        },
        group: 'entertainment',
      },
      {
        name: 'sport',
        title: {
          en: 'Health & fitness',
          cy: 'Iechyd a ffitrwydd',
        },
        defaultFactorValue: 1,
        information: {
          en: (
            <p>
              If you pay a monthly gym membership, enter it here. You should
              also include the cost of any other sports activities you take part
              in and the clothes and equipment you buy.
            </p>
          ),
          cy: (
            <p>
              Os ydych yn talu aelodaeth o gampfa, rhowch hynny yma. Hefyd
              dylech gynnwys cost unrhyw weithgareddau chwaraeon yr ydych yn
              cymryd rhan ynddynt yn ogystal â&apos;r dillad a&apos;r offer a
              brynwch.
            </p>
          ),
        },
        group: 'entertainment',
      },
      {
        name: 'lottery',
        title: {
          en: 'Lottery & online gambling',
          cy: 'Lottery a gamblo ar-lein',
        },
        defaultFactorValue: getFactorValue('week'),
        information: {
          en: (
            <p>
              Include everything you spend on lottery tickets and scratch cards
              that you buy yourself plus any regular payments you make to a
              syndicate. If you gamble, either online or at a bookmakers
              it&apos;s important that you&apos;re really honest with yourself
              about the amount you spend. Don&apos;t try to estimate future
              winnings and take that off the total; just put down everything you
              spend on bets.
            </p>
          ),
          cy: (
            <p>
              Cofiwch gynnwys popeth a wariwch ar docynnau loteri a chardiau
              crafu a brynwch eich hun ac unrhyw daliadau rheolaidd i syndicet.
              Os ydych yn hapchwarae, un ai ar-lein neu mewn bwci mae&apos;n
              bwysig eich bod yn wir onest â&apos;ch hun a rhoi&apos;r swm cywir
              a wariwch. Peidiwch â cheisio amcangyfrif enillion y dyfodol a
              thynnu hynny oddi ar y cyfanswm; rhowch yr hyn a wariwch ar fetiau
              yn unig.
            </p>
          ),
        },
        group: 'entertainment',
      },
      {
        name: 'newspapers',
        title: {
          en: 'Books, games and films',
          cy: 'Llyfrau, gemau a ffilmiau',
        },
        defaultFactorValue: getFactorValue('week'),
        information: {
          en: (
            <>
              <p>
                If you want to work out how much your daily paper or weekly
                magazine costs over a period of time, try our{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/budgeting/beginners-guide-to-managing-your-money"
                  rel="noreferrer"
                  target="_blank"
                  className="text-magenta-500 underline"
                >
                  Beginner&apos;s guide to managing your money
                </a>
              </p>
              <p>
                You should also include here any subscriptions for online or
                printed magazines, periodicals and newspapers.
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Os hoffech chi gyfrifo beth yw cost eich papur newydd dyddiol
                neu gylchgrawn wythnosol dros gyfnod o amser, rhowch gynnig ar
                ein{' '}
                <a
                  href="https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/beginners-guide-to-managing-your-money"
                  rel="noreferrer"
                  target="_blank"
                  className="text-magenta-500 underline"
                >
                  Cyfrifiannell torri&apos;n ôl
                </a>
              </p>
              <p>
                Dylech gynnwys yma unrhyw danysgrifiadau hefyd ar gyfer
                cylchgronau ar-lein neu wedi eu hargraffu, cyfnodolion a
                phapurau newydd.
              </p>
            </>
          ),
        },
        group: 'entertainment',
      },
      {
        name: 'birthdays',
        title: {
          en: 'Birthdays',
          cy: 'Penblwyddi',
        },
        defaultFactorValue: getFactorValue('year'),
        information: {
          en: (
            <p>
              This is one of those costs that you have to work out across the
              year as a whole. Think about how many people you buy birthday
              presents for each year. You might want to make separate lists for
              family, close friends, children&apos;s friends, work colleagues,
              etc. Then look at how much you typically spend on each person. If
              you tend to throw a party for the birthday boy or girl, make sure
              you include that too. Then add the whole lot together and be sure
              to select &apos;year&apos; from the dropdown menu.
            </p>
          ),
          cy: (
            <p>
              Mae hwn yn un o&apos;r ffigurau sydd angen i chi ei gyfrifo ar hyd
              y flwyddyn. Meddyliwch faint o anrhegion penblwydd a brynwch bob
              blwyddyn. Efallai yr hoffech chi wneud rhestrau gwahanol ar gyfer
              teulu, ffrindiau agos, ffrindiau&apos;r plant, cydweithwyr ac ati.
              Yna edrychwch ar faint wariwch chi fel arfer ar bob unigolyn. Os
              ydych yn dueddol o gynnal parti penblwydd ar gyfer mab neu ferch,
              nodwch hynny hefyd. Yna cyfrifwch y cyfan a dewiswch yr opsiwn
              &apos;blynyddol&apos; o&apos;r gwymplen.
            </p>
          ),
        },
        group: 'one-offs',
      },
      {
        name: 'christmas',
        title: {
          en: 'Christmas',
          cy: 'Nadolig',
        },
        defaultFactorValue: getFactorValue('year'),
        information: {
          en: (
            <p>
              Last December&apos;s bank statement will come in handy here. Make
              a list of everyone you buy Christmas presents for and write
              alongside how much you spend on each of them. You also need to add
              up what you spend on your Christmas food shop, the cost of any
              parties and extra drinks, etc. Remember the cost of the tree and
              any decorations you buy each year. Then add the whole lot together
              and be sure to select &apos;year&apos; from the dropdown menu.
            </p>
          ),
          cy: (
            <p>
              Bydd cyfriflen banc mis Rhagfyr y llynedd o ddefnydd yma. Gwnewch
              restr o&apos;r holl anrhegion Nadolig a brynwch i bobl ac
              ysgrifennu faint wariwch chi ar bob eitem. Bydd angen i chi
              gyfrifo faint wariwch chi ar eich siopa bwyd Nadolig, cost unrhyw
              bartïon a diodydd ychwanegol ac ati. Cofiwch am y gost o brynu
              coeden ac unrhyw addurniadau a brynwch bob blwyddyn. Yna cyfrifwch
              y cyfan a dewiswch yr opsiwn &apos;blynyddol&apos; o&apos;r
              gwymplen.
            </p>
          ),
        },
        group: 'one-offs',
      },
      {
        name: 'festivals-celebrations',
        title: {
          en: 'Other celebrations',
          cy: 'Dathliadau eraill',
        },
        defaultFactorValue: getFactorValue('year'),
        information: {
          en: (
            <p>
              List all the festivals and celebrations throughout the course of
              the year. Add up the cost of everything involved, including
              presents, food, drink, travel, fireworks, etc. Be sure to select
              &apos;year&apos; from the dropdown menu.
            </p>
          ),
          cy: (
            <p>
              Rhestrwch yr holl ddigwyddiadau a dathliadau gydol y flwyddyn.
              Cyfrifwch gost hyn, gan gynnwys anrhegion, bwyd, diod, teithio,
              tân gwyllt ac ati. Gwnewch yn siŵr eich bod yn dewis yr opsiwn
              &apos;blynyddol&apos; o&apos;r gwymplen.
            </p>
          ),
        },
        group: 'one-offs',
      },
      {
        name: 'weddings',
        title: {
          en: 'Weddings',
          cy: 'Priodasau',
        },
        defaultFactorValue: getFactorValue('year'),
        information: {
          en: (
            <>
              <p>
                Think about how many weddings you&apos;re going to next year.
                Add up the cost of things you&apos;re going to have to pay for
                like hen/stag nights, new outfits, presents, accommodation,
                drinks, etc and enter it here.
              </p>
              <p>
                If there&apos;s a wedding coming up that you&apos;re paying for
                - maybe it&apos;s your own or your child&apos;s - enter the full
                budget here to ensure it&apos;s covered by your budget.
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Meddyliwch am faint o briodasau y byddwch yn eu mynychu y
                flwyddyn nesaf. Cyfrifwch gost pethau fydd angen i chi dalu
                amdanynt megis nosweithiau&apos;r darpar briodfab neu&apos;r
                briodferch, dillad newydd, anrhegion, llety, diodydd ac ati,
                a&apos;i roi yma.
              </p>
              <p>
                Os oes priodas ar y gweill yr ydych yn talu amdani - efallai
                eich priodas chi eich hun neu eich plentyn - rhowch y gyllideb
                gyfan yma i sicrhau eich bod yn cyllidebu ar ei chyfer.
              </p>
            </>
          ),
        },
        group: 'one-offs',
      },
      {
        name: 'holidays',
        title: {
          en: 'Holidays',
          cy: 'Gwyliau',
        },
        defaultFactorValue: getFactorValue('year'),
        information: {
          en: (
            <>
              <p>
                For any holidays you&apos;re going on this year add up all the
                costs, including travel, accommodation, passports, etc.
              </p>
              <p>
                Why not see if you could cut the cost of your next holiday? See:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/en/savings/types-of-savings/saving-money-for-a-holiday?source=mas"
                  rel="noreferrer"
                  target="_blank"
                  className="text-magenta-500 underline"
                >
                  Get holidays for less
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Ar gyfer unrhyw wyliau yr ydych wedi eu trefnu eleni cyfrifwch
                yr holl gostau, gan gynnwys teithio, llety, pasportiau, ac ati.
              </p>
              <p>
                Pam nad ewch chi ati i weld a allech chi leihau cost eich
                gwyliau nesaf? Gweler:{' '}
                <a
                  href="https://www.moneyhelper.org.uk/cy/savings/types-of-savings/saving-money-for-a-holiday?source=mas"
                  rel="noreferrer"
                  target="_blank"
                  className="text-magenta-500 underline"
                >
                  Get holidays for less
                </a>
              </p>
            </>
          ),
        },
        group: 'holidays',
      },
      {
        name: 'insurance',
        title: {
          en: 'Travel insurance',
          cy: 'Yswiriant teithio',
        },
        defaultFactorValue: getFactorValue('year'),
        information: {
          en: (
            <>
              <p>
                If you&apos;re going abroad you really need to get travel
                insurance in case of a medical emergency. And if you&apos;re
                going away more than twice a year it&apos;s probably cheaper to
                get an annual policy. Either enter the cost of your premium here
                or if you&apos;ve not yet bought your insurance, see our guide:{' '}
              </p>
              <p>
                <a
                  href="https://www.moneyhelper.org.uk/en/everyday-money/insurance/a-good-insurance-policy?source=mas"
                  rel="noreferrer"
                  target="_blank"
                  className="text-magenta-500 underline"
                >
                  How to get the best deal on travel insurance
                </a>
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Os ydych yn teithio dramor bydd gwir angen i chi gael yswiriant
                teithio rhag ofn y bydd argyfwng meddygol. Ac os ydych yn
                teithio fwy na dwywaith y flwyddyn mae&apos;n debygol o fod yn
                rhatach i chi gael polisi blynyddol. Un ai rhowch gost eich
                premiwm yma neu os nad ydych wedi prynu eich yswiriant eto,
                gweler ein canllaw:{' '}
              </p>
              <p>
                <a
                  href="https://www.moneyhelper.org.uk/cy/everyday-money/insurance/a-good-insurance-policy?source=mas"
                  rel="noreferrer"
                  target="_blank"
                  className="text-magenta-500 underline"
                >
                  Sut i gael y ddêl orau ar yswiriant teithio
                </a>
              </p>
            </>
          ),
        },
        group: 'holidays',
      },
      {
        name: 'spending-money',
        title: {
          en: 'Spending money',
          cy: 'Arian gwario',
        },
        defaultFactorValue: getFactorValue('year'),
        information: {
          en: (
            <>
              <p>
                Paying for flights and accommodation is only part of the cost of
                a holiday. Make sure you budget for your spending money too.
              </p>
            </>
          ),
          cy: (
            <>
              <p>
                Dim ond rhan o gost gwyliau yw talu am hedfan a llety. Sicrhewch
                eich bod yn cyllidebu ar gyfer eich arian gwario hefyd. Os
                hoffech gael gwybod sut i arbed arian ar y gost o gael arian
                tramor, darllenwch ein canllaw:
              </p>
              <p>
                <a
                  href="https://www.moneyadviceservice.org.uk/cy/articles/cardiau-rhad-iw-defnyddio-dramor"
                  rel="noreferrer"
                  target="_blank"
                  className="text-magenta-500 underline"
                >
                  Cardiau rhad i&apos;w defnyddio dramor
                </a>
              </p>
            </>
          ),
        },
        group: 'holidays',
      },
      ...createAdditionalItems('leisure'),
    ],
  },
  {
    name: 'summary', // @note: This page has it's own route.
    nextTab: `/budget-planner/save`,
    title: {
      en: 'Summary',
      cy: 'Crynodeb',
    },
  },
  // below tab is related to the your scenario page
  //that is not part of the main flow or part of current implementation
  // {
  //   name: 'your-scenario', // @note: This page has it's own route.
  //   title: {
  //     en: 'Life event planner',
  //     cy: 'Cynllunydd senario',
  //   },
  // },
];

type Summary = {
  positive: {
    title: {
      en: string;
      cy: string;
    };
    color: string;
    body: {
      en: JSX.Element;
      cy: JSX.Element;
    };
  };
  negative: {
    title: {
      en: string;
      cy: string;
    };
    color: string;
    body: {
      en: JSX.Element;
      cy: JSX.Element;
    };
  };
  neutral: {
    title: {
      en: string;
      cy: string;
    };
    color: string;
    body: {
      en: JSX.Element;
      cy: JSX.Element;
    };
  };
};

export const summary: Summary = {
  positive: {
    title: {
      en: 'Your budget is looking good!',
      cy: 'Mae eich cyllideb yn edrych yn dda!',
    },
    color: 'text-gray-800',
    body: {
      en: (
        <div className="text-gray-800">
          <p>
            Here are some other ways to try and boost your money, so you’re even
            better prepared for the unexpected. This includes tips to pay less
            tax, save more and how to plan for retirement.
          </p>
          <p className="mt-4">
            Your budget summary is below. You can save this to access another
            time.
          </p>
        </div>
      ),
      cy: (
        <div className="text-gray-800">
          <p>
            Dyma rai ffyrdd eraill o geisio rhoi hwb i&apos;ch arian, fel rydych
            chi hyd yn oed yn fwy parod ar gyfer yr annisgwyl. Mae hyn yn
            cynnwys awgrymiadau i dalu llai o dreth, cynilo mwy a sut i
            gynllunio ar gyfer ymddeoliad.
          </p>
          <p className="mt-4">
            Mae crynodeb eich cyllideb isod. Gallwch arbed hwn i gyrchu ar adeg
            arall.
          </p>
        </div>
      ),
    },
  },
  neutral: {
    title: {
      en: 'Good news, your budget balances',
      cy: 'Newyddion da, mae eich cyllideb yn cydbwyso',
    },
    color: 'text-gray-800',
    body: {
      en: (
        <div className="text-gray-800">
          <p>
            But there&apos;s still room to free up some extra money in your
            budget. Follow our tips to help improve your finances and save for
            unexpected costs.
          </p>
          <p className="mt-4">
            Your budget summary is below. You can save this to access another
            time.
          </p>
        </div>
      ),
      cy: (
        <div className="text-gray-800">
          <p>
            Ond mae lle o hyd i ryddhau rhywfaint o arian ychwanegol yn eich
            cyllideb. Dilynwch ein hawgrymiadau i helpu i wella eich cyllid ac
            arbed ar gyfer chostau annisgwyl.
          </p>
          <p className="mt-4">
            Mae crynodeb eich cyllideb isod. Gallwch arbed hwn i gyrchu ar adeg
            arall.
          </p>
        </div>
      ),
    },
  },
  negative: {
    title: {
      en: "At the moment, you've got more going out than coming in.",
      cy: `Ar hyn o bryd, mae gennych chi fwy yn mynd allan na dod i mewn`,
    },
    color: 'text-gray-800',
    body: {
      en: (
        <div className="text-gray-800">
          <p>Don&apos;t worry, here are ways to help get you back on track.</p>
          <p>
            Your budget summary is below. You can save this to access another
            time.
          </p>
        </div>
      ),
      cy: (
        <div className="text-gray-800">
          <p>
            Peidiwch â phoeni, dyma ffyrdd i&apos;ch helpu chi yn ôl ar y
            trywydd iawn.
          </p>
          <p>
            Mae crynodeb eich cyllideb isod. Gallwch arbed hwn i gyrchu amser
            arall.
          </p>
        </div>
      ),
    },
  },
};

export const groups: Groups = {
  pay: {
    en: 'Pay',
    cy: 'Tâl',
  },
  'benefits-and-tax-credits': {
    en: 'Benefits & Tax Credit',
    cy: 'Budd-daliadau a Chredydau Treth',
  },
  pension: {
    en: 'Pension',
    cy: 'Pensiwn',
  },
  'other-income': {
    en: 'Other income',
    cy: 'Incwm arall',
  },
  'mortgage-rent': {
    en: 'Mortgage & rent',
    cy: 'Morgais a rhent',
  },
  'other-property': {
    en: 'Other property charges',
    cy: 'Taliadau eiddo eraill',
  },
  'home-insurance': {
    en: 'Home insurance',
    cy: 'Yswiriant cartref',
  },
  utilities: {
    en: 'Utilities',
    cy: 'Cyfleustodau',
  },
  'food-drink': {
    en: 'Food & drink',
    cy: 'Bwyd a diod',
  },
  insurance: {
    en: 'Insurance',
    cy: 'Yswiriant',
  },
  banking: {
    en: 'Banking',
    cy: 'Bancio',
  },
  credit: {
    en: 'Credit',
    cy: 'Chredyd',
  },
  'savings-investments': {
    en: 'Savings and investments',
    cy: 'Cynilion a buddsoddiadau',
  },
  'future-plans': {
    en: 'Future plans',
    cy: "Cynlluniau i'r dyfodol",
  },
  'financial-advice': {
    en: 'Financial and legal advice',
    cy: 'Cyngor ariannol a chyfreithiol',
  },
  children: {
    en: 'Children',
    cy: 'Plant',
  },
  school: {
    en: 'School',
    cy: 'Ysgol',
  },
  'support-student': {
    en: 'Support for student children',
    cy: 'Cefnogaeth i blant myfyrwyr',
  },
  'support-relatives': {
    en: 'Support for other relatives',
    cy: 'Cefnogaeth i berthnasau eraill',
  },
  pets: {
    en: 'Pets',
    cy: 'Anifeiliaid anwes',
  },
  donations: {
    en: 'Donations & sponsorships',
    cy: 'Rhoddion a nawdd',
  },
  'family-loan': {
    en: 'Loan repayment to family/friend',
    cy: 'Ad-dalu benthyciad i deulu/ffrind',
  },
  'car-costs': {
    en: 'Car costs',
    cy: 'Costau car',
  },
  'public-transport': {
    en: 'Public transport',
    cy: 'Cludiant cyhoeddus',
  },
  entertainment: {
    en: 'Entertainment',
    cy: 'Adloniant',
  },
  'one-offs': {
    en: 'One-offs',
    cy: 'Eitemau untro',
  },
  holidays: {
    en: 'Holidays',
    cy: 'Gwyliau',
  },
  work: {
    en: 'Work',
    cy: 'Gwaith',
  },
  'clothes-shoes': {
    en: 'Clothes & shoes',
    cy: 'Dillad ac esgidiau',
  },
  'health-beauty': {
    en: 'Health & beauty',
    cy: 'Iechyd a harddwch',
  },
  additional: {
    en: 'Your additional items',
    cy: 'Eich eitemau ychwanegol',
  },
};

export const howToUseContent = {
  headings: [
    {
      title: {
        en: 'Your detailed spending breakdown',
        cy: 'Manylion eich gwario',
      },
      subtitle: {
        en: `Our free Budget Planner puts you in control of your household spending
        and analyses your results to help you take control of your money. It’s
        already helped hundreds of thousands of people.`,
        cy: 'Mae ein Cynllunydd Cyllideb yn sicrhau eich bod mewn rheolaeth o’ch gwariant cartref gan ddadansoddi’ch canlyniadau i roi cymorth i chi fedru rheoli’ch arian. Mae wedi helpu cannoedd o filoedd o bobl eisoes.',
      },
    },
    {
      title: {
        en: 'How to use our online Budget Planner',
        cy: 'Sut i ddefnyddio ein Cynllunydd Cyllideb ar-lein',
      },
      subtitle: {
        en: `Before you get started, grab as much information (bank statements,
          bills…) as you can. The more up to date your details are, the more
          accurate your results will be.`,
        cy: 'Cyn i chi gychwyn arni, casglwch gymaint o wybodaeth (cyfriflenni banc, biliau...) ag y gallwch. Po fwyaf trefnus fydd eich manylion, y mwyaf cywir fydd eich canlyniadau.',
      },
    },
  ],
  buttons: [
    {
      title: {
        en: 'Get started',
        cy: 'Cychwyn',
      },
    },
  ],
  steps: [
    {
      title: {
        en: 'Step 1.',
        cy: 'Cam 1.',
      },
      subtitle: {
        en: 'Enter what you spend and how much you earn',
        cy: 'Nodwch faint wariwch chi a faint yr ydych yn ei ennill',
      },
      content: [
        {
          header: {
            en: '',
            cy: '',
          },
          paragraph: {
            en: '',
            cy: '',
          },
        },
      ],
    },
    {
      title: {
        en: 'Step 2.',
        cy: 'Cam 2.',
      },
      subtitle: {
        en: 'The calculator will give you a breakdown of your finances',
        cy: 'Bydd y gyfrifiannell yn rhoi crynodeb i chi o’ch sefyllfa ariannol...',
      },
      content: [
        {
          header: {
            en: '',
            cy: '',
          },
          paragraph: {
            en: '',
            cy: '',
          },
        },
      ],
    },
    {
      title: {
        en: 'Step 3.',
        cy: 'Cam 3.',
      },
      subtitle: {
        en: 'Get personalised tips to help you make the most of your money',
        cy: '...ac awgrymiadau da personol i’ch helpu i wneud y mwyaf o’ch arian',
      },
      content: [
        {
          header: {
            en: 'Talk to a debt advisor for free',
            cy: 'Siaradwch â chynghorydd dyled am ddim',
          },
          paragraph: {
            en: `Debt can be difficult to deal with, but you’re not alone.
            Thousands of people who struggled with money issues have been
            helped by free debt advisors. Find out where to get free debt
            advice now.`,
            cy: 'Gall fod yn anodd delio â dyled, ond nid ydych ar eich pen eich hun. Mae miloedd o bobl sy’n cael trafferth gyda materion ariannol wedi cael cymorth gan ein cynghorwyr dyled am ddim. Darganfyddwch ble i gael cyngor ar ddyledion am ddim nawr.',
          },
        },
        {
          header: {
            en: 'Save on your bills',
            cy: 'Arbed ar eich biliau',
          },
          paragraph: {
            en: 'Learn how to save money on household bills and see if you can free up more money to boost income. For example, switch providers to cut insurance costs or check out schemes to help cut energy bills.',
            cy: 'Dysgwch sut i arbed arian ar filiau’r cartref a gwelwch os gallwch ryddhau fwy o arian i hybu’ch incwm. Er enghraifft, newidiwch ddarparwyr i dorri costau yswiriant neu edrychwch ar ymgyrchoedd i helpu torri biliau ynni.',
          },
        },
      ],
    },
  ],
};

export const createSpreadsheetAdditionalItems = (
  section: string,
  startIndex: number,
) => {
  const values = Array.from({ length: 5 }, (n, i) => {
    return {
      name: `${section}-additional-field-${i}`,
      index: startIndex + i,
    };
  });

  const titles = Array.from({ length: 5 }, (n, i) => {
    return {
      name: `${section}-additional-field-${i}-title`,
      index: startIndex + i,
    };
  });

  return values.concat(titles);
};

export const spreadsheet = [
  {
    name: { en: 'Income', cy: 'Incwm' },
    id: 'income',
    fields: [
      { name: 'pay', index: 9 },
      { name: 'self-employment', index: 10 },
      { name: 'statutory-pay-sick', index: 11 },
      { name: 'statutory-maternity-pay', index: 12 },
      { name: 'universal-credit', index: 14 },
      { name: 'working-tax-credit', index: 15 },
      { name: 'child-tax-credit', index: 16 },
      { name: 'child-benefit', index: 17 },
      { name: 'support', index: 18 },
      { name: 'jobseekers-allowance', index: 19 },
      { name: 'esa-or-incapacity-benefit', index: 20 },
      { name: 'independence-payment', index: 21 },
      { name: 'pension-credit', index: 22 },
      { name: 'attendance-allowance', index: 23 },
      { name: 'carers-allowance', index: 24 },
      { name: 'housing-benefit', index: 25 },
      { name: 'state-pension', index: 27 },
      { name: 'workplace-pension', index: 28 },
      { name: 'self-investment-pension', index: 29 },
      { name: 'annuity', index: 30 },
      { name: 'drawdown', index: 31 },
      { name: 'pension-other', index: 32 },
      { name: 'savings-investments', index: 34 },
      { name: 'rent-or-board', index: 35 },
      { name: 'child-maintenance', index: 36 },
      { name: 'student-loans-and-grants', index: 37 },
      { name: 'other-financial-support', index: 38 },
      { name: 'gifts', index: 39 },
      ...createSpreadsheetAdditionalItems('income', 41),
    ],
  },
  {
    name: { en: 'Household bills', cy: "Biliau'r cartref" },
    id: 'household-bills',
    fields: [
      { name: 'mortgage', index: 9 },
      { name: 'rent', index: 10 },
      { name: 'endowment', index: 11 },
      { name: 'insurance', index: 12 },
      { name: 'ground-rent', index: 14 },
      { name: 'service-charge', index: 15 },
      { name: 'buildings-insurance', index: 17 },
      { name: 'contents-insurance', index: 18 },
      { name: 'council-tax', index: 20 },
      { name: 'gas', index: 21 },
      { name: 'electricity', index: 22 },
      { name: 'other-fuel', index: 23 },
      { name: 'water', index: 24 },
      { name: 'home-phone', index: 25 },
      { name: 'mobile', index: 26 },
      { name: 'tv-licence', index: 27 },
      { name: 'cabel-or-satellite-tv', index: 28 },
      { name: 'home-maintenance', index: 29 },
      { name: 'garden-maintenance', index: 30 },
      { name: 'appliance-rental', index: 31 },
      { name: 'boiler-cover', index: 32 },
      ...createSpreadsheetAdditionalItems('householdbills', 34),
    ],
  },
  {
    name: { en: 'Living costs', cy: 'Costau byw' },
    id: 'living-costs',
    fields: [
      { name: 'grocery-shopping', index: 9 },
      { name: 'takeaways', index: 10 },
      { name: 'alcohol-at-home', index: 11 },
      { name: 'smoking-and-vaping', index: 12 },
      { name: 'lunches-snacks', index: 14 },
      { name: 'takeaway-coffees', index: 15 },
      { name: 'union-professional-fees', index: 16 },
      { name: 'clothes', index: 18 },
      { name: 'shoes', index: 19 },
      { name: 'work-clothes', index: 20 },
      { name: 'childrens-clothes', index: 21 },
      { name: 'school-uniform', index: 22 },
      { name: 'laundry-and-dry-cleaning', index: 23 },
      { name: 'hairdressing', index: 25 },
      { name: 'beauty-treatments', index: 26 },
      { name: 'toiletries', index: 27 },
      { name: 'eye-care', index: 28 },
      { name: 'dental-care', index: 29 },
      { name: 'prescriptions-medicines', index: 30 },
      ...createSpreadsheetAdditionalItems('living-costs', 32),
    ],
  },
  {
    name: { en: 'Finance & insurance', cy: 'Cyllid ac Yswiriant' },
    id: 'finance-insurance',
    fields: [
      { name: 'life-insurance', index: 9 },
      { name: 'protection-insurance', index: 10 },
      { name: 'critical-illness-insurance', index: 11 },
      { name: 'health-insurance', index: 12 },
      { name: 'dental-insurance', index: 13 },
      { name: 'overdraft-charges-interest', index: 15 },
      { name: 'bank-account-fees', index: 16 },
      { name: 'penalties', index: 17 },
      { name: 'loan-repayments', index: 19 },
      { name: 'student-loan-repayments', index: 20 },
      { name: 'credit-card-repayments', index: 21 },
      { name: 'car-hire-payments', index: 22 },
      { name: 'buy-now-pay-later', index: 23 },
      { name: 'other-credit-repayments', index: 24 },
      { name: 'regular-saving', index: 26 },
      { name: 'lump-sum-savings', index: 27 },
      { name: 'payments-isas', index: 28 },
      { name: 'buying-shares', index: 29 },
      { name: 'private-pensions', index: 30 },
      { name: 'long-term-care', index: 32 },
      { name: 'funeral-plan', index: 33 },
      { name: 'financial-advice', index: 35 },
      ...createSpreadsheetAdditionalItems('finance-insurance', 37),
    ],
  },
  {
    name: { en: 'Family & friends', cy: 'Teulu a ffrindiau' },
    id: 'family-friends',
    fields: [
      { name: 'childcare', index: 9 },
      { name: 'nappies', index: 10 },
      { name: 'activities', index: 11 },
      { name: 'treats', index: 12 },
      { name: 'pocket-money', index: 13 },
      { name: 'babysitting', index: 14 },
      { name: 'maintenance', index: 15 },
      { name: 'school-fees', index: 17 },
      { name: 'school-trips', index: 18 },
      { name: 'school-dinners', index: 19 },
      { name: 'school-clubs', index: 20 },
      { name: 'support-student', index: 22 },
      { name: 'support-relatives', index: 24 },
      { name: 'pet-food', index: 26 },
      { name: 'vet-bills', index: 27 },
      { name: 'pet-insurance', index: 28 },
      { name: 'donations', index: 30 },
      { name: 'loan', index: 32 },
      ...createSpreadsheetAdditionalItems('family-friends', 34),
    ],
  },
  {
    name: { en: 'Travel', cy: 'Teithio' },
    id: 'travel',
    fields: [
      { name: 'petrol-diesel', index: 9 },
      { name: 'car-insurance', index: 10 },
      { name: 'breakdown-cover', index: 11 },
      { name: 'car-tax', index: 12 },
      { name: 'car-finance', index: 13 },
      { name: 'loan-insurance', index: 14 },
      { name: 'mot', index: 15 },
      { name: 'maintenance', index: 16 },
      { name: 'parking', index: 17 },
      { name: 'bus', index: 19 },
      { name: 'trains', index: 20 },
      { name: 'taxis', index: 21 },
      { name: 'air', index: 22 },
      ...createSpreadsheetAdditionalItems('travel', 24),
    ],
  },
  {
    name: { en: 'Leisure', cy: 'Hamdden' },
    id: 'leisure',
    fields: [
      { name: 'cinema-theatre-trips', index: 9 },
      { name: 'days-out', index: 10 },
      { name: 'books-etc', index: 11 },
      { name: 'hobbies', index: 12 },
      { name: 'eating-out', index: 13 },
      { name: 'sport', index: 14 },
      { name: 'lottery', index: 15 },
      { name: 'newspapers', index: 16 },
      { name: 'birthdays', index: 18 },
      { name: 'christmas', index: 19 },
      { name: 'festivals-celebrations', index: 20 },
      { name: 'weddings', index: 21 },
      { name: 'holidays', index: 23 },
      { name: 'insurance', index: 24 },
      { name: 'spending-money', index: 25 },
      ...createSpreadsheetAdditionalItems('leisure', 27),
    ],
  },

  {
    name: { en: 'Your scenario', cy: 'Cynllunydd senario' },
    id: 'your-scenario',
    fields: [
      { name: 'your-scenario-grocery-shopping', index: 21 },
      { name: 'your-scenario-gas', index: 22 },
      { name: 'your-scenario-electricity', index: 23 },
      { name: 'your-scenario-rent', index: 24 },
      { name: 'your-scenario-petrol-diesel', index: 25 },
      { name: 'your-scenario-utilities', index: 26 },
      { name: 'your-scenario-mortgage-repayment', index: 27 },
      { name: 'your-scenario-household-mortgage-insurance', index: 28 },
    ],
  },
];

export const shareToolContent = {
  title: {
    en: 'Share this tool',
    cy: 'Rhannwch yr offeryn hwn',
  },
  items: [
    {
      name: 'email',
      svg: Mail,
      iconColor: 'fill-current',
    },
    {
      name: 'facebook',
      svg: Facebook,
      iconColor: '#3B5998',
    },
    {
      name: 'twitter',
      svg: Twitter,
      iconColor: '#1DA1F2',
    },
  ],
};

export const recommendedReadingContent = [
  {
    title: {
      en: 'Take control of your spending',
      cy: `Cymerwch reolaeth ar eich gwariant`,
    },
    text: {
      en: (
        <p>
          Our{' '}
          <a
            href="https://www.moneyhelper.org.uk/en/everyday-money/budgeting/beginners-guide-to-managing-your-money"
            className="text-magenta-500 underline"
          >
            Beginner&apos;s guide to managing your money
          </a>{' '}
          is a great place to start - see how much you could save.
        </p>
      ),
      cy: (
        <p>
          Mae ein{' '}
          <a
            href="https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/beginners-guide-to-managing-your-money"
            className="text-magenta-500 underline"
          >
            Canllaw i ddechreuwyr ar reoli eich arian
          </a>{' '}
          yn lle gwych i ddechrau - gwelwch faint y gallech chi ei arbed.
        </p>
      ),
    },
    tags: ['neutral', 'negative'],
  },
  {
    title: {
      en: 'Save money on your household bills',
      cy: `Arbed arian ar eich biliau cartref`,
    },
    text: {
      en: (
        <p>
          Like energy, water, Council Tax, phone and broadband bills. Find{' '}
          <a
            href="https://www.moneyhelper.org.uk/en/everyday-money/budgeting/how-to-save-money-on-household-bills"
            className="text-magenta-500 underline"
          >
            easy ways to cut costs{' '}
          </a>
          - you could save £100s each year.
        </p>
      ),
      cy: (
        <p>
          Fel ynni, dŵr, Treth Gyngor, biliau ffôn a band eang. Dewch{' '}
          <a
            href="https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/how-to-save-money-on-household-bills"
            className="text-magenta-500 underline"
          >
            o hyd i ffyrdd hawdd o dorri costau{' '}
          </a>
          - gallech arbed cannoedd o bunnoedd y flwyddyn.
        </p>
      ),
    },
    tags: ['positive', 'neutral', 'negative'],
  },
  {
    title: {
      en: 'Build your emergency savings buffer',
      cy: 'Adeiladwch eich byffer cynilion brys',
    },
    text: {
      en: (
        <p>
          If you have some money left over in your budget, it’s a good idea to
          save it for a rainy day. Find out{' '}
          <a
            href="https://www.moneyhelper.org.uk/en/savings/types-of-savings/emergency-savings-how-much-is-enough"
            className="text-magenta-500 underline"
          >
            how to build up an emergency fund
          </a>
          .
        </p>
      ),
      cy: (
        <p>
          Os oes gennych rywfaint o arian ar ôl yn eich cyllideb, mae’n syniad
          da ei arbed ar gyfer diwrnod glawog. Darganfyddwch{' '}
          <a
            href="https://www.moneyhelper.org.uk/cy/savings/types-of-savings/emergency-savings-how-much-is-enough"
            className="text-magenta-500 underline"
          >
            sut i adeiladu cronfa argyfwng
          </a>
          .
        </p>
      ),
    },
    tags: ['positive', 'neutral'],
  },
  {
    title: {
      en: 'Make the most of your savings',
      cy: `Gwnewch y mwyaf o'ch cynilion`,
    },
    text: {
      en: (
        <p>
          Learn{' '}
          <a
            href="https://www.moneyhelper.org.uk/en/savings/how-to-save/cash-savings-at-a-glance"
            className="text-magenta-500 underline"
          >
            how to find the best savings accounts
          </a>{' '}
          and compare top rates.
        </p>
      ),
      cy: (
        <p>
          Dysgwch{' '}
          <a
            href="https://www.moneyhelper.org.uk/cy/savings/how-to-save/cash-savings-at-a-glance"
            className="text-magenta-500 underline"
          >
            sut i ddod o hyd i&apos;r cyfrifon cynilo gorau
          </a>{' '}
          a chymharu&apos;r cyfraddau gorau.
        </p>
      ),
    },
    tags: ['positive', 'neutral'],
  },
  {
    title: {
      en: 'Review your pension savings',
      cy: 'Adolygwch eich cynilion pensiwn',
    },
    text: {
      en: (
        <p>
          Find out how to{' '}
          <a
            href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/building-your-retirement-pot/making-the-most-of-your-pensions"
            className="text-magenta-500 underline"
          >
            grow your pension pot
          </a>
          . You&apos;ll learn about tax relief, how contributions work and{' '}
          <a
            href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/building-your-retirement-pot/how-to-increase-your-pension-savings"
            className="text-magenta-500 underline"
          >
            how much pension you&apos;ll need to retire comfortably
          </a>
          .
        </p>
      ),
      cy: (
        <p>
          Darganfyddwch{' '}
          <a
            href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/building-your-retirement-pot/making-the-most-of-your-pensions"
            className="text-magenta-500 underline"
          >
            sut i gronni eich cronfa bensiwn
          </a>
          . Byddwch yn dysgu am ryddhad treth, sut mae cyfraniadau&apos;n
          gweithio, a{' '}
          <a
            href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/why-save-into-a-pension?"
            className="text-magenta-500 underline"
          >
            faint o bensiwn byddwch ei angen er mwyn ymddeol yn gyfforddus
          </a>
          .
        </p>
      ),
    },
    tags: ['positive'],
  },
  {
    title: {
      en: 'Maximise your income',
      cy: `Gwnewch y mwyaf o'ch incwm`,
    },
    text: {
      en: (
        <p>
          Learn how to cut costs and find extra help that&apos;s available in
          our guide{' '}
          <a
            href="https://www.moneyhelper.org.uk/en/money-troubles/cost-of-living/squeezed-income"
            className="text-magenta-500 underline"
          >
            Living on a squeezed income
          </a>
          .
        </p>
      ),
      cy: (
        <p>
          Dysgwch sut i dorri costau a dod o hyd i help ychwanegol sydd ar gael
          yn ein canllaw{' '}
          <a
            href="https://www.moneyhelper.org.uk/cy/money-troubles/cost-of-living/squeezed-income"
            className="text-magenta-500 underline"
          >
            Byw ar incwm gwasgedig
          </a>
          .
        </p>
      ),
    },
    tags: ['negative'],
  },
  {
    title: {
      en: 'Talk to your creditor',
      cy: `Siaradwch â'ch credydwr`,
    },
    text: {
      en: (
        <p>
          If you think you can&apos;t afford to pay a bill, always{' '}
          <a
            href="https://www.moneyhelper.org.uk/en/money-troubles/cost-of-living/talking-to-your-creditor"
            className="text-magenta-500 underline"
          >
            contact the company to ask for help{' '}
          </a>
          before missing a payment. They can then put a plan in place to help
          you.
        </p>
      ),
      cy: (
        <p>
          Os credwch na allwch fforddio talu bil,{' '}
          <a
            href="https://www.moneyhelper.org.uk/cy/money-troubles/cost-of-living/talking-to-your-creditor?"
            className="text-magenta-500 underline"
          >
            cysylltwch â&apos;r cwmni bob amser i ofyn am help
          </a>{' '}
          cyn methu taliad. Yna gallant roi cynllun ar waith i&apos;ch helpu.
        </p>
      ),
    },
    tags: ['negative'],
  },
  {
    title: {
      en: 'Prioritise repaying your debts',
      cy: `Blaenoriaethwch ad-dalu eich dyledion`,
    },
    text: {
      en: (
        <p>
          If you have debts, find out what to do if you&apos;re{' '}
          <a
            href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/auto-enrolment/automatic-enrolment-if-you-have-debts"
            className="text-magenta-500 underline"
          >
            automatically enrolled in your employer&apos;s workplace
          </a>
          .
        </p>
      ),
      cy: (
        <p>
          Os oes gennych ddyledion, darganfyddwch beth i’w wneud os ydych{' '}
          <a
            href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/auto-enrolment/automatic-enrolment-if-you-have-debts"
            className="text-magenta-500 underline"
          >
            wedi’ch ymrestru’n awtomatig yng ngweithle eich cyflogwr
          </a>
          .
        </p>
      ),
    },
    tags: ['negative'],
  },
];

export const otherToolsContent = [
  {
    title: {
      en: 'Use our benefits calculator',
      cy: 'Defnyddiwch ein Cyfrifiannell budd-daliadau',
    },
    text: {
      en: 'Quickly find out what benefits and other support you could get - and how to claim them.',
      cy: "Darganfyddwch yn gyflym pa fudd-daliadau a chymorth arall y gallech eu cael -  a sut i'w hawlio",
    },
    image: {
      src: BenefitsCalculator,
      alt: 'benefit calculator',
    },
    link: {
      en: 'https://www.moneyhelper.org.uk/en/benefits/benefits-calculator',
      cy: 'https://www.moneyhelper.org.uk/cy/benefits/benefits-calculator',
    },
    tags: ['neutral', 'negative'],
  },
  {
    title: {
      en: 'Use our savings calculator',
      cy: 'Defnyddiwch ein Cyfrifiannell Cynilion',
    },
    text: {
      en: 'Work out how long it’ll take to save up for something, and how much you’d need to regularly save',
      cy: 'Cyfrifwch faint o amser y bydd yn ei gymryd i gynilo ar gyfer rhywbeth, a faint y byddai angen i chi ei gynilo’n rheolaidd.',
    },
    image: {
      src: SavingsCalculator,
      alt: 'womans hands opening red purse',
    },
    link: {
      en: 'https://www.moneyhelper.org.uk/en/savings/how-to-save/savings-calculator',
      cy: 'https://www.moneyhelper.org.uk/cy/savings/how-to-save/savings-calculator',
    },
    tags: ['positive', 'neutral'],
  },
  {
    title: {
      en: 'Get help with your bills',
      cy: `Cael help gyda'ch biliau`,
    },
    text: {
      en: 'Use our Bill prioritiser to work out which bills and payments you need to deal with first - plus how to avoid missing payments.',
      cy: 'Defnyddiwch ein teclyn Blaenoriaethwr biliau i weithio allan pa filiau a thaliadau y mae angen i chi ddelio â nhw yn gyntaf - yn ogystal â sut i osgoi methu taliadau coll.',
    },
    image: {
      src: GetHelpWithYourBills,
      alt: 'laughing elderly couple',
    },
    link: {
      en: 'https://www.moneyhelper.org.uk/en/money-troubles/cost-of-living/bill-prioritiser',
      cy: 'https://www.moneyhelper.org.uk/cy/money-troubles/cost-of-living/bill-prioritiser',
    },
    tags: ['negative', 'positive'],
  },
  {
    title: {
      en: 'Talk to a debt adviser',
      cy: 'Siaradwch ag ymgynghorydd dyledion',
    },
    text: {
      en: 'Worried about debt? You’re not alone. Find out where to get free, confidential help near you, online or on the phone.',
      cy: 'Poeni am ddyled? Nid ydych ar eich pen eich hun. Darganfyddwch ble i gael cymorth cyfrinachol am ddim yn eich ardal chi, ar-lein neu dros y ffôn.',
    },
    image: {
      src: DebtAdvice,
      alt: 'woman with laptop reading a bill',
    },
    link: {
      en: 'https://www.moneyhelper.org.uk/en/money-troubles/dealing-with-debt/debt-advice-locator',
      cy: 'https://www.moneyhelper.org.uk/cy/money-troubles/dealing-with-debt/debt-advice-locator',
    },
    tags: ['negative'],
  },
];

export const yourScenarioContent = {
  title: {
    en: 'Your chosen life event: ',
    cy: 'tbc',
  },
  description: {
    paragraphs: [
      {
        en: 'We don’t currently have any information about your income or spending so are unable to provide you with an estimate of how this life event may impact your budget. However we have some guidance of things you can consider when planning for this scenario.',
        cy: 'tbc',
      },
      {
        en: 'If you want to understand how this scenario will impact your budget, create a budget using our budget planner.',
        cy: 'tbc',
      },
    ],
  },
};

export const saveAndContinuePageContent = {
  title: {
    en: 'Save and come back later',
    cy: 'Arbedwch a dewch yn ôl yn ddiweddarach',
  },
  subHeading: {
    en: 'Enter your email below and we’ll send you a link to access your saved progress. Use the link to return to your budget any time.',
    cy: "Rhowch eich e-bost isod a byddwn yn anfon dolen atoch i gyrchu eich cynnydd wedi'i arbed. Defnyddiwch y ddolen hon i ddychwelyd i'ch cyllideb unrhyw bryd.",
  },
  inputLabel: { en: 'Your email address', cy: 'Eich cyfeiriad e-bost' },
  inputHint: {
    en: 'We’ll only use this to send you a link to your saved progress',
    cy: "Byddwn ond yn defnyddio hyn i anfon dolen atoch i'ch cynnydd wedi'i arbed",
  },
  errorMessage: {
    en: 'Enter an email address in the correct format, like name@example.com',
    cy: 'Rhowch gyfeiriad e-bost yn y fformat cywir, fel name@example.com',
  },
  buttonLabel: { en: 'Save and send email', cy: 'Arbed ac anfon e-bost' },
  action: '/api/save-and-return',
};

export const progressSavedPageContent = {
  title: {
    en: 'Progress saved',
    cy: 'Cynnydd wedi’i arbed',
  },
  subHeading: {
    en: 'What happens next',
    cy: 'Beth fydd yn digwydd nesaf',
  },
  text: {
    en: (
      <>
        <p>
          We’ve sent you an email. It’ll come from
          moneyhelper@notifications.service.gov.uk. Make sure to check your spam
          folder if you haven’t received it.
        </p>
        <p>Click the link in the email to return to your budget.</p>
      </>
    ),
    cy: (
      <>
        <p>
          Rydym wedi anfon e-bost atoch. Mi fydd yn dod gan
          moneyhelper@notifications.service.gov.uk. Sicrhewch eich bod yn gwirio
          eich ffolder sbam os nad ydych wedi ei dderbyn.
        </p>
        <p>cliciwch y ddolen yn yr e-bost i ddychwelyd i&apos;ch cyllideb.</p>
      </>
    ),
  },
  mainSiteLink: {
    en: 'https://www.moneyhelper.org.uk/en',
    cy: 'https://www.moneyhelper.org.uk/cy',
  },
  continueButtonLabel: {
    en: 'Continue to MoneyHelper',
    cy: 'Parhau i Helpwr Arian',
  },
  continueButtonLabelEmbedded: {
    en: 'Go to MoneyHelper',
    cy: 'Ewch i HelpwrArian',
  },
  resendEmailButtonLabel: { en: 'Resend email', cy: 'Ail-anfon e-bost' },
  resendEmailAction: '/save',
};

export default tabs;

export const resetDialogContent = {
  title: {
    en: 'Reset the calculator',
    cy: 'Ailosod y gyfrifiannell',
  },
  description: {
    en: 'Are you sure you want to clear your budget information?',
    cy: "Ydych chi'n siŵr eich bod am glirio'ch holl wybodaeth Gyllideb?",
  },
  confirmButtonLabel: { en: 'Confirm', cy: 'Cadarnhau' },
  confirmAction: `${API_ENDPOINT}/reset`,
  cancelButtonLabel: { en: 'Cancel', cy: 'Canslo' },
  cancelAction: `${API_ENDPOINT}/summary`,
};

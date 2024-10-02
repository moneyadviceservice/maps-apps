import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ReactNode } from 'react';
import { PensionInput, Step, StepName } from './pension-data';
import { ExpandableSection, Link } from '@maps-digital/shared/ui';

export type Contribution = {
  frequency: Record<string, string>;
  contributionType: Record<string, string>;
  summaryContributionTitle: string;
  summaryContributionPart: string;
  summaryContributionFull: string;
  summaryContributionDuration: string;
  legalMinimumPart: ReactNode;
  legalMinimumFull: ReactNode;
  contributionInformationTitle: string;
  contributionInformationTextPart: string;
  contributionInformationTextFull: string;
  qualifiedEarningTitle: string;
  qualifiedEarningText: string;
};

export const pensionContributions = (
  t: ReturnType<typeof useTranslation>['z'],
): Record<string, Step> => {
  return {
    [StepName.CONTRIBUTIONS]: {
      stepNumber: 2,
      title: t({
        en: '2. Your contributions',
        cy: '2. Eich cyfraniadaulower',
      }),
      fields: [
        {
          name: 'contribution',
          errors: {
            required: t({
              en: 'Total contribution must be at least 8%.',
              cy: 'Rhaid i gyfanswm y cyfraniad fod yn 8% o leia.',
            }),
          },
        },
        {
          name: PensionInput.EMPLOYEE_CONTRIBUTION,
          label: t({
            en: 'Enter your contribution',
            cy: 'Nodwch eich cyfraniad',
          }),
          information: t({
            en: 'At your salary level there is no legal minimum contribution but your workplace pension scheme may have a set minimum. Check with your employer.',
            cy: 'Ar eich lefel cyflog, nid oes isafswm cyfreithiol o gyfraniad ond efallai y bydd eich cynllun pensiwn gweithlu wedi gosod isafswm. Holwch eich cyflogwr.',
          }),
          defaultValue: '5',
          errors: {
            required: t({
              en: 'Please enter your contribution',
              cy: 'Nodwch eich cyfraniad',
            }),
            invalid: t({
              en: 'Your contribution is not a number',
              cy: 'Nid rhif yw eich cyfraniad',
            }),
          },
          showHide: t({
            en: (
              <ExpandableSection title="More info about your salary">
                <p>
                  Enter your salary before tax or other deductions are taken
                  off. This is known as your gross salary. If you have more than
                  one job, you will have to enter each salary separately.
                </p>
              </ExpandableSection>
            ),
            cy: (
              <ExpandableSection title="Mwy o wybodaeth am eich cyflog">
                <p>
                  Rhowch eich cyflog cyn i’r dreth nag unrhyw ddidyniadau eraill
                  gael eu tynnu. Gelwir hyn yn gyflog gros. Os oes gennych fwy
                  nag un swydd, bydd raid i chi roi pob cyflog ar wahân.
                </p>
              </ExpandableSection>
            ),
          }),
        },
        {
          name: PensionInput.EMPLOYER_CONTRIBUTION,
          label: t({
            en: 'Enter your employer’s contribution',
            cy: 'Rhowch gyfraniad eich cyflogwr',
          }),
          errors: {
            required: t({
              en: 'Please enter your employer’s contribution',
              cy: 'Rhowch gyfraniad eich cyflogwr',
            }),
            min: t({
              en: 'Employer contribution must be between 3 and 100%',
              cy: 'Rhaid i gyfraniad y cyflogwr fod rhwng 3 a 100%.',
            }),
            invalid: t({
              en: 'Employer contribution is not a number',
              cy: 'Nid yw cyfraniad cyflogwr yn rhif',
            }),
          },
          defaultValue: '3',
          showHide: t({
            en: (
              <ExpandableSection title="More info about your salary">
                <p>
                  Enter your salary before tax or other deductions are taken
                  off. This is known as your gross salary. If you have more than
                  one job(opens in a new window), you will have to enter each
                  salary separately.
                </p>
              </ExpandableSection>
            ),
            cy: (
              <ExpandableSection title="Mwy o wybodaeth am eich cyflog">
                <p>
                  Rhowch eich cyflog cyn i’r dreth nag unrhyw ddidyniadau eraill
                  gael eu tynnu. Gelwir hyn yn gyflog gros. Os oes gennych fwy
                  nag un swydd(Yn agor mewn ffenestr newydd), bydd raid i chi
                  roi pob cyflog ar wahân.
                </p>
              </ExpandableSection>
            ),
          }),
        },
      ],
      buttonText: t({
        en: 'Calculate your contributions',
        cy: 'Cyfrifwch eich cyfraniadau',
      }),
    },
  };
};

export const contributionData = (
  t: ReturnType<typeof useTranslation>['z'],
): Contribution => {
  return {
    frequency: {
      1: t({
        en: 'year',
        cy: 'y flwyddyn',
      }),
      12: t({
        en: 'month',
        cy: 'y mis',
      }),
      13: t({
        en: '4-weeks',
        cy: '4 wythnos',
      }),
      52: t({
        en: 'week',
        cy: 'y wythnos',
      }),
    },
    contributionType: {
      full: t({
        en: 'full salary',
        cy: 'nghyflog llawn',
      }),
      part: t({
        en: 'part salary',
        cy: 'nghyflog rhan',
      }),
    },
    summaryContributionTitle: t({
      en: 'Contributions will be made on your',
      cy: 'Gwneir cyfraniadau ar eich',
    }),
    summaryContributionPart: t({
      en: 'qualifying earnings of',
      cy: 'enillion cymwys o',
    }),
    summaryContributionFull: t({
      en: 'salary of',
      cy: 'cyflog o',
    }),
    summaryContributionDuration: t({
      en: 'per year',
      cy: 'y flwyddyn.',
    }),
    legalMinimumPart: t({
      en: (
        <p className="text-sm text-gray-800">
          For most people, the minimum you and your employer can put into your
          pension is 8% of your qualifying earnings. At least 3% of this must
          come from your employer. See our page on{' '}
          <Link
            target="_blank"
            asInlineText={true}
            href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/auto-enrolment/how-much-do-i-and-my-employer-have-to-pay"
          >
            workplace pension contributions
          </Link>{' '}
          for more details
        </p>
      ),
      cy: (
        <p className="text-sm text-gray-800">
          I’r rhan fwyaf o bobl, yr isafswm y gallwch chi a’ch cyflogwr ei roi
          yn eich pensiwn yw 8% o’ch enillion cymwys. Rhaid i o leiaf 3% o hyn
          ddod oddi wrth eich cyflogwr. Gweler ein tudalen ar{' '}
          <Link
            target="_blank"
            asInlineText={true}
            href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/auto-enrolment/how-much-do-i-and-my-employer-have-to-pay"
          >
            gyfraniadau pensiwn gweithle
          </Link>{' '}
          am fwy o fanylion.
        </p>
      ),
    }),
    legalMinimumFull: t({
      en: (
        <p className="text-gray-800 text-sm">
          For most people, the minimum you and your employer can put into your
          pension is 8% of your qualifying earnings. It can be less if your
          employer makes contributions based on your full earnings instead,
          including bonuses, overtime and commission. At least 3% of this must
          still come from your employer. This calculator does not cover cases
          where the total contribution is lower than 8%. See our page on{' '}
          <Link
            target="_blank"
            asInlineText={true}
            href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/auto-enrolment/how-much-do-i-and-my-employer-have-to-pay"
          >
            workplace pension contributions
          </Link>{' '}
          for more details.
        </p>
      ),
      cy: (
        <p className="text-gray-800 text-sm">
          I’r rhan fwyaf o bobl, yr isafswm y gallwch chi a’ch cyflogwr ei roi
          yn eich pensiwn yw 8% o’ch enillion cymwys. Gall fod yn llai os bydd
          eich cyflogwr yn gwneud cyfraniadau yn seiliedig ar eich enillion
          llawn yn lle, gan gynnwys bonysau, goramser a chomisiwn. Rhaid i o
          leiaf 3% o hyn ddod gan eich cyflogwr o hyd. Nid yw{"'"}r
          gyfrifiannell hon yn cynnwys achosion lle mae cyfanswm y cyfraniad yn
          is nag 8%. Gweler ein tudalen ar{' '}
          <Link
            target="_blank"
            asInlineText={true}
            href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/auto-enrolment/how-much-do-i-and-my-employer-have-to-pay"
          >
            gyfraniadau pensiwn gweithle
          </Link>{' '}
          am fwy o fanylion.
        </p>
      ),
    }),
    contributionInformationTitle: t({
      en: 'More info on your contributions',
      cy: 'Mwy o wybodaeth am eich cyfraniadau',
    }),
    contributionInformationTextPart: t({
      en: 'The overall minimum that must be paid into your pension is 8% of your qualifying earnings. At least 3% must be paid by your employer, however if your employer pays more than 3% you need only pay the balance up to 8%. For example, if your employer pays 6%, you need only pay 2%. However, the more you and your employer pay in, the better your retirement income will be.',
      cy: `Y ffigwr gofynnol cyffredinol sydd yn rhaid ei dalu i mewn i'ch pensiwn yw 8% o'ch enillion cymwys. Rhaid i'ch cyflogwr dalu 3% o leiaf, ond os bydd eich cyflogwr yn talu mwy na 3% yna dim ond y balans hyd at 8% sydd angen i chi ei dalu. Er enghraifft, os bydd eich cyflogwr yn talu 6%, yna dim ond 2% sydd angen i chi ei dalu. Fodd bynnag, po fwyaf y byddwch chi a'ch cyflogwr yn ei dalu i mewn, po uchaf fydd eich incwm ymddeol.`,
    }),
    contributionInformationTextFull: t({
      en: 'The overall minimum that must be paid into your pension is 8% of your earnings. At least 3% must be paid by your employer, however if your employer pays more than 3% you need only pay the balance up to 8%. For example, if your employer pays 6%, you need only pay 2%. However, the more you and your employer pay in, the better your retirement income will be.',
      cy: `Y ffigwr gofynnol cyffredinol sydd yn rhaid ei dalu i mewn i'ch pensiwn yw 8% o'ch enillion. Rhaid i'ch cyflogwr dalu 3% o leiaf, ond os bydd eich cyflogwr yn talu mwy na 3% yna dim ond y balans hyd at 8% sydd angen i chi ei dalu. Er enghraifft, os bydd eich cyflogwr yn talu 6%, yna dim ond 2% sydd angen i chi ei dalu. Fodd bynnag, po fwyaf y byddwch chi a'ch cyflogwr yn ei dalu i mewn, po uchaf fydd eich incwm ymddeol. `,
    }),
    qualifiedEarningTitle: t({
      en: 'What are qualified earnings?',
      cy: 'Beth yw enillion cymwys?',
    }),
    qualifiedEarningText: t({
      en: 'This is the part of your annual pay that will be used to calculate your pension contribution under automatic enrolment. It is your earnings before tax (up to a maximum limit of £50,270 per year) – less the lower earnings threshold of £6,240.',
      cy: 'Dyma’r rhan o’ch cyflog blynyddol fydd yn cael ei defnyddio i gyfrifo eich cyfraniad pensiwn dan gofrestru awtomatig. Sef eich enillion cyn treth (hyd at derfyn uchafswm o £50,270 y flwyddyn) - tynnu’r trothwy enillion isaf o £6,240.',
    }),
  };
};

export const contributionMessages = (
  t: ReturnType<typeof useTranslation>['z'],
): Record<string, { [key: string]: string | ReactNode }> => {
  return {
    salary: {
      belowManualOptIn: t({
        en: 'Your employer will not automatically enrol you into a pension but you can choose to join. If you earn more than the lower level of qualifying earnings, your employer must also contribute.',
        cy: `Ni fydd eich cyflogwr yn eich cofrestru yn awtomatig am gynllun pensiwn gweithle, ond gallwch ddewis ymuno. Os felly, ni fydd yn ofynnol i'ch cyflogwr wneud cyfraniadau.`,
      }),
      manualOptInRequired: t({
        en: 'Your employer will not automatically enrol you into a workplace pension scheme but you can choose to join. If you do so, your employer will make contributions.',
        cy: 'Ni fydd eich cyflogwr yn eich cofrestru yn awtomatig am gynllun pensiwn gweithle, ond gallwch ddewis ymuno. Os felly, bydd eich cyflogwr yn gwneud cyfraniadau.',
      }),
      nearAutoEnrollThreshold: t({
        en: (
          <p className="text-sm">
            Please Note: Your earnings are very close to the automatic enrolment
            salary threshold. You should check with your employer to confirm
            whether or not you are eligible to be automatically enrolled as the
            thresholds vary depending on whether you are paid monthly, weekly or
            4-weekly.{' '}
            <Link
              asInlineText={true}
              href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/auto-enrolment/automatic-enrolment-if-you-earn-10000-a-year-or-less"
              target="_blank"
            >
              Read more about the salary thresholds for workplace pensions.
            </Link>
          </p>
        ),
        cy: (
          <div>
            <p className="text-sm">
              Sylwer: Mae eich enillion yn agos iawn at y trothwy cyflog
              cofrestru awtomatig. Dylech wirio gyda’ch cyflogwr i gadarnhau a
              ydych yn gymwys neu beidio i gael eich cofrestru’n awtomatig gan
              fod y trothwyon yn amrywio yn ddibynnol ar a ydych yn cael eich
              talu’n fisol, wythnosol neu bob 4 wythnos.
            </p>{' '}
            <Link
              asInlineText={true}
              href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/auto-enrolment/automatic-enrolment-if-you-earn-10000-a-year-or-less"
              target="_blank"
            >
              Darllenwch fwy am y trothwyon cyflog ar gyfer pensiynau gweithle.
            </Link>
          </div>
        ),
      }),
      nearPensionThreshold: t({
        en: (
          <div>
            <p className="text-sm">
              Please note: Your earnings are very close to the threshold at
              which your employer does not have to contribute to your pension if
              you choose to enrol. You should check to confirm whether or not
              your employer will contribute as this threshold varies depending
              on whether you are paid monthly, weekly or 4-weekly.
            </p>{' '}
            <Link
              asInlineText={true}
              target="_blank"
              href={
                'https://www.moneyhelper.org.uk/en/pensions-and-retirement/auto-enrolment/automatic-enrolment-if-you-earn-10000-a-year-or-less'
              }
            >
              Read more about the salary thresholds for workplace pensions.
            </Link>
          </div>
        ),
        cy: (
          <div>
            <p className="text-sm">
              Sylwer: Mae eich enillion yn agos iawn at y trothwy lle nad oes
              raid i’ch cyflogwr gyfrannu at eich pensiwn os dewiswch gofrestru.
              Dylech wirio i gadarnhau a fydd eich cyflogwr yn cyfrannu neu
              beidio oherwydd mae’r trothwy hwn yn amrywio yn ddibynnol ar a
              ydych yn cael eich talu’n fisol, wythnosol neu bob 4 wythnos.
            </p>{' '}
            <Link
              asInlineText={true}
              target="_blank"
              href={
                'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/auto-enrolment/automatic-enrolment-if-you-earn-10000-a-year-or-less'
              }
            >
              Darllenwch fwy am y trothwyon cyflog ar gyfer pensiynau gweithle.
            </Link>
          </div>
        ),
      }),
    },
    contributionType: {
      belowManualOptIn: t({
        en: 'At your earnings level, you will have to make contributions based on your full salary.',
        cy: `Ar eich lefel enillion, bydd rhaid i chi wneud cyfraniadau yn seiliedig ar eich cyflog llawn.`,
      }),
    },
    age: {
      minRequired: t({
        en: 'You are too young to join a workplace pension. When you reach the age of 16 you can choose to join. If you do so, your employer might make contributions too depending on how much you earn.',
        cy: 'Rydych yn rhy ifanc i ymuno â phensiwn gweithle. Pan gyrhaeddwch 16 oed gallwch ddewis ymuno. Os gwnewch hynny, gallai eich cyflogwr wneud cyfraniadau hefyd yn dibynnu ar faint rydych yn ei ennill.',
      }),
      maxRequired: t({
        en: 'You are not entitled to be automatically enrolled into a workplace pension. Many of the tax benefits of saving into a pension stop at age 75.',
        cy: `Nid oes gennych hawl i gael eich ymrestru'n awtomatig mewn pensiwn gweithle. Mae llawer o'r buddion treth o gynilo i mewn i gynllun pensiwn yn stopio yn 75 oed.`,
      }),
      optIn: t({
        en: 'Your employer will not automatically enrol you into a pension but you can choose to join. If you earn more than the lower level of qualifying earnings, your employer must also contribute.',
        cy: `Ni fydd eich cyflogwr yn eich ymrestru'n awtomatig i mewn i bensiwn ond gallwch ddewis ymuno. Os ydych yn ennill mwy na'r lefel is o enillion cymwys, rhaid i'ch cyflogwr gyfrannu hefyd.`,
      }),
    },
  };
};

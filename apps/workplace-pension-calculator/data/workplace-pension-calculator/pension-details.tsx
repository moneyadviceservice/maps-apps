import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { frequencyOptions, PensionInput, Step, StepName } from './pension-data';

export const pensionDetails = (
  t: ReturnType<typeof useTranslation>['z'],
): Record<string, Step> => {
  return {
    [StepName.DETAILS]: {
      stepNumber: 1,
      title: t({
        en: '1. Your details',
        cy: '1. Eich manylion',
      }),
      fields: [
        {
          name: PensionInput.AGE,
          label: t({
            en: 'Your age',
            cy: 'Eich oedran',
          }),
          errors: {
            required: t({
              en: 'Please enter your age',
              cy: 'Nodwch eich oed',
            }),
            min: t({
              en: 'You are too young to join a workplace pension. When you reach the age of 16 you may ask your employer to enrol you. If you do so, your employer will make contributions',
              cy: 'Rydych yn rhy ifanc i ymuno â phensiwn gweithle. Pan gyrhaeddwch 16 oed gallwch ddewis ymuno. Os gwnewch hynny, gallai eich cyflogwr wneud cyfraniadau hefyd yn dibynnu ar faint rydych yn ei ennill.',
            }),
            max: t({
              en: 'You are not entitled to be automatically enrolled into a workplace pension. Many of the tax benefits of saving into a pension stop at age 75.',
              cy: `Nid oes gennych hawl i gael eich ymrestru'n awtomatig mewn pensiwn gweithle. Mae llawer o'r buddion treth o gynilo i mewn i gynllun pensiwn yn stopio yn 75 oed.`,
            }),
            invalid: t({
              en: 'Age is not a number',
              cy: 'Nid yw oedran yn rhif',
            }),
            optIn: t({
              en: 'Your employer will not automatically enrol you into a pension but you can choose to join. If you earn more than the lower level of qualifying earnings, your employer must also contribute.',
              cy: `Ni fydd eich cyflogwr yn eich ymrestru'n awtomatig i mewn i bensiwn ond gallwch ddewis ymuno. Os ydych yn ennill mwy na'r lefel is o enillion cymwys, rhaid i'ch cyflogwr gyfrannu hefyd.`,
            }),
          },
          information: null,
          showHide: t({
            en: (
              <ExpandableSection title="Why do we need your age?">
                <p className="text-sm">
                  We need to know your age so that we can work out the
                  contributions correctly – the rules vary slightly based on
                  age. This is explained in the letter you receive from your
                  employer about automatic enrolment.
                </p>
              </ExpandableSection>
            ),
            cy: (
              <ExpandableSection title="Pam mae angen eich oedran arnom?">
                <p className="text-sm">
                  Mae arnom angen gwybod eich oedran er mwyn i ni fedru
                  cyfrifo’r cyfraniadau’n gywir – mae’r rheolau’n amrywio
                  ychydig yn seiliedig ar oed. Eglurir hyn yn y llythyr a gewch
                  gan eich cyflogwr am gofrestru awtomatig.
                </p>
              </ExpandableSection>
            ),
          }),
        },
        {
          name: PensionInput.SALARY,
          label: t({
            en: 'Your salary',
            cy: 'Eich cyflog',
          }),
          options: frequencyOptions(t),
          information: null,
          errors: {
            required: t({
              en: 'Please enter your salary',
              cy: 'Nodwch eich cyflog',
            }),
            min: t({
              en: 'Your employer will not automatically enrol you into a pension but you can choose to join. If you earn more than the lower level of qualifying earnings, your employer must also contribute.',
              cy: `Ni fydd eich cyflogwr yn eich cofrestru yn awtomatig am gynllun pensiwn gweithle, ond gallwch ddewis ymuno. Os felly, ni fydd yn ofynnol i'ch cyflogwr wneud cyfraniadau.`,
            }),
            invalid: t({
              en: 'Salary is not a number',
              cy: 'Nid yw cyflog yn rhif',
            }),
          },
          showHide: t({
            en: (
              <ExpandableSection title="More info about your salary">
                <p className="text-sm">
                  Enter your salary before tax or other deductions are taken
                  off. This is known as your gross salary.{' '}
                  <Link href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/auto-enrolment/i-have-more-than-one-job-how-does-this-affect-my-pension">
                    If you have more than one job
                  </Link>
                  , you will have to enter each salary separately.
                </p>
              </ExpandableSection>
            ),
            cy: (
              <ExpandableSection title="Mwy o wybodaeth am eich cyflog">
                <p className="text-sm">
                  Rhowch eich cyflog cyn i’r dreth nag unrhyw ddidyniadau eraill
                  gael eu tynnu. Gelwir hyn yn gyflog gros.
                  <Link href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/auto-enrolment/i-have-more-than-one-job-how-does-this-affect-my-pension">
                    Os oes gennych fwy nag un swydd
                  </Link>
                  , bydd raid i chi roi pob cyflog ar wahân.
                </p>
              </ExpandableSection>
            ),
          }),
        },
        {
          name: PensionInput.CONTRIBUTION_TYPE,
          defaultValue: 'part',
          label: t({
            en: 'Choose how your employer makes contributions',
            cy: 'Dewiswch sut mae eich cyflogwr yn cyfrannu',
          }),
          errors: {
            invalid: t({
              en: 'At your earnings level, you will have to make contributions based on your full salary.',
              cy: 'Ar eich lefel enillion, bydd rhaid i chi wneud cyfraniadau yn seiliedig ar eich cyflog llawn.',
            }),
            required: t({
              en: 'Please select a contribution type',
              cy: 'Dewiswch fath o gyfraniad',
            }),
            min: t({
              en: 'At your earnings level, you will have to make contributions based on your full salary.',
              cy: 'At your earnings level, you will have to make contributions based on your full salary',
            }),
          },
          options: [
            {
              text: t({
                en: 'My employer makes contributions on my full salary',
                cy: 'Mae fy nghyflogwr yn cyfrannu ar fy nghyflog llawn',
              }),
              value: 'full',
            },
            {
              text: t({
                en: `My employer makes contributions on part of my salary (if you're not sure select this option)`,
                cy: 'Mae fy nghyflogwr yn cyfrannu ar ran o fy nghyflog (os nad ydych yn siŵr dewiswch yr opsiwn hwn)',
              }),
              value: 'part',
            },
          ],
          information: t({
            en: `Your employer can choose whether to make contributions on part of your salary (known as your qualifying earnings) or on your full salary. To find this out, you will need to check with your employer.`,
            cy: `Gall eich cyflogwr ddewis os yw am wneud cyfraniadau ar ran o'ch cyflog (a elwir yn enillion cymhwyso) neu ar eich cyflog llawn. I gael gwybod pa un, bydd angen i chi wirio gyda’ch cyflogwr.`,
          }),
          showHide: t({
            en: (
              <ExpandableSection title="More info about your salary">
                <p className="text-sm">
                  This is the part of your annual pay that will be used to
                  calculate your pension contribution under automatic enrolment.
                  It is your earnings before tax (up to a maximum limit of
                  £50,270 per year) – less the lower earnings threshold of
                  £6,240.
                </p>
              </ExpandableSection>
            ),
            cy: (
              <ExpandableSection title="Mwy o wybodaeth am eich cyflog">
                <p className="text-sm">
                  Dyma’r rhan o’ch cyflog blynyddol fydd yn cael ei defnyddio i
                  gyfrifo eich cyfraniad pensiwn dan gofrestru awtomatig. Sef
                  eich enillion cyn treth (hyd at derfyn uchafswm o £50,270 y
                  flwyddyn) - tynnu’r trothwy enillion isaf o £6,240.
                </p>
              </ExpandableSection>
            ),
          }),
        },
      ],
      buttonText: t({
        en: 'Next',
        cy: 'Nesaf',
      }),
    },
  };
};

import { Condition, TranslationGroup, TranslationGroupString } from 'types';
import {
  PensionStartDateAnswer,
  PensionTypeQuestion,
  ProviderListedAnswer,
  PublicSectorEmployerAnswer,
  SetUpByEmployerAnswer,
} from 'utils/constants';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ListElement } from '@maps-react/common/components/ListElement';

type ConditionalContent = {
  content: TranslationGroup;
};

type Content = {
  defaultContent: TranslationGroup;
  conditionalContent: ConditionalContent[];
};

type ResultSection = {
  title: TranslationGroupString;
  content: TranslationGroup;
  conditions?: Condition[];
  conditionOperator?: 'and' | 'or';
  conditionGroups?: Condition[][];
};

type Data = {
  results: ResultSection[];
};

const content: Content = {
  defaultContent: {
    en: (
      <>
        <Paragraph>
          This is just a rough guide. Your provider or employer can confirm the
          exact type you have. You can also{' '}
          <Link href="https://www.moneyhelper.org.uk/en/contact-us">
            contact our pension specialists
          </Link>{' '}
          for free help.
        </Paragraph>
        <Paragraph>
          A defined contribution pension is the most common type in the UK. It’s
          a pot of money that you (and sometimes your employer) pay into for
          your retirement. It might also be called a money purchase pension.
        </Paragraph>
        <Paragraph>
          Your pension is invested, so your retirement income depends on how
          well the investments perform and how and when you choose to take it.
        </Paragraph>
        <Paragraph>For more information, see our guides:</Paragraph>
        <ListElement
          variant="unordered"
          color="blue"
          className="mb-4 ml-7"
          items={[
            <Link
              key="defined-contribution-pension-schemes"
              href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/defined-contribution-pension-schemes"
            >
              Defined contribution pension schemes explained
            </Link>,
            <Link
              key="pension-pot-options"
              href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-wise/pension-pot-options"
            >
              What can I do with my pension pot?
            </Link>,
          ]}
        />
        <Paragraph>
          If you have more than one pension, you can{' '}
          <Link href="/en/pension-type/question-1">check another pension</Link>.
        </Paragraph>
      </>
    ),
    cy: (
      <>
        <Paragraph>
          Canllaw bras yn unig yw hwn. Gall eich darparwr neu eich cyflogwr
          gadarnhau’n union pa fath o bensiwn sydd gennych. Gallwch hefyd{' '}
          <Link href="https://www.moneyhelper.org.uk/cy/contact-us">
            gysylltu â'n harbenigwyr pensiynau
          </Link>{' '}
          am gymorth am ddim.
        </Paragraph>
        <Paragraph>
          Y math mwyaf cyffredin o bensiwn yn y DU yw pensiwn cyfraniadau wedi'u
          diffinio. Mae’n gronfa o arian rydych chi (ac weithiau eich cyflogwr)
          yn cyfrannu ati ar gyfer eich ymddeoliad. Efallai y bydd hefyd yn cael
          ei alw’n bensiwn prynu arian.
        </Paragraph>
        <Paragraph>
          Mae eich pensiwn yn cael ei fuddsoddi, felly mae eich incwm ymddeol yn
          dibynnu ar berfformiad y buddsoddiadau ac ar sut a phryd rydych chi'n
          dewis ei gymryd.
        </Paragraph>
        <Paragraph>Am ragor o wybodaeth, gweler ein canllawiau:</Paragraph>
        <ListElement
          variant="unordered"
          color="blue"
          className="mb-4 ml-7"
          items={[
            <Link
              key="defined-contribution-pension-schemes"
              href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/defined-contribution-pension-schemes"
            >
              Esboniad o gynlluniau pensiwn cyfraniadau wedi'u diffinio
            </Link>,
            <Link
              key="pension-pot-options"
              href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pension-wise/pension-pot-options"
            >
              Beth allaf ei wneud gyda fy nghronfa bensiwn?
            </Link>,
          ]}
        />
        <Paragraph>
          Os oes gennych fwy nag un pensiwn, gallwch{' '}
          <Link href="/cy/pension-type/question-1">wirio pensiwn arall</Link>.
        </Paragraph>
      </>
    ),
  },
  conditionalContent: [
    {
      content: {
        en: (
          <>
            <Paragraph>
              This is just a guide. Your provider or employer can confirm the
              exact type you have.
            </Paragraph>
            <Paragraph>
              A defined contribution pension is a pot of money that you (and
              sometimes your employer) pay into for your retirement. It might
              also be called a money purchase pension.
            </Paragraph>
            <Paragraph>
              Your pension is invested, so your retirement income depends on how
              well the investments perform and how and when you choose to take
              it.
            </Paragraph>
            <Paragraph>For more information, see our guides:</Paragraph>
            <ListElement
              variant="unordered"
              color="blue"
              className="mb-4 ml-7"
              items={[
                <Link
                  key="defined-contribution-pension-schemes"
                  href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/defined-contribution-pension-schemes"
                >
                  Defined contribution pension schemes explained
                </Link>,
                <Link
                  key="pension-pot-options"
                  href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-wise/pension-pot-options"
                >
                  What can I do with my pension pot?
                </Link>,
              ]}
            />
            <Paragraph>
              If you have more than one pension, you can{' '}
              <Link href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-wise/find-out-your-pension-type">
                check another pension
              </Link>
              .
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph>
              Canllaw yn unig yw hwn. Gall eich darparwr neu eich cyflogwr
              gadarnhau’n union pa fath o bensiwn sydd gennych.
            </Paragraph>
            <Paragraph>
              Mae pensiwn cyfraniadau wedi'u diffinio yn gronfa o arian rydych
              chi (ac weithiau eich cyflogwr) yn cyfrannu ati ar gyfer eich
              ymddeoliad. Efallai y bydd hefyd yn cael ei alw’n bensiwn prynu
              arian.
            </Paragraph>
            <Paragraph>
              Mae eich pensiwn yn cael ei fuddsoddi, felly mae eich incwm
              ymddeol yn dibynnu ar berfformiad y buddsoddiadau ac ar sut a
              phryd rydych chi'n dewis ei gymryd.
            </Paragraph>
            <Paragraph>Am ragor o wybodaeth, gweler ein canllawiau: </Paragraph>
            <ListElement
              variant="unordered"
              color="blue"
              className="mb-4 ml-7"
              items={[
                <Link
                  key="defined-contribution-pension-schemes"
                  href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/defined-contribution-pension-schemes"
                >
                  Esboniad o gynlluniau pensiwn cyfraniadau wedi'u diffinio
                </Link>,
                <Link
                  key="pension-pot-options"
                  href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pension-wise/pension-pot-options"
                >
                  Beth allaf ei wneud gyda fy nghronfa bensiwn?
                </Link>,
              ]}
            />
            <Paragraph>
              Os oes gennych fwy nag un pensiwn, gallwch{' '}
              <Link href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pension-wise/find-out-your-pension-type">
                wirio pensiwn arall
              </Link>
              .
            </Paragraph>
          </>
        ),
      },
    },
    {
      content: {
        en: (
          <>
            <Paragraph>
              This is just a rough guide. Your provider or employer can confirm
              the exact type you have. You can also{' '}
              <Link href="https://www.moneyhelper.org.uk/en/contact-us">
                contact our pension specialists
              </Link>{' '}
              for free help.
            </Paragraph>
            <Paragraph>
              A defined contribution pension is the most common type in the UK.
              It’s a pot of money that you (and sometimes your employer) pay
              into for your retirement. It might also be called a money purchase
              pension.
            </Paragraph>
            <Paragraph>
              Your pension is invested, so your retirement income depends on how
              well the investments perform and how and when you choose to take
              it.
            </Paragraph>
            <Paragraph>For more information, see our guides:</Paragraph>
            <ListElement
              variant="unordered"
              color="blue"
              className="mb-4 ml-7"
              items={[
                <Link
                  key="defined-contribution-pension-schemes"
                  href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/defined-contribution-pension-schemes"
                >
                  Defined contribution pension schemes explained
                </Link>,
                <Link
                  key="pension-pot-options"
                  href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-wise/pension-pot-options"
                >
                  What can I do with my pension pot?
                </Link>,
              ]}
            />
            <Paragraph>
              If you have more than one pension, you can{' '}
              <Link href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-wise/find-out-your-pension-type">
                check another pension
              </Link>
              .
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph>
              Canllaw bras yn unig yw hwn. Gall eich darparwr neu eich cyflogwr
              gadarnhau’n union pa fath o bensiwn sydd gennych. Gallwch hefyd{' '}
              <Link href="https://www.moneyhelper.org.uk/cy/contact-us">
                gysylltu â'n harbenigwyr pensiynau
              </Link>{' '}
              am gymorth am ddim.
            </Paragraph>
            <Paragraph>
              Y math mwyaf cyffredin o bensiwn yn y DU yw pensiwn cyfraniadau
              wedi'u diffinio. Mae’n gronfa o arian rydych chi (ac weithiau eich
              cyflogwr) yn cyfrannu ati ar gyfer eich ymddeoliad. Efallai y bydd
              hefyd yn cael ei alw’n bensiwn prynu arian.
            </Paragraph>
            <Paragraph>
              Mae eich pensiwn yn cael ei fuddsoddi, felly mae eich incwm
              ymddeol yn dibynnu ar berfformiad y buddsoddiadau ac ar sut a
              phryd rydych chi'n dewis ei gymryd.
            </Paragraph>
            <Paragraph>Am ragor o wybodaeth, gweler ein canllawiau: </Paragraph>
            <ListElement
              variant="unordered"
              color="blue"
              className="mb-4 ml-7"
              items={[
                <Link
                  key="defined-contribution-pension-schemes"
                  href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/defined-contribution-pension-schemes"
                >
                  Esboniad o gynlluniau pensiwn cyfraniadau wedi'u diffinio
                </Link>,
                <Link
                  key="pension-pot-options"
                  href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pension-wise/pension-pot-options"
                >
                  Beth allaf ei wneud gyda fy nghronfa bensiwn?
                </Link>,
              ]}
            />
            <Paragraph>
              Os oes gennych fwy nag un pensiwn, gallwch{' '}
              <Link href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pension-wise/find-out-your-pension-type">
                wirio pensiwn arall
              </Link>
              .
            </Paragraph>
          </>
        ),
      },
    },
    {
      content: {
        en: (
          <>
            <Paragraph>
              This is just a guide. Your provider or employer can confirm the
              exact type you have.
            </Paragraph>
            <Paragraph>
              A defined benefit pension pays a guaranteed regular income based
              on your salary and how long you were a member of the scheme. It’s
              often called a final salary or career average scheme.
            </Paragraph>
            <Paragraph>For more information, see our guides:</Paragraph>
            <ListElement
              variant="unordered"
              color="blue"
              className="mb-4 ml-7"
              items={[
                <Link
                  key="defined-benefit-pension-schemes-final-salary-and-career-average-explained"
                  href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/defined-benefit-or-final-salary-pensions-schemes-explained"
                >
                  Defined benefit pension schemes: final salary and career
                  average explained
                </Link>,
                <Link
                  key="how-to-take-your-pension-step-by-step-guide"
                  href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/how-to-take-your-pension"
                >
                  How to take your pension: a step-by-step guide
                </Link>,
              ]}
            />
            <Paragraph>
              If you have more than one pension, you can{' '}
              <Link href="/en/pension-type/question-1">
                check another pension
              </Link>
              .
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph>
              Canllaw yn unig yw hwn. Gall eich darparwr neu eich cyflogwr
              gadarnhau’n union pa fath o bensiwn sydd gennych.
            </Paragraph>
            <Paragraph>
              Mae pensiwn buddion wedi’u diffinio yn talu incwm rheolaidd
              gwarantedig yn seiliedig ar eich cyflog a pha mor hir roeddech yn
              aelod o’r cynllun. Yn aml, gelwir hyn yn gynllun cyflog terfynol
              neu gynllun cyfartaledd gyrfa.
            </Paragraph>
            <Paragraph>Am ragor o wybodaeth, gweler ein canllawiau:</Paragraph>
            <ListElement
              variant="unordered"
              color="blue"
              className="mb-4 ml-7"
              items={[
                <Link
                  key="defined-benefit-pension-schemes-final-salary-and-career-average-explained"
                  href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/defined-benefit-or-final-salary-pensions-schemes-explained"
                >
                  Cynlluniau pensiwn buddion wedi’u diffinio: cyflog terfynol a
                  chyfartaledd gyrfa wedi’u hesbonio
                </Link>,
                <Link
                  key="how-to-take-your-pension-step-by-step-guide"
                  href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/how-to-take-your-pension"
                >
                  Sut i gymryd eich pensiwn: canllaw cam wrth gam
                </Link>,
              ]}
            />
            <Paragraph>
              Os oes gennych fwy nag un pensiwn, gallwch{' '}
              <Link href="/cy/pension-type/question-1">
                wirio pensiwn arall
              </Link>
              .
            </Paragraph>
          </>
        ),
      },
    },
  ],
};

const results: ResultSection[] = [
  {
    title: {
      en: 'In most cases, you’ll have a defined contribution pension',
      cy: "Yn y mwyafrif o achosion bydd gennych bensiwn cyfraniadau wedi'u diffinio",
    },
    content: content.conditionalContent[0].content,
    conditionGroups: [
      [
        {
          question: PensionTypeQuestion.SET_UP_BY_EMPLOYER,
          answer: SetUpByEmployerAnswer.NO,
        },
      ],
      [
        {
          question: PensionTypeQuestion.PROVIDER_LISTED,
          answer: ProviderListedAnswer.YES,
        },
      ],
      [
        {
          question: PensionTypeQuestion.PENSION_START_DATE,
          answer: PensionStartDateAnswer.FROM_2000,
        },
      ],
      [
        {
          question: PensionTypeQuestion.SET_UP_BY_EMPLOYER,
          answer: SetUpByEmployerAnswer.NOT_SURE,
        },
        {
          question: PensionTypeQuestion.PUBLIC_SECTOR_EMPLOYER,
          answer: PublicSectorEmployerAnswer.NO,
        },
        {
          question: PensionTypeQuestion.PROVIDER_LISTED,
          answer: ProviderListedAnswer.NO,
        },
        {
          question: PensionTypeQuestion.PENSION_START_DATE,
          answer: PensionStartDateAnswer.FROM_2000,
        },
      ],
      [
        {
          question: PensionTypeQuestion.SET_UP_BY_EMPLOYER,
          answer: SetUpByEmployerAnswer.NOT_SURE,
        },
        {
          question: PensionTypeQuestion.PUBLIC_SECTOR_EMPLOYER,
          answer: PublicSectorEmployerAnswer.NO,
        },
        {
          question: PensionTypeQuestion.PROVIDER_LISTED,
          answer: ProviderListedAnswer.NOT_SURE,
        },
        {
          question: PensionTypeQuestion.PENSION_START_DATE,
          answer: PensionStartDateAnswer.FROM_2000,
        },
      ],
    ],
  },
  {
    title: {
      en: 'You might have a defined contribution pension',
      cy: 'Efallai bod gennych bensiwn cyfraniadau wedi’u diffinio',
    },
    content: content.conditionalContent[1].content,
    conditions: [
      {
        question: PensionTypeQuestion.PENSION_START_DATE,
        answer: PensionStartDateAnswer.DONT_KNOW,
      },
    ],
  },
  {
    title: {
      en: 'In most cases, you’ll have a defined benefit pension',
      cy: 'Yn y mwyafrif o achosion bydd gennych bensiwn buddion wedi’u diffinio',
    },
    content: content.conditionalContent[2].content,
    conditionOperator: 'or',
    conditions: [
      {
        question: PensionTypeQuestion.PUBLIC_SECTOR_EMPLOYER,
        answer: PublicSectorEmployerAnswer.YES,
      },
      {
        question: PensionTypeQuestion.PENSION_START_DATE,
        answer: PensionStartDateAnswer.BEFORE_2000,
      },
    ],
  },
];

export const data: Data = { results };

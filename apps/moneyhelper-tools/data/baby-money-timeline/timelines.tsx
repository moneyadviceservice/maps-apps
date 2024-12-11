import { ReactNode } from 'react';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Options } from '@maps-react/form/components/Select/Select';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export interface TimelineData {
  offset: number;
  tab: number;
  title: string;
  content?: ReactNode;
}

export const monthsShorthand = [
  {
    en: 'Jan',
    cy: 'Ion',
  },
  {
    en: 'Feb',
    cy: 'Chwe',
  },
  {
    en: 'Mar',
    cy: 'Mawr',
  },
  {
    en: 'Apr',
    cy: 'Ebr',
  },
  {
    en: 'May',
    cy: 'Mai',
  },
  {
    en: 'Jun',
    cy: 'Meh',
  },
  {
    en: 'Jul',
    cy: 'Gorf',
  },
  {
    en: 'Aug',
    cy: 'Awst',
  },
  {
    en: 'Sep',
    cy: 'Medi',
  },
  {
    en: 'Oct',
    cy: 'Hyd',
  },
  {
    en: 'Nov',
    cy: 'Tach',
  },
  {
    en: 'Dec',
    cy: 'Rhag',
  },
];

export const getMonthOptions = (
  z: ReturnType<typeof useTranslation>['z'],
): Options[] => {
  const months = [
    z({
      en: 'January',
      cy: 'Ionawr',
    }),
    z({
      en: 'February',
      cy: 'Chwefror',
    }),
    z({
      en: 'March',
      cy: 'Mawrth',
    }),
    z({
      en: 'April',
      cy: 'Ebrill',
    }),
    z({
      en: 'May',
      cy: 'Mai',
    }),
    z({
      en: 'June',
      cy: 'Mehefin',
    }),
    z({
      en: 'July',
      cy: 'Gorffennaf',
    }),
    z({
      en: 'August',
      cy: 'Awst',
    }),
    z({
      en: 'September',
      cy: 'Medi',
    }),
    z({
      en: 'October',
      cy: 'Hydref',
    }),
    z({
      en: 'November',
      cy: 'Tachwedd',
    }),
    z({
      en: 'December',
      cy: 'Rhagfyr',
    }),
  ];

  return months.map((month, index) => ({
    value: String(index + 1),
    text: month,
  }));
};

export const weeklyData = (
  z: ReturnType<typeof useTranslation>['z'],
): TimelineData[] => {
  return [
    {
      offset: 1,
      tab: 1,
      title: z({
        en: 'Apply to get Best Start Foods',
        cy: 'Gwnewch gais i gael Best Start Foods',
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              In Scotland, Best Start Foods is a payment that that can help you
              buy healthy foods during your pregnancy and when your child is
              under three. You can apply to get it soon as you know you're
              pregnant.
            </Paragraph>
            <Paragraph className="text-lg">
              Find out more about 
              <Link
                href="https://www.mygov.scot/best-start-grant-best-start-foods/how-to-apply"
                target="_blank"
                asInlineText
              >
                Best Start Foods, eligibility and how to apply at mygov.scot
              </Link>
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Yn yr Alban, mae Best Start Foods yn daliad a all eich helpu i
              brynu bwydydd iach yn ystod eich beichiogrwydd a phan fydd eich
              plentyn o dan dair oed. Gallwch wneud cais i'w gael cyn gynted ag
              y byddwch yn gwybod eich bod yn feichiog.
            </Paragraph>
            <Paragraph className="text-lg">
              Darganfyddwch fwy am{' '}
              <Link
                href="https://www.mygov.scot/best-start-grant-best-start-foods/how-to-apply"
                target="_blank"
                asInlineText
              >
                Best Start Foods, cymhwysedd a sut i wneud cais ar mygov.scot
              </Link>
            </Paragraph>
          </>
        ),
      }),
    },
    {
      offset: 4,
      tab: 1,
      title: z({
        en: 'Check if you’re entitled to the Scottish Child Payment',
        cy: 'Gwiriwch a oes gennych hawl i’r Scottish Child Payment',
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              If you live in Scotland, and get certain benefits, you might be
              able to get a weekly payment to help towards the costs of
              supporting your family.
            </Paragraph>
            <Paragraph className="text-lg">
              Find out more and how to apply at{' '}
              <Link
                href="https://www.mygov.scot/scottish-child-payment"
                target="_blank"
                asInlineText
              >
                mygov.scot
              </Link>
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Os ydych yn byw yn yr Alban, ac yn cael budd-daliadau penodol,
              efallai y gallwch gael taliad wythnosol i helpu tuag at gostau
              cynnal eich teulu.
            </Paragraph>
            <Paragraph className="text-lg">
              Darganfyddwch fwy a sut i wneud cais ar{' '}
              <Link
                href="https://www.mygov.scot/scottish-child-payment"
                target="_blank"
                asInlineText
              >
                mygov.scot
              </Link>
            </Paragraph>
          </>
        ),
      }),
    },
    {
      offset: 8,
      tab: 1,
      title: z({
        en: 'Take paid time off for antenatal appointments',
        cy: 'Cymerwch amser o’r gwaith gyda thâl ar gyfer apwyntiadau cynenedigol',
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              As a mum-to-be, you have the right to paid time off from work to
              go to your antenatal appointments.
            </Paragraph>
            <Paragraph className="text-lg">
              Find out more: 
              <Link
                href="https://www.moneyhelper.org.uk/en/benefits/benefits-if-you-have-children/benefits-and-entitlements-to-claim-when-you-have-a-baby"
                target="_blank"
                asInlineText
              >
                Entitlements from work when pregnant
              </Link>
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Fel mam arfaethedig, mae gennych yr hawl i gael amser o’r gwaith
              gyda thâl er mwyn mynychu eich apwyntiadau cynenedigol.
            </Paragraph>
            <Paragraph className="text-lg">
              Cewch ragor o wybodaeth yn: 
              <Link
                href="https://www.moneyhelper.org.uk/cy/benefits/benefits-if-you-have-children/benefits-and-entitlements-to-claim-when-you-have-a-baby"
                target="_blank"
                asInlineText
              >
                Hawliau o’r gwaith pan fyddwch yn feichiog
              </Link>
            </Paragraph>
          </>
        ),
      }),
    },
    {
      offset: 10,
      tab: 1,
      title: z({
        en: 'Claim free prescriptions and NHS dental care',
        cy: 'Hawlio presgripsiynau a thriniaeth ddeintyddol am ddim gan y GIG',
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              Fill out the Maternity Exemption form – available from your doctor
              or midwife. They’ll send it off for you and you’ll get your
              Maternity Exemption certificate in the post.
            </Paragraph>
            <Paragraph className="text-lg">
              Find out more: 
              <Link
                href="https://www.moneyhelper.org.uk/en/benefits/benefits-if-you-have-children/free-prescriptions-and-nhs-dental-care-in-pregnancy"
                target="_blank"
                asInlineText
              >
                Free prescriptions and NHS dental care in pregnancy
              </Link>
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Cwblhewch y ffurflen Eithriad Mamolaeth – sydd ar gael gan eich
              meddyg neu fydwraig. Byddant yn ei anfon i mewn ar eich rhan a
              byddwch yn cael eich tystysgrif Eithriad Mamolaeth yn y post.
            </Paragraph>
            <Paragraph className="text-lg">
              Cewch ragor o wybodaeth yn: 
              <Link
                href="https://www.moneyhelper.org.uk/cy/benefits/benefits-if-you-have-children/free-prescriptions-and-nhs-dental-care-in-pregnancy"
                target="_blank"
                asInlineText
              >
                Presgripsiynau a thriniaeth ddeintyddol am ddim gan y GIG yn
                ystod beichiogrwydd
              </Link>
            </Paragraph>
          </>
        ),
      }),
    },
    {
      offset: 10,
      tab: 1,
      title: z({
        en: 'Find out whether you qualify for Healthy Start vouchers',
        cy: 'Dysgwch a ydych yn gymwys i gael talebau’r Cynllun Cychwyn Iach',
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              If you’re pregnant and living on a low income you could get
              Healthy Start vouchers to help buy some basic foods.
            </Paragraph>
            <Paragraph className="text-lg">
              Find out more: 
              <Link
                href="https://www.moneyhelper.org.uk/en/benefits/benefits-if-you-have-children/benefits-and-entitlements-to-claim-when-you-have-a-baby#healthy-food-scheme-and-health-start-vouchers-in-england-wales-and-northern-ireland"
                target="_blank"
                asInlineText
              >
                on the Healthy Start website
              </Link>
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Os ydych yn feichiog ac yn byw ar incwm isel gallech gael talebau
              Cychwyn Iach i roi cymorth i chi brynu rhai bwydydd syml.
            </Paragraph>
            <Paragraph className="text-lg">
              Dysgwch ragor ar{' '}
              <Link
                href="https://www.moneyhelper.org.uk/cy/benefits/benefits-if-you-have-children/benefits-and-entitlements-to-claim-when-you-have-a-baby#healthy-food-scheme-and-health-start-vouchers-in-england-wales-and-northern-ireland"
                target="_blank"
                asInlineText
              >
                wefan Cychwyn Iach
              </Link>
            </Paragraph>
          </>
        ),
      }),
    },
    {
      offset: 18,
      tab: 2,
      title: z({
        en: 'Take control of your finances',
        cy: 'Rheolwch eich cyllid',
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              Not only does a new baby nearly always mean a drop in income, it
              can also mean more outgoings. Don’t leave it until after the birth
              – make sure you’re prepared.
            </Paragraph>
            <Paragraph className="text-lg">
              Find out what steps you should take: 
              <Link
                href="https://www.moneyhelper.org.uk/en/family-and-care/becoming-a-parent/sorting-out-your-money-when-youre-pregnant"
                target="_blank"
                asInlineText
              >
                Budgeting when you’re pregnant
              </Link>
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Nid gostyngiad mewn incwm yn unig sy’n dod yn sgil babi newydd,
              gall hefyd fod yn gostus. Peidiwch â gadael pethau tan wedi’r
              enedigaeth – paratowch.
            </Paragraph>
            <Paragraph className="text-lg">
              Dysgwch pa gamau i’w cymryd: 
              <Link
                href="https://www.moneyhelper.org.uk/cy/family-and-care/becoming-a-parent/sorting-out-your-money-when-youre-pregnant"
                target="_blank"
                asInlineText
              >
                Rhoi trefn ar eich arian pan fyddwch yn disgwyl babi
              </Link>
            </Paragraph>
          </>
        ),
      }),
    },
    {
      offset: 19,
      tab: 2,
      title: z({
        en: 'Work out a budget for baby things',
        cy: 'Creu cyllideb ar gyfer pethau babis',
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              How much can you afford to spend on baby things? Before you go
              shopping, use our Baby costs calculator to work out what your baby
              will need and how much it will cost.
            </Paragraph>
            <Link
              href="https://www.moneyhelper.org.uk/en/family-and-care/becoming-a-parent/baby-costs-calculator"
              target="_blank"
              className="text-lg"
              asInlineText
            >
              Baby costs calculator
            </Link>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Faint allwch chi fforddio ei wario ar bethau babis? Cyn i chi fynd
              i siopa, defnyddiwch ein Cyfrifiannell costau babi i weld beth
              fydd eich babi ei angen a beth fydd cost hynny.
            </Paragraph>
            <Link
              href="https://www.moneyhelper.org.uk/cy/family-and-care/becoming-a-parent/baby-costs-calculator"
              target="_blank"
              className="text-lg"
              asInlineText
            >
              Cyfrifiannell costau babi
            </Link>
          </>
        ),
      }),
    },
    {
      offset: 20,
      tab: 2,
      title: z({
        en: 'Check how much maternity pay you’re entitled to',
        cy: 'Gwiriwch faint o dâl mamolaeth fyddwch chi’n ei gael',
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              Look at your contract or talk to your boss or human resources
              department to find out how much maternity pay you're entitled to.
            </Paragraph>
            <Paragraph className="text-lg">
              Find out more in our article:{' '}
              <Link
                href="https://www.moneyhelper.org.uk/en/family-and-care/becoming-a-parent/maternity-pay-and-leave"
                target="_blank"
                asInlineText
              >
                Maternity pay and leave
              </Link>
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Edrychwch ar eich cytundeb neu siaradwch â’ch pennaeth neu’ch
              adran adnoddau dynol er mwyn canfod faint o Dâl Mamolaeth y mae
              gennych hawl iddo.
            </Paragraph>
            <Paragraph className="text-lg">
              Dysgwch ragor yn ein herthygl:{' '}
              <Link
                href="https://www.moneyhelper.org.uk/cy/family-and-care/becoming-a-parent/maternity-pay-and-leave"
                target="_blank"
                asInlineText
              >
                Tâl ac absenoldeb mamolaeth
              </Link>
            </Paragraph>
          </>
        ),
      }),
    },
    {
      offset: 22,
      tab: 2,
      title: z({
        en: 'Arrange your maternity leave',
        cy: 'Trefnwch eich absenoldeb mamolaeth',
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              All mums are entitled to up to a year’s maternity leave.
            </Paragraph>
            <Paragraph className="text-lg">
              Use our{' '}
              <Link
                download={true}
                href="https://www.moneyhelper.org.uk/content/dam/maps/en/getting-help-and-advice/letter-templates/maternity-leave/letter-for-maternity-leave-to-an-employer.docx"
                asInlineText
              >
                template letter
              </Link>{' '}
              to let your employer know when you’re intending to go on leave.
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Trefnwch eich absenoldeb mamolaeth
            </Paragraph>
            <Paragraph className="text-lg">
              Defnyddiwch ein{' '}
              <Link
                download={true}
                href="https://www.moneyhelper.org.uk/content/dam/maps/en/getting-help-and-advice/letter-templates/maternity-leave/letter-for-maternity-leave-to-an-employer.docx"
                asInlineText
              >
                llythyr templed
              </Link>{' '}
              i roi gwybod i’ch cyflogwr pa bryd y bwriadwch gychwyn ar eich
              absenoldeb mamolaeth.
            </Paragraph>
          </>
        ),
      }),
    },
    {
      offset: 24,
      tab: 2,
      title: z({
        en: 'Apply for Best Start Grant if you live in Scotland',
        cy: 'Gwnewch gais am Best Start Grant os ydych yn byw yn yr Alban',
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              In Scotland, Best Start Grant is a payment that helps cover the
              costs of being pregnant or taking care of a child. You might be
              eligible after 24 weeks of pregnancy to help get ready for your
              baby or after your baby is born.
            </Paragraph>
            <Paragraph className="text-lg">
              Find out more about{' '}
              <Link
                href="https://www.mygov.scot/best-start-grant-best-start-foods/how-to-apply"
                target="_blank"
                asInlineText
              >
                Best Start Grant and how to apply at mygov.scot
              </Link>
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Yn yr Alban, mae Best Start Grant yn daliad sy'n helpu i dalu
              costau bod yn feichiog neu ofalu am blentyn. Efallai y byddwch yn
              gymwys ar ôl 24 wythnos o feichiogrwydd i helpu i baratoi ar gyfer
              eich babi neu ar ôl i'ch babi gael ei eni.
            </Paragraph>
            <Paragraph className="text-lg">
              Darganfyddwch fwy am y{' '}
              <Link
                href="https://www.mygov.scot/best-start-grant-best-start-foods/how-to-apply"
                target="_blank"
                asInlineText
              >
                Best Start Grant a sut i wneud cais ar mygov.scot
              </Link>
            </Paragraph>
          </>
        ),
      }),
    },
    {
      offset: 25,
      tab: 2,
      title: z({
        en: 'Dads-to-be – claim your paternity leave',
        cy: 'Tadau arfaethedig – hawliwch eich absenoldeb tadolaeth',
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              You must tell your employer that you are going on paternity leave
              at least 15 weeks before your baby's expected due date and think
              about Shared Parental Leave.
            </Paragraph>
            <Paragraph className="text-lg">
              Find out more in our article:{' '}
              <Link
                href="https://www.moneyhelper.org.uk/en/family-and-care/becoming-a-parent/paternity-leave-and-pay"
                target="_blank"
                asInlineText
              >
                Paternity leave and pay
              </Link>
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Mae’n rhaid i chi ddweud wrth eich cyflogwr eich bod yn mynd ar
              absenoldeb tadolaeth o leiaf 15 wythnos cyn dyddiad geni
              disgwyliedig eich babia meddwl am Absenoldeb a Rennir Rhieni.
            </Paragraph>
            <Paragraph className="text-lg">
              Dysgwch ragor yn ein herthygl:{' '}
              <Link
                href="https://www.moneyhelper.org.uk/cy/family-and-care/becoming-a-parent/paternity-leave-and-pay"
                target="_blank"
                asInlineText
              >
                Absenoldeb a thâl tadolaeth
              </Link>
            </Paragraph>
          </>
        ),
      }),
    },
    {
      offset: 25,
      tab: 2,
      title: z({
        en: 'Claim Maternity Allowance',
        cy: 'Hawliwch Lwfans Mamolaeth',
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              If you’re not entitled to Statutory Maternity Pay find out whether
              you can get Maternity Allowance instead.
            </Paragraph>
            <Paragraph className="text-lg">
              Find out more about who qualifies and how to claim: 
              <Link
                href="https://www.moneyhelper.org.uk/en/benefits/benefits-if-you-have-children/maternity-allowance"
                target="_blank"
                asInlineText
              >
                Maternity Allowance
              </Link>
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Os nad ydych yn medru hawlio Tâl Mamolaeth Statudol, canfyddwch a
              allwch hawlio Lwfans Mamolaeth yn hytrach.
            </Paragraph>
            <Paragraph className="text-lg">
              Dysgwch ragor ynglŷn â phwy sy’n gymwys a sut i hawlio: 
              <Link
                href="https://www.moneyhelper.org.uk/cy/benefits/benefits-if-you-have-children/maternity-allowance"
                target="_blank"
                asInlineText
              >
                Lwfans Mamolaeth
              </Link>
            </Paragraph>
          </>
        ),
      }),
    },
    {
      offset: 29,
      tab: 3,
      title: z({
        en: 'Find out whether you qualify for a Sure Start Maternity Grant',
        cy: 'Dysgwch a ydych yn gymwys i gael Cychwyn Cadarn',
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              If you’re on a low income and getting certain benefits, you could
              get a one-off payment of £500 to help with the cost of your first
              baby.
            </Paragraph>
            <Paragraph className="text-lg">
              Find out more on the{' '}
              <Link
                href="https://www.gov.uk/sure-start-maternity-grant"
                target="_blank"
                asInlineText
              >
                Gov.uk website
              </Link>
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Os ydych ar incwm isel ac yn derbyn budd-daliadau, gallech gael
              taliad unigol o £500 i helpu gyda chost eich babi cyntaf.
            </Paragraph>
            <Paragraph className="text-lg">
              Dysgwch ragor ar{' '}
              <Link
                href="https://www.gov.uk/sure-start-maternity-grant"
                target="_blank"
                asInlineText
              >
                wefan Gov.uk
              </Link>
            </Paragraph>
          </>
        ),
      }),
    },
    {
      offset: 32,
      tab: 3,
      title: z({
        en: 'Check whether you’ll qualify for benefits or tax credits',
        cy: 'Gwiriwch a fyddwch yn gymwys i gael budd-daliadau',
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              When the baby is born you might qualify for extra help.
            </Paragraph>
            <Paragraph className="mb-0 text-lg">
              Find out what you’re entitled to in our article:{' '}
              <Link
                href="https://www.moneyhelper.org.uk/en/benefits/benefits-if-you-have-children/benefits-and-entitlements-to-claim-when-you-have-a-baby"
                target="_blank"
                asInlineText
              >
                Benefits and entitlements to claim when you have a baby
              </Link>
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Pan gaiff y babi ei eni gallech fod yn gymwys am ragor o gymorth.
            </Paragraph>
            <Paragraph className="mb-0 text-lg">
              Canfyddwch beth allwch ei hawlio yn ein herthygl:{' '}
              <Link
                href="https://www.moneyhelper.org.uk/cy/benefits/benefits-if-you-have-children/benefits-and-entitlements-to-claim-when-you-have-a-baby"
                target="_blank"
                asInlineText
              >
                Budd-daliadau a hawliau i’w hawlio pan gewch fabi
              </Link>
            </Paragraph>
          </>
        ),
      }),
    },
    {
      offset: 40,
      tab: 3,
      title: z({
        en: 'Congratulations on the birth of your baby!',
        cy: 'Llonfyfarchiadau ar enedigaeth eich babi!',
      }),
    },
  ];
};

export const monthlyData = (
  z: ReturnType<typeof useTranslation>['z'],
): TimelineData[] => {
  return [
    {
      offset: 1,
      tab: 4,
      title: z({
        en: 'Register the birth of your baby',
        cy: 'Cofrestru’r enedigaeth eich babi',
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              Make an appointment to register the birth at your local register
              office. You have to do this within 42 days of the birth (or 21
              days in Scotland). You can’t claim Child Benefit until you have a
              birth certificate.
            </Paragraph>
            <Paragraph className="text-lg">
              Find out more about registering a birth on the{' '}
              <Link
                href="https://www.gov.uk/register-birth"
                target="_blank"
                asInlineText
              >
                Gov.uk website
              </Link>
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Gwnewch apwyntiad i gofrestru’r enedigaeth yn eich swyddfa
              gofrestru leol. Rhaid i chi wneud hyn o fewn 42 niwrnod i’r
              enedigaeth (neu 21 niwrnod yn yr Alban). Ni allwch hawlio Budd-dal
              Plant tan i chi gael tystysgrif geni.
            </Paragraph>
            <Paragraph className="text-lg">
              Dysgwch ragor am gofrestru genedigaeth ar{' '}
              <Link
                href="https://www.gov.uk/register-birth"
                target="_blank"
                asInlineText
              >
                wefan Gov.uk
              </Link>
            </Paragraph>
          </>
        ),
      }),
    },
    {
      offset: 2,
      tab: 4,
      title: z({
        en: 'Claim Child Benefit',
        cy: 'Hawliwch Fudd-dal Plant',
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              Make sure you send in your Child Benefit claim form before your
              baby is three months old – that’s the maximum your payment can be
              back dated.
            </Paragraph>
            <Paragraph className="text-lg">
              Find out more about how to claim Child Benefit in our article:{' '}
              <Link
                href="https://www.moneyhelper.org.uk/en/benefits/benefits-if-you-have-children/claiming-child-benefit"
                target="_blank"
                asInlineText
              >
                Claiming Child Benefit
              </Link>
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Sicrhewch eich bod yn gyrru’ch ffurflen Budd-dal Plant cyn i’ch
              babi gyrraedd tri mis oed – ni allwch hawlio taliad ymhellach yn
              ôl na hyn.
            </Paragraph>
            <Paragraph className="text-lg">
              Dysgwch ragor am sut i hawlio Budd-dal Plant yn ein herthygl:{' '}
              <Link
                href="https://www.moneyhelper.org.uk/cy/benefits/benefits-if-you-have-children/claiming-child-benefit"
                target="_blank"
                asInlineText
              >
                Hawlio Budd-dal Plant
              </Link>
            </Paragraph>
          </>
        ),
      }),
    },
    {
      offset: 3,
      tab: 4,
      title: z({
        en: 'Check you’re getting all your entitlements',
        cy: 'Sicrhewch eich bod yn cael yr holl fudd-daliadau sy’n ddyledus i chi',
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              Now you have a new baby you might qualify for extra help. Make
              sure you’re getting all the benefits you’re entitled to.
            </Paragraph>
            <Paragraph className="text-lg">
              Find out more in our article: 
              <Link
                href="https://www.moneyhelper.org.uk/en/benefits/benefits-if-you-have-children/benefits-and-entitlements-to-claim-when-you-have-a-baby"
                target="_blank"
                asInlineText
              >
                Benefits and entitlements to claim when you have a baby
              </Link>
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Gyda babi newydd, gallech fod yn gymwys am ragor o gymorth.
              Sicrhewch eich bod yn cael yr holl fudd-daliadau sy’n ddyledus i
              chi.
            </Paragraph>
            <Paragraph className="text-lg">
              Dysgwch ragor yn ein herthygl:{' '}
              <Link
                href="https://www.moneyhelper.org.uk/cy/benefits/benefits-if-you-have-children/benefits-and-entitlements-to-claim-when-you-have-a-baby"
                target="_blank"
                asInlineText
              >
                Budd-daliadau a hawliau i’w hawlio pan gewch fabi
              </Link>
            </Paragraph>
          </>
        ),
      }),
    },
    {
      offset: 4,
      tab: 4,
      title: z({
        en: 'Sort out your household budget',
        cy: 'Rhoi trefn ar eich cyllideb cartref',
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              It takes some time to adjust to your new life as parents. Not
              least when it comes to the money side of things.
            </Paragraph>
            <Paragraph className="text-lg">
              Find out more about: 
              <Link
                href="https://www.moneyhelper.org.uk/en/money-troubles/cost-of-living/squeezed-income"
                target="_blank"
                asInlineText
              >
                Managing family finances when you’ve had a baby
              </Link>
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Mae’n cymryd peth amser i ddygymod â’ch bywyd newydd fel rhieni.
              Yn enwedig pan fydd angen delio â’r ochr ariannol.
            </Paragraph>
            <Paragraph className="text-lg">
              Dysgwch ragor am 
              <Link
                href="https://www.moneyhelper.org.uk/cy/money-troubles/cost-of-living/squeezed-income"
                target="_blank"
                asInlineText
              >
                Reoli cyllid y teulu ar ôl i chi gael babi
              </Link>
            </Paragraph>
          </>
        ),
      }),
    },
    {
      offset: 6,
      tab: 4,
      title: z({
        en: 'Returning to work after maternity leave',
        cy: `Dychwelyd i'r gwaith wedi cyfnod o absenoldeb mamolaeth`,
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              Your employer needs eight weeks’ notice if you want to change the
              date you’re going back to work. Check your rights and
              responsibilities here:
            </Paragraph>
            <Link
              href="https://www.moneyhelper.org.uk/en/family-and-care/becoming-a-parent/know-your-rights-when-you-go-back-to-work-after-having-a-baby"
              target="_blank"
              className="text-lg"
              asInlineText
            >
              Your rights when you go back to work after maternity leave
            </Link>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Mae angen rhoi wyth wythnos o rybudd i'ch cyflogwr os ydych yn
              dymuno newid y dyddiad y byddwch yn dychwelyd i’r gwaith. Gwiriwch
              eich hawliau a’ch cyfrifoldebau yma:
            </Paragraph>
            <Link
              href="https://www.moneyhelper.org.uk/cy/family-and-care/becoming-a-parent/know-your-rights-when-you-go-back-to-work-after-having-a-baby"
              target="_blank"
              className="text-lg"
              asInlineText
            >
              Eich hawliau pan fyddwch chi'n dychwelyd i'r gwaith ar ôl cael
              babi
            </Link>
          </>
        ),
      }),
    },
    {
      offset: 6,
      tab: 4,
      title: z({
        en: 'Work out your childcare options',
        cy: 'Ystyriwch eich dewisiadau gofal plant',
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              Find out what childcare is available locally, weigh up what’s most
              suitable for your baby, and work out your childcare costs.
            </Paragraph>
            <Paragraph className="text-lg">
              Here’s a good place to start:{' '}
              <Link
                href="https://www.moneyhelper.org.uk/en/family-and-care/becoming-a-parent/childcare-options"
                target="_blank"
                asInlineText
              >
                Understanding your childcare options
              </Link>
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Dysgwch pa ofal plant sydd ar gael yn lleol, a phenderfynwch beth
              sydd fwyaf addas ar gyfer eich babi, a chyfrifwch beth fydd y
              costau gofal plant.
            </Paragraph>
            <Paragraph className="text-lg">
              Dyma le da i gychwyn:{' '}
              <Link
                href="https://www.moneyhelper.org.uk/cy/family-and-care/becoming-a-parent/childcare-options"
                target="_blank"
                asInlineText
              >
                Deall eich dewisiadau gofal plant
              </Link>
            </Paragraph>
          </>
        ),
      }),
    },
    {
      offset: 6,
      tab: 4,
      title: z({
        en: 'See if you’re entitled to help with childcare costs',
        cy: 'Gweld a oes gennych hawl i gael help gyda chostau gofal plant',
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              The cost of childcare can eat up a large chunk of the family
              budget. Help with childcare costs is available from the government
              and employers.
            </Paragraph>
            <Link
              href="https://www.moneyhelper.org.uk/en/family-and-care/becoming-a-parent/help-with-childcare-costs"
              target="_blank"
              className="text-lg"
              asInlineText
            >
              Help with childcare costs
            </Link>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Mae cost gofal plant yn gwneud tolc sylweddol yng nghyllideb y
              teulu. Mae help gyda chostau gofal plant ar gael gan y llywodraeth
              a chyflogwyr.
            </Paragraph>
            <Link
              href="https://www.moneyhelper.org.uk/cy/family-and-care/becoming-a-parent/help-with-childcare-costs"
              target="_blank"
              className="text-lg"
              asInlineText
            >
              Help gyda chostau gofal plant
            </Link>
          </>
        ),
      }),
    },
    {
      offset: 9,
      tab: 5,
      title: z({
        en: 'Make your will',
        cy: 'Gwneud eich ewyllys',
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              Making a will – or revising your will if you already have one – is
              the most important thing you can do to make sure your baby is
              provided for and cared for should anything happen to you.
            </Paragraph>
            <Paragraph className="text-lg">
              Find out more: 
              <Link
                href="https://www.moneyhelper.org.uk/en/family-and-care/death-and-bereavement/planning-what-to-leave-in-your-will"
                target="_blank"
                asInlineText
              >
                Why you should make a will
              </Link>
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Gwneud ewyllys – neu addasu’ch ewyllys os oes gennych i un yn
              barod – dyma’r peth pwysicaf y gallwch chi ei wneud i sicrhau y
              bydd eich babi wedi ei ofalu amdano pe bai rhywbeth yn digwydd i
              chi.
            </Paragraph>
            <Paragraph className="text-lg">
              Cewch ragor o wybodaeth yn:{' '}
              <Link
                href="https://www.moneyhelper.org.uk/cy/family-and-care/death-and-bereavement/planning-what-to-leave-in-your-will"
                target="_blank"
                asInlineText
              >
                Pam ddylech chi wneud ewyllys
              </Link>
            </Paragraph>
          </>
        ),
      }),
    },
    {
      offset: 10,
      tab: 5,
      title: z({
        en: 'Check whether you need life insurance',
        cy: 'Gwiriwch a oes angen yswiriant bywyd arnoch',
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              How would your family cope financially if something were to happen
              to you or your partner?
            </Paragraph>
            <Paragraph className="text-lg">
              Find out more: 
              <Link
                href="https://www.moneyhelper.org.uk/en/everyday-money/insurance/what-is-life-insurance"
                target="_blank"
                asInlineText
              >
                What is life insurance?
              </Link>
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Sut fyddai’ch teulu’n ymdopi’n ariannol pe byddai rhywbeth yn
              digwydd i chi neu'ch partner?
            </Paragraph>
            <Paragraph className="text-lg">
              Cewch ragor o wybodaeth yn:{' '}
              <Link
                href="https://www.moneyhelper.org.uk/cy/everyday-money/insurance/what-is-life-insurance"
                target="_blank"
                asInlineText
              >
                Beth yw yswiriant bywyd?
              </Link>
            </Paragraph>
          </>
        ),
      }),
    },
    {
      offset: 12,
      tab: 5,
      title: z({
        en: 'Protect your pension while you’re off work',
        cy: 'Diogelwch eich pensiwn pan fyddwch yn absennol o’r gwaith',
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              Claiming Child Benefit should protect your entitlement to the
              State Pension but what else do you need to think about to keep
              your pension safe?
            </Paragraph>
            <Paragraph className="text-lg">
              Find out more in our articles:{' '}
              <Link
                href="https://www.moneyhelper.org.uk/en/benefits/benefits-if-you-have-children/protecting-your-state-pension-when-you-have-a-baby"
                target="_blank"
                asInlineText
              >
                Protecting your State Pension when you have a baby
              </Link>{' '}
              and{' '}
              <Link
                href="https://www.moneyhelper.org.uk/en/family-and-care/becoming-a-parent/protecting-your-workplace-pension-after-having-a-baby"
                target="_blank"
                asInlineText
              >
                Protecting your workplace pension after having a baby
              </Link>
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Wrth hawlio Budd-dal Plant dylech lwyddo i ddiogelu’ch hawl i gael
              Pensiwn y Wladwriaeth ond beth arall sydd angen i chi ystyried er
              mwyn diogelu’ch pensiwn?
            </Paragraph>
            <Paragraph className="text-lg">
              Dysgwch ragor yn ein herthyglau:{' '}
              <Link
                href="https://www.moneyhelper.org.uk/cy/benefits/benefits-if-you-have-children/protecting-your-state-pension-when-you-have-a-baby"
                target="_blank"
                asInlineText
              >
                Diogelu’ch Pensiwn y Wladwriaeth pan fyddwch yn cael babi
              </Link>{' '}
              a{' '}
              <Link
                href="https://www.moneyhelper.org.uk/cy/family-and-care/becoming-a-parent/protecting-your-workplace-pension-after-having-a-baby"
                target="_blank"
                asInlineText
              >
                Diogelu eich pensiwn gweithle ar ôl cael babi
              </Link>
            </Paragraph>
          </>
        ),
      }),
    },
    {
      offset: 12,
      tab: 5,
      title: z({
        en: 'Open a savings account for your baby',
        cy: 'Agorwch gyfrif cynilo ar gyfer eich babi',
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              Happy first birthday! Opening a children’s savings account for
              your baby will teach them important lessons about money, and
              hopefully give them a helping hand when they’re older. It’s also a
              good way of keeping safe any birthday and Christmas money they
              might get.
            </Paragraph>
            <Paragraph className="text-lg">
              Find out more:{' '}
              <Link
                href="https://www.moneyhelper.org.uk/en/savings/types-of-savings/saving-for-your-children"
                target="_blank"
                asInlineText
              >
                Children's savings options
              </Link>
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Penblwydd hapus cyntaf! Bydd agor cyfrif cynilo ar gyfer eich
              plentyn yn werthfawr iddynt wrth ddysgu am arian, gyda’r gobaith o
              roi rhywfaint wrth gefn iddynt pan fyddant yn hŷn. Mae’n ffordd
              dda hefyd o gadw unrhyw arian penblwydd a’r Nadolig a gânt yn
              ddiogel.
            </Paragraph>
            <Paragraph className="text-lg">
              Cewch ragor o wybodaeth yn:{' '}
              <Link
                href="https://www.moneyhelper.org.uk/cy/savings/types-of-savings/saving-for-your-children"
                target="_blank"
                asInlineText
              >
                Cynilo ar gyfer eich plant
              </Link>
            </Paragraph>
          </>
        ),
      }),
    },
    {
      offset: 12,
      tab: 5,
      title: z({
        en: 'Get help with childcare costs',
        cy: 'Cael cymorth gyda chostau gofal plant',
      }),
      content: z({
        en: (
          <Paragraph className="text-lg">
            If you’re struggling with the cost of childcare, take some time to{' '}
            <Link
              href="https://www.moneyhelper.org.uk/en/family-and-care/becoming-a-parent/childcare-costs"
              target="_blank"
              asInlineText
            >
              compare alternatives
            </Link>{' '}
            then find out whether you could get any financial help from your
            employer or the government.
          </Paragraph>
        ),
        cy: (
          <Paragraph className="text-lg">
            Os ydych yn cael anawsterau gyda chost gofal plant, treuliwch amser
            yn {' '}
            <Link
              href="https://www.moneyhelper.org.uk/cy/family-and-care/becoming-a-parent/childcare-costs"
              target="_blank"
              asInlineText
            >
              {' '}
              cymharu gwahanol ddewisiadau{' '}
            </Link>{' '}
            ac yna canfod a allech chi gael unrhyw gymorth ariannol gan eich
            cyflogwr neu’r llywodraeth.
          </Paragraph>
        ),
      }),
    },
    {
      offset: 16,
      tab: 6,
      title: z({
        en: 'Take a debt health check',
        cy: 'Cwblhewch wiriad iechyd dyled',
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              If you’re beginning to struggle with loans and other debts, check
              these five warning signs and find out how to stop your debt
              getting out of control:
            </Paragraph>
            <Link
              href="https://www.moneyhelper.org.uk/en/money-troubles/dealing-with-debt/help-if-youre-struggling-with-debt"
              target="_blank"
              className="text-lg"
              asInlineText
            >
              Help if you’re struggling with debt
            </Link>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Os ydych yn cychwyn cael anawsterau gyda benthyciadau a dyledion,
              gwiriwch y pum rhybudd canlynol a dysgu sut i reoli eich
              dyledion: Gwiriad iechyd dyledion cyflym a hawdd
            </Paragraph>
            <Link
              href="https://www.moneyhelper.org.uk/cy/money-troubles/dealing-with-debt/help-if-youre-struggling-with-debt"
              target="_blank"
              className="text-lg"
              asInlineText
            >
              Gwiriad iechyd dyledion cyflym a hawdd
            </Link>
          </>
        ),
      }),
    },
    {
      offset: 20,
      tab: 6,
      title: z({
        en: 'Save money on bills and shopping',
        cy: 'Gallwch arbed arian ar filiau a siopa',
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              Don’t spend more than you need to on gas and electricity bills.
              You could save yourself over £200 a year on utilities by switching
              supplier:
            </Paragraph>
            <Link
              href="https://www.moneyhelper.org.uk/en/everyday-money/budgeting/save-money-on-your-gas-and-bills"
              target="_blank"
              className="text-lg"
              asInlineText
            >
              How to save money on household bills
            </Link>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Peidiwch â gwario mwy na sydd ei angen ar filiau nwy a thrydan.
              Gallech arbed dros £200 y flwyddyn ar gyfleustodau drwy ddewis
              cyflenwr arall:
            </Paragraph>
            <Link
              href="https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/save-money-on-your-gas-and-bills"
              target="_blank"
              className="text-lg"
              asInlineText
            >
              Sut i arbed arian ar filiau cartref
            </Link>
          </>
        ),
      }),
    },
    {
      offset: 24,
      tab: 6,
      title: z({
        en: 'Save for the future – make the most of your ISA allowance',
        cy: 'Cynilo ar gyfer y dyfodol – gwnewch y mwyaf o’ch lwfans ISA',
      }),
      content: z({
        en: (
          <>
            <Paragraph className="text-lg">
              Whatever you’re saving for, putting your savings into an ISA means
              you pay no tax on your interest.
            </Paragraph>
            <Paragraph className="text-lg">
              Here’s everything you need to know:{' '}
              <Link
                href="https://www.moneyhelper.org.uk/en/savings/types-of-savings/cash-isas"
                target="_blank"
                asInlineText
              >
                Action plan - Get the most out of your Cash ISA
              </Link>
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph className="text-lg">
              Waeth beth yw eich rheswm dros gynilo, wrth roi eich cynilion mewn
              ISA ni fyddwch yn talu treth ar eich llog.
            </Paragraph>
            <Paragraph className="text-lg">
              Dyma bopeth sydd angen i chi ei wybod:{' '}
              <Link
                href="https://www.moneyhelper.org.uk/cy/savings/types-of-savings/cash-isas"
                target="_blank"
                asInlineText
              >
                Cynllun gweithredu - Gwneud y mwyaf o’ch ISA Arian Parod
              </Link>
            </Paragraph>
          </>
        ),
      }),
    },
  ];
};

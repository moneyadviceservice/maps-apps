import { GroupType, StepPageData } from '@maps-react/pension-tools/types/forms';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { UrgentCallout } from '@maps-react/common/components/UrgentCallout';
import { useTranslation } from '@maps-react/hooks/useTranslation';

const householdGroups = {
  'essential-costs': (z: ReturnType<typeof useTranslation>['z']) => ({
    label: z({
      en: 'Essential bills and debt',
      cy: 'Biliau hanfodol a dyledion',
    }),
    key: 'e-costs',
    type: GroupType.HEADING,
  }),
  'travel-living-costs': (z: ReturnType<typeof useTranslation>['z']) => ({
    label: z({
      en: 'Travel and living costs',
      cy: 'Costau teithio a byw',
    }),
    text: z({
      en: "Your lifestyle costs shouldn't change when you get a mortgage, but lenders will want to 'stress test' if you can afford your payments should interest rates rise or your circumstances change.",
      cy: "Ni ddylai'ch costau ffordd o fyw newid pan gewch forgais, ond bydd benthycwyr eisiau cyflawni 'prawf straen' i weld a allwch chi fforddio'ch taliadau os bydd cyfraddau llog yn codi neu os bydd eich amgylchiadau'n newid.",
    }),
    key: 't-costs',
    type: GroupType.HEADING,
  }),
};

export enum IncomeFieldKeys {
  ANNUAL_INCOME = 'annual-income',
  TAKE_HOME = 'take-home',
  OTHER_INCOME = 'other-income',
  SECOND_APPLICANT = 'second-applicant',
  SEC_ANNUAL_INCOME = 'sec-app-annual-income',
  SEC_TAKE_HOME = 'sec-app-take-home',
  SEC_OTHER_INCOME = 'sec-app-other-income',
}

export enum ExpenseFieldKeys {
  CARD_AND_LOAN = 'card-and-loan',
  CHILD_SPOUSAL = 'child-spousal',
  CARE_SCHOOL = 'care-school',
  TRAVEL = 'travel',
  BILLS_INSURANCE = 'bills-insurance',
  RENT_MORTGAGE = 'rent-mortgage',
  LEISURE = 'leisure',
  HOLIDAYS = 'holidays',
  GROCERIES = 'groceries',
}

export enum OtherFieldKeys {
  SECOND_APPLICANT = 'second-applicant',
}

export const stepContent = (
  z: ReturnType<typeof useTranslation>['z'],
): StepPageData => {
  return {
    toolHeading: z({
      en: 'Mortgage affordability calculator',
      cy: 'Cyfrifiannell fforddiadwyedd morgais',
    }),
    steps: [
      {
        key: 'annual-income',
        heading: z({
          en: 'Annual income',
          cy: 'Incwm blynyddol',
        }),
        content: z({
          en: (
            <Paragraph className="mb-6 text-gray-800 text-base lg:text-2xl font-medium lg:font-normal">
              Use your income to work out how much you could borrow and what you
              can comfortably repay each month - so you only borrow what works
              for your budget.
            </Paragraph>
          ),
          cy: (
            <Paragraph className="mb-6 text-gray-800 text-base lg:text-2xl font-medium lg:font-normal">
              Defnyddiwch eich incwm i gyfrifo faint y gallech ei fenthyca a
              faint y gallwch ei ad-dalu&apos;n gyfforddus bob mis - fel mai dim
              ond yr hyn sy&apos;n gweddu i&apos;ch cyllideb rydych chi&apos;n
              ei fenthyca.
            </Paragraph>
          ),
        }),
        buttonText: z({
          en: 'Continue',
          cy: 'Parhau',
        }),
        fields: [
          {
            key: IncomeFieldKeys.ANNUAL_INCOME,
            label: z({
              en: 'What do you earn each year before tax?',
              cy: "Faint ydych chi'n ei ennill bob blwyddyn cyn treth?",
            }),
            description: z({
              en: 'Enter your annual salary.',
              cy: 'Rhowch eich cyflog blynyddol.',
            }),
            expandableContent: {
              title: z({
                en: 'Why do we need this?',
                cy: 'Pam mae angen hyn arnom?',
              }),
              text: z({
                en: 'We use your annual salary to work out what you could borrow for a mortgage.',
                cy: 'Rydym yn defnyddio eich cyflog blynyddol i gyfrifo faint y gallech ei fenthyca ar gyfer morgais.',
              }),
            },
            acdlLabel: 'What do you earn each year before tax?',
            type: 'input-currency',
            addon: z({
              en: 'per year',
              cy: 'y flwyddyn',
            }),
            placeholder: '0.00',
            validation: {
              required: true,
              requiredInputMessage: z({
                en: 'Please enter your annual income or salary before tax. This field cannot be blank as lenders will only approve loans to borrowers who can afford to make repayments.',
                cy: 'Rhowch eich incwm neu gyflog blynyddol cyn treth. Ni all y maes hwn fod yn wag gan y bydd benthycwyr ond yn cymeradwyo benthyciadau i fenthycwyr a all fforddio gwneud ad-daliadau.',
              }),
              requiredPageMessage: z({
                en: 'Please enter your annual income or salary before tax.',
                cy: 'Rhowch eich incwm neu gyflog blynyddol cyn treth.',
              }),
              acdlMessage:
                'Please enter your annual income or salary before tax.',
              rules: [
                {
                  condition: '>=',
                  otherField: 'take-home',
                  otherFieldMultiplier: 12,
                },
              ],
            },
          },
          {
            key: IncomeFieldKeys.TAKE_HOME,
            label: z({
              en: 'What is your monthly take-home pay?',
              cy: 'Beth yw eich cyflog misol ar ôl treth?',
            }),
            acdlLabel: 'What is your monthly take-home pay?',
            description: z({
              en: 'Enter what you get paid each month after tax and deductions.',
              cy: 'Rhowch y swm a gewch eich talu bob mis ar ôl treth a didyniadau.',
            }),
            expandableContent: {
              title: z({
                en: 'Why do we need this?',
                cy: 'Pam mae angen hyn arnom?',
              }),
              text: z({
                en: (
                  <>
                    We use your take-home pay to work out your budget and what
                    you could comfortably afford to repay each month. Not sure?
                    Use our{' '}
                    <Link
                      href="https://www.moneyhelper.org.uk/en/work/employment/salary-calculator"
                      className="underline text-blue-700 hover:text-blue-600"
                      target="_blank"
                    >
                      Salary calculator
                    </Link>
                  </>
                ),
                cy: (
                  <>
                    Rydym yn defnyddio eich cyflog net i gyfrifo eich cyllideb a
                    faint y gallwch ei ad-dalu&apos;n gyfforddus bob mis. Ddim
                    yn siŵr? Defnyddiwch ein{' '}
                    <Link
                      href="https://www.moneyhelper.org.uk/cy/work/employment/salary-calculator"
                      className="underline text-blue-700 hover:text-blue-600"
                      target="_blank"
                    >
                      cyfrifiannell Cyflog
                    </Link>
                    .
                  </>
                ),
              }),
            },
            type: 'input-currency',
            addon: z({
              en: 'per month',
              cy: 'y mis',
            }),
            placeholder: '0.00',
            validation: {
              required: true,
              requiredInputMessage: z({
                en: 'Please enter your monthly take-home pay. This field cannot be blank as lenders will only approve loans to borrowers who can afford to make monthly loan repayments.',
                cy: 'Rhowch eich cyflog cartref misol. Ni all y maes hwn fod yn wag gan y bydd benthycwyr ond yn cymeradwyo benthyciadau i fenthycwyr a all fforddio gwneud ad-daliadau benthyciad misol.',
              }),
              requiredPageMessage: z({
                en: 'Please enter your monthly take-home pay.',
                cy: 'Rhowch eich cyflog cartref misol.',
              }),
              acdlMessage: 'Please enter your monthly take-home pay.',
              rules: [
                {
                  condition: '<=',
                  otherField: 'annual-income',
                  multiplier: 12,
                  rulePageMessage: z({
                    en: 'Your monthly take-home pay is higher than your annual income.',
                    cy: "Mae eich cyflog clir misol yn uwch na'ch incwm blynyddol.",
                  }),
                  acdlMessage:
                    'Your monthly take-home pay is higher than your annual income.',
                },
              ],
            },
          },
          {
            key: IncomeFieldKeys.OTHER_INCOME,
            label: z({
              en: 'Do you have any other income? (Optional)',
              cy: 'Oes gennych chi unrhyw incwm arall? (Dewisol)',
            }),
            type: 'input-currency',
            addon: z({
              en: 'per year',
              cy: 'y flwyddyn',
            }),
            description: z({
              en: 'Enter any other money you receive each month.',
              cy: "Rhowch unrhyw arian arall rydych chi'n ei dderbyn bob mis.",
            }),
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'What should I include?',
                cy: 'Beth ddylwn i ei gynnwys?',
              }),
              text: z({
                en: 'Include income from other jobs, guaranteed bonus, regular overtime, pensions, rental, car allowance, maintenance payments etc.',
                cy: 'Cynhwyswch incwm o swyddi eraill, bonws gwarantedig, oriau ychwanegol rheolaidd, pensiynau, rhent, lwfans car, taliadau cynhaliaeth ac ati.',
              }),
            },
          },
          {
            key: OtherFieldKeys.SECOND_APPLICANT,
            heading: z({
              en: 'Is there a second applicant?',
              cy: 'A oes ail ymgeisydd?',
            }),
            headingLevel: 'h2',
            type: 'radio',
            options: [
              { text: z({ en: 'Yes', cy: 'Ie' }), value: 'yes' },
              { text: z({ en: 'No', cy: 'Na' }), value: 'no' },
            ],
            defaultRadioValue: 'no',
            topMargin: true,
          },
          {
            key: IncomeFieldKeys.SEC_ANNUAL_INCOME,
            label: z({
              en: 'What do they earn each year before tax?',
              cy: "Faint maen nhw'n ei ennill bob blwyddyn cyn treth?",
            }),
            acdlLabel: 'What do they earn each year before tax?',
            type: 'input-currency',
            addon: z({
              en: 'per year',
              cy: 'y flwyddyn',
            }),
            placeholder: '0.00',
            fieldCondition: {
              field: OtherFieldKeys.SECOND_APPLICANT,
              value: 'yes',
              rule: '=',
            },
            description: z({
              en: 'Enter their annual salary or income.',
              cy: 'Rhowch eu cyflog neu eu hincwm blynyddol.',
            }),
            expandableContent: {
              title: z({
                en: 'Why do we need this?',
                cy: 'Pam mae angen hyn arnom?',
              }),
              text: z({
                en: 'We use your annual salary to work out what you could borrow for a mortgage.',
                cy: 'Rydym yn defnyddio eich cyflog blynyddol i gyfrifo faint y gallech ei fenthyca ar gyfer morgais.',
              }),
            },
            validation: {
              required: true,
              requiredInputMessage: z({
                en: "Please enter the second applicant's annual income or salary before tax. This field cannot be blank as lenders will only approve loans to borrowers who can afford to make monthly loan repayments.",
                cy: 'Rhowch incwm neu gyflog blynyddol yr ail ymgeisydd cyn treth. Ni all y maes hwn fod yn wag gan y bydd benthycwyr ond yn cymeradwyo benthyciadau i fenthycwyr a all fforddio gwneud ad-daliadau benthyciad misol.',
              }),
              requiredPageMessage: z({
                en: "Please enter the second applicant's annual income or salary before tax.",
                cy: 'Rhowch incwm neu gyflog blynyddol yr ail ymgeisydd cyn treth.',
              }),
              acdlMessage:
                "Please enter the second applicant's annual income or salary before tax.",
              rules: [
                {
                  condition: '>=',
                  otherField: IncomeFieldKeys.SEC_TAKE_HOME,
                  otherFieldMultiplier: 12,
                },
              ],
            },
          },
          {
            key: IncomeFieldKeys.SEC_TAKE_HOME,
            label: z({
              en: 'What is their monthly take-home pay?',
              cy: 'Beth yw eu cyflog misol ar ôl treth?',
            }),
            acdlLabel: 'What is their monthly take-home pay?',
            description: z({
              en: 'Enter what they get paid each month after tax and deductions.',
              cy: "Rhowch y swm maen nhw'n ei dderbyn bob mis ar ôl treth a didyniadau.",
            }),
            type: 'input-currency',
            addon: z({
              en: 'per month',
              cy: 'y mis',
            }),
            placeholder: '0.00',
            fieldCondition: {
              field: OtherFieldKeys.SECOND_APPLICANT,
              value: 'yes',
              rule: '=',
            },
            expandableContent: {
              title: z({
                en: 'Why do we need this?',
                cy: 'Pam mae angen hyn arnom?',
              }),
              text: z({
                en: 'We use your take-home pay to work out your budget and what you could comfortably afford to repay each month. Not sure? Use our Salary calculator.',
                cy: 'Rydym yn defnyddio eich cyflog clir i gyfrifo eich cyllideb a faint y gallech fforddio ei ad-dalu bob mis. Ddim yn siŵr? Defnyddiwch ein cyfrifiannell cyflog.',
              }),
            },
            validation: {
              required: true,
              requiredInputMessage: z({
                en: "Please enter the second applicant's monthly take-home pay. This field cannot be blank as lenders will only approve loans to borrowers who can afford to make monthly loan repayments.",
                cy: 'Rhowch gyflog cymryd adref misol yr ail ymgeisydd. Ni all y maes hwn fod yn wag gan fydd darparwyr benthyciadau ond yn cymeradwyo benthyciadau i fenthycwyr a all fforddio gwneud ad-daliadau benthyciad misol.',
              }),
              requiredPageMessage: z({
                en: "Please enter the secondary applicant's monthly take-home pay.",
                cy: 'Rhowch gyflog cymryd adref misol yr ail ymgeisydd.',
              }),
              acdlMessage:
                "Please enter the secondary applicant's monthly take-home pay.",
              rules: [
                {
                  condition: '<=',
                  otherField: IncomeFieldKeys.SEC_ANNUAL_INCOME,
                  multiplier: 12,
                  rulePageMessage: z({
                    en: "The second applicant's monthly take-home pay is higher than their annual income.",
                    cy: "Mae eich cyflog clir misol yn uwch na'ch incwm blynyddol.",
                  }),
                  acdlMessage:
                    "The second applicant's monthly take-home pay is higher than their annual income.",
                },
              ],
            },
          },
          {
            key: IncomeFieldKeys.SEC_OTHER_INCOME,
            label: z({
              en: 'Do they have any other income? (Optional)',
              cy: 'Oes ganddyn nhw unrhyw incwm arall? (Dewisol)',
            }),
            description: z({
              en: 'Enter any other money they receive each month.',
              cy: "Rhowch unrhyw arian arall maen nhw'n ei dderbyn bob mis.",
            }),
            type: 'input-currency',
            addon: z({
              en: 'per year',
              cy: 'y flwyddyn',
            }),
            placeholder: '0.00',
            fieldCondition: {
              field: OtherFieldKeys.SECOND_APPLICANT,
              value: 'yes',
              rule: '=',
            },
            expandableContent: {
              title: z({
                en: 'What should I include?',
                cy: 'Beth ddylwn i ei gynnwys?',
              }),
              text: z({
                en: 'Include income from other jobs, guaranteed bonus, regular overtime, pensions, rental, car allowance, maintenance payments etc.',
                cy: 'Cynnwyswch incwm o swyddi eraill, bonws wedi ei warantu, goramser rheolaidd, pensiynau, rhent, lwfans car, taliadau cynhaliaeth ac ati.',
              }),
            },
          },
        ],
      },
      // Household costs
      {
        key: 'household-costs',
        heading: z({
          en: 'Monthly household costs',
          cy: 'Costau misol y cartref',
        }),
        buttonText: z({
          en: 'Find out how much you can borrow',
          cy: 'Gwiriwch faint allwch chi ei fenthyg',
        }),
        content: z({
          en: (
            <>
              <Paragraph className="mb-6">
                Use your regular spending to work out your monthly budget. If
                you&apos;re not sure about costs for your future home, use an
                estimate.
              </Paragraph>
              <UrgentCallout
                variant="warning"
                className="mb-6 border-0 p-0 sm:p-0"
                testId="applying-with-someone-note"
              >
                <Paragraph className="mb-0 font-bold">
                  If you&apos;re applying with someone else, add your costs
                  together. You can leave any sections blank that don&apos;t
                  apply to you.
                </Paragraph>
              </UrgentCallout>
            </>
          ),
          cy: (
            <>
              <Paragraph className="mb-6">
                Defnyddiwch eich gwariant arferol i gyfrifo eich cyllideb fisol.
                Os nad ydych yn siŵr am y costau ar gyfer eich cartref yn y
                dyfodol, defnyddiwch amcangyfrif.
              </Paragraph>
              <UrgentCallout
                variant="warning"
                className="mb-6 border-0 p-0 sm:p-0"
                testId="applying-with-someone-note"
              >
                <Paragraph className="mb-0 font-bold">
                  Os ydych chi&apos;n gwneud cais gyda rhywun arall, cyfunwch
                  eich costau. Gallwch adael unrhyw adrannau sydd ddim yn
                  berthnasol i chi yn wag.
                </Paragraph>
              </UrgentCallout>
            </>
          ),
        }),
        fields: [
          // Essential bills and debt
          {
            key: ExpenseFieldKeys.RENT_MORTGAGE,
            label: z({
              en: 'Rent or current mortgage',
              cy: 'Rhent neu forgeis cyfredol',
            }),
            type: 'input-currency',
            addon: z({
              en: 'per month',
              cy: 'y mis',
            }),
            placeholder: '0.00',
            group: householdGroups['essential-costs'](z),
            expandableContent: {
              title: z({
                en: 'What do I need to include here?',
                cy: 'Beth sydd angen i mi ei gynnwys yma?',
              }),
              text: z({
                en: "This won't be included in the calculation, but you might want to include it to see the difference between your current rent or mortgage payments and the new payments you'll be making.",
                cy: "Ni fydd hyn wedi ei gynnwys yn y cyfrifiad, ond efallai yr hoffech ei gynnwys i weld y gwahaniaeth rhwng eich taliadau rhent neu forgais presennol a'r taliadau newydd y byddwch yn eu gwneud.",
              }),
            },
          },
          {
            key: ExpenseFieldKeys.CARD_AND_LOAN,
            label: z({
              en: 'Credit cards and loans',
              cy: 'Cardiau credyd a benthyciadau',
            }),
            type: 'input-currency',
            addon: z({
              en: 'per month',
              cy: 'y mis',
            }),
            placeholder: '0.00',
            group: householdGroups['essential-costs'](z),
            expandableContent: {
              title: z({
                en: 'Which payments should I include?',
                cy: 'Pa daliadau ddylwn i eu cynnwys?',
              }),
              text: z({
                en: (
                  <>
                    <Paragraph className="mb-6">
                      <span className="font-bold">Include:</span> Credit card,
                      store card and catalogue debts; car finance and personal
                      loans; student loans; and hire purchase commitments.
                    </Paragraph>
                    <Paragraph className="mb-6">
                      <span className="font-bold">Exclude:</span> Day-to-day
                      living costs (e.g. food, clothes, entertainment and
                      holidays); fixed spending (e.g. subscriptions to gyms or
                      other memberships; utility bills; mobile phones;
                      broadband; council tax; childcare or school fees).
                    </Paragraph>
                  </>
                ),
                cy: (
                  <>
                    <Paragraph className="mb-6">
                      <span className="font-bold">Dylid cynnwys:</span> Dyledion
                      cerdyn credyd, cerdyn siop a chatalog; benthyciadau car a
                      phersonol, benthyciadau myfyrwyr; ac ymroddiadau
                      hurbwrcasu.
                    </Paragraph>
                    <Paragraph className="mb-6">
                      <span className="font-bold">Ni ddylid cynnwys:</span>{' '}
                      Costau byw o ddydd i ddydd (e.e. bwyd, dillad, adloniant a
                      gwyliau); gwariant sefydlog (e.e. tanysgrifiadau i
                      gampfeydd neu daliadau aelodaeth eraill; biliau
                      gwasanaethau; ffonau symudol; band eang; y dreth gyngor;
                      ffioedd gofal plant neu ysgol).
                    </Paragraph>
                  </>
                ),
              }),
            },
          },
          {
            key: ExpenseFieldKeys.CHILD_SPOUSAL,
            label: z({
              en: 'Child and spousal maintenance',
              cy: 'Cynhaliaeth plant a chymar',
            }),
            type: 'input-currency',
            addon: z({
              en: 'per month',
              cy: 'y mis',
            }),
            placeholder: '0.00',
            group: householdGroups['essential-costs'](z),
            expandableContent: {
              title: z({
                en: 'Which payments should I include?',
                cy: 'Pa daliadau ddylwn i eu cynnwys?',
              }),
              text: z({
                en: 'Payment towards the support and maintenance of children, or maintenance of an ex-partner.',
                cy: 'Taliadau tuag at gefnogi a chynhaliaeth plant, neu gynhaliaeth cyn bartner.',
              }),
            },
          },
          {
            key: ExpenseFieldKeys.CARE_SCHOOL,
            label: z({
              en: 'Childcare and school fees',
              cy: 'Ffioedd gofal plant ac ysgol',
            }),
            type: 'input-currency',
            addon: z({
              en: 'per month',
              cy: 'y mis',
            }),
            placeholder: '0.00',
            group: householdGroups['essential-costs'](z),
            expandableContent: {
              title: z({
                en: 'Which costs should I include?',
                cy: 'Pa gostau ddylwn i eu cynnwys?',
              }),
              text: z({
                en: (
                  <Paragraph className="mb-6">
                    <span className="font-bold">Include:</span> Nursery and
                    childcare fees, breakfast clubs, childminder,
                    extracurricular classes etc.
                  </Paragraph>
                ),
                cy: (
                  <Paragraph className="mb-6">
                    <span className="font-bold">Dylid cynnwys:</span> Ffioedd
                    meithrinfa a gofal plant, gwarchodwr plant, clybiau
                    brecwast, dosbarthiadau allgyrsiol ac ati.
                  </Paragraph>
                ),
              }),
            },
          },
          // Travel and living costs
          {
            key: ExpenseFieldKeys.TRAVEL,
            label: z({
              en: 'Travel (commuting, fuel, insurance)',
              cy: 'Teithio (cymudo, tanwydd, yswiriant)',
            }),
            type: 'input-currency',
            addon: z({
              en: 'per month',
              cy: 'y mis',
            }),
            placeholder: '0.00',
            group: householdGroups['travel-living-costs'](z),
            expandableContent: {
              title: z({
                en: 'Which costs count?',
                cy: "Pa gostau sy'n cyfrif?",
              }),
              text: z({
                en: (
                  <>
                    <Paragraph className="mb-6">
                      <span className="font-bold">Include:</span> Fuel, public
                      transport, regular rail and air fares.
                    </Paragraph>
                    <Paragraph className="mb-6">
                      <span className="font-bold">Exclude:</span> Expenses
                      related to holidays and weekends away.
                    </Paragraph>
                  </>
                ),
                cy: (
                  <>
                    <Paragraph className="mb-6">
                      <span className="font-bold">Dylid cynnwys:</span> Tanwydd,
                      cludiant cyhoeddus, tocynnau trên a hedfan rheolaidd.
                    </Paragraph>
                    <Paragraph className="mb-6">
                      <span className="font-bold">Ni ddylid cynnwys:</span>{' '}
                      Gwyliau a phenwythnosau i ffwrdd
                    </Paragraph>
                  </>
                ),
              }),
            },
          },
          {
            key: ExpenseFieldKeys.BILLS_INSURANCE,
            label: z({
              en: 'Household bills (utilities, council tax, phone)',
              cy: 'Biliau cartref (cyfleustodau, treth gyngor, ffôn)',
            }),
            type: 'input-currency',
            addon: z({
              en: 'per month',
              cy: 'y mis',
            }),
            placeholder: '0.00',
            group: householdGroups['travel-living-costs'](z),
            expandableContent: {
              title: z({
                en: 'Which bills to include?',
                cy: "Pa filiau i'w cynnwys?",
              }),
              text: z({
                en: (
                  <Paragraph className="mb-6">
                    <span className="font-bold">Include:</span> Council Tax, gym
                    memberships, utility bills, mobile phones, annual insurance
                    (such as contents, car, pet, travel), magazine
                    subscriptions, broadband, roadside recovery etc.
                  </Paragraph>
                ),
                cy: (
                  <Paragraph className="mb-6">
                    <span className="font-bold">Dylid cynnwys:</span> Y Dreth
                    Gyngor, aelodaeth o gampfa, biliau gwasanaethau; ffonau
                    symudol; yswiriant blynyddol (megis cynnwys, car,
                    anifeiliaid anwes, teithio), tanysgrifiadau cylchgronau,
                    band eang, adferiad ochr y ffordd ac ati.
                  </Paragraph>
                ),
              }),
            },
          },
          {
            key: ExpenseFieldKeys.GROCERIES,
            label: z({
              en: 'Food and essentials',
              cy: 'Bwyd a hanfodion',
            }),
            type: 'input-currency',
            addon: z({
              en: 'per month',
              cy: 'y mis',
            }),
            placeholder: '0.00',
            group: householdGroups['travel-living-costs'](z),
            expandableContent: {
              title: z({
                en: 'Expenses to include?',
                cy: "Costau i'w cynnwys?",
              }),
              text: z({
                en: (
                  <Paragraph className="mb-6">
                    <span className="font-bold">Include:</span> Weekly shop,
                    daily lunches, toiletries etc.
                  </Paragraph>
                ),
                cy: (
                  <Paragraph className="mb-6">
                    <span className="font-bold">Dylid cynnwys:</span> Siopa
                    wythnosol, cinio dyddiol, taclau ymolch ac ati.
                  </Paragraph>
                ),
              }),
            },
          },
          {
            key: ExpenseFieldKeys.LEISURE,
            label: z({
              en: 'Entertainment and leisure',
              cy: 'Adloniant a hamdden',
            }),
            description: z({
              en: 'Add up what you spend in a year and divide by 12',
              cy: "Cyfrifwch gyfanswm eich gwariant dros flwyddyn a'i rannu â 12.",
            }),
            type: 'input-currency',
            addon: z({
              en: 'per month',
              cy: 'y mis',
            }),
            placeholder: '0.00',
            group: householdGroups['travel-living-costs'](z),
            expandableContent: {
              title: z({
                en: 'Expenses to include?',
                cy: "Costau i'w cynnwys?",
              }),
              text: z({
                en: (
                  <Paragraph className="mb-6">
                    <span className="font-bold">Include:</span> Eating out,
                    clothing, daily coffees/teas, theatre, museums, evenings
                    out, family days out, personal grooming etc.
                  </Paragraph>
                ),
                cy: (
                  <Paragraph className="mb-6">
                    <span className="font-bold">Dylid cynnwys:</span> Bwyta
                    allan, dillad, coffi/te dyddiol, theatr, amgueddfeydd,
                    nosweithiau allan, dyddiau allan i&apos;r teulu, torri
                    gwallt ac ati.
                  </Paragraph>
                ),
              }),
            },
          },
          {
            key: ExpenseFieldKeys.HOLIDAYS,
            label: z({
              en: 'Holidays',
              cy: 'Gwyliau',
            }),
            description: z({
              en: 'Add up what you spend in a year and divide by 12',
              cy: "Cyfrifwch gyfanswm eich gwariant dros flwyddyn a'i rannu â 12.",
            }),
            type: 'input-currency',
            addon: z({
              en: 'per month',
              cy: 'y mis',
            }),
            placeholder: '0.00',
            group: householdGroups['travel-living-costs'](z),
            expandableContent: {
              title: z({
                en: 'Expenses to include?',
                cy: "Costau i'w cynnwys?",
              }),
              text: z({
                en: (
                  <>
                    <Paragraph className="mb-6">
                      Think about how much you typically spend on holidays or
                      weekends away per year, and{' '}
                      <span className="font-bold">divide that by 12.</span>
                    </Paragraph>
                    <Paragraph className="mb-6">
                      <span className="font-bold">Exclude:</span> Travel
                      insurance or travel for work.
                    </Paragraph>
                  </>
                ),
                cy: (
                  <>
                    <Paragraph className="mb-6">
                      Meddyliwch am faint ydych chi fel arfer yn ei wario ar
                      wyliau neu benwythnosau i ffwrdd y flwyddyn, a{' '}
                      <span className="font-bold">rhannu hynny gyda 12.</span>
                    </Paragraph>
                    <Paragraph className="mb-6">
                      <span className="font-bold">Ni ddylid cynnwys:</span>{' '}
                      Yswiriant teithio neu deithio ar gyfer y gwaith.
                    </Paragraph>
                  </>
                ),
              }),
            },
          },
        ],
      },
    ],
  };
};

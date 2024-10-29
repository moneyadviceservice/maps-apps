import { useTranslation } from '@maps-react/hooks/useTranslation';
import { StepPageData, GroupType } from 'data/types';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Heading } from '@maps-react/common/components/Heading';

const householdGroups = {
  'committed-costs': (z: ReturnType<typeof useTranslation>['z']) => ({
    label: z({
      en: 'Estimated monthly committed costs',
      cy: 'Amcangyfrif o gostau misol ymroddedig',
    }),
    key: 'c-costs',
    type: GroupType.HEADING,
  }),
  'fixed-costs': (z: ReturnType<typeof useTranslation>['z']) => ({
    label: z({
      en: 'Estimated monthly fixed costs',
      cy: 'Amcangyfrif o gostau sefydlog misol',
    }),
    key: 'f-costs',
    type: GroupType.HEADING,
  }),
  'living-costs': (z: ReturnType<typeof useTranslation>['z']) => ({
    label: z({
      en: 'Estimated monthly living costs',
      cy: 'Amcangyfrif o gostau byw misol',
    }),
    text: z({
      en: "Your lifestyle costs shouldn't change when you get a mortgage, but lenders will want to 'stress test' if you can afford your payments should interest rates rise or your circumstances change.",
      cy: "Ni ddylai'ch costau ffordd o fyw newid pan gewch forgais, ond bydd benthycwyr eisiau cyflawni 'prawf straen' i weld a allwch chi fforddio'ch taliadau os bydd cyfraddau llog yn codi neu os bydd eich amgylchiadau'n newid.",
    }),
    key: 'l-costs',
    type: GroupType.HEADING,
  }),
};

export enum IncomeFieldKeys {
  ANNUAL_INCOME = 'annual-income',
  TAKE_HOME = 'take-home',
  OTHER_INCOME = 'other-income',
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
          en: 'How much can you borrow?',
          cy: 'Faint allwch chi ei fenthyg?',
        }),
        content: z({
          en: (
            <>
              <Paragraph className="mb-6">
                This tool will help you estimate how much you can afford to
                borrow to buy a home. We&apos;ll work it out by looking at your
                income and your outgoings. Mortgage lenders will look at these
                figures very closely to work out how much they&apos;ll offer
                you.
              </Paragraph>
              <Paragraph className="mb-6">
                It should take about five minutes to complete.
              </Paragraph>
              <Heading level="h2" className="text-blue-800 mb-8">
                Annual Income
              </Heading>
            </>
          ),
          cy: (
            <>
              <Paragraph className="mb-6">
                Bydd yr offeryn hwn yn eich helpu i amcangyfrif faint y gallwch
                fforddio ei fenthyg i brynu cartref. Byddwn yn ei gyfrifo trwy
                edrych ar eich incwm a&apos;ch gwariant. Bydd benthycwyr
                morgeisi yn edrych yn agos ar y ffigurau hyn i gyfrifo faint
                fyddant yn ei gynnig i chi.
              </Paragraph>
              <Paragraph className="mb-6">
                Ni ddylai gymryd mwy na pum munud i&apos;w lenwi.
              </Paragraph>
              <Heading level="h2" className="text-blue-800 mb-8">
                Incwm Blynyddol
              </Heading>
            </>
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
              en: 'What is your annual income or salary before tax?',
              cy: 'Beth yw eich incwm neu gyflog blynyddol cyn talu treth?',
            }),
            acdlLabel: 'What is your annual income or salary before tax?',
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
              cy: 'Beth yw eich cyflog clir misol?',
            }),
            acdlLabel: 'What is your monthly take-home pay?',
            description: z({
              en: 'This is your monthly income after tax, minus pension, NI and other deductions.',
              cy: 'Dyma yw eich incwm misol ar ôl treth, meinws pensiwn, Yswiriant Gwladol, a didyniadau eraill',
            }),
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
              cy: 'A oes gennych chi unrhyw incwm arall? (Dewisol)',
            }),
            type: 'input-currency',
            addon: z({
              en: 'per year',
              cy: 'y flwyddyn',
            }),
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'What counts as income?',
                cy: "Beth sy'n cyfrif fel incwm?",
              }),
              text: z({
                en: 'Include income from other jobs, pension income, guaranteed bonus, regular overtime, other employment, rental income, maintenance payments, pension, car allowance etc.',
                cy: 'ylid cynnwys incwm o swyddi eraill, incwm pensiwn, bonws wedi ei warantu, goramser rheolaidd, cyflogaeth arall, incwm rhent, taliadau cynhaliaeth, pensiwn, lwfans car ac ati.',
              }),
            },
          },
          {
            key: OtherFieldKeys.SECOND_APPLICANT,
            label: z({
              en: 'Is there a second applicant?',
              cy: 'A oes ail ymgeisydd?',
            }),
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
              en: "What is the second applicant's annual income or salary before tax?",
              cy: 'Beth yw incwm neu gyflog blynyddol yr ail ymgeisydd cyn tynnu treth?',
            }),
            acdlLabel:
              "What is the second applicant's annual income or salary before tax?",
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
              en: "What is the second applicant's monthly take-home pay?",
              cy: 'Beth yw cyflog yr ail ymgeisydd ar ôl tynnu treth?',
            }),
            acdlLabel: "What is the second applicant's monthly take-home pay?",
            description: z({
              en: 'This is their monthly income after tax, minus pension, NI and other deductions.',
              cy: 'Dyma yw ei incwm misol ar ôl treth, meinws pensiwn, Yswiriant Gwladol, a didyniadau eraill',
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
              en: 'Does the second applicant have any other income? (Optional)',
              cy: 'A oes gan yr ail ymgeisydd unrhyw incwm arall? (Dewisol)',
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
                en: 'What counts as income?',
                cy: "Beth sy'n cyfrif fel incwm?",
              }),
              text: z({
                en: 'Include income from other jobs, pension income, guaranteed bonus, regular overtime, other employment, rental income, maintenance payments, pension, car allowance etc.',
                cy: 'ylid cynnwys incwm o swyddi eraill, incwm pensiwn, bonws wedi ei warantu, goramser rheolaidd, cyflogaeth arall, incwm rhent, taliadau cynhaliaeth, pensiwn, lwfans car ac ati.',
              }),
            },
          },
        ],
      },
      // Household costs
      {
        key: 'household-costs',
        heading: z({
          en: 'Monthly household Costs',
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
                Use this section to get a basic idea of how your monthly budget
                adds up, and how affordable your monthly mortgage payments will
                be.
              </Paragraph>
              <Paragraph className="mb-6 font-bold">
                If you don&apos;t have any expenses in these sections right now,
                imagine what they are likely to be in your new home.
              </Paragraph>
              <Paragraph className="mb-6">
                If you&apos;re applying with someone else, add their monthly
                costs to yours and put them in the fields below.
              </Paragraph>
            </>
          ),
          cy: (
            <>
              <Paragraph className="mb-6">
                Defnyddiwch yr adran hon i gael syniad sylfaenol o sut
                mae&apos;ch cyllideb fisol yn cael ei chyfrifo, a pa mor
                fforddiadwy fydd eich taliadau morgais misol.
              </Paragraph>
              <Paragraph className="mb-6 font-bold">
                Os nad oes gennych unrhyw gostau yn yr adrannau hyn nawr,
                ystyriwch faint fydd hyn yn debygol o fod yn eich cartref
                newydd.
              </Paragraph>
              <Paragraph className="mb-6">
                Os ydych chi&apos;n gwneud cais gyda rhywun arall, ychwanegwch
                eu costau misol i&apos;ch rhai chi ac yna&apos;u rhoi yn y
                meysydd isod.
              </Paragraph>
            </>
          ),
        }),
        fields: [
          // Monthly committed
          {
            key: ExpenseFieldKeys.CARD_AND_LOAN,
            label: z({
              en: 'Credit card and loan payments',
              cy: 'Taliadau cerdyn credyd a benthyciadau',
            }),
            type: 'input-currency',
            addon: z({
              en: 'per month',
              cy: 'y mis',
            }),
            placeholder: '0.00',
            group: householdGroups['committed-costs'](z),
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
              en: 'Child and spousal maintenance payments',
              cy: 'Taliadau Cynhaliaeth plant a phriod',
            }),
            type: 'input-currency',
            addon: z({
              en: 'per month',
              cy: 'y mis',
            }),
            placeholder: '0.00',
            group: householdGroups['committed-costs'](z),
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
          // Monthly fixed
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
            group: householdGroups['fixed-costs'](z),
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
          {
            key: ExpenseFieldKeys.TRAVEL,
            label: z({
              en: 'Travel costs',
              cy: 'Costau teithio',
            }),
            type: 'input-currency',
            addon: z({
              en: 'per month',
              cy: 'y mis',
            }),
            placeholder: '0.00',
            group: householdGroups['fixed-costs'](z),
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
              en: 'Bills and insurance',
              cy: 'Biliau ac yswiriant',
            }),
            type: 'input-currency',
            addon: z({
              en: 'per month',
              cy: 'y mis',
            }),
            placeholder: '0.00',
            group: householdGroups['fixed-costs'](z),
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
            key: ExpenseFieldKeys.RENT_MORTGAGE,
            label: z({
              en: 'Current rent or mortgage payment',
              cy: 'Taliadau rhent neu forgais presennol',
            }),
            type: 'input-currency',
            addon: z({
              en: 'per month',
              cy: 'y mis',
            }),
            placeholder: '0.00',
            group: householdGroups['fixed-costs'](z),
            expandableContent: {
              title: z({
                en: 'Why do I need to include this?',
                cy: 'Pam fod angen i mi gynnwys hyn?',
              }),
              text: z({
                en: "This won't be included in the calculation, but you might want to include it to see the difference between your current rent or mortgage payments and the new payments you'll be making.",
                cy: "Ni fydd hyn wedi ei gynnwys yn y cyfrifiad, ond efallai yr hoffech ei gynnwys i weld y gwahaniaeth rhwng eich taliadau rhent neu forgais presennol a'r taliadau newydd y byddwch yn eu gwneud.",
              }),
            },
          },
          // Living costs
          {
            key: ExpenseFieldKeys.LEISURE,
            label: z({
              en: 'Entertainment and leisure',
              cy: 'Adloniant a hamdden',
            }),
            type: 'input-currency',
            addon: z({
              en: 'per month',
              cy: 'y mis',
            }),
            placeholder: '0.00',
            group: householdGroups['living-costs'](z),
            expandableContent: {
              title: z({
                en: 'Expenses to include',
                cy: "Treuliau i'w cynnwys",
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
              cy: 'Gwyliauy',
            }),
            type: 'input-currency',
            addon: z({
              en: 'per month',
              cy: 'y mis',
            }),
            placeholder: '0.00',
            group: householdGroups['living-costs'](z),
            expandableContent: {
              title: z({
                en: 'Expenses to include',
                cy: "Treuliau i'w cynnwys",
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
          {
            key: ExpenseFieldKeys.GROCERIES,
            label: z({
              en: 'Food, groceries and toiletries',
              cy: 'Bwyd, nwyddau a thaclau ymolchi',
            }),
            type: 'input-currency',
            addon: z({
              en: 'per month',
              cy: 'y mis',
            }),
            placeholder: '0.00',
            group: householdGroups['living-costs'](z),
            expandableContent: {
              title: z({
                en: 'Expenses to include',
                cy: "Treuliau i'w cynnwys",
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
        ],
      },
    ],
  };
};

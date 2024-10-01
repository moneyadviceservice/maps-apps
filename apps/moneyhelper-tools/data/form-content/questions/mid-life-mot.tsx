import { Link } from '@maps-digital/shared/ui';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Question } from 'types';

export const midLifeMotQuestions = (
  z: ReturnType<typeof useTranslation>['z'],
): Array<Question> => {
  return [
    {
      questionNbr: 1,
      group: 'screening',
      title: z({ en: 'How old are you?', cy: "Faint ydy'ch oed?" }),
      type: 'single',
      answers: [
        {
          text: z({ en: 'Under 45', cy: 'O dan 45' }),
          score: 0,
          clearAll: false,
        },
        {
          text: z({ en: '45 to 49', cy: '45 i 49' }),
          score: 0,
          clearAll: false,
        },
        {
          text: z({ en: '50 to 59', cy: '50 i 59' }),
          score: 0,
          clearAll: false,
        },
        {
          text: z({ en: '60 to 65', cy: '60 i 65' }),
          score: 0,
          clearAll: false,
        },
        {
          text: z({ en: 'Over 65', cy: 'Dros 65' }),
          score: 0,
          clearAll: false,
        },
      ],
    },
    {
      questionNbr: 2,
      group: 'screening',
      title: z({ en: 'Where do you live?', cy: " Ble ydych chi'n byw?" }),
      type: 'single',
      answers: [
        {
          text: z({ en: 'England', cy: 'Lloegr' }),
          score: 0,
          clearAll: false,
        },
        {
          text: z({ en: 'Northern Ireland', cy: 'Gogledd Iwerddon' }),
          score: 0,
          clearAll: false,
        },
        {
          text: z({ en: 'Scotland', cy: 'Yr Alban' }),
          score: 0,
          clearAll: false,
        },
        {
          text: z({ en: 'Wales', cy: 'Cymru' }),
          score: 0,
          clearAll: false,
        },
      ],
    },
    {
      questionNbr: 3,
      group: 'preventing-debts',
      title: z({
        en: 'How well are you keeping up with bills and credit repayments?',
        cy: "Pa mor dda ydych chi'n dal i fyny gyda'ch biliau a'ch ad-daliadau credyd?",
      }),
      type: 'single',
      answers: [
        {
          text: z({
            en: 'I’ve fallen behind on everything',
            cy: 'Rwyf ar ei hôl hi gyda phopeth',
          }),
          subtext: z({
            en: (
              <>
                We suggest prioritising your debts at this time. You can find
                free debt advice using our {''}
                <Link
                  asInlineText
                  target={'_blank'}
                  href={
                    'https://www.moneyhelper.org.uk/en/money-troubles/dealing-with-debt/debt-advice-locator'
                  }
                >
                  Debt Advice Locator.
                </Link>
              </>
            ),
            cy: (
              <>
                Rydym yn argymell eich bod yn blaenoriaethu&apos;ch dyledion ar
                hyn o bryd. Gallwch ddod o hyd i gyngor ar ddyledion am ddim gan
                ddefnyddio&apos;n{' '}
                <Link
                  asInlineText
                  target={'_blank'}
                  href="https://www.moneyhelper.org.uk/cy/money-troubles/dealing-with-debt/debt-advice-locator"
                >
                  Lleolwr Cyngor ar Ddyledion
                </Link>
              </>
            ),
          }),
          score: 1,
          clearAll: false,
          links: [
            {
              title: z({
                en: 'Debt Advice Locator',
                cy: 'Teclyn lleoli cyngor ar ddyledion',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/money-troubles/dealing-with-debt/debt-advice-locator',
                cy: 'https://www.moneyhelper.org.uk/cy/money-troubles/dealing-with-debt/debt-advice-locator',
              }),
              type: 'tool',
              description: z({
                en: 'can help you find free advice from trained specialists who can help you with debt.',
                cy: 'gall eich helpu i ddod o hyd i gyngor am ddim gan arbenigwyr hyfforddedig a all eich helpu gyda dyled.',
              }),
            },
          ],
        },
        {
          text: z({
            en: 'I’ve fallen behind on a few bills and/or repayments',
            cy: 'Rwyf ar ei hôl hi ar rai biliau a/neu ad-daliadau',
          }),
          score: 1,
          clearAll: false,
          links: [
            {
              title: z({
                en: 'Debt Advice Locator',
                cy: 'Teclyn lleoli cyngor ar ddyledion',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/money-troubles/dealing-with-debt/debt-advice-locator',
                cy: 'https://www.moneyhelper.org.uk/cy/money-troubles/dealing-with-debt/debt-advice-locator',
              }),
              type: 'tool',
              description: z({
                en: 'can help you find free advice from trained specialists who can help you with debt.',
                cy: 'gall eich helpu i ddod o hyd i gyngor am ddim gan arbenigwyr hyfforddedig a all eich helpu gyda dyled.',
              }),
            },
          ],
        },
        {
          text: z({
            en: 'I’m keeping up, but it’s a struggle',
            cy: "Rwy'n dal i fyny, ond mae'n anodd",
          }),
          score: 2,
          clearAll: false,
          links: [
            {
              title: z({
                en: 'Bill and payments prioritiser',
                cy: 'Blaenoriaethwr biliau a thaliadau',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/money-troubles/cost-of-living/bill-prioritiser',
                cy: 'https://www.moneyhelper.org.uk/cy/money-troubles/way-forward/bill-prioritiser',
              }),
              type: 'tool',
              description: z({
                en: 'can show you how to put your bills and payments in the right order, and offer guidance on how to avoid missing a payment.',
                cy: 'gall dangos i chi sut i roi eich biliau a thaliadau yn y drefn gywir, a chynnig arweiniad ar sut i osgoi colli taliad.',
              }),
            },
          ],
        },
        {
          text: z({
            en: "I'm keeping up with all my bills and repayments easily",
            cy: "Rwy'n dal i fyny gyda thaliadau'r holl filiau ac ad-daliadau'n hawdd",
          }),
          score: 2,
          clearAll: false,
          links: [
            {
              title: z({
                en: 'Bill and payments prioritiser',
                cy: 'Blaenoriaethwr biliau a thaliadau',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/money-troubles/cost-of-living/bill-prioritiser',
                cy: 'https://www.moneyhelper.org.uk/cy/money-troubles/way-forward/bill-prioritiser',
              }),
              type: 'article',
              description: z({
                en: 'can show you how to put your bills and payments in the right order, and offer guidance on how to avoid missing a payment.',
                cy: 'gall dangos i chi sut i roi eich biliau a thaliadau yn y drefn gywir, a chynnig arweiniad ar sut i osgoi colli taliad.',
              }),
            },
          ],
        },
        {
          text: z({
            en: 'I don’t have any bills or credit commitments',
            cy: 'Nid oes gennyf unrhyw filiau nac ymrwymiadau credyd',
          }),
          score: 3,
          clearAll: false,
        },
        {
          text: z({
            en: "I’m on a debt repayment plan and/or I'm trying to pay back my debts",
            cy: "Mae gennyf gynllun ad-dalu dyled a/neu rwy'n ceisio ad-dalu fy nyledion",
          }),
          score: 3,
          clearAll: false,
        },
        {
          text: z({ en: "I don't know", cy: 'Nid wyf yn gwybod' }),
          score: 2,
          clearAll: true,
          links: [
            {
              title: z({
                en: 'Bill and payments prioritiser',
                cy: 'Blaenoriaethwr biliau a thaliadau',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/money-troubles/cost-of-living/bill-prioritiser',
                cy: 'https://www.moneyhelper.org.uk/cy/money-troubles/way-forward/bill-prioritiser',
              }),
              type: 'article',
              description: z({
                en: 'can show you how to put your bills and payments in the right order, and offer guidance on how to avoid missing a payment.',
                cy: 'yn gallu dangos i chi sut i roi eich biliau a thaliadau yn y drefn gywir, a chynnig arweiniad ar sut i osgoi colli taliad.',
              }),
            },
          ],
        },
      ],
    },
    {
      questionNbr: 4,
      group: 'budgeting',
      title: z({
        en: 'What’s your approach to budgeting?',
        cy: "Sut ydych chi'n mynd ati i gyllidebu?",
      }),
      type: 'single',
      answers: [
        {
          text: z({
            en: 'I create a budget and stick to it',
            cy: "Rwy'n creu cyllideb ac yn cadw ati",
          }),
          score: 3,
          clearAll: false,
          links: [
            {
              title: z({
                en: 'Managing your money using the jam jar approach',
                cy: 'Rheoli eich arian gan ddefnyddio cronfeydd cynilo',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/managing-your-money-using-the-jam-jar-approach',
                cy: 'https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/managing-your-money-using-the-jam-jar-approach',
              }),
              type: 'article',
              description: z({
                en: 'will explain how dividing your money into separate pots helps you make sure your money goes where you want it to. ',
                cy: "yn esbonio sut mae rhannu'ch arian yn gronfeydd ar wahân yn eich helpu i sicrhau bod eich arian yn mynd lle rydych chi ei eisiau.",
              }),
            },
          ],
        },
        {
          text: z({
            en: 'I create a budget but struggle to stick to it ',
            cy: "Rwy'n creu cyllideb ond rwy'n ei chael yn anodd i gadw ati",
          }),
          score: 2,
          clearAll: false,
          links: [
            {
              title: z({ en: 'Budget planner', cy: 'Cynlluniwr Cyllideb' }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner',
                cy: 'https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/budget-planner',
              }),
              type: 'tool',
              description: z({
                en: "will help you keep track of your money by working out exactly how much you’ve got coming in and where it's being spent.",
                cy: 'yn eich helpu i gadw golwg ar eich arian drwy gyfrifo faint yn union sydd gennych yn dod i mewn a ble mae’n cael ei wario.',
              }),
            },
            {
              title: z({
                en: "Beginner's guide to managing your money",
                cy: 'Canllaw syml i reoli eich arian',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/beginners-guide-to-managing-your-money',
                cy: 'https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/beginners-guide-to-managing-your-money',
              }),
              type: 'article',
              description: z({
                en: 'will help you learn to budget so you can stay on top of bills and start saving.',
                cy: 'yn eich helpu i ddysgu sut i gyllidebu fel y gallwch aros ar ben eich biliau a dechrau cynilo.',
              }),
            },
          ],
        },
        {
          text: z({
            en: "I don't have a budget but track my spending",
            cy: "Nid oes gennyf gyllideb ond rwy'n cadw cofnod o'm gwariant",
          }),
          score: 2,
          clearAll: false,
          links: [
            {
              title: z({
                en: 'Budget planner',
                cy: 'Cynlluniwr Cyllideb',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner',
                cy: 'https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/budget-planner',
              }),
              type: 'tool',
              description: z({
                en: "will help you keep track of your money by working out exactly how much you’ve got coming in and where it's being spent.",
                cy: 'yn eich helpu i gadw golwg ar eich arian drwy gyfrifo faint yn union sydd gennych yn dod i mewn a ble mae’n cael ei wario.',
              }),
            },
            {
              title: z({
                en: "Beginner's guide to managing your money",
                cy: 'Canllaw syml i reoli eich arian',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/beginners-guide-to-managing-your-money',
                cy: 'https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/beginners-guide-to-managing-your-money',
              }),
              type: 'article',
              description: z({
                en: 'will help you learn to budget so you can stay on top of bills and start saving.',
                cy: 'yn eich helpu i ddysgu sut i gyllidebu fel y gallwch aros ar ben eich biliau a dechrau cynilo.',
              }),
            },
          ],
        },
        {
          text: z({
            en: "I don't have a budget and don't track my spending",
            cy: "Nid oes gennyf gyllideb ac nid wyf yn cadw cofnod o'm gwariant",
          }),
          score: 1,
          clearAll: false,
          links: [
            {
              title: z({
                en: 'Budget planner',
                cy: 'Cynlluniwr Cyllideb',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner',
                cy: 'https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/budget-planner',
              }),
              type: 'tool',
              description: z({
                en: "will help you keep track of your money by working out exactly how much you’ve got coming in and where it's being spent.",
                cy: 'yn eich helpu i gadw golwg ar eich arian drwy gyfrifo faint yn union sydd gennych yn dod i mewn a ble mae’n cael ei wario.',
              }),
            },
            {
              title: z({ en: 'Living on low income', cy: 'Byw ar incwm isel' }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/living-on-a-low-income-tips',
                cy: 'https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/living-on-a-low-income-tips',
              }),
              type: 'article',
              description: z({
                en: 'offers guidance on how to make ends meet on a tight budget.',
                cy: 'yn cynnig arweiniad ar sut i gael dau ben llinyn ynghyd ar gyllideb dynn.',
              }),
            },
            {
              title: z({
                en: "Beginner's guide to managing your money",
                cy: 'Canllaw syml i reoli eich arian',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/beginners-guide-to-managing-your-money',
                cy: 'https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/beginners-guide-to-managing-your-money',
              }),
              type: 'article',
              description: z({
                en: 'will help you learn to budget so you can stay on top of bills and start saving.',
                cy: 'yn eich helpu i ddysgu sut i gyllidebu fel y gallwch aros ar ben eich biliau a dechrau cynilo.',
              }),
            },
          ],
        },
      ],
    },
    {
      questionNbr: 5,
      group: 'budgeting',
      title: z({
        en: 'Have you considered these ways to increase your income?',
        cy: "Ydych chi wedi ystyried y ffyrdd canlynol o gynyddu'ch incwm?",
      }),
      type: 'multiple',
      description: z({
        en: 'Select all that apply',
        cy: "Dewiswch bopeth sy'n berthnasol",
      }),
      answers: [
        {
          text: z({
            en: 'Checking if you are able to claim any benefits',
            cy: 'Gwirio a ydych yn gallu hawlio unrhyw fudd-daliadau',
          }),
          subtext: z({
            en: 'Benefits are payments from the government to people on low incomes or with specific needs.',
            cy: 'Mae budd-daliadau yn daliadau gan y llywodraeth ar gyfer pobl ar incwm isel neu sydd ag anghenion penodol.',
          }),
          score: 3,
          unselectedScore: 2,
          clearAll: false,
          showLinksIfSelected: false,
          links: [
            {
              title: z({
                en: 'Check your benefits entitlements',
                cy: 'Gwiriwch eich hawliau budd-daliadau',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/benefits',
                cy: 'https://www.moneyhelper.org.uk/cy/benefits',
              }),
              type: 'article',
              description: z({
                en: 'will help you find out what benefits you might qualify for and how to claim them.',
                cy: "yn eich helpu i ddarganfod pa fudd-daliadau y gallech fod yn gymwys i'w cael a sut i'w hawlio.",
              }),
            },
          ],
        },
        {
          text: z({
            en: 'Checking if you are eligible for Help for Households support',
            cy: 'Gweld a ydych yn gymwys i gael cymorth gan Help i Gartrefi',
          }),
          subtext: z({
            en: 'Government support is available for the rising cost of living and energy bills.',
            cy: 'Mae cefnogaeth y llywodraeth ar gael ar gyfer costau byw a biliau ynni cynyddol.',
          }),
          score: 3,
          unselectedScore: 2,
          clearAll: false,
          showLinksIfSelected: false,
          links: [
            {
              title: z({
                en: "Understanding the government's Help for Households support",
                cy: 'Deall cymorth costau byw y llywodraeth',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/blog/everyday-money/government-cost-of-living-support-package-to-help-with-energy-bills',
                cy: 'https://www.moneyhelper.org.uk/cy/blog/everyday-money/government-cost-of-living-support-package-to-help-with-energy-bills',
              }),
              type: 'article',
              description: z({
                en: 'can tell you what government support is available to help you with the rising cost of living.',
                cy: "yn gallu dweud wrthych pa gymorth sydd ar gael gan y llywodraeth i'ch helpu gyda chostau byw cynyddol.",
              }),
            },
          ],
        },
        {
          text: z({
            en: 'I have not considered these options',
            cy: 'Nid wyf wedi ystyried yr opsiynau hyn',
          }),
          score: 1,
          clearAll: true,
          showLinksIfSelected: true,
          links: [
            {
              title: z({
                en: 'Check your benefits entitlements',
                cy: 'Gwiriwch eich hawliau budd-daliadau',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/benefits',
                cy: 'https://www.moneyhelper.org.uk/cy/benefits',
              }),
              type: 'article',
              description: z({
                en: 'will help you find out what benefits you might qualify for and how to claim them.',
                cy: "yn eich helpu i ddarganfod pa fudd-daliadau y gallech fod yn gymwys i'w cael a sut i'w hawlio.",
              }),
            },
            {
              title: z({
                en: "Understanding the government's Help for Households support",
                cy: 'Deall cymorth costau byw y llywodraeth',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/blog/everyday-money/government-cost-of-living-support-package-to-help-with-energy-bills',
                cy: 'https://www.moneyhelper.org.uk/cy/blog/everyday-money/government-cost-of-living-support-package-to-help-with-energy-bills',
              }),
              type: 'article',
              description: z({
                en: 'can tell you what government support is available to help you with the rising cost of living.',
                cy: "yn gallu dweud wrthych pa gymorth sydd ar gael gan y llywodraeth i'ch helpu gyda chostau byw cynyddol.",
              }),
            },
          ],
        },
      ],
    },
    {
      questionNbr: 6,
      group: 'budgeting',
      title: z({
        en: 'Have you thought about ways to reduce the cost of these household bills?',
        cy: 'Ydych chi wedi meddwl am ffyrdd o leihau cost y biliau cartref hyn?',
      }),
      type: 'multiple',
      description: z({
        en: 'Select all that apply',
        cy: "Dewiswch bopeth sy'n berthnasol",
      }),
      answers: [
        {
          text: z({
            en: 'Utility bills, such as gas, electricity, broadband and your mobile phone',
            cy: "Biliau cyfleustodau megis nwy, ynni, band eang a'ch ffôn symudol",
          }),
          score: 3,
          unselectedScore: 2,
          clearAll: false,
          showLinksIfSelected: false,
          links: [
            {
              title: z({
                en: 'How to save money on household bills',
                cy: 'Sut i arbed arian ar filiau cartref',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/how-to-save-money-on-household-bills',
                cy: 'https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/how-to-save-money-on-household-bills',
              }),
              type: 'article',
              description: z({
                en: 'can help you reduce spending on utilities and other bills.',
                cy: 'gall eich helpu i leihau gwariant ar filiau cyfleustodau a biliau eraill.',
              }),
            },
          ],
        },
        {
          text: z({
            en: 'Essentials, such as fuel, Council Tax and your mortgage/rent',
            cy: "Hanfodion megis bwyd, tanwydd, treth y cyngor a'ch morgais/rhent",
          }),
          score: 3,
          unselectedScore: 2,
          clearAll: false,
          showLinksIfSelected: false,
          links: [
            {
              title: z({
                en: 'How to save money on household bills',
                cy: 'Sut i arbed arian ar filiau cartref',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/how-to-save-money-on-household-bills',
                cy: 'https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/how-to-save-money-on-household-bills',
              }),
              type: 'article',
              description: z({
                en: 'can help you reduce spending on utilities and other bills.',
                cy: 'gall eich helpu i leihau gwariant ar filiau cyfleustodau a biliau eraill.',
              }),
            },
          ],
        },
        {
          text: z({
            en: 'Other bills, such as insurance, streaming subscriptions, credit card/loan interest and pet costs',
            cy: 'Biliau eraill megis yswiriant, tanysgrifiadau ffrydio, cerdyn credyd/llog benthyciadau a chostau anifeiliaid anwes',
          }),
          score: 3,
          unselectedScore: 2,
          clearAll: false,
          showLinksIfSelected: false,
          links: [
            {
              title: z({
                en: 'How to save money on household bills',
                cy: 'Sut i arbed arian ar filiau cartref',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/how-to-save-money-on-household-bills',
                cy: 'https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/how-to-save-money-on-household-bills',
              }),
              type: 'article',
              description: z({
                en: 'can help you reduce spending on utilities and other bills.',
                cy: 'gall eich helpu i leihau gwariant ar filiau cyfleustodau a biliau eraill.',
              }),
            },
          ],
        },
        {
          text: z({
            en: "I haven't thought about it",
            cy: 'Nid ydw i wedi meddwl am y peth.',
          }),
          score: 1,
          clearAll: true,
          showLinksIfSelected: true,
          links: [
            {
              title: z({
                en: 'How to save money on household bills',
                cy: 'Sut i arbed arian ar filiau cartref',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/how-to-save-money-on-household-bills',
                cy: 'https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/how-to-save-money-on-household-bills',
              }),
              type: 'article',
              description: z({
                en: 'can help you reduce spending on utilities and other bills.',
                cy: 'gall eich helpu i leihau gwariant ar filiau cyfleustodau a biliau eraill.',
              }),
            },
          ],
        },
      ],
    },
    {
      questionNbr: 7,
      group: 'estate-planning',
      title: z({
        en: 'What will happen to your money and property if you get seriously ill or die?',
        cy: "Beth fydd yn digwydd i'ch arian a'ch eiddo os byddwch yn ddifrifol wael neu'n marw?",
      }),
      type: 'multiple',
      description: z({
        en: 'Select all that apply',
        cy: "Dewiswch bopeth sy'n berthnasol",
      }),
      answers: [
        {
          text: z({ en: 'I have a will', cy: 'Mae gen i ewyllys' }),
          score: 3,
          unselectedScore: 2,
          clearAll: false,
          showLinksIfSelected: false,
          links: [
            {
              title: z({
                en: 'Planning what to leave in your will',
                cy: "Cynllunio beth i'w adael yn eich ewyllys",
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/family-and-care/death-and-bereavement/planning-what-to-leave-in-your-will',
                cy: 'https://www.moneyhelper.org.uk/cy/family-and-care/death-and-bereavement/planning-what-to-leave-in-your-will',
              }),
              type: 'article',
              description: z({
                en: 'is a step-by-step guide on making a will, including deciding what to leave and talking to your loved ones.',
                cy: "yn ganllaw cam wrth gam ar wneud ewyllys, gan gynnwys penderfynu beth i'w adael a siarad â'ch anwyliaid",
              }),
            },
            {
              title: z({
                en: 'Storing your will where others can find it',
                cy: 'Cadw’ch ewyllys yn rhywle y gall eraill ddod o hyd iddi',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/family-and-care/death-and-bereavement/storing-your-will-where-others-can-find-it',
                cy: 'https://www.moneyhelper.org.uk/cy/family-and-care/death-and-bereavement/storing-your-will-where-others-can-find-it',
              }),
              type: 'article',
              description: z({
                en: 'can help you decide the safest and most appropriate option for where to store your will.',
                cy: 'Gall eich helpu i benderfynu ar yr opsiwn mwyaf diogel a mwyaf priodol ar gyfer lle i storio eich ewyllys.',
              }),
            },
          ],
        },
        {
          text: z({
            en: "I've set up my power of attorney",
            cy: 'Rwyf wedi sefydlu fy atwrneiaeth',
          }),
          subtext: z({
            en: 'The person you give ‘power of attorney’ to will deal with your money and property if you are too sick to make decisions.',
            cy: "Bydd y person rydych yn rhoi 'pŵer atwrnai' iddynt yn delio â'ch arian a'ch eiddo os ydych chi'n rhy sâl i wneud penderfyniadau.",
          }),
          score: 3,
          unselectedScore: 2,
          clearAll: false,
          showLinksIfSelected: false,
          links: [
            {
              title: z({
                en: 'Setting up a power of attorney',
                cy: 'Sefydlu pŵer atwrnai',
              }),
              link: 'https://www.moneyhelper.org.uk/en/family-and-care/long-term-care/setting-up-a-power-of-attorney-in-england-and-wales',
              type: 'article',
              description: z({
                en: 'can guide you through what you need to know about the process in England and Wales, from the legal terms to the fees involved.',
                cy: "yn gallu eich arwain drwy'r hyn sydd angen i chi ei wybod am y broses yng Nghymru a Lloegr, o'r telerau cyfreithiol i'r ffioedd dan sylw.",
              }),
            },
          ],
        },
        {
          text: z({
            en: 'I’ve told my pension provider(s) who will get any pension I have left when I die',
            cy: 'Rwyf wedi dweud wrth fy narparwr/darparwyr pensiwn pwy fydd yn cael gweddill fy mhensiwn pan fyddaf farw',
          }),
          score: 3,
          unselectedScore: 2,
          clearAll: false,
          showLinksIfSelected: false,
          links: [
            {
              title: z({
                en: 'Estate planning guidance',
                cy: 'Arweiniad cynllunio ystadau',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/family-and-care/death-and-bereavement',
                cy: 'https://www.moneyhelper.org.uk/cy/family-and-care/death-and-bereavement',
              }),
              type: 'article',
              description: z({
                en: 'will help your get your affairs in order, as well as deal with the praticalities after the death of a loved one.',
                cy: "yn eich helpu i gael trefn ar eich materion, yn ogystal â delio â'r agweddau ymarferol ar ôl marwolaeth anwylyd.",
              }),
            },
            {
              title: z({
                en: 'Beneficiary allocation for your pension',
                cy: 'Dyraniad buddiolwr ar gyfer eich pensiwn',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-problems/pensions-after-death#nominating-dependants',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pension-problems/pensions-after-death#enwebu-dibynyddion',
              }),
              type: 'article',
              description: z({
                en: 'can show you how to nominate someone to receive your pension if you die.',
                cy: 'yn gallu dangos i chi sut i enwebu rhywun i dderbyn eich pensiwn os byddwch yn marw.',
              }),
            },
          ],
        },
        {
          text: z({
            en: "I've discussed the above with my loved ones and/or relevant people",
            cy: 'Rwyf wedi trafod yr uchod gyda fy anwyliaid a/neu bobl perthnasol',
          }),
          score: 3,
          unselectedScore: 2,
          clearAll: false,
          showLinksIfSelected: false,
          links: [
            {
              title: z({
                en: 'Talking to your family about your will',
                cy: 'Siarad â’ch teulu ynglŷn â’ch ewyllys',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/family-and-care/death-and-bereavement/planning-what-to-leave-in-your-will#talking-to-your-family-about-your-will',
                cy: 'https://www.moneyhelper.org.uk/cy/family-and-care/death-and-bereavement/planning-what-to-leave-in-your-will#siarad-ach-teulu-ynglyn-ach-ewyllys',
              }),
              type: 'article',
              description: z({
                en: 'will guide you through having difficult conversations with loved ones about your will.',
                cy: 'yn eich arwain trwy gael sgyrsiau anodd gydag anwyliaid am eich ewyllys.',
              }),
            },
            {
              title: z({
                en: 'Talk money - difficult conversations',
                cy: 'Siarad arian - sgyrsiau anodd',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/family-and-care/talk-money',
                cy: 'https://www.moneyhelper.org.uk/cy/family-and-care/talk-money',
              }),
              type: 'article',
              description: z({
                en: 'will help you prepare for tackling the subject of finances with friends and family.',
                cy: "yn eich helpu i baratoi ar gyfer mynd i'r afael â phwnc cyllid gyda ffrindiau a theulu.",
              }),
            },
          ],
        },
        {
          text: z({ en: 'None of these', cy: "Dim un o'r rhain" }),
          score: 1,
          clearAll: true,
          showLinksIfSelected: true,
          links: [
            {
              title: z({
                en: 'Planning what to leave in your will',
                cy: "Cynllunio beth i'w adael yn eich ewyllys",
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/family-and-care/death-and-bereavement/planning-what-to-leave-in-your-will',
                cy: 'https://www.moneyhelper.org.uk/cy/family-and-care/death-and-bereavement/planning-what-to-leave-in-your-will',
              }),
              type: 'article',
              description: z({
                en: 'is a step-by-step guide on making a will, including deciding what to leave and talking to your loved ones.',
                cy: "yn ganllaw cam wrth gam ar wneud ewyllys, gan gynnwys penderfynu beth i'w adael a siarad â'ch anwyliaid",
              }),
            },
            {
              title: z({
                en: 'Storing your will where others can find it',
                cy: 'Cadw’ch ewyllys yn rhywle y gall eraill ddod o hyd iddi',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/family-and-care/death-and-bereavement/storing-your-will-where-others-can-find-it',
                cy: 'https://www.moneyhelper.org.uk/cy/family-and-care/death-and-bereavement/storing-your-will-where-others-can-find-it',
              }),
              type: 'article',
              description: z({
                en: 'can help you decide the safest and most appropriate option for where to store your will.',
                cy: 'Gall eich helpu i benderfynu ar yr opsiwn mwyaf diogel a mwyaf priodol ar gyfer lle i storio eich ewyllys.',
              }),
            },
            {
              title: z({
                en: 'Setting up a power of attorney',
                cy: 'Sefydlu pŵer atwrnai',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/family-and-care/long-term-care/setting-up-a-power-of-attorney-in-england-and-wales',
                cy: 'https://www.moneyhelper.org.uk/cy/family-and-care/long-term-care/setting-up-a-power-of-attorney-in-england-and-wales',
              }),
              type: 'article',
              description: z({
                en: 'can guide you through what you need to know about the process in England and Wales, from the legal terms to the fees involved.',
                cy: "yn gallu eich arwain drwy'r hyn sydd angen i chi ei wybod am y broses yng Nghymru a Lloegr, o'r telerau cyfreithiol i'r ffioedd dan sylw.",
              }),
            },
            {
              title: z({
                en: 'Estate planning guidance',
                cy: 'Arweiniad cynllunio ystadau',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/family-and-care/death-and-bereavement',
                cy: 'https://www.moneyhelper.org.uk/cy/family-and-care/death-and-bereavement',
              }),
              type: 'article',
              description: z({
                en: 'will help your get your affairs in order, as well as deal with the praticalities after the death of a loved one.',
                cy: "yn eich helpu i gael trefn ar eich materion, yn ogystal â delio â'r agweddau ymarferol ar ôl marwolaeth anwylyd.",
              }),
            },
            {
              title: z({
                en: 'Beneficiary allocation for your pension',
                cy: 'Dyraniad buddiolwr ar gyfer eich pensiwn',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-problems/pensions-after-death#nominating-dependants',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pension-problems/pensions-after-death#enwebu-dibynyddion',
              }),
              type: 'article',
              description: z({
                en: 'can show you how to nominate someone to receive your pension if you die.',
                cy: 'yn gallu dangos i chi sut i enwebu rhywun i dderbyn eich pensiwn os byddwch yn marw.',
              }),
            },
            {
              title: z({
                en: 'Talking to your family about your will',
                cy: 'Siarad â’ch teulu ynglŷn â’ch ewyllys',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/family-and-care/death-and-bereavement/planning-what-to-leave-in-your-will#talking-to-your-family-about-your-will',
                cy: 'https://www.moneyhelper.org.uk/cy/family-and-care/death-and-bereavement/planning-what-to-leave-in-your-will#siarad-ach-teulu-ynglyn-ach-ewyllys',
              }),
              type: 'article',
              description: z({
                en: 'will guide you through having difficult conversations with loved ones about your will.',
                cy: 'yn eich arwain trwy gael sgyrsiau anodd gydag anwyliaid am eich ewyllys.',
              }),
            },
            {
              title: z({
                en: 'Talk money - difficult conversations',
                cy: 'Siarad arian - sgyrsiau anodd',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/family-and-care/talk-money',
                cy: 'https://www.moneyhelper.org.uk/cy/family-and-care/talk-money',
              }),
              type: 'article',
              description: z({
                en: 'will help you prepare for tackling the subject of finances with friends and family.',
                cy: "yn eich helpu i baratoi ar gyfer mynd i'r afael â phwnc cyllid gyda ffrindiau a theulu.",
              }),
            },
          ],
        },
      ],
    },
    {
      questionNbr: 8,
      group: 'emergency-savings',
      title: z({
        en: 'Do you have money set aside in case you lose your job or source of income?',
        cy: "Oes gennych unrhyw arian wrth gefn pe baech yn colli'ch swydd neu eich incwm?",
      }),
      type: 'single',
      answers: [
        {
          text: z({
            en: 'Yes, I have enough to cover at least three months of expenses',
            cy: 'Oes, mae gennyf ddigon i gynnal o leiaf tri mis o gostau',
          }),
          score: 3,
          clearAll: false,
        },
        {
          text: z({
            en: 'Yes, but less than what I’d need for three months of expenses',
            cy: "Oes, ond llai na'r hyn fyddai angen arnaf ar gyfer tri mis o gostau",
          }),
          score: 2,
          clearAll: false,
          links: [
            {
              title: z({
                en: 'Emergency savings - how much is enough? ',
                cy: 'Cynilion ar gyfer argyfwng - faint sy’n ddigon?',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/savings/types-of-savings/emergency-savings-how-much-is-enough',
                cy: 'https://www.moneyhelper.org.uk/cy/savings/types-of-savings/emergency-savings-how-much-is-enough',
              }),
              type: 'article',
              description: z({
                en: 'will help you build a financial buffer that ensures you can pay for unexpected costs.',
                cy: "yn eich helpu i adeiladu byffer ariannol sy'n sicrhau y gallwch dalu am gostau annisgwyl.",
              }),
            },
          ],
        },
        {
          text: z({
            en: "No, I don't have any money set aside for this",
            cy: 'Nac oes, nid oes gennyf arian wrth gefn ar gyfer hyn',
          }),
          score: 1,
          clearAll: false,
          links: [
            {
              title: z({
                en: 'Emergency savings - how much is enough? ',
                cy: 'Cynilion ar gyfer argyfwng - faint sy’n ddigon?',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/savings/types-of-savings/emergency-savings-how-much-is-enough',
                cy: 'https://www.moneyhelper.org.uk/cy/savings/types-of-savings/emergency-savings-how-much-is-enough',
              }),
              type: 'article',
              description: z({
                en: 'will help you build a financial buffer that ensures you can pay for unexpected costs.',
                cy: "yn eich helpu i adeiladu byffer ariannol sy'n sicrhau y gallwch dalu am gostau annisgwyl.",
              }),
            },
          ],
        },
      ],
    },
    {
      questionNbr: 9,
      group: 'income-protection',
      title: z({
        en: 'Do you have insurance to protect your income if...',
        cy: 'Oes gennych yswiriant i amddiffyn eich incwm os…',
      }),
      type: 'multiple',
      description: z({
        en: 'Select all that apply',
        cy: "Dewiswch bopeth sy'n berthnasol",
      }),
      answers: [
        {
          text: z({
            en: 'You have an accident or develop an illness or disability',
            cy: 'y cewch chi ddamwain neu y byddwch yn datblygu salwch neu anabledd',
          }),
          score: 3,
          unselectedScore: 2,
          clearAll: false,
          showLinksIfSelected: false,
          links: [
            {
              title: z({
                en: 'What is income protection insurance?',
                cy: 'Beth yw yswiriant diogelu incwm?',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/everyday-money/insurance/what-is-income-protection-insurance',
                cy: 'https://www.moneyhelper.org.uk/cy/everyday-money/insurance/what-is-income-protection-insurance',
              }),
              type: 'article',
              description: z({
                en: 'will explain how this insurance works and when you might need it.',
                cy: "yn esbonio sut mae'r yswiriant hwn yn gweithio a phryd y gallai fod ei angen arnoch.",
              }),
            },
          ],
        },
        {
          text: z({
            en: 'You lose your job',
            cy: "y byddwch yn colli'ch swydd",
          }),
          score: 3,
          unselectedScore: 2,
          clearAll: false,
          showLinksIfSelected: false,
          links: [
            {
              title: z({
                en: 'Can you insure yourself against redundancy?',
                cy: 'A allwch yswirio’ch hun rhag diswyddo?',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/work/losing-your-job/can-you-insure-yourself-against-redundancy',
                cy: 'https://www.moneyhelper.org.uk/cy/work/losing-your-job/can-you-insure-yourself-against-redundancy',
              }),
              type: 'article',
              description: z({
                en: 'looks at the pros and cons of this type of insurance.',
                cy: 'yn edrych ar fanteision ac anfanteision y math hwn o yswiriant.',
              }),
            },
          ],
        },
        {
          text: z({
            en: "You're self-employed",
            cy: 'ydych yn hunan-gyflogedig',
          }),
          score: 3,
          unselectedScore: 2,
          clearAll: false,
          showLinksIfSelected: false,
          links: [
            {
              title: z({
                en: "Business insurance when you're self-employed",
                cy: 'Yswiriant busnes pan fyddwch yn hunangyflogedig',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/work/self-employment/business-insurance-when-youre-self-employed',
                cy: 'https://www.moneyhelper.org.uk/cy/work/self-employment/business-insurance-when-youre-self-employed',
              }),
              type: 'article',
              description: z({
                en: 'sets out the different types of business insurance available and can help you find the right one for you. ',
                cy: 'yn nodi’r gwahanol fathau o yswiriant busnes sydd ar gael a gall eich helpu i ddod o hyd i’r un iawn i chi.',
              }),
            },
          ],
        },
        {
          text: z({ en: 'You die', cy: 'y byddwch farw' }),
          score: 3,
          unselectedScore: 2,
          clearAll: false,
          showLinksIfSelected: false,
          links: [
            {
              title: z({ en: 'Life insurance', cy: 'Yswiriant bywyd' }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/everyday-money/insurance/what-is-life-insurance',
                cy: 'https://www.moneyhelper.org.uk/cy/everyday-money/insurance/what-is-life-insurance',
              }),
              type: 'article',
              description: z({
                en: 'offers guidance on how to find the right type of policy for you. ',
                cy: "yn cynnig arweiniad ar sut i ddod o hyd i'r math cywir o bolisi i chi.",
              }),
            },
          ],
        },
        {
          text: z({ en: 'None of the above', cy: "Dim un o'r uchod" }),
          score: 1,
          clearAll: true,
          showLinksIfSelected: true,
          links: [
            {
              title: z({
                en: 'How to know what kind of protection insurance you need',
                cy: 'Sut i wybod pa fath o yswiriant diogelu sydd ei angen arnoch',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/everyday-money/insurance/how-much-does-protection-insurance-cost',
                cy: 'https://www.moneyhelper.org.uk/cy/everyday-money/insurance/how-much-does-protection-insurance-cost',
              }),
              type: 'article',
              description: z({
                en: 'will help you work out which product is most suitable for you and the what to consider when weighing up different options.',
                cy: "bydd yn eich helpu i weld pa gynnyrch sydd fwyaf addas i chi a'r hyn i'w ystyried wrth bwyso a mesur gwahanol opsiynau.",
              }),
            },
          ],
        },
      ],
    },

    {
      questionNbr: 10,
      group: 'unexpected-costs',
      title: z({
        en: 'Which of these items could you get insurance for, but haven’t already?',
        cy: "Pa rai o'r eitemau canlynol allech chi gael yswiriant ar eu cyfer ond nid ydych wedi gwneud eto?",
      }),
      type: 'multiple',
      description: z({
        en: 'Select all that apply',
        cy: "Dewiswch bopeth sy'n berthnasol",
      }),
      answers: [
        {
          text: z({
            en: 'Your home and its contents',
            cy: "Eich cartref a'i gynnwys",
          }),
          score: 1,
          unselectedScore: 3,
          clearAll: false,
          showLinksIfSelected: true,
          links: [
            {
              title: z({
                en: 'Possessions insurance',
                cy: 'Yswiriant meddiannau',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/everyday-money/insurance/home-insurance-how-to-get-the-best-deal',
                cy: 'https://www.moneyhelper.org.uk/cy/everyday-money/insurance/home-insurance-how-to-get-the-best-deal',
              }),
              type: 'article',
              description: z({
                en: 'explains the types of home insurance available and what they cover. ',
                cy: "yn esbonio'r mathau o yswiriant cartref sydd ar gael a'r hyn y maent yn ei gwmpasu.",
              }),
            },
          ],
        },
        {
          text: z({ en: 'Your pets', cy: 'Eich anifeiliaid anwes' }),
          score: 2,
          unselectedScore: 3,
          clearAll: false,
          showLinksIfSelected: true,
          links: [
            {
              title: z({
                en: 'Pet insurance',
                cy: 'Yswiriant anifeiliaid anwes',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/everyday-money/insurance/do-you-need-pet-insurance',
                cy: 'https://www.moneyhelper.org.uk/cy/everyday-money/insurance/do-you-need-pet-insurance',
              }),
              type: 'article',
              description: z({
                en: 'can provide more information on how to get the right insurance cover for your pet.',
                cy: 'darparu rhagor o wybodaeth ar sut i gael yr yswiriant cywir ar gyfer eich anifail anwes.',
              }),
            },
          ],
        },
        {
          text: z({ en: 'Your vehicle', cy: 'Eich cerbyd' }),
          score: 1,
          unselectedScore: 3,
          clearAll: false,
          showLinksIfSelected: true,
          links: [
            {
              title: z({ en: 'Vehicle insurance ', cy: 'Yswiriant cerbyd' }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/everyday-money/insurance/car-insurance-what-you-need-to-know',
                cy: 'https://www.moneyhelper.org.uk/cy/everyday-money/insurance/car-insurance-what-you-need-to-know',
              }),
              type: 'article',
              description: z({
                en: "explains the different types of products available, as well as how to decide which one's right for you.",
                cy: "yn esbonio'r gwahanol fathau o gynhyrchion sydd ar gael, yn ogystal â sut i benderfynu pa un sy'n iawn i chi.",
              }),
            },
          ],
        },
        {
          text: z({
            en: 'Your health and dental',
            cy: "Eich iechyd a'ch dannedd",
          }),
          score: 2,
          unselectedScore: 3,
          clearAll: false,
          showLinksIfSelected: true,
          links: [
            {
              title: z({
                en: 'What is private health insurance?',
                cy: 'Beth yw yswiriant meddygol preifat?',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/everyday-money/insurance/do-you-need-private-medical-insurance',
                cy: 'https://www.moneyhelper.org.uk/cy/everyday-money/insurance/do-you-need-private-medical-insurance',
              }),
              type: 'article',
              description: z({
                en: 'looks at the pros and cons of taking out private insurance for your health and dental.',
                cy: "yn edrych ar fanteision ac anfanteision cymryd yswiriant preifat ar gyfer eich iechyd a'ch deintyddol.",
              }),
            },
          ],
        },
        {
          text: z({
            en: 'I already have insurance for what applies to me',
            cy: 'Mae gen i yswiriant am beth sy’n berthnasol i fi’n barod',
          }),
          score: 3,
          clearAll: true,
          showLinksIfSelected: true,
          links: [
            {
              title: z({
                en: 'Your insurance options',
                cy: 'Eich opsiynau yswiriant',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/everyday-money/insurance',
                cy: 'https://www.moneyhelper.org.uk/cy/everyday-money/insurance',
              }),
              type: 'article',
              description: z({
                en: 'can help you consider insurance as a way to protect your financial future.',
                cy: 'Gall eich helpu i ystyried yswiriant fel ffordd o ddiogelu eich dyfodol ariannol.',
              }),
            },
          ],
        },
      ],
    },
    {
      questionNbr: 11,
      group: 'retirement-planning',
      title: z({
        en: 'Do you have or will you be entitled to any of these pensions?',
        cy: "Oes gennych neu a fyddwch yn gymwys ar gyfer un o'r pensiynau hyn?",
      }),
      type: 'multiple',
      description: z({
        en: 'Select all that apply',
        cy: "Dewiswch bopeth sy'n berthnasol",
      }),
      answers: [
        {
          text: z({ en: 'State pension', cy: 'Pensiwn y Wladwriaeth' }),
          subtext: z({
            en: "You can claim the State Pension if you've made enough National Insurance (NI) contributions during your working life. What you get depends on your 'qualifying years' of NI contributions.",
            cy: "Gallwch hawlio Pensiwn y Wladwriaeth os ydych wedi gwneud digon o gyfraniadau Yswiriant Gwladol (NI) yn ystod eich bywyd gwaith. Mae faint y cewch yn dibynnu ar eich cyfraniadau NI yn ystod eich 'blynyddoedd cymhwyso'.",
          }),
          score: 3,
          unselectedScore: 2,
          showLinksIfSelected: true,
          clearAll: false,
          links: [
            {
              title: z({
                en: 'Check your state pension',
                cy: 'Gwiriwch eich pensiwn y wladwriaeth',
              }),
              link: z({
                en: 'https://www.gov.uk/browse/working/state-pension',
                cy: 'https://www.gov.uk/browse/working/state-pension',
              }),
              type: 'article',
              description: z({
                en: 'will guide you through everything from checking your pension forecast to claiming it, plus what other support is available when you get to State Pension age. ',
                cy: 'yn eich arwain trwy bopeth o wirio eich rhagolwg pensiwn i wneud cais amdano, ynghyd â pha gymorth arall sydd ar gael pan fyddwch yn cyrraedd oedran Pensiwn y Wladwriaeth.',
              }),
            },
          ],
          unselectedAnswerLinks: [
            {
              title: z({
                en: 'Check your state pension',
                cy: 'Gwiriwch eich pensiwn y wladwriaeth',
              }),
              link: z({
                en: 'https://www.gov.uk/browse/working/state-pension',
                cy: 'https://www.gov.uk/browse/working/state-pension',
              }),
              type: 'article',
              description: z({
                en: 'will guide you through everything from checking your pension forecast to claiming it, plus what other support is available when you get to State Pension age. ',
                cy: 'yn eich arwain trwy bopeth o wirio eich rhagolwg pensiwn i wneud cais amdano, ynghyd â pha gymorth arall sydd ar gael pan fyddwch yn cyrraedd oedran Pensiwn y Wladwriaeth.',
              }),
            },
          ],
        },
        {
          text: z({
            en: 'A workplace pension with my current and/or past employer(s)',
            cy: "Pensiwn gwaith gyda'm cyflogwr cyfredol a/neu gyflogwr/cyflogwyr blaenorol",
          }),
          score: 3,
          unselectedScore: 2,
          clearAll: false,
        },
        {
          text: z({ en: "I'm not sure", cy: 'Nid wyf yn siŵr' }),
          score: 1,
          clearAll: true,
          showLinksIfSelected: true,
          links: [
            {
              title: z({
                en: 'How to identify the type of pension you have',
                cy: 'Sut i adnabod y math o bensiwn sydd gennych',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-wise/find-out-your-pension-type',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pension-wise/find-out-your-pension-type',
              }),
              type: 'article',
              description: z({
                en: 'will help you check what policies you have. You may also be able to book a free Pension Wise appointment.',
                cy: 'yn eich helpu i wirio pa bolisïau sydd gennych. Efallai y byddwch hefyd yn gallu trefnu apwyntiad Pension Wise am ddim.',
              }),
            },
          ],
        },
      ],
    },
    {
      questionNbr: 12,
      group: 'retirement-planning',
      title: z({
        en: 'What type of workplace pension do you pay into?',
        cy: "Pa fath o bensiwn gwaith ydych chi'n talu iddo?",
      }),
      type: 'multiple',
      description: z({
        en: 'Select all that apply',
        cy: "Dewiswch bopeth sy'n berthnasol",
      }),
      answers: [
        {
          text: z({
            en: 'A defined contribution pension',
            cy: "Pensiwn cyfraniadau wedi'u diffinio",
          }),
          score: 3,
          unselectedScore: 2,
          clearAll: false,
          showLinksIfSelected: true,
          subtext: z({
            en: "How much you'll get in retirement depends on how much you pay in, as well as the fund’s investment performance.",
            cy: "Mae faint y cewch yn ystod eich ymddeoliad yn dibynnu ar faint rydych yn ei dalu ynghyd â pherfformiad buddsoddi'r gronfa.",
          }),
          links: [
            {
              title: z({
                en: 'Using your defined contribution pension',
                cy: "Defnyddio eich pensiwn cyfraniadau wedi'u diffinio",
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/your-options-for-using-your-defined-contribution-pension-pot',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/your-options-for-using-your-defined-contribution-pension-pot',
              }),
              type: 'article',
              description: z({
                en: 'will help you decide how to use your pension pot.',
                cy: 'yn eich helpu i benderfynu sut i ddefnyddio eich cronfa bensiwn.',
              }),
            },
          ],
        },
        {
          text: z({
            en: 'A defined benefit pension',
            cy: 'Pensiwn buddion wedi’u diffinio',
          }),
          score: 3,
          unselectedScore: 2,
          clearAll: false,
          showLinksIfSelected: true,
          subtext: z({
            en: 'You’ll get a guaranteed annual income for life, based on your final or average salary.',
            cy: " Byddwch yn cael incwm blynyddol gwarantedig am oes wedi'i seilio ar eich cyflog terfynol neu gyfartalog.",
          }),
          links: [
            {
              title: z({
                en: 'Using your defined benefit pension',
                cy: "Defnyddio eich pensiwn buddion wedi'u diffinio",
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/defined-benefit-or-final-salary-pensions-schemes-explained',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/defined-benefit-or-final-salary-pensions-schemes-explained',
              }),
              type: 'article',
              description: z({
                en: "will help you find out which of the two types of scheme you have, how they're calculated and when you can take yours. ",
                cy: "yn eich helpu i ddarganfod pa un o'r ddau fath o gynllun sydd gennych, sut maent yn cael eu cyfrifo a phryd y gallwch gymryd eich un chi.",
              }),
            },
          ],
        },
        {
          text: z({ en: "I'm not sure", cy: 'Nid wyf yn siŵr' }),
          score: 1,
          clearAll: true,
          showLinksIfSelected: true,
          links: [
            {
              title: z({
                en: 'How to identify the type of pension you have',
                cy: 'Sut i adnabod y math o bensiwn sydd gennych',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-wise/find-out-your-pension-type',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pension-wise/find-out-your-pension-type',
              }),
              type: 'article',
              description: z({
                en: 'will help you check what policies you have. You may also be able to book a free Pension Wise appointment.',
                cy: 'yn eich helpu i wirio pa bolisïau sydd gennych. Efallai y byddwch hefyd yn gallu trefnu apwyntiad Pension Wise am ddim.',
              }),
            },
          ],
        },
      ],
    },
    {
      questionNbr: 13,
      group: 'retirement-planning',
      title: z({
        en: 'How well are you managing your pension?',
        cy: "Pa mor dda ydych chi'n rheoli'ch pensiwn?",
      }),
      type: 'multiple',
      description: z({
        en: 'Select all that apply',
        cy: "Dewiswch bopeth sy'n berthnasol",
      }),
      answers: [
        {
          text: z({
            en: 'I know how much my pension(s) is expected to be worth when I retire',
            cy: " Rwy'n gwybod faint y disgwylir i fy mhensiwn(pensiynau) fod yn werth pan fyddaf yn ymddeol",
          }),
          score: 3,
          unselectedScore: 2,
          clearAll: false,
          showLinksIfSelected: false,
          links: [
            {
              title: z({
                en: 'Pension calculator',
                cy: 'Cyfrifiannell pensiwn',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/pension-calculator',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/pension-calculator',
              }),
              type: 'tool',
              description: z({
                en: "will help you work out how much money you'll need in retirement, and offer suggestions if your projected pension income is less than ideal.",
                cy: 'yn eich helpu i weithio allan faint o arian fydd ei angen arnoch ar ôl ymddeol, ac yn cynnig awgrymiadau os yw eich incwm pensiwn rhagamcanol yn llai na delfrydol.',
              }),
            },
            {
              title: z({
                en: 'State Pension: an overview',
                cy: 'Pensiwn y Wladwriaeth: trosolwg',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/state-pension/state-pension-an-overview',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/state-pension/state-pension-an-overview',
              }),
              type: 'article',
              description: z({
                en: 'will show you how it’s calculated, how it’s paid, how it can be claimed, and what the jargon that’s used around it means.',
                cy: 'yn dangos i chi sut mae’n cael ei gyfrifo, sut mae’n cael ei dalu, sut y gellir ei hawlio, a beth mae’r jargon a ddefnyddir o’i gwmpas yn ei olygu.',
              }),
            },
          ],
        },
        {
          text: z({
            en: 'I know who my pension providers are',
            cy: "Rwy'n gwybod pwy sy'n darparu fy mhensiwn",
          }),
          score: 3,
          unselectedScore: 2,
          clearAll: false,
          showLinksIfSelected: false,
          links: [
            {
              title: z({
                en: 'Tracing and finding lost pensions',
                cy: 'Olrhain a dod o hyd i bensiynau coll',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-problems/tracing-and-finding-lost-pensions',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pension-problems/tracing-and-finding-lost-pensions',
              }),
              type: 'article',
              description: z({
                en: 'shows you how to track down all the pension policies you have.',
                cy: 'yn dangos i chi sut i olrhain yr holl bolisïau pensiwn sydd gennych.',
              }),
            },
          ],
        },
        {
          text: z({
            en: 'I know how much is going into my pension (from me and my employer, if applicable)',
            cy: "Rwy'n gwybod faint sy'n mynd mewn i fy mhensiwn (wrthyf i a'm cyflogwr, os yw'n berthnasol)",
          }),
          score: 3,
          unselectedScore: 2,
          clearAll: false,
          showLinksIfSelected: false,
          links: [
            {
              title: z({
                en: 'Workplace pension contribution calculator',
                cy: 'Cyfrifiannell cyfraniadau pensiwn gweithle',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/auto-enrolment/workplace-pension-calculator',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/auto-enrolment/workplace-pension-calculator',
              }),
              type: 'tool',
              description: z({
                en: "will help you work out how much you and your employer is paying into your pension, plus the tax relief you're getting on these contributions. ",
                cy: "yn eich helpu i gyfrifo faint rydych chi a'ch cyflogwr yn ei dalu i mewn i'ch pensiwn, ynghyd â'r gostyngiad treth yr ydych yn ei gael ar y cyfraniadau hyn.",
              }),
            },
            {
              title: z({
                en: 'Automatic enrolment - what to expect from your employer',
                cy: 'Ymrestru’n awtomatig – beth i’w ddisgwyl gan eich cyflogwr',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/work/employment/automatic-enrolment-what-to-expect-from-your-employer',
                cy: 'https://www.moneyhelper.org.uk/cy/work/employment/automatic-enrolment-what-to-expect-from-your-employer',
              }),
              type: 'article',
              description: z({
                en: "can tell you what to expect, including how much you'll pay out of your paycheck and how to opt out if you want to. ",
                cy: "yn gallu dweud wrthych beth i'w ddisgwyl, gan gynnwys faint y byddwch yn ei dalu o'ch pecyn talu a sut i optio allan os dymunwch.",
              }),
            },
          ],
        },
        {
          text: z({
            en: 'I’ve made the most of my employer pension match (if applicable)',
            cy: "Rwyf wedi gwneud y gorau o gyfraniadau pensiwn cyfatebol fy nghyflogwr (os yw'n berthnasol)",
          }),
          score: 3,
          unselectedScore: 2,
          clearAll: false,
          showLinksIfSelected: false,
          links: [
            {
              title: z({
                en: 'Workplace pension contribution calculator',
                cy: 'Cyfrifiannell cyfraniadau pensiwn gweithle',
              }),
              link: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/auto-enrolment/workplace-pension-calculator',
              type: 'tool',
              description: z({
                en: "will help you work out how much you and your employer are paying into your pension, plus the tax relief you're getting on these contributions. ",
                cy: "yn eich helpu i gyfrifo faint rydych chi a'ch cyflogwr yn ei dalu i mewn i'ch pensiwn, ynghyd â'r gostyngiad treth rydych yn ei gael ar y cyfraniadau hyn.",
              }),
            },
            {
              title: z({ en: 'Contribution matching', cy: 'Paru cyfraniadau' }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/building-your-retirement-pot/contribution-matching',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/building-your-retirement-pot/contribution-matching',
              }),
              type: 'article',
              description: z({
                en: 'will explain how to build your retirement savings faster.',
                cy: 'yn esbonio sut i adeiladu eich cynilion ymddeoliad yn gyflymach.',
              }),
            },
          ],
        },
        {
          text: z({ en: 'None of these', cy: "Dim un o'r rhain" }),
          score: 1,
          clearAll: true,
          showLinksIfSelected: true,
          links: [
            {
              title: z({
                en: 'Pension calculator',
                cy: 'Cyfrifiannell pensiwn',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/pension-calculator',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/pension-calculator',
              }),
              type: 'tool',
              description: z({
                en: "will help you work out how much money you'll need in retirement, and offer suggestions if your projected pension income is less than ideal.",
                cy: 'yn eich helpu i weithio allan faint o arian fydd ei angen arnoch ar ôl ymddeol, ac yn cynnig awgrymiadau os yw eich incwm pensiwn rhagamcanol yn llai na delfrydol.',
              }),
            },
            {
              title: z({
                en: 'State Pension: an overview',
                cy: 'Pensiwn y Wladwriaeth: trosolwg',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/state-pension/state-pension-an-overview',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/state-pension/state-pension-an-overview',
              }),
              type: 'article',
              description: z({
                en: 'will show you how it’s calculated, how it’s paid, how it can be claimed, and what the jargon that’s used around it means.',
                cy: 'yn dangos i chi sut mae’n cael ei gyfrifo, sut mae’n cael ei dalu, sut y gellir ei hawlio, a beth mae’r jargon a ddefnyddir o’i gwmpas yn ei olygu.',
              }),
            },
            {
              title: z({
                en: 'Tracing and finding lost pensions',
                cy: 'Olrhain a dod o hyd i bensiynau coll',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-problems/tracing-and-finding-lost-pensions',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pension-problems/tracing-and-finding-lost-pensions',
              }),
              type: 'article',
              description: z({
                en: 'shows you how to track down all the pension policies you have.',
                cy: 'yn dangos i chi sut i olrhain yr holl bolisïau pensiwn sydd gennych.',
              }),
            },
            {
              title: z({
                en: 'Workplace pension contribution calculator',
                cy: 'Cyfrifiannell cyfraniadau pensiwn gweithle',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/auto-enrolment/workplace-pension-calculator',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/auto-enrolment/workplace-pension-calculator',
              }),
              type: 'tool',
              description: z({
                en: "will help you work out how much you and your employer is paying into your pension, plus the tax relief you're getting on these contributions. ",
                cy: "yn eich helpu i gyfrifo faint rydych chi a'ch cyflogwr yn ei dalu i mewn i'ch pensiwn, ynghyd â'r gostyngiad treth yr ydych yn ei gael ar y cyfraniadau hyn.",
              }),
            },
            {
              title: z({
                en: 'Automatic enrolment - what to expect from your employer',
                cy: 'Ymrestru’n awtomatig – beth i’w ddisgwyl gan eich cyflogwr',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/work/employment/automatic-enrolment-what-to-expect-from-your-employer',
                cy: 'https://www.moneyhelper.org.uk/cy/work/employment/automatic-enrolment-what-to-expect-from-your-employer',
              }),
              type: 'article',
              description: z({
                en: "can tell you what to expect, including how much you'll pay out of your paycheck and how to opt out if you want to. ",
                cy: "yn gallu dweud wrthych beth i'w ddisgwyl, gan gynnwys faint y byddwch yn ei dalu o'ch pecyn talu a sut i optio allan os dymunwch.",
              }),
            },
            {
              title: z({ en: 'Contribution matching', cy: 'Paru cyfraniadau' }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/building-your-retirement-pot/contribution-matching',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/building-your-retirement-pot/contribution-matching',
              }),
              type: 'article',
              description: z({
                en: 'will explain how to build your retirement savings faster.',
                cy: 'yn esbonio sut i adeiladu eich cynilion ymddeoliad yn gyflymach.',
              }),
            },
          ],
        },
      ],
    },
    {
      questionNbr: 14,
      group: 'retirement-planning',
      title: z({
        en: 'How are you planning for retirement?',
        cy: "Sut ydych chi'n cynllunio at eich ymddeoliad?",
      }),
      type: 'multiple',
      description: z({
        en: 'Select all that apply',
        cy: "Dewiswch bopeth sy'n berthnasol",
      }),
      answers: [
        {
          text: z({
            en: "I have enough money set aside for retirement, so I'm no longer actively saving",
            cy: 'Mae gennyf ddigon o arian wrth gefn i ymddeol felly nid wyf yn arbed arian mwyach',
          }),
          score: 3,
          unselectedScore: 2,
          clearAll: false,
          showLinksIfSelected: false,
          links: [
            {
              title: z({
                en: 'Retirement planning: preparing for retirement checklist',
                cy: 'Cynllunio ymddeol: paratoi ar gyfer rhestr wirio ymddeol',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/checklist-things-to-do-as-retirement-approaches',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/checklist-things-to-do-as-retirement-approaches',
              }),
              type: 'article',
              description: z({
                en: "will help you make sure you're ready for retirement using a five-step guide.",
                cy: 'yn eich helpu i wneud yn siŵr eich bod yn barod ar gyfer ymddeoliad gan ddefnyddio canllaw pum cam.',
              }),
            },
          ],
        },
        {
          text: z({
            en: "I'm regularly saving into my pension",
            cy: "Rwy'n arbed arian yn rheolaidd ar gyfer fy mhensiwn",
          }),
          score: 3,
          unselectedScore: 2,
          clearAll: false,
          showLinksIfSelected: false,
          links: [
            {
              title: z({
                en: 'Advantages of saving into pensions over other things',
                cy: 'Manteision cynilo mewn pensiynau dros bethau eraill',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/why-save-into-a-pension',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/why-save-into-a-pension',
              }),
              type: 'article',
              description: z({
                en: "will explain why your State Pension might not be enough to live on and explain ways to make sure that you'll have enough to live comfortably in retirement.",
                cy: "yn esbonio pam efallai na fydd eich Pensiwn y Wladwriaeth yn ddigon i fyw arno ac yn esbonio ffyrdd o sicrhau y bydd gennych ddigon i fyw'n gyfforddus ar ôl ymddeol.",
              }),
            },
          ],
        },
        {
          text: z({
            en: 'I know what my expenses are likely to be when I retire',
            cy: "Rwy'n gwybod faint fydd fy nghostau pan fyddaf yn ymddeol",
          }),
          score: 3,
          unselectedScore: 2,
          clearAll: false,
          showLinksIfSelected: true,
          unselectedAnswerLinks: [
            {
              title: z({
                en: 'Retirement planning: preparing for retirement checklist',
                cy: 'Cynllunio ymddeol: paratoi ar gyfer rhestr wirio ymddeol',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/checklist-things-to-do-as-retirement-approaches',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/checklist-things-to-do-as-retirement-approaches',
              }),
              type: 'article',
              description: z({
                en: "will help you make sure you're ready for retirement using a five-step guide.",
                cy: 'yn eich helpu i wneud yn siŵr eich bod yn barod ar gyfer ymddeoliad gan ddefnyddio canllaw pum cam.',
              }),
            },
            {
              title: z({ en: 'Budget planner', cy: 'Cynlluniwr Cyllideb' }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner',
                cy: 'https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/budget-planner',
              }),
              type: 'tool',
              description: z({
                en: "will help you keep track of your money by working out exactly how much you’ve got coming in and where it's being spent.",
                cy: 'yn eich helpu i gadw golwg ar eich arian drwy gyfrifo faint yn union sydd gennych yn dod i mewn a ble mae’n cael ei wario.',
              }),
            },
          ],
          links: [
            {
              title: z({
                en: 'Retirement planning: preparing for retirement checklist',
                cy: 'Cynllunio ymddeol: paratoi ar gyfer rhestr wirio ymddeol',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/checklist-things-to-do-as-retirement-approaches',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/checklist-things-to-do-as-retirement-approaches',
              }),
              type: 'article',
              description: z({
                en: "will help you make sure you're ready for retirement using a five-step guide.",
                cy: 'yn eich helpu i wneud yn siŵr eich bod yn barod ar gyfer ymddeoliad gan ddefnyddio canllaw pum cam.',
              }),
            },
          ],
        },
        {
          text: z({
            en: 'I know how much money I’ll get from my pension when I retire',
            cy: "Rwy'n gwybod faint o arian y câf o'm pensiwn pan fyddaf wedi ymddeol",
          }),
          score: 3,
          unselectedScore: 2,
          clearAll: false,
          showLinksIfSelected: false,
          links: [
            {
              title: z({
                en: 'Pension calculator',
                cy: 'Cyfrifiannell pensiwn',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/pension-calculator',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/pension-calculator',
              }),
              type: 'tool',
              description: z({
                en: "will help you work out how much money you'll need in retirement, and offer suggestions if your projected pension income is less than ideal.",
                cy: 'yn eich helpu i gyfrifo faint o arian fydd ei angen arnoch ar ôl ymddeol, ac yn cynnig awgrymiadau os yw eich incwm pensiwn rhagamcanol yn llai na delfrydol.',
              }),
            },
          ],
        },
        {
          text: z({
            en: 'I’ve calculated when I can afford to retire based on how long I need my pension to last',
            cy: "Rwyf wedi cyfrifo pryd y gallaf fforddio ymddeol yn seiliedig ar ba mor hir fydd angen i'm pensiwn barhau",
          }),
          score: 3,
          unselectedScore: 2,
          clearAll: false,
          showLinksIfSelected: true,
          unselectedAnswerLinks: [
            {
              title: z({
                en: 'Pension savings timeline',
                cy: 'Llinell amser cynilion pensiwn',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/pension-savings-timeline',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/pension-savings-timeline',
              }),
              type: 'article',
              description: z({
                en: 'can guide you through how much to save at each stage of your life.',
                cy: "yn gallu eich arwain trwy faint i'w gynilo ar bob cam o'ch bywyd.",
              }),
            },
            {
              title: z({
                en: 'How long might your money need to last',
                cy: "Pa mor hir y gallai fod angen i'ch arian bara",
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/building-your-retirement-pot/how-long-might-your-money-need-to-last-in-retirement',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/building-your-retirement-pot/how-long-might-your-money-need-to-last-in-retirement',
              }),
              type: 'article',
              description: z({
                en: "will help you work out how much money you'll need to live comfortable throughout your retirement. ",
                cy: "yn eich helpu i weithio allan faint o arian fydd ei angen arnoch i fyw'n gyfforddus trwy gydol eich ymddeoliad.",
              }),
            },
          ],
          links: [
            {
              title: z({
                en: 'Retirement planning: preparing for retirement checklist',
                cy: 'Cynllunio ymddeol: paratoi ar gyfer rhestr wirio ymddeol',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/checklist-things-to-do-as-retirement-approaches',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/checklist-things-to-do-as-retirement-approaches',
              }),
              type: 'article',
              description: z({
                en: "will help you make sure you're ready for retirement using a five-step guide.",
                cy: 'yn eich helpu i wneud yn siŵr eich bod yn barod ar gyfer ymddeoliad gan ddefnyddio canllaw pum cam.',
              }),
            },
          ],
        },
        {
          text: z({ en: 'None of the above', cy: "Dim un o'r uchod" }),
          score: 1,
          clearAll: true,
          showLinksIfSelected: true,
          links: [
            {
              title: z({
                en: 'Retirement planning: preparing for retirement checklist',
                cy: 'Cynllunio ymddeol: paratoi ar gyfer rhestr wirio ymddeol',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/checklist-things-to-do-as-retirement-approaches',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/checklist-things-to-do-as-retirement-approaches',
              }),
              type: 'article',
              description: z({
                en: "will help you make sure you're ready for retirement using a five-step guide.",
                cy: 'yn eich helpu i wneud yn siŵr eich bod yn barod ar gyfer ymddeoliad gan ddefnyddio canllaw pum cam.',
              }),
            },
            {
              title: z({
                en: 'Advantages of saving into pensions over other things',
                cy: 'Manteision cynilo mewn pensiynau dros bethau eraill',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/why-save-into-a-pension',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/why-save-into-a-pension',
              }),
              type: 'article',
              description: z({
                en: "will explain why your State Pension might not be enough to live on and explain ways to make sure that you'll have enough to live comfortably in retirement.",
                cy: "yn esbonio pam efallai na fydd eich Pensiwn y Wladwriaeth yn ddigon i fyw arno ac yn esbonio ffyrdd o sicrhau y bydd gennych ddigon i fyw'n gyfforddus ar ôl ymddeol.",
              }),
            },
            {
              title: z({ en: 'Budget planner', cy: 'Cynlluniwr Cyllideb' }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner',
                cy: 'https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/budget-planner',
              }),
              type: 'tool',
              description: z({
                en: "will help you keep track of your money by working out exactly how much you’ve got coming in and where it's being spent.",
                cy: 'yn eich helpu i gadw golwg ar eich arian drwy gyfrifo faint yn union sydd gennych yn dod i mewn a ble mae’n cael ei wario.',
              }),
            },
            {
              title: z({
                en: 'Pension calculator',
                cy: 'Cyfrifiannell pensiwn',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/pension-calculator',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/pension-calculator',
              }),
              type: 'tool',
              description: z({
                en: "will help you work out how much money you'll need in retirement, and offer suggestions if your projected pension income is less than ideal.",
                cy: 'yn eich helpu i gyfrifo faint o arian fydd ei angen arnoch ar ôl ymddeol, ac yn cynnig awgrymiadau os yw eich incwm pensiwn rhagamcanol yn llai na delfrydol.',
              }),
            },
            {
              title: z({
                en: 'Pension savings timeline',
                cy: 'Llinell amser cynilion pensiwn',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/pension-savings-timeline',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/pension-savings-timeline',
              }),
              type: 'article',
              description: z({
                en: 'can guide you through how much to save at each stage of your life.',
                cy: "yn gallu eich arwain trwy faint i'w gynilo ar bob cam o'ch bywyd.",
              }),
            },
            {
              title: z({
                en: 'How long might your money need to last',
                cy: "Pa mor hir y gallai fod angen i'ch arian bara",
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/building-your-retirement-pot/how-long-might-your-money-need-to-last-in-retirement',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/building-your-retirement-pot/how-long-might-your-money-need-to-last-in-retirement',
              }),
              type: 'article',
              description: z({
                en: "will help you work out how much money you'll need to live comfortable throughout your retirement. ",
                cy: "yn eich helpu i weithio allan faint o arian fydd ei angen arnoch i fyw'n gyfforddus trwy gydol eich ymddeoliad.",
              }),
            },
          ],
        },
      ],
    },
    {
      questionNbr: 15,
      group: 'retirement-accomodation-planning',
      title: z({
        en: 'Where do you plan to live when you retire?',
        cy: "Ble ydych chi'n bwriadu byw pan fyddwch chi'n ymddeol?",
      }),
      type: 'single',
      answers: [
        {
          text: z({
            en: 'In my mortgage-free home',
            cy: 'Yn fy nghartref di-forgais',
          }),
          score: 3,
          clearAll: false,
          links: [
            {
              title: z({
                en: 'Guidance for home-owners',
                cy: 'Arweiniad i berchnogion tai',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/homes',
                cy: 'https://www.moneyhelper.org.uk/cy/homes',
              }),
              type: 'article',
              description: z({
                en: 'looks at all the guidance you might need about housing costs.',
                cy: 'yn edrych ar yr holl arweiniad y gallai fod eu hangen arnoch am gostau tai.',
              }),
            },
          ],
        },
        {
          text: z({
            en: 'In my own home, but I’ll still be paying off the mortgage',
            cy: 'Yn fy nghartref fy hun, ond byddaf yn dal i dalu’r morgais',
          }),
          score: 2,
          clearAll: false,
          links: [
            {
              title: z({
                en: 'Paying off your mortgage',
                cy: 'Talu eich morgais',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/should-you-pay-off-your-mortgage-early',
                cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/should-you-pay-off-your-mortgage-early',
              }),
              type: 'article',
              description: z({
                en: 'will set out the pros and cons of using extra savings to clear your mortgage. ',
                cy: 'yn nodi’r manteision a’r anfanteision o ddefnyddio cynilion ychwanegol i glirio’ch morgais.',
              }),
            },
          ],
        },
        {
          text: z({
            en: "In a home I haven't bought yet",
            cy: "Mewn cartref nad wyf wedi'i brynu eto",
          }),
          score: 2,
          clearAll: false,
          links: [
            {
              title: z({
                en: 'Saving money for a mortgage deposit',
                cy: 'Cynilo arian ar gyfer blaendal morgais',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/saving-money-for-a-mortgage-deposit',
                cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/saving-money-for-a-mortgage-deposit',
              }),
              type: 'article',
              description: z({
                en: 'suggests ways to save for a house deposit and find the right mortgage for you.',
                cy: 'yn awgrymu ffyrdd o gynilo ar gyfer blaendal tŷ a dod o hyd i’r morgais cywir i chi.',
              }),
            },
          ],
        },
        {
          text: z({
            en: 'I’ll continue to rent privately',
            cy: 'Byddaf yn parhau i rentu’n breifat',
          }),
          score: 2,
          clearAll: false,
          links: [
            {
              title: z({
                en: 'Guidance for renters',
                cy: 'Arweiniad i rentwyr',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/homes/renting',
                cy: 'https://www.moneyhelper.org.uk/cy/homes/renting',
              }),
              type: 'article',
              description: z({
                en: 'provides guidance on the costs involved with renting.',
                cy: "yn rhoi arweiniad ar y costau sy'n gysylltiedig â rhentu.",
              }),
            },
          ],
        },
        {
          text: z({
            en: 'I’ll continue to rent in social housing',
            cy: 'Byddaf yn parhau i rentu mewn tai cymdeithasol',
          }),
          score: 3,
          clearAll: false,
          links: [
            {
              title: z({
                en: 'Universal credit and renting',
                cy: 'Credyd cynhwysol a rhentu',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/benefits/benefits-to-help-with-housing-costs/universal-credit-and-paying-rent',
                cy: 'https://www.moneyhelper.org.uk/cy/benefits/benefits-to-help-with-housing-costs/universal-credit-and-paying-rent',
              }),
              type: 'article',
              description: z({
                en: 'can help you allocate money for rent from your benefits payments.',
                cy: "Gall eich helpu i ddyrannu arian ar gyfer rhent o'ch taliadau budd-daliadau.",
              }),
            },
          ],
        },
        {
          text: z({
            en: 'I’ll sell my existing home and rent or buy a smaller home with the profit',
            cy: 'Byddaf yn gwerthu fy nghartref presennol ac yn rhentu neu brynu cartref llai gyda’r elw',
          }),
          score: 1,
          clearAll: false,
          links: [
            {
              title: z({
                en: 'Downsizing your home in retirement',
                cy: 'Lleihau eich cartref ar ôl ymddeol',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk',
                cy: 'https://www.moneyhelper.org.uk',
              }),
              type: 'article',
              description: z({
                en: 'will set out the pros and cons of downsizing as part of your retirement plan.',
                cy: 'No translation',
              }),
            },
          ],
        },
        {
          text: z({ en: "I'm not sure", cy: 'Nid wyf yn siŵr' }),
          score: 1,
          clearAll: true,
          links: [
            {
              title: z({
                en: 'Retirement planning: preparing for retirement checklist',
                cy: 'Cynllunio ymddeol: paratoi ar gyfer rhestr wirio ymddeol',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/checklist-things-to-do-as-retirement-approaches',
                cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/checklist-things-to-do-as-retirement-approaches',
              }),
              type: 'article',
              description: z({
                en: "will help you make sure you're ready for retirement using a five-step guide.",
                cy: 'yn eich helpu i wneud yn siŵr eich bod yn barod ar gyfer ymddeoliad gan ddefnyddio canllaw pum cam.',
              }),
            },
          ],
        },
      ],
    },
    {
      questionNbr: 16,
      group: 'no-emergency-savings',
      title: z({
        en: 'Do you have savings goals?',
        cy: 'Oes gennych chi nodau cynilo?',
      }),
      type: 'single',
      answers: [
        {
          text: z({
            en: 'Yes, and a plan to achieve them',
            cy: "Oes, a chynllun i'w cyflawni",
          }),
          score: 3,
          clearAll: false,
        },
        {
          text: z({
            en: "Yes, but I don't know how to achieve them",
            cy: "Oes, ond nid wyf yn gwybod sut i'w cyflawni",
          }),
          score: 1,
          clearAll: false,
          links: [
            {
              title: z({
                en: 'How to set a savings goal',
                cy: 'Sut i bennu nod cynilo',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/savings/types-of-savings/how-to-set-a-savings-goal',
                cy: 'https://www.moneyhelper.org.uk/cy/savings/types-of-savings/how-to-set-a-savings-goal',
              }),
              type: 'article',
              description: z({
                en: 'will explain how to start saving and reach your goal.',
                cy: 'yn esbonio sut i ddechrau cynilo a chyrraedd eich nod',
              }),
            },
          ],
        },
        {
          text: z({
            en: 'No, even though I can afford to save',
            cy: 'Na, er fy mod yn gallu fforddio cynilo',
          }),
          score: 2,
          clearAll: false,
          links: [
            {
              title: z({
                en: 'Emergency savings - how much is enough?',
                cy: 'Cynilion ar gyfer argyfwng - faint sy’n ddigon?',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/savings/types-of-savings/emergency-savings-how-much-is-enough',
                cy: 'https://www.moneyhelper.org.uk/cy/savings/types-of-savings/emergency-savings-how-much-is-enough',
              }),
              type: 'article',
              description: z({
                en: 'will help you build a financial buffer that ensures you can pay for unexpected costs.',
                cy: "yn eich helpu i adeiladu byffer ariannol sy'n sicrhau y gallwch dalu am gostau annisgwyl.",
              }),
            },
          ],
        },
        {
          text: z({
            en: "No, and I can't afford to save",
            cy: 'Na, ac ni allaf fforddio cynilo',
          }),
          score: 1,
          clearAll: false,
          links: [
            {
              title: z({
                en: 'Living on a squeezed income',
                cy: 'Byw ar incwm gwasgedig',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/money-troubles/cost-of-living/squeezed-income',
                cy: 'https://www.moneyhelper.org.uk/cy/money-troubles/cost-of-living/squeezed-income',
              }),
              type: 'article',
              description: z({
                en: 'will outline ways to make your income go further, even in difficult circumstances.',
                cy: "yn amlinellu ffyrdd o wneud i'ch incwm fynd ymhellach, hyd yn oed mewn amgylchiadau anodd.",
              }),
            },
          ],
        },
      ],
    },
    {
      questionNbr: 17,
      group: 'no-emergency-savings',
      title: z({
        en: 'Do you have any non-emergency savings or investments?',
        cy: 'A oes gennych unrhyw gynilion neu fuddsoddiadau nad ydynt yn rhai brys?',
      }),
      definition: z({
        en: "Non-emergency savings and investments can help you buy 'optional' purchases.",
        cy: " Gall cynilion a buddsoddiadau nad ydynt yn rhai brys eich helpu i brynu pryniannau 'dewisol'.",
      }),
      type: 'single',
      answers: [
        {
          text: z({
            en: 'Yes, I keep them in a savings or current account I can easily access',
            cy: "Ydw, rwy'n eu cadw mewn cyfrif cynilo neu gyfrif cyfredol y gallaf ei gyrchu'n hawdd",
          }),
          score: 2,
          clearAll: false,
          links: [
            {
              title: z({
                en: 'Should I save or invest?',
                cy: 'A ddylwn i gynilo neu fuddsoddi?',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/savings/how-to-save/should-i-save-or-invest',
                cy: 'https://www.moneyhelper.org.uk/cy/savings/how-to-save/should-i-save-or-invest',
              }),
              type: 'article',
              description: z({
                en: 'will help you plan for short-term savings and long-term investments. ',
                cy: 'yn eich helpu i gynllunio ar gyfer cynilion tymor byr a buddsoddiadau hirdymor.',
              }),
            },
          ],
        },
        {
          text: z({
            en: "Yes, my savings are held in accounts I can't easily access, such as fixed-rate bonds or stocks and shares",
            cy: "Ydyn, mae fy nghynilion yn cael eu cadw mewn cyfrifon na allaf eu cyrchu'n hawdd, megis bondiau cyfradd sefydlog neu stociau a chyfranddaliadau",
          }),
          score: 2,
          clearAll: false,
          links: [
            {
              title: z({
                en: "Beginner's guide to investing",
                cy: 'Canllaw dechreuwyr i fuddsoddi',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/savings/investing/investing-beginners-guide',
                cy: 'https://www.moneyhelper.org.uk/cy/savings/investing/investing-beginners-guide',
              }),
              type: 'article',
              description: z({
                en: 'explains what investments are and how to start.',
                cy: 'yn esbonio beth yw buddsoddiadau a sut i ddechrau.',
              }),
            },
            {
              title: z({
                en: 'Understanding the risks of investing',
                cy: 'Deall risgiau buddsoddi',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/savings/investing/thinking-about-investing-make-sure-you-understand-the-risks',
                cy: 'https://www.moneyhelper.org.uk/cy/savings/investing/thinking-about-investing-make-sure-you-understand-the-risks',
              }),
              type: 'article',
              description: z({
                en: 'explains the financial risks in investing, as well as the potential gains.',
                cy: "yn esbonio'r risgiau ariannol wrth fuddsoddi, yn ogystal â'r enillion posibl.",
              }),
            },
          ],
        },
        {
          text: z({
            en: 'Yes, I have several different types of savings and investments',
            cy: 'Oes, mae gen i sawl math gwahanol o gynilion a buddsoddiadau',
          }),
          score: 3,
          clearAll: false,
          links: [
            {
              title: z({
                en: 'How to find a financial advisor',
                cy: 'Sut i ddod o hyd i gynghorydd ariannol',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/getting-help-and-advice/financial-advisers',
                cy: 'https://www.moneyhelper.org.uk/cy/getting-help-and-advice/financial-advisers',
              }),
              type: 'article',
              description: z({
                en: 'will explain how financial advice works, the types of advisers to choose from, and when it might be a good idea to speak to one.',
                cy: 'yn esbonio sut mae cyngor ariannol yn gweithio, y mathau o gynghorwyr i ddewis ohonynt, a phryd y gallai fod yn syniad da siarad ag un.',
              }),
            },
          ],
        },
        {
          text: z({ en: "No, I don't have any", cy: 'Na, nid oes gen i ddim' }),
          score: 1,
          clearAll: false,
          links: [
            {
              title: z({
                en: 'How to set a savings goal',
                cy: 'Sut i bennu nod cynilo',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/savings/types-of-savings/how-to-set-a-savings-goal',
                cy: 'https://www.moneyhelper.org.uk/cy/savings/types-of-savings/how-to-set-a-savings-goal',
              }),
              type: 'article',
              description: z({
                en: 'will explain how to start saving and reach your goal.',
                cy: 'yn esbonio sut i ddechrau cynilo a chyrraedd eich nod',
              }),
            },
            {
              title: z({
                en: 'Instant access savings accounts',
                cy: 'Cyfrifon cynilo dim rhybudd',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/savings/types-of-savings/instant-access-savings-accounts',
                cy: 'https://www.moneyhelper.org.uk/cy/savings/types-of-savings/instant-access-savings-accounts',
              }),
              type: 'article',
              description: z({
                en: 'offers guidance on how to open a savings account, and which account is right for your goals.',
                cy: "yn cynnig arweiniad ar sut i agor cyfrif cynilo, a pha gyfrif sy'n iawn ar gyfer eich nodau.",
              }),
            },
          ],
        },
      ],
    },
    {
      questionNbr: 18,
      group: 'no-emergency-savings',
      title: z({
        en: 'Which of the following statements about keeping your money safe apply to you?',
        cy: "Pa un o'r datganiadau canlynol am gadw'ch arian yn ddiogel sy'n berthnasol i chi?",
      }),
      type: 'multiple',
      description: z({
        en: 'Select all that apply',
        cy: "Dewiswch bopeth sy'n berthnasol",
      }),
      target: '/change-options',
      answers: [
        {
          text: z({
            en: 'I know how to avoid pension, savings and investment scams. I know where to go for help if I need it.',
            cy: "Rwy’n gwybod sut i osgoi sgamiau pensiwn, cynilion a buddsoddi. Rwy'n gwybod ble i fynd am help os bydd ei angen arnaf.",
          }),
          score: 3,
          unselectedScore: 2,

          clearAll: false,
          showLinksIfSelected: false,
          links: [
            {
              title: z({ en: 'How to avoid scams', cy: 'Sut i osgoi sgamiau' }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/money-troubles/scams',
                cy: 'https://www.moneyhelper.org.uk/cy/money-troubles/scams',
              }),
              type: 'article',
              description: z({
                en: 'will help you spot scams, and tell you who to contact if someone steals your money.',
                cy: 'yn eich helpu i ganfod sgamiau, ac yn dweud wrthych pwy i gysylltu â nhw os bydd rhywun yn dwyn eich arian.',
              }),
            },
          ],
        },
        {
          text: z({
            en: 'I know what protections are in place for my pension(s), savings and/or investments.',
            cy: 'Rwy’n gwybod pa amddiffyniadau sydd ar waith ar gyfer fy mhensiwn(pensiynau), cynilion a/neu fuddsoddiadau.',
          }),
          score: 3,
          unselectedScore: 2,
          clearAll: false,
          showLinksIfSelected: false,
          links: [
            {
              title: z({
                en: 'How safe are my savings?',
                cy: 'Pa mor ddiogel yw fy nghynilion?',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/money-troubles/money-problems-and-complaints/compensation-if-your-bank-or-building-society-goes-bust',
                cy: 'https://www.moneyhelper.org.uk/cy/money-troubles/money-problems-and-complaints/compensation-if-your-bank-or-building-society-goes-bust',
              }),
              type: 'article',
              description: z({
                en: 'will take you through how to claim compensation if your bank or building society goes bust. ',
                cy: "yn eich tywys trwy sut i hawlio iawndal os aiff eich banc neu gymdeithas adeiladu i'r wal.",
              }),
            },
          ],
        },
        {
          text: z({
            en: 'I know what I’d do if my pension(s), savings and/or investments started to lose value because of market conditions.',
            cy: 'Rwy’n gwybod beth fyddwn i’n ei wneud pe bai fy mhensiwn(pensiynau), cynilion a/neu fuddsoddiadau yn dechrau colli gwerth oherwydd amodau’r farchnad.',
          }),
          score: 3,
          unselectedScore: 2,
          clearAll: false,
          showLinksIfSelected: false,
          links: [
            {
              title: z({
                en: 'Inflation - what does it mean for your savings',
                cy: 'Chwyddiant – beth mae’n golygu ar gyfer eich cynilion',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/savings/how-to-save/inflation-what-the-saver-needs-to-know',
                cy: 'https://www.moneyhelper.org.uk/cy/savings/how-to-save/inflation-what-the-saver-needs-to-know',
              }),
              type: 'article',
              description: z({
                en: 'will explain how inflation can affect both your savings and investments.',
                cy: "yn esbonio sut y gall chwyddiant effeithio ar eich cynilion a'ch buddsoddiadau.",
              }),
            },
          ],
        },
        {
          text: z({ en: 'None of the above', cy: "Dim un o'r uchod" }),
          score: 1,
          clearAll: true,
          showLinksIfSelected: true,
          links: [
            {
              title: z({
                en: 'Inflation - what does it mean for your savings',
                cy: 'Chwyddiant – beth mae’n golygu ar gyfer eich cynilion',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/savings/how-to-save/inflation-what-the-saver-needs-to-know',
                cy: 'https://www.moneyhelper.org.uk/cy/savings/how-to-save/inflation-what-the-saver-needs-to-know',
              }),
              type: 'article',
              description: z({
                en: 'will explain how inflation can affect both your savings and investments.',
                cy: "yn esbonio sut y gall chwyddiant effeithio ar eich cynilion a'ch buddsoddiadau.",
              }),
            },
            {
              title: z({
                en: 'How safe are my savings?',
                cy: 'Pa mor ddiogel yw fy nghynilion?',
              }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/money-troubles/money-problems-and-complaints/compensation-if-your-bank-or-building-society-goes-bust',
                cy: 'https://www.moneyhelper.org.uk/cy/money-troubles/money-problems-and-complaints/compensation-if-your-bank-or-building-society-goes-bust',
              }),
              type: 'article',
              description: z({
                en: 'will take you through how to claim compensation if your bank or building society goes bust. ',
                cy: "yn eich tywys trwy sut i hawlio iawndal os aiff eich banc neu gymdeithas adeiladu i'r wal.",
              }),
            },
            {
              title: z({ en: 'How to avoid scams', cy: 'Sut i osgoi sgamiau' }),
              link: z({
                en: 'https://www.moneyhelper.org.uk/en/money-troubles/scams',
                cy: 'https://www.moneyhelper.org.uk/cy/money-troubles/scams',
              }),
              type: 'article',
              description: z({
                en: 'will help you spot scams, and tell you who to contact if someone steals your money.',
                cy: 'yn eich helpu i ganfod sgamiau, ac yn dweud wrthych pwy i gysylltu â nhw os bydd rhywun yn dwyn eich arian.',
              }),
            },
          ],
        },
      ],
    },
  ];
};

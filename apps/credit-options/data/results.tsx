import { Level, Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { TranslationGroupString } from '@maps-react/form/types';
import { TranslationGroup } from '@maps-react/hooks/types';
import { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface ExpandableSectionData {
  intro: TranslationGroup;
  sections?: {
    props: any;
    component: string;
  }[];
  bottomParagraph: TranslationGroup;
}

interface Condition {
  question: string;
  answer: string;
  arithmeticOperator?: string;
}

export interface Section {
  id: string;
  title?: {
    text: TranslationGroupString;
    level?: Level;
  };
  intro?: TranslationGroupString;
  content: {
    contentTitle: TranslationGroupString;
    contentNode?: TranslationGroup;
    component?: string;
    expandable?: ExpandableSectionData;
    conditions?: Condition[];
  }[];
  contentWrapper?: string;
}

type Sections = {
  section: Section[];
  labelClosed: TranslationGroupString;
  labelOpen: TranslationGroupString;
};

type Data = {
  title: TranslationGroupString;
  intro: TranslationGroupString;
  noResultsIntro: TranslationGroup;
  noResultMainContent: TranslationGroup;
  sections: Sections;
};

type sectionIntro = {
  readonly en: string | ReactNode;
  readonly cy: string | ReactNode;
};

const sectionContent = (
  contentTitle: TranslationGroupString,
  intro: sectionIntro,
  interestRateValue: TranslationGroupString,
  creditScoreValue: TranslationGroupString,
  feesValue: TranslationGroupString,
  repayEarlyValue: TranslationGroupString,
  pros: TranslationGroupString[],
  cons: TranslationGroupString[],
  bottomParagraph: TranslationGroup,
  conditions: Condition[],
) => ({
  contentTitle: contentTitle,
  component: 'Card',
  expandable: {
    intro,
    sections: [
      {
        component: 'ColumnStrip',
        props: {
          details: [
            {
              title: {
                en: 'Typical interest rates',
                cy: 'Cyfradd llog nodweddiadol',
              },
              value: interestRateValue,
            },
            {
              title: {
                en: 'Required credit score',
                cy: 'Sgôr credyd gofynnol',
              },
              value: creditScoreValue,
            },
            {
              title: {
                en: 'Fees & penalties',
                cy: 'Ffioedd a chosbau',
              },
              value: feesValue,
            },
            {
              title: {
                en: 'Can you repay early?',
                cy: "Allwch chi dalu'n gynnar?",
              },
              value: repayEarlyValue,
            },
          ],
        },
      },
      {
        component: 'ProsConsCards',
        props: {
          prosTitle: {
            en: 'Pros',
            cy: 'Manteision',
          },
          consTitle: {
            en: 'Cons',
            cy: 'Anfanteision',
          },
          pros: pros,
          cons: cons,
        },
      },
    ],
    bottomParagraph: bottomParagraph,
  },
  conditions: conditions,
});

const section: Section[] = [
  {
    id: '0',
    content: [
      {
        contentTitle: {
          en: 'Struggling with debt?',
          cy: 'Cael trafferth gyda dyledion?',
        },
        contentNode: {
          en: (
            <>
              <Heading level="h5" component="span">
                Struggling with debt?
              </Heading>
              <Paragraph className="pt-4">
                If you&apos;re struggling, borrowing more might seem your only
                option. But it can make things worse. You&apos;re not alone and
                help is available. See{' '}
                <Link
                  asInlineText={true}
                  href="https://www.moneyhelper.org.uk/en/money-troubles/dealing-with-debt/help-if-youre-struggling-with-debt"
                >
                  Help if you&apos;re struggling with debt
                </Link>
                .
              </Paragraph>
            </>
          ),
          cy: (
            <>
              <Heading level="h5" component="span">
                Cael trafferth gyda dyledion?
              </Heading>
              <Paragraph className="pt-4">
                Os ydych yn cael trafferth, efallai y bydd benthyca mwy yn
                ymddangos fel eich unig opsiwn. Ond mae&apos;n gallu gwneud
                pethau&apos;n waeth. Dydych chi ddim ar eich pen eich hun ac mae
                help ar gael. Gweler{' '}
                <Link
                  asInlineText={true}
                  href="https://www.moneyhelper.org.uk/cy/money-troubles/dealing-with-debt/help-if-youre-struggling-with-debt"
                >
                  Help os ydych yn cael trafferth gyda dyledion
                </Link>
                yn gyntaf.{' '}
              </Paragraph>
            </>
          ),
        },
        component: 'CardGray',
        conditions: [
          {
            question: '2',
            answer: '!0',
          },
          {
            question: '2',
            answer: '!1',
          },
          {
            question: '2',
            answer: '!4',
          },
        ],
      },
    ],
  },
  {
    id: '1',
    content: [
      {
        contentTitle: {
          en: 'You might need a good credit score for some of these options',
          cy: "Efallai y byddwch angen sgôr credyd da ar gyfer rhai o'r opsiynau hyn",
        },
        contentNode: {
          en: (
            <Paragraph>
              We&apos;re showing you all the options, but some might not be
              available to you depending on your credit score. Before applying,
              it&apos;s important to{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/credit/how-to-improve-your-credit-score#how-to-check-and-improve-your-credit-report"
              >
                check your free credit report
              </Link>{' '}
              and use{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/credit/how-to-improve-your-credit-score#applying-for-credit"
              >
                eligibility calculators
              </Link>{' '}
              to see your chances of being accepted.
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Rydym yn dangos yr holl opsiynau i chi, ond efallai na fydd rhai
              ar gael i chi yn dibynnu ar eich sgôr credyd. Cyn gwneud cais,
              mae&apos;n bwysig{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/everyday-money/credit/how-to-improve-your-credit-score#how-to-check-and-improve-your-credit-report"
              >
                gwirio eich adroddiad credyd am ddim
              </Link>{' '}
              a defnyddio{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/everyday-money/credit/how-to-improve-your-credit-score#applying-for-credit"
              >
                cyfrifianellau cymhwysedd
              </Link>{' '}
              i weld eich siawns o gael eich derbyn.
            </Paragraph>
          ),
        },
        component: 'Card',
        conditions: [
          {
            question: '6',
            answer: '3',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    title: {
      text: {
        en: 'Widely available options',
        cy: 'Opsiynau sydd ar gael yn eang',
      },
      level: 'h2',
    },
    intro: {
      en: 'Many lenders offer these products, including most high street banks and building societies. So there are generally lots of options and deals to choose from.',
      cy: 'Mae llawer o fenthycwyr yn cynnig y cynhyrchion hyn, gan gynnwys y rhan fwyaf o fanciau y stryd fawr a chymdeithasau adeiladu. Felly, fel arfer mae llawer o opsiynau a chynigion i ddewis ohonynt.',
    },
    content: [
      //0% spending credit card
      sectionContent(
        { en: '0% spending credit card', cy: 'Cerdyn credyd gwario 0%' }, //content title
        {
          en: 'A special type of credit card that charges no interest on things you buy - usually for a number of months or years.',
          cy: 'Math o gerdyn credyd arbennig  sydd ddim yn codi llog ar bethau rydych yn eu prynu - fel arfer am nifer o fisoedd neu flynyddoedd. ',
        }, // intro
        {
          en: '0% for up to 2 years',
          cy: '0% am hyd at 2 flynedd',
        }, // interest rate value
        {
          en: 'Ok to excellent',
          cy: 'Iawn i ardderchog',
        }, // credit score value
        {
          en: 'Yes, see cons',
          cy: 'Oes, gweler anfanteision',
        }, // fees value
        {
          en: 'Yes',
          cy: 'Gallwch',
        }, // repay early value
        [
          {
            en: 'No cost if you repay before the interest-free period ends',
            cy: "Dim cost os byddwch yn ad-dalu cyn i'r cyfnod di-log ddod i ben",
          },
          {
            en: 'Can repay early',
            cy: 'Gellir ad-dalu’n gynnar',
          },
          {
            en: 'Usually get free Section 75 protection if something costs £100 to £30,000',
            cy: 'Fel arfer yn cael amddiffyniad Adran 75 am ddim os yw rhywbeth yn costio £100 i £30,000',
          },
          {
            en: 'Eligibility calculators show your chances of being accepted before applying',
            cy: 'Mae cyfrifianellau cymhwysedd yn dangos eich siawns o gael eich derbyn cyn gwneud cais',
          },
        ], // pros
        [
          {
            en: "You'll pay expensive interest on anything after the 0% period ends",
            cy: "Byddwch yn talu llog drud ar unrhyw beth ar ôl i'r cyfnod 0% ddod i ben",
          },
          {
            en: 'You must pay the minimum monthly repayment to avoid fees and keep the 0% deal',
            cy: "Rhaid i chi dalu isafswm yr ad-daliad misol i osgoi ffioedd a chadw'r fargen 0%",
          },
          {
            en: "You can't spend more than your agreed credit limit",
            cy: "Ni allwch wario mwy na'ch terfyn credyd y cytunwyd arno",
          },
        ], // cons
        {
          en: (
            <Paragraph>
              Read more about{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/credit/simple-guide-to-credit-cards#Different-types-of-credit-cards-explained"
              >
                0% spending credit cards
              </Link>{' '}
              or compare options at{' '}
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/eligibility/credit-cards/search/?goal=CC_PURCHASE"
              >
                MoneySavingExpert
              </Link>
              ,{' '}
              <Link asInlineText={true} href="https://www.creditkarma.co.uk/">
                Credit Karma
              </Link>{' '}
              and{' '}
              <Link asInlineText={true} href="https://www.clearscore.com/">
                ClearScore
              </Link>
              .
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Darllenwch fwy am{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/everyday-money/credit/simple-guide-to-credit-cards#Esbonio-gwahanol-fathau-o-gardiau-credyd"
              >
                gardiau credyd gwario 0%
              </Link>{' '}
              neu gymharu opsiynau yn{' '}
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/eligibility/credit-cards/search/?goal=CC_PURCHASE"
              >
                MoneySavingExpert
              </Link>
              ,{' '}
              <Link asInlineText={true} href="https://www.creditkarma.co.uk/">
                Credyd Karma
              </Link>{' '}
              a{' '}
              <Link asInlineText={true} href="https://www.clearscore.com/">
                ClearScore
              </Link>
              .
            </Paragraph>
          ),
        }, // bottom paragraph
        [
          {
            question: '1', // How much do you need to borrow
            answer: '10000', // Less than 10,000
            arithmeticOperator: '<=', // Operator sent separate to value
          },
          {
            question: '2', // What do you need the money for?
            answer: '!2', // Not - Pay off (consolidate) debt
          },
          {
            question: '3', // How long could you wait for the money?
            answer: '2', // A week or more
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!4', // Not - Over 2 years
          },
          {
            question: '5', // Have you ever been refused credit?
            answer: '1', // No
          },
          {
            question: '6', // How good is your credit score?
            answer: '!2', // Not - Poor
          },
        ], // conditions
      ),
      //0% money transfer credit card
      sectionContent(
        {
          en: '0% money transfer credit card',
          cy: 'Cerdyn credyd trosglwyddo arian 0%',
        }, //content title
        {
          en: 'This lets you transfer your credit card balance to your bank account as cash. This is helpful if you’re unable to pay on card or to pay off an overdraft. You’ll pay a one-off fee but will pay no interest for a number of months.  ',
          cy: "Mae hyn yn caniatáu i chi drosglwyddo balans eich cerdyn credyd i'ch cyfrif banc fel arian parod. Mae hyn yn ddefnyddiol os na allwch dalu ar gerdyn neu dalu gorddrafft. Byddwch yn talu ffi unwaith ac am byth ond ni fyddwch yn talu llog am nifer o fisoedd.",
        }, // intro
        {
          en: '0% for up to 1 year',
          cy: '0% am hyd at 1 flwyddyn',
        }, // interest rate value
        {
          en: 'Ok to excellent',
          cy: 'Iawn i ardderchog',
        }, // credit score value
        {
          en: 'Yes, see cons',
          cy: 'Oes, gweler anfanteision',
        }, // fees value
        {
          en: 'Yes',
          cy: 'Gallwch',
        }, // repay early value
        [
          {
            en: 'Low cost if you repay before the interest-free period ends',
            cy: "Cost isel os byddwch yn ad-dalu cyn i'r cyfnod di-log ddod i ben",
          },
          {
            en: 'Can repay early',
            cy: 'Gellir ad-dalu’n gynnar',
          },
          {
            en: 'Eligibility calculators show your chances of being accepted before applying',
            cy: 'Mae cyfrifianellau cymhwysedd yn dangos eich siawns o gael eich derbyn cyn gwneud cais',
          },
        ], // pros
        [
          {
            en: 'You’ll pay a transfer fee, often up to 4% of the amount you’re transferring',
            cy: "Byddwch yn talu ffi trosglwyddo, yn aml hyd at 4% o'r swm rydych yn ei drosglwyddo",
          },
          {
            en: 'You’ll pay expensive interest on anything after the 0% period ends, or if you spend on it',
            cy: "Byddwch yn talu llog drud ar unrhyw beth ar ôl i'r cyfnod 0% ddod i ben, neu os ydych yn gwario arno",
          },
          {
            en: 'You must pay the minimum monthly repayment to avoid fees and penalties',
            cy: 'Rhaid i chi dalu isafswm yr ad-daliad misol i osgoi ffioedd a chosbau',
          },
          {
            en: 'You usually can’t transfer more than 90% of your agreed credit limit',
            cy: "Fel arfer, ni allwch drosglwyddo mwy na 90% o'ch terfyn credyd y cytunwyd arno.",
          },
        ], // cons
        {
          en: (
            <Paragraph>
              Read more about{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/credit/deciding-whether-to-transfer-your-credit-card-balance#Making-a-money-transfer"
              >
                0% money transfer credit cards
              </Link>{' '}
              or compare options at{' '}
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/eligibility/credit-cards/search/?goal=CC_MONEYTRANSFER"
              >
                MoneySavingExpert
              </Link>
              , and{' '}
              <Link
                asInlineText={true}
                href="https://www.uswitch.com/credit-cards/money-transfer-credit-card/"
              >
                uSwitch
              </Link>
              .
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Darllenwch fwy am{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/everyday-money/credit/deciding-whether-to-transfer-your-credit-card-balance#Making-a-money-transfer"
              >
                gardiau credyd trosglwyddo arian 0%
              </Link>{' '}
              neu gymharu opsiynau yn{' '}
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/eligibility/credit-cards/search/?goal=CC_MONEYTRANSFER"
              >
                MoneySavingExpert
              </Link>{' '}
              a{' '}
              <Link
                asInlineText={true}
                href="https://www.uswitch.com/credit-cards/money-transfer-credit-card/"
              >
                uSwitch
              </Link>
              .
            </Paragraph>
          ),
        }, // bottom paragraph
        [
          {
            question: '1', // How much do you need to borrow
            answer: '10000', // Less than 10,000
            arithmeticOperator: '<=', // Operator sent separate to value
          },
          //Q2 - What do you need the money for? - All answers
          {
            question: '3', // How long could you wait for the money?
            answer: '2', // A week or more
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!3', // Not - Over 1 years
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!4', // Not - Over 1 years
          },
          {
            question: '5', // Have you ever been refused credit?
            answer: '1', // No
          },
          {
            question: '6', // How good is your credit score?
            answer: '!2', // Not - Poor
          },
        ], // conditions
      ),
      //0% spending credit card for poor credit
      sectionContent(
        {
          en: '0% spending credit card for poor credit',
          cy: 'Cerdyn credyd gwario 0% ar gyfer credyd gwael',
        }, //content title
        {
          en: 'A special type of credit card that charges no interest on things you buy for a few months – even if you’ve had past credit problems.',
          cy: "Math arbennig o gerdyn credyd sy'n codi dim llog ar bethau rydych yn eu prynu am ychydig fisoedd - hyd yn oed os ydych wedi cael problemau credyd yn y gorffennol.  ",
        }, // intro
        {
          en: '0% for up to 4 months',
          cy: '0% am hyd at 4 mis',
        }, // interest rate value
        {
          en: 'Poor',
          cy: 'Gwael',
        }, // credit score value
        {
          en: 'Yes, see cons',
          cy: 'Oes, gweler anfanteision	',
        }, // fees value
        {
          en: 'Yes',
          cy: 'Gallwch',
        }, // repay early value
        [
          {
            en: 'No cost if you repay before the interest-free period ends',
            cy: "Dim cost os byddwch yn ad-dalu cyn i'r cyfnod di-log ddod i ben",
          },
          {
            en: 'Can repay early',
            cy: 'Gellir ad-dalu’n gynnar',
          },
          {
            en: 'Usually get free Section 75 protection if something costs £100 to £30,000',
            cy: 'Fel arfer yn cael amddiffyniad Adran 75 am ddim os yw rhywbeth yn costio £100 i £30,000',
          },
          {
            en: 'Eligibility calculators show your chances of being accepted before applying',
            cy: 'Mae cyfrifianellau cymhwysedd yn dangos eich siawns o gael eich derbyn cyn gwneud cais',
          },
        ], // pros
        [
          {
            en: 'You’ll pay expensive interest on anything after the 0% period ends',
            cy: "Byddwch yn talu llog drud ar unrhyw beth ar ôl i'r cyfnod 0% ddod i ben",
          },
          {
            en: 'You must pay the minimum monthly repayment to avoid fees and penalties',
            cy: 'Rhaid i chi dalu isafswm yr ad-daliad misol i osgoi ffioedd a chosbau',
          },
          {
            en: 'You can’t spend more than your agreed credit limit',
            cy: "Ni allwch wario mwy na'ch terfyn credyd y cytunwyd arno ",
          },
        ], // cons
        {
          en: (
            <Paragraph>
              Read more about{' '}
              <Link
                asInlineText={true}
                href="https://mapsorg.sharepoint.com/sites/MoneyHelperContentProgramme/Shared Documents/General/Content/Work in progress/Everyday money/Credit/xxx"
              >
                0% spending cards
              </Link>{' '}
              or compare options at{' '}
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/eligibility/credit-cards/search/?goal=CC_PURCHASE"
              >
                MoneySavingExpert
              </Link>
              ,{' '}
              <Link asInlineText={true} href="https://www.creditkarma.co.uk/">
                Credit Karma
              </Link>
              , and{' '}
              <Link asInlineText={true} href="https://www.clearscore.com/">
                ClearScore
              </Link>
              .
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Darllenwch fwy am{' '}
              <Link
                asInlineText={true}
                href="https://mapsorg.sharepoint.com/sites/MoneyHelperContentProgramme/Shared Documents/General/Content/Work in progress/Everyday money/Credit/xxx"
              >
                gardiau gwario 0%
              </Link>{' '}
              neu cymharwch opsiynau yn{' '}
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/eligibility/credit-cards/search/?goal=CC_PURCHASE"
              >
                MoneySavingExpert
              </Link>
              ,{' '}
              <Link asInlineText={true} href="https://www.creditkarma.co.uk/">
                Credit Karma
              </Link>{' '}
              a{' '}
              <Link asInlineText={true} href="https://www.clearscore.com/">
                ClearScore
              </Link>
              .
            </Paragraph>
          ),
        }, // bottom paragraph
        [
          {
            question: '1', // How much do you need to borrow
            answer: '1500', // Less than 1500
            arithmeticOperator: '<=', // Operator sent separate to value
          },
          {
            question: '2', // What do you need the money for?
            answer: '!2', // Not - Pay off (consolidate) debt
          },
          {
            question: '3', // How long could you wait for the money?
            answer: '2', // A week or more
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!3', // Not - Over 1 years
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!4', // Not - Over 1 years
          },
          //Q5 - Have you ever been refused credit? - Both answers
          {
            question: '6', // How good is your credit score?
            answer: '!0', // Not - Excellent
          },
          {
            question: '6', // How good is your credit score?
            answer: '!1', // Not - Fair/OK
          },
        ], // conditions
      ),
      //Buy Now Pay Later (BNPL)
      sectionContent(
        { en: 'Buy Now Pay Later (BNPL)', cy: 'Prynu Nawr Talu Wedyn (BNPL)' }, //content title
        {
          en: 'If you’re buying from a retailer, they might offer a BNPL option. This lets you spread the cost over a number of months, usually without paying interest.',
          cy: "Os ydych yn prynu gan fanwerthwr, efallai y byddant yncynnig opsiwn BNPL. Mae hyn yn caniatáu i chi ledaenu'r gost dros nifer o fisoedd, fel arfer heb dalu llog. ",
        }, // intro
        {
          en: '0% for up to 1 year',
          cy: '0% am hyd at 1 flwyddyn',
        }, // interest rate value
        {
          en: 'Usually not required',
          cy: 'Fel arfer nid oes angen',
        }, // credit score value
        {
          en: 'Yes, see cons',
          cy: 'Oes, gweler anfanteision',
        }, // fees value
        {
          en: 'Yes, but see cons',
          cy: 'Gallwch, ond gweler anfanteision',
        }, // repay early value
        [
          {
            en: 'Usually no cost if you repay on time',
            cy: 'Fel arfer nid oes cost os ydych yn ad-dalu ar amser',
          },
          {
            en: 'Can spread the cost into affordable chunks',
            cy: "Yn gallu lledaenu'r gost i ddarnau fforddiadwy",
          },
          {
            en: 'Usually quick and easy to set up',
            cy: "Fel arfer yn gyflym ac yn hawdd i'w sefydlu",
          },
          {
            en: 'Soft credit check but some providers will report to your credit file',
            cy: "Gwiriad credyd meddal ond bydd rhai darparwyr yn adrodd i'ch ffeil credyd",
          },
        ], // pros
        [
          {
            en: 'Late fees if you miss a payment',
            cy: 'Ffioedd hwyr os byddwch yn methu taliad',
          },
          {
            en: 'You might pay a fee to repay early',
            cy: "Efallai y byddwch yn talu ffi i ad-dalu'n gynnar",
          },
          {
            en: 'Some BNPL charge interest, so be careful',
            cy: 'Mae rhai BNPL yn codi llog, felly byddwch yn ofalus',
          },
          {
            en: 'Most aren’t regulated, so little protection if things go wrong',
            cy: "Nid yw'r rhan fwyaf yn cael eu rheoleiddio, felly ychydig o amddiffyniad os bydd pethau'n mynd o’i le",
          },
        ], // cons
        {
          en: (
            <Paragraph>
              Read more about{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/credit/what-are-buy-now-pay-later-purchases"
              >
                Buy Now Pay Later
              </Link>
              .
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Darllenwch fwy am{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/everyday-money/credit/what-are-buy-now-pay-later-purchases"
              >
                Prynu Nawr Talu Wedyn
              </Link>
              .
            </Paragraph>
          ),
        }, // bottom paragraph
        [
          {
            question: '1', // How much do you need to borrow
            answer: '500', // Less than 500
            arithmeticOperator: '<=', // Operator sent separate to value
          },
          {
            question: '2', // What do you need the money for?
            answer: '!1', // Not - Buy a car
          },
          {
            question: '2', // What do you need the money for?
            answer: '!2', // Not - Pay off (consolidate) debt
          },
          //Q3 - How long could you wait for the money? - Any answer
          {
            question: '4', // How quickly could you repay the money?
            answer: '!2', // less than 2 months
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!3', // less than 2 months
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!4', // less than 2 months
          },
          //Q5 - Have you ever been refused credit? - Any answer
          //Q6 - How good is your credit score? - Any answer
        ],
      ),
      //Balance transfer credit card
      sectionContent(
        {
          en: 'Balance transfer credit card',
          cy: 'Cerdyn credyd trosglwyddo balans',
        }, //content title
        {
          en: 'If you pay credit card interest, you can move what you owe to a new card that charges 0% (or low) interest for a number of months or years. There’s usually a one-off fee to do this.',
          cy: "Os ydych yn talu llog cerdyn credyd, gallwch symud beth sy'n ddyledus gennych i gerdyn newydd sy'n codi llog 0% (neu isel) am nifer o fisoedd neu flynyddoedd. Fel arfer, codir ffi untro i wneud hyn.",
        }, // intro
        {
          en: '0% for over 2 years',
          cy: '0% ers dros 2 flynedd',
        }, // interest rate value
        {
          en: 'Ok to excellent',
          cy: 'Iawn i ardderchog',
        }, // credit score value
        {
          en: 'Yes, see cons',
          cy: 'Oes, gweler anfanteision',
        }, // fees value
        {
          en: 'Yes',
          cy: 'Gallwch',
        }, // repay early value
        [
          {
            en: 'Low cost if you repay before the 0% or low interest period ends',
            cy: "Cost isel os ydych yn ad-dalu cyn i'r cyfnod llog 0% neu isel ddod i ben",
          },
          {
            en: 'Your repayments will clear the balance quicker as there’s less interest.',
            cy: "Bydd eich ad-daliadau yn clirio'r balans yn gyflymach gan fod llai o log.",
          },
          {
            en: 'There are options with no transfer fee',
            cy: 'Mae opsiynau heb unrhyw ffi trosglwyddo',
          },
          {
            en: 'Eligibility calculators show your chances of being accepted before applying',
            cy: 'Mae cyfrifianellau cymhwysedd yn dangos eich siawns o gael eich derbyn cyn gwneud cais',
          },
        ], // pros
        [
          {
            en: 'You’ll pay expensive interest on anything after the 0% or low interest period ends, or if you spend on it ',
            cy: "Byddwch yn talu llog drud ar unrhyw beth ar ôl i'r cyfnod llog 0% neu isel ddod i ben, neu os ydych yn gwario arno ",
          },
          {
            en: 'You’ll usually pay a transfer fee, often around 3% of the amount you’re transferring',
            cy: "Byddwch fel arfer yn talu ffi trosglwyddo, yn aml tua 3% o'r swm rydych yn ei drosglwyddo",
          },
          {
            en: 'You must pay the minimum monthly repayment to avoid fees and keep the 0% deal',
            cy: 'Rhaid i chi dalu isafswm yr ad-daliad misol i osgoi ffioedd a chadw’r fargen 0%',
          },
          {
            en: 'You might not get a large enough credit limit to transfer everything you owe ',
            cy: "Efallai na chewch derfyn credyd digon mawr i drosglwyddo popeth sy'n ddyledus gennych",
          },
        ], // cons
        {
          en: (
            <Paragraph>
              Read more about{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/credit/deciding-whether-to-transfer-your-credit-card-balance"
              >
                balance transfer credit cards
              </Link>{' '}
              or compare options at{' '}
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/eligibility/credit-cards/search/?goal=CC_BALTRANSFERV2"
              >
                MoneySavingExpert
              </Link>
              ,{' '}
              <Link asInlineText={true} href="https://www.creditkarma.co.uk/">
                Credit Karma
              </Link>{' '}
              and{' '}
              <Link asInlineText={true} href="https://www.clearscore.com/">
                ClearScore
              </Link>
              .
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Darllenwch fwy am{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/everyday-money/credit/deciding-whether-to-transfer-your-credit-card-balance"
              >
                gardiau credyd trosglwyddo balans
              </Link>{' '}
              neu gymharu opsiynau yn{' '}
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/eligibility/credit-cards/search/?goal=CC_BALTRANSFERV2"
              >
                MoneySavingExpert
              </Link>
              ,{' '}
              <Link asInlineText={true} href="https://www.creditkarma.co.uk/">
                Credyd Karma
              </Link>{' '}
              a{' '}
              <Link asInlineText={true} href="https://www.clearscore.com/">
                ClearScore
              </Link>
              .
            </Paragraph>
          ),
        }, // bottom paragraph
        [
          {
            question: '1', // How much do you need to borrow
            answer: '10000', // Less than 10000
            arithmeticOperator: '<=', // Operator sent separate to value
          },
          {
            question: '2', // What do you need the money for?
            answer: '2', // Pay off (consolidate) debt
          },
          {
            question: '3', // What do you need the money for?
            answer: '2', // A week or more
          },
          //Q4 - How quickly could you repay the money? - Any answer
          {
            question: '5', // Have you ever been refused credit?
            answer: '1', // No
          },
          {
            question: '6', // How good is your credit score?
            answer: '!2', // Not - Poor
          },
        ],
      ),
      //Balance transfer credit card for poor credit
      sectionContent(
        {
          en: 'Balance transfer credit card for poor credit',
          cy: 'Cerdyn credyd trosglwyddo balans ar gyfer credyd gwael',
        }, //content title
        {
          en: 'If you pay credit card interest, you can move what you owe to a new card that charges 0% (or low) interest for a few months – even if you’ve had past credit problems. There’s usually a one-off fee to do this.',
          cy: "Os ydych yn talu llog cerdyn credyd, gallwch symud beth sy'n ddyledus gennych i gerdyn newydd sy'n codi llog 0% (neu isel) am ychydig fisoedd - hyd yn oed os ydych wedi cael problemau credyd yn y gorffennol. Fel arfer, codir ffi untro i wneud hyn.",
        }, // intro
        {
          en: '0% for up to 1 year',
          cy: '0% am hyd at 1 flwyddyn',
        }, // interest rate value
        {
          en: 'Poor',
          cy: 'Gwael',
        }, // credit score value
        {
          en: 'Yes, see cons',
          cy: 'Oes, gweler anfanteision',
        }, // fees value
        {
          en: 'Yes',
          cy: 'Gallwch',
        }, // repay early value
        [
          {
            en: 'Low cost if you repay before the 0% or low interest period ends',
            cy: "Cost isel os ydych yn ad-dalu cyn i'r cyfnod llog 0% neu isel ddod i ben",
          },
          {
            en: 'Your repayments will clear the balance quicker as there’s less interest.',
            cy: "Bydd eich ad-daliadau yn clirio'r balans yn gyflymach gan fod llai o log.",
          },
          {
            en: 'Eligibility calculators show your chances of being accepted before applying',
            cy: 'Mae cyfrifianellau cymhwysedd yn dangos eich siawns o gael eich derbyn cyn gwneud cais',
          },
        ], // pros
        [
          {
            en: 'You’ll pay expensive interest on anything after the 0% or low interest period ends, or if you spend on it',
            cy: "Byddwch yn talu llog drud ar unrhyw beth ar ôl i'r cyfnod llog 0% neu isel ddod i ben, neu os ydych yn gwario arno",
          },
          {
            en: 'You’ll usually pay a transfer fee, often around 3% of the amount you’re transferring',
            cy: "Byddwch fel arfer yn talu ffi trosglwyddo, yn aml tua 3% o'r swm rydych yn ei drosglwyddo",
          },
          {
            en: 'You must pay the minimum monthly repayment to avoid fees and penalties',
            cy: 'Rhaid i chi dalu isafswm yr ad-daliad misol er mwyn osgoi ffioedd a chosbau',
          },
          {
            en: 'You might not get a large enough credit limit to transfer everything you owe',
            cy: "Efallai na chewch derfyn credyd digon mawr i drosglwyddo popeth sy'n ddyledus gennych ",
          },
        ], // cons
        {
          en: (
            <Paragraph className="text-wrap">
              Read more about{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/credit/deciding-whether-to-transfer-your-credit-card-balance"
              >
                balance transfer credit cards
              </Link>{' '}
              or compare options at{' '}
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/eligibility/credit-cards/search/?goal=CC_BALTRANSFERV2"
              >
                MoneySavingExpert
              </Link>
              ,{' '}
              <Link asInlineText={true} href="https://www.creditkarma.co.uk/">
                Credit Karma
              </Link>{' '}
              and{' '}
              <Link asInlineText={true} href="https://www.clearscore.com/">
                ClearScore
              </Link>
              .
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Darllenwch fwy am{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/everyday-money/credit/deciding-whether-to-transfer-your-credit-card-balance"
              >
                gardiau credyd trosglwyddo balans
              </Link>{' '}
              neu gymharu opsiynau yn{' '}
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/eligibility/credit-cards/search/?goal=CC_BALTRANSFERV2"
              >
                MoneySavingExpert
              </Link>
              ,{' '}
              <Link asInlineText={true} href="https://www.creditkarma.co.uk/">
                Credyd Karma
              </Link>{' '}
              a{' '}
              <Link asInlineText={true} href="https://www.clearscore.com/">
                ClearScore
              </Link>
              .
            </Paragraph>
          ),
        }, // bottom paragraph
        [
          {
            question: '1', // How much do you need to borrow
            answer: '1500', // Less than 1500
            arithmeticOperator: '<=', // Operator sent separate to value
          },
          {
            question: '2', // What do you need the money for?
            answer: '2', // Pay off (consolidate) debt
          },
          {
            question: '3', // What do you need the money for?
            answer: '2', // A week or more
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!4', // less than 2 months
          },
          //Q5 - Have you ever been refused credit? - Any answer
          {
            question: '6', // How good is your credit score?
            answer: '!0', // Not - Excellent
          },
          {
            question: '6', // How good is your credit score?
            answer: '!1', // Not - Fair/OK
          },
        ], // conditions
      ),
      //0% overdraft on your bank account
      sectionContent(
        {
          en: '0% overdraft on your bank account',
          cy: 'Gorddrafft 0% ar eich cyfrif banc',
        }, //content title
        {
          en: 'A special type of overdraft that charges no interest if you spend more than you have in your bank account – up to an agreed limit.',
          cy: "Math arbennig o orddrafft sy'n codi dim llog os ydych yn gwario mwy nag sydd gennych yn eich cyfrif banc – hyd at derfyn y cytunwyd arno.",
        }, // intro
        {
          en: '0%',
          cy: '0%',
        }, // interest rate value
        {
          en: 'Ok to excellent',
          cy: 'Iawn i ardderchog',
        }, // credit score value
        {
          en: 'Yes, see cons',
          cy: 'Oes, gweler anfanteision',
        }, // fees value
        {
          en: 'Yes',
          cy: 'Gallwch',
        }, // repay early value
        [
          {
            en: 'No cost if you stick within your agreed limit',
            cy: 'Dim cost os ydych yn cadw o fewn eich terfyn a gytunwyd',
          },
          {
            en: 'Can repay at any time',
            cy: 'Gellir ei ad-dalu ar unrhyw adeg',
          },
          {
            en: 'Can withdraw the money as cash if needed',
            cy: "Gellir tynnu'r arian allan fel arian parod os oes angen ",
          },
        ], // pros
        [
          {
            en: 'Overdraft limits are usually low',
            cy: 'Mae terfynau gorddrafft fel arfer yn isel',
          },
          {
            en: 'You might pay fees if you spend more than your limit and the payment is refused',
            cy: "Efallai y byddwch yn talu ffioedd os ydych yn gwario mwy na'ch terfyn a gwrthodir y taliad",
          },
          {
            en: 'Being in your overdraft can negatively impact your credit score',
            cy: "Gall bod yn eich gorddrafft effeithio'n negyddol ar eich sgôr credyd",
          },
        ], // cons

        {
          en: (
            <Paragraph>
              Read more about{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/credit/overdrafts-explained"
              >
                overdrafts
              </Link>{' '}
              or see MoneySavingExpert’s{' '}
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/banking/compare-best-bank-accounts/#overdrawn"
              >
                Top bank accounts with low-cost overdrafts
              </Link>{' '}
              .
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Darllenwch fwy am{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/everyday-money/credit/overdrafts-explained"
              >
                orddrafftiau
              </Link>{' '}
              neu edrychwch ar MoneySavingExpert’s{' '}
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/banking/compare-best-bank-accounts/#overdrawn"
              >
                Top bank accounts with low-cost overdrafts
              </Link>
              .
            </Paragraph>
          ),
        }, // bottom paragraph
        [
          {
            question: '1', // How much do you need to borrow
            answer: '1000', // Less than 1000
            arithmeticOperator: '<=', // Operator sent separate to value
          },
          {
            question: '2', // What do you need the money for?
            answer: '!2', // Not - Pay off (consolidate) debt
          },
          {
            question: '3', // What do you need the money for?
            answer: '!0', // Not - a few hours
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!3', // less than 1 year (excluding 1-2 years and over 2 years)
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!4', // less than 1 year (excluding 1-2 years and over 2 years)
          },
          {
            question: '5', // Have you ever been refused credit?
            answer: '1', // No
          },
          {
            question: '6', // How good is your credit score?
            answer: '!2', // Not - Poor
          },
        ], // conditions
      ),
      //0% overdraft on your bank account (to clear debt)
      sectionContent(
        {
          en: '0% overdraft on your bank account',
          cy: 'Gorddrafft 0% ar eich cyfrif banc',
        }, //content title
        {
          en: (
            <Paragraph>
              A special type of overdraft that charges no interest if you spend
              more than you have in your bank account – up to an agreed limit.
              You could use this to repay other, more expensive debt. If you’re
              struggling to repay debt,
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/money-troubles/dealing-with-debt/debt-advice-locator"
              >
                {' '}
                speak to a free debt adviser first
              </Link>{' '}
              .
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Math arbennig o orddrafft sy&apos;n codi dim llog os ydych yn
              gwario mwy nag sydd gennych yn eich cyfrif banc – hyd at derfyn y
              cytunwyd arno. Gallech ddefnyddio hwn i ad-dalu dyledion eraill,
              drutach. Os ydych yn cael trafferth ad-dalu dyled,{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/money-troubles/dealing-with-debt/debt-advice-locator"
              >
                siaradwch ag ymgynghorydd dyledion am ddim
              </Link>{' '}
              yn gyntaf.
            </Paragraph>
          ),
        }, // intro
        {
          en: '0%',
          cy: '0%',
        }, // interest rate value
        {
          en: 'Ok to excellent',
          cy: 'Iawn i ardderchog',
        }, // credit score value
        {
          en: 'Yes, see cons',
          cy: 'Oes, gweler anfanteision',
        }, // fees value
        {
          en: 'Yes',
          cy: 'Gallwch',
        }, // repay early value
        [
          {
            en: 'No cost if you stick within your agreed limit',
            cy: 'Dim cost os ydych yn cadw o fewn eich terfyn a gytunwyd',
          },
          {
            en: 'Can repay at any time',
            cy: 'Gellir ei ad-dalu ar unrhyw adeg',
          },
          {
            en: 'Can withdraw the money as cash if needed',
            cy: "Gellir tynnu'r arian allan fel arian parod os oes angen",
          },
        ], // pros
        [
          {
            en: 'Overdraft limits are usually low',
            cy: 'Mae terfynau gorddrafft fel arfer yn isel',
          },
          {
            en: 'You might pay fees if you spend more than your limit and the payment is refused',
            cy: "Efallai y byddwch yn talu ffioedd os ydych yn gwario mwy na'ch terfyn a gwrthodir y taliad",
          },
          {
            en: 'Being in your overdraft can negatively impact your credit score',
            cy: "Gall bod yn eich gorddrafft effeithio'n negyddol ar eich sgôr credyd",
          },
        ], // cons
        {
          en: (
            <Paragraph>
              Read more about{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/credit/overdrafts-explained"
              >
                overdrafts
              </Link>{' '}
              or see{' '}
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/banking/compare-best-bank-accounts/#overdrawn"
              >
                Top bank accounts with low-cost overdrafts{' '}
              </Link>{' '}
              at MoneySavingExpert.
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Darllenwch fwy am{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/everyday-money/credit/overdrafts-explained"
              >
                orddrafftiau
              </Link>{' '}
              neu edrychwch ar MoneySavingExpert’s{' '}
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/banking/compare-best-bank-accounts/#overdrawn"
              >
                Top bank accounts with low-cost overdrafts
              </Link>
              .
            </Paragraph>
          ),
        }, // bottom paragraph
        [
          {
            question: '1', // How much do you need to borrow
            answer: '1000', // Less than 1000
            arithmeticOperator: '<=', // Operator sent separate to value
          },
          {
            question: '2', // What do you need the money for?
            answer: '2', // Pay off (consolidate) debt
          },
          {
            question: '3', // What do you need the money for?
            answer: '!0', // Not - a few hours
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!3', // less than 1 year (excluding 1-2 years and over 2 years)
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!4', // less than 1 year (excluding 1-2 years and over 2 years)
          },
          {
            question: '5', // Have you ever been refused credit?
            answer: '1', // No
          },
          {
            question: '6', // How good is your credit score?
            answer: '!2', // Not - Poor
          },
        ], // conditions
      ),
      //Loan from a bank or building society
      sectionContent(
        {
          en: 'Loan from a bank or building society',
          cy: 'Benthyciad gan fanc neu gymdeithas adeiladu',
        }, //content title
        {
          en: 'A personal loan usually lets you borrow more (and for longer) than other types of credit. Loans up to £30,000 can often be repaid over one to five years.',
          cy: 'Mae benthyciad personol fel arfer yn gadael i chi fenthyg mwy (ac am gyfnod hirach) na mathau eraill o gredyd. Yn aml, gellir ad-dalu benthyciadau o hyd at £30,000 dros un i bum mlynedd.',
        }, // intro
        {
          en: '7% to 30%',
          cy: '7% i 30%',
        }, // interest rate value
        {
          en: 'Ok to excellent',
          cy: 'Iawn i ardderchog',
        }, // credit score value
        {
          en: 'Yes, see cons',
          cy: 'Oes, gweler anfanteision',
        }, // fees value
        {
          en: 'Yes, but see cons',
          cy: 'Gallwch, ond gweler anfanteision',
        }, // repay early value
        [
          {
            en: 'You pay a fixed monthly repayment',
            cy: 'Rydych yn talu ad-daliad misol sefydlog',
          },
          {
            en: "You'll clear the loan at the end",
            cy: "Byddwch yn clirio'r benthyciad ar y diwedd",
          },
          {
            en: 'Eligibility calculators show your chances of being accepted before applying',
            cy: 'Mae cyfrifianellau cymhwysedd yn dangos eich siawns o gael eich derbyn cyn gwneud cais',
          },
        ], // pros
        [
          {
            en: "You often won't know the exact interest rate you'll get until you apply",
            cy: 'Yn aml, ni fyddwch yn gwybod yr union gyfradd llog y byddwch yn ei chael nes i chi wneud cais',
          },
          {
            en: 'Late fees if you miss a payment',
            cy: 'Ffioedd hwyr os byddwch yn methu taliad',
          },
          {
            en: 'You might pay a fee to repay early',
            cy: "Efallai y byddwch yn talu ffi i ad-dalu'n gynnar",
          },
        ], // cons
        {
          en: (
            <Paragraph>
              Read more about{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/credit/personal-loans"
              >
                Personal loans
              </Link>{' '}
              or compare options at{' '}
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/eligibility/loans-calculator/search"
              >
                MoneySavingExpert
              </Link>
              ,{' '}
              <Link
                asInlineText={true}
                href="https://www.experian.co.uk/consumer/loans/"
              >
                Experian
              </Link>{' '}
              and{' '}
              <Link asInlineText={true} href="https://www.clearscore.com/">
                ClearScore
              </Link>
              .
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Darllenwch fwy am{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/everyday-money/credit/personal-loans"
              >
                Fenthyciadau personol
              </Link>{' '}
              neu gymharu&apos;r opsiynau ar{' '}
              <Link asInlineText={true} href="https://www.clearscore.com/loans">
                Clearscore
              </Link>
              ,
              <Link
                asInlineText={true}
                href="https://www.experian.co.uk/consumer/loans/"
              >
                Experian
              </Link>{' '}
              a{' '}
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/eligibility/loans-calculator/search/"
              >
                MoneySavingExpert
              </Link>
              .
            </Paragraph>
          ),
        }, // bottom paragraph
        [
          {
            question: '1', // How much do you need to borrow
            answer: '1000', // more than 1000
            arithmeticOperator: '>=', // Operator sent separate to value
          },
          {
            question: '1', // How much do you need to borrow
            answer: '50000', // less than 50000
            arithmeticOperator: '<=', // Operator sent separate to value
          },
          {
            question: '2', // What do you need the money for?
            answer: '!2', // Not - Pay off (consolidate) debt
          },
          {
            question: '2', // What do you need the money for?
            answer: '!3', // Not - Every day items
          },
          {
            question: '2', // What do you need the money for?
            answer: '!4', // Not - Emergency
          },
          {
            question: '3', // What do you need the money for?
            answer: '!0', // Not - a few hours
          },
          //Q4 - How quickly could you repay the money? - Any answer
          {
            question: '5', // Have you ever been refused credit?
            answer: '1', // No
          },
          {
            question: '6', // How good is your credit score?
            answer: '!2', // Not - Poor
          },
        ], // conditions
      ),
      //Debt consolidation loan
      sectionContent(
        { en: 'Debt consolidation loan', cy: 'Benthyciad cydgrynhoi dyled' }, //content title
        {
          en: (
            <Paragraph>
              This is where you get a new loan to repay your existing debt, so
              you only have one monthly repayment. But you need to be careful
              not to run up new debt on top. If you&apos;re struggling to repay
              debt,{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/money-troubles/dealing-with-debt/debt-advice-locator"
              >
                speak to a free debt adviser first
              </Link>
              .
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Dyma lle rydych yn cael benthyciad newydd i ad-dalu&apos;ch dyled
              bresennol, fel bod gennych ond un ad-daliad misol. Ond mae angen i
              chi fod yn ofalus i beidio â rhedeg dyled newydd ar ei ben. Os
              ydych yn cael trafferth ad-dalu dyled,{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/money-troubles/dealing-with-debt/debt-advice-locator"
              >
                siaradwch ag ymgynghorydd dyledion am ddim
              </Link>{' '}
              yn gyntaf.
            </Paragraph>
          ),
        }, // intro
        {
          en: '7% to 30%',
          cy: '7% i 30%',
        }, // interest rate value
        {
          en: 'Ok to excellent',
          cy: 'Iawn i ardderchog',
        }, // credit score value
        {
          en: 'Yes, see cons',
          cy: 'Oes, gweler anfanteision',
        }, // fees values
        {
          en: 'Yes, but see cons',
          cy: 'Gallwch, ond gweler anfanteision',
        }, // repay early value
        [
          {
            en: 'You pay a fixed monthly repayment for all your debt',
            cy: 'Rydych yn talu un ad-daliad misol sefydlog am eich holl ddyled',
          },
          {
            en: "You'll clear the loan at the end",
            cy: "Byddwch yn clirio'r benthyciad ar y diwedd",
          },
          {
            en: 'Eligibility calculators show your chances of being accepted before applying',
            cy: 'Mae cyfrifianellau cymhwysedd yn dangos eich siawns o gael eich derbyn cyn gwneud cais',
          },
        ], // pros
        [
          {
            en: "You often won't know the exact interest rate you'll get until you apply",
            cy: 'Yn aml, ni fyddwch yn gwybod yr union gyfradd llog y byddwch yn ei chael nes i chi wneud cais',
          },
          {
            en: 'Late fees if you miss a payment',
            cy: 'Ffioedd hwyr os byddwch yn methu taliad',
          },
          {
            en: 'You might pay a fee to repay early',
            cy: "Efallai y byddwch yn talu ffi i ad-dalu'n gynnar",
          },
        ], // cons
        {
          en: (
            <Paragraph>
              Read more about{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/credit/debt-consolidation-loans"
              >
                Debt consolidation loans
              </Link>{' '}
              or compare options at{' '}
              <Link asInlineText={true} href="https://www.clearscore.com/">
                ClearScore
              </Link>
              ,{' '}
              <Link
                asInlineText={true}
                href="https://www.experian.co.uk/consumer/loans/"
              >
                Experian
              </Link>{' '}
              and{' '}
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/eligibility/loans-calculator/search"
              >
                MoneySavingExpert
              </Link>
              .
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Darllenwch fwy am{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/everyday-money/credit/debt-consolidation-loans"
              >
                Fenthyciadau cydgrynhoi dyled
              </Link>{' '}
              neu gymharu&apos;r opsiynau ar{' '}
              <Link asInlineText={true} href="https://www.clearscore.com/loans">
                Clearscore
              </Link>
              ,
              <Link
                asInlineText={true}
                href="https://www.experian.co.uk/consumer/loans/"
              >
                Experian
              </Link>{' '}
              a{' '}
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/eligibility/loans-calculator/search/"
              >
                MoneySavingExpert
              </Link>
              .
            </Paragraph>
          ),
        }, // bottom paragraph
        [
          {
            question: '1', // How much do you need to borrow
            answer: '1000', // more than 1000
            arithmeticOperator: '>=', // Operator sent separate to value
          },
          {
            question: '1', // How much do you need to borrow
            answer: '50000', // less than 50000
            arithmeticOperator: '<=', // Operator sent separate to value
          },
          {
            question: '2', // What do you need the money for?
            answer: '2', // Pay off (consolidate) debt
          },
          {
            question: '3', // What do you need the money for?
            answer: '!0', // Not - a few hours
          },
          //Q4 - How quickly could you repay the money? - Any answer
          {
            question: '5', // Have you ever been refused credit?
            answer: '1', // No
          },
          {
            question: '6', // How good is your credit score?
            answer: '!2', // Not - Poor
          },
        ], // conditions
      ),
      // Car finance – Personal Contract Purchase (PCP)
      sectionContent(
        {
          en: 'Car finance – Personal Contract Purchase (PCP)',
          cy: 'Cyllid car – Prynu ar Gytundeb Personol (PCP)',
        }, //content title
        {
          en: 'Used to buy a new or used car, PCP is a type of loan. You’ll pay a deposit and monthly repayments for one to five years. At the end, you can either give the car back or pay a large, final payment (called a balloon payment) to keep it.',
          cy: "Yn cael ei ddefnyddio i brynu car newydd neu ail-law, mae PCP yn fath o fenthyciad. Byddwch yn talu blaendal ac ad-daliadau misol am un i bum mlynedd. Ar y diwedd, gallwch naill ai roi'r car yn ôl neu dalu taliad mawr, terfynol (a elwir yn daliad balŵn) i'w gadw.",
        }, // intro
        {
          en: '8% to 20%',
          cy: '8% i 20%',
        }, // interest rate value
        {
          en: 'Poor to excellent',
          cy: 'Gwael i ardderchog',
        }, // credit score value
        {
          en: 'Yes, see cons',
          cy: 'Oes, gweler anfanteision',
        }, // fees value
        {
          en: 'Yes, but see cons',
          cy: 'Gallwch, ond gweler anfanteision',
        }, // repay early value
        [
          {
            en: 'You pay a fixed monthly repayment',
            cy: 'Rydych yn talu ad-daliad misol sefydlog',
          },
          {
            en: 'Eligibility calculators show your chances of being accepted before applying',
            cy: 'Mae cyfrifianellau cymhwysedd yn dangos eich siawns o gael eich derbyn cyn gwneud cais',
          },
        ], // pros
        [
          {
            en: 'You’ll need to budget for a large deposit',
            cy: 'Bydd angen i chi gyllidebu ar gyfer blaendal mawr',
          },
          {
            en: 'You often won’t know the exact interest rate you’ll get until you apply',
            cy: 'Yn aml, ni fyddwch yn gwybod yr union gyfradd llog y byddwch yn ei chael nes i chi wneud cais',
          },
          {
            en: 'You’ll usually pay fees if you damage the car, drive more miles than agreed or miss a payment',
            cy: "Byddwch fel arfer yn talu ffioedd os ydych yn difrodi'r car, yn gyrru mwy o filltiroedd na'r hyn y cytunwyd arno neu'n methu taliad.",
          },
          {
            en: 'You won’t own the car unless you make the balloon repayment',
            cy: 'Ni fyddwch yn berchen ar y car oni bai eich bod yn gwneud yr ad-daliad balŵn',
          },
          {
            en: 'To end the deal early, you must have paid half the value of the contract ',
            cy: "I ddod â'r cytundeb i ben yn gynnar, rhaid eich bod wedi talu hanner gwerth y contract",
          },
        ], // cons
        {
          en: (
            <Paragraph>
              Read more about{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/buying-and-running-a-car/financing-buying-car-personal-contract-purchase-pcp"
              >
                Personal Contract Purchase
              </Link>{' '}
              or find comparison sites to try at{' '}
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/eligibility/credit-cards/search/?goal=CC_PURCHASE"
              >
                MoneySavingExpert
              </Link>
              . Most car dealers also offer PCP.
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Darllenwch fwy am{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/everyday-money/buying-and-running-a-car/financing-buying-car-personal-contract-purchase-pcp"
              >
                Brynu ar Gytundeb Personol
              </Link>{' '}
              neu ddod o hyd i safleoedd cymharu i roi cynnig arnynt ar
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/loans/personal-contract-purchase/#where"
              >
                MoneySavingExpert
              </Link>
              . Mae&apos;r rhan fwyaf o werthwyr ceir hefyd yn cynnig PCP.
            </Paragraph>
          ),
        }, // bottom paragraph
        [
          {
            question: '1', // How much do you need to borrow
            answer: '3000', // more than 3000
            arithmeticOperator: '>=', // Operator sent separate to value
          },
          {
            question: '1', // How much do you need to borrow
            answer: '50000', // less than 50000
            arithmeticOperator: '<=', // Operator sent separate to value
          },
          {
            question: '2', // What do you need the money for?
            answer: '1', // Buy a car
          },
          {
            question: '3', // What do you need the money for?
            answer: '!0', // Not - a few hours
          },
          //Q4 - How quickly could you repay the money? - Any answer
          {
            question: '5', // Have you ever been refused credit?
            answer: '1', // No
          },
          {
            question: '6', // How good is your credit score?
            answer: '!2', // Not - Poor
          },
        ], // conditions
      ),
      //Car finance – leasing (long-term car rental)
      sectionContent(
        {
          en: 'Car finance – leasing (long-term car rental)',
          cy: 'Cyllid car – prydlesu (rhentu car tymor hir)',
        }, //content title
        {
          en: 'Car leasing (also known as Personal Contract Hire) lets you rent a new car. You’ll usually pay a deposit and monthly repayments for one to four years. You’ll never own the car, so you’ll have to give it back (or extend the lease) at the end.',
          cy: 'Mae prydlesu car (a elwir hefyd yn Gontract Llogi Personol) yn gadael i chi rentu car newydd. Byddwch fel arfer yn talu blaendal ac ad-daliadau misol am un i bedair blynedd. Ni fyddwch byth yn berchen ar y car, felly bydd yn rhaid i chi ei roi yn ôl (neu ymestyn y brydles) ar y diwedd.',
        }, // intro
        {
          en: 'Depends on the deal',
          cy: 'Yn dibynnu ar y fargen',
        }, // interest rate value
        {
          en: 'Ok to excellent',
          cy: 'Iawn i ardderchog',
        }, // credit score value
        {
          en: 'Yes, see cons',
          cy: 'Oes, gweler anfanteision',
        }, // fees value
        {
          en: 'Yes, but see cons',
          cy: 'Gallwch, ond gweler anfanteision',
        }, // repay early value
        [
          {
            en: 'You pay a fixed monthly repayment',
            cy: 'Rydych yn talu ad-daliad misol sefydlog ',
          },
          {
            en: 'You won’t have to pay for car tax',
            cy: 'Ni fydd yn rhaid i chi dalu am dreth car',
          },
          {
            en: 'Eligibility calculators show your chances of being accepted before applying',
            cy: 'Mae cyfrifianellau cymhwysedd yn dangos eich siawns o gael eich derbyn cyn gwneud cais',
          },
        ], // pros
        [
          {
            en: 'You’ll often need to budget for a deposit',
            cy: 'Yn aml bydd angen i chi gyllidebu ar gyfer blaendal',
          },
          {
            en: 'You’ll usually pay fees if you damage the car, drive more miles than agreed or miss a payment',
            cy: "Byddwch fel arfer yn talu ffioedd os ydych yn difrodi'r car, yn gyrru mwy o filltiroedd na'r hyn y cytunwyd arno neu'n methu taliad.",
          },
          {
            en: 'You won’t ever own the car',
            cy: 'Ni fyddwch byth yn berchen ar y car',
          },
          {
            en: 'There are usually expensive fees to end the deal early',
            cy: "Fel arfer mae ffioedd drud i ddod â'r cytundeb i ben yn gynnar",
          },
        ], // cons
        {
          en: (
            <Paragraph>
              Read more about{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/buying-and-running-a-car/leasing-a-car-with-personal-contract-hire-pch"
              >
                Car leasing
              </Link>{' '}
              or find comparison sites to try at{' '}
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/eligibility/credit-cards/search/?goal=CC_PURCHASE"
              >
                MoneySavingExpert
              </Link>
              .
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Darllenwch fwy am{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/everyday-money/buying-and-running-a-car/leasing-a-car-with-personal-contract-hire-pch"
              >
                Brydlesu car
              </Link>{' '}
              neu ddod o hyd i safleoedd cymharu i roi cynnig arnynt ar
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/loans/car-leasing/#topcompare"
              >
                MoneySavingExpert
              </Link>
              .
            </Paragraph>
          ),
        }, // bottom paragraph
        [
          {
            question: '1', // How much do you need to borrow
            answer: '4000', // more than 4000
            arithmeticOperator: '>=', // Operator sent separate to value
          },
          {
            question: '1', // How much do you need to borrow
            answer: '30000', // less than 50000
            arithmeticOperator: '<=', // Operator sent separate to value
          },
          {
            question: '2', // What do you need the money for?
            answer: '1', // Buy a car
          },
          {
            question: '3', // What do you need the money for?
            answer: '!0', // Not - a few hours
          },
          //Q4 - How quickly could you repay the money? - Any answer
          {
            question: '5', // Have you ever been refused credit?
            answer: '1', // No
          },
          {
            question: '6', // How good is your credit score?
            answer: '!2', // Not - Poor
          },
        ], // conditions
      ),
      //Car finance – hire purchase (HP)
      sectionContent(
        {
          en: 'Car finance – hire purchase (HP)',
          cy: 'Cyllid car – hurbwrcas (HP)',
        }, //content title
        {
          en: 'Hire purchase can be used to buy a new or used car. You’ll usually pay a deposit and monthly payments for one to five years. At the end, you’ll pay a one-off ‘option to purchase’ fee to own the car.',
          cy: "Gellir defnyddio hurbwrcas i brynu car newydd neu ail-law. Byddwch fel arfer yn talu blaendal a thaliadau misol am un i bum mlynedd. Ar y diwedd, byddwch yn talu ffi 'opsiwn i brynu' unwaith ac am byth i fod yn berchen ar y car.",
        }, // intro
        {
          en: '6% to 15%',
          cy: '6% i 15%',
        }, // interest rate value
        {
          en: 'Ok to excellent',
          cy: 'Iawn i ardderchog',
        }, // credit score value
        {
          en: 'Yes, see cons',
          cy: 'Oes, gweler anfanteision',
        }, // fees value
        {
          en: 'Yes, see cons',
          cy: 'Oes, gweler anfanteision',
        }, // repay early value
        [
          {
            en: 'You pay a fixed monthly repayment',
            cy: 'Rydych yn talu ad-daliad misol sefydlog',
          },
          {
            en: 'Eligibility calculators show your chances of being accepted before applying',
            cy: 'Mae cyfrifianellau cymhwysedd yn dangos eich siawns o gael eich derbyn cyn gwneud cais',
          },
        ], // pros
        [
          {
            en: 'You’ll often need to budget for a deposit',
            cy: 'Yn aml bydd angen i chi gyllidebu ar gyfer blaendal',
          },
          {
            en: 'You won’t own the car until you pay the final option to purchase fee',
            cy: "Ni fyddwch yn berchen ar y car nes i chi dalu'r ffi opsiwn olaf i brynu.",
          },
          {
            en: 'You can end the deal early and return the car, but you’ll pay a fee unless you’ve repaid over 50% of the purchase price.',
            cy: "Gallwch ddod â'r cytundeb i ben yn gynnar a dychwelyd y car, ond byddwch yn talu ffi oni bai eich bod wedi ad-dalu dros 50% o'r pris prynu.",
          },
        ], // cons
        {
          en: (
            <Paragraph>
              Read more about{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/buying-and-running-a-car/buying-a-car-through-hire-purchase"
              >
                Hire purchase
              </Link>{' '}
              or find comparison sites to try at{' '}
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/eligibility/credit-cards/search/?goal=CC_PURCHASE"
              >
                MoneySavingExpert
              </Link>
              .
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Darllenwch fwy am{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/everyday-money/buying-and-running-a-car/buying-a-car-through-hire-purchase"
              >
                Hurbwrcas
              </Link>{' '}
              neu darganfyddwch safleoedd cymharu i roi cynnig arnynt ar
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/loans/hire-purchase/#brokers"
              >
                MoneySavingExpert
              </Link>
              .
            </Paragraph>
          ),
        }, // bottom paragraph
        [
          {
            question: '1', // How much do you need to borrow
            answer: '3000', // more than 3000
            arithmeticOperator: '>=', // Operator sent separate to value
          },
          {
            question: '1', // How much do you need to borrow
            answer: '50000', // less than 50000
            arithmeticOperator: '<=', // Operator sent separate to value
          },
          {
            question: '2', // What do you need the money for?
            answer: '1', // Buy a car
          },
          {
            question: '3', // What do you need the money for?
            answer: '!0', // Not - a few hours
          },
          //Q4 - How quickly could you repay the money? - Any answer
          {
            question: '5', // Have you ever been refused credit?
            answer: '1', // No
          },
          {
            question: '6', // How good is your credit score?
            answer: '!2', // Not - Poor
          },
        ], // conditions
      ),
      //Credit card with interest
      sectionContent(
        {
          en: 'Credit card with interest',
          cy: 'Cerdyn credyd gyda llog',
        }, //content title
        {
          en: 'A credit card is a secure, flexible way to pay. Every month, you’ll receive a bill for everything you’ve spent.',
          cy: "Mae cerdyn credyd yn ffordd ddiogel a hyblyg o dalu. Bob mis, byddwch yn derbyn bil am bopeth rydych wedi'i wario.",
        }, // intro
        {
          en: '25%',
          cy: '25%',
        }, // interest rate value
        {
          en: 'Ok to excellent',
          cy: 'Iawn i ardderchog',
        }, // credit score value
        {
          en: 'Yes, see cons',
          cy: 'Oes, gweler anfanteision',
        }, // fees value
        {
          en: 'Yes',
          cy: 'Gallwch',
        }, // repay early value
        [
          {
            en: 'No cost if you repay in full each month',
            cy: "Dim cost os ydych yn ad-dalu'n llawn bob mis",
          },
          {
            en: 'Can repay early',
            cy: "Gellir ad-dalu'n gynnar",
          },
          {
            en: 'Usually get free Section 75 protection if something costs £100 to £30,000',
            cy: 'Fel arfer yn cael amddiffyniad Adran 75 am ddim os yw rhywbeth yn costio £100 i £30,000',
          },
          {
            en: 'Eligibility calculators show your chances of being accepted before applying',
            cy: 'Mae cyfrifianellau cymhwysedd yn dangos eich siawns o gael eich derbyn cyn gwneud cais',
          },
        ], // pros
        [
          {
            en: 'You’ll pay expensive interest on everything if you pay back less than the full amount',
            cy: "Byddwch yn talu llog drud ar bopeth os ydych yn ad-dalu llai na'r swm llawn",
          },
          {
            en: 'You must pay the minimum monthly repayment to avoid fees and penalties',
            cy: 'Rhaid i chi dalu isafswm yr ad-daliad misol i osgoi ffioedd a chosbau',
          },
          {
            en: 'Only paying the minimum can mean it takes years to clear your debt',
            cy: 'Gall ond talu’r isafswm olygu ei bod yn cymryd blynyddoedd i glirio’ch dyled',
          },
          {
            en: 'You can’t spend more than your agreed credit limit',
            cy: "Ni allwch wario mwy na'ch terfyn credyd y cytunwyd arno  ",
          },
        ], // cons
        {
          en: (
            <Paragraph>
              Read more about{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/credit/simple-guide-to-credit-cards"
              >
                Credit cards
              </Link>{' '}
              or compare options at{' '}
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/eligibility/credit-cards/search/?goal=CC_PURCHASE"
              >
                MoneySavingExpert
              </Link>
              ,{' '}
              <Link asInlineText={true} href="https://www.creditkarma.co.uk/">
                Credit Karma
              </Link>{' '}
              and{' '}
              <Link asInlineText={true} href="https://www.clearscore.com/">
                ClearScore
              </Link>
              .
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Darllenwch fwy am{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/everyday-money/credit/simple-guide-to-credit-cards"
              >
                Gardiau credyd
              </Link>{' '}
              neu gymharwch opsiynau ar{' '}
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/eligibility/credit-cards/search/?goal=CC_PURCHASE"
              >
                MoneySavingExpert
              </Link>
              ,{' '}
              <Link asInlineText={true} href="https://www.creditkarma.co.uk/">
                Credit Karma
              </Link>{' '}
              a{' '}
              <Link asInlineText={true} href="https://www.clearscore.com/">
                ClearScore
              </Link>
              .
            </Paragraph>
          ),
        }, // bottom paragraph
        [
          {
            question: '1', // How much do you need to borrow
            answer: '10000', // less than 10000
            arithmeticOperator: '<=', // Operator sent separate to value
          },
          {
            question: '2', // What do you need the money for?
            answer: '!1', // Not - Buy a car
          },
          {
            question: '2', // What do you need the money for?
            answer: '!2', // Not - Pay off (consolidate) debt
          },
          {
            question: '3', // What do you need the money for?
            answer: '2', // A week or more
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!2', // Noy - 6 months to 1 year
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!3', // Noy - 1 to 2 years
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!2', // Noy - over 2 years
          },
          {
            question: '5', // Have you ever been refused credit?
            answer: '1', // No
          },
          {
            question: '6', // How good is your credit score?
            answer: '!2', // Not - Poor
          },
        ], // conditions
      ),
      //Credit card for poor credit, with interest
      sectionContent(
        {
          en: 'Credit card for poor credit, with interest',
          cy: 'Cerdyn credyd ar gyfer credyd gwael, gyda llog',
        }, //content title
        {
          en: 'Credit builder credit cards can help boost your credit rating if you have a poor credit history. Every month, you‘ll receive a bill for everything you’ve spent.',
          cy: "Gall cardiau adeiladu credyd helpu i roi hwb i'ch statws credyd os oes gennych hanes credyd gwael. Bob mis, byddwch yn derbyn bil am bopeth rydych wedi'i wario.",
        }, // intro
        {
          en: '30% to 60%',
          cy: '30% i 60%',
        }, // interest rate value
        {
          en: 'Poor',
          cy: 'Gwael',
        }, // credit score value
        {
          en: 'Yes, see cons',
          cy: 'Oes, gweler anfanteision',
        }, // fees value
        {
          en: 'Yes',
          cy: 'Gallwch',
        }, // repay early value
        [
          {
            en: 'No cost if you repay in full each month',
            cy: "Dim cost os ydych yn ad-dalu'n llawn bob mis",
          },
          {
            en: 'Can repay early',
            cy: 'Gellir ad-dalu’n gynnar',
          },
          {
            en: 'Usually get free Section 75 protection if something costs £100 to £30,000',
            cy: 'Fel arfer yn cael amddiffyniad Adran 75 am ddim os yw rhywbeth yn costio £100 i £30,000',
          },
          {
            en: 'Eligibility calculators show your chances of being accepted before applying',
            cy: 'Mae cyfrifianellau cymhwysedd yn dangos eich siawns o gael eich derbyn cyn gwneud cais',
          },
        ], // pros
        [
          {
            en: 'You’ll pay expensive interest on everything if you pay less than the full amount',
            cy: "Byddwch yn talu llog drud ar bopeth os ydych yn talu llai na'r swm llawn",
          },
          {
            en: 'You must pay the minimum monthly repayment to avoid fees and penalties',
            cy: 'Rhaid i chi dalu isafswm yr ad-daliad misol i osgoi ffioedd a chosbau',
          },
          {
            en: 'Only paying the minimum can mean it takes years to clear your debt',
            cy: 'Gall ond talu’r isafswm olygu ei bod yn cymryd blynyddoedd i glirio’ch dyled',
          },
          {
            en: 'You can’t spend more than your agreed credit limit  ',
            cy: "Ni allwch wario mwy na'ch terfyn credyd y cytunwyd arno",
          },
        ], // cons
        {
          en: (
            <Paragraph>
              Read more about{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/credit/simple-guide-to-credit-cards"
              >
                Credit cards
              </Link>{' '}
              or compare options at{' '}
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/eligibility/credit-cards/search/?goal=CC_PURCHASE"
              >
                MoneySavingExpert
              </Link>
              ,{' '}
              <Link asInlineText={true} href="https://www.creditkarma.co.uk/">
                Credit Karma
              </Link>{' '}
              and{' '}
              <Link asInlineText={true} href="https://www.clearscore.com/">
                ClearScore
              </Link>
              .
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Darllenwch fwy am{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/everyday-money/credit/simple-guide-to-credit-cards"
              >
                Gardiau credyd
              </Link>{' '}
              neu gymharwch opsiynau ar{' '}
              <Link
                asInlineText={true}
                href="https://www.moneysavingexpert.com/eligibility/credit-cards/search/?goal=CC_PURCHASE"
              >
                MoneySavingExpert
              </Link>
              ,{' '}
              <Link asInlineText={true} href="https://www.creditkarma.co.uk/">
                Credit Karma
              </Link>{' '}
              a{' '}
              <Link asInlineText={true} href="https://www.clearscore.com/">
                ClearScore
              </Link>
              .
            </Paragraph>
          ),
        }, // bottom paragraph
        [
          {
            question: '1', // How much do you need to borrow
            answer: '1500', // less than 1500
            arithmeticOperator: '<=', // Operator sent separate to value
          },
          {
            question: '2', // What do you need the money for?
            answer: '!1', // Not - Buy a car
          },
          {
            question: '2', // What do you need the money for?
            answer: '!2', // Not - Pay off (consolidate) debt
          },
          {
            question: '3', // What do you need the money for?
            answer: '2', // A week or more
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!2', // Noy - 6 months to 1 year
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!3', // Noy - 1 to 2 years
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!2', // Noy - over 2 years
          },
          //Q5 - Have you ever been refused credit? - Both answers
          //Q6 - How good is your credit score? - Any answer
          {
            question: '6', // How good is your credit score?
            answer: '!0', // Not - Excellent
          },
          {
            question: '6', // How good is your credit score?
            answer: '!1', // Not - Fair/OK
          },
        ], // conditions
      ),
      //Overdraft on your bank account, with interest
      sectionContent(
        {
          en: 'Overdraft on your bank account, with interest',
          cy: 'Gorddrafft ar eich cyfrif banc, gyda llog',
        }, //content title
        {
          en: 'An overdraft lets you spend more than you have in your bank account – up to an agreed limit. You’ll usually pay daily interest until it’s repaid.',
          cy: 'Mae gorddrafft yn gadael i chi wario mwy nag sydd gennych yn eich cyfrif banc – hyd at derfyn y cytunwyd arno. Byddwch fel arfer yn talu llog dyddiol hyd nes y bydd yn cael ei ad-dalu.',
        }, // intro
        {
          en: '40%',
          cy: '40% ',
        }, // interest rate value
        {
          en: 'Ok to excellent',
          cy: 'Iawn i ardderchog',
        }, // credit score value
        {
          en: 'Yes, see cons',
          cy: 'Oes, gweler anfanteision',
        }, // fees value
        {
          en: 'Yes',
          cy: 'Gallwch',
        }, // repay early value
        [
          {
            en: 'Can repay at any time',
            cy: 'Gellir ei ad-dalu ar unrhyw adeg',
          },
          {
            en: 'Can withdraw the money as cash if needed ',
            cy: 'Gellir tynnu’r arian allan fel arian parod os oes angen ',
          },
        ], // pros
        [
          {
            en: 'Expensive interest, charged daily',
            cy: "Llog drud, yn cael ei godi'n ddyddiol",
          },
          {
            en: 'Overdraft limits are usually low',
            cy: 'Mae terfynau gorddrafft fel arfer yn isel',
          },
          {
            en: 'You might pay fees if you spend more than your limit and the payment is refused',
            cy: "Efallai y byddwch yn talu ffioedd os ydych yn gwario mwy na'ch terfyn a gwrthodir y taliad",
          },
          {
            en: 'Being in your overdraft can negatively impact your credit score',
            cy: "Gall bod yn eich gorddrafft effeithio'n negyddol ar eich sgôr credyd",
          },
        ], // cons
        {
          en: (
            <Paragraph>
              Read more about{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/credit/overdrafts-explained"
              >
                overdrafts
              </Link>{' '}
              or compare overdraft rates using our{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/banking/compare-bank-account-fees-and-charges"
              >
                Compare bank accounts
              </Link>{' '}
              tool.
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Darllenwch fwy am{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/everyday-money/credit/overdrafts-explained"
              >
                orddrafftiau
              </Link>{' '}
              neu gymharwch gyfraddau gorddrafft gan ddefnyddio ein{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/everyday-money/banking/compare-bank-account-fees-and-charges"
              >
                Teclyn cymharu cyfrifon banc
              </Link>
              .
            </Paragraph>
          ),
        }, // bottom paragraph
        [
          {
            question: '1', // How much do you need to borrow
            answer: '3000', // less than 3000
            arithmeticOperator: '<=', // Operator sent separate to value
          },
          {
            question: '2', // What do you need the money for?
            answer: '4', // Emergency
          },
          {
            question: '3', // What do you need the money for?
            answer: '!0', // Not - a few hours
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!2', // Noy - 6 months to 1 year
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!3', // Noy - 1 to 2 years
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!2', // Noy - over 2 years
          },
          {
            question: '5', // Have you ever been refused credit?
            answer: '1', // No
          },
          {
            question: '6', // How good is your credit score?
            answer: '!2', // Not - Poor
          },
        ], // conditions
      ),
    ],
  },
  {
    id: '3',
    title: {
      text: {
        en: 'Good options, but may not be open to all',
        cy: 'Dewisiadau da, ond efallai na fyddant yn agored i bawb',
      },
      level: 'h2',
    },
    intro: {
      en: "You might not have heard about these options, but they're worth considering - especially if you've ever been refused credit or have a poor credit score.",
      cy: 'Efallai nad ydych wedi clywed am yr opsiynau hyn, ond maent werth eu hystyried – yn enwedig os yw credyd wedi cael ei wrthod i chi neu os oes gennych sgôr credyd gwael.',
    },
    content: [
      //Salary advance, if your employer's signed up to a scheme
      sectionContent(
        {
          en: "Salary advance, if your employer's signed up to a scheme",
          cy: "Blaenswm cyflog, os yw'ch cyflogwr wedi cofrestru i gynllun",
        }, //content title
        {
          en: (
            <>
              <Paragraph>
                Salary advance, or Earned Wage Access, lets you access part of
                your wages early – usually for a small fee.
              </Paragraph>
              <Paragraph>
                Earned Wage Access only lets you take money you’ve already
                earned early, so you’re not actually borrowing or getting
                credit.
              </Paragraph>
              <Paragraph>
                But other schemes might let you borrow some future earnings as
                well. Check which type of scheme your employer offers.
              </Paragraph>
            </>
          ),
          cy: (
            <>
              <Paragraph>
                Mae blaenswm cyflog, neu Mynediad i Gyflogau a Enillwyd, yn
                gadael i chi gael mynediad at ran o'ch cyflog yn gynnar – fel
                arfer am ffi fach.
              </Paragraph>
              <Paragraph>
                Mae Mynediad at Gyflog a Enillir yn gadael i chi gymryd arian
                rydych eisoes wedi'i ennill yn gynnar, felly mewn gwirionedd nid
                ydych yn benthyca neu'n cael credyd.
              </Paragraph>
              <Paragraph>
                Ond efallai y bydd cynlluniau eraill yn gadael i chi fenthyca
                rhywfaint o enillion yn y dyfodol hefyd. Gwiriwch pa fath o
                gynllun y mae eich cyflogwr yn ei gynnig.
              </Paragraph>
            </>
          ),
        }, // intro
        {
          en: '0%',
          cy: '0%',
        }, // interest rate value
        {
          en: 'Not required',
          cy: "Nid yw'n ofynnol",
        }, // credit score value
        {
          en: 'Yes, see cons',
          cy: 'Oes, gweler anfanteision',
        }, // fees value
        {
          en: 'No',
          cy: 'Na',
        }, // repay early value
        [
          {
            en: 'The money is automatically repaid from your salary',
            cy: "Mae'r arian yn cael ei dalu'n ôl yn awtomatig o'ch cyflog",
          },
          {
            en: 'No risk of missing a repayment',
            cy: 'Dim perygl o fethu ad-daliad',
          },
          {
            en: "It won't affect your credit score",
            cy: 'Ni fydd yn effeithio ar eich sgôr credyd',
          },
        ], // pros
        [
          {
            en: 'Your employer has to be signed up to a scheme',
            cy: "Mae'n rhaid i'ch cyflogwr fod wedi cofrestru i gynllun",
          },
          {
            en: "There's a small fee each time",
            cy: 'Codir ffi bach bob tro',
          },
          {
            en: "It's not extra money, so you'll need to budget for less on your payday",
            cy: "Nid yw'n arian ychwanegol, felly bydd angen i chi gyllidebu am lai ar eich diwrnod cyflog",
          },
          {
            en: "It's not regulated, so little protection if things go wrong",
            cy: "Nid yw'n cael ei reoleiddio, felly ychydig iawn o amddiffyniad os bydd pethau'n mynd o’i le",
          },
        ], // cons
        {
          en: (
            <Paragraph>
              Read more about{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/work/employment/salary-advance-and-earned-wage-access-explained"
              >
                Salary advance
              </Link>{' '}
              or check if your employer offers this option.
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Darllenwch fwy am{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/work/employment/salary-advance-and-earned-wage-access-explained"
              >
                Flaenswm cyflog
              </Link>{' '}
              neu gwiriwch a yw&apos;ch cyflogwr yn cynnig yr opsiwn hwn.
            </Paragraph>
          ),
        }, // bottom paragraph
        [
          {
            question: '1', // How much do you need to borrow
            answer: '1500', // less than 1500
            arithmeticOperator: '<=', // Operator sent separate to value
          },
          {
            question: '2', // What do you need the money for?
            answer: '!0', // Not - Planned purchase
          },
          {
            question: '2', // What do you need the money for?
            answer: '!1', // Not - Buy a car
          },
          {
            question: '2', // What do you need the money for?
            answer: '!2', // Not - Pay off (consolidate) debt
          },
          //Q3  - What do you need the money for? - Any answer
          {
            question: '4', // How quickly could you repay the money?
            answer: '!1', // Noy - 1 to 6 months
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!2', // Noy - 6 months to 1 year
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!3', // Noy - 1 to 2 years
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!4', // Noy - Over 2 years
          },
          //Q5 - Have you ever been refused credit? - Both answers
          //Q6 - How good is your credit score? - Any answer
        ], // conditions
      ),
      //Loan from a credit union, if you become a member
      sectionContent(
        {
          en: 'Loan from a credit union, if you become a member',
          cy: 'Benthyciad gan undeb credyd, os byddwch yn dod yn aelod',
        }, //content title
        {
          en: 'To get a loan from a credit union, you usually need to be a member for a certain length of time - and have some money in its savings accounts.',
          cy: 'I gael benthyciad gan undeb credyd, fel arfer mae angen i chi fod yn aelod am gyfnod penodol o amser - a chael rhywfaint o arian yn eu cyfrifon cynilo. ',
        }, // intro
        {
          en: '12% to 43%',
          cy: '12% i 43% ',
        }, // interest rate value
        {
          en: 'Usually not required',
          cy: 'Fel arfer nid oes angen',
        }, // credit score value
        {
          en: 'No',
          cy: 'Na',
        }, // fees value
        {
          en: 'Yes',
          cy: 'Gallwch',
        }, // repay early value
        [
          {
            en: 'Often accepts people who have been turned down for loans elsewhere',
            cy: 'Yn aml yn derbyn pobl sydd wedi cael eu gwrthod am fenthyciadau mewn mannau eraill',
          },
          {
            en: 'Can repay early with no penalty',
            cy: 'Gellir ad-dalu’n gynnar heb gosb',
          },
          {
            en: "Interest rates can't be higher than 42.6% (12.68% in Northern Ireland)",
            cy: 'Ni all cyfraddau llog fod yn uwch na 42.6% (12.68% yng Ngogledd Iwerddon)',
          },
          {
            en: 'Part of your loan repayment might go into a savings account',
            cy: "Gallai rhan o'ch ad-daliad benthyciad fynd i gyfrif cynilo",
          },
        ], // pros
        [
          {
            en: 'Interest rates are typically higher than a loan from a bank or building society',
            cy: 'Mae cyfraddau llog fel arfer yn uwch na benthyciad gan fanc neu gymdeithas adeiladu',
          },
          {
            en: 'You might have to be a member for a while before you can apply',
            cy: 'Efallai y bydd yn rhaid i chi fod yn aelod am gyfnod cyn y gallwch wneud cais',
          },
          {
            en: 'If you get Child Benefit, the Credit Union might ask you to have it paid to them directly (to repay the loan).',
            cy: "Os ydych yn cael Budd-dal Plant, efallai y bydd yr Undeb Credyd yn gofyn i chi ei dalu'n uniongyrchol iddynt (i ad-dalu'r benthyciad).",
          },
        ], // cons
        {
          en: (
            <Paragraph>
              Read more about{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/credit/credit-unions"
              >
                Credit union loans
              </Link>{' '}
              or see{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/banking/credit-union-current-accounts#How-to-find-a-credit-union"
              >
                How to find a credit union
              </Link>
              .
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Darllenwch fwy am{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/everyday-money/credit/credit-unions"
              >
                Fenthyciadau undeb credyd
              </Link>{' '}
              neu edrychwch ar{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/everyday-money/banking/credit-union-current-accounts#How-to-find-a-credit-union"
              >
                Sut i ddod o hyd i undeb credyd
              </Link>
              .
            </Paragraph>
          ),
        }, // bottom paragraph
        [
          {
            question: '1', // How much do you need to borrow
            answer: '100', // more than 100
            arithmeticOperator: '>=', // Operator sent separate to value
          },
          {
            question: '1', // How much do you need to borrow
            answer: '15000', // less than 15000
            arithmeticOperator: '<=', // Operator sent separate to value
          },
          //Q2 - Reason - Any answer
          //Q3 - Wait time - Any answer
          //Q4 - How quickly could you repay the money? - Any answer
          //Q5 - Have you ever been refused credit? - Both answers
          //Q6 - How good is your credit score? - Any answer
        ], // conditions
      ),
      //Loan from a community lender
      sectionContent(
        {
          en: 'Loan from a community lender',
          cy: 'Benthyciad gan ddarparwr benthyciadau cymunedol',
        }, //content title
        {
          en: 'Community Development Finance Institutions (CDFIs) offer personal loans, often from £100 to £1,500.',
          cy: 'Mae Sefydliadau Cyllid Datblygu Cymunedol (CDFIs) yn cynnig benthyciadau personol, yn aml rhwng £100 a £1,500.',
        }, // intro
        {
          en: '40% to 350%',
          cy: '40% i 350%',
        }, // interest rate value
        {
          en: 'Usually not required',
          cy: 'Fel arfer nid oes angen',
        }, // credit score value
        {
          en: 'Yes, see cons',
          cy: 'Oes, gweler anfanteision',
        }, // fees value
        {
          en: 'Yes',
          cy: 'Gallwch',
        }, // repay early value
        [
          {
            en: 'Often accepts people who’ve been turned down for loans elsewhere',
            cy: 'Yn aml yn derbyn pobl sydd wedi cael eu gwrthod am fenthyciadau mewn mannau eraill',
          },
          {
            en: 'Can usually repay early with no penalty',
            cy: 'Fel arfer gellir ad-dalu’n gynnar heb gosb',
          },
          {
            en: 'Interest rates are typically lower than a payday loan or other high-cost credit',
            cy: 'Mae cyfraddau llog fel arfer yn is na benthyciad diwrnod cyflog neu gredyd cost uchel arall.',
          },
        ], // pros
        [
          {
            en: 'Interest rates can be much higher than a loan from a bank, building society or credit union',
            cy: 'Gall cyfraddau llog fod yn llawer uwch na benthyciad gan fanc, cymdeithas adeiladu neu undeb credyd',
          },
          {
            en: 'You might have to pay an admin fee to get the loan',
            cy: 'Efallai y bydd yn rhaid i chi dalu ffi weinyddol i gael y benthyciad',
          },
        ], // cons
        {
          en: (
            <Paragraph>
              See{' '}
              <Link
                asInlineText={true}
                href="https://www.findingfinance.org.uk/personal-loans"
              >
                Finding Finance
              </Link>{' '}
              to compare options.
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Gweler{' '}
              <Link
                asInlineText={true}
                href="https://www.findingfinance.org.uk/personal-loans"
              >
                Finding Finance
              </Link>{' '}
              i gymharu opsiynau.
            </Paragraph>
          ),
        }, // bottom paragraph
        [
          {
            question: '1', // How much do you need to borrow
            answer: '100', // more than 100
            arithmeticOperator: '>=', // Operator sent separate to value
          },
          {
            question: '1', // How much do you need to borrow
            answer: '1500', // less than 1500
            arithmeticOperator: '<=', // Operator sent separate to value
          },
          {
            question: '2', // What do you need the money for?
            answer: '4', // Emergency
          },
          {
            question: '3', // What do you need the money for?
            answer: '!0', // Not - a few hours
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!3', // Not - 1 to 2 years
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!4', // Not - over 2 years
          },
          //Q5 - Have you ever been refused credit? - Both answers
          //Q6 - How good is your credit score? - Any answer
        ], // conditions
      ),
      //Budgeting Advance, if you get Universal Credit
      sectionContent(
        {
          en: 'Budgeting Advance, if you get Universal Credit',
          cy: 'Taliad Cyllidebu Ymlaen Llaw, os ydych yn cael Credyd Cynhwysol',
        }, //content title
        {
          en: 'A Budgeting Advance is designed to help you pay for essential or unexpected costs. You can borrow between £100 and £812, depending on your circumstances.',
          cy: "Mae Taliad Cyllidebu Ymlaen Llaw wedi'i gynllunio i'ch helpu i dalu am gostau hanfodol neu annisgwyl. Gallwch fenthyca rhwng £100 a £812, yn dibynnu ar eich amgylchiadau.",
        }, // intro
        {
          en: '0%',
          cy: '0%',
        }, // interest rate value
        {
          en: 'Not required',
          cy: "Nid yw'n ofynnol",
        }, // credit score value
        {
          en: 'No',
          cy: 'Na',
        }, // fees value
        {
          en: 'Yes',
          cy: 'Gallwch',
        }, // repay early value
        [
          {
            en: 'It’s interest-free, so there’s no cost',
            cy: "Mae'n ddi-log, felly nid oes cost",
          },
          {
            en: 'Repayments are taken automatically',
            cy: 'Mae ad-daliadau yn cael eu cymryd yn awtomatig',
          },
          {
            en: 'Can repay early with no penalty',
            cy: 'Gellir ad-dalu’n gynnar heb gosb',
          },
        ], // pros
        [
          {
            en: 'Your future Universal Credit payments will be less, so you need to budget carefully',
            cy: "Bydd eich taliadau Credyd Cynhwysol yn y dyfodol yn llai, felly mae angen i chi gyllidebu'n ofalus",
          },
          {
            en: 'You can only use it for essential purchases or expenses',
            cy: 'Dim ond ar gyfer pryniadau neu dreuliau hanfodol y gallwch eu defnyddio',
          },
          {
            en: 'If you stop receiving Universal Credit, you’ll need to pay back the loan another way',
            cy: "Os byddwch yn stopio cael Credyd Cynhwysol, bydd angen i chi ad-dalu'r benthyciad mewn ffordd arall.",
          },
        ], // cons
        {
          en: (
            <Paragraph>
              Read more about a{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/credit/budgeting-loans-and-budgeting-advances"
              >
                Budgeting Advance
              </Link>
              , who qualifies and how to apply.
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Darllenwch fwy am{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/everyday-money/credit/budgeting-loans-and-budgeting-advances"
              >
                Daliad Cyllidebu Ymlaen Llaw
              </Link>
              , pwy sy&apos;n gymwys a sut i wneud cais.{' '}
            </Paragraph>
          ),
        }, // bottom paragraph
        [
          {
            question: '1', // How much do you need to borrow
            answer: '100', // more than 100
            arithmeticOperator: '>=', // Operator sent separate to value
          },
          {
            question: '1', // How much do you need to borrow
            answer: '800', // less than 800
            arithmeticOperator: '<=', // Operator sent separate to value
          },
          {
            question: '2', // What do you need the money for?
            answer: '!0', // Not - Planned purchase
          },
          {
            question: '2', // What do you need the money for?
            answer: '!1', // Not - Buy a car
          },
          {
            question: '2', // What do you need the money for?
            answer: '!2', // Not - Pay off (consolidate) debt
          },
          //Q3  - What do you need the money for? - Any answer
          {
            question: '4', // How quickly could you repay the money?
            answer: '!3', // Not - 1 to 2 years
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!4', // Not - over 2 years
          },
          //Q5 - Have you ever been refused credit? - Both answers
          //Q6 - How good is your credit score? - Any answer
        ], // conditions
      ),
      //Budgeting Loan, if you get certain benefits
      sectionContent(
        {
          en: 'Budgeting Loan, if you get certain benefits',
          cy: 'Benthyciad Trefnu, os ydych yn cael budd-daliadau penodol',
        }, //content title
        {
          en: 'A Budgeting Loan is designed to help you pay for essential or unexpected costs. You can borrow between £100 and £812, depending on your circumstances.',
          cy: "Mae Benthyciad Trefnu wedi'i gynllunio i'ch helpu i dalu am gostau hanfodol neu annisgwyl. Gallwch fenthyca rhwng £100 a £812, yn dibynnu ar eich amgylchiadau.",
        }, // intro
        {
          en: '0%',
          cy: '0%',
        }, // interest rate value
        {
          en: 'Not required',
          cy: "Nid yw'n ofynnol",
        }, // credit score value
        {
          en: 'No',
          cy: 'Na',
        }, // fees value
        {
          en: 'Yes',
          cy: 'Gallwch',
        }, // repay early value
        [
          {
            en: 'It’s interest-free, so there’s no cost',
            cy: "Mae'n ddi-log, felly nid oes cost",
          },
          {
            en: 'Repayments are taken automatically',
            cy: 'Mae ad-daliadau yn cael eu cymryd yn awtomatig',
          },
          {
            en: 'Can repay early with no penalty',
            cy: 'Gellir ad-dalu’n gynnar heb gosb',
          },
        ], // pros
        [
          {
            en: 'Your future benefit payments will be less, so you need to budget carefully',
            cy: "Bydd eich taliadau budd-dal yn y dyfodol yn llai, felly mae angen i chi gyllidebu'n ofalus",
          },
          {
            en: 'You can only use it for essential purchases or expenses',
            cy: 'Dim ond ar gyfer pryniannau neu dreuliau hanfodol y gallwch eu defnyddio',
          },
          {
            en: 'If you stop receiving benefits, you’ll need to pay back the loan another way',
            cy: "Os byddwch yn stopio cael budd-daliadau, bydd angen i chi ad-dalu'r benthyciad mewn ffordd arall.",
          },
        ], // cons
        {
          en: (
            <Paragraph>
              Read more about a{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/credit/budgeting-loans-and-budgeting-advances"
              >
                Budgeting Advance
              </Link>
              , who qualifies and how to apply.
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Darllenwch fwy am{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/credit/budgeting-loans-and-budgeting-advances"
              >
                Fenthyciad Trefnu
              </Link>
              , pwy sy&apos;n gymwys a sut i wneud cais.
            </Paragraph>
          ),
        }, // bottom paragraph
        [
          {
            question: '1', // How much do you need to borrow
            answer: '100', // more than 100
            arithmeticOperator: '>=', // Operator sent separate to value
          },
          {
            question: '1', // How much do you need to borrow
            answer: '800', // less than 800
            arithmeticOperator: '<=', // Operator sent separate to value
          },
          {
            question: '2', // What do you need the money for?
            answer: '!0', // Not - Planned purchase
          },
          {
            question: '2', // What do you need the money for?
            answer: '!1', // Not - Buy a car
          },
          {
            question: '2', // What do you need the money for?
            answer: '!2', // Not - Pay off (consolidate) debt
          },
          {
            question: '3', // What do you need the money for?
            answer: '2', // A week or more
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!4', // Not - over 2 years
          },
          //Q5 - Have you ever been refused credit? - Both answers
          //Q6 - How good is your credit score? - Any answer
        ], // conditions
      ),
    ],
  },
  {
    id: '4',
    title: {
      text: {
        en: 'Expensive options - use as a last resort',
        cy: 'Opsiynau drud – defnyddiwch fel dewis olaf',
      },
      level: 'h2',
    },
    intro: {
      en: 'These high-cost credit options could still suit your needs, but think carefully before using one. They generally charge very high interest rates, so you’ll pay back a lot more than you’re borrowing.',
      cy: "Gallai'r opsiynau credyd cost uchel hyn ddal i fod yn addas i'ch anghenion, ond meddyliwch yn ofalus cyn defnyddio un. Yn gyffredinol, maent yn codi cyfraddau llog uchel iawn, felly byddwch yn ad-dalu llawer mwy na rydych yn ei fenthyca.",
    },
    content: [
      //Loan from a pawnbroker
      sectionContent(
        { en: 'Loan from a pawnbroker', cy: 'Benthyciad gan wystlwr' }, //content title
        {
          en: 'If you have something valuable, you could give it to a pawnbroker and take a smaller loan in return. For example, if you have jewellery worth £200, you might be able to borrow £100.',
          cy: "Os oes gennych rywbeth gwerthfawr, gallech ei roi i wystlwr a chymryd benthyciad llai yn gyfnewid. Er enghraifft, os oes gennych gemwaith sy'n werth £200, efallai y gallwch fenthyca £100.",
        }, // intro
        {
          en: '20% to 60%',
          cy: '20% i 60%',
        }, // interest rate value
        {
          en: 'Poor',
          cy: 'Gwael',
        }, // credit score value
        {
          en: 'Yes, see cons',
          cy: 'Oes, gweler anfanteision',
        }, // fees value
        {
          en: 'Yes',
          cy: 'Gallwch',
        }, // repay early value
        [
          {
            en: 'The loan can usually be paid the same day',
            cy: "Fel arfer, gellir talu'r benthyciad ar yr un diwrnod",
          },
          {
            en: 'Can repay early to cut the cost of interest',
            cy: 'Gellir ad-dalu’n gynnar i leihau cost y llog',
          },
          {
            en: 'You might be able to ask for more time to repay',
            cy: 'Efallai y gallwch ofyn am fwy o amser i ad-dalu',
          },
        ], // pros
        [
          {
            en: 'Interest rates are usually quite high',
            cy: 'Mae cyfraddau llog fel arfer yn eithaf uchel',
          },
          {
            en: "You'll usually need to repay the full amount in one go",
            cy: "Fel arfer, bydd angen i chi ad-dalu'r swm llawn mewn un tro",
          },
          {
            en: "You could lose your item(s) if you're unable to repay in time",
            cy: 'Gallech golli eich eitem/eitemau os na allwch ad-dalu mewn pryd.',
          },
        ], // cons
        {
          en: (
            <Paragraph>
              Read more about{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/credit/pawnbrokers-how-they-work"
              >
                Pawnbrokers
              </Link>{' '}
              or search for one near you at{' '}
              <Link
                asInlineText={true}
                href="https://www.thenpa.com/Find-A-Pawnbroker.aspx"
              >
                National Pawnbrokers Association
              </Link>
              .
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Darllenwch fwy am{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/everyday-money/credit/pawnbrokers-how-they-work"
              >
                Wystlwyr
              </Link>{' '}
              neu chwilio am un sy’n agos atoch chi yn{' '}
              <Link
                asInlineText={true}
                href="https://www.thenpa.com/Find-A-Pawnbroker.aspx"
              >
                Cymdeithas Genedlaethol Gwystlwr
              </Link>
            </Paragraph>
          ),
        }, // bottom paragraph
        [
          {
            question: '1', // How much do you need to borrow
            answer: '500', // less than 500
            arithmeticOperator: '<=', // Operator sent separate to value
          },
          {
            question: '2', // What do you need the money for?
            answer: '4', // Emergency
          },
          //Q3 - How long could you wait for the money? - Any answer
          {
            question: '4', // How quickly could you repay the money?
            answer: '!1', // Not - 1 to 6 months
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!2', // Not - 6 months to 1 year
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!3', // Not - 1 to 2 years
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!4', // Not - over 2 years
          },
          //Q5 - Have you ever been refused credit? - Both answers
          //Q6 - How good is your credit score? - Any answer
        ], // conditions
      ),
      //Home credit or doorstep lending
      sectionContent(
        {
          en: 'Home credit or doorstep lending',
          cy: 'Credyd cartref neu fenthyciad stepen drws',
        }, //content title
        {
          en: 'Home credit lenders will come to your home to collect repayments for a loan in person.',
          cy: "Bydd benthycwyr credyd cartref yn dod i'ch cartref i gasglu ad-daliadau ar gyfer benthyciad yn bersonol.",
        }, // intro
        {
          en: '150% to 300%',
          cy: '150% i 300%',
        }, // interest rate value
        {
          en: 'Not usually required',
          cy: 'Fel arfer nid oes angen',
        }, // credit score value
        {
          en: 'Yes, see cons',
          cy: 'Oes, gweler anfanteision',
        }, // fees value
        {
          en: 'Yes',
          cy: 'Gallwch',
        }, // repay early value
        [
          {
            en: 'Often accepts people who’ve been turned down for loans elsewhere',
            cy: 'Yn aml yn derbyn pobl sydd wedi cael eu gwrthod am fenthyciadau mewn mannau eraill',
          },
          {
            en: 'Can usually repay early with no penalty',
            cy: 'Fel arfer gellir ad-dalu’n gynnar heb gosb',
          },
          {
            en: 'Interest rates are typically lower than a payday loan or other high-cost credit',
            cy: 'Mae cyfraddau llog fel arfer yn is na benthyciad diwrnod cyflog neu gredyd cost uchel arall.',
          },
        ], // pros
        [
          {
            en: 'Interest rates can be much higher than a loan from a bank, building society or credit union',
            cy: 'Gall cyfraddau llog fod yn llawer uwch na benthyciad gan fanc, cymdeithas adeiladu neu undeb credyd',
          },
          {
            en: 'You might have to pay an admin fee to get the loan',
            cy: 'Efallai y bydd yn rhaid i chi dalu ffi weinyddol i gael y benthyciad',
          },
        ], // cons
        {
          en: (
            <Paragraph>
              Read more about{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/credit/home-credit-or-doorstep-lending"
              >
                Home credit
              </Link>{' '}
              or compare costs at{' '}
              <Link
                asInlineText={true}
                href="https://www.lenderscompared.org.uk/"
              >
                Lenders Compared
              </Link>
              .
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Darllenwch fwy am{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/everyday-money/credit/home-credit-or-doorstep-lending"
              >
                Gredyd cartref
              </Link>{' '}
              neu gymharu&apos;r costau yn{' '}
              <Link
                asInlineText={true}
                href="https://www.lenderscompared.org.uk/"
              >
                Lenders Compared
              </Link>
              .
            </Paragraph>
          ),
        }, // bottom paragraph
        [
          {
            question: '1', // How much do you need to borrow
            answer: '1', // more than 1
            arithmeticOperator: '>=', // Operator sent separate to value
          },
          {
            question: '1', // How much do you need to borrow
            answer: '1000', // less than 1000
            arithmeticOperator: '<=', // Operator sent separate to value
          },
          {
            question: '2', // What do you need the money for?
            answer: '4', // Emergency
          },
          {
            question: '3', // How long could you wait for the money?
            answer: '!0', // Not - a few hours
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!4', // Not - less than 6 months
          },
          //Q5 - Have you ever been refused credit? - Both answers
          //Q6 - How good is your credit score? - Any answer
        ], // conditions
      ),
      //Guarantor loan
      sectionContent(
        { en: 'Guarantor loan', cy: 'Benthyciad gwarantwr' }, //content title
        {
          en: 'A guarantor loan is where someone else (the guarantor) agrees to repay the loan if you can’t.',
          cy: "Benthyciad gwarantwr yw pan fydd rhywun arall (y gwarantwr) yn cytuno i ad-dalu'r benthyciad os na allwch chi.",
        }, // intro
        {
          en: '40% to 50%',
          cy: '40% i 50%',
        }, // interest rate value
        {
          en: 'Ok to excellent (for the guarantor)',
          cy: 'Iawn i ardderchog (ar gyfer y gwarantwr)',
        }, // credit score value
        {
          en: 'Yes, see cons',
          cy: 'Oes, gweler anfanteision',
        }, // fees value
        {
          en: 'Yes, see cons',
          cy: 'Gallwch, gweler anfanteision',
        }, // repay early value
        [
          {
            en: 'Might be an option if you can’t get loans elsewhere',
            cy: 'Gallai fod yn opsiwn os na allwch gael benthyciadau mewn mannau eraill',
          },
          {
            en: 'Could improve your credit rating if you repay on time',
            cy: 'Gallech wella eich statws credyd os ydych yn ad-dalu ar amser',
          },
          {
            en: 'You pay a fixed monthly repayment',
            cy: 'Rydych yn talu ad-daliad misol sefydlog',
          },
          {
            en: 'You clear the loan at the end',
            cy: "Byddwch yn clirio'r benthyciad ar y diwedd",
          },
        ], // pros
        [
          {
            en: 'There might be very expensive arrangement fees to pay, on top of interest',
            cy: "Efallai y bydd ffioedd trefnu drud iawn i'w talu, ar ben llog",
          },
          {
            en: 'Interest rates are typically higher than a loan from a bank, building society or credit union',
            cy: 'Mae cyfraddau llog fel arfer yn uwch na benthyciad gan fanc, cymdeithas adeiladu neu undeb credyd',
          },
          {
            en: 'You need to find a guarantor that meets the lender’s criteria',
            cy: "Mae angen i chi ddod o hyd i warantwr sy'n bodloni meini prawf y benthyciwr",
          },
          {
            en: 'You often won’t know the exact interest rate you’ll get until you apply',
            cy: 'Yn aml, ni fyddwch yn gwybod yr union gyfradd llog y byddwch yn ei chael nes i chi wneud cais',
          },
          {
            en: 'Late fees if you miss a payment',
            cy: 'Ffioedd hwyr os byddwch yn methu taliad',
          },
          {
            en: 'You might pay a fee to repay early',
            cy: "Efallai y byddwch yn talu ffi i ad-dalu'n gynnar",
          },
        ], // cons
        {
          en: (
            <Paragraph>
              Read more about{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/credit/guarantor-loans-explained"
              >
                Guarantor loans
              </Link>
              .
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Darllenwch fwy am{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/everyday-money/credit/guarantor-loans-explained"
              >
                Fenthyciadau gwarantwr
              </Link>
              .
            </Paragraph>
          ),
        }, // bottom paragraph
        [
          {
            question: '1', // How much do you need to borrow
            answer: '2000', // more than 2000
            arithmeticOperator: '>=', // Operator sent separate to value
          },
          {
            question: '1', // How much do you need to borrow
            answer: '10000', // less than 10000
            arithmeticOperator: '<=', // Operator sent separate to value
          },
          {
            question: '2', // What do you need the money for?
            answer: '!2', // Not - Pay off (consolidate) debt
          },
          {
            question: '2', // What do you need the money for?
            answer: '!3', // Not - everyday items
          },
          {
            question: '3', // How long could you wait for the money?
            answer: '!0', // Not - a few hours
          },
          //Q4 - How quickly could you repay the money? - Any answer
          //Q5 - Have you ever been refused credit? - Both answers
          //Q6 - How good is your credit score? - Any answer
        ], // conditions
      ),
      //Store or catalogue credit
      sectionContent(
        { en: 'Store or catalogue credit', cy: 'Credyd siop neu gatalog' }, //content title
        {
          en: 'This is a way to buy items by post or online and spread the cost. You’ll usually repay weekly or monthly.',
          cy: "Mae hyn yn ffordd i brynu eitemau drwy'r post neu ar-lein a lledaenu'r gost. Fel arfer, byddwch yn ad-dalu bob wythnos neu fis.",
        }, // intro
        {
          en: '35% to 45%',
          cy: '35% i 45%',
        }, // interest rate value
        {
          en: 'Poor to excellent',
          cy: 'Gwael i ardderchog',
        }, // credit score value
        {
          en: 'Yes, see cons',
          cy: 'Oes, gweler anfanteision',
        }, // fees value
        {
          en: 'Yes',
          cy: 'Gallwch',
        }, // repay early value
        [
          {
            en: 'There might be a short interest-free period',
            cy: 'Efallai y bydd cyfnod byr di-log',
          },
          {
            en: 'Can usually repay early with no penalty',
            cy: 'Fel arfer gellir ad-dalu’n gynnar heb gosb',
          },
          {
            en: 'Usually get free Section 75 protection if something costs £100 to £30,000',
            cy: 'Fel arfer yn cael amddiffyniad Adran 75 am ddim os yw rhywbeth yn costio £100 i £30,000 ',
          },
        ], // pros
        [
          {
            en: 'Daily interest is usually expensive',
            cy: 'Mae llog dyddiol fel arfer yn ddrud',
          },
          {
            en: 'Interest is often charged from day one',
            cy: "Codir llog yn aml o'r diwrnod cyntaf",
          },
          {
            en: 'Late fees if you miss a payment',
            cy: 'Ffioedd hwyr os byddwch yn methu taliad',
          },
          {
            en: 'In some cases, you might not own the item until you’ve made the final payment',
            cy: 'Mewn rhai achosion, efallai na fyddwch yn berchen ar yr eitem nes eich bod wedi gwneud y taliad terfynol.',
          },
        ], // cons
        {
          en: (
            <Paragraph>
              Read more about{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/credit/catalogue-credit-or-shopping-accounts"
              >
                Store credit
              </Link>
              .
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Darllenwch fwy am{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/everyday-money/credit/catalogue-credit-or-shopping-accounts"
              >
                Gredydau siop
              </Link>
              .
            </Paragraph>
          ),
        }, // bottom paragraph
        [
          {
            question: '1', // How much do you need to borrow
            answer: '1000', // less than 1000
            arithmeticOperator: '<=', // Operator sent separate to value
          },
          {
            question: '2', // What do you need the money for?
            answer: '!1', // Not - Buy a car
          },
          {
            question: '2', // What do you need the money for?
            answer: '!2', // Not - Pay off (consolidate) debt
          },
          //Q3 - How long could you wait for the money? - Any answer
          {
            question: '4', // How quickly could you repay the money?
            answer: '!2', // Not - 6 months to 1 year
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!3', // Not - 1 to 2 years
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!4', // Not - over 2 years
          },
          {
            question: '5', // Have you ever been refused credit?
            answer: '1', // No
          },
          //Q6 - How good is your credit score? - Any answer
        ],
      ),
      //Short-term or payday loan
      sectionContent(
        {
          en: 'Short-term or payday loan',
          cy: 'Benthyciad tymor byr neu ddiwrnod cyflog',
        }, //content title
        {
          en: 'A short-term loan is designed to plug gaps in your income, usually for one to six months. But it can be an expensive option, especially if you miss a payment.',
          cy: "Mae benthyciad tymor byr wedi'i gynllunio i lenwi bylchau yn eich incwm, fel arfer am un i chwe mis. Ond gall fod yn opsiwn drud, yn enwedig os byddwch yn methu taliad.",
        }, // intro
        {
          en: '50% to 1,350%',
          cy: '50% i 1,350%',
        }, // interest rate value
        {
          en: 'Poor to excellent',
          cy: 'Gwael i ardderchog',
        }, // credit score value
        {
          en: 'Yes, see cons',
          cy: 'Oes, gweler anfanteision',
        }, // fees value
        {
          en: 'Yes',
          cy: 'Gallwch',
        }, // repay early value
        [
          {
            en: 'You can usually repay early with no penalty',
            cy: "Fel arfer, gallwch ad-dalu'n gynnar heb gosb",
          },
          {
            en: 'Eligibility calculators show your chances of being accepted before applying',
            cy: 'Mae cyfrifianellau cymhwysedd yn dangos eich siawns o gael eich derbyn cyn gwneud cais',
          },
        ], // pros
        [
          {
            en: 'Interest rates and repayments are typically very high',
            cy: 'Mae cyfraddau llog ac ad-daliadau fel arfer yn uchel iawn',
          },
          {
            en: 'Late fees if you miss a payment',
            cy: 'Ffioedd hwyr os byddwch yn methu taliad',
          },
          {
            en: 'You could pay back twice the amount you borrowed in interest',
            cy: 'Gallech ad-dalu dwywaith y swm a fenthycwyd gennych mewn llog',
          },
          {
            en: 'Can make it difficult to get a mortgage',
            cy: "Gall ei gwneud hi'n anodd i gael morgais",
          },
        ], // cons
        {
          en: (
            <Paragraph>
              Read more about{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/credit/payday-loans-what-you-need-to-know"
              >
                Short-term or payday loans
              </Link>
              .
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Darllenwch fwy am{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/everyday-money/credit/payday-loans-what-you-need-to-know"
              >
                Fenthyciadau tymor byr neu ddiwrnod cyflog
              </Link>
              .
            </Paragraph>
          ),
        }, // bottom paragraph
        [
          {
            question: '1', // How much do you need to borrow
            answer: '100', // more than 100
            arithmeticOperator: '>=', // Operator sent separate to value
          },
          {
            question: '1', // How much do you need to borrow
            answer: '1000', // less than 1000
            arithmeticOperator: '<=', // Operator sent separate to value
          },
          {
            question: '2', // What do you need the money for?
            answer: '4', // Emergency
          },
          //Q3 - How long could you wait for the money? - Any answer
          {
            question: '4', // How quickly could you repay the money?
            answer: '!2', // Not - 6 months to 1 year
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!3', // Not - 1 to 2 years
          },
          {
            question: '4', // How quickly could you repay the money?
            answer: '!4', // Not - over 2 years
          },
          //Q5 - Have you ever been refused credit? - Both answers
          //Q6 - How good is your credit score? - Any answer
        ], // conditions
      ),
    ],
  },
  {
    id: '4',
    content: [
      {
        contentTitle: {
          en: 'Struggling with debt?',
          cy: 'Cael trafferth gyda dyledion?',
        },
        contentNode: {
          en: (
            <Paragraph>
              If you&apos;re struggling, borrowing more might seem your only
              option. But it can make things worse. You&apos;re not alone and
              help is available. See{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/en/money-troubles/dealing-with-debt/help-if-youre-struggling-with-debt"
              >
                Help if you&apos;re struggling with debt
              </Link>
              .
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Os ydych yn cael trafferth, efallai y bydd benthyca mwy yn
              ymddangos fel eich unig opsiwn. Ond mae&apos;n gallu gwneud
              pethau&apos;n waeth. Dydych chi ddim ar eich pen eich hun ac mae
              help ar gael. Gweler{' '}
              <Link
                asInlineText={true}
                href="https://www.moneyhelper.org.uk/cy/money-troubles/dealing-with-debt/help-if-youre-struggling-with-debt"
              >
                Help os ydych yn cael trafferth gyda dyledion
              </Link>
              yn gyntaf.{' '}
            </Paragraph>
          ),
        },
        component: 'CardGray',
        conditions: [
          {
            question: '2',
            answer: '!2',
          },
          {
            question: '2',
            answer: '!3',
          },
        ],
      },
    ],
  },
];

const sections: Sections = {
  section,
  labelClosed: {
    en: 'Show details',
    cy: 'Dangos manylion',
  },
  labelOpen: {
    en: 'Hide details',
    cy: 'Cuddio manylion',
  },
};

const data: Data = {
  title: {
    en: 'Borrowing options to consider',
    cy: "Opsiynau benthyca i'w hystyried",
  },
  intro: {
    en: 'Based on what you’ve told us, these types of borrowing might be suitable for your needs. We’ve listed the pros and cons of each so you can compare and decide which could suit your needs.',
    cy: "Yn seiliedig ar beth rydych chi wedi'i ddweud wrthym, gallai'r mathau hyn o fenthyca fod yn addas ar gyfer eich anghenion. Rydym wedi rhestru manteision ac anfanteision pob un fel y gallwch gymharu a phenderfynu a allai weddu i'ch anghenion.",
  },
  noResultsIntro: {
    en: (
      <>
        <span className="block pb-4 text-2xl font-bold">
          There are no results for your search.
        </span>
        <span className="text-base">
          Based on what you’ve told us, we haven’t found any types of borrowing
          that might suit your needs at this time. Try expanding your answers to
          see more results. There are usually more options if you can wait at
          least a week for the money.
        </span>
      </>
    ),
    cy: (
      <>
        <Paragraph className="text-2xl">
          Nid oes unrhyw ganlyniadau ar gyfer eich chwiliad.
        </Paragraph>
        <Paragraph>
          Yn seiliedig ar yr hyn rydych wedi’i ddweud wrthym, nid ydym wedi dod
          o hyd i unrhyw fathau o fenthyciadau a allai fod yn addas i’ch
          anghenion ar hyn o bryd. Ceisiwch ehangu eich atebion i weld mwy o
          ganlyniadau. Fel arfer mae mwy o opsiynau os gallwch chi aros o leiaf
          wythnos am yr arian.
        </Paragraph>
      </>
    ),
  },
  noResultMainContent: {
    en: (
      <div className="space-y-4">
        <Paragraph className="text-2xl">
          For more help, see our guides:
        </Paragraph>
        <ListElement
          variant="unordered"
          color="blue"
          className="space-y-4 ml-7"
          items={[
            <Link
              asInlineText={true}
              key={uuidv4()}
              href="https://www.moneyhelper.org.uk/en/everyday-money/credit/do-you-need-to-borrow-money"
            >
              Making sure you can afford to borrow
            </Link>,
            <Link
              asInlineText={true}
              key={uuidv4()}
              href="https://www.moneyhelper.org.uk/en/everyday-money/credit/how-to-improve-your-credit-score"
            >
              How to improve your credit score
            </Link>,
            <Link
              asInlineText={true}
              key={uuidv4()}
              href="https://www.moneyhelper.org.uk/en/money-troubles/cost-of-living/using-credit-wisely"
            >
              Using credit wisely
            </Link>,
          ]}
        />
      </div>
    ),
    cy: (
      <div className="space-y-4">
        <Paragraph className="text-2xl">
          For more help, see our guides:
        </Paragraph>
        <ListElement
          variant="unordered"
          color="blue"
          className="space-y-4 ml-7"
          items={[
            <Link
              asInlineText={true}
              key={uuidv4()}
              href="https://www.moneyhelper.org.uk/en/everyday-money/credit/do-you-need-to-borrow-money"
            >
              Making sure you can afford to borrow
            </Link>,
            <Link
              asInlineText={true}
              key={uuidv4()}
              href="https://www.moneyhelper.org.uk/en/everyday-money/credit/how-to-improve-your-credit-score"
            >
              How to improve your credit score
            </Link>,
            <Link
              asInlineText={true}
              key={uuidv4()}
              href="https://www.moneyhelper.org.uk/en/money-troubles/cost-of-living/using-credit-wisely"
            >
              Using credit wisely
            </Link>,
          ]}
        />
      </div>
    ),
  },
  sections,
};

export default data;

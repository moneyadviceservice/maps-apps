import { Condition, TranslationGroup, TranslationGroupString } from 'types';

import { Level } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';

export interface ExpandableSectionData {
  intro: TranslationGroupString;
  sections?: {
    props: any;
    component: string;
  }[];
  bottomParagraph: TranslationGroup;
}

interface Section {
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
  sections: Sections;
};

const section: Section[] = [
  {
    id: '1',
    content: [
      {
        contentTitle: { en: 'Struggling with debt?', cy: '' },
        contentNode: {
          en: (
            <Paragraph>
              If you're struggling, borrowing more might seem your only option.
              But it can make things worse. You're not alone and help is
              available. See{' '}
              <Link href="https://www.moneyhelper.org.uk/en/money-troubles/dealing-with-debt/help-if-youre-struggling-with-debt">
                Help if you're struggling with debt
              </Link>
              .
            </Paragraph>
          ),
          cy: <></>,
        },
        component: 'CardGray',
      },
      {
        contentTitle: {
          en: 'You might need a good credit score for some of these options',
          cy: '',
        },
        contentNode: {
          en: (
            <Paragraph>
              We're showing you all the options, but some might not be available
              to you depending on your credit score. Before applying, it's
              important to{' '}
              <Link href="https://www.moneyhelper.org.uk/en/everyday-money/credit/how-to-improve-your-credit-score#how-to-check-and-improve-your-credit-report">
                check your free credit report
              </Link>{' '}
              and use{' '}
              <Link href="https://www.moneyhelper.org.uk/en/everyday-money/credit/how-to-improve-your-credit-score#applying-for-credit">
                eligibility calculators
              </Link>{' '}
              to see your chances of being accepted.
            </Paragraph>
          ),
          cy: <></>,
        },
        component: 'Card',
      },
    ],
  },
  {
    id: '2',
    title: { text: { en: 'Widely available options', cy: '' }, level: 'h2' },
    intro: {
      en: 'Many lenders offer these products, including most high street banks and building societies. So there are generally lots of options and deals to choose from.',
      cy: '',
    },
    content: [
      {
        contentTitle: { en: '0% spending credit card', cy: '' },
        component: 'Card',
        expandable: {
          intro: {
            en: 'A special type of credit card that charges no interest on things you buy - usually for a number of months or years.',
            cy: '',
          },
          sections: [
            {
              component: 'ColumnStrip',
              props: {
                details: [
                  {
                    title: {
                      en: 'Typical interest rates',
                      cy: '',
                    },
                    value: {
                      en: '0% for up to 2 years',
                      cy: '',
                    },
                  },
                  {
                    title: {
                      en: 'Required credit score',
                      cy: '',
                    },
                    value: {
                      en: 'Ok to excellent',
                      cy: '',
                    },
                  },
                  {
                    title: {
                      en: 'Fees & penalties',
                      cy: '',
                    },
                    value: {
                      en: 'Yes, see cons',
                      cy: '',
                    },
                  },
                  {
                    title: {
                      en: 'Can you repay early?',
                      cy: '',
                    },
                    value: {
                      en: 'Yes',
                      cy: '',
                    },
                  },
                ],
              },
            },
            {
              component: 'ProsConsCards',
              props: {
                prosTitle: {
                  en: 'Pros',
                  cy: '',
                },
                consTitle: {
                  en: 'Cons',
                  cy: '',
                },
                pros: [
                  {
                    en: 'No cost if you repay before the interest-free period ends',
                    cy: '',
                  },
                  {
                    en: 'Can repay early',
                    cy: '',
                  },
                  {
                    en: 'Usually get free Section 75 protection if something costs £100 to £30,000',
                    cy: '',
                  },
                  {
                    en: 'Eligibility calculators show your chances of being accepted before applying',
                    cy: '',
                  },
                ],
                cons: [
                  {
                    en: "You'll pay expensive interest on anything after the 0% period ends",
                    cy: '',
                  },
                  {
                    en: 'You must pay the minimum monthly repayment to avoid fees and keep the 0% deal',
                    cy: '',
                  },
                  {
                    en: "You can't spend more than your agreed credit limit",
                    cy: '',
                  },
                ],
              },
            },
          ],
          bottomParagraph: {
            en: (
              <Paragraph>
                Read more about <Link href="">0% spending credit cards</Link> or
                compare options at{' '}
                <Link href="https://www.moneysavingexpert.com/eligibility/credit-cards/search/?goal=CC_PURCHASE">
                  MoneySavingExpert
                </Link>
                ,{' '}
                <Link href="https://www.creditkarma.co.uk/">Credit Karma</Link>{' '}
                and <Link href="https://www.clearscore.com/">ClearScore</Link>.
              </Paragraph>
            ),
            cy: '',
          },
        },
        conditions: [
          {
            question: '1', // How much do you need to borrow
            answer: '10000', // Less than 10,000
            arithmeticOperator: '<', // Operator sent separate to value
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
        ],
      },
      {
        contentTitle: { en: 'Loan from a bank or building society', cy: '' },
        component: 'Card',
        expandable: {
          intro: {
            en: 'A personal loan usually lets you borrow more (and for longer) than other types of credit. Loans up to £30,000 can often be repaid over one to five years.',
            cy: '',
          },
          sections: [
            {
              component: 'ColumnStrip',
              props: {
                details: [
                  {
                    title: {
                      en: 'Typical interest rates',
                      cy: '',
                    },
                    value: {
                      en: '7% to 30%',
                      cy: '',
                    },
                  },
                  {
                    title: {
                      en: 'Required credit score',
                      cy: '',
                    },
                    value: {
                      en: 'Ok to excellent',
                      cy: '',
                    },
                  },
                  {
                    title: {
                      en: 'Fees & penalties',
                      cy: '',
                    },
                    value: {
                      en: 'Yes, see cons',
                      cy: '',
                    },
                  },
                  {
                    title: {
                      en: 'Can you repay early?',
                      cy: '',
                    },
                    value: {
                      en: 'Yes, but see cons',
                      cy: '',
                    },
                  },
                ],
              },
            },
            {
              component: 'ProsConsCards',
              props: {
                prosTitle: {
                  en: 'Pros',
                  cy: '',
                },
                consTitle: {
                  en: 'Cons',
                  cy: '',
                },

                pros: [
                  {
                    en: 'You pay a fixed monthly repayment',
                    cy: '',
                  },
                  {
                    en: "You'll clear the loan at the en",
                    cy: '',
                  },
                  {
                    en: 'Eligibility calculators show your chances of being accepted before applying',
                    cy: '',
                  },
                ],
                cons: [
                  {
                    en: "You often won't know the exact interest rate you'll get until you apply",
                    cy: '',
                  },
                  {
                    en: 'Late fees if you miss a payment',
                    cy: '',
                  },
                  {
                    en: 'You might pay a fee to repay early',
                    cy: '',
                  },
                ],
              },
            },
          ],
          bottomParagraph: {
            en: (
              <Paragraph>
                Read more about{' '}
                <Link href="https://www.moneyhelper.org.uk/en/everyday-money/credit/personal-loans">
                  Personal loans
                </Link>{' '}
                or compare options at{' '}
                <Link href="https://www.moneysavingexpert.com/eligibility/credit-cards/search/?goal=CC_PURCHASE">
                  MoneySavingExpert
                </Link>
                ,{' '}
                <Link href="https://www.creditkarma.co.uk/">Credit Karma</Link>{' '}
                and <Link href="https://www.clearscore.com/">ClearScore</Link>.
              </Paragraph>
            ),
            cy: '',
          },
        },
      },
      {
        contentTitle: { en: 'Debt consolidation loan', cy: '' },
        component: 'Card',
        expandable: {
          intro: {
            en: "This is where you get a new loan to repay your existing debt, so you only have one monthly repayment. But you need to be careful not to run up new debt on top. If you're struggling to repay debt, speak to a free debt adviser first.",
            cy: '',
          },
          sections: [
            {
              component: 'ColumnStrip',
              props: {
                details: [
                  {
                    title: {
                      en: 'Typical interest rates',
                      cy: '',
                    },
                    value: {
                      en: '7% to 30%',
                      cy: '',
                    },
                  },
                  {
                    title: {
                      en: 'Required credit score',
                      cy: '',
                    },
                    value: {
                      en: 'Ok to excellent',
                      cy: '',
                    },
                  },
                  {
                    title: {
                      en: 'Fees & penalties',
                      cy: '',
                    },
                    value: {
                      en: 'Yes, see cons',
                      cy: '',
                    },
                  },
                  {
                    title: {
                      en: 'Can you repay early?',
                      cy: '',
                    },
                    value: {
                      en: 'Yes, but see cons',
                      cy: '',
                    },
                  },
                ],
              },
            },
            {
              component: 'ProsConsCards',
              props: {
                prosTitle: {
                  en: 'Pros',
                  cy: '',
                },
                consTitle: {
                  en: 'Cons',
                  cy: '',
                },

                pros: [
                  {
                    en: 'You pay a fixed monthly repayment for all your debt',
                    cy: '',
                  },
                  {
                    en: "You'll clear the loan at the end",
                    cy: '',
                  },
                  {
                    en: 'Eligibility calculators show your chances of being accepted before applying',
                    cy: '',
                  },
                ],
                cons: [
                  {
                    en: "You often won't know the exact interest rate you'll get until you apply",
                    cy: '',
                  },
                  {
                    en: 'Late fees if you miss a payment',
                    cy: '',
                  },
                  {
                    en: 'You might pay a fee to repay early',
                    cy: '',
                  },
                ],
              },
            },
          ],
          bottomParagraph: {
            en: (
              <Paragraph>
                Read more about{' '}
                <Link href="https://www.moneyhelper.org.uk/en/everyday-money/credit/debt-consolidation-loans">
                  Debt consolidation loans
                </Link>{' '}
                or compare options at{' '}
                <Link href="https://www.moneysavingexpert.com/eligibility/credit-cards/search/?goal=CC_PURCHASE">
                  MoneySavingExpert
                </Link>
                ,{' '}
                <Link href="https://www.creditkarma.co.uk/">Credit Karma</Link>{' '}
                and <Link href="https://www.clearscore.com/">ClearScore</Link>.
              </Paragraph>
            ),
            cy: '',
          },
        },
      },
    ],
  },
  {
    id: '3',
    title: {
      text: { en: 'Good options, but may not be open to all', cy: '' },
      level: 'h2',
    },
    intro: {
      en: "You might not have heard about these options, but they're worth considering - especially if you've ever been refused credit or have a poor credit score.",
      cy: '',
    },
    content: [
      {
        contentTitle: {
          en: 'Loan from a credit union, if you become a member',
          cy: '',
        },
        component: 'Card',
        expandable: {
          intro: {
            en: 'To get a loan from a credit union, you usually need to be a member for a certain length of time - and have some money in its savings accounts.',
            cy: '',
          },
          sections: [
            {
              component: 'ColumnStrip',
              props: {
                details: [
                  {
                    title: {
                      en: 'Typical interest rates',
                      cy: '',
                    },
                    value: {
                      en: '12% to 43%',
                      cy: '',
                    },
                  },
                  {
                    title: {
                      en: 'Required credit score',
                      cy: '',
                    },
                    value: {
                      en: 'Usually not required',
                      cy: '',
                    },
                  },
                  {
                    title: {
                      en: 'Fees & penalties',
                      cy: '',
                    },
                    value: {
                      en: 'No',
                      cy: '',
                    },
                  },
                  {
                    title: {
                      en: 'Can you repay early?',
                      cy: '',
                    },
                    value: {
                      en: 'Yes',
                      cy: '',
                    },
                  },
                ],
              },
            },
            {
              component: 'ProsConsCards',
              props: {
                prosTitle: {
                  en: 'Pros',
                  cy: '',
                },
                consTitle: {
                  en: 'Cons',
                  cy: '',
                },

                pros: [
                  {
                    en: 'Often accepts people who have been turned down for loans elsewhere',
                    cy: '',
                  },
                  {
                    en: 'Can repay early with no penalty',
                    cy: '',
                  },
                  {
                    en: "Interest rates can't be higher than 42.6% (12.68% in Northern Ireland)",
                    cy: '',
                  },
                  {
                    en: 'Part of your loan repayment might go into a savings account',
                    cy: '',
                  },
                ],
                cons: [
                  {
                    en: 'Interest rates are typically higher than a loan from a bank or building society',
                    cy: '',
                  },
                  {
                    en: 'You might have to be a member for a while before you can apply',
                    cy: '',
                  },
                  {
                    en: 'If you get Child Benefit, the Credit Union might ask you to have it paid to them directly (to repay the loan).',
                    cy: '',
                  },
                ],
              },
            },
          ],
          bottomParagraph: {
            en: (
              <Paragraph>
                Read more about{' '}
                <Link href="https://www.moneyhelper.org.uk/en/everyday-money/credit/credit-unions">
                  Credit union loans
                </Link>{' '}
                or see{' '}
                <Link href="https://www.moneyhelper.org.uk/en/everyday-money/banking/credit-union-current-accounts#How-to-find-a-credit-union">
                  How to find a credit union
                </Link>
                .
              </Paragraph>
            ),
            cy: '',
          },
        },
      },
      {
        contentTitle: {
          en: "Salary advance, if your employer's signed up to a scheme",
          cy: '',
        },
        component: 'Card',
        expandable: {
          intro: {
            en: 'Salary advance, or Earned Wage Access, lets you access part of your wages early - usually for a small fee.',
            cy: '',
          },
          sections: [
            {
              component: 'ColumnStrip',
              props: {
                details: [
                  {
                    title: {
                      en: 'Typical interest rates',
                      cy: '',
                    },
                    value: {
                      en: '0%',
                      cy: '',
                    },
                  },
                  {
                    title: {
                      en: 'Required credit score',
                      cy: '',
                    },
                    value: {
                      en: 'Not required',
                      cy: '',
                    },
                  },
                  {
                    title: {
                      en: 'Fees & penalties',
                      cy: '',
                    },
                    value: {
                      en: 'Yes, see cons',
                      cy: '',
                    },
                  },
                  {
                    title: {
                      en: 'Can you repay early?',
                      cy: '',
                    },
                    value: {
                      en: 'No',
                      cy: '',
                    },
                  },
                ],
              },
            },
            {
              component: 'ProsConsCards',
              props: {
                prosTitle: {
                  en: 'Pros',
                  cy: '',
                },
                consTitle: {
                  en: 'Cons',
                  cy: '',
                },

                pros: [
                  {
                    en: 'The money is automatically repaid from your salary',
                    cy: '',
                  },
                  {
                    en: 'No risk of missing a repayment',
                    cy: '',
                  },
                  {
                    en: "It won't affect your credit score",
                    cy: '',
                  },
                ],
                cons: [
                  {
                    en: 'Your employer has to be signed up to a scheme',
                    cy: '',
                  },
                  {
                    en: "There's a small fee each time",
                    cy: '',
                  },
                  {
                    en: "It's not extra money, so you'll need to budget for less on your payday",
                    cy: '',
                  },
                  {
                    en: "It's not regulated, so little protection if things go wrong",
                    cy: '',
                  },
                ],
              },
            },
          ],
          bottomParagraph: {
            en: (
              <Paragraph>
                Read more about{' '}
                <Link href="https://www.moneyhelper.org.uk/en/work/employment/salary-advance-and-earned-wage-access-explained">
                  Salary advance
                </Link>{' '}
                or check if your employer offers this option.
              </Paragraph>
            ),
            cy: '',
          },
        },
      },
    ],
  },
  {
    id: '4',
    title: {
      text: { en: 'Expensive options - use as a last resort', cy: '' },
      level: 'h2',
    },
    intro: {
      en: 'These high-cost credit options could still suit your needs, but think carefully before using one. They generally charge very high interest rates, so you’ll pay back a lot more than you’re borrowing.',
      cy: '',
    },
    content: [
      {
        contentTitle: { en: 'Loan from a pawnbroker', cy: '' },
        component: 'Card',
        expandable: {
          intro: {
            en: 'If you have something valuable, you could give it to a pawnbroker and take a smaller loan in return. For example, if you have jewellery worth £200, you might be able to borrow £100.',
            cy: '',
          },
          sections: [
            {
              component: 'ColumnStrip',
              props: {
                details: [
                  {
                    title: {
                      en: 'Typical interest rates',
                      cy: '',
                    },
                    value: {
                      en: '20% to 60%',
                      cy: '',
                    },
                  },
                  {
                    title: {
                      en: 'Required credit score',
                      cy: '',
                    },
                    value: {
                      en: 'Poor',
                      cy: '',
                    },
                  },
                  {
                    title: {
                      en: 'Fees & penalties',
                      cy: '',
                    },
                    value: {
                      en: 'Yes, see cons',
                      cy: '',
                    },
                  },
                  {
                    title: {
                      en: 'Can you repay early?',
                      cy: '',
                    },
                    value: {
                      en: 'Yes',
                      cy: '',
                    },
                  },
                ],
              },
            },
            {
              component: 'ProsConsCards',
              props: {
                prosTitle: {
                  en: 'Pros',
                  cy: '',
                },
                consTitle: {
                  en: 'Cons',
                  cy: '',
                },

                pros: [
                  {
                    en: 'The loan can usually be paid the same day',
                    cy: '',
                  },
                  {
                    en: 'Can repay early to cut the cost of interest',
                    cy: '',
                  },
                  {
                    en: 'You might be able to ask for more time to repay',
                    cy: '',
                  },
                ],
                cons: [
                  {
                    en: 'Interest rates are usually quite high',
                    cy: '',
                  },
                  {
                    en: "You'll usually need to repay the full amount in one go",
                    cy: '',
                  },
                  {
                    en: "You could lose your item(s) if you're unable to repay in time",
                    cy: '',
                  },
                ],
              },
            },
          ],
          bottomParagraph: {
            en: (
              <Paragraph>
                Read more about{' '}
                <Link href="https://www.moneyhelper.org.uk/en/everyday-money/credit/pawnbrokers-how-they-work">
                  Pawnbrokers
                </Link>{' '}
                or search for one near you at{' '}
                <Link href="https://www.thenpa.com/Find-A-Pawnbroker.aspx">
                  National Pawnbrokers Association
                </Link>
                .
              </Paragraph>
            ),
            cy: '',
          },
        },
      },
    ],
  },
];

const sections: Sections = {
  section,
  labelClosed: {
    en: 'Show details',
    cy: '',
  },
  labelOpen: {
    en: 'Hide details',
    cy: '',
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
  sections,
};

export default data;

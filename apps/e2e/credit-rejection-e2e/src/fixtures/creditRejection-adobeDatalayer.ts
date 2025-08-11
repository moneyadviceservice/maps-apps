export const adobeDatalayer = (locale: string) => {
  return {
    // 01. Question - 1 & Tool Start (ticket # 22771)
    'credit-rejection/question-1': {
      page: {
        categoryL1: 'Everyday money',
        categoryL2: 'Credit',
        pageName: 'Credit Rejection--question-1',
        pageTitle: {
          en: 'Were you declined credit question',
          cy: 'Cwestiwn cael eich gwrthod am gredyd',
        }[locale],
        pageType: 'tool page',
        site: 'partner',
      },
      tool: {
        stepName: 'Have you been declined for credit in the past six months?',
        toolCategory: '',
        toolName: 'Credit Rejection',
        toolStep: 1,
      },
    },

    // 02. Question - 2
    'credit-rejection/question-2?q-1=1&score-q-1=0': {
      page: {
        categoryL1: 'Everyday money',
        categoryL2: 'Credit',
        pageName: 'Credit Rejection--question-2',
        pageTitle: {
          en: 'Credit report for errors question',
          cy: 'Cwestiwn gwallau adroddiad credyd',
        }[locale],
        pageType: 'tool page',
        site: 'partner',
      },
      tool: {
        stepName:
          'Have you checked your credit report for errors in the last month?',
        toolCategory: '',
        toolName: 'Credit Rejection',
        toolStep: 2,
      },
    },

    // 03. Question - 3
    'credit-rejection/question-3?q-1=1&q-2=1': {
      page: {
        categoryL1: 'Everyday money',
        categoryL2: 'Credit',
        pageName: 'Credit Rejection--question-3',
        pageTitle: {
          en: 'Accounts in your name question',
          cy: 'Cwestiwn cyfrifon yn eich enw',
        }[locale],
        pageType: 'tool page',
        site: 'partner',
      },
      tool: {
        stepName: 'Do you have any of these accounts in your name?',
        toolCategory: '',
        toolName: 'Credit Rejection',
        toolStep: 3,
      },
    },

    // 04. Question - 4
    'credit-rejection/question-4?q-1=1&q-2=1&q-3=1': {
      page: {
        categoryL1: 'Everyday money',
        categoryL2: 'Credit',
        pageName: 'Credit Rejection--question-4',
        pageTitle: {
          en: 'Accounts with old details question',
          cy: 'Cwestiwn cyfrifon gyda hen fanylion',
        }[locale],
        pageType: 'tool page',
        site: 'partner',
      },
      tool: {
        stepName: 'Do any of the accounts in your name use old details?',
        toolCategory: '',
        toolName: 'Credit Rejection',
        toolStep: 4,
      },
    },
    // 05. Question - 5
    'credit-rejection/question-5?q-1=1&q-2=1&q-3=1&q-4=1': {
      page: {
        categoryL1: 'Everyday money',
        categoryL2: 'Credit',
        pageName: 'Credit Rejection--question-5',
        pageTitle: {
          en: 'Paying back borrowing question',
          cy: 'Cwestiwn ad-dalu benthyciadau',
        }[locale],
        pageType: 'tool page',
        site: 'partner',
      },
      tool: {
        stepName: 'Are you paying back any borrowing?',
        toolCategory: '',
        toolName: 'Credit Rejection',
        toolStep: 5,
      },
    },

    // 06. Question - 6
    'credit-rejection/question-6?q-1=1&q-2=1&q-3=1&q-4=1&q-5=1': {
      page: {
        categoryL1: 'Everyday money',
        categoryL2: 'Credit',
        pageName: 'Credit Rejection--question-6',
        pageTitle: {
          en: 'Pay your bills on time question',
          cy: 'Cwestiwn talu eich biliau ar amser',
        }[locale],
        pageType: 'tool page',
        site: 'partner',
      },
      tool: {
        stepName: 'Do you always pay your bills on time?',
        toolCategory: '',
        toolName: 'Credit Rejection',
        toolStep: 6,
      },
    },

    // 07. Question - 7
    'credit-rejection/question-7?q-1=1&q-2=1&q-3=1&q-4=1&q-5=1&q-6=0': {
      page: {
        categoryL1: 'Everyday money',
        categoryL2: 'Credit',
        pageName: 'Credit Rejection--question-7',
        pageTitle: {
          en: 'Registered to vote question',
          cy: 'Cwestiwn cofrestru i bleidleisio',
        }[locale],
        pageType: 'tool page',
        site: 'partner',
      },
      tool: {
        stepName: 'Have you registered to vote at your current address?',
        toolCategory: '',
        toolName: 'Credit Rejection',
        toolStep: 7,
      },
    },

    // 08. Question - 8
    'credit-rejection/question-8?q-1=1&q-2=1&q-3=1&q-4=1&q-5=1&q-6=0&q-7=0': {
      page: {
        categoryL1: 'Everyday money',
        categoryL2: 'Credit',
        pageName: 'Credit Rejection--question-8',
        pageTitle: {
          en: 'Joint finances question',
          cy: 'Cwestiwn cyllid ar y cyd',
        }[locale],
        pageType: 'tool page',
        site: 'partner',
      },
      tool: {
        stepName: 'Do you have joint finances with someone?',
        toolCategory: '',
        toolName: 'Credit Rejection',
        toolStep: 8,
      },
    },

    // 09. Change Options
    'credit-rejection/change-options?q-1=1&q-2=1&q-3=1&q-4=1&q-5=1&q-6=0&q-7=0&q-8=1':
      {
        page: {
          categoryL1: 'Everyday money',
          categoryL2: 'Credit',
          pageName: 'Credit Rejection--change-options',
          pageTitle: {
            en: 'Check your answers',
            cy: 'Edrychwch dros eich atebion',
          }[locale],
          pageType: 'tool page',
          site: 'partner',
        },
        tool: {
          stepName: 'Check your answers',
          toolCategory: '',
          toolName: 'Credit Rejection',
          toolStep: 9,
        },
      },

    // 10. Results page
    'credit-rejection/results?q-1=1&q-2=1&q-3=1&q-4=1&q-5=1&q-6=0&q-7=0&q-8=1':
      {
        page: {
          categoryL1: 'Everyday money',
          categoryL2: 'Credit',
          pageName: 'Credit Rejection--results',
          pageTitle: {
            en: 'Personalised action plan',
            cy: 'Cynllun gweithredu personol',
          }[locale],
          pageType: 'tool page',
          site: 'partner',
        },
        tool: {
          stepName: 'Your action plan',
          toolCategory: '',
          toolName: 'Credit Rejection',
          toolStep: 10,
        },
      },

    // 11. Tool Completion
    'credit-rejection/results?q-1=1&score-q-1=0&q-2=1&score-q-2=0&q-3=2&score-q-3=0&q-4=1&score-q-4=0&q-5=0&score-q-5=1&q-6=0&score-q-6=0&q-7=0&score-q-7=0&q-8=0&score-q-8=0':
      {
        page: {
          categoryL1: 'Everyday money',
          categoryL2: 'Credit',
          pageName: 'Credit Rejection--results',
          pageTitle: {
            en: 'Personalised action plan',
            cy: 'Cynllun gweithredu personol',
          }[locale],
          pageType: 'tool page',
          site: 'partner',
        },
        tool: {
          stepName: 'Your action plan',
          toolCategory: '',
          toolName: 'Credit Rejection',
          toolStep: 10,
        },
      },

    // 12. Tool Restart
    'credit-rejection/question-1?restart=true': {
      page: {
        categoryL1: 'Everyday money',
        categoryL2: 'Credit',
        pageName: 'Credit Rejection--question-1',
        pageTitle: {
          en: 'Were you declined credit question',
          cy: 'Cwestiwn cael eich gwrthod am gredyd',
        }[locale],
        pageType: 'tool page',
        site: 'partner',
      },
      tool: {
        stepName: 'Have you been declined for credit in the past six months?',
        toolCategory: '',
        toolName: 'Credit Rejection',
        toolStep: 1,
      },
    },

    // 13. Error message
    'credit-rejection/question-3?q-1=1&q-2=1&error=q-3': {
      page: {
        categoryL1: 'Everyday money',
        categoryL2: 'Credit',
        pageName: 'Credit Rejection--question-3',
        pageTitle: {
          en: 'Accounts in your name question',
          cy: 'Cwestiwn cyfrifon yn eich enw',
        }[locale],
        pageType: 'tool page',
        site: 'partner',
      },
      tool: {
        stepName: 'Do you have any of these accounts in your name?',
        toolCategory: '',
        toolName: 'Credit Rejection',
        toolStep: 3,
      },
    },
  };
};

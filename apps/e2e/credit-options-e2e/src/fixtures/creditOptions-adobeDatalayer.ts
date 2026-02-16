import '@maps-react/utils/e2e/support/commands';
export const adobeDatalayer = (locale: string) => {
  return {
    // 01. Tool Start / Question - 1
    'credit-options/question-1': {
      page: {
        categoryL1: 'Everyday money',
        categoryL2: 'Credit',
        pageName: 'credit-options--question-1',
        pageTitle: {
          en: 'How much do you need to borrow?',
          cy: 'Faint sydd angen i chi ei fenthyca?',
        }[locale],
        pageType: 'tool page',
        site: 'partner',
      },
      tool: {
        stepName: 'How much do you need to borrow?',
        toolCategory: '',
        toolName: 'Credit Options',
        toolStep: 1,
      },
    },

    // 02. Question - 2
    'credit-options/question-2?q-1=%C2%A35000': {
      page: {
        categoryL1: 'Everyday money',
        categoryL2: 'Credit',
        pageName: 'credit-options--question-2',
        pageTitle: {
          en: 'What do you need the money for?',
          cy: 'Ar gyfer beth ydych chi angen yr arian?',
        }[locale],
        pageType: 'tool page',
        site: 'partner',
      },
      tool: {
        stepName: 'What do you need the money for?',
        toolCategory: '',
        toolName: 'Credit Options',
        toolStep: 2,
      },
    },
    // 03. Question - 3
    'credit-options/question-3?q-1=%C2%A35000&q-2=1': {
      page: {
        categoryL1: 'Everyday money',
        categoryL2: 'Credit',
        pageName: 'credit-options--question-3',
        pageTitle: {
          en: 'How long could you wait for the money?',
          cy: 'Pa mor hir allwch chi ddisgwyl am yr arian?',
        }[locale],
        pageType: 'tool page',
        site: 'partner',
      },
      tool: {
        stepName: 'How long could you wait for the money?',
        toolCategory: '',
        toolName: 'Credit Options',
        toolStep: 3,
      },
    },

    // 04. Question - 4
    'credit-options/question-4?q-1=%C2%A35000&q-2=1&q-3=0': {
      page: {
        categoryL1: 'Everyday money',
        categoryL2: 'Credit',
        pageName: 'credit-options--question-4',
        pageTitle: {
          en: 'How quickly could you repay the money?',
          cy: "Pa mor gyflym y gallwch chi dalu'r arian ôl?",
        }[locale],
        pageType: 'tool page',
        site: 'partner',
      },
      tool: {
        stepName: 'How quickly could you repay the money?',
        toolCategory: '',
        toolName: 'Credit Options',
        toolStep: 4,
      },
    },

    // 05. Question - 5
    'credit-options/question-5?q-1=%C2%A35000&q-2=1&q-3=0&q-4=1': {
      page: {
        categoryL1: 'Everyday money',
        categoryL2: 'Credit',
        pageName: 'credit-options--question-5',
        pageTitle: {
          en: 'Have you ever been refused credit? ',
          cy: 'A ydych erioed wedi cael credyd wedi’i wrthod?',
        }[locale],
        pageType: 'tool page',
        site: 'partner',
      },
      tool: {
        stepName: 'Have you ever been refused credit?',
        toolCategory: '',
        toolName: 'Credit Options',
        toolStep: 5,
      },
    },

    // 06. Question - 6
    'credit-options/question-6?q-1=%C2%A35000&q-2=1&q-3=0&q-4=1&q-5=1': {
      page: {
        categoryL1: 'Everyday money',
        categoryL2: 'Credit',
        pageName: 'credit-options--question-6',
        pageTitle: {
          en: 'How good is your credit score?',
          cy: 'Pa mor dda yw eich sgôr credyd?',
        }[locale],
        pageType: 'tool page',
        site: 'partner',
      },
      tool: {
        stepName: 'How good is your credit score?',
        toolCategory: '',
        toolName: 'Credit Options',
        toolStep: 6,
      },
    },

    // 07. Change Options
    'credit-options/change-options?q-1=%C2%A35000&q-2=1&q-3=0&q-4=1&q-5=1&q-6=1':
      {
        page: {
          categoryL1: 'Everyday money',
          categoryL2: 'Credit',
          pageName: 'credit-options--change-options',
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
          toolName: 'Credit Options',
          toolStep: 7,
        },
      },

    // 08. Results page
    'credit-options/results?q-1=%C2%A35000&q-2=1&q-3=0&q-4=1&q-5=1&q-6=1': {
      page: {
        categoryL1: 'Everyday money',
        categoryL2: 'Credit',
        pageName: 'credit-options--results',
        pageTitle: {
          en: 'Borrowing options to consider',
          cy: "Opsiynau benthyca i'w hystyried",
        }[locale],
        pageType: 'tool page',
        site: 'partner',
      },
      tool: {
        stepName: 'Borrowing options to consider',
        toolCategory: '',
        toolName: 'Credit Options',
        toolStep: 8,
      },
    },

    // 09. Tool Completion
    'credit-options/results?q-1=%C2%A3600&q-2=1&q-3=0&q-4=1&q-5=1&q-6=2': {
      page: {
        categoryL1: 'Everyday money',
        categoryL2: 'Credit',
        pageName: 'credit-options--results',
        pageTitle: {
          en: 'Borrowing options to consider',
          cy: "Opsiynau benthyca i'w hystyried",
        }[locale],
        pageType: 'tool page',
        site: 'partner',
      },
      tool: {
        stepName: 'Borrowing options to consider',
        toolCategory: '',
        toolName: 'Credit Options',
        toolStep: 8,
      },
    },

    // 10. Tool Restart
    'credit-options/question-1?restart=true': {
      page: {
        categoryL1: 'Everyday money',
        categoryL2: 'Credit',
        pageName: 'credit-options--question-1',
        pageTitle: {
          en: 'How much do you need to borrow?',
          cy: 'Faint sydd angen i chi ei fenthyca?',
        }[locale],
        pageType: 'tool page',
        site: 'partner',
      },
      tool: {
        stepName: 'How much do you need to borrow?',
        toolCategory: '',
        toolName: 'Credit Options',
        toolStep: 1,
      },
    },

    // 11. Error message
    'credit-options/question-2?q-1=%C2%A3500&error=q-2': {
      page: {
        categoryL1: 'Everyday money',
        categoryL2: 'Credit',
        pageName: 'credit-options--question-2',
        pageTitle: {
          en: 'What do you need the money for?',
          cy: 'Ar gyfer beth ydych chi angen yr arian?',
        }[locale],
        pageType: 'tool page',
        site: 'partner',
      },
      tool: {
        stepName: 'What do you need the money for?',
        toolCategory: '',
        toolName: 'Credit Options',
        toolStep: 2,
      },
    },
  };
};

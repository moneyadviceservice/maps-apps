export const adobeDatalayer = (locale: string) => {
  return {
    // 01. Question - 1  & Tool Start
    'question-1': {
      page: {
        pageName: 'midlife-mot--question-1',
        pageTitle: {
          en: 'Age question',
          cy: 'Cwestiwn oedran',
        }[locale],
        pageType: 'tool page',
        source: 'direct',
        site: 'partner',
      },
      tool: {
        stepName: 'How old are you?',
        toolCategory: '',
        toolName: 'Midlife MOT',
        toolStep: 1,
      },
    },

    // 02. Question - 2
    'question-2?q-1=1&score-q-1=0': {
      page: {
        pageName: 'midlife-mot--question-2',
        pageTitle: {
          en: 'Location question',
          cy: 'Cwestiwn lleoliad',
        }[locale],
        pageType: 'tool page',
        source: 'direct',
        site: 'partner',
      },
      tool: {
        stepName: 'Where do you live?',
        toolCategory: '',
        toolName: 'Midlife MOT',
        toolStep: 2,
      },
    },

    // 03. Question - 3
    'question-3?q-1=1&score-q-1=0&q-2=0&score-q-2=0': {
      page: {
        pageName: 'midlife-mot--question-3',
        pageTitle: {
          en: 'Bills and current repayments question',
          cy: 'Cwestiwn ynghylch biliau ac ad-daliadau presenno',
        }[locale],
        pageType: 'tool page',
        source: 'direct',
        site: 'partner',
      },
      tool: {
        stepName:
          'How well are you keeping up with bills and credit repayments?',
        toolCategory: '',
        toolName: 'Midlife MOT',
        toolStep: 3,
      },
    },

    // 04. Question - 4
    'question-4?q-1=1&score-q-1=0&q-2=0&score-q-2=0&q-3=6&score-q-3=2&q-4=3&score-q-4=1':
      {
        page: {
          pageName: 'midlife-mot--question-4',
          pageTitle: {
            en: 'Approach to budgeting question',
            cy: 'Cwestiwn dull cyllidebu',
          }[locale],
          pageType: 'tool page',
          source: 'direct',
          site: 'partner',
        },
        tool: {
          stepName: "What's your approach to budgeting?",
          toolCategory: '',
          toolName: 'Midlife MOT',
          toolStep: 4,
        },
      },
    // 05. Question - 5
    'question-5?q-1=1&score-q-1=0&q-2=0&score-q-2=0&q-3=6&score-q-3=2&q-4=0&score-q-4=3':
      {
        page: {
          pageName: 'midlife-mot--question-5',
          pageTitle: {
            en: 'Maximising your income question',
            cy: 'Cwestiwn cynyddu eich incwm',
          }[locale],
          pageType: 'tool page',
          source: 'direct',
          site: 'partner',
        },
        tool: {
          stepName: 'Have you considered these ways to increase your income?',
          toolCategory: '',
          toolName: 'Midlife MOT',
          toolStep: 5,
        },
      },

    // 06. Question - 6
    'question-6?q-1=1&score-q-1=0&q-2=0&score-q-2=0&q-3=6&score-q-3=2&q-4=0&score-q-4=3&q-5=0&score-q-5=2':
      {
        page: {
          pageName: 'midlife-mot--question-6',
          pageTitle: {
            en: 'Reducing household bills question',
            cy: 'Cwestiwn lleihau biliau cartref',
          }[locale],
          pageType: 'tool page',
          site: 'partner',
        },
        tool: {
          stepName:
            'Have you thought about ways to reduce the cost of these household bills?',
          toolCategory: '',
          toolName: 'Midlife MOT',
          toolStep: 6,
        },
      },

    // 07. Question - 7
    'question-7?q-1=1&score-q-1=0&q-2=0&score-q-2=0&q-3=6&score-q-3=2&q-4=0&score-q-4=3&q-5=0&score-q-5=2&q-6=0&score-q-6=2':
      {
        page: {
          pageName: 'midlife-mot--question-7',
          pageTitle: {
            en: 'Estate planning question',
            cy: 'Cwestiwn cynllunio ystad',
          }[locale],
          pageType: 'tool page',
          site: 'partner',
        },
        tool: {
          stepName:
            'What will happen to your money and property if you get seriously ill or die?',
          toolCategory: '',
          toolName: 'Midlife MOT',
          toolStep: 7,
        },
      },

    // 08. Question - 8
    'question-8?q-1=1&score-q-1=0&q-2=0&score-q-2=0&q-3=6&score-q-3=2&q-4=0&score-q-4=3&q-5=0&score-q-5=2&q-6=0&score-q-6=2&q-7=4&score-q-7=1':
      {
        page: {
          pageName: 'midlife-mot--question-8',
          pageTitle: {
            en: 'Emergency savings question',
            cy: 'Cwestiwn cynilion brys',
          }[locale],
          pageType: 'tool page',
          site: 'partner',
        },
        tool: {
          stepName:
            'Do you have money set aside in case you lose your job or source of income?',
          toolCategory: '',
          toolName: 'Midlife MOT',
          toolStep: 8,
        },
      },

    // 09. Question - 9
    'question-9?q-1=1&score-q-1=0&q-2=0&score-q-2=0&q-3=6&score-q-3=2&q-4=0&score-q-4=3&q-5=0&score-q-5=2&q-6=0&score-q-6=2&q-7=4&score-q-7=1&q-8=0&score-q-8=3':
      {
        page: {
          pageName: 'midlife-mot--question-9',
          pageTitle: {
            en: 'Income protection question',
            cy: 'Cwestiwn diogelu incwm',
          }[locale],
          pageType: 'tool page',
          site: 'partner',
        },
        tool: {
          stepName: 'Do you have insurance to protect your income if...',
          toolCategory: '',
          toolName: 'Midlife MOT',
          toolStep: 9,
        },
      },

    // 10. Question - 10
    'question-10?q-1=1&score-q-1=0&q-2=0&score-q-2=0&q-3=6&score-q-3=2&q-4=0&score-q-4=3&q-5=0&score-q-5=2&q-6=0&score-q-6=2&q-7=4&score-q-7=1&q-8=0&score-q-8=3&q-9=4&score-q-9=1':
      {
        page: {
          pageName: 'midlife-mot--question-10',
          pageTitle: {
            en: 'Unexpected costs question',
            cy: 'Cwestiwn costau annisgwyl',
          }[locale],
          pageType: 'tool page',
          site: 'partner',
        },
        tool: {
          stepName:
            "Which of these items could you get insurance for, but haven't already?",
          toolCategory: '',
          toolName: 'Midlife MOT',
          toolStep: 10,
        },
      },

    // 11. Question - 11
    'question-11?q-1=1&score-q-1=0&q-2=0&score-q-2=0&q-3=6&score-q-3=2&q-4=0&score-q-4=3&q-5=0&score-q-5=2&q-6=0&score-q-6=2&q-7=4&score-q-7=1&q-8=0&score-q-8=3&q-9=4&score-q-9=1&q-10=4&score-q-10=3':
      {
        page: {
          pageName: 'midlife-mot--question-11',
          pageTitle: {
            en: 'Pension type question',
            cy: 'Cwestiwn math o bensiwn',
          }[locale],
          pageType: 'tool page',
          site: 'partner',
        },
        tool: {
          stepName:
            'Do you have or will you be entitled to any of these pensions?',
          toolCategory: '',
          toolName: 'Midlife MOT',
          toolStep: 11,
        },
      },

    // 12. Question - 12
    'question-12?q-1=1&score-q-1=0&q-2=0&score-q-2=0&q-3=6&score-q-3=2&q-4=0&score-q-4=3&q-5=0&score-q-5=2&q-6=0&score-q-6=2&q-7=4&score-q-7=1&q-8=0&score-q-8=3&q-9=4&score-q-9=1&q-10=4&score-q-10=3&q-11=0%2C1&score-q-11=3':
      {
        page: {
          pageName: 'midlife-mot--question-12',
          pageTitle: {
            en: 'Workplace pension type question',
            cy: 'Cwestiwn math o bensiwn gweithle',
          }[locale],
          pageType: 'tool page',
          site: 'partner',
        },
        tool: {
          stepName: 'What type of workplace pension do you pay into?',
          toolCategory: '',
          toolName: 'Midlife MOT',
          toolStep: 12,
        },
      },

    // 13. Question - 13
    'question-13?q-1=1&score-q-1=0&q-2=0&score-q-2=0&q-3=6&score-q-3=2&q-4=0&score-q-4=3&q-5=0&score-q-5=2&q-6=0&score-q-6=2&q-7=4&score-q-7=1&q-8=0&score-q-8=3&q-9=4&score-q-9=1&q-10=4&score-q-10=3&q-11=0%2C1&score-q-11=3&q-12=0%2C1&score-q-12=3':
      {
        page: {
          pageName: 'midlife-mot--question-13',
          pageTitle: {
            en: 'Pension management question',
            cy: 'Cwestiwn rheoli pensiwn',
          }[locale],
          pageType: 'tool page',
          site: 'partner',
        },
        tool: {
          stepName: 'How well are you managing your pension?',
          toolCategory: '',
          toolName: 'Midlife MOT',
          toolStep: 13,
        },
      },

    // 14. Question - 14
    'question-14?q-1=1&score-q-1=0&q-2=0&score-q-2=0&q-3=6&score-q-3=2&q-4=0&score-q-4=3&q-5=0&score-q-5=2&q-6=0&score-q-6=2&q-7=4&score-q-7=1&q-8=0&score-q-8=3&q-9=4&score-q-9=1&q-10=4&score-q-10=3&q-11=0%2C1&score-q-11=3&q-12=0%2C1&score-q-12=3&q-13=0%2C1&score-q-13=2':
      {
        page: {
          pageName: 'midlife-mot--question-14',
          pageTitle: {
            en: 'Retirement planning question',
            cy: 'Cwestiwn cynllunio ymddeoliad',
          }[locale],
          pageType: 'tool page',
          site: 'partner',
        },
        tool: {
          stepName: 'How are you planning for retirement?',
          toolCategory: '',
          toolName: 'Midlife MOT',
          toolStep: 14,
        },
      },

    // 15. Question - 15
    'question-15?q-1=1&score-q-1=0&q-2=0&score-q-2=0&q-3=6&score-q-3=2&q-4=0&score-q-4=3&q-5=0&score-q-5=2&q-6=0&score-q-6=2&q-7=4&score-q-7=1&q-8=0&score-q-8=3&q-9=4&score-q-9=1&q-10=4&score-q-10=3&q-11=0%2C1&score-q-11=3&q-12=0%2C1&score-q-12=3&q-13=0%2C1&score-q-13=2&q-14=0%2C1&score-q-14=2':
      {
        page: {
          pageName: 'midlife-mot--question-15',
          pageTitle: {
            en: 'Your home question',
            cy: 'Cwestiwn eich cartref',
          }[locale],
          pageType: 'tool page',
          site: 'partner',
        },
        tool: {
          stepName: 'Where do you plan to live when you retire?',
          toolCategory: '',
          toolName: 'Midlife MOT',
          toolStep: 15,
        },
      },

    // 16. Question - 16
    'question-16?q-1=1&score-q-1=0&q-2=0&score-q-2=0&q-3=6&score-q-3=2&q-4=0&score-q-4=3&q-5=0&score-q-5=2&q-6=0&score-q-6=2&q-7=4&score-q-7=1&q-8=0&score-q-8=3&q-9=4&score-q-9=1&q-10=4&score-q-10=3&q-11=0%2C1&score-q-11=3&q-12=0%2C1&score-q-12=3&q-13=0%2C1&score-q-13=2&q-14=0%2C1&score-q-14=2&q-15=0&score-q-15=3':
      {
        page: {
          pageName: 'midlife-mot--question-16',
          pageTitle: {
            en: 'Savings goals question',
            cy: 'Cwestiwn nodau cynilo',
          }[locale],
          pageType: 'tool page',
          site: 'partner',
        },
        tool: {
          stepName: 'Do you have savings goals?',
          toolCategory: '',
          toolName: 'Midlife MOT',
          toolStep: 16,
        },
      },

    // 17. Question - 17
    'question-17?q-1=1&score-q-1=0&q-2=0&score-q-2=0&q-3=6&score-q-3=2&q-4=0&score-q-4=3&q-5=0&score-q-5=2&q-6=0&score-q-6=2&q-7=4&score-q-7=1&q-8=0&score-q-8=3&q-9=4&score-q-9=1&q-10=4&score-q-10=3&q-11=0%2C1&score-q-11=3&q-12=0%2C1&score-q-12=3&q-13=0%2C1&score-q-13=2&q-14=0%2C1&score-q-14=2&q-15=0&score-q-15=3&q-16=0&score-q-16=3':
      {
        page: {
          pageName: 'midlife-mot--question-17',
          pageTitle: {
            en: 'Non-emergency savings question',
            cy: 'Cwestiwn cynilion nad ydynt yn rhai brys',
          }[locale],
          pageType: 'tool page',
          site: 'partner',
        },
        tool: {
          stepName: 'Do you have any non-emergency savings or investments?',
          toolCategory: '',
          toolName: 'Midlife MOT',
          toolStep: 17,
        },
      },

    // 18. Question - 18
    'question-18?q-1=1&score-q-1=0&q-2=0&score-q-2=0&q-3=6&score-q-3=2&q-4=0&score-q-4=3&q-5=0&score-q-5=2&q-6=0&score-q-6=2&q-7=4&score-q-7=1&q-8=0&score-q-8=3&q-9=4&score-q-9=1&q-10=4&score-q-10=3&q-11=0%2C1&score-q-11=3&q-12=0%2C1&score-q-12=3&q-13=0%2C1&score-q-13=2&q-14=0%2C1&score-q-14=2&q-15=0&score-q-15=3&q-16=0&score-q-16=3&q-17=1&score-q-17=2':
      {
        page: {
          pageName: 'midlife-mot--question-18',
          pageTitle: {
            en: 'Keeping your money safe question',
            cy: "Cwestiwn cadw'ch arian yn ddiogel",
          }[locale],
          pageType: 'tool page',
          site: 'partner',
        },
        tool: {
          stepName:
            'Which of the following statements about keeping your money safe apply to you?',
          toolCategory: '',
          toolName: 'Midlife MOT',
          toolStep: 18,
        },
      },

    // 19. Change options
    'change-options?q-1=1&score-q-1=0&q-2=0&score-q-2=0&q-3=6&score-q-3=2&q-4=0&score-q-4=3&q-5=0&score-q-5=2&q-6=0&score-q-6=2&q-7=4&score-q-7=1&q-8=0&score-q-8=3&q-9=4&score-q-9=1&q-10=4&score-q-10=3&q-11=0%2C1&score-q-11=3&q-12=0%2C1&score-q-12=3&q-13=0%2C1&score-q-13=2&q-14=0%2C1&score-q-14=2&q-15=0&score-q-15=3&q-16=0&score-q-16=3&q-17=0&score-q-17=2&q-18=0&score-q-18=2':
      {
        page: {
          pageName: 'midlife-mot--change-options',
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
          toolName: 'Midlife MOT',
          toolStep: 19,
        },
      },

    // 20. Summary
    'summary?q-1=1&score-q-1=0&q-2=0&score-q-2=0&q-3=6&score-q-3=2&q-4=0&score-q-4=3&q-5=0&score-q-5=2&q-6=0&score-q-6=2&q-7=4&score-q-7=1&q-8=0&score-q-8=3&q-9=4&score-q-9=1&q-10=4&score-q-10=3&q-11=0%2C1&score-q-11=3&q-12=0%2C1&score-q-12=3&q-13=0%2C1&score-q-13=2&q-14=0%2C1&score-q-14=2&q-15=0&score-q-15=3&q-16=0&score-q-16=3&q-17=0&score-q-17=2&q-18=0&score-q-18=2':
      {
        page: {
          pageName: 'midlife-mot--summary',
          pageTitle: {
            en: 'Summary',
            cy: 'Crynodeb',
          }[locale],
          pageType: 'tool page',
          site: 'partner',
        },
        tool: {
          stepName: 'Summary of your results',
          toolCategory: '',
          toolName: 'Midlife MOT',
          toolStep: 20,
        },
      },

    // 21. Results (US#26600)
    'results?q-1=1&score-q-1=0&q-2=0&score-q-2=0&q-3=6&score-q-3=2&q-4=0&score-q-4=3&q-5=0&score-q-5=2&q-6=0&score-q-6=2&q-7=4&score-q-7=1&q-8=0&score-q-8=3&q-9=4&score-q-9=1&q-10=4&score-q-10=3&q-11=0%2C1&score-q-11=3&q-12=0%2C1&score-q-12=3&q-13=0%2C1&score-q-13=2&q-14=0%2C1&score-q-14=2&q-15=0&score-q-15=3&q-16=0&score-q-16=3&q-17=0&score-q-17=2&q-18=0&score-q-18=2':
      {
        page: {
          pageName: 'midlife-mot--results',
          pageTitle: {
            en: 'Personalised report',
            cy: 'Adroddiad personol',
          }[locale],
          pageType: 'tool page',
          site: 'partner',
        },
        tool: {
          stepName: 'Results',
          toolCategory: '',
          toolName: 'Midlife MOT',
          toolStep: 21,
        },
      },

    // 22. Tool Completion (US#26600)
    'results?q-1=2&score-q-1=0&q-2=1&score-q-2=0&q-3=3&score-q-3=2&q-4=0&score-q-4=3&q-5=0&score-q-5=2&q-6=2&score-q-6=2&q-7=1&score-q-7=2&q-8=0&score-q-8=3&q-9=2%2C3&score-q-9=2&q-10=1&score-q-10=2&q-11=0&score-q-11=2&q-14=4&score-q-14=2&q-15=3&score-q-15=2&q-16=3&score-q-16=1&q-17=1&score-q-17=2&q-18=2&score-q-18=2':
      {
        page: {
          pageName: 'midlife-mot--results',
          pageTitle: {
            en: 'Personalised report',
            cy: 'Adroddiad personol',
          }[locale],
          pageType: 'tool page',
          site: 'partner',
        },
        tool: {
          stepName: 'Results',
          toolCategory: '',
          toolName: 'Midlife MOT',
          toolStep: 21,
        },
      },

    // 23. Tool Restart
    'question-1?restart=true': {
      page: {
        pageName: 'midlife-mot--question-1',
        pageTitle: {
          en: 'Age question',
          cy: 'Cwestiwn oedran',
        }[locale],
        pageType: 'tool page',
        site: 'partner',
      },
      tool: {
        stepName: 'How old are you?',
        toolCategory: '',
        toolName: 'Midlife MOT',
        toolStep: 1,
      },
    },

    // 24. Error message
    'question-1?error=q-1': {
      page: {
        pageName: 'midlife-mot--question-1',
        pageTitle: {
          en: 'Age question',
          cy: 'Cwestiwn oedran',
        }[locale],
        pageType: 'tool page',
        site: 'partner',
      },
      tool: {
        stepName: 'How old are you?',
        toolCategory: '',
        toolName: 'Midlife MOT',
        toolStep: 1,
      },
    },
  };
};

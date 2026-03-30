export type PageAnalyticsData = {
  page: {
    pageName: string;
    pageTitle: string;
    site: string;
    pageType: string;
    source: string;
  };
  tool: {
    stepName: string;
    toolCategory: string;
    toolName: string;
    toolStep: string | number;
  };
};

export type ErrorDetail = {
  reactCompType: string;
  reactCompName: string;
  errorMessage: string;
};

export type ErrorEventInfo = {
  stepName: string;
  toolName: string;
  toolStep: string | number;
  errorDetails: ErrorDetail[];
};

export type EventAnalyticsData = {
  event: string;
  eventInfo: {
    reactCompName: string;
    reactCompType: string;
    stepName: string;
    toolName: string;
    toolStep: string | number;
  };
};

export const adobeDatalayer = (
  locale: 'en' | 'cy',
): Record<string, PageAnalyticsData | EventAnalyticsData | ErrorEventInfo> => ({
  // Selected 'First time buyer', entered property value is 250K
  'lbtt?isEmbedded=false&calculated=true&recalculated=false&buyerType=firstTimeBuyer&price=250%2C000':
    {
      page: {
        pageName: 'lbtt-calculator results',
        pageTitle: {
          en: 'Land and Buildings Transaction Tax Calculator Results',
          cy: 'Canlyniad cyfrifiannell Treth Trafodiadau Tir ac Adeiladau (LBTT)',
        }[locale],
        site: 'moneyhelper',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: 'Results',
        toolCategory: '',
        toolName: 'LBTT Calculator',
        toolStep: 2,
      },
    },

  // Selected 'First time buyer', entered property value is 9,999,937.789
  'lbtt?isEmbedded=false&calculated=true&recalculated=true&buyerType=firstTimeBuyer&price=9%2C999%2C937.789':
    {
      page: {
        pageName: 'lbtt-calculator results',
        pageTitle: {
          en: 'Land and Buildings Transaction Tax Calculator Results',
          cy: 'Canlyniad cyfrifiannell Treth Trafodiadau Tir ac Adeiladau (LBTT)',
        }[locale],
        site: 'moneyhelper',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: 'Results',
        toolCategory: '',
        toolName: 'LBTT Calculator',
        toolStep: 2,
      },
    },

  //Recalculate for the property price- 350K for 'First time buyer'
  'lbtt?isEmbedded=false&calculated=true&recalculated=true&buyerType=firstTimeBuyer&price=350%2C000':
    {
      page: {
        pageName: 'lbtt-calculator results',
        pageTitle: {
          en: 'Land and Buildings Transaction Tax Calculator Results',
          cy: 'Canlyniad cyfrifiannell Treth Trafodiadau Tir ac Adeiladau (LBTT)',
        }[locale],
        site: 'moneyhelper',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: 'Results',
        toolCategory: '',
        toolName: 'LBTT Calculator',
        toolStep: 2,
      },
    },

  //Recalculate for the property price- 450K for 'nextHome'
  'lbtt?isEmbedded=false&calculated=true&recalculated=true&buyerType=nextHome&price=450%2C000':
    {
      page: {
        pageName: 'lbtt-calculator results',
        pageTitle: {
          en: 'Land and Buildings Transaction Tax Calculator Results',
          cy: 'Canlyniad cyfrifiannell Treth Trafodiadau Tir ac Adeiladau (LBTT)',
        }[locale],
        site: 'moneyhelper',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: 'Results',
        toolCategory: '',
        toolName: 'LBTT Calculator',
        toolStep: 2,
      },
    },

  //Recalculate for the property price- 937K for 'nextHome'
  'lbtt?isEmbedded=false&calculated=true&recalculated=false&buyerType=nextHome&price=937%2C000':
    {
      page: {
        pageName: 'lbtt-calculator results',
        pageTitle: {
          en: 'Land and Buildings Transaction Tax Calculator Results',
          cy: 'Canlyniad cyfrifiannell Treth Trafodiadau Tir ac Adeiladau (LBTT)',
        }[locale],
        site: 'moneyhelper',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: 'Results',
        toolCategory: '',
        toolName: 'LBTT Calculator',
        toolStep: 2,
      },
    },

  //Recalculate for the property price- 550K for 'additionalHome'
  'lbtt?isEmbedded=false&calculated=true&recalculated=true&buyerType=additionalHome&price=550%2C000':
    {
      page: {
        pageName: 'lbtt-calculator results',
        pageTitle: {
          en: 'Land and Buildings Transaction Tax Calculator Results',
          cy: 'Canlyniad cyfrifiannell Treth Trafodiadau Tir ac Adeiladau (LBTT)',
        }[locale],
        site: 'moneyhelper',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: 'Results',
        toolCategory: '',
        toolName: 'LBTT Calculator',
        toolStep: 2,
      },
    },

  //Recalculate for the property price- 1200K for 'additionalHome'
  'lbtt?isEmbedded=false&calculated=true&recalculated=false&buyerType=additionalHome&price=1%2C200%2C000':
    {
      page: {
        pageName: 'lbtt-calculator results',
        pageTitle: {
          en: 'Land and Buildings Transaction Tax Calculator Results',
          cy: 'Canlyniad cyfrifiannell Treth Trafodiadau Tir ac Adeiladau (LBTT)',
        }[locale],
        site: 'moneyhelper',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: 'Results',
        toolCategory: '',
        toolName: 'LBTT Calculator',
        toolStep: 2,
      },
    },

  //Error message when user selects 1st time buyer, not entered the property price
  'lbtt?isEmbedded=false&calculated=true&recalculated=false&buyerType=firstTimeBuyer&price=':
    {
      event: 'errorMessage',
      eventInfo: {
        toolName: 'LBTT Calculator',
        toolStep: 1,
        stepName: 'Calculate',
        errorDetails: [
          {
            reactCompType: 'MoneyInput',
            reactCompName: 'Property price',
            errorMessage: {
              en: 'Enter a property price, for example £200,000',
              cy: 'Rhowch bris eiddo, er enghraifft £200,000',
            }[locale],
          },
        ],
      },
    },

  // Tool Start
  lbtt: {
    page: {
      pageName: 'lbtt-calculator',
      pageTitle: {
        en: 'Land and Buildings Transaction Tax Calculator',
        cy: 'Cyfrifiannell Treth Trafodion Tir ac Adeiladau',
      }[locale],
      pageType: 'tool page',
      site: 'moneyhelper',
      source: 'direct',
    },
    tool: {
      stepName: 'Calculate',
      toolCategory: '',
      toolName: 'LBTT Calculator',
      toolStep: 1,
    },
  },

  // Tool Completion
  'lbtt?isEmbedded=false&calculated=true&recalculated=false&buyerType=firstTimeBuyer&price=450%2C000&day=30&month=10&year=2025':
    {
      page: {
        pageName: 'lbtt-calculator results',
        pageTitle: {
          en: 'Land and Buildings Transaction Tax Calculator Results',
          cy: 'Canlyniad cyfrifiannell Treth Trafodiadau Tir ac Adeiladau (LBTT)',
        }[locale],
        site: 'moneyhelper',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: 'Results',
        toolCategory: '',
        toolName: 'LBTT Calculator',
        toolStep: 2,
      },
    },

  // Tool Restart
  'lbtt?isEmbedded=false&calculated=true&recalculated=true&buyerType=firstTimeBuyer&price=550%2C000':
    {
      page: {
        pageName: 'lbtt-calculator results',
        pageTitle: {
          en: 'lbtt-calculator results',
          cy: 'Gwall, adolygwch eich ateb',
        }[locale],
        site: 'moneyhelper',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: 'Results',
        toolCategory: '',
        toolName: 'SDLT Calculator',
        toolStep: 2,
      },
    },

  // Tool Interaction
  'lbtt?isEmbedded=false&calculated=true&recalculated=true&buyerType=firstTimeBuyer&price=750%2C000':
    {
      event: 'toolInteraction',
      eventInfo: {
        reactCompName: 'Property price',
        reactCompType: 'MoneyInput',
        toolName: 'LBTT Calculator',
        stepName: 'Results',
        toolStep: 2,
      },
    },
});

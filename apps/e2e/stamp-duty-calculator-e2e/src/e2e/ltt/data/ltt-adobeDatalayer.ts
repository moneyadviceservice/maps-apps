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
  //01.pageLoadReact :
  // FirstOrNextHome buyer & property price=350K, and Calulated=true
  'ltt?calculated=true&buyerType=firstOrNextHome&price=350%2C000&day=13&month=4&year=2025#calculation-result':
    {
      event: 'pageLoadReact',
      page: {
        pageName: 'ltt-calculator results',
        pageTitle: {
          en: 'Land Transaction Tax Calculator Results',
          cy: 'Canlyniadau Cyfrifiannell Treth Trafodiadau Tir',
        }[locale],
        pageType: 'tool page',
        site: 'moneyhelper',
        source: 'direct',
      },
      tool: {
        stepName: 'results',
        toolCategory: '',
        toolName: 'ltt_calculator',
        toolStep: '2',
      },
    },

  // FirstOrNextHome buyer & property price=9,999,567.89, Calculated =true & Recalculated=true
  'ltt?isEmbedded=false&calculated=true&recalculated=true&buyerType=firstOrNextHome&price=9%2C999%2C567.89&day=13&month=4&year=2025#calculation-result':
    {
      page: {
        pageName: 'ltt-calculator results',
        pageTitle: {
          en: 'Land Transaction Tax Calculator Results',
          cy: 'Canlyniadau Cyfrifiannell Treth Trafodiadau Tir',
        }[locale],
        pageType: 'tool page',
        site: 'moneyhelper',
        source: 'direct',
      },
      tool: {
        stepName: 'results',
        toolCategory: '',
        toolName: 'ltt_calculator',
        toolStep: '2',
      },
    },

  // additionalHome buyer & property price=350K, Calculated =true & Recalculated=true
  'ltt?isEmbedded=false&calculated=true&recalculated=true&buyerType=additionalHome&price=9%2C999%2C567.89&day=13&month=4&year=2025#calculation-result':
    {
      page: {
        pageName: 'ltt-calculator results',
        pageTitle: {
          en: 'Land Transaction Tax Calculator Results',
          cy: 'Canlyniadau Cyfrifiannell Treth Trafodiadau Tir',
        }[locale],
        pageType: 'tool page',
        site: 'moneyhelper',
        source: 'direct',
      },
      tool: {
        stepName: 'results',
        toolCategory: '',
        toolName: 'ltt_calculator',
        toolStep: '2',
      },
    },

  // additionalHome buyer & property price=1,290,000.45, Calculated =true & Recalculated=false
  'ltt?isEmbedded=false&calculated=true&recalculated=false&buyerType=additionalHome&price=1%2C290%2C000.45&day=13&month=4&year=2025#calculation-result':
    {
      page: {
        pageName: 'ltt-calculator results',
        pageTitle: {
          en: 'Land Transaction Tax Calculator Results',
          cy: 'Canlyniadau Cyfrifiannell Treth Trafodiadau Tir',
        }[locale],
        pageType: 'tool page',
        site: 'moneyhelper',
        source: 'direct',
      },
      tool: {
        stepName: 'results',
        toolCategory: '',
        toolName: 'ltt_calculator',
        toolStep: '2',
      },
    },
  //02.Error message when user selects property type, not entered the property price and not entered date of purchase
  'ltt?isEmbedded=false&calculated=true&recalculated=true&buyerType=additionalHome&price=':
    {
      stepName: 'Calculate',
      toolName: 'LTT Calculator',
      toolStep: 1,
      errorDetails: [
        {
          reactCompType: 'MoneyInput',
          reactCompName: 'price',
          errorMessage: {
            en: 'Enter a property price, for example £200,000',
            cy: 'Rhowch bris eiddo, er enghraifft £200,000',
          }[locale],
        },
        {
          reactCompType: 'DateInput',
          reactCompName: 'purchaseDate',
          errorMessage: {
            en: 'Enter a purchase date',
            cy: 'Rhowch ddyddiad prynu',
          }[locale],
        },
      ],
    },

  //03.Tool Start
  'ltt?buyerType=firstOrNextHome': {
    page: {
      pageName: 'ltt-calculator',
      pageTitle: {
        en: 'Land Transaction Tax Calculator',
        cy: 'Cyfrifiannell Treth Trafodiadau Tir',
      }[locale],
      pageType: 'tool page',
      site: 'moneyhelper',
      source: 'direct',
    },
    tool: {
      stepName: 'details',
      toolCategory: '',
      toolName: 'ltt_calculator',
      toolStep: '1',
    },
  },

  //04.Tool Completion
  'ltt?isEmbedded=false&calculated=false&recalculated=false&buyerType=additionalHome&price=3%2C29%2C000&day=30&month=10&year=2025':
    {
      page: {
        pageName: 'ltt-calculator results',
        pageTitle: {
          en: 'Land Transaction Tax Calculator Results',
          cy: 'Canlyniadau Cyfrifiannell Treth Trafodiadau Tir',
        }[locale],
        site: 'moneyhelper',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: 'results',
        toolCategory: '',
        toolName: 'ltt_calculator',
        toolStep: '2',
      },
    },

  //05.Tool Interaction
  ltt: {
    event: 'toolInteraction',
    eventInfo: {
      reactCompName: 'buyerType',
      reactCompType: 'Select',
      stepName: 'Calculate',
      toolName: 'lLTT Calculator',
      toolStep: 1,
    },
  },
});

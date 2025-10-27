export const adobeDatalayer = (locale: string) => {
  return {
    // Selected 'First time buyer', entered property value is 250K
    'sdlt?isEmbedded=false&calculated=true&recalculated=false&buyerType=firstTimeBuyer&price=250%2C000':
      {
        page: {
          pageName: 'sdlt-calculator results',
          pageTitle: {
            en: 'Stamp Duty calculator results',
            cy: 'Canlyniadau cyfrifiannell Treth Stamp',
          }[locale],
          site: 'partner',
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

    // Selected 'First time buyer', entered property value is 9,999,937.789
    'sdlt?isEmbedded=false&calculated=true&recalculated=true&buyerType=firstTimeBuyer&price=9%2C999%2C937.789':
      {
        page: {
          pageName: 'sdlt-calculator results',
          pageTitle: {
            en: 'Stamp Duty calculator results',
            cy: 'Canlyniadau cyfrifiannell Treth Stamp',
          }[locale],
          site: 'partner',
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

    //Recalculate for the property price- 350K for 'First time buyer'
    'sdlt?isEmbedded=false&calculated=true&recalculated=true&buyerType=firstTimeBuyer&price=350%2C000':
      {
        page: {
          pageName: 'sdlt-calculator results',
          pageTitle: {
            en: 'Stamp Duty calculator results',
            cy: 'Canlyniadau cyfrifiannell Treth Stamp',
          }[locale],
          site: 'partner',
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

    //Recalculate for the property price- 450K for 'nextHome'
    'sdlt?isEmbedded=false&calculated=true&recalculated=true&buyerType=nextHome&price=450%2C000':
      {
        page: {
          pageName: 'sdlt-calculator results',
          pageTitle: {
            en: 'Stamp Duty calculator results',
            cy: 'Canlyniadau cyfrifiannell Treth Stamp',
          }[locale],
          site: 'partner',
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

    //Recalculate for the property price- 937K for 'nextHome'
    'sdlt?isEmbedded=false&calculated=true&recalculated=false&buyerType=nextHome&price=937%2C000':
      {
        page: {
          pageName: 'sdlt-calculator results',
          pageTitle: {
            en: 'Stamp Duty calculator results',
            cy: 'Canlyniadau cyfrifiannell Treth Stamp',
          }[locale],
          site: 'partner',
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

    //Recalculate for the property price- 550K for 'additionalHome'
    'sdlt?isEmbedded=false&calculated=true&recalculated=true&buyerType=additionalHome&price=550%2C000':
      {
        page: {
          pageName: 'sdlt-calculator results',
          pageTitle: {
            en: 'Stamp Duty calculator results',
            cy: 'Canlyniadau cyfrifiannell Treth Stamp',
          }[locale],
          site: 'partner',
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

    //Recalculate for the property price- 1200K for 'additionalHome'
    'sdlt?isEmbedded=false&calculated=true&recalculated=false&buyerType=additionalHome&price=1%2C200%2C000':
      {
        page: {
          pageName: 'sdlt-calculator results',
          pageTitle: {
            en: 'Stamp Duty calculator results',
            cy: 'Canlyniadau cyfrifiannell Treth Stamp',
          }[locale],
          site: 'partner',
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

    //Error message when user selects 1st time buyer, not entered the property price
    'sdlt?isEmbedded=false&calculated=true&recalculated=false&buyerType=firstTimeBuyer&price=':
      {
        event: 'errorMessage',
        eventInfo: {
          toolName: 'SDLT Calculator',
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
    sdlt: {
      page: {
        pageName: 'sdlt-calculator',
        pageTitle: {
          en: 'Stamp Duty calculator',
          cy: 'Cyfrifiannell treth stamp',
        }[locale],
        pageType: 'tool page',
        site: 'partner',
      },
      tool: {
        stepName: 'Calculate',
        toolCategory: '',
        toolName: 'SDLT Calculator',
        toolStep: 1,
      },
    },

    // Tool Completion
    'sdlt?isEmbedded=false&calculated=true&recalculated=false&buyerType=firstTimeBuyer&price=450%2C000':
      {
        page: {
          pageName: 'sdlt-calculator results',
          pageTitle: {
            en: 'Stamp Duty calculator results',
            cy: 'Canlyniadau cyfrifiannell Treth Stamp',
          }[locale],
          site: 'partner',
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

    // Tool Restart
    'sdlt?isEmbedded=false&calculated=true&recalculated=true&buyerType=firstTimeBuyer&price=550%2C000':
      {
        page: {
          pageName: 'sdlt-calculator results',
          pageTitle: {
            en: 'Stamp Duty calculator results',
            cy: 'Canlyniadau cyfrifiannell Treth Stamp',
          }[locale],
          site: 'partner',
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
    'sdlt?isEmbedded=false&calculated=true&recalculated=true&buyerType=firstTimeBuyer&price=750%2C000':
      {
        event: 'toolInteraction',
        eventInfo: {
          toolName: 'SDLT Calculator',
          toolStep: 2,
          stepName: 'Results',
        },
      },
  };
};

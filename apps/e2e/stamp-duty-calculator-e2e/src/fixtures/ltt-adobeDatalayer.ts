export const adobeDatalayer = (locale: string) => {
  return {
    //01.pageLoadReact :
    // FirstOrNextHome buyer & property price=350K, and Calulated=true
    'ltt?calculated=true&buyerType=firstOrNextHome&price=350%2C000': {
      page: {
        pageName: 'ltt-calculator results',
        pageTitle: {
          en: 'Land Transaction Tax (LTT) calculator results',
          cy: 'Canlyniadau cyfrifiannell Treth Trafodiadau Tir (LTT)',
        }[locale],
        pageType: 'tool page',
        site: 'partner',
      },
      tool: {
        stepName: 'Results',
        toolCategory: '',
        toolName: 'LTT Calculator',
        toolStep: 2,
      },
    },

    // FirstOrNextHome buyer & property price=9,999,567.89, Calculated =true & Recalculated=true
    'ltt?isEmbedded=false&calculated=true&recalculated=true&buyerType=firstOrNextHome&price=9%2C999%2C567.89':
      {
        page: {
          pageName: 'ltt-calculator results',
          pageTitle: {
            en: 'Land Transaction Tax (LTT) calculator results',
            cy: 'Canlyniadau cyfrifiannell Treth Trafodiadau Tir (LTT)',
          }[locale],
          pageType: 'tool page',
          site: 'partner',
        },
        tool: {
          stepName: 'Results',
          toolCategory: '',
          toolName: 'LTT Calculator',
          toolStep: 2,
        },
      },

    // additionalHome buyer & property price=350K, Calculated =true & Recalculated=true
    'ltt?isEmbedded=false&calculated=true&recalculated=true&buyerType=additionalHome&price=9%2C999%2C567.89':
      {
        page: {
          pageName: 'ltt-calculator results',
          pageTitle: {
            en: 'Land Transaction Tax (LTT) calculator results',
            cy: 'Canlyniadau cyfrifiannell Treth Trafodiadau Tir (LTT)',
          }[locale],
          pageType: 'tool page',
          site: 'partner',
        },
        tool: {
          stepName: 'Results',
          toolCategory: '',
          toolName: 'LTT Calculator',
          toolStep: 2,
        },
      },

    // additionalHome buyer & property price=1,290,000.45, Calculated =true & Recalculated=false
    'ltt?isEmbedded=false&calculated=true&recalculated=false&buyerType=additionalHome&price=1%2C290%2C000.45':
      {
        page: {
          pageName: 'ltt-calculator results',
          pageTitle: {
            en: 'Land Transaction Tax (LTT) calculator results',
            cy: 'Canlyniadau cyfrifiannell Treth Trafodiadau Tir (LTT)',
          }[locale],
          pageType: 'tool page',
          site: 'partner',
        },
        tool: {
          stepName: 'Results',
          toolCategory: '',
          toolName: 'LTT Calculator',
          toolStep: 2,
        },
      },
    //02.Error message when user selects property type, not entered the property price
    'ltt?isEmbedded=false&calculated=true&recalculated=true&buyerType=additionalHome&price=':
      {
        event: 'errorMessage',
        eventInfo: {
          toolName: 'LTT Calculator',
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

    //03.Tool Start
    'ltt-calculator': {
      page: {
        pageName: 'ltt-calculator',
        pageTitle: {
          en: 'Land Transaction Tax (LTT) calculator',
          cy: 'Cyfrifiannell Treth Trafodiadau Tir',
        }[locale],
        pageType: 'tool page',
        site: 'partner',
      },
      tool: {
        stepName: 'Calculate',
        toolCategory: '',
        toolName: 'LTT Calculator',
        toolStep: 1,
      },
    },

    //04.Tool Completion
    'ltt-calculator?isEmbedded=false&calculated=true&recalculated=false&buyerType=firstOrNextHome&price=350%2C000':
      {
        page: {
          pageName: 'ltt-calculator results',
          pageTitle: {
            en: 'Land Transaction Tax (LTT) calculator results',
            cy: 'Canlyniadau cyfrifiannell Treth Trafodiadau Tir (LTT)',
          }[locale],
          site: 'partner',
          pageType: 'tool page',
          source: 'direct',
        },
        tool: {
          stepName: 'Results',
          toolCategory: '',
          toolName: 'LTT Calculator',
          toolStep: 2,
        },
      },

    //05.Tool Restart
    'ltt-calculator?isEmbedded=false&calculated=true&recalculated=true&buyerType=additionalHome&price=450%2C000':
      {
        page: {
          pageName: 'ltt-calculator results',
          pageTitle: {
            en: 'Land Transaction Tax (LTT) calculator results',
            cy: 'Gwall, adolygwch eich ateb',
          }[locale],
          site: 'partner',
          pageType: 'tool page',
          source: 'direct',
        },
        tool: {
          stepName: 'Results',
          toolCategory: '',
          toolName: 'LTT Calculator',
          toolStep: 2,
        },
      },

    //06.Tool Interaction
    'ltt-calculator?isEmbedded=false&calculated=true&recalculated=true&buyerType=additionalHome&price=550%2C000':
      {
        event: 'toolInteraction',
        eventInfo: {
          reactCompName: 'Property price',
          reactCompType: 'MoneyInput',
          stepName: 'Results',
          toolName: 'LTT Calculator',
          toolStep: 2,
        },
      },
  };
};

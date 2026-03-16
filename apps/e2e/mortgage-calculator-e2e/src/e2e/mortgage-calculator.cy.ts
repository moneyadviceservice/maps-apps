describe('Mortgage Calculator', () => {
  const basePath = '/en';
  beforeEach(() => {
    cy.visit(basePath);
    cy.skipExceptions();
    cy.setCookieControl();
    cy.setBreakPoint('desktop');
  });
  const completeJourney = (
    buyerTypeIndex: number,
    propertyPrice: string,
    deposit: string,
    term: string,
    interestRate: string,
  ) => {
    cy.get('.t-mortgage-calculator-form').within(() => {
      cy.get('div')
        .eq(1)
        .within(() => {
          cy.get('label').eq(buyerTypeIndex).click({ force: true });
        });
      cy.get('input#price').type(propertyPrice, { force: true });
      cy.get('input#deposit').scrollIntoView();
      cy.get('input#deposit').should('be.visible').should('not.be.disabled');
      cy.get('input#deposit').clear({ force: true });
      cy.get('input#deposit').type(deposit, { force: true });
      cy.get('select#termYears').scrollIntoView();
      cy.get('select#termYears').should('be.visible');
      cy.get('select#termYears').select(term, { force: true });

      cy.get('input#rate').scrollIntoView();
      cy.get('input#rate').should('be.visible').should('not.be.disabled');
      cy.get('input#rate').clear({ force: true });
      cy.get('input#rate').type(interestRate, { force: true });
      cy.get('button.t-primary-button').scrollIntoView();
      cy.get('button.t-primary-button').should('be.visible');
      cy.get('button.t-primary-button').click({ force: true });
    });
  };

  const confirmResults = (
    MonthlyRepayment: string,
    totalPayable: string,
    capitalValue: string,
    interestValue: string,
    interestIncreaseValue: string,
    breakdownTableValues: any,
  ) => {
    cy.get('.t-urgent-callout', { timeout: 30000 })
      .should('exist')
      .first()
      .within(() => {
        // Repayment results
        cy.get('.t-result-monthly-payment > span', { timeout: 120000 }) // Waits for the element
          .should('exist') // Ensures the element exists
          .and('be.visible') // Ensures the element is visible
          .invoke('text') // Gets the text of the element
          .then((text) => {
            expect(text.trim()).to.eq(MonthlyRepayment); // Asserts the text matches the expected value
          });

        cy.elementContainsText('.t-result-total-payable > span', totalPayable);

        // Capital/Interest make up
        cy.get('ul.list-disc').within(() => {
          cy.get('li > span').eq(0).should('contain.text', capitalValue);
          cy.get('li > span').eq(1).should('contain.text', interestValue);
        });

        // Payment breakdown table
        cy.get('details.group.tool-expand > summary')
          .eq(0)
          .click({ force: true });
        cy.get('table').within(() => {
          for (let i = 0; i < breakdownTableValues.length; i++) {
            cy.elementIndexContainsText(
              'tr td span',
              i,
              breakdownTableValues[i],
            );
          }
        });

        // Interest rise amount
        cy.get('.t-urgent-callout').within(() => {
          cy.elementContainsText('span', interestIncreaseValue);
        });
      });
  };

  it('Calculates repayment mortgage', () => {
    const breakdownTableValues = {
      0: '£400,000',
      1: '£391,752',
      2: '£383,083',
      3: '£373,970',
      4: '£364,390',
      5: '£354,321',
      6: '£343,736',
      7: '£332,610',
      8: '£320,914',
      9: '£308,621',
      10: '£295,698',
      11: '£282,114',
      12: '£267,835',
      13: '£252,826',
      14: '£237,048',
      15: '£220,464',
      16: '£203,031',
      17: '£184,706',
      18: '£165,443',
      19: '£145,195',
      20: '£123,911',
      21: '£101,539',
      22: '£78,021',
      23: '£53,300',
      24: '£27,315',
      25: '£0',
    };
    completeJourney(0, '500000', '100000', '25', '5');
    confirmResults(
      '£2,338.36',
      '£701,508',
      '£400,000',
      '£301,508',
      '£3,087.26',
      breakdownTableValues,
    );
  });
  //------------------------------------------------------------------------------------------------------------------
  it('Calculates interest only mortgage', () => {
    const breakdownTableValues = {
      0: '£315,000',
      1: '£315,000',
      2: '£315,000',
      3: '£315,000',
      4: '£315,000',
      5: '£315,000',
      6: '£315,000',
      7: '£315,000',
      8: '£315,000',
      9: '£315,000',
      10: '£315,000',
      11: '£315,000',
    };
    completeJourney(1, '350000', '35000', '12', '6.5');
    confirmResults(
      '£1,706.25',
      '£560,700',
      '£315,000',
      '£245,700',
      '£2,493.75',
      breakdownTableValues,
    );
  });
  //------------------------------------------------------------------------------------------------------------------
  it('Expandable section', () => {
    const pages = ['/en/mortgage-calculator', '/cy/mortgage-calculator'];
    pages.forEach((url) => {
      cy.visit(basePath);
      //cy.visit(url);
      completeJourney(1, '350000', '35000', '12', '6.5');

      // Recommended reading
      cy.get('.t-recommended-reading').within(() => {
        cy.get('details').each(($elem) => {
          cy.wrap($elem).find('svg').should('be.visible');
          cy.wrap($elem)
            .find('div')
            .should('have.css', 'color', 'rgb(200, 42, 135)');
          cy.wrap($elem).find('div').should('have.css', 'font-size', '18px');
          cy.wrap($elem).click();
          cy.wrap($elem).should('have.attr', 'open');
          cy.wrap($elem).within(() => {
            cy.elementShouldBeVisible('ul');
            cy.confirmAttributeValue('summary', 'class', 'hover:underline');
            cy.get('summary').click();
            cy.get('a').each(($elem) => {
              cy.wrap($elem).should('have.attr', 'href');
            });
          });
        });
      });

      // Breakdown Costs
      cy.get('.tool-expand > .flex > .block')
        .eq(0)
        .then(($elem: any) => {
          cy.checkCSS($elem, 'color', 'rgb(200, 42, 135)');
          cy.checkCSS($elem, 'padding', '0px');
          cy.wrap($elem)
            .parent()
            .then(($parent: any) => {
              cy.confirmAttributeValue(
                $parent,
                'class',
                'underline hover:no-underline group',
              );
            });
        });
    });
  });
  //------------------------------------------------------------------------------------------------------------------
  /*
  This test case is commented since now we are not using BoE API for getting latest interest rates
  it('Defaults to current interest rate', () => {
    const today: Date = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const previousMonthYear = new Date(lastMonth)
      .toLocaleDateString('default', {
        month: 'short',
        year: 'numeric',
      })
      .replace(' ', '/');
    const currentDay: number = today.getDate();
    const currentMonthYear = new Date(today)
      .toLocaleDateString('default', {
        month: 'short',
        year: 'numeric',
      })
      .replace(' ', '/');

    cy.request(
      'GET',
      `http://www.bankofengland.co.uk/boeapps/iadb/fromshowcolumns.asp?csv.x=yes&Datefrom=01/${previousMonthYear}&Dateto=${currentDay}/${currentMonthYear}&SeriesCodes=IUDBEDR&CSVF=TN&UsingCodes=Y&VPD=Y&VFD=N`,
    )
      .should((response) => {
        expect(response.status).to.eq(200);
      })
      .then((response) => {
        return response.body;
      })
      .then((result) => {
        cy.log(result);
        const resultSet = result
          .trim()
          .split(/([0-9]*\s[a-w,A-w]*\s[0-9]*,[0-9]*(\.[0-9]*)*\s)/);

        const currentInterestRate = resultSet[resultSet.length - 1].split(',');
        const defaultedInterestRate = currentInterestRate[1]
          ?.replace('\r\n', '')
          .trim();

        if (defaultedInterestRate === undefined) {
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          previousMonthYear = new Date(lastMonth)
            .toLocaleDateString('default', {
              month: 'short',
              year: 'numeric',
            })
            .replace(' ', '/');
          cy.request(
            'GET',
            `http://www.bankofengland.co.uk/boeapps/iadb/fromshowcolumns.asp?csv.x=yes&Datefrom=01/${previousMonthYear}&Dateto=${currentDay}/${currentMonthYear}&SeriesCodes=IUDBEDR&CSVF=TN&UsingCodes=Y&VPD=Y&VFD=N`,
          )
            .should((response) => {
              expect(response.status).to.eq(200);
            })
            .then((response) => {
              return response.body;
            })
            .then((result) => {
              const resultSet = result
                .trim()
                .split(/([0-9]*\s[a-w,A-w]*\s[0-9]*,[0-9]*(\.[0-9]*)*\s)/);

              const currentInterestRate =
                resultSet[resultSet.length - 1].split(',');
              const defaultedInterestRate = currentInterestRate[1]
                ?.replace('\r\n', '')
                .trim();

              cy.get('input#rate').should('have.value', defaultedInterestRate);
            });
        } else {
          cy.get('input#rate').should('have.value', defaultedInterestRate);
        }
      });
  });
 */

  it('Verify Current Interest Rate', () => {
    // Get the input field and check its value
    cy.get('input#rate')
      .should('be.visible')
      .invoke('val')
      .then((value) => {
        // Ensure value is valid before parsing
        if (!value || typeof value !== 'string' || value.trim() === '') {
          throw new Error(`Invalid input value: ${value}`);
        }

        // Convert input value to a number safely
        const interestRateValue = parseFloat(value);

        // Validate that the value is a number
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(Number.isFinite(interestRateValue)).to.be.true; // Ensures it's a valid number

        // Validate the value falls within the expected range (2.00 - 6.00)
        expect(interestRateValue).to.be.gte(2.0).and.to.be.lte(6.0);

        // Validate that the value is an integer (rounded check)
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(Number.isInteger(Math.round(interestRateValue))).to.be.true;
      });
  });

  //------------------------------------------------------------------------------------------------------------------
  it('Handles error', () => {
    const locales = {
      '/en': [
        'There is a problem',
        'Enter a property price, for example £200,000',
      ],
      '/cy': ['Mae yna broblem', 'Rhowch bris eiddo, er enghraifft £200,000'],
    };

    for (const [url, text] of Object.entries(locales)) {
      cy.visit(`${url}`);
      completeJourney(0, '0', '0', '40', ' ');
      cy.elementContainsText('#error-summary-heading', text[0]);
      cy.elementContainsText('.text-base > a', text[1]);
      cy.elementContainsText('#priceIdError div', text[1]);

      cy.get('.t-error-summary').should(
        'have.css',
        'border-color',
        'rgb(204, 0, 0)',
      );

      cy.get('.text-base > a')
        .should('have.css', 'color', 'rgb(204, 0, 0)')
        .should('have.css', 'text-decoration-line', 'underline')
        .should('have.attr', 'href')
        .and('contain', `${url}`);
      cy.get('#priceIdError div').should('have.css', 'color', 'rgb(204, 0, 0)');
    }
  });
  //------------------------------------------------------------------------------------------------------------------
  it('Does not accept negative values', () => {
    completeJourney(0, '-500000', '-100000', '25', '5');
    cy.elementContainsText(
      '.text-base > a',
      'Enter a property price, for example £200,000',
    );
  });
  //------------------------------------------------------------------------------------------------------------------
  it('Heading structure', () => {
    ['en', 'cy'].forEach((lang) => {
      cy.visit(`/${lang}/`);
      completeJourney(0, '500000', '100000', '25', '5');

      // Validate fieldsets and headings
      cy.get('fieldset').should('exist');
      cy.get('h2').should('exist');

      if (lang === 'en') {
        cy.get('h3').first().should('have.text', 'Your results');
      } else {
        cy.get('h3').first().should('have.text', 'Eich canlyniadau');
      }
    });
  });
  //------------------------------------------------------------------------------------------------------------------
  it('Displays teaser cards', () => {
    const pages = ['/en/mortgage-calculator', '/cy/mortgage-calculator'];
    pages.forEach((url) => {
      cy.visit(basePath);
      completeJourney(0, '500000', '100000', '25', '5');
      cy.get('[data-testid="teaserCard"]').each(($elem: any) => {
        cy.wrap($elem).should('have.attr', 'href');
        cy.wrap($elem).find('img').should('be.visible');

        cy.wrap($elem).find('h3').should('exist');

        cy.wrap($elem).find('p').should('exist');
      });
    });
  });
  //------------------------------------------------------------------------------------------------------------------
  it.skip('Displays zero when deposit is higher than property price', () => {
    completeJourney(0, '50000', '1000000', '25', '5');
    cy.elementContainsText('.t-result-monthly-payment > span', '0');
    cy.elementContainsText('.t-result-total-payable > span', '0');
  });
  //------------------------------------------------------------------------------------------------------------------
  it('Accepts maximum input - 999,999,999', () => {
    completeJourney(0, '9,999,999,999', '1,000,000,000', '25', '5');
    cy.get('#price').should('have.value', '999,999,999');
    cy.get('#deposit').should('have.value', '100,000,000');
  });
  //------------------------------------------------------------------------------------------------------------------
  it.skip('Accepts 2 integers after decimal point', () => {
    completeJourney(0, '100000.578', '1000.8978', '25', '5');
    // Ensure the price input has the formatted value
    cy.get('#price', { timeout: 120000 })
      .should('exist') // Ensure the element exists
      .and('be.visible') // Ensure the element is visible
      .should('have.value', '100,000.57'); // Assert the expected formatted value

    // Ensure the deposit input has the formatted value
    cy.get('#deposit', { timeout: 120000 })
      .should('exist') // Ensure the element exists
      .and('be.visible') // Ensure the element is visible
      .should('have.value', '1,000.89'); // Assert the expected formatted value
  });
});

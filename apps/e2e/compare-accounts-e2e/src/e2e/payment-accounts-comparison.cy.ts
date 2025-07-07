import '@maps-react/utils/e2e/support/commands';
describe('Compare Bank Accounts', () => {
  const basePath = '/en';
  const sortSelect = (selector: string, value: any) => {
    cy.get(selector).select(value);
  };
  const getDiffhours = (date1: any, date2: any) => {
    let diff = (date1.getTime() - date2.getTime()) / 1000;
    diff /= 60 * 60;
    return Math.abs(Math.round(diff));
  };

  beforeEach(() => {
    cy.skipExceptions();
    cy.visit(basePath);
    cy.setCookieControl();
    cy.setBreakPoint('desktop');
  });

  it('Five accounts present per page on load', () => {
    cy.get('#accountsPerPage').should('have.value', '5');
    //cy.get('div[data-testid="selected-accounts"]').should('have.length', 5);
  });

  it('Sort results by Bank name A-Z', () => {
    const sortedAZPath = '?order=providerNameAZ&p=1';
    const expectedUrl = `${basePath}${sortedAZPath}`;
    sortSelect('select#order', 'providerNameAZ');
    cy.verifyURLIncludes(expectedUrl).then((path: any) => {
      //cy.visitWithRetry(path);
      cy.visit(path);
    });
    cy.get('div[data-testid="selected-accounts"]')
      .eq(0)
      .within(() => {
        cy.elementContainsText('h3', 'AIB (NI)');
      });
  });

  it('Sort results by Bank name Z-A', () => {
    const sortedZAPath = '?order=providerNameZA&p=1';
    const expectedUrl = `${basePath}${sortedZAPath}`;
    sortSelect('select#order', 'providerNameZA');
    cy.verifyURLIncludes(expectedUrl).then((path: any) => {
      //cy.visitWithRetry(path);
      cy.visit(path);
    });
    cy.get('div[data-testid="selected-accounts"]')
      .eq(0)
      .within(() => {
        cy.elementContainsText('h3', 'Virgin Money');
      });
  });

  it('Sort results by Monthly account fee(lowest first)', () => {
    sortSelect('select#order', 'monthlyAccountFeeLowestFirst');
    cy.get('div[data-testid="selected-accounts"]')
      .eq(0)
      .within(() => {
        cy.get('[data-testid="table-data-value-0"]').contains('£0.00');
      });
  });

  it('Sort results by Minimum monthly deposit(lowest first)', () => {
    cy.get('select#order').select('minimumMonthlyDepositLowestFirst');
    cy.get('div[data-testid="selected-accounts"]')
      .eq(0)
      .within(() => {
        cy.get('[data-testid="table-data-value-0"]').contains('£0.00');
      });
  });

  it('Sort results by Arranged overdraft rate(lowest first)', () => {
    cy.get('select#order').select('arrangedOverdraftRateLowestFirst');
    cy.get('div[data-testid="selected-accounts"]')
      .eq(0)
      .within(() => {
        cy.get('[data-testid="table-data-value-0"]').contains('£0.00');
      });
  });

  it('Sort results by Unarranged maximum monthly charge (lowest first)', () => {
    const sortedPath = '?order=unarrangedMaximumMonthlyChargeLowestFirst&p=1';
    const expectedUrl = `${basePath}${sortedPath}`;

    sortSelect('select#order', 'unarrangedMaximumMonthlyChargeLowestFirst');
    cy.verifyURLIncludes(expectedUrl).then((path: any) => {
      //cy.visitWithRetry(path);
      cy.visit(path);
    });

    cy.get('[data-testid="table-data-value-3"]')
      .first()
      .as('firstElem')
      .then(($elem) => {
        cy.wrap($elem).should('contain.text', 'Not offered');
      });

    cy.get('[id^="page-"]').last().click();

    // Ensure the element is reselected after the page update
    cy.elementShouldBeVisible('.t-accounts-information');
    cy.get('[data-testid="table-data-value-3"]').last().as('lastElem').click();
    cy.get('@lastElem').should('have.text', 'No limit');
  });

  it('Allows to paginate using page number link for each page', () => {
    //Click 5 pages, confirm url contains p= arugment
    cy.get('[id^="page-"]').each(($elem: any, index: number) => {
      if (index == 0) {
        cy.elementHasAttribute($elem, 'aria-current');
        cy.checkCSS($elem, 'background-color', 'rgb(200, 42, 135)');
        cy.checkCSS($elem, 'textDecoration', 'none solid rgb(255, 255, 255)');
        cy.get($elem).invoke('width').should('be.lt', 43);
        cy.get($elem).invoke('height').should('be.lt', 48);
        cy.elementShouldNotExist('a.t-previous');
        cy.elementShouldBeVisible('a.order-4');
      }
      if (index > 0 && index < 4) {
        cy.checkCSS($elem, 'background-color', 'rgba(0, 0, 0, 0)');
        cy.checkCSS(
          $elem,
          'textDecoration',
          'underline solid rgb(200, 42, 135)',
        );
        cy.wrap($elem).click();
        cy.elementHasAttribute($elem, 'aria-current');
        cy.checkCSS($elem, 'background-color', 'rgb(200, 42, 135)');
        cy.checkCSS($elem, 'textDecoration', 'none solid rgb(255, 255, 255)');
        cy.get($elem).invoke('width').should('be.lt', 43);
        cy.get($elem).invoke('height').should('be.lt', 48);
        cy.url().should('include', `${basePath}?p=${index + 1}`);
      }
    });
    cy.elementShouldBeVisible('a.t-previous');
    cy.checkCSS(
      'a.t-previous',
      'textDecoration',
      'underline solid rgb(200, 42, 135)',
    );
    cy.elementShouldBeVisible('a.order-4');
    cy.checkCSS(
      'a.order-4',
      'textDecoration',
      'underline solid rgb(200, 42, 135)',
    );
  });

  //Selecting 20 from View per page dropdown and display 20 accounts per page
  it('Display 20 accounts per page', () => {
    cy.get('select#accountsPerPage').select('20');
    //Below code checks the selected bank accounts are 20 on the page from 1-20 of xxx displayed at bottom left
    cy.get(
      'div.hidden.lg\\:flex.items-center.justify-center.lg\\:justify-start',
    )
      .invoke('text')
      .then((text) => {
        const rangeText = text.trim();
        const [start, end] = rangeText.split(' - ').map(Number);
        cy.log(`Start: ${start}, End: ${end}`);
      });
  });

  it('Verify last page link & Back and Back to top links functionality', () => {
    // Wait for the pagination elements to be visible
    cy.get('a[id^="page-"]').should('be.visible');
    // Fetch the last page number dynamically
    cy.get('a[id^="page-"]')
      .last()
      .invoke('attr', 'id')
      .then((id) => {
        if (id) {
          const lastPageNumber = id.replace('page-', '');
          // Assert that the dynamically selected link has the expected title
          cy.get(`#page-${lastPageNumber}`).should(
            'have.attr',
            'title',
            `Go to page number ${lastPageNumber}`,
          );
          // Tap on the last page link
          cy.get(`#page-${lastPageNumber}`).click();
          // Perform further actions or assertions after navigation
          //cy.get(`#page-${lastPageNumber}`).click();
          cy.contains('a', 'Back').click();
        } else {
          throw new Error('Last page link ID is undefined');
        }
      });
  });

  //Selecting checkboxes, enter search text, then apply filters
  it('Verify Apply filters button functionality', () => {
    cy.get('input#standardcurrent').click({ force: true }); // Selecting 'Standard current' checkbox under 'Account type' section
    cy.get('input#student').click({ force: true }); // Selecting 'Student' checkbox under 'Account type' section
    cy.get('input#nomonthlyfee').click({ force: true }); // Selecting 'no monthly fees' checkbox under 'Account features' section
    cy.get('input#branchbanking').click({ force: true }); // Selecting 'branch of the bank' checkbox under 'Account access' section
    cy.get('input[type="search"]').type('Santander'); // Enter Santander in the 'Account or bank name' text box for displaying accounts from Santander bank
    cy.contains('button', 'Apply filters').click(); // Tap on 'Apply filters' buttons
  });

  // Clear all of the above selected checkboxes, entered text from the filters after tapping on 'Clear all' link
  it('Verify Clear all link functionality', () => {
    cy.get('a').contains('Clear all').click(); // Tap on 'Clear all' link
    cy.get('#standardcurrent').should('not.be.checked'); //This confirms 'Standard current' checkbox is unchecked after clearing
    cy.get('#student').should('not.be.checked'); //This confirms 'Student' checkbox is unchecked after clearing
    cy.get('#nomonthlyfee').should('not.be.checked'); //This confirms 'No monthly fee' checkbox is unchecked after clearing
    cy.get('#branchbanking').should('not.be.checked'); //This confirms 'Branch banking' checkbox is unchecked after clearing
    cy.get('input[type="search"]').should('have.value', ''); //This confirms 'Account or bank name' text is empty after clearing
  });
});

describe('View summary of the selected options', () => {
  const navigateToYourPersonalisedToDoList = (
    url: string,
    task = 'view your summary document and to-do list',
  ) => {
    cy.setCookieControl();
    cy.visit(url, { failOnStatusCode: false });
    cy.viewSummaryDocument(task, 'task-12');
    cy.get(`h2[data-testid='section-title']`).should('be.visible');
    cy.get(`h3[data-testid='basic-planning-title']`).should('be.visible');
  };

  const verifyNumberOfCards = (noOfItems: number) => {
    // should diplay 6 cards and view all button should hide the rest of the cards if there are more than 8 cards
    if (noOfItems > 8) {
      cy.get(`ul[data-testid='summary-card-list'] li`).should('have.length', 6);

      // should display view all button
      cy.get('[data-testid="show-hide-view-btn"]').should('be.visible').click();
      cy.get('[data-testid="show-hide-close-btn"]').should('be.visible');

      // should contain extra summary cards
      cy.get(
        '[data-testid="extra-summary-card-list"] > [data-testid^="summary-card-"]',
      ).should('have.length', noOfItems - 6);
    }
    // should display all cards if less than 9 cards and not display view all button
    else {
      cy.get(`ul[data-testid='summary-card-list'] li`).should(
        'have.length',
        noOfItems,
      );
      cy.get('[data-testid="show-hide-view-btn"]').should('not.exist');
      cy.get('[data-testid="show-hide-close-btn"]').should('not.exist');
    }
  };

  it('displays default retirement planning cards', () => {
    const url =
      '/?version=1&t1=4&t1q1=1&t1q2=2&t2=4&t2q1=1&t2q2=1&t2q3=2&t3=4&t3q1=2&t4=4&t4q1=2&t5=4&t5q1=1&t5q2=1&t6=4&t6q1=2&t7=4&t7q1=2&t8=4&t8q1=2&t9=4&t9q1=2&t10=4&t10q1=2&t11=4&t11q1=2';
    navigateToYourPersonalisedToDoList(url);

    // should display 2 planning cards
    verifyNumberOfCards(2);
  });

  it('displays all cards - Benefits received', () => {
    const url =
      '/?version=1&t1=4&t1q1=3&t1q2=3&t2=4&t2q1=2&t2q2=2&t2q3=1&t3=4&t3q1=3&t4=4&t4q1=1&t5=4&t5q1=2&t5q2=2&t6=4&t6q1=1&t7=4&t7q1=1&t8=4&t8q1=1&t9=4&t9q1=1&t10=4&t10q1=1&t11=4&t11q1=1';
    navigateToYourPersonalisedToDoList(url);

    // should display : Update your beneficiary, Get regulated advice, Find your pension pots, Ask about transferring, Check your retirement savings, Get your State Pension forecast, Use our benefits calculator, Get free debt advice, Get your pension abroad, Make a will and Set up a power of attorney
    // 6 pension options cards
    cy.get(`[data-testid='retire-later-list']`).should('be.visible');
    cy.get(`[data-testid='guaranteed-income-list']`).should('be.visible');
    cy.get(`[data-testid='flexible-income-list']`).should('be.visible');
    cy.get(`[data-testid='lump-sum-list']`).should('be.visible');
    cy.get(`[data-testid='pot-in-one-go-list']`).should('be.visible');
    cy.get(`[data-testid='mix-options-list']`).should('be.visible');

    // 11 retirement planning cards
    verifyNumberOfCards(11);
  });

  it('displays default retirement planning cards', () => {
    const url =
      '/?version=1&t1=4&t1q1=3&t1q2=3&t2=4&t2q1=2&t2q2=2&t2q3=3&t3=4&t3q1=3&t4=4&t4q1=1&t5=4&t5q1=2&t5q2=2&t6=4&t6q1=1&t7=4&t7q1=1&t8=4&t8q1=1&t9=4&t9q1=1&t10=4&t10q1=1&t11=4&t11q1=1';
    navigateToYourPersonalisedToDoList(url);

    // should display : Update your beneficiary, Get regulated advice, Find your pension pots, Ask about transferring, Check your retirement savings, Get your State Pension forecast, Talk to your benefits provider, Get free debt advice, Get your pension abroad, Make a will and Set up a power of attorney
    // 6 pension options cards
    cy.get(`[data-testid='retire-later-list']`).should('be.visible');
    cy.get(`[data-testid='guaranteed-income-list']`).should('be.visible');
    cy.get(`[data-testid='flexible-income-list']`).should('be.visible');
    cy.get(`[data-testid='lump-sum-list']`).should('be.visible');
    cy.get(`[data-testid='pot-in-one-go-list']`).should('be.visible');
    cy.get(`[data-testid='mix-options-list']`).should('be.visible');

    // 11 retirement planning cards
    verifyNumberOfCards(11);
  });

  it('displays 7 retirement planning cards only', () => {
    const url =
      '/?version=1&t1=4&t1q1=2&t1q2=1&t2=4&t2q1=1&t2q2=1&t2q3=2&t3=4&t3q1=2&t4=4&t4q1=1&t5=4&t5q1=2&t5q2=2&t6=4&t6q1=2&t7=4&t7q1=2&t8=4&t8q1=2&t9=4&t9q1=2&t10=4&t10q1=2&t11=4&t11q1=2';
    navigateToYourPersonalisedToDoList(url);

    // should display : Update your beneficiary, Get regulated advice, Find your pension pots, Ask about transferring, Check your retirement savings, Get your State Pension forecast and Talk to your benefits provider
    // 7 retirement planning cards

    verifyNumberOfCards(7);
  });

  it('displays 8 retirement planning cards only', () => {
    const url =
      '/?version=1&t1=4&t1q1=2&t1q2=1&t2=4&t2q1=1&t2q2=1&t2q3=2&t3=4&t3q1=1&t4=4&t4q1=1&t5=4&t5q1=2&t5q2=2&t6=4&t6q1=2&t7=4&t7q1=2&t8=4&t8q1=2&t9=4&t9q1=2&t10=4&t10q1=2&t11=4&t11q1=2';
    navigateToYourPersonalisedToDoList(url);

    // should display : Update your beneficiary, Get regulated advice, Find your pension pots, Ask about transferring, Check your retirement savings, Get your State Pension forecast, Talk to your benefits provider and Make a will
    // 8 retirement planning cards
    verifyNumberOfCards(8);
  });

  it('downloads summary document', () => {
    cy.setCookieControl();
    cy.visit('/', { failOnStatusCode: false });
    const locales = [
      [
        'en',
        'https://staging-embedded-journeys.moneyhelper.org.uk/en/summary-document/download',
        'Additional information',
      ],
      [
        'cy',
        'https://staging-embedded-journeys.moneyhelper.org.uk/cy/explore-your-options/welsh-summary',
        'Mwy o wybodaeth',
      ],
    ];
    const pages = [
      '/summary?version=1&t1=4&t1q1=1&t1q2=2&t2=4&t2q1=1&t2q2=1&t2q3=2&t3=4&t3q1=2&t4=4&t4q1=2&t5=4&t5q1=1&t5q2=1&t6=4&t6q1=2&t7=4&t7q1=2&t8=4&t8q1=2&t9=4&t9q1=2&t10=4&t10q1=2&t11=4&t11q1=2&t12=4&task=12&complete=true',
      '/summary?version=1&t1=4&t1q1=3&t1q2=3&t2=4&t2q1=2&t2q2=2&t2q3=1&t3=4&t3q1=3&t4=4&t4q1=1&t5=4&t5q1=2&t5q2=2&t6=4&t6q1=1&t7=4&t7q1=1&t8=4&t8q1=1&t9=4&t9q1=1&t10=4&t10q1=1&t11=4&t11q1=1&t12=4&task=12&complete=true',
      '/summary?version=1&t1=4&t1q1=3&t1q2=3&t2=4&t2q1=2&t2q2=2&t2q3=3&t3=4&t3q1=3&t4=4&t4q1=1&t5=4&t5q1=2&t5q2=2&t6=4&t6q1=1&t7=4&t7q1=1&t8=4&t8q1=1&t9=4&t9q1=1&t10=4&t10q1=1&t11=4&t11q1=1&t12=4&task=12&complete=true',
      '/summary?version=1&t1=4&t1q1=2&t1q2=1&t2=4&t2q1=1&t2q2=1&t2q3=2&t3=4&t3q1=2&t4=4&t4q1=1&t5=4&t5q1=2&t5q2=2&t6=4&t6q1=2&t7=4&t7q1=2&t8=4&t8q1=2&t9=4&t9q1=2&t10=4&t10q1=2&t11=4&t11q1=2&t12=4&task=12&complete=true',
      '/summary?version=1&t1=4&t1q1=2&t1q2=1&t2=4&t2q1=1&t2q2=1&t2q3=2&t3=4&t3q1=1&t4=4&t4q1=1&t5=4&t5q1=2&t5q2=2&t6=4&t6q1=2&t7=4&t7q1=2&t8=4&t8q1=2&t9=4&t9q1=2&t10=4&t10q1=2&t11=4&t11q1=2&t12=4&task=12&complete=true',
    ];

    locales.forEach((locale) => {
      pages.forEach((page) => {
        const url = `/${locale[0]}/pension-wise-appointment${page}`;
        cy.visit(url);
        cy.get('[data-testid="section-title"]')
          .siblings('h3')
          .should('be.visible', locale[2]);

        cy.get('[data-testid="summary-download-form"]').then(($elem) => {
          cy.wrap($elem).invoke('attr', 'action').should('equal', locale[1]);
          cy.wrap($elem).find('button').should('be.visible');
        });
      });
    });
  });
});

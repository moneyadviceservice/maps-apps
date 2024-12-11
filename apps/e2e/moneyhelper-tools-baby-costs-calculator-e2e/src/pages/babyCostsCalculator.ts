import bccData from '../fixtures/babyCostsCalculator.json';

export enum ESSENTIALS {
  cotBed = 'cot-cotbed',
  bedding = 'bedding',
  carSeat = 'car-seat',
  pram = 'pram',
  sterilisingEquipment = 's-equip',
  clothing = 'clothing',
  nappies = 'nappies',
  bottles = 'bottles',
}
export type EssentialKey = keyof typeof ESSENTIALS;

export enum NON_ESSENTIALS {
  changingTable = 'changing-table',
  babyMonitor = 'baby-monitor',
  babyMobile = 'mobile',
  roomThermometer = 'room-thermometer',
  nightLight = 'nightlight',
  travelCot = 'travel-cot',
  babyCarrier = 'b-s-carrier',
  changingBag = 'c-bag',
  playMat = 'playmat',
  babyBouncer = 'bouncer',
  rattles = 'rattles',
  breastPump = 'b-pumps',
  maternityBra = 'bras-pads',
  muslinCloth = 'muslins',
  nursingPillow = 'n-pillows',
  dummies = 'dummies',
  highchair = 'highchair',
  weaning = 'weaning',
  babyBath = 'b-bath',
  babyTowel = 'b-towel',
  bathThermometer = 'b-thermometer',
  babyGrooming = 'g-essentials',
}
export type NonEssentialKey = keyof typeof NON_ESSENTIALS;

export enum BabyBedroom {
  changingTable = 'changing-table',
  babyMonitor = 'baby-monitor',
  babyMobile = 'mobile',
  roomThermometer = 'room-thermometer',
  nightLight = 'nightlight',
}

export type BabyBedroomKey = keyof typeof BabyBedroom;

export enum TravelPlaytime {
  travelCot = 'travel-cot',
  babyCarrier = 'b-s-carrier',
  changingBag = 'c-bag',
  playMat = 'playmat',
  babyBouncer = 'bouncer',
  rattles = 'rattles',
}

export type TravelPlaytimeKey = keyof typeof TravelPlaytime;

export enum Feeding {
  breastPump = 'b-pumps',
  maternityBra = 'bras-pads',
  muslinCloth = 'muslins',
  nursingPillow = 'n-pillows',
  dummies = 'dummies',
  highchair = 'highchair',
  weaning = 'weaning',
}

export type FeedingKey = keyof typeof Feeding;

export enum ClothingBathingChanging {
  babyBath = 'b-bath',
  babyTowel = 'b-towel',
  bathThermometer = 'b-thermometer',
  babyGrooming = 'g-essentials',
}

export type ClothingBathingChangingKey = keyof typeof ClothingBathingChanging;

export enum SAVING_FREQUENCY {
  PER_DAY = '1',
  PER_WEEK = '7',
  PER_2_WEEKS = '14',
  PER_4_WEEKS = '28',
  PER_MONTH = '30',
}

export type EditJourney =
  | 'Essential Items'
  | "Baby's bedroom"
  | 'Travel and Playtime'
  | 'Feeding'
  | 'Clothing, bathing, and changing';

export class BabyCostCalculator {
  elements = {
    landingPageButton: () => cy.get('[data-testid="landing-page-button"]'),

    title: () => cy.get('[data-testid="toolpage-span-title"]'),
    tabs: () => cy.get('.t-step-navigation__button[role=tab]'),
    subHeading: () => cy.get('[data-testid="tab-container-div"] h1'),
    primaryInfo: () => cy.get('[data-testid="tab-container-div"] h1 ~ p'),
    selectDropdownLabel: () => cy.get('label[for="q-baby-due"]'),
    dropdown: () => cy.get('[data-testid="baby-due"]'),
    continue: () => cy.get('#continue'),

    getLabelForField: (id: string) => cy.get(`label[for="q-${id}"]`),
    getInputField: (id: string) => cy.get(`[data-testid=${id}]`),

    babyBedroom: () => cy.get('[data-testid="b-bedroom"]'),
    travelPlaytime: () => cy.get('[data-testid="t-and-p"]'),
    feeding: () => cy.get('[data-testid="feeding"]'),
    clothingBathingChanging: () => cy.get('[data-testid="clothing-bathing"]'),

    moreInfo: (title: string) => cy.get('summary').contains(title),

    budgetHeading: () => cy.get('[data-testid="tab-container-div"] h1'),
    budgetInfo: () => cy.get('[data-testid="tab-container-div"] h1 ~ p'),
    budgetSubHeading: () => cy.get('[data-testid="tab-container-div"] h1 ~ h2'),

    moneyLabel: () => cy.get('label[for="q-in-bank"]'),
    moneySecondaryLabel: () => cy.get('label[for="q-in-bank"] ~ span'),
    money: () => cy.get('[data-testid="in-bank"]'),

    savingLabel: () => cy.get('label[for="q-can-save"]'),
    savingInput: () => cy.get('[data-testid="can-save-i"]'),
    savingFrequency: () => cy.get('[data-testid="can-save-s"]'),

    summaryTitle: () => cy.get('[data-testid="summary-heading"]'),
    resultsSummaryTitle: () => cy.get('[data-testid="summary-heading"]'),
    summaryTable: () => cy.get('table'),

    resultsTitle: () => cy.get('h1'),
    resultsInfo: () => cy.get('[data-testid="callout-default"] p'),

    editButton: (groupName: EditJourney) =>
      cy.get('.sr-only').contains(groupName).parent(),

    saveButton: () => cy.get('a[type="button"]').contains('Save'),
    emailField: () => cy.get('#email'),
    saveAndReturn: () => cy.get('button[data-testid="save-and-return"]'),

    resetCalculator: () =>
      cy.get('button[type="submit"]').contains('Reset calculator'),
  };

  shouldHaveTabs(tabCount: number) {
    this.elements.tabs().should('have.length', tabCount);
  }

  selectDropdown(months: number) {
    this.elements
      .dropdown()
      .select(`${months} months`)
      .should('have.value', months);
  }

  selectedTab(tabName: string) {
    this.elements
      .tabs()
      .contains(tabName)
      .should('have.attr', 'aria-selected', 'true');
  }

  shouldCheckDescriptionFor(title: string, description: string) {
    this.elements.moreInfo(title).should('be.visible').click();

    this.elements
      .moreInfo(title)
      .parent()
      .parent()
      .children('.my-4')
      .should('have.text', description)
      .should('be.visible');

    this.elements.moreInfo(title).click();
  }

  enterValueFor(
    element: Cypress.Chainable<JQuery<HTMLElement>>,
    value: string,
  ) {
    element.clear().type(value);
  }

  enterEssentialsInfo(key: EssentialKey, value?: string) {
    if (ESSENTIALS[key] && value) {
      this.elements
        .getLabelForField(ESSENTIALS[key])
        .should('have.text', bccData.essentials[`${key}Label`]);

      this.shouldCheckDescriptionFor(
        bccData.essentials[`${key}MoreAbout`],
        bccData.essentials[`${key}Description`],
      );
      this.enterValueFor(this.elements.getInputField(ESSENTIALS[key]), value);
    }
  }

  expandSection(
    key:
      | 'babyBedroom'
      | 'travelPlaytime'
      | 'feeding'
      | 'clothingBathingChanging',
  ) {
    this.elements[key]().within((element) => {
      cy.wrap(element).should('be.visible');
      if (element.attr('open')) {
        return;
      }
      cy.get('> summary .block').click();
    });
  }

  expandSectionForField(key: NonEssentialKey) {
    let currentSection:
      | 'babyBedroom'
      | 'travelPlaytime'
      | 'feeding'
      | 'clothingBathingChanging';
    if (BabyBedroom[key]) {
      currentSection = 'babyBedroom';
    } else if (TravelPlaytime[key]) {
      currentSection = 'travelPlaytime';
    } else if (Feeding[key]) {
      currentSection = 'feeding';
    } else if (ClothingBathingChanging[key]) {
      currentSection = 'clothingBathingChanging';
    }
    this.expandSection(currentSection);
  }

  enterNonEssentialsInfo(key: NonEssentialKey, value?: string) {
    if (NON_ESSENTIALS[key] && value) {
      this.expandSectionForField(key);
      this.elements
        .getLabelForField(NON_ESSENTIALS[key])
        .should('have.text', bccData.nonEssentials[`${key}Label`]);

      this.expandSectionForField(key);

      this.shouldCheckDescriptionFor(
        bccData.nonEssentials[`${key}MoreAbout`],
        bccData.nonEssentials[`${key}Description`],
      );
      this.enterValueFor(
        this.elements.getInputField(NON_ESSENTIALS[key]),
        value,
      );
    }
  }

  checkBudgetHeading() {
    this.elements
      .budgetHeading()
      .should('be.visible')
      .should('have.text', bccData.yourBudget.title);
    this.elements
      .budgetInfo()
      .should('have.text', bccData.yourBudget.primaryInfo);
    this.elements
      .budgetSubHeading()
      .should('have.text', bccData.yourBudget.subHeading);
  }

  enterMoneyInBank(value: string) {
    this.elements
      .moneyLabel()
      .should('have.text', bccData.yourBudget.moneyLabel);
    this.elements
      .moneySecondaryLabel()
      .should('have.text', bccData.yourBudget.moneySecondaryLabel);
    this.shouldCheckDescriptionFor(
      bccData.yourBudget.moneyMoreAbout,
      bccData.yourBudget.moneyDescription,
    );
    this.elements.money().clear().type(value);
  }

  enterSavings(value: string, frequency: SAVING_FREQUENCY) {
    this.elements
      .savingLabel()
      .should('have.text', bccData.yourBudget.savingsLabel);
    this.shouldCheckDescriptionFor(
      bccData.yourBudget.savingsMoreAbout,
      bccData.yourBudget.savingsDescription,
    );

    this.elements.savingInput().clear().type(value);
    this.elements.savingFrequency().select(frequency);
  }

  checkSummary(
    months: number,
    essentials?: string,
    nonEssentials?: string,
    budget?: string,
    result?: number,
  ) {
    if (result) {
      this.elements
        .resultsSummaryTitle()
        .should('have.text', bccData.summary.resultSummaryTitle);
    } else {
      this.elements
        .summaryTitle()
        .should('have.text', bccData.summary.summaryTitle);
    }
    this.elements.summaryTable().within(() => {
      cy.get('tr')
        .eq(0)
        .should(
          'have.text',
          bccData.summary.babyDue.replace('%MONTHS%', months.toString()),
        );

      if (essentials) {
        cy.get('tr')
          .eq(1)
          .should(
            'have.text',
            bccData.summary.essentials.replace('%ESSENTIALS%', essentials),
          );
      }

      if (nonEssentials) {
        cy.get('tr')
          .eq(2)
          .should(
            'have.text',
            bccData.summary.nonEssentials.replace(
              '%NON-ESSENTIALS%',
              nonEssentials,
            ),
          );
      }

      if (budget) {
        cy.get('tr')
          .eq(3)
          .should(
            'have.text',
            bccData.summary.yourBudget.replace('%YOUR_BUDGET%', budget),
          );
      }

      if (result) {
        cy.get('tr')
          .eq(4)
          .should(
            'have.text',
            bccData.summary.result.replace(
              '%RESULT%',
              result.toLocaleString(undefined, {
                style: 'decimal',
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              }),
            ),
          );
      }
    });
  }

  validateResultsInfo(moneyLeft: number) {
    this.elements
      .resultsTitle()
      .should('be.visible')
      .should('have.text', bccData.results.title);
    this.elements
      .resultsInfo()
      .eq(0)
      .should('have.text', bccData.results.calloutTitle);
    this.elements
      .resultsInfo()
      .eq(1)
      .should('have.text', `£${moneyLeft.toLocaleString()}`);
    if (moneyLeft < 0) {
      this.elements
        .resultsInfo()
        .eq(2)
        .should(
          'have.text',
          bccData.results.calloutNegativeInfo.replace(
            '%MONEY_LEFT%',
            moneyLeft.toLocaleString(),
          ),
        );
    } else {
      this.elements
        .resultsInfo()
        .eq(2)
        .should(
          'have.text',
          bccData.results.calloutPositiveInfo.replace(
            '%MONEY_LEFT%',
            moneyLeft.toLocaleString(),
          ),
        );
    }
  }

  startEditJourney(key: EditJourney) {
    this.elements.editButton(key).click();
  }

  save() {
    this.elements.saveButton().click();
  }

  enterEmail(email: string) {
    this.elements.emailField().type(email);
  }

  sendEmail() {
    this.elements.saveAndReturn().click();
  }

  checkEmailPayload(payload: string) {
    cy.intercept(
      { method: 'POST', url: '/api/baby-costs-calculator/save-and-return' },
      (req) => {
        expect(req.body).to.equal(payload);
      },
    );
  }

  resetCalculator() {
    this.elements.resetCalculator().click();
  }
}

import bccData from '../fixtures/babyCostsCalculator.json';
import {
  BabyCostCalculator,
  EditJourney,
  EssentialKey,
  ESSENTIALS,
  NonEssentialKey,
  SAVING_FREQUENCY,
} from '../pages/babyCostsCalculator';

type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>;

type Essentials = PartialRecord<EssentialKey, string | undefined>;
type NonEssentials = PartialRecord<NonEssentialKey, string | undefined>;
interface TestScenario {
  label: string;
  months: number;
  essentials: Essentials;
  nonEssentials: NonEssentials;
  budget: {
    moneyInBank: string;
    saving: string;
    savingFrequency: string;
  };
  summary: {
    essentials: string;
    nonEssentials: string;
    yourBudget: string;
    result: number;
  };
}

interface EditTestScenario extends TestScenario {
  editJourney: string;
  updatedEssentials?: Essentials;
  updatedNonEssentials?: NonEssentials;
  updatedBudget?: {
    moneyInBank?: string;
    saving?: string;
    savingFrequency?: string;
  };
  updatedSummary: {
    essentials: string;
    nonEssentials: string;
    yourBudget: string;
    result: number;
  };
}

describe('Baby Costs Calculator', () => {
  beforeEach(() => {
    cy.skipExceptions();
    cy.setBreakPoint('desktop');
    cy.setCookieControl();
    cy.visit('/en/baby-cost-calculator');
  });

  const bccPage = new BabyCostCalculator();

  bccData.tests.forEach(
    ({
      label,
      months,
      essentials,
      nonEssentials,
      budget,
      summary,
    }: TestScenario) => {
      it(`Baby cost calculator ${label}`, () => {
        cy.url().should('include', bccData.dueDate.url);
        bccPage.elements.title().contains(bccData.dueDate.title);
        bccPage.selectedTab('Baby Due Date');
        bccPage.shouldHaveTabs(5);
        bccPage.elements.subHeading().contains(bccData.dueDate.subHeading);
        bccPage.elements.primaryInfo().contains(bccData.dueDate.primaryInfo);
        bccPage.elements
          .selectDropdownLabel()
          .contains(bccData.dueDate.selectDropdownLabel);
        bccPage.selectDropdown(months);
        bccPage.elements.continue().click();

        cy.url().should(
          'include',
          bccData.essentials.url.replace('%MONTHS%', months.toString()),
        );

        bccPage.elements
          .title()
          .should('be.visible')
          .contains(bccData.essentials.title);
        bccPage.selectedTab('Essential Items');
        bccPage.elements.subHeading().contains(bccData.essentials.subHeading);
        bccPage.elements.primaryInfo().contains(bccData.essentials.primaryInfo);
        bccPage.checkSummary(months);

        Object.keys(essentials).forEach((key) => {
          bccPage.enterEssentialsInfo(
            key as EssentialKey,
            essentials[key as EssentialKey],
          );
        });
        bccPage.checkSummary(months, summary.essentials);

        bccPage.elements.continue().click();

        const essentialsUrl = Object.keys(essentials).reduce((acc, key) => {
          return (
            acc +
            `&q-${ESSENTIALS[key as EssentialKey]}=${encodeURIComponent(
              parseFloat(
                essentials[key as EssentialKey] || '0',
              ).toLocaleString(),
            )}`
          );
        }, '');

        cy.url().should(
          'include',
          bccData.nonEssentials.url.replace('%MONTHS%', months.toString()) +
            essentialsUrl,
        );

        bccPage.selectedTab('Non-Essential Items');
        bccPage.elements
          .title()
          .should('be.visible')
          .contains(bccData.nonEssentials.title);
        bccPage.elements
          .primaryInfo()
          .contains(bccData.nonEssentials.primaryInfo);

        Object.keys(nonEssentials).forEach((key) => {
          bccPage.enterNonEssentialsInfo(
            key as NonEssentialKey,
            nonEssentials[key as NonEssentialKey],
          );
        });
        bccPage.elements.continue().click();

        bccPage.selectedTab('Your Budget');

        bccPage.checkBudgetHeading();
        bccPage.enterMoneyInBank(budget.moneyInBank);
        bccPage.enterSavings(
          budget.saving,
          budget.savingFrequency as SAVING_FREQUENCY,
        );

        bccPage.checkSummary(
          months,
          summary.essentials,
          summary.nonEssentials,
          summary.yourBudget,
        );

        bccPage.elements.continue().click();

        bccPage.selectedTab('Your Results');
        bccPage.validateResultsInfo(summary.result);
        bccPage.checkSummary(
          months,
          summary.essentials,
          summary.nonEssentials,
          summary.yourBudget,
          summary.result,
        );
      });
    },
  );

  bccData.editJourney.forEach(
    ({
      label,
      months,
      essentials,
      nonEssentials,
      budget,
      summary,
      ...editJourneyOptions
    }: EditTestScenario) => {
      it(`Should handle edit journey ${label}`, () => {
        bccPage.selectDropdown(months);
        bccPage.elements.continue().click();

        Object.keys(essentials).forEach((key) => {
          bccPage.enterEssentialsInfo(
            key as EssentialKey,
            essentials[key as EssentialKey],
          );
        });
        bccPage.elements.continue().click();

        Object.keys(nonEssentials).forEach((key) => {
          bccPage.enterNonEssentialsInfo(
            key as NonEssentialKey,
            nonEssentials[key as NonEssentialKey],
          );
        });
        bccPage.elements.continue().click();

        bccPage.checkBudgetHeading();
        bccPage.enterMoneyInBank(budget.moneyInBank);
        bccPage.enterSavings(
          budget.saving,
          budget.savingFrequency as SAVING_FREQUENCY,
        );

        bccPage.checkSummary(
          months,
          summary.essentials,
          summary.nonEssentials,
          summary.yourBudget,
        );
        bccPage.elements.continue().click();

        bccPage.checkSummary(
          months,
          summary.essentials,
          summary.nonEssentials,
          summary.yourBudget,
          summary.result,
        );

        const {
          editJourney,
          updatedEssentials,
          updatedNonEssentials,
          updatedSummary,
        } = editJourneyOptions;
        bccPage.startEditJourney(editJourney as EditJourney);

        if (editJourney === 'Essential Items') {
          bccPage.selectedTab(editJourney);
          if (updatedEssentials) {
            Object.keys(updatedEssentials).forEach((key) => {
              bccPage.enterEssentialsInfo(
                key as EssentialKey,
                updatedEssentials[key as EssentialKey],
              );
            });
          }
        } else {
          bccPage.selectedTab('Non-Essential Items');
          bccPage.elements.babyBedroom().should('be.visible');
          bccPage.elements.travelPlaytime().should('be.visible');
          bccPage.elements.feeding().should('be.visible');
          bccPage.elements.clothingBathingChanging().should('be.visible');
          if (updatedNonEssentials) {
            Object.keys(updatedNonEssentials).forEach((key) => {
              bccPage.enterNonEssentialsInfo(
                key as NonEssentialKey,
                updatedNonEssentials[key as NonEssentialKey],
              );
            });
          }
        }

        bccPage.elements.continue().click();

        bccPage.selectedTab('Your Results');
        bccPage.validateResultsInfo(updatedSummary.result);
        bccPage.checkSummary(
          months,
          updatedSummary.essentials,
          updatedSummary.nonEssentials,
          updatedSummary.yourBudget,
          updatedSummary.result,
        );
      });
    },
  );

  it('Should let user to save progress via email', () => {
    bccPage.selectDropdown(9);
    bccPage.elements.continue().click();

    bccPage.enterEssentialsInfo('sterilisingEquipment', '200');
    bccPage.enterEssentialsInfo('cotBed', '150');
    bccPage.enterEssentialsInfo('pram', '200');
    bccPage.elements.continue().click();

    bccPage.enterNonEssentialsInfo('playMat', '25');
    bccPage.enterNonEssentialsInfo('babyBath', '50');
    bccPage.enterNonEssentialsInfo('changingBag', '50');
    bccPage.enterNonEssentialsInfo('babyCarrier', '50');
    bccPage.elements.continue().click();

    bccPage.checkBudgetHeading();
    bccPage.enterMoneyInBank('500');
    bccPage.enterSavings('100', SAVING_FREQUENCY.PER_4_WEEKS);
    bccPage.elements.continue().click();

    bccPage.validateResultsInfo(739.29);
    bccPage.checkSummary(9, '£550.00', '£175.00', '£1,464.29', 739.29);

    bccPage.save();
    bccPage.enterEmail('abc@gmail.com');
    const payload =
      'isEmbed=false&language=en&toolBaseUrl=%2Fen%2Fbaby-cost-calculator%2F&tab=5&savedData=%7B%22q-baby-due%22%3A%229%22%2C%22q-cot-cotbed%22%3A%22150%22%2C%22q-pram%22%3A%22200%22%2C%22q-s-equip%22%3A%22200%22%2C%22q-b-s-carrier%22%3A%2250%22%2C%22q-c-bag%22%3A%2250%22%2C%22q-playmat%22%3A%2225%22%2C%22q-b-bath%22%3A%2250%22%2C%22q-in-bank%22%3A%22500%22%2C%22q-can-save-i%22%3A%22100%22%2C%22q-can-save-s%22%3A%2228%22%7D&validation=&lastTab=&email=abc%40gmail.com';
    bccPage.checkEmailPayload(payload);

    bccPage.sendEmail();
  });

  it('Should let user verify error message for invalid email', () => {
    cy.intercept(
      'POST',
      '/api/baby-costs-calculator/save-and-return',
      (req) => {
        req.reply((res) => {
          res.send({});
        });
      },
    ).as('saveAndReturn');

    bccPage.selectDropdown(9);
    bccPage.elements.continue().click();

    bccPage.enterEssentialsInfo('sterilisingEquipment', '200');
    bccPage.elements.continue().click();
    bccPage.elements.continue().click();
    bccPage.elements.continue().click();
    bccPage.save();

    // Enter an invalid email
    bccPage.enterInvalidEmailAndSubmit();

    // Check for error message
    cy.wait('@saveAndReturn').then(() => {
      bccPage.checkErrForInvalidEmail();
    });
  });

  it('Should reset calculator to the beginning', () => {
    bccPage.selectDropdown(9);
    bccPage.elements.continue().click();

    bccPage.enterEssentialsInfo('sterilisingEquipment', '200');
    bccPage.enterEssentialsInfo('cotBed', '150');
    bccPage.enterEssentialsInfo('pram', '200');
    bccPage.elements.continue().click();

    bccPage.enterNonEssentialsInfo('playMat', '25');
    bccPage.enterNonEssentialsInfo('babyBath', '50');
    bccPage.enterNonEssentialsInfo('changingBag', '50');
    bccPage.enterNonEssentialsInfo('babyCarrier', '50');
    bccPage.elements.continue().click();

    bccPage.checkBudgetHeading();
    bccPage.enterMoneyInBank('500');
    bccPage.enterSavings('100', SAVING_FREQUENCY.PER_4_WEEKS);
    bccPage.elements.continue().click();

    bccPage.validateResultsInfo(739.29);
    bccPage.checkSummary(9, '£550.00', '£175.00', '£1,464.29', 739.29);

    bccPage.resetCalculator();
    cy.url().should('include', '/en/baby-cost-calculator/1?restart=true');
  });
});

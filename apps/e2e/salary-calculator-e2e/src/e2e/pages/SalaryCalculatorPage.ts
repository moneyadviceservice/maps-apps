import { expect, Locator, Page } from '@playwright/test';
export class SalaryCalculatorPage {
  constructor(private page: Page) {}

  // Disable cookie consent by clicking the reject button or mocking the API endpoint
  static async disableCookieConsent(page: Page): Promise<void> {
    // First, try to route/block the cookie API endpoint (works for local)
    await page.route('**/c/v**', (route) => {
      return route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: '',
      });
    });

    // Also handle cookie banner if it appears (works for remote environments)
    // Wait a moment for the banner to appear
    try {
      const cookieBanner = page.locator('#ccc-notify');
      await cookieBanner.waitFor({ state: 'visible', timeout: 3000 });

      // Click "Reject marketing cookies" button
      const rejectButton = page.locator('#ccc-notify-reject');
      await rejectButton.click();

      // Wait for the banner to disappear
      await cookieBanner.waitFor({ state: 'hidden', timeout: 3000 });
    } catch (error) {
      // Cookie banner didn't appear or already handled - continue
      console.log('Cookie banner not detected or already dismissed');
    }
  }

  //For selecting calculation mode: 'single' or 'joint'
  async selectCalculationMode(mode: 'single' | 'joint') {
    if (mode === 'joint') {
      const testId = 'joint-calculation-radio';
      const radio = this.page.getByTestId(testId);
      const label = radio.locator('..');
      await label.click();
      await expect(radio).toBeChecked();
    } else {
      const testId = 'single-calculation-radio';
      const radio = this.page.getByTestId(testId);
      const label = radio.locator('..');
      await label.click();
      await expect(radio).toBeChecked();
    }
  }

  //Entering gross salary (supports both single and comparison mode)
  async enterGrossIncome(value: string, salaryNumber: 1 | 2 = 1) {
    const testId = salaryNumber === 1 ? 'gross-income' : 'gross-income-2';
    await this.page.getByTestId(testId).fill(value);
  }

  //Selecting salary frequency as 'annual' or 'monthly' or 'weekly' or 'daily' or 'hourly'
  async selectIncomeFrequency(
    option: 'annual' | 'monthly' | 'weekly' | 'daily' | 'hourly',
    salaryNumber: 1 | 2 = 1,
  ) {
    const testId =
      salaryNumber === 1
        ? 'gross-income-frequency'
        : 'gross-income-frequency-2';
    const dropdown = this.page.getByTestId(testId);
    await dropdown.selectOption(option);
  }

  //For entering number of working days between 1 and 7 when user selects frequency as 'Weekly'
  async enterDaysPerWeek(days: number, salaryNumber: 1 | 2 = 1) {
    if (days < 1 || days > 7) {
      throw new Error('Days per week must be between 1 and 7');
    }
    const testId = salaryNumber === 1 ? 'days-per-week' : 'days-per-week-2';
    const input = this.page.getByTestId(testId);
    await input.fill(days.toString());
    await expect(input).toHaveValue(days.toString());
  }

  //For number of hours
  async enterHoursPerWeek(hours: number, salaryNumber: 1 | 2 = 1) {
    if (hours < 1 || hours > 168) {
      throw new Error('Hours per week must be between 1 and 168');
    }
    const testId = salaryNumber === 1 ? 'hours-per-week' : 'hours-per-week-2';
    const input = this.page.getByTestId(testId);
    await input.fill(hours.toString());
    await expect(input).toHaveValue(hours.toString());
  }

  //For selecting Scotland Checkbox
  async toggleScotlandCheckbox(enable: boolean, salaryNumber: 1 | 2 = 1) {
    const testId =
      salaryNumber === 1 ? 'checkbox-scotland' : 'checkbox-scotland-2';
    const label = this.page.locator(`[data-testid="${testId}"]`).locator('..');

    const checkbox = this.page.getByTestId(testId);
    const isChecked = await checkbox.isChecked();

    if (enable && !isChecked) {
      await label.click();
      await expect(checkbox).toBeChecked();
    } else if (!enable && isChecked) {
      await label.click();
      await expect(checkbox).not.toBeChecked();
    }
  }

  //For entering tax Code
  async enterTaxCode(code: string, salaryNumber: 1 | 2 = 1) {
    const testId = salaryNumber === 1 ? 'tax-code' : 'tax-code-2';
    await this.page.getByTestId(testId).fill(code);
  }

  //For expanding the 'Add more information' section
  async expandSummaryBlock(salaryNumber: 1 | 2 = 1) {
    const buttons = this.page.locator('[data-testid="button-filters"]');
    const count = await buttons.count();
    if (count === 1) {
      // Single calculation mode - only one button
      await buttons.click();
    } else {
      // Comparison mode - click the specific button (0-indexed)
      await buttons.nth(salaryNumber - 1).click();
    }
  }

  //For entering Pension percent or amount under 'Add more information' section
  async enterPensionPercent(percent: string, salaryNumber: 1 | 2 = 1) {
    const testId = salaryNumber === 1 ? 'pension-percent' : 'pension-percent-2';
    const input = this.page.getByTestId(testId);
    await input.fill(percent);
    await expect(input).toHaveValue(percent);
  }

  async enterPensionFixed(amount: string, salaryNumber: 1 | 2 = 1) {
    const testId = salaryNumber === 1 ? 'pension-fixed' : 'pension-fixed-2';
    const input = this.page.getByTestId(testId);
    await input.fill(amount);
    await expect(input).toHaveValue(amount);
  }

  //For selecting Student Loan checkbox(es) under 'Add more information' section
  async selectStudentLoanPlans(plans?: string[], salaryNumber: 1 | 2 = 1) {
    if (!plans || plans.length === 0) {
      return;
    }

    for (const planTestId of plans) {
      // Add suffix for salary 2 if needed
      const testId = salaryNumber === 2 ? `${planTestId}-2` : planTestId;
      const checkbox = this.page.getByTestId(testId);
      const isChecked = await checkbox.isChecked();

      if (!isChecked) {
        // Click the label associated with the hidden checkbox
        const label = checkbox.locator('..');
        await label.click();
        await expect(checkbox).toBeChecked();
      }
    }
  }

  //For 'Are you over State Pension Age' under 'Add more information' section
  // Note: Uses id attribute instead of data-testid because salary 2 elements
  // only have id attribute (salary2_state-pension-*) in the DOM
  async selectStatePension(option?: 'yes' | 'no', salaryNumber: 1 | 2 = 1) {
    if (!option) {
      // Nothing selected (user wants none)
      return;
    }

    const testId =
      salaryNumber === 1
        ? `state-pension-${option}`
        : `salary2_state-pension-${option}`;
    const radio = this.page.locator(`#${testId}`);
    const isChecked = await radio.isChecked();

    if (!isChecked) {
      const label = this.page.locator(`label[for="${testId}"]`);
      await label.click();
      await expect(radio).toBeChecked();
    }
  }

  // For "Do you get the Blind Person's Allowance?" radio buttons options under 'Add more information' section
  // Note: Uses id attribute instead of data-testid because salary 2 elements
  // only have id attribute (salary2_blind-persons-*) in the DOM
  async selectBlindPerson(option: 'yes' | 'no', salaryNumber: 1 | 2 = 1) {
    const testId =
      salaryNumber === 1
        ? `blind-persons-${option}`
        : `salary2_blind-persons-${option}`;
    const radio = this.page.locator(`#${testId}`);
    const isChecked = await radio.isChecked();

    if (!isChecked) {
      const label = this.page.locator(`label[for="${testId}"]`);
      await label.click();
      await expect(radio).toBeChecked();
    }
  }

  //For tapping on Calculate or Recalculate button
  async clickCalculate(mode: 'single' | 'joint' = 'single') {
    const calculateId = `calculate-button-${mode}`;
    const recalculateId = `recalculate-button-${mode}`;

    const calcButtons = this.page.getByTestId(calculateId);
    const recalcButtons = this.page.getByTestId(recalculateId);

    // Helper to find the first visible element from a locator list
    const getFirstVisible = async (
      locator: Locator,
    ): Promise<Locator | null> => {
      const count = await locator.count();
      for (let i = 0; i < count; i++) {
        const el = locator.nth(i);
        if (await el.isVisible().catch(() => false)) {
          return el;
        }
      }
      return null;
    };

    const recalcVisible = await getFirstVisible(recalcButtons);
    const calcVisible = await getFirstVisible(calcButtons);

    const button = recalcVisible || calcVisible;

    if (!button) {
      throw new Error(
        `No visible calculate/recalculate button found for mode: ${mode}`,
      );
    }

    await button.waitFor({ state: 'visible' });
    await button.scrollIntoViewIfNeeded();
    await button.click();
  }

  // Verify results breakdown table matches expected values
  // Based on actual HTML structure: <select> dropdown + <table> with breakdown rows

  async verifyBreakdownSections(
    expected?: Record<string, Record<string, string>>,
  ) {
    if (!expected) return;

    // Wait for results section to appear
    const resultsSection = this.page.locator('[data-testid="results-section"]');
    await expect(resultsSection).toBeVisible();

    // Map section names to select dropdown values
    const frequencyMap: Record<string, string> = {
      'Annual Breakdown': 'yearly',
      'Monthly Breakdown': 'monthly',
      'Weekly Breakdown': 'weekly',
      'Daily Breakdown': 'daily',
    };

    // Map test labels to actual HTML labels (case-insensitive patterns)
    const labelMap: Record<string, string> = {
      'Income tax': 'Tax \\(Income Tax\\)',
      'Student loan repayment': 'Student Loan',
      'National insurance': 'National Insurance',
    };

    // Frequency dropdown ONLY inside results section
    // Get the results table (scoped to results section)
    const table = resultsSection.locator('table:visible').first();
    await expect(table).toBeVisible();

    for (const [sectionName, fields] of Object.entries(expected)) {
      // Skip "Example Calculation" as it's not in the breakdown table
      if (sectionName === 'Example Calculation') {
        continue;
      }

      // Select the appropriate frequency if it's a breakdown section
      const frequency = frequencyMap[sectionName];
      if (frequency) {
        const frequencySelect = this.page.locator(
          'select[aria-label="Select frequency to display results"]:visible',
        );
        await expect(frequencySelect).toBeVisible();
        await frequencySelect.selectOption(frequency);
      }

      // Verify each field
      for (const [label, expectedValue] of Object.entries(fields)) {
        // Special case: "Net salary" is in the heading, not the table
        if (label.toLowerCase().includes('net salary')) {
          const takeHomeHeading = resultsSection.locator('h3').first();
          // Strip £ and make commas optional in the pattern
          const valuePattern = expectedValue
            .replace(/£/g, '')
            .replace(/,/g, ',?');
          await expect(takeHomeHeading).toContainText(
            new RegExp(valuePattern, 'i'),
          );
          continue;
        }

        // Map the label to actual HTML text if needed
        const actualLabel = labelMap[label] || label;

        // Find the table row containing the label
        const row = table.locator('tr', {
          hasText: new RegExp(actualLabel, 'i'),
        });

        // Skip if row does not exist for this frequency
        if ((await row.count()) === 0) {
          console.warn(
            `Row not found for label "${actualLabel}" at frequency "${frequency}"`,
          );
          continue;
        }
        // Get the value cell (second column)
        const valueCell = row.locator('td').last();

        // Strip £ and make commas optional in the pattern
        const valuePattern = expectedValue
          .replace(/£/g, '')
          .replace(/,/g, ',?');
        await expect(valueCell).toContainText(new RegExp(valuePattern, 'i'));
      }
    }
  }

  // For verifying comparison results table(Verifying monthly take home pay of Salary 1 & Salary 2)
  async verifyComparisonTable(expected?: {
    salary1?: Record<string, string>;
    salary2?: Record<string, string>;
  }) {
    if (!expected) return;

    const comparisonSection = this.page.locator('#results-comparison');
    await expect(comparisonSection).toBeVisible();

    //const table = comparisonSection.locator('table');
    const table = comparisonSection
      .locator('table:visible')
      .filter({ hasNot: this.page.getByTestId('urgent-callout') })
      .first();
    await expect(table).toBeVisible();

    // Map expected keys to actual row labels
    const categoryMap: Record<string, string> = {
      'Monthly net salary': 'Take home pay',
      'Gross income': 'Gross income',
      'Personal allowance': 'Personal allowance',
      'Total deductions': 'Total deductions',
      'Pension contributions': 'Pension contributions',
      'Student loan': 'Student loan',
      'Tax (Income Tax)': 'Tax (Income Tax)',
      'National Insurance': 'National Insurance',
    };

    // Helper to verify a specific column
    const verifyColumn = async (
      expectedData: Record<string, string>,
      columnIndex: number,
    ) => {
      for (const [category, expectedValue] of Object.entries(expectedData)) {
        const rowLabel = categoryMap[category];

        // ⭐ Match ONLY the label cell, not the whole row
        const labelCell = table.locator('td span', { hasText: rowLabel });

        await expect(labelCell).toBeVisible();

        // ⭐ Move from the label cell to its parent row
        const row = labelCell.locator('xpath=ancestor::tr[1]');

        // Now get the correct salary cell
        const cell = row.locator('td').nth(columnIndex);

        await expect(cell).toHaveText(expectedValue);

        console.log(`✔ Verified ${category} → ${expectedValue}`);
      }
    };

    // Salary 1 → column index 1
    if (expected.salary1) {
      await verifyColumn(expected.salary1, 1);
    }

    // Salary 2 → column index 2
    if (expected.salary2) {
      await verifyColumn(expected.salary2, 2);
    }
  }
}
